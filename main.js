import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Chunk } from './src/chunk';
import { Player } from './src/player'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1024);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#main') });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(20);
camera.position.setY(5);
renderer.render(scene, camera);

//const gridHelper = new THREE.GridHelper(1000,1000);
//scene.add(gridHelper); 
const controls = new OrbitControls(camera, renderer.domElement);

const ch = new Chunk(scene, 0, 0, 1024);
ch.draw();
const player = new Player(scene, 0, 0);
player.draw();


function animate() {
  requestAnimationFrame(animate);

  player.move();
  controls.update();
  renderer.render(scene, camera);
}
animate();



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