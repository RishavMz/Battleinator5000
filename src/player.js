import * as THREE from 'three';

class Sword{
  constructor(){
    this.tool = new THREE.Mesh(new THREE.SphereGeometry(7.5, 100, 50), new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true}));
    this.range = 14;
  }
}
class Axe{
  constructor(){
    this.tool = new THREE.Mesh(new THREE.CylinderGeometry(12, 12, 3, 100 ), new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true}));
    this.range = 17
  }
}
class Polearm{
  constructor(){
    this.tool = new THREE.Mesh(new THREE.CylinderGeometry(15, 12, 1, 100 ), new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true}));
    this.range = 20
  }
}

export class Player {
  constructor(scene, quadtree, chunk, posx, posz) {
    this.scene = scene;
    this.chunk = chunk;
    this.posx = posx;
    this.posz = posz;
    this.quadtree = quadtree;
    this.accz = -0.5;
    this.accx = -0.5;
    this.decn = 0.005;
    this.velz = 0;
    this.velx = 0;
    this.range = 128;
    
    this.player = new THREE.Mesh(new THREE.SphereGeometry(1, 100, 100), new THREE.MeshBasicMaterial({color: 0xffffff}));
    this.playerrange = new THREE.Mesh(new THREE.BoxGeometry(this.range, 10, this.range, 5, 5, 5), new THREE.MeshBasicMaterial({color: 0x7bff00, wireframe: true}));

    const w1 = new Sword();
    const w2 = new Axe();
    const w3 = new Polearm();
    this.weapons = [w1, w2, w3];
    this.weapon = 0;
    this.scene.add(this.player);

  }
  draw() {
    this.player.position.x = this.posx;
    this.player.position.z = this.posz;
    this.playerrange.position.x = this.posx;
    this.playerrange.position.z = this.posz;
    this.weapons.forEach(e => { e.tool.position.x = this.posx; e.tool.position.z = this.posz; })
    this.scene.position.z -= this.posz;
    this.scene.position.x -= this.posx;
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
    if(this.chunk.contains(this.player.position.z + this.velz, this.player.position.x + this.velx)) {

      this.posx += this.velx;
      this.posz += this.velz;
      this.player.position.z += this.velz;
      this.player.position.x += this.velx;
      this.playerrange.position.z += this.velz;
      this.playerrange.position.x += this.velx;
      this.weapons.forEach(e => { e.tool.position.x += this.velx; e.tool.position.z += this.velz; })
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
  getNearPoints() {
    return this.quadtree.squareContains(this.posx, this.posz, this.range, []);
  }
  changeWeapon(data) {
    this.weapon = (this.weapon+data)%this.weapons.length;
    if(this.weapon<0){
      this.weapon = this.weapons.length+this.weapon;
    }
    console.log(this.weapon);
  }
  
}
