import * as THREE from "three";
import { Vector2, Vector3 } from "three";

// maintan booleans to keep track if buffer period is active and if 
// game is muted
let buffer = false;
let mute = false;

// timer for timeout functions
let timer;

// handle user controls input
export function handleKeyDown(event, keypress) {
    if (event.key == "ArrowUp"    || event.key == 'w') keypress['up']    = true;
    if (event.key == "ArrowDown"  || event.key == 's') keypress['down']  = true;
    if (event.key == "ArrowLeft"  || event.key == 'a') keypress['left']  = true;
    if (event.key == "ArrowRight" || event.key == 'd') keypress['right'] = true;
    if (event.key == ' ') keypress['space'] = true;
}

// terminate the action caused by user controls input
export function handleKeyUp(event, keypress) {
    if (event.key == "ArrowUp"    || event.key == 'w') keypress['up']    = false;
    if (event.key == "ArrowDown"  || event.key == 's') keypress['down']  = false;
    if (event.key == "ArrowLeft"  || event.key == 'a') keypress['left']  = false;
    if (event.key == "ArrowRight" || event.key == 'd') keypress['right'] = false;
    if (event.key == ' ') keypress['space'] = false;
}

// Set the initial velocity and jumping state of the box
const velocity = new THREE.Vector3();
let jumping = false;

// move character and camera position in response to user controls input
export function handleCharacterControls(scene, keypress, character, camera, sounds) {

    let davinky = scene.getObjectByName(character);
    const jumpHeight = 0.5;
    const gravityCoefficient = 0.02;
    const delta = 0.1;

    if (keypress['up'] && davinky.position.y < 20) {
        davinky.position.x -= delta;
        davinky.rotation.y = Math.PI;        
    }
    if (keypress['down']) {
        davinky.position.x += delta;
        davinky.rotation.y = 0;
    }
    if (keypress['right']) {
        davinky.position.z -= delta;
        davinky.rotation.y = Math.PI / 2;
    }
    if (keypress['left']) {
        davinky.position.z += delta;
        davinky.rotation.y = -Math.PI / 2;
    }
    if(keypress['space'] && !jumping) {
        velocity.y += jumpHeight;
        jumping = true;
        sounds['jump1'].play();
    }

    davinky.position.y += velocity.y; // Update the position of the davinky based on its velocity
    velocity.y -= gravityCoefficient; // Apply gravity to the davinky velocity to simulate falling

    // If davinky has landed on the ground, stop its vertical velocity and reset the jumping state
    if (davinky.position.y < 0.0) {
        davinky.position.y = 0.0;
        jumping = false; // this makes it so 
    }
}

// prevent character from running off of island
export function handleBoundaries(scene, character, sounds) {
    let davinky = scene.getObjectByName(character);
    if (davinky.position.x > 20) {
        davinky.position.x = 20;
        sounds['sad1'].play();
    }
    if (davinky.position.x < -20) {
        davinky.position.x = -20;
        sounds['sad1'].play();
    }
    if (davinky.position.z > 20) {
        davinky.position.z = 20;
        sounds['sad1'].play();
    }
    if (davinky.position.z < -20) {
        davinky.position.z = -20;
        sounds['sad1'].play();
    }
}

// implement first person camera view
export function handleCameraAngle(scene, character, camera){
    if(scene.state.FirstPerson){
        let davinky = scene.getObjectByName(character);
        camera.position.copy(davinky.position);
        camera.position.y +=2;
        const direction = new THREE.Vector3();
        davinky.getWorldDirection(direction);
        const newDirect = new THREE.Vector3(0, 0,-1);
        // Set the camera's quaternion to match the character's direction vector
        const targetOrientation = new THREE.Quaternion();
        targetOrientation.setFromUnitVectors(new THREE.Vector3(1, 0, 0), direction);
        camera.quaternion.slerp(targetOrientation, 0.05);    
    }
    else{
        camera.position.set(35, 25, 0);
        camera.lookAt(new Vector3(0, 0, 0));
    }
    
}

