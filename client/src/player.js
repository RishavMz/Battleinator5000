import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const texture = new THREE.TextureLoader();
const floader = new FontLoader();
const head_img = texture.load('https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/player_head.png');
const body_img = texture.load('https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/player_body.png');
const limb_img = texture.load('https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/player_limb.png');
const metal_img = texture.load('https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/player_metal.png');
      
const bark_image = texture.load('https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/tree_bark.png');

class Sword{
  constructor(){
    this.tool = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0, 10, 100 ), new THREE.MeshBasicMaterial({map: metal_img}));
    this.range = 14;
    this.holder = 5;
    this.tool.position.y = -0.8;
    this.tool.position.z = this.holder;
    this.tool.position.x = -4.5;
    this.tool.rotation.x = THREE.Math.degToRad(90);
    this.tool.rotation.z += THREE.Math.degToRad(180);
  }
}
class Axe{
  constructor(){
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 10, 100 ), new THREE.MeshBasicMaterial({map: bark_image}));
    const head = new THREE.Mesh(new THREE.SphereGeometry(2, 50, 50 ), new THREE.MeshBasicMaterial({map: metal_img}));
    head.position.z = 0;
    head.position.y = -4;
    this.tool = new THREE.Group();
    this.tool.add(handle, head);
    this.range = 17
    this.holder = 6;
    this.tool.position.y += -0.8;
    this.tool.position.z += this.holder;
    this.tool.position.x += -4.5;
    this.tool.rotation.x += THREE.Math.degToRad(90);
    this.tool.rotation.z += THREE.Math.degToRad(180);

  }
}
class Polearm{
  constructor(){
    this.tool = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.2, 20, 100 ), new THREE.MeshBasicMaterial({map: bark_image}));
    this.range = 20;
    this.holder = 8;
    this.tool.position.y = -0.8;
    this.tool.position.z = this.holder;
    this.tool.position.x = -4.5;
    this.tool.rotation.x = THREE.Math.degToRad(90);
    this.tool.rotation.z += THREE.Math.degToRad(180);
  }
}

export class Bullet {
  constructor(scene, posx, posy, posz){
    this.scene = scene;
    this.posx = posx;
    this.posy = posy;
    this.posz = posz;
    this.velx = 0;
    this.vely = 1;
    this.velz = 0;
    this.data = new THREE.Mesh(new THREE.SphereBufferGeometry(2, 10, 10), new THREE.MeshBasicMaterial({color: 0xffffff}));
    this.data.position.x = this.posx;
    this.data.position.y = this.posy;
    this.data.position.z = this.posz;
  }
  forward(velz, velx) {
    this.velz = velz;
    this.velx = velx;
  }
  move(){
    this.posx = this.posx - this.velx;
    this.posy = this.posy - this.vely;
    this.posz = this.posz - this.velz;
    this.data.position.x = this.posx;
    this.data.position.y = this.posy;
    this.data.position.z = this.posz;  
  }
  moveTo(posx, posy, posz){
    this.posx = posx;
    this.posy = posy;
    this.posz = posz;
    this.data.position.x = this.posx;
    this.data.position.y = this.posy;
    this.data.position.z = this.posz;  
  }
}

