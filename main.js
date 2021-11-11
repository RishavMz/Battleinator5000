import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Chunk } from './src/chunk';
import { Player } from './src/player';
import { Point, QuadTree } from './src/quadtree';
import { Tree, Grass } from './src/objects';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2048);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#main') });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(25);
camera.position.setY(15);
renderer.render(scene, camera);

//const gridHelper = new THREE.GridHelper(1000,1000);
//scene.add(gridHelper); 
const controls = new OrbitControls(camera, renderer.domElement);

let nearby = [];
let score = 0;
let health = 100;
let weaponmove = 0;
let pointanimate = 0;
const ENV = 'prod';
const TREE_COUNT = 10;
const ENEMY_COUNT = 20;

document.getElementById('label1').innerHTML= `SCORE : ${score} <br/> HEALTH : ${health}` ;
document.getElementById(`item0`).style.borderColor="gold";


const chunk = new Chunk(scene, 0, 0, 1024);
chunk.draw();

const qtree = new QuadTree(scene, 0, 0, 1024);

const player = new Player(scene, qtree, chunk, 0, 400);
player.draw();
scene.add(player.weapons[player.weapon].tool);


function animate() {
  requestAnimationFrame(animate);

  pointanimate = (pointanimate+1)%100;
  if(pointanimate%10 == 0){
    for(let i=0; i<nearby.length; i++) {
      nearby[i].move();
      if((Math.sqrt(Math.pow(player.posx-nearby[i].posx,2)+Math.pow(player.posz-nearby[i].posz,2))<=10)){
        health -= 1;
        document.getElementById('label1').innerHTML= `SCORE : ${score} <br/> HEALTH : ${health}` ;
      }
    }
  }
  if(pointanimate%15 == 0){
    player.leg1.rotation.x = (player.leg1.rotation.x+0.1)%0.6;
    player.leg2.rotation.x = (player.leg1.rotation.x+0.1)%0.6;
    //player.body.rotation.y = (player.body.rotation.y+0.1)%0.2-0.2;

  }
  
  
  if(weaponmove-->0){
    player.player.rotation.y += THREE.Math.degToRad(60);
  }
  
  player.move();
  controls.update();
  renderer.render(scene, camera);
}
animate();

for(let i=0; i<TREE_COUNT; i++) {
  let tree = new Tree(scene, Math.random()*1024 - 512, Math.random()*1024 - 512);
  tree.draw();
}
for(let i=0; i<TREE_COUNT; i++) {
  let tree = new Grass(scene, Math.random()*1024 - 512, Math.random()*1024 - 512);
  tree.draw();
}

for(let i=0; i<ENEMY_COUNT; i++) {
  let temp = new Point(scene, qtree, i, Math.random()*1024 - 512, Math.random()*1024 - 512);
  temp.draw();
  qtree.insert(temp);
}

if(ENV === 'dev'){
  qtree.draw();
  console.log(qtree);
  scene.add(player.playerrange);
}



document.addEventListener("keydown", onDocumentKeyDown, false);
document.addEventListener("keyup", onDocumentKeyUp, false);

function onDocumentKeyDown(event) {
    var keyCode = event.which;
    //console.log(keyCode)
  if (keyCode == 87 ) { 
    player.forward();        
  } else if (keyCode == 83 ) {
    player.backward();
  } else if (keyCode == 65 ) {
    player.left();
  } else if (keyCode == 68 ) {
    player.right();
  } else if (keyCode == 32) {
    for(let i=0; i<nearby.length; i++) {
      weaponmove = 6;
      if(Math.sqrt(Math.pow(player.posx-nearby[i].posx,2)+Math.pow(player.posz-nearby[i].posz,2))<=player.weapons[player.weapon].range){
        const id = nearby[i].id;
        qtree.remove(nearby[i]);
        scene.remove(nearby[i].data)
        let newpt = new Point(scene, qtree, id, Math.random()*1024 - 512, Math.random()*1024 - 512);
        qtree.insert(newpt);
        newpt.draw();
        score++;
        document.getElementById('label1').innerHTML= `SCORE : ${score} <br/> HEALTH : ${health}` ;
        if(ENV === 'dev'){
          qtree.draw()
        }
      }
    }
  } else if(keyCode == 69) {
    document.getElementById(`item${player.weapon}`).style.borderColor="black";
    scene.remove(player.weapons[player.weapon].tool);
    player.changeWeapon(-1);  
    scene.add(player.weapons[player.weapon].tool);
    document.getElementById(`item${player.weapon}`).style.borderColor="gold";
  } else if(keyCode == 82) {
    document.getElementById(`item${player.weapon}`).style.borderColor="black";
    scene.remove(player.weapons[player.weapon].tool);
    player.changeWeapon(1);  
    scene.add(player.weapons[player.weapon].tool);
    document.getElementById(`item${player.weapon}`).style.borderColor="gold";
  } else if(keyCode == 84) {
    let div = document.getElementById('label2');
    if(div.style.display === 'block') {
      div.style.display = 'none';
    } else {
      div.style.display = 'block';
    }
  }
}

function onDocumentKeyUp(event) {
  nearby = player.getNearPoints();
}

let stateCheck = setInterval(() => { 
  if (document. readyState === 'complete') {
     clearInterval(stateCheck); 
      document.getElementById('label1').style.display='block';
      document.getElementById('label2').style.display='block';
      document.getElementById('inventory').style.display='block';
      document.getElementById('loader').style.display='none';
    } 
  }, 100);  


  if(ENV === 'dev'){
    javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
  }