// handle collisions with enemies
export function handleUnitCollision(scene, character, sounds){
    let davinky = scene.getObjectByName(character);

    var potentialColliders = scene.enemies;
    var paintBuckets = scene.paintBuckets;

    let davinkyBB = new THREE.Box3().setFromObject(davinky);
    var enemiesBB = [];
    var paintBucketsBB = []

    // handle enemy collisions
    for (let i = 0; i < potentialColliders.length; i++) {
        let enemyBB = new THREE.Box3().setFromObject(potentialColliders[i])
        enemiesBB.push(enemyBB)
    }
    for (let i = 0; i < potentialColliders.length; i++) {
        if (davinkyBB.intersectsBox(enemiesBB[i])) {
            scene.remove(potentialColliders[i]);
            scene.enemies.splice(i, 1);
            scene.score -=1;
            const scoreElement = document.getElementById('score');
            scoreElement.innerHTML = 'Score: ' + (scene.score*(scene.state.FirstPerson ? 2 : 1)+1*scene.state.rotationSpeed).toFixed(2);
            sounds['hurt1'].play();
        }
    }

    // handle paint collisions
    for (let i = 0; i < paintBuckets.length; i++) {
        let paintBB = new THREE.Box3().setFromObject(paintBuckets[i])
        paintBucketsBB.push(paintBB)
    }
    for (let i = 0; i < paintBuckets.length; i++) {
        if (davinkyBB.intersectsBox(paintBucketsBB[i])) {
            scene.remove(paintBuckets[i]);
            scene.paintBuckets.splice(i, 1);
            scene.score += 1;
            const scoreElement = document.getElementById('score');
            scoreElement.innerHTML = 'Score: ' + (scene.score*(scene.state.FirstPerson ? 2 : 1)+1*scene.state.rotationSpeed).toFixed(2);
            sounds['splash1'].play();
        }
    }
}

// Moves enemies positions towards Davinky
export function handleEnemyMovement(scene, character){
    let davinky = scene.getObjectByName(character);
    let enemies = scene.enemies;
    let enemySpeed = 0.005*scene.score;  // make enemies get faster as you get a higher score
    //if(enemySpeed>0.1) enemySpeed =0.09; // set maximum speed
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
    
        // Move the enemy towards the player
        var direction = new THREE.Vector3().subVectors(davinky.position, enemy.position).normalize();
        direction.y = 0;
        enemy.lookAt(davinky.position);
        enemy.position.add(direction.multiplyScalar(enemySpeed));
        
      }
}

// Spawns more enemies on screen
export function handleEnemySpawning(scene){
    let enemies = scene.enemies;
    let numEnemies = enemies.length;
    let maxEnemies = scene.score;
    if(numEnemies < maxEnemies) {
        scene.spawnEnemies(1);
    }
}

// spawn paint balls
export function handlePaintSpawning(scene){
    let paintBuckets = scene.paintBuckets;
    let numBuckets = paintBuckets.length;
    let maxBuckets = 7;
    if(numBuckets < maxBuckets) {
        scene.spawnPaint(1);
    }
}

export function handleCursor(scene, mouse, camera, cursor){
    let enemies = scene.enemies;
    // Function to update the game state

    const worldCoordinates = new THREE.Vector3(mouse.x, mouse.y, 0);
    worldCoordinates.unproject(camera);

    // Update the position of the cursor to match the mouse position
    cursor.position.x = worldCoordinates.x;
    cursor.position.y = worldCoordinates.y;
    cursor.position.z = worldCoordinates.z;

    // Use a raycaster to check if the cursor is intersecting with any enemies
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(cursor.position, camera);

    // ******this line of code needs the enemies bounding boxes--not the enemies itself
    const intersects = raycaster.intersectObjects(enemies);
  
    // If the cursor is intersecting with an enemy, remove it from the scene
    if (intersects.length > 0) {
      scene.remove(intersects[0].object);
      enemies.splice(enemies.indexOf(intersects[0].object), 1);
    }
  
}


