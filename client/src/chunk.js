import * as THREE from 'three';
const texture = new THREE.TextureLoader();

export class Chunk {
    constructor(scene, posx, posz, side, texture) {
        this.scene = scene;
        this.posx = posx;
        this.posz = posz;
        this.side = side;
        this.texture = texture;
    }
    draw() {

        const ground_image = texture.load('https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/ground.png');
        const ground_image1 = texture.load('https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/ground1.png');
        const sky_image = texture.load('https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/sky.png');
        ground_image.wrapS = THREE.RepeatWrapping;
        ground_image.wrapT = THREE.RepeatWrapping;
        this.texture === 100? ground_image.repeat.set(64, 64) : ground_image.repeat.set(8, 8);
        ground_image1.wrapS = THREE.RepeatWrapping;
        ground_image1.wrapT = THREE.RepeatWrapping;
        this.texture === 100? ground_image1.repeat.set(64, 64) : ground_image1.repeat.set(8, 8);

        var geometry = new THREE.PlaneBufferGeometry( 1050, 1050, 35, 35 );
        var vertices = geometry.attributes.position.array;
        for(let i=2; i<vertices.length; i+= 3){
            vertices[i] = Math.random()*10;
        }
        const ground = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: ground_image } ) );
        ground.rotation.x = THREE.Math.degToRad(-90);
        
        const ground1 = new THREE.Mesh(new THREE.PlaneBufferGeometry(2048, 2048), new THREE.MeshBasicMaterial({map: ground_image1}));
        const sky = new THREE.Mesh(new THREE.SphereBufferGeometry(this.side/1.414, this.side, this.side), new THREE.MeshBasicMaterial({map: sky_image}));
        this.ground = ground;
        this.water = ground1;
        ground1.position.y = -12;
        ground1.rotation.x = THREE.Math.degToRad(-90);
        ground.rotation.x = THREE.Math.degToRad(-90);
        ground.position.x = this.posx;
        ground.position.y = -15;
        ground.position.z = this.posz;
        sky.material.side = THREE.BackSide;
        sky.rotation.y = THREE.Math.degToRad(90);
        sky.position.x = this.posx;
        sky.position.z = this.posz;
        sky.position.y = 20;
        this.scene.add(ground, ground1);
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

