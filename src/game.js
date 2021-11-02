import * as THREE from 'three';
import {Bot, Obstacle} from './bot';

export class Game
{
  constructor(scene, tloader, size, bots)
  {
    this.size = size;
    this.scene = scene;
    this.texture = tloader;
    this.positions = [];
    this.botArray = [];
    this.obstacles = [];
    this.bots = bots;
    for(var i=0; i<this.size; i++){
      var temp = []
      for(var j=0; j<this.size; j++){
        if(i===0 || j===0 || i==this.size-1 || j===this.size-1)
          temp.push(-2);
        else
          temp.push(0);
      }
      this.positions.push(temp);
    }
    const arenawall = this.texture.load("./resources/wall.png");
    arenawall.wrapS = THREE.RepeatWrapping;
    arenawall.wrapT = THREE.RepeatWrapping;
    arenawall.repeat.set(4, 4);
    const wallimgs = [];
    for(var i=0; i<6; i++){
      wallimgs.push( new THREE.MeshBasicMaterial({map: arenawall}));
      wallimgs[i].side = THREE.BackSide;
    }
    const arena = new THREE.Mesh(new THREE.BoxGeometry(this.size, this.size, this.size/4), wallimgs);
    arena.rotation.x=THREE.Math.degToRad(-90);
    arena.position.y += this.size/8;
    this.scene.add(arena);
  }

  addBots(){
    for(var i=0; i<this.bots; i++){
        var posx = Math.floor(Math.random()*this.size*0.9);
        var posz = Math.floor(Math.random()*this.size*0.9);
        if(this.positions[posx][posz]!==-1){
          var bot = new Bot(this.scene, this.texture, posx, posz, this.size);
          this.botArray.push(bot);
          this.positions[posx][posz] = i+1;
        }
    }
  }
  addObstacles(){
    for(var i=0; i<50; i++){
        var posx = Math.floor(Math.random()*this.size*0.9);
        var posz = Math.floor(Math.random()*this.size*0.9);
          var obs = new Obstacle(this.scene, this.texture, posx, posz, this.size);
          this.obstacles.push(obs);
          this.positions[posx][posz] = -2;
    }
  }
  moveBots(){
    for(var i=0; i<this.bots; i++){
        var ch = Math.floor(Math.random()*16);
        switch (ch) {
            case 1:
                if(this.positions[this.botArray[i].realposx-1][this.botArray[i].realposz]===0){
                    this.positions[[this.botArray[i].realposx-1][this.botArray[i].realposz]] = i+1;
                    this.positions[[this.botArray[i].realposx-1][this.botArray[i].realposz]] = 0;
                    this.botArray[i].moveUp();
                }
                break;
            case 2:
                if(this.positions[this.botArray[i].realposx+1][this.botArray[i].realposz]===0){
                    this.positions[[this.botArray[i].realposx+1][this.botArray[i].realposz]] = i+1;
                    this.positions[[this.botArray[i].realposx-1][this.botArray[i].realposz]] = 0;
                    this.botArray[i].moveDown();
                }
                break;
            case 1:
                if(this.positions[this.botArray[i].realposx][this.botArray[i].realposz-1]===0){
                    this.positions[[this.botArray[i].realposx][this.botArray[i].realposz-1]] = i+1;
                    this.positions[[this.botArray[i].realposx][this.botArray[i].realposz-1]] = 0;
                    this.botArray[i].moveLeft();
                }
                break;
            case 1:
            if(this.positions[this.botArray[i].realposx][this.botArray[i].realposz+1]===0){
                this.positions[[this.botArray[i].realposx][this.botArray[i].realposz+1]] = i+1;
                this.positions[[this.botArray[i].realposx][this.botArray[i].realposz+1]] = 0;
                this.botArray[i].moveRight();
            }
            break;
        }
    }
  }

}
