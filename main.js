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
camera.position.setZ(200);
camera.position.setY(1005);
renderer.render(scene, camera);

//const gridHelper = new THREE.GridHelper(1000,1000);
//scene.add(gridHelper); 
const controls = new OrbitControls(camera, renderer.domElement);

const points = [];
let nearby = [];

const chunk = new Chunk(scene, 0, 0, 1024);
chunk.draw();

const qtree = new QuadTree(scene, 0, 0, 1024);

const player = new Player(scene, qtree, chunk, 0, 400);
player.draw();

let nearbyLookup = 0;

function animate() {
  requestAnimationFrame(animate);

  if(nearbyLookup == 1) {
    for(let i=0; i<nearby.length; i++) {
      if(nearby[i].data.position.y >0){
        nearby[i].data.position.y -= 1;
      } else {
        nearbyLookup = 0;
        break;
      }
    }
  }
  
  player.move();
  controls.update();
  renderer.render(scene, camera);
}
animate();

for(let i=0; i<25; i++) {
  let temp = new Point(scene, i, Math.random()*1024 - 512, Math.random()*1024 - 512);
  temp.draw();
  qtree.insert(temp);
  points.push(temp);
}
qtree.draw();
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

  }
}

function onDocumentKeyUp(event) {
  nearby = player.getNearPoints();
  nearbyLookup = 1;
  let temp = points[points.length-1];
  qtree.remove(temp);
  scene.remove(temp.data);
  //console.log(temp.data)
  temp = null;
  points.pop(points.length -1);
  console.log(qtree)
}