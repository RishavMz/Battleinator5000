import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Chunk } from './src/chunk';
import { Player } from './src/player';
import { Point, QuadTree } from './src/quadtree';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2048);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#main') });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(10);
camera.position.setY(5);
renderer.render(scene, camera);

//const gridHelper = new THREE.GridHelper(1000,1000);
//scene.add(gridHelper); 
const controls = new OrbitControls(camera, renderer.domElement);

const points = [];
let nearby = [];
let score = 0;
const SWORDRANGE = 15;
let health = 100;
let sword = 0;
document.getElementById('label1').innerHTML= `SCORE : ${score} <br/> HEALTH : ${health}` ;

const chunk = new Chunk(scene, 0, 0, 1024);
chunk.draw();

const qtree = new QuadTree(scene, 0, 0, 1024);

const player = new Player(scene, qtree, chunk, 0, 400);
player.draw();

//let nearbyLookup = 0;

function animate() {
  requestAnimationFrame(animate);

  //if(nearbyLookup == 1) {
  //  for(let i=0; i<nearby.length; i++) {
  //    if(nearby[i].data.position.y >0){
  //      nearby[i].data.position.y -= 1;
  //    } else {
  //      nearbyLookup = 0;
  //      break;
  //    }
  //  }
  //}
  for(let i=0; i<nearby.length; i++) {
    nearby[i].move();
    if((Math.sqrt(Math.pow(player.posx-nearby[i].posx,2)+Math.pow(player.posz-nearby[i].posz,2))<=5)){
      health -= 1;
      document.getElementById('label1').innerHTML= `SCORE : ${score} <br/> HEALTH : ${health}` ;
    }
  }
  if(sword===0) {
    scene.remove(player.sword);
  } else if(sword>0) {
    sword--;
  }
  
  player.move();
  controls.update();
  renderer.render(scene, camera);
}
animate();

for(let i=0; i<25; i++) {
  let temp = new Point(scene, qtree, i, Math.random()*1024 - 512, Math.random()*1024 - 512);
  temp.draw();
  qtree.insert(temp);
  points.push(temp);
}
//qtree.draw();
console.log(qtree);


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
      scene.add(player.sword);
      sword = 10;
      if(Math.sqrt(Math.pow(player.posx-nearby[i].posx,2)+Math.pow(player.posz-nearby[i].posz,2))<=SWORDRANGE){
        const id = nearby[i].id;
        qtree.remove(nearby[i]);
        scene.remove(nearby[i].data)
        let newpt = new Point(scene, qtree, id, Math.random()*1024 - 512, Math.random()*1024 - 512);
        qtree.insert(newpt);
        newpt.draw();
        score++;
      }
    }
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
  //nearbyLookup = 1;
  //let temp = points[points.length-1];
  //qtree.remove(temp);
  //scene.remove(temp.data);
  //temp = null;
  //points.pop(points.length -1);
}