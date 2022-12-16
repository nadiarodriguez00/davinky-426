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

import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
// Import the Object3D class
import { Object3D } from 'three';
import *  as handlers from './js/handlers.js';


// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

//// score display ///////////////////////////////////////
// Create a new CSS3DRenderer instance
const cssRenderer = new CSS3DRenderer();
// Create a new HTML element
const element = document.createElement('div');

// Set the HTML content of the element
element.innerHTML = '<div id="score">Score: 0</div>';

// Create a new Object3D instance
const object = new Object3D();

// Add the HTML element as a child of the Object3D
object.add(element);

// Add the Object3D to the scene
scene.add(object);

// Add the HTML element to the page
document.body.appendChild(element);

// Set the position and rotation of the HTML element using the Object3D
object.position.set(0, 0, 1);
object.rotation.set(0, 0, Math.PI / 2);

/////////////////////////////////////////////////////////////////////////

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

////////////////////////// AUDIO //////////////////////////////////////////

let listener = new THREE.AudioListener;
camera.add(listener);
let sounds = [];
let celebrate1 = new THREE.Audio(listener);
let happy1 = new THREE.Audio(listener);
let happy2 = new THREE.Audio(listener);
let hurt1 = new THREE.Audio(listener);
let hurt2 = new THREE.Audio(listener);
let jump1 = new THREE.Audio(listener);
let jump2 = new THREE.Audio(listener);
let jump3 = new THREE.Audio(listener);
let land1 = new THREE.Audio(listener);
let land2 = new THREE.Audio(listener);
let land3 = new THREE.Audio(listener);
let sad1 = new THREE.Audio(listener);
let sad2 = new THREE.Audio(listener);
let splash1 = new THREE.Audio(listener);
let splash2 = new THREE.Audio(listener);
sounds['celebrate1'] = celebrate1;
sounds['happy1'] = happy1;
sounds['happy2'] = happy2;
sounds['hurt1'] = hurt1;
sounds['hurt2'] = hurt2;
sounds['jump1'] = jump1;
sounds['jump2'] = jump2;
sounds['jump3'] = jump3;
sounds['land1'] = land1;
sounds['land2'] = land2;
sounds['land3'] = land3;
sounds['sad1'] = sad1;
sounds['sad2'] = sad2;
sounds['splash1'] = splash1;
sounds['splash2'] = splash2;

let audioLoader = new THREE.AudioLoader();
audioLoader.load('https://raw.githubusercontent.com/nadiarodriguez00/davinky-426/main/src/sounds/celebrate1.wav', function(buffer) {
    celebrate1.setBuffer(buffer);
    celebrate1.setLoop(false);
    celebrate1.setVolume(0.4);
});
audioLoader.load('https://raw.githubusercontent.com/nadiarodriguez00/davinky-426/main/src/sounds/hurt1.wav', function(buffer) {
    hurt1.setBuffer(buffer);
    hurt1.setLoop(false);
    hurt1.setVolume(0.4);
});
audioLoader.load('https://raw.githubusercontent.com/nadiarodriguez00/davinky-426/main/src/sounds/jump1.wav', function(buffer) {
    jump1.setBuffer(buffer);
    jump1.setLoop(false);
    jump1.setVolume(0.4);
});
audioLoader.load('https://raw.githubusercontent.com/nadiarodriguez00/davinky-426/main/src/sounds/land1.wav', function(buffer) {
    land1.setBuffer(buffer);
    land1.setLoop(false);
    land1.setVolume(0.4);
});
audioLoader.load('https://raw.githubusercontent.com/nadiarodriguez00/davinky-426/main/src/sounds/sad1.wav', function(buffer) {
    sad1.setBuffer(buffer);
    sad1.setLoop(false);
    sad1.setVolume(0.4);
});
audioLoader.load('https://raw.githubusercontent.com/nadiarodriguez00/davinky-426/main/src/sounds/splash1.wav', function(buffer) {
    splash1.setBuffer(buffer);
    splash1.setLoop(false);
    splash1.setVolume(0.4);
});

//////////////////////////////////////////////////////////////////////////////////

const character = 'davinky';
const keypress = {};

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    // Use the Object3D to update the position and rotation of the HTML element
    object.updateMatrixWorld();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
    handlers.handleCharacterControls(scene, keypress, character, camera, sounds);
    handlers.handleUnitCollision(scene, character, sounds, document);
    handlers.handleEnemyMovement(scene, character);
    handlers.handleEnemySpawning(scene);
    handlers.handlePaintSpawning(scene);
    handlers.handleCameraAngle(scene, character, camera);
    handlers.handleBoundaries(scene, character, sounds);
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



