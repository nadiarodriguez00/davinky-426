/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { SeedScene } from 'scenes';
import * as THREE from "three";

import *  as handlers from './js/handlers.js';


// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

// Set up camera
camera.position.set(35, 25, 0);
camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.enablePan = false;
// controls.minDistance = 4;
// controls.maxDistance = 40;
// controls.update();

/////////////
const character = 'davinky';
const keypress = {};

// // Create a sphere to represent the player's mouse cursor
// const cursorRadius = 0.1;
// const cursorGeometry = new THREE.SphereGeometry(cursorRadius, 32, 32);
// const cursorMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
// const cursor = new THREE.Mesh(cursorGeometry, cursorMaterial);

// // Add the cursor to the scene
// scene.add(cursor);

// // Initialize the mouse.x and mouse.y variables to 0
// let mouse = {
//   x: 0,
//   y: 0
// };

// // Add an event listener to the document to listen for the mousemove event
// document.addEventListener('mousemove', (event) => {
//   // Update the mouse.x and mouse.y values with the event.clientX and event.clientY values
//   mouse.x = event.clientX;
//   mouse.y = event.clientY;
// });

let firstPersonOn = false;

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    //score = 0;
    // controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
    handlers.handleCharacterControls(scene, keypress, character, camera);
    handlers.handleUnitCollision(scene, character);
    handlers.handleEnemyMovement(scene, character);
    // handlers.handleCursor(scene, mouse, camera, cursor);
    handlers.handleEnemySpawning(scene, character);
    handlers.handlePaintSpawning(scene, character);
    //handlers.handleEnemyCulling(scene, character);
  };
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
window.addEventListener('keydown', event => handlers.handleKeyDown(event, keypress), false);
window.addEventListener('keyup', event => handlers.handleKeyUp(event, keypress), false);



