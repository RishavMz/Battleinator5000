import * as THREE from "three";
import { Tree, Grass } from "./objects";

const texture = new THREE.TextureLoader();

export class Chunk {
  constructor(scene, posx, posz, side, texture, objects) {
    this.scene = scene;
    this.posx = posx;
    this.posz = posz;
    this.side = side;
    this.texture = texture;
    this.objects = objects;
  }
  draw() {
    const ground_image = texture.load(
      "https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/ground.png"
    );
    const water_image = texture.load(
      "https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/water.png"
    );
    const sand_image = texture.load(
      "https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/sand.png"
    );
    const sky_image = texture.load(
      "https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/sky.png"
    );
    ground_image.wrapS = THREE.RepeatWrapping;
    ground_image.wrapT = THREE.RepeatWrapping;
    this.texture === 100
      ? ground_image.repeat.set(64, 64)
      : ground_image.repeat.set(8, 8);
    sand_image.wrapS = THREE.RepeatWrapping;
    sand_image.wrapT = THREE.RepeatWrapping;
    this.texture === 100
      ? sand_image.repeat.set(64, 64)
      : sand_image.repeat.set(8, 8);
    sky_image.wrapS = THREE.RepeatWrapping;
    sky_image.wrapT = THREE.RepeatWrapping;
    this.texture === 100
      ? sky_image.repeat.set(16, 16)
      : sky_image.repeat.set(4, 4);
    water_image.wrapS = THREE.RepeatWrapping;
    water_image.wrapT = THREE.RepeatWrapping;
    this.texture === 100
      ? water_image.repeat.set(64, 64)
      : water_image.repeat.set(8, 8);

    var geometry = new THREE.PlaneBufferGeometry(1050, 1050, 35, 35);
    var vertices = geometry.attributes.position.array;
    for (let i = 2; i < vertices.length; i += 3) {
      vertices[i] = Math.random() * 10;
    }
    const ground = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ map: ground_image })
    );
    ground.rotation.x = THREE.Math.degToRad(-90);

    const water = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2048, 2048),
      new THREE.MeshBasicMaterial({
        map: water_image,
        transparent: true,
        opacity: 0.4,
      })
    );
    const sand = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2048, 2048),
      new THREE.MeshBasicMaterial({ map: sand_image })
    );
    const sky = new THREE.Mesh(
      new THREE.SphereBufferGeometry(this.side / 1.2, this.side, this.side),
      new THREE.MeshBasicMaterial({ map: sky_image })
    );
    this.ground = ground;
    this.water = water;
    sand.rotation.x = THREE.Math.degToRad(-90);
    sand.position.y = -20;
    water.position.y = -12;
    water.rotation.x = THREE.Math.degToRad(-90);
    ground.rotation.x = THREE.Math.degToRad(-90);
    ground.position.x = this.posx;
    ground.position.y = -15;
    ground.position.z = this.posz;
    sky.material.side = THREE.BackSide;
    sky.rotation.y = THREE.Math.degToRad(90);
    sky.position.x = this.posx;
    sky.position.z = this.posz;
    sky.position.y = 20;
    this.scene.add(ground, water, sand);
    this.scene.add(sky);
  }

  drawObjects() {
    for (let i = 0; i < this.objects; i++) {
      let grass = new Tree(
        this.scene,
        Math.random() * 1024 - 512,
        Math.random() * 1024 - 512,
        this.texture
      );
      grass.draw();
    }
    for (let i = 0; i < this.objects; i++) {
      let tree = new Grass(
        this.scene,
        Math.random() * 1024 - 512,
        Math.random() * 1024 - 512,
        this.texture
      );
      tree.draw();
    }
  }
  contains(posx, posz) {
    if (
      posx > this.posx - this.side / 2 &&
      posx < this.posx + this.side / 2 &&
      posz > this.posz - this.side / 2 &&
      posz < this.posz + this.side / 2
    ) {
      return true;
    }
    return false;
  }
}
