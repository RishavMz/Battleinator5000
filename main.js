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
camera.position.setZ(0);
camera.position.setY(1000);
renderer.render(scene, camera);

//const gridHelper = new THREE.GridHelper(1000,1000);
//scene.add(gridHelper); 
const controls = new OrbitControls(camera, renderer.domElement);

const chunk = new Chunk(scene, 0, 0, 1024);
chunk.draw();
const player = new Player(scene, chunk, 0, 0);
player.draw();


function animate() {
  requestAnimationFrame(animate);

  player.move();
  controls.update();
  renderer.render(scene, camera);
}
animate();

const qtree = new QuadTree(scene, 0, 0, 1024);
for(let i=0; i<200; i++) {
  let temp = new Point(scene, Math.random()*1024 - 512, Math.random()*1024 - 512);
  temp.draw();
  qtree.insert(temp);
}
console.log(qtree)
qtree.draw();


document.addEventListener("keydown", onDocumentKeyDown, false);
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
  }
}