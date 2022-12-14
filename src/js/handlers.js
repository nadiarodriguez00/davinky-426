import * as THREE from "three";

// maintan boolens to keep track if buffer period is active and if 
// game is muted
let buffer = false;
let mute = false;

// timer for timeout functions
let timer;

// handle user controls input
export function handleKeyDown(event, keypress) {
    if (event.key == "ArrowUp") keypress['up'] = true;
    if (event.key == "ArrowDown") keypress['down'] = true;
    if (event.key == "ArrowLeft") keypress['left'] = true;
    if (event.key == "ArrowRight") keypress['right'] = true;
}

// terminate the action caused by user controls input
export function handleKeyUp(event, keypress) {
    if (event.key == "ArrowUp") keypress['up'] = false;
    if (event.key == "ArrowDown") keypress['down'] = false;
    if (event.key == "ArrowLeft") keypress['left'] = false;
    if (event.key == "ArrowRight") keypress['right'] = false;
}

// move character and camera position in response to user controls input
export function handleCharacterControls(scene, keypress, character, camera) {
    let davinky = scene.getObjectByName(character);
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

    // if (!plane.state.barrel) {
    //     camera.rotation.z = plane.rotation.z / 3;
    // } else {
    //     camera.rotation.z = plane.state.barrel / 3;
    // }
    //camera.position.y = 2 + plane.rotation.x * 2;
}

// handle unit collisions 
// **WE STILL NEED TO PASS IN THREEJS OBJECTS (HITBOXES) IN ORDER FOR THIS TO WORK
// **right now davinky and enemies are undefined because they were loaded in using a gtlf loader.
export function handleUnitCollision(scene, davinky){
    // First, create a new Raycaster and set its origin to the position of the unit that is moving.
    // The direction of the raycaster should be the direction that the unit is moving in.
    var direction = new THREE.Vector3();
    // davinky.getWorldDirection(direction);
    var unitRaycaster = new THREE.Raycaster(davinky.position, direction);
    // Next, create an array that will hold all of the objects in the scene that the unit could potentially collide with.

    // These could be other units, walls, or any other objects that you want the unit to be able to collide with.
    var potentialColliders = scene.enemies;

    // Use the raycaster to determine if the unit is colliding with any of the potential colliders.
    // This will return an array of objects that the unit is colliding with.
    var collisions = unitRaycaster.intersectObjects(potentialColliders);

    // If the array is not empty, then the unit is colliding with something.
    if (collisions.length > 0) {
    // Here, you can handle the collision by stopping the unit's movement, 
    // playing a sound effect, or taking any other action that you want to happen when a collision occurs.
    }
}

// handle switching between screen states such as menu, game, game over, mute, and pause states
// export function handleScreens(event, screens, document, canvas, character, scene, menuCanvas, sounds, score) {
//     if (event.key == 'm' && !screens['ending'] && !screens['menu']) {
//         mute = !mute;
//         if (!mute && !screens['ending'] && !screens['menu']) {
//             document.getElementById('audio').play();
//             sounds['whirring'].play();
//         }
//         else if (mute) {
//             document.getElementById('audio').pause();
//             sounds['whirring'].stop();
//         }
//     }
//     // quit: game -> ending
//     if (event.key == 'q' && !screens['ending'] && !screens['menu']) {
//         screens['menu'] = false;
//         screens['pause'] = false;
//         screens['ending'] = true;
//         pages.quit(document, score);
//         sounds['whirring'].stop()
//         document.getElementById('audio').pause();

//     }
//     // restart: ending -> menu
//     else if (event.key == " " && screens["ending"]) {
//         let plane = scene.getObjectByName(character);
//         plane.null()
//         screens["ending"] = false;
//         screens['pause'] = false;
//         screens['menu'] = true;
//         pages.init_page(document, menuCanvas)
//     }
//     // start: menu -> game
//     else if (event.key == " " && screens["menu"]) {
//         screens["menu"] = false;
//         pages.start(document, canvas);
//         buffer = false;
//         clearTimeout(timer);

