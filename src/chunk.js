import * as THREE from 'three';
const texture = new THREE.TextureLoader();

export class Chunk {
    constructor(scene, posx, posz, side) {
        this.scene = scene;
        this.posx = posx;
        this.posz = posz;
        this.side = side;
    }
    draw() {

        const ground_image = texture.load('https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/resources/ground.png');
        const sky_image = texture.load('https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/resources/sky.png');
        ground_image.wrapS = THREE.RepeatWrapping;
        ground_image.wrapT = THREE.RepeatWrapping;
        ground_image.repeat.set(32, 32);

        const ground = new THREE.Mesh(new THREE.PlaneGeometry(this.side, this.side), new THREE.MeshBasicMaterial({map: ground_image}));
        const sky = new THREE.Mesh(new THREE.SphereGeometry(this.side/1.414, this.side, this.side), new THREE.MeshBasicMaterial({map: sky_image}));
        sky.material.side = THREE.BackSide;
        ground.rotation.x = THREE.Math.degToRad(-90);
        sky.rotation.y = THREE.Math.degToRad(90);
        sky.position.x = this.posx;
        ground.position.x = this.posx;
        sky.position.z = this.posz;
        ground.position.z = this.posz;
        ground.position.y = -10;
        sky.position.y = 20;
        this.scene.add(ground);
        this.scene.add(sky);
    }
    contains(posx, posz) {
        if(posx > this.posx - this.side/2 && posx < this.posx + this.side/2 &&
            posz > this.posz - this.side/2 && posz < this.posz+ this.side/2){
                return true;
            }
            return false;
    }
}

