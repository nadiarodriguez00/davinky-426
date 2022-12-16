import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Land, Davinky, Enemy } from 'objects';
import { BasicLights } from 'lights';
import * as THREE from "three";

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 0,
            FirstPerson: false,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);
        this.enemies = [];      // stores an array of all enemy objects
        this.paintBuckets = []
        this.score = 0;
        this.max = 0;

        // Add meshes to scene
        const land = new Land();
        const davinky = new Davinky(this);
        const lights = new BasicLights();

        this.add(land, davinky, lights);
        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', 0, 5);
        this.state.gui.add(this.state, 'FirstPerson').onChange();
  };
    
    // used to spawn enemies
    spawnEnemies(numEnemies){
        for (let i = 0; i < numEnemies; i++) {
        const enemy = new Enemy();
        let x = Math.random() * 40 - 20;
        let z = Math.random() * 40 - 20;
        enemy.position.set(x, 0, z);
        // update array of enemies
        this.enemies.push(enemy);
        // add enemy to scene
        this.add(enemy);
        }
    }

    // used to spawn paintballs
    spawnPaint(numPaint){
    
        let geometry;
        let material;
        let loader = new THREE.TextureLoader();
        let texture = loader.load('https://webglfundamentals.org/webgl/resources/f-texture.png');
        geometry = new THREE.SphereGeometry( 0.5, 10, 5 );
        material = new THREE.MeshPhongMaterial( { map: texture} );
        
        for (let i = 0; i < numPaint; i++) {
            const paintBucket = new THREE.Mesh( geometry, material );
            let x = Math.random() * 40 - 20;
            let z = Math.random() * 40 - 20;
            paintBucket.position.set(x, 0.7, z);
            this.paintBuckets.push(paintBucket);  // update array of paintballs
            this.add(paintBucket);  // add paintballs to scene
            }
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default SeedScene;
