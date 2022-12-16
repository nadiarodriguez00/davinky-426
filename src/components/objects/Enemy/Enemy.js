import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './paperMob.gltf';

class Enemy extends Group {
    constructor() {
        // Call parent Group() constructor
        super();
         this.addEnemy();
    }
    addEnemy() {
        // Load object
        const loader = new GLTFLoader();
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });
    }
}

export default Enemy;
