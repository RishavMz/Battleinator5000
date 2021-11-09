import * as THREE from 'three';

export class Point {
    constructor(scene, posx, posz) {
        this.posx = posx;
        this.posz = posz;
        this.scene = scene;
    }
    draw() {
        const pt = new THREE.Mesh(new THREE.SphereGeometry(2, 100, 100), new THREE.MeshBasicMaterial({color: 0xffffff}));
        pt.position.x = this.posx;
        pt.position.z = this.posz;
        this.scene.add(pt);
    }
}


export class QuadTree {
    constructor(scene, posx, posz, side) {
        this.posx = posx;
        this.posz = posz;
        this.side = side;
        this.scene = scene;
        this.points = [];
        this.limit = 3;
    }
    contains(posx, posz) {
        if(posx > this.posx - this.side/2 && this.posx < this.posx + this.side/2 &&
            posz > this.posz - this.side/2 && posz < this.posz + this.side/2){
                return true;
            }
        return false;
    }
    draw() {
        let box = new THREE.Mesh(new THREE.BoxGeometry(this.side, this.side/10, this.side), new THREE.MeshBasicMaterial({color:0xffffff, wireframe: true}));
        box.position.x = this.posx;
        box.position.z = this.posz;
        this.scene.add(box);
        console.log(this.posx, this.posz, this.side)
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
        if(this.contains(point.posx, point.posz)) {
            if(this.points.length <= this.limit) {
                this.points.push([point]);
            } else {
                if(this.northwest === undefined){
                    this.northwest = new QuadTree(this.scene, (this.posx - this.side/4), (this.posz - this.side/4) ,this.side/2);
                    this.northeast = new QuadTree(this.scene, (this.posx + this.side/4), (this.posz - this.side/4) ,this.side/2);
                    this.southwest = new QuadTree(this.scene, (this.posx - this.side/4), (this.posz + this.side/4) ,this.side/2);
                    this.southeast = new QuadTree(this.scene, (this.posx + this.side/4), (this.posz + this.side/4) ,this.side/2);
                }
                if(this.northeast.contains(point.posx, point.posz)) {
                    this.northeast.insert(point);
                }else if(this.northwest.contains(point.posx, point.posz)) {
                    this.northwest.insert(point);
                }else if(this.southeast.contains(point.posx, point.posz)) {
                    this.southeast.insert(point);
                }else if(this.southwest.contains(point.posx, point.posz)) {
                    this.southwest.insert(point);
                }
            }
        }
    }
    
}