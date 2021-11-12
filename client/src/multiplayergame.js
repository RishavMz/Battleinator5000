import '../style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import io from "socket.io-client";
import { Chunk } from './chunk';
import { Player } from './player';
import { Tree, Grass } from './objects';

const BACKEND = "ws://127.0.0.1:5000";

export class Multiplayer{
  constructor(email, username){
    this.email = email;
    this.username = username;
    this.animate = this.animate.bind(this);
    this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
    this.backend = BACKEND;
    this.socket = io(this.backend, { reconnectionDelayMax: 10000, auth: { email: this.email , username: this.username }});


    document.getElementById('root').innerHTML = `
            <div class="label1" id="label1"></div>
            <div class="label2" id="label2">
              <center><h2>Tutorial</h2></center>
              <ul>
                <li>w : Accelerate forward</li>
                <li>s : Accelerate backward</li>
                <li>a : Accelerate leftward</li>
                <li>d : Accelerate rightward</li>
                <li>e : Previous Weapon</li>
                <li>r : Next Weapon</li>
                <li>space : Attack objects within range</li>
                <li>t : Toggle tutorial on/off</li>
              </ul>
              <br/>
              PRESS ANY KEY TO START
            </div>
            <canvas id="main"></canvas>`;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2048);
    this.renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#main') });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.position.setZ(25);
    this.camera.position.setY(15);
    this.renderer.render(this.scene, this.camera);

    //this.gridHelper = new THREE.GridHelper(1000,1000);
    //this.scene.add(gridHelper); 
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.ENV = 'prod';
    this.TREE_COUNT = 10;
    this.ENEMY_COUNT = 20;
    this.pointanimate = 0;
    this.players = [];
    this.playermap = {};

    this.chunk = new Chunk(this.scene, 0, 0, 1024);
    this.chunk.draw();
    this.player = new Player(this.scene, this.qtree, this.chunk, Math.random()*1024 - 512, Math.random()*1024 - 512);
    this.scene.add(this.player.weapons[0].tool);
    this.player.draw();
    this.socket.emit('joined', {id: this.player.id, posx: this.player.posx, posz: this.player.posz});
    this.playermap[this.player.id] = this.player;
    document.getElementById('label1').innerHTML= `SCORE : ${this.player.score} <br/> HEALTH : ${this.player.health}` ;

    document.addEventListener("keydown", this.onDocumentKeyDown, false);
    document.addEventListener("keyup", this.onDocumentKeyUp, false);


    let stateCheck = setInterval(() => { 
      if (document. readyState === 'complete') {
         clearInterval(stateCheck); 
          document.getElementById('label1').style.display='block';
          document.getElementById('label2').style.display='block';
        } 
      }, 100);  
      if(this.ENV === 'dev'){
        javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
      }

      //this.socket.emit('destroyed', 'point_id');
      this.socket.on('joined', (data)=>{
          this.players.push(data);
          console.log("Joined", data);
          if(data.id != this.player.id){
            let player = new Player(this.scene, this.qtree, this.chunk, data.posx, data.posz);
            player.id = data.id;
            this.playermap[player.id] = player;
            player.multiplayerdraw();
          }  
      })
      this.socket.on('players', (data)=>{
          //console.log(data)
        if(this.players.length === 1){
            data['id'].forEach((e)=>{
                if(this.player.id !== e.id){
                    let player = new Player(this.scene, this.qtree, this.chunk, e.posx, e.posz);
                    player.id = e.id;
                    this.playermap[player.id] = player;
                    this.players.push(data);
                    player.multiplayerdraw();
                }
            });
        } else {
            data['id'].forEach((e)=>{
                if(this.player.id !== e.id){
                    this.playermap[e.id].forcemove(e.posx, e.posz);
                }
            });
        }
      });     
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.pointanimate%=100000;
    if(this.pointanimate%5 == 0 && this.player.walking == 1){
      this.player.leg1.rotation.x = (this.player.leg1.rotation.x+0.1)%0.6;
      this.player.leg2.rotation.x = (this.player.leg1.rotation.x+0.1)%0.6;
    }    
    this.player.move();
    if(this.pointanimate%50 === 0){
        this.socket.emit('move', {id: this.player.id, posx: this.player.posx, posz: this.player.posz}); 
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.pointanimate++;
  }


  onDocumentKeyDown(event) {
    var keyCode = event.which;
    //console.log(keyCode)
  if (keyCode == 87 ) { 
    this.player.forward();     
    this.player.walking = 1;   
  } else if (keyCode == 83 ) {
    this.player.backward();
    this.player.walking = 1;   
  } else if (keyCode == 65 ) {
    this.player.left();
    this.player.walking = 1;  
  } else if (keyCode == 68 ) {
    this.player.right();
    this.player.walking = 1;  
  } else if (keyCode == 32) {
      console.log("Pressed",this.pointanimate)
      
        document.getElementById('label1').innerHTML= `SCORE : ${this.player.score++} <br/> HEALTH : ${this.player.health}` ;

    } else if(keyCode == 84) {
      let div = document.getElementById('label2');
      if(div.style.display === 'block') {
        div.style.display = 'none';
      } else {
        div.style.display = 'block';
      }
    }
  }

  gameover(){
    this.socket.close();
    cancelAnimationFrame(this.animate);
  }
}
