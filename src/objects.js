import * as THREE from 'three';
const texture = new THREE.TextureLoader();

export class Grass{
    constructor(scene, posx, posz){
        this.scene = scene;
        this.posx = posx;
        this.posz = posz;
    }
    draw(){
        const canopy_image = texture.load('../resources/bush.png');
        this.top  = new THREE.Mesh( new THREE.SphereGeometry( 12, 10, 10, 100, 100, 100, 100), new THREE.MeshBasicMaterial( {map: canopy_image} ) );
        this.top1 = new THREE.Mesh( new THREE.SphereGeometry( 12, 10, 10, 100, 100, 100, 100), new THREE.MeshBasicMaterial( {map: canopy_image} ) );
        this.top2 = new THREE.Mesh( new THREE.SphereGeometry( 12, 10, 10, 100, 100, 100, 100), new THREE.MeshBasicMaterial( {map: canopy_image} ) );
        this.top3 = new THREE.Mesh( new THREE.SphereGeometry( 12, 10, 10, 100, 100, 100, 100), new THREE.MeshBasicMaterial( {map: canopy_image} ) );
        this.top4 = new THREE.Mesh( new THREE.SphereGeometry( 12, 10, 10, 100, 100, 100, 100), new THREE.MeshBasicMaterial( {map: canopy_image} ) );
        this.top.position.y -= 9.2;
        this.top1.position.x += 6;
        this.top2.position.x -= 6;
        this.top3.position.z += 6;
        this.top4.position.z -= 6;
        this.top1.position.y -= 10;
        this.top2.position.y -= 10;
        this.top3.position.y -= 10;
        this.top4.position.y -= 10;
        this.data = new THREE.Group();
        this.data.add(this.top,this.top1,this.top2,this.top3,this.top4);
        this.data.position.x = this.posx;
        this.data.position.z = this.posz;
        this.scene.add(this.data);
    }
}

export class Tree{
    constructor(scene, posx, posz){
      this.scene = scene;
      this.posx = posx;
      this.posz = posz;
    }
    draw() {
      const canopy_image = texture.load('../resources/tree_leaves.png');
      const bark_image = texture.load('../resources/tree_bark.png');
      this.bark    = new THREE.Mesh( new THREE.CylinderGeometry( 1.6, 1.6, 16, 100 ), new THREE.MeshBasicMaterial( {map: bark_image} ) );
      this.top  = new THREE.Mesh( new THREE.SphereGeometry( 8, 10, 10, 100, 100, 100, 100), new THREE.MeshBasicMaterial( {map: canopy_image} ) );
      this.top1 = new THREE.Mesh( new THREE.SphereGeometry( 8, 10, 10, 100, 100, 100, 100), new THREE.MeshBasicMaterial( {map: canopy_image} ) );
      this.top2 = new THREE.Mesh( new THREE.SphereGeometry( 8, 10, 10, 100, 100, 100, 100), new THREE.MeshBasicMaterial( {map: canopy_image} ) );
      this.top3 = new THREE.Mesh( new THREE.SphereGeometry( 8, 10, 10, 100, 100, 100, 100), new THREE.MeshBasicMaterial( {map: canopy_image} ) );
      this.top4 = new THREE.Mesh( new THREE.SphereGeometry( 8, 10, 10, 100, 100, 100, 100), new THREE.MeshBasicMaterial( {map: canopy_image} ) );
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
      this.scene.add(this.data);
    }
  }