//         if (!mute) {
//             sounds['whirring'].play()
//             document.getElementById('audio').play()
//         }
//     }
//     // unpause: pause -> game
//     else if (event.key == " " && screens["pause"]) {
//         screens["pause"] = false;
//         sounds['whirring'].setVolume(0.4);
//         document.getElementById('audio').volume = 1;
//         let pause = document.getElementById("pause");
//         pause.classList.add('invisible');
//     }
//     // pause: game -> pause
//     else if (event.key == " " && !screens["ending"]) {
//         screens["pause"] = true;
//         sounds['whirring'].setVolume(0.1);
//         document.getElementById('audio').volume = 0.5;

//         let pause = document.getElementById("pause");
//         pause.classList.remove('invisible');
//     }
// }

// // handle collisions with terrain, obstacles, and objectives
// export function handleCollisions(document, scene, character, screens, sounds, score, camera) {
//     let chunkManager = scene.getObjectByName('chunkManager');

//     let obj = scene.getObjectByName(character);
//     let chunkManagerPos = chunkManager.position;
//     let chunkWidth = chunkManager.state.chunkWidth;
//     let chunkLine = chunkManager.getCurrentChunkLine(); // TODO: change to current chunk
//     let chunk = chunkManager.getCurrentChunk(); // TODO: change to current chunk
//     let heightMap = chunk.heightMap;


//     let i = Math.floor((chunkWidth - (chunkManagerPos.z - chunkManager.anchor.z)) / chunkWidth * (heightMap.length - 1));
//     let j = Math.floor((-(chunkManagerPos.x + chunkLine.position.x) + chunkWidth / 2) / chunkWidth * (heightMap.length - 1));
//     // ensure that both (i,j) and (i+1,j+1) are valid coordinates
//     if (i == heightMap.length - 1) { i--; }
//     if (j == heightMap.length - 1) { j--; }

//     // Collide with terrain (chunk)
//     // chunkWorldPos is how much the ground has risen, vWorldPos is chunk height at cur point
//     let chunkWorldPos = new THREE.Vector3();
//     chunk.getWorldPosition(chunkWorldPos);

//     // check square around current vWorldPos
//     // vWorldPos1, vWorldPos2, vWorldPos3 form a triangle; vWorldPos2, vWorldPos3, vWorldPos4 form the other triangle
//     const vWorldPos1 = chunk.getPositionAtCoords(i, j).add(chunkWorldPos);
//     const vWorldPos2 = chunk.getPositionAtCoords(i, j + 1).add(chunkWorldPos);
//     const vWorldPos3 = chunk.getPositionAtCoords(i + 1, j).add(chunkWorldPos);
//     const vWorldPos4 = chunk.getPositionAtCoords(i + 1, j + 1).add(chunkWorldPos);

//     let interp = new THREE.Vector3();
//     const area2 = chunkManager.state.segmentWidth * chunkManager.state.segmentWidth;
//     if (!(vWorldPos1.x <= 0 && vWorldPos4.x >= 0 && vWorldPos1.z <= 0 && vWorldPos4.z >= 0)) {
//     } else {
//         if (-vWorldPos2.z * (vWorldPos3.x - vWorldPos2.x) >= -vWorldPos2.x * (vWorldPos3.z - vWorldPos2.z)) {
//             const baryCoord1 = (vWorldPos2.x * vWorldPos3.z - vWorldPos2.z * vWorldPos3.x) / area2;
//             const baryCoord2 = (vWorldPos3.x * vWorldPos1.z - vWorldPos3.z * vWorldPos1.x) / area2;
//             const baryCoord3 = (vWorldPos1.x * vWorldPos2.z - vWorldPos1.z * vWorldPos2.x) / area2;
//             interp = vWorldPos1.multiplyScalar(baryCoord1).add(vWorldPos2.multiplyScalar(baryCoord2)).add(vWorldPos3.multiplyScalar(baryCoord3));
//         } else {
//             const baryCoord3 = (vWorldPos2.x * vWorldPos4.z - vWorldPos2.z * vWorldPos4.x) / area2;
//             const baryCoord4 = (vWorldPos3.x * vWorldPos2.z - vWorldPos3.z * vWorldPos2.x) / area2;
//             const baryCoord2 = (vWorldPos4.x * vWorldPos3.z - vWorldPos4.z * vWorldPos3.x) / area2;
//             interp = vWorldPos2.multiplyScalar(baryCoord2).add(vWorldPos3.multiplyScalar(baryCoord3)).add(vWorldPos4.multiplyScalar(baryCoord4));
//         }
//     }



