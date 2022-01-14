import '../style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import io from "socket.io-client";
import { Chunk } from './chunk';
import { Player } from './player';
import { Tree, Grass } from './objects';

const BACKEND = "ws://127.0.0.1:5000";

export class Multiplayer{
  constructor( username, texture){
    this.username = username;
    this.animate = this.animate.bind(this);
    this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
    this.backend = BACKEND;
    this.texture = texture;
    this.socket = io(this.backend, { reconnectionDelayMax: 10000, auth: { username: this.username }});


    document.getElementById('root').innerHTML = `
            <div class="label1" id="label1"></div>
            <div class="label2" id="label2">
              <center><h2>Tutorial</h2></center>
              <ul>
                <li>w : Accelerate forward</li>
                <li>s : Accelerate backward</li>
                <li>a : Turn left</li>
                <li>d : Turn right</li>
                <li>space : Throw projectile</li>
                <li>t : Toggle tutorial on/off</li>
              </ul>
              <br/>
              PRESS ANY KEY TO START
            </div>
            <div class="chat">
              <div class="chatsend" id="chatsend">
                <div class="messages" id="messages"></div>
                <form id="messageform">
                <input type="text" id="chatmessage"/>
                <button type="submit" id="chatsender">SEND</button>
                <form>
              </div>
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
    this.pointanimate = 0;
    this.players = [];
    this.playermap = {};
    this.radius = 25;
    this.angle = 1.3;
    this.rotator = 0.05;
    this.bullet = 0;

    this.chunk = new Chunk(this.scene, 0, 0, 1024, this.texture, 10);
    this.chunk.draw();
    this.chunk.drawObjects();
    this.player = new Player(this.scene, this.qtree, this.chunk, this.username, Math.random()*1024 - 512, Math.random()*1024 - 512, this.texture);
    //this.scene.add(this.player.weapons[0].tool);
    this.player.draw();
    this.socket.emit('joined', {id: this.player.id, username: this.player.username, posx: this.player.posx, posz: this.player.posz, health: this.player.health});
    this.playermap[this.player.id] = this.player;
    document.getElementById('label1').innerHTML= `SCORE : ${this.player.score} <br/> HEALTH : ${this.player.health}` ;

    document.addEventListener("keydown", this.onDocumentKeyDown, false);
    document.addEventListener("keyup", this.onDocumentKeyUp, false);
    document.getElementById('messageform').onsubmit= (e)=>{
      e.preventDefault();
      const message = document.getElementById('chatmessage').value;
      if(message.length >0 ){
        this.socket.emit('chatmessage', {sender: this.player.username, message: message});
      }
      document.getElementById('chatmessage').value = "";
    }

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
          //console.log("Joined", data);
          if(data.id != this.player.id){
            let player = new Player(this.scene, this.qtree, this.chunk, data.username, data.posx, data.posz, this.texture);
            player.id = data.id;
            this.playermap[player.id] = player;
            player.multiplayerdraw();
          }  
      })
      this.socket.on('players', (data)=>{
        if(this.players.length === 1){
            data['id'].forEach((e)=>{
                if(this.player.id !== e.id){
                    let player = new Player(this.scene, this.qtree, this.chunk, e.username, e.posx, e.posz, this.texture);
                    player.id = e.id;
                    this.playermap[player.id] = player;
                    this.players.push(e);
                    player.multiplayerdraw();
                }
            });
        } else {
            data['id'].forEach((e)=>{
                if(this.player.id !== e.id){
                    this.playermap[e.id].multiplayermove(e.posx, e.posz);
                }
            });
        }
      });
      this.socket.on('chatmessage', (data)=> {
        let st = "";
        for(let i=0; i<data.length; i++){
          st = st + `<b>${data[i][0]}</b> : ${data[i][1]}<br/>`;
        }
        document.getElementById('messages').innerHTML = st;
      }) 
      this.socket.on('disconnected', (data)=> {
        alert("You have been disconnected for a period of inactivity.");
        location.reload();
      })     
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.chunk.water.rotation.z += 0.001;
    this.pointanimate%=100000;
    if(this.pointanimate%5 == 0 && this.player.walking == 1){
      this.player.leg1.rotation.x = (this.player.leg1.rotation.x+0.1)%0.6;
      this.player.leg2.rotation.x = (this.player.leg1.rotation.x+0.1)%0.6;
    }    
    this.player.move();
    this.players.forEach((e)=>{
      if(e.id !== this.player.id){
        this.playermap[e.id].multiplayermover();
      }
    });

    if(this.bullet === 1){
      this.player.bullet.move();
      if(this.player.bullet.posy<=-10){
        this.bullet = 0;
      }
    }    

    if(this.pointanimate%50 === 0){
        this.socket.emit('move', {id: this.player.id, username: this.player.username, posx: this.player.posx, posz: this.player.posz}); 
    }
    this.camera.position.x = this.radius * Math.cos( this.angle );  
    this.camera.position.z = this.radius * Math.sin( this.angle );

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.pointanimate++;
  }


  onDocumentKeyDown(event) {
    var keyCode = event.which;
    this.socket.emit('heartbeat',{});
    //console.log(keyCode)
  if (keyCode == 87 ) { 
    this.player.forward(this.player.acc*Math.sin(this.angle),this.player.acc* Math.cos(-this.angle));     
    this.player.walking = 1;   
  } else if (keyCode == 83 ) {
    this.player.forward(-this.player.acc*Math.sin(this.angle),-this.player.acc* Math.cos(-this.angle));     
    this.player.walking = 1;   
  } else if (keyCode == 65 ) {
    this.angle -= this.rotator; 
    this.player.player.rotateY(this.rotator);
  } else if (keyCode == 68 ) {
    this.angle += this.rotator; 
    this.player.player.rotateY(-this.rotator);
  }else if (keyCode == 32) {
      if(this.player.bulletloaded === 1){
        this.scene.add(this.player.bullet.data);
        this.bullet = 1;
        this.player.bullet.moveTo(this.player.player.position.x, 5, this.player.player.position.z);
        this.player.bullet.forward(5*Math.sin(this.angle),5* Math.cos(-this.angle));
      }
  } else if (keyCode == 77) {
      //console.log("Pressed",this.pointanimate)
      
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
