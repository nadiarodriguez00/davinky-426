import * as THREE from "three";
import { Vector2, Vector3 } from "three";

// maintan boolens to keep track if buffer period is active and if 
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
export function handleCharacterControls(scene, keypress, character, camera) {
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
    }

    // Update the position of the davinky based on its velocity
    davinky.position.y += velocity.y;
    // Apply gravity to the davinky velocity to simulate falling
    velocity.y -= gravityCoefficient;
    // If davinky has landed on the ground, stop its vertical velocity and reset the jumping state
    if (davinky.position.y < 0.0) {
        davinky.position.y = 0.0;
        jumping = false; // this makes it so 
    }
}

// handle unit collisions 
// **WE STILL NEED TO PASS IN THREEJS OBJECTS (HITBOXES) IN ORDER FOR THIS TO WORK
// **right now davinky and enemies are undefined because they were loaded in using a gtlf loader.
export function handleUnitCollision(scene, character){
    // First, create a new Raycaster and set its origin to the position of the unit that is moving.
    // The direction of the raycaster should be the direction that the unit is moving in.
    let davinky = scene.getObjectByName(character);
    var direction = new THREE.Vector3(davinky.position).normalize();

    // davinky.getWorldDirection(direction);
    // var unitRaycaster = new THREE.Raycaster(davinky.position, direction);
    // scene.add(new THREE.ArrowHelper(unitRaycaster.ray.direction, unitRaycaster.ray.origin, 300, 0xff0000) );

    // // Next, create an array that will hold all of the objects in the scene that the unit could potentially collide with.

    // // These could be other units, walls, or any other objects that you want the unit to be able to collide with.
    var potentialColliders = scene.enemies;
    // var collisions = [];
    // for (let i = 0; i < potentialColliders.length; i++) {
    //     if (unitRaycaster.intersectObjects(potentialColliders[i])) {
    //         collisions.push(potentialColliders[i])
    //     }
    // }

    // console.log("coll", collisions)

    let davinkyBB = new THREE.Box3().setFromObject(davinky);
    // const dhelper = new THREE.Box3Helper( davinkyBB, 0xff9f90 );
    //     scene.add( dhelper );
    var enemiesBB = [];

    for (let i = 0; i < potentialColliders.length; i++) {
        let enemyBB = new THREE.Box3().setFromObject(potentialColliders[i])
        enemiesBB.push(enemyBB)
        // const helper = new THREE.Box3Helper( enemyBB, 0xffff00 );
        // scene.add( helper );
    }


    for (let i = 0; i < potentialColliders.length; i++) {
        if (davinkyBB.intersectsBox(enemiesBB[i])) {
            scene.remove(potentialColliders[i]);
            enemies.splice(i, 1);
        }
    }



    // Use the raycaster to determine if the unit is colliding with any of the potential colliders.
    // This will return an array of objects that the unit is colliding with.

    //var collisions = unitRaycaster.intersectObjects(potentialColliders);

    // If the array is not empty, then the unit is colliding with something.
    // if (collisions.length > 0) {
    //     console.log("collide")
    // // Here, you can handle the collision by stopping the unit's movement, 
    // // playing a sound effect, or taking any other action that you want to happen when a collision occurs.
    // }
}

// Moves enemies positions towards Davinky
export function handleEnemyMovement(scene, character){
    let davinky = scene.getObjectByName(character);
    let enemies = scene.enemies;
    let enemySpeed = 0.015
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
    
        // Move the enemy towards the player
        var direction = new THREE.Vector3().subVectors(davinky.position, enemy.position).normalize();
        direction.y = 0;
        enemy.lookAt(davinky.position);
        enemy.position.add(direction.multiplyScalar(enemySpeed));
        
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


