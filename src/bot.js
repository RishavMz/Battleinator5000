import * as THREE from 'three';

export class Bot
{
    constructor(scene, texture, posx, posz, size){
        const headimg = texture.load('../resources/bothead.png');
        const bodyimg = texture.load('../resources/botbody.png');
        this.realposx = posx;
        this.realposz = posz;
        this.posx = size/2-posx;
        this.posz = size/2-posz;
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 100,100), new THREE.MeshBasicMaterial({map: headimg}));
        const body = new THREE.Mesh(new THREE.SphereGeometry(1, 100,100), new THREE.MeshBasicMaterial({map: bodyimg}));
        head.position.y += 1.8;
        body.position.y += 0.5
        const group = new THREE.Group();
        group.add(head, body);
        group.position.x += this.posx;
        group.position.z += this.posz;
        group.rotateY(-45);
        this.data = group;
        scene.add(group);
    }
    moveUp(){
        this.posz -= 1;
        this.realposz -= 1;
        this.data.position.z -= 1;
    }
    moveDown(){
        this.posz += 1;
        this.realposz += 1;
        this.data.position.z += 1;
    }
    moveLeft(){
        this.posx -= 1;
        this.realposx -= 1;
        this.data.position.x -= 1;
    }
    moveRight(){
        this.posy -= 1;
        this.realposx -= 1;
        this.data.position.x += 1;
    }
}


export class Obstacle{
    constructor(scene, texture, posx, posz, size){
        const obsimg = texture.load('../resources/brick.png');
        this.realposx = posx;
        this.realposz = posz;
        this.posx = size/2-posx;
        this.posz = size/2-posz;
        const body = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({map: obsimg}));
        body.position.x += this.posx;
        body.position.z += this.posz;
        body.position.y += 0.5
        scene.add(body);
    }
}