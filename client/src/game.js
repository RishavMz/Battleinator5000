import "../style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//import io from "socket.io-client";
import { Chunk } from "./chunk";
import { Player } from "./player";
import { Point, QuadTree } from "./quadtree";

const BACKEND = "https://battleinator5000.vercel.app";

export class Game {
  constructor(username, texture) {
    this.username = username;
    this.texture = texture;
    this.animate = this.animate.bind(this);
    this.bulletAnimate = this.bulletAnimate.bind(this);
    this.playerAnimate = this.playerAnimate.bind(this);
    this.onDocumentKeyUp = this.onDocumentKeyUp.bind(this);
    this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
    this.backend = BACKEND;
    //this.socket = io(this.backend, { reconnectionDelayMax: 10000, auth: { email: this.email , username: this.username }});

    document.getElementById("root").innerHTML = `
            <div class="label1" id="label1"></div>
            <div class="label2" id="label2">
              <center><h2>Tutorial</h2></center>
              <ul>
                <li>w : Accelerate forward</li>
                <li>s : Accelerate backward</li>
                <li>a : Turn left</li>
                <li>d : Turn right</li>
                <li>e : Previous Weapon</li>
                <li>r : Next Weapon</li>
                <li>m : Swing your weapon</li>
                <li>space : Shoot projectile</li>
                <li>t : Toggle tutorial on/off</li>
              </ul>
              <br/>
              PRESS ANY KEY TO START
            </div>
            <div class="inventory" id="inventory">
              <div class="invitem" ><img class = "invimg" id="item0" src="https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/sword.png"/></div>
              <div class="invitem" ><img class = "invimg" id="item1" src="https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/axe.png"></div>
              <div class="invitem" ><img class = "invimg" id="item2" src="https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/polearm.png"/></div>
            </div>
            <canvas id="main"></canvas>`;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2048
    );
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#main"),
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.position.setZ(25);
    this.camera.position.setY(15);
    this.renderer.render(this.scene, this.camera);

    //this.gridHelper = new THREE.GridHelper(1000,1000);
    //this.scene.add(gridHelper);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = false;
    this.nearby = [];
    this.weaponmove = 0;
    this.pointanimate = 0;
    this.ENV = "prod";
    this.ENEMY_COUNT = 5;
    this.radius = 25;
    this.angle = 1.3;
    this.rotator = 0.01;
    this.bullet = 0;

    this.chunk = new Chunk(this.scene, 0, 0, 1024, this.texture, 10);
    this.chunk.draw();
    this.chunk.drawObjects();
    this.qtree = new QuadTree(this.scene, 0, 0, 1024);
    this.player = new Player(
      this.scene,
      this.qtree,
      this.chunk,
      "",
      0,
      400,
      this.texture
    );
    this.player.draw();
    //this.scene.add(this.player.weapons[this.player.weapon].tool);
    document.getElementById(
      "label1"
    ).innerHTML = `SCORE : ${this.player.score} <br/> HEALTH : ${this.player.health}`;
    document.getElementById(`item0`).style.borderColor = "gold";

    for (let i = 0; i < this.ENEMY_COUNT; i++) {
      let temp = new Point(
        this.scene,
        this.qtree,
        i,
        Math.random() * 1024 - 512,
        Math.random() * 1024 - 512,
        this.texture
      );
      temp.draw();
      this.qtree.insert(temp);
    }

    document.addEventListener("keydown", this.onDocumentKeyDown, false);
    document.addEventListener("keyup", this.onDocumentKeyUp, false);

    if (this.ENV === "dev") {
      this.qtree.draw();
      console.log(this.qtree);
      this.scene.add(this.player.playerrange);
    }
    let stateCheck = setInterval(() => {
      if (document.readyState === "complete") {
        clearInterval(stateCheck);
        document.getElementById("label1").style.display = "block";
        document.getElementById("label2").style.display = "block";
        document.getElementById("inventory").style.display = "block";
      }
    }, 100);
    if (this.ENV === "dev") {
      javascript: (function () {
        var script = document.createElement("script");
        script.onload = function () {
          var stats = new Stats();
          document.body.appendChild(stats.dom);
          requestAnimationFrame(function loop() {
            stats.update();
            requestAnimationFrame(loop);
          });
        };
        script.src = "//mrdoob.github.io/stats.js/build/stats.min.js";
        document.head.appendChild(script);
      })();
    }
    this.scene.fog = new THREE.FogExp2(0xdfe9f3, 0.004);
  }

  playerAnimate() {
    requestAnimationFrame(this.playerAnimate);
    if (this.pointanimate % 5 == 0 && this.player.walking == 1) {
      this.player.leg1.rotation.x = (this.player.leg1.rotation.x + 0.1) % 0.6;
      this.player.leg2.rotation.x = (this.player.leg1.rotation.x + 0.1) % 0.6;
    }

    this.camera.position.x = this.radius * Math.cos(this.angle);
    this.camera.position.z = this.radius * Math.sin(this.angle);

    if (this.weaponmove-- > 0) {
      this.player.player.rotation.y += THREE.Math.degToRad(60);
    }

    this.player.move();
    this.controls.update();
  }

  bulletAnimate() {
    requestAnimationFrame(this.bulletAnimate);
    if (this.bullet === 1) {
      this.player.bullet.move();
      if (this.player.bullet.posy <= -10) {
        this.bullet = 0;
      } else {
        for (let i = 0; i < this.nearby.length; i++) {
          if (
            Math.sqrt(
              Math.pow(this.player.bullet.posx - this.nearby[i].posx, 2) +
                Math.pow(this.player.bullet.posz - this.nearby[i].posz, 2)
            ) <= 2
          ) {
            const id = this.nearby[i].id;
            // To be removed from all
            this.qtree.remove(this.nearby[i]);
            this.scene.remove(this.nearby[i].data);
            let newpt = new Point(
              this.scene,
              this.qtree,
              id,
              Math.random() * 1024 - 512,
              Math.random() * 1024 - 512
            );
            // To be inserted into all
            this.qtree.insert(newpt);
            newpt.draw();
            document.getElementById("label1").innerHTML = `SCORE : ${this.player
              .score++} <br/> HEALTH : ${this.player.health}`;
            if (this.ENV === "dev") {
              this.qtree.draw();
              console.log(this.qtree);
            }
          }
        }
      }
    }
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.chunk.water.rotation.z += 0.001;
    this.pointanimate = (this.pointanimate + 1) % 100;
    if (this.pointanimate % 10 == 0) {
      for (let i = 0; i < this.nearby.length; i++) {
        this.nearby[i].move(this.player.posx, this.player.posz);
        if (
          Math.sqrt(
            Math.pow(this.player.posx - this.nearby[i].posx, 2) +
              Math.pow(this.player.posz - this.nearby[i].posz, 2)
          ) <= 10
        ) {
          if (document.getElementById("label1")) {
            document.getElementById("label1").innerHTML = `SCORE : ${
              this.player.score
            } <br/> HEALTH : ${this.player.health--}`;
          }
        }
      }
    }
    this.renderer.render(this.scene, this.camera);
  }

  onDocumentKeyDown(event) {
    var keyCode = event.which;
    //console.log(keyCode)
    if (keyCode == 87) {
      this.player.forward(
        this.player.acc * Math.sin(this.angle),
        this.player.acc * Math.cos(-this.angle)
      );
      this.player.walking = 1;
    } else if (keyCode == 83) {
      this.player.forward(
        -this.player.acc * Math.sin(this.angle),
        -this.player.acc * Math.cos(-this.angle)
      );
      this.player.walking = 1;
    } else if (keyCode == 65) {
      this.angle -= this.rotator;
      this.player.player.rotateY(this.rotator);
    } else if (keyCode == 68) {
      this.angle += this.rotator;
      this.player.player.rotateY(-this.rotator);
    } else if (keyCode == 32) {
      if (this.player.bulletloaded === 1) {
        this.scene.add(this.player.bullet.data);
        this.bullet = 1;
        this.player.bullet.moveTo(
          this.player.player.position.x,
          5,
          this.player.player.position.z
        );
        this.player.bullet.forward(
          5 * Math.sin(this.angle),
          5 * Math.cos(-this.angle)
        );
      }
    } else if (keyCode == 77) {
      for (let i = 0; i < this.nearby.length; i++) {
        this.weaponmove = 6;
        if (
          Math.sqrt(
            Math.pow(this.player.posx - this.nearby[i].posx, 2) +
              Math.pow(this.player.posz - this.nearby[i].posz, 2)
          ) <= this.player.weapons[this.player.weapon].range
        ) {
          const id = this.nearby[i].id;
          // To be removed from all
          this.qtree.remove(this.nearby[i]);
          this.scene.remove(this.nearby[i].data);
          let newpt = new Point(
            this.scene,
            this.qtree,
            id,
            Math.random() * 1024 - 512,
            Math.random() * 1024 - 512
          );
          // To be inserted into all
          this.qtree.insert(newpt);
          newpt.draw();
          document.getElementById("label1").innerHTML = `SCORE : ${this.player
            .score++} <br/> HEALTH : ${this.player.health}`;
          if (this.ENV === "dev") {
            this.qtree.draw();
            console.log(this.qtree);
          }
        }
      }
    } else if (keyCode == 69) {
      document.getElementById(`item${this.player.weapon}`).style.borderColor =
        "black";
      //this.scene.remove(this.player.weapons[this.player.weapon].tool);
      this.player.changeWeapon(-1);
      //this.scene.add(this.player.weapons[this.player.weapon].tool);
      document.getElementById(`item${this.player.weapon}`).style.borderColor =
        "gold";
    } else if (keyCode == 82) {
      document.getElementById(`item${this.player.weapon}`).style.borderColor =
        "black";
      //this.scene.remove(this.player.weapons[this.player.weapon].tool);
      this.player.changeWeapon(1);
      //this.scene.add(this.player.weapons[this.player.weapon].tool);
      document.getElementById(`item${this.player.weapon}`).style.borderColor =
        "gold";
    } else if (keyCode == 84) {
      let div = document.getElementById("label2");
      if (div.style.display === "block") {
        div.style.display = "none";
      } else {
        div.style.display = "block";
      }
    }
  }
  onDocumentKeyUp(event) {
    this.nearby = this.player.getNearPoints();
  }

  gameover() {
    //this.socket.close();
    cancelAnimationFrame(this.animate);
  }
}
