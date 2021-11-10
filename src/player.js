import * as THREE from 'three';
const texture = new THREE.TextureLoader();

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
    
      const head_img = texture.load('../resources/player_head.png');
      const body_img = texture.load('../resources/player_body.png');
      const limb_img = texture.load('../resources/player_limb.png');
      const metal_img = texture.load('../resources/player_metal.png');
      const head = new THREE.Mesh(new THREE.SphereGeometry(1.5, 100, 100), new THREE.MeshBasicMaterial({map: head_img}));
      const body = new THREE.Mesh(new THREE.CylinderGeometry(2, 1, 5, 100,100, false), new THREE.MeshBasicMaterial({map: body_img}));
      const neck = new THREE.Mesh(new THREE.SphereGeometry(2, 100, 100,0, 720, 0, 1), new THREE.MeshBasicMaterial({map: head_img}));
      const hand11 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.3, 4, 100,100, false), new THREE.MeshBasicMaterial({map: limb_img}));
      const hand12 = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.3, 5, 100,100, false), new THREE.MeshBasicMaterial({map: metal_img}));
      const hand21 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.3, 4, 100,100, false), new THREE.MeshBasicMaterial({map: limb_img}));
      const hand22 = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.3, 5, 100,100, false), new THREE.MeshBasicMaterial({map: metal_img}));
      const skirt = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.8, 3, 100,100, false), new THREE.MeshBasicMaterial( {map: metal_img}));
      const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.3, 5, 100,100, false), new THREE.MeshBasicMaterial({map: metal_img}));
      const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.3, 5, 100,100, false), new THREE.MeshBasicMaterial({map: metal_img}));
      hand11.position.x = 3;
      hand11.position.y = 0.8;
      hand12.position.y = -0.5;
      hand12.position.z = 1.3;
      hand12.position.x = 4.5;
      hand21.position.x = -3;
      hand21.position.y = 0.8;
      hand22.position.y = -0.8;
      hand22.position.z = 1.3;
      hand22.position.x = -4.5;
      hand11.rotation.z = THREE.Math.degToRad(45);
      hand12.rotation.x = THREE.Math.degToRad(90);
      hand21.rotation.z = THREE.Math.degToRad(-45);
      hand22.rotation.x = THREE.Math.degToRad(90);
      skirt.position.y = -2.5;
      leg1.position.y = -6;
      leg2.position.y = -6;
      leg1.position.x = 1;
      leg2.position.x = -1;
      leg1.position.z =  0.1;
      leg2.position.z = -0.1;
      leg2.rotation.x = 0.5;
      neck.position.y = 1;
      head.position.y = 4;
      this.player = new THREE.Group();
      this.player.add(head, body, neck, hand11, hand12, hand21, hand22, skirt, leg1, leg2);
      this.player.position.x = this.posx;
      this.player.position.z = this.posz;
      this.player.rotation.y = THREE.Math.degToRad(180);
      this.leg1 = leg1;
      this.leg2 = leg2;
      this.body = body;

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
