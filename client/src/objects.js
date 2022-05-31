import * as THREE from "three";
const texture = new THREE.TextureLoader();
const bush_image = texture.load(
  "https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/bush.png"
);
const canopy_image = texture.load(
  "https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/tree_leaves.png"
);
const bark_image = texture.load(
  "https://raw.githubusercontent.com/RishavMz/3D_Battle_Arena/main/client/resources/tree_bark.png"
);

export class Grass {
  constructor(scene, posx, posz, texture) {
    this.scene = scene;
    this.posx = posx;
    this.posz = posz;
    this.texture = texture;
  }
  draw() {
    const top = new THREE.Mesh(
      new THREE.SphereBufferGeometry(
        12,
        10,
        10,
        this.texture,
        this.texture,
        this.texture,
        this.texture
      ),
      new THREE.MeshBasicMaterial({ map: bush_image })
    );
    top.position.y -= 9.2;
    this.data = new THREE.Group();
    this.data.add(top);
    this.data.position.x = this.posx;
    this.data.position.z = this.posz;
    this.scene.add(this.data);
  }
}

export class Tree {
  constructor(scene, posx, posz, texture) {
    this.scene = scene;
    this.posx = posx;
    this.posz = posz;
    this.texture = texture;
  }
  draw() {
    const bark = new THREE.Mesh(
      new THREE.CylinderBufferGeometry(1.6, 1.6, 16),
      new THREE.MeshBasicMaterial({ map: bark_image })
    );
    const top = new THREE.Mesh(
      new THREE.SphereBufferGeometry(
        8,
        10,
        10,
        this.texture,
        this.texture,
        this.texture,
        this.texture
      ),
      new THREE.MeshBasicMaterial({ map: canopy_image })
    );
    const top1 = new THREE.Mesh(
      new THREE.SphereBufferGeometry(
        8,
        10,
        10,
        this.texture,
        this.texture,
        this.texture,
        this.texture
      ),
      new THREE.MeshBasicMaterial({ map: canopy_image })
    );
    const top2 = new THREE.Mesh(
      new THREE.SphereBufferGeometry(
        8,
        10,
        10,
        this.texture,
        this.texture,
        this.texture,
        this.texture
      ),
      new THREE.MeshBasicMaterial({ map: canopy_image })
    );
    const top3 = new THREE.Mesh(
      new THREE.SphereBufferGeometry(
        8,
        10,
        10,
        this.texture,
        this.texture,
        this.texture,
        this.texture
      ),
      new THREE.MeshBasicMaterial({ map: canopy_image })
    );
    const top4 = new THREE.Mesh(
      new THREE.SphereBufferGeometry(
        8,
        10,
        10,
        this.texture,
        this.texture,
        this.texture,
        this.texture
      ),
      new THREE.MeshBasicMaterial({ map: canopy_image })
    );
    top.position.y += 11.2;
    top1.position.x += 2;
    top2.position.x -= 2;
    top3.position.z += 2;
    top4.position.z -= 2;
    top1.position.y += 10;
    top2.position.y += 10;
    top3.position.y += 10;
    top4.position.y += 10;
    this.data = new THREE.Group();
    this.data.add(bark, top, top1, top2, top3, top4);
    this.data.position.x = this.posx;
    this.data.position.z = this.posz;
    this.data.position.y = -2;
    this.scene.add(this.data);
  }
}
