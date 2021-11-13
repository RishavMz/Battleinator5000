import '../style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import io from "socket.io-client";
import { Chunk } from './chunk';
import { Player } from './player';
import { Point, QuadTree } from './quadtree';
import { Tree, Grass } from './objects';

const BACKEND = "ws://127.0.0.1:5000";

export class Game{
  constructor(email, username){
    this.email = email;
    this.username = username;
    this.animate = this.animate.bind(this);
    this.onDocumentKeyUp = this.onDocumentKeyUp.bind(this);
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
            <div class="inventory" id="inventory">
              <div class="invitem" ><img class = "invimg" id="item0" src="https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/sword.png"/></div>
              <div class="invitem" ><img class = "invimg" id="item1" src="https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/axe.png"></div>
              <div class="invitem" ><img class = "invimg" id="item2" src="https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/polearm.png"/></div>
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
    this.nearby = [];
    this.weaponmove = 0;
    this.pointanimate = 0;
    this.ENV = 'prod';
    this.TREE_COUNT = 10;
    this.ENEMY_COUNT = 20;

    this.chunk = new Chunk(this.scene, 0, 0, 1024);
    this.chunk.draw();
    this.qtree = new QuadTree(this.scene, 0, 0, 1024);
    this.player = new Player(this.scene, this.qtree, this.chunk, '', 0, 400);
    this.player.draw();
    this.scene.add(this.player.weapons[this.player.weapon].tool);
    document.getElementById('label1').innerHTML= `SCORE : ${this.player.score} <br/> HEALTH : ${this.player.health}` ;
    document.getElementById(`item0`).style.borderColor="gold";

    for(let i=0; i<this.TREE_COUNT; i++) {
      let tree = new Tree(this.scene, Math.random()*1024 - 512, Math.random()*1024 - 512);
      tree.draw();
    }
    for(let i=0; i<this.TREE_COUNT; i++) {
      let tree = new Grass(this.scene, Math.random()*1024 - 512, Math.random()*1024 - 512);
      tree.draw();
    }
    for(let i=0; i<this.ENEMY_COUNT; i++) {
      let temp = new Point(this.scene, this.qtree, i, Math.random()*1024 - 512, Math.random()*1024 - 512);
      temp.draw();
      this.qtree.insert(temp);
    }

    document.addEventListener("keydown", this.onDocumentKeyDown, false);
    document.addEventListener("keyup", this.onDocumentKeyUp, false);

    if(this.ENV === 'dev'){
      this.qtree.draw();
      console.log(this.qtree);
      this.scene.add(this.player.playerrange);
    }
    let stateCheck = setInterval(() => { 
      if (document. readyState === 'complete') {
         clearInterval(stateCheck); 
          document.getElementById('label1').style.display='block';
          document.getElementById('label2').style.display='block';
          document.getElementById('inventory').style.display='block';
        } 
      }, 100);  
      if(this.ENV === 'dev'){
        javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
      }

      //this.socket.emit('destroyed', 'point_id');
      this.socket.on('points', (data)=>{
        const pts= "list of points";
      });
      this.socket.on('data', (data)=>{
        console.log(data);
      })
  }

  animate() {
    requestAnimationFrame(this.animate);
  
    //redefine this thing to be accessed from server
    this.pointanimate = (this.pointanimate+1)%100;
    if(this.pointanimate%10 == 0){
      for(let i=0; i<this.nearby.length; i++) {
        this.nearby[i].move();
        if((Math.sqrt(Math.pow(this.player.posx-this.nearby[i].posx,2)+Math.pow(this.player.posz-this.nearby[i].posz,2))<=10)){
          document.getElementById('label1').innerHTML= `SCORE : ${this.player.score} <br/> HEALTH : ${this.player.health--}` ;
        }
      }
    }
    if(this.pointanimate%5 == 0 && this.player.walking == 1){
      this.player.leg1.rotation.x = (this.player.leg1.rotation.x+0.1)%0.6;
      this.player.leg2.rotation.x = (this.player.leg1.rotation.x+0.1)%0.6;
    }
    
    if(this.weaponmove-->0){ this.player.player.rotation.y += THREE.Math.degToRad(60);  }
    
    this.player.move();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
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
    for(let i=0; i<this.nearby.length; i++) {
      this.weaponmove = 6;
      if(Math.sqrt(Math.pow(this.player.posx-this.nearby[i].posx,2)+Math.pow(this.player.posz-this.nearby[i].posz,2))<=this.player.weapons[this.player.weapon].range){
        const id = this.nearby[i].id;
        // To be removed from all
        this.qtree.remove(this.nearby[i]);
        this.scene.remove(this.nearby[i].data)
        let newpt = new Point(this.scene, this.qtree, id, Math.random()*1024 - 512, Math.random()*1024 - 512);
        // To be inserted into all
        this.qtree.insert(newpt);
        newpt.draw();
        document.getElementById('label1').innerHTML= `SCORE : ${this.player.score++} <br/> HEALTH : ${this.player.health}` ;
        if(this.ENV === 'dev'){
          this.qtree.draw()
          console.log(this.qtree);
          }
        }
      }
    } else if(keyCode == 69) {
      document.getElementById(`item${this.player.weapon}`).style.borderColor="black";
      this.scene.remove(this.player.weapons[this.player.weapon].tool);
      this.player.changeWeapon(-1);  
      this.scene.add(this.player.weapons[this.player.weapon].tool);
      document.getElementById(`item${this.player.weapon}`).style.borderColor="gold";
    } else if(keyCode == 82) {
      document.getElementById(`item${this.player.weapon}`).style.borderColor="black";
      this.scene.remove(this.player.weapons[this.player.weapon].tool);
      player.changeWeapon(1);  
      this.scene.add(this.player.weapons[this.player.weapon].tool);
      document.getElementById(`item${this.player.weapon}`).style.borderColor="gold";
    } else if(keyCode == 84) {
      let div = document.getElementById('label2');
      if(div.style.display === 'block') {
        div.style.display = 'none';
      } else {
        div.style.display = 'block';
      }
    }
  }
  onDocumentKeyUp(event) {
    this.nearby = this.player.getNearPoints();
  }

  gameover(){
    this.socket.close();
    cancelAnimationFrame(this.animate);
  }
}
