import * as THREE from 'three';

export class Player {
  constructor(scene, posx, posz) {
    this.scene = scene;
    this.posx = posx;
    this.posz = posz;
    this.accz = -0.5;
    this.accx = -0.5;
    this.decn = 0.01;
    this.velz = 0;
    this.velx = 0;
  }
  draw() {
    const player = new THREE.Mesh(new THREE.SphereGeometry(1, 100, 100), new THREE.MeshBasicMaterial({color: 0xffffff}));
    this.data = player;
    player.position.x += this.posx;
    player.position.z += this.posz;
    this.scene.add(player);
  }
  forward() {
    this.velz = this.accz;
  }
  backward() {
    this.velz = -this.accz;
  }
  left() {
    this.velx = this.accx;
  }
  right() {
    this.velx = -this.accx;

  }
  move() {
    this.data.position.z += this.velz;
    this.data.position.x += this.velx;
    this.scene.position.z -= this.velz;
    this.scene.position.x -= this.velx;
    if(this.velz !== 0){
      this.velz += this.velz>0?-this.decn:this.decn;
    }
    if(this.velx !== 0){
      this.velx += this.velx>0?-this.decn:this.decn;
    }
  }
}