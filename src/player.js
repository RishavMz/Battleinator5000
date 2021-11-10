import * as THREE from 'three';

class Blast{
  constructor(){
    this.tool = new THREE.Mesh(new THREE.SphereGeometry(7.5, 100, 50), new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true}));
    this.range = 15;
  }
}
class GroundBlast{
  constructor(){
    this.tool = new THREE.Mesh(new THREE.CylinderGeometry(12, 12, 2, 100 ), new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true}));
    this.range = 18
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

    const w1 = new Blast();
    const w2 = new GroundBlast();
    this.weapons = [w1, w2];
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
  changeWeapon() {
    this.weapon = (this.weapon+1)%this.weapons.length;
  }
  
}
