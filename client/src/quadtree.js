import * as THREE from 'three';
const texture = new THREE.TextureLoader();

export class Point {
    constructor(scene, qtree, id, posx, posz) {
        this.posx = posx;
        this.posz = posz;
        this.id = id;
        this.qtree = qtree;
        this.scene = scene;
    }
    draw() {
        const head_img = texture.load('https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/head.png');
        const body_img = texture.load('https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/body.png');
        const limb_img = texture.load('https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/limb.png');
        const metal_img = texture.load('https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/metal.png');

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
        neck.position.y = 1;
        head.position.y = 4;

        this.data = new THREE.Group();
        this.data.add(head, body, neck, hand11, hand12, hand21, hand22, skirt, leg1, leg2);
        this.data.position.x = this.posx;
        this.data.position.z = this.posz;
        this.scene.add(this.data);
    }
    move(posx, posz) {
        if(this.data.position.x > posx){
            this.data.position.x-= 1;
            this.posx -= 1;
        } else {
            this.data.position.x+=1;
            this.posx += 1;
        }
        if(this.data.position.z > posz){
            this.data.position.z-=1;
            this.posz -= 1;
        } else {
            this.data.position.z+=1;
            this.posz += 1;
        }
    }
}


export class QuadTree {
    constructor(scene, posx, posz, side) {
        this.posx = posx;
        this.posz = posz;
        this.side = side;
        this.scene = scene;
        this.points = [];
        this.limit = 1;
    }
    contains(point) {
        if(point.posx > this.posx - this.side/2 && point.posx < this.posx + this.side/2 &&
            point.posz > this.posz - this.side/2 && point.posz < this.posz + this.side/2){
                return this;
            }
        return null;
    }
    squareContains(posx, posz, side, point) {
        let pointdata = point;
        if(!(this.posx-this.side/2 > posx+side/2 || 
            this.posx+this.side/2 < posx-side/2 || 
            this.posz-this.side/2 > posz+side/2 ||
            this.posz+this.side/2 < posz-side/2)) {
                this.points.forEach(e => {    pointdata.push(e); });
                if(this.northeast){ this.northeast.squareContains(posx, posz, side, pointdata); }
                if(this.northwest){ this.northwest.squareContains(posx, posz, side, pointdata); }
                if(this.southeast){ this.southeast.squareContains(posx, posz, side, pointdata); }
                if(this.southwest){ this.southwest.squareContains(posx, posz, side, pointdata); }
            }
        return pointdata;
    }
    draw() {
        let box = new THREE.Mesh(new THREE.BoxGeometry(this.side, this.side/10, this.side), new THREE.MeshBasicMaterial({color:0xffffff, wireframe: true}));
        box.position.x = this.posx;
        box.position.z = this.posz;
        this.data = box;
        this.scene.add(box);
        if(this.northeast) {
            this.northeast.draw();
        }if(this.northwest) {
            this.northwest.draw();
        }if(this.southeast) {
            this.southeast.draw();
        }if(this.southwest) {
            this.southwest.draw();
        }
    }
    insert(point) {
        if(this.contains(point)) {
            if(this.points.length <= this.limit) {
                this.points.push(point);
            } else {
                if(this.northwest === undefined){
                    this.northwest = new QuadTree(this.scene, (this.posx - this.side/4), (this.posz - this.side/4) ,this.side/2);
                    this.northeast = new QuadTree(this.scene, (this.posx + this.side/4), (this.posz - this.side/4) ,this.side/2);
                    this.southwest = new QuadTree(this.scene, (this.posx - this.side/4), (this.posz + this.side/4) ,this.side/2);
                    this.southeast = new QuadTree(this.scene, (this.posx + this.side/4), (this.posz + this.side/4) ,this.side/2);
                }
                if(this.northeast.contains(point)) {
                    this.northeast.insert(point);
                }else if(this.northwest.contains(point)) {
                    this.northwest.insert(point);
                }else if(this.southeast.contains(point)) {
                    this.southeast.insert(point);
                }else if(this.southwest.contains(point)) {
                    this.southwest.insert(point);
                }
            }
        }
    }
    remove(point){
        if(this.contains(point)){
            let tempval = -1;
            for(let i=0; i<this.points.length; i++){
                if(this.points[i].id == point.id){
                    tempval = i;
                    break;
                }
            }
            if(tempval == -1) {
                if(this.northeast){
                    this.northeast.remove(point);
                    this.northwest.remove(point);
                    this.southeast.remove(point);
                    this.southwest.remove(point);
                }
                if(this.northeast && this.northeast.points.length === 0 && this.northwest.points.length === 0 &&this.southeast.points.length === 0 && this.southwest.points.length === 0  ){
                    this.scene.remove(this.northeast.data)
                    this.scene.remove(this.northwest.data)
                    this.scene.remove(this.southeast.data)
                    this.scene.remove(this.southwest.data)
                    this.northeast = null;
                    this.northwest = null;
                    this.southeast = null;
                    this.southwest = null;
                }
            }
            else {
                this.points.splice(tempval, 1);
            }
        }
    }
    
}