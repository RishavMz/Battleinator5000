import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {Game} from './src/game';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#main') });
const texture = new THREE.TextureLoader();

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(64);
camera.position.setY(4);
renderer.render(scene, camera);

//const gridHelper = new THREE.GridHelper(1000,1000);
//scene.add(gridHelper); 

const controls = new OrbitControls(camera, renderer.domElement);

const game = new Game(scene, texture, 128, 20);
game.addObstacles();
game.addBots();


function animate() {
  requestAnimationFrame(animate);


  game.moveBots();
  controls.update();
  renderer.render(scene, camera);
}
animate();