//     if (interp.y > obj.position.y) {
        
//         let fillScreen = document.getElementById('fillScreen');
//         fillScreen.classList.add('death');
//         setTimeout(function() {
//             fillScreen.classList.remove('death');
//         }, 3000);
//         screens['ending'] = true;
        
//         pages.quit(document, score);

//         if (!mute) 
//         {
//             sounds['explosion'].play();
//             sounds['whirring'].stop();
//             document.getElementById('audio').pause();
//         }
//     }



//     for (const reward of chunkManager.getCurrentRewards()) {
//         const rewardWorldPos = new THREE.Vector3();
//         reward.getWorldPosition(rewardWorldPos)

//         if (obj.position.distanceTo(rewardWorldPos) < 15) {
//             obj.state.reward = true
//             if (!mute) sounds['powerup'].play();
//             sounds['whirring'].setVolume(1)

//             setTimeout(function() {
//                 sounds['whirring'].setVolume(0.4)
//             }, 2000);

//             if (chunkManager.state.climbing == 0) {
//                 chunkManager.state.climbing = 1;
//             }
//             break;
//         }
//     }

//     if (!buffer) {
//         let clouds = [];

//         scene.traverseVisible(function(child) {
//             if (child.name === "cloud") {
//                 let vector_pos = new THREE.Vector3();
//                 child.getWorldPosition(vector_pos);

//                 if (vector_pos.z > -100 && vector_pos.z < 100 && vector_pos.x > -50 && vector_pos.x < 50) {
//                     clouds.push(child);
//                 }

//             }
//         });

//         let meshes = [];
//         let plane = [];
//         clouds.forEach(cloud => {
//             utils.findType(cloud, 'Mesh', meshes)
//         })
//         utils.findType(obj, 'Mesh', plane);
//         let pos = plane[0].geometry.attributes.position;
//         let norm = plane[0].geometry.attributes.normal;
//         const vector_pos = new THREE.Vector3();
//         const vector_norm = new THREE.Vector3();

//         function collideCloud() {
//             obj.state.hit = true;
//             buffer = true;
//             if (chunkManager.state.falling == 0) {
//                 chunkManager.state.falling = 1;
//             }
//             let fillScreen = document.getElementById('fillScreen');
//             fillScreen.classList.add('red');
//             setTimeout(function() {
//                 fillScreen.classList.remove('red');
//             }, 500);
//             if (!mute) sounds['damage'].play();

//             timer = setTimeout(function() { buffer = false; }, 2500);
//         }

//         let raytip = new THREE.Raycaster(plane[0].tip, new THREE.Vector3(0, 0, -1));
//         let raycollisions = raytip.intersectObjects(meshes, false);
//         if (raycollisions.length != 0 && raycollisions[0].distance < 0.5) {
//             collideCloud();
//             return;
//         }

//         for (let i = 0; i < pos.count; i += 1) {
//             vector_pos.fromBufferAttribute(pos, i);
//             vector_pos.add(obj.position)
//             vector_pos.z -= 12;
//             vector_pos.y -= 2.5;
//             vector_norm.fromBufferAttribute(norm, i);

//             vector_pos.add(obj.position);
//             let ray = new THREE.Raycaster(vector_pos, vector_norm);
//             let collisions = ray.intersectObjects(meshes, false);
//             if (collisions.length != 0 && collisions[0].distance < 0.5) {
//                 collideCloud();
//                 break;
//             }
//         }
//     }
// }


// update score counter on the top left corner of game screen
// export function updateScore(document, score) {
//     let scoreCounter = document.getElementById('score');
//     scoreCounter.innerHTML = 'Score: '.concat(score != "Infinity" ? score : "∞");
// }