export class Player {
  constructor(scene, quadtree, chunk, username, posx, posz, texture) {
    this.id = Math.floor(Math.random()*100000);
    this.username = username;
    this.scene = scene;
    this.chunk = chunk;
    this.posx = posx;
    this.posz = posz;
    this.newposx = posx;
    this.newposz = posz;
    this.quadtree = quadtree;
    this.texture = texture;
    this.acc = -0.5;
    this.accz = -0.5;
    this.accx = -0.5;
    this.decn = 0.005;
    this.velz = 0;
    this.velx = 0;
    this.range = 128;
    this.walking = 0;
    const w1 = new Sword();
    const w2 = new Axe();
    const w3 = new Polearm();
    this.weapons = [w1, w2, w3];
    this.weapon = 0;
    this.score = 0;
    this.health = 100;
    this.bullet = new Bullet(this.scene, this.posx, 20, this.posz);
    this.bulletloaded = 1;
    
      const head = new THREE.Mesh(new THREE.SphereBufferGeometry(1.5, this.texture, this.texture), new THREE.MeshBasicMaterial({map: head_img}));
      const body = new THREE.Mesh(new THREE.CylinderBufferGeometry(2, 1, 5, this.texture,this.texture, false), new THREE.MeshBasicMaterial({map: body_img}));
      const neck = new THREE.Mesh(new THREE.SphereBufferGeometry(2, this.texture,this.texture,0, 72, 0, 1), new THREE.MeshBasicMaterial({map: head_img}));
      const hand1 = new THREE.Mesh(new THREE.CylinderBufferGeometry(0.5, 0.3, 4, this.texture,this.texture, false), new THREE.MeshBasicMaterial({map: limb_img}));
      const hand2 = new THREE.Mesh(new THREE.CylinderBufferGeometry(0.5, 0.3, 4, this.texture,this.texture, false), new THREE.MeshBasicMaterial({map: limb_img}));
      const skirt = new THREE.Mesh(new THREE.CylinderBufferGeometry(1, 1.8, 3, this.texture,this.texture, false), new THREE.MeshBasicMaterial( {map: metal_img}));
      const leg1 = new THREE.Mesh(new THREE.CylinderBufferGeometry(0.5, 0.3, 5, this.texture,this.texture, false), new THREE.MeshBasicMaterial({map: metal_img}));
      const leg2 = new THREE.Mesh(new THREE.CylinderBufferGeometry(0.5, 0.3, 5, this.texture,this.texture, false), new THREE.MeshBasicMaterial({map: metal_img}));
      const chestGuard = new THREE.Mesh(new THREE.TorusBufferGeometry(1.8, 0.8, this.texture,this.texture,this.texture), new THREE.MeshBasicMaterial({map: metal_img}));
      const waistGuard = new THREE.Mesh(new THREE.TorusBufferGeometry(0.8, 0.8, this.texture,this.texture,this.texture), new THREE.MeshBasicMaterial({map: metal_img}));
      const headGuard = new THREE.Mesh(new THREE.TorusBufferGeometry(0.8, 0.8, this.texture,this.texture,this.texture), new THREE.MeshBasicMaterial({map: metal_img}));
      chestGuard.position.y += 2;
      waistGuard.position.y -= 1;
      headGuard.position.y += 5;
      chestGuard.rotation.x = THREE.Math.degToRad(90);
      waistGuard.rotation.x = THREE.Math.degToRad(90);
      headGuard.rotation.x = THREE.Math.degToRad(90);
      hand1.position.x = 3;
      hand1.position.y = 0.8;
      hand2.position.x = -3;
      hand2.position.y = 0.8;
      hand1.rotation.z = THREE.Math.degToRad(45);
      hand2.rotation.z = THREE.Math.degToRad(-45);
      skirt.position.y = -2.5;
      leg1.position.y = -6;
      leg2.position.y = -6;
      leg1.position.x = 1;
      leg2.position.x = -1;
      leg1.position.z = -0.5;
      leg2.position.z = -0.5;
      leg2.rotation.x = 0.5;
      neck.position.y = 1;
      head.position.y = 4;
      this.holderweaponhand = this.weapons[this.weapon].tool;
      this.player = new THREE.Group();
      this.player.add(head, body, neck, hand1, hand2, skirt, leg1, leg2, chestGuard, waistGuard, headGuard, this.holderweaponhand);
      this.player.position.x = this.posx;
      this.player.position.z = this.posz;
      this.player.rotation.y = THREE.Math.degToRad(180);
      this.leg1 = leg1;
      this.leg2 = leg2;
      this.body = body;
      const font = floader.load('https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/font.json', (font)=>{
        const tgeometry = new TextGeometry(this.username, {
          font: font,
          size: 2,
          height: 0.02
        }) 
        this.playername = new  THREE.Mesh(tgeometry, [ new THREE.MeshDepthMaterial({color: 0xffffff}),new THREE.MeshDepthMaterial({color: 0x000000}) ])
        this.playername.position.y = 10;
        this.playername.position.x -= 5;
        this.playername.translateX(10)
        this.playername.rotation.y = THREE.Math.degToRad(180);
        this.player.add(this.playername);
        this.scene.add(this.player);
      })

    this.playerrange = new THREE.Mesh(new THREE.BoxBufferGeometry(this.range, 10, this.range, 5, 5, 5), new THREE.MeshBasicMaterial({color: 0x7bff00, wireframe: true}));

  }
  draw() {
    this.player.position.x = this.posx;
    this.player.position.z = this.posz;
    this.playerrange.position.x = this.posx;
    this.playerrange.position.z = this.posz;
    this.scene.position.z = -this.posz;
    this.scene.position.x = -this.posx;
  }
  multiplayerdraw() {
    this.player.position.x = this.posx;
    this.player.position.z = this.posz;
    this.playerrange.position.x = this.posx;
    this.playerrange.position.z = this.posz;
  }
  forward(velz, velx) {
    this.velz = velz;
    this.velx = velx;    
  }

  move() {
    if(this.chunk.contains(this.player.position.z + this.velz, this.player.position.x + this.velx)) {

      this.posx += this.velx;
      this.posz += this.velz;
      this.player.position.z += this.velz;
      this.player.position.x += this.velx;
      this.playerrange.position.z += this.velz;
      this.playerrange.position.x += this.velx;
      //this.weapons.forEach(e => { e.tool.position.x += this.velx; e.tool.position.z += this.velz; })
      this.scene.position.z -= this.velz;
      this.scene.position.x -= this.velx;
      if(this.velz !== 0){
        this.velz += this.velz>0?-this.decn:this.decn;
      }
      if(this.velx !== 0){
        this.velx += this.velx>0?-this.decn:this.decn;
      }
      if(Math.abs(this.velx) <=0.005 && Math.abs(this.velz) <= 0.05){
        this.walking = 0;
      }
    }
  }
  getNearPoints() {
    return this.quadtree.squareContains(this.posx, this.posz, this.range, []);
  }
  changeWeapon(data) {
    this.player.remove(this.weapons[this.weapon].tool);
    this.weapon = (this.weapon+data)%this.weapons.length;
    if(this.weapon<0){
      this.weapon = this.weapons.length+this.weapon;
    }
    this.player.add(this.weapons[this.weapon].tool);
  }
  multiplayermove(posx, posz) {
    this.newposx = posx;
    this.newposz = posz;
  }
  multiplayermover(){
    //this.player.position.x = this.newposx;
    //this.player.position.z = this.newposz;
    if(this.player.position.x - this.newposx>1){
       this.player.position.x += this.accx;
    }else if(this.player.position.x - this.newposx<-1){
       this.player.position.x -= this.accx;
    }
    if(this.player.position.z - this.newposz>1){
       this.player.position.z += this.accz;
    }else if(this.player.position.z - this.newposz<1){
       this.player.position.z -= this.accz;
    }
  }
}
