import * as THREE from 'three';
const texture = new THREE.TextureLoader();
const bush_image = texture.load('https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/bush.png');
const canopy_image = texture.load('https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/tree_leaves.png');
const bark_image = texture.load('https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/tree_bark.png');

export class Grass{
    constructor(scene, posx, posz, texture){
        this.scene = scene;
        this.posx = posx;
        this.posz = posz;
        this.texture = texture;
    }
    draw(){
        this.top  = new THREE.Mesh( new THREE.SphereBufferGeometry( 12, 10, 10, this.texture,this.texture,this.texture,this.texture), new THREE.MeshBasicMaterial( {map: bush_image} ) );
        this.top.position.y -= 9.2;
        this.data = new THREE.Group();
        this.data.add(this.top);
        this.data.position.x = this.posx;
        this.data.position.z = this.posz;
        this.scene.add(this.data);
    }
}

export class Tree{
    constructor(scene, posx, posz, texture){
      this.scene = scene;
      this.posx = posx;
      this.posz = posz;
      this.texture = texture;
    }
    draw() {
      this.bark    = new THREE.Mesh( new THREE.CylinderBufferGeometry( 1.6, 1.6, 16 ), new THREE.MeshBasicMaterial( {map: bark_image} ) );
      this.top  = new THREE.Mesh( new THREE.SphereBufferGeometry( 8, 10, 10, this.texture,this.texture,this.texture,this.texture), new THREE.MeshBasicMaterial( {map: canopy_image} ) );
      this.top1 = new THREE.Mesh( new THREE.SphereBufferGeometry( 8, 10, 10, this.texture,this.texture,this.texture,this.texture), new THREE.MeshBasicMaterial( {map: canopy_image} ) );
      this.top2 = new THREE.Mesh( new THREE.SphereBufferGeometry( 8, 10, 10, this.texture,this.texture,this.texture,this.texture), new THREE.MeshBasicMaterial( {map: canopy_image} ) );
      this.top3 = new THREE.Mesh( new THREE.SphereBufferGeometry( 8, 10, 10, this.texture,this.texture,this.texture,this.texture), new THREE.MeshBasicMaterial( {map: canopy_image} ) );
      this.top4 = new THREE.Mesh( new THREE.SphereBufferGeometry( 8, 10, 10, this.texture,this.texture,this.texture,this.texture), new THREE.MeshBasicMaterial( {map: canopy_image} ) );
      this.top.position.y += 11.2;
      this.top1.position.x += 2;
      this.top2.position.x -= 2;
      this.top3.position.z += 2;
      this.top4.position.z -= 2;
      this.top1.position.y += 10;
      this.top2.position.y += 10;
      this.top3.position.y += 10;
      this.top4.position.y += 10;
      this.data = new THREE.Group();
      this.data.add(this.bark,this.top,this.top1,this.top2,this.top3,this.top4);
      this.data.position.x = this.posx;
      this.data.position.z = this.posz;
      this.data.position.y = -2;
      this.scene.add(this.data);
    }
  }