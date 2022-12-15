import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Land, Davinky, Enemy } from 'objects';
import { BasicLights } from 'lights';
// import { Enemy } from '../objects/Enemy';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 0,
            color: '#00ff00',
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);
        // stores an array of all enemy objects
        this.enemies = []; 

        // Add meshes to scene
        const land = new Land();
        const davinky = new Davinky(this);
        const lights = new BasicLights();

        this.add(land, davinky, lights);
        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
        this.state.gui.addColor(this.state, 'color');

    }

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
