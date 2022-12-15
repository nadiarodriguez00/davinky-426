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

// audio
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

// audio ////////////////////////////
let audioLoader = new THREE.AudioLoader();
audioLoader.load('https://github.com/nadiarodriguez00/davinky-426/raw/main/src/sounds/celebrate1.wav', function(buffer) {
    celebrate1.setBuffer(buffer);
    celebrate1.setLoop(false);
    celebrate1.setVolume(0.4);
});

audioLoader.load('https://github.com/nadiarodriguez00/davinky-426/raw/main/src/sounds/happy1.wav', function(buffer) {
    happy1.setBuffer(buffer);
    happy1.setLoop(false);
    happy1.setVolume(0.4);
});

audioLoader.load('https://github.com/nadiarodriguez00/davinky-426/raw/main/src/sounds/happy2.wav', function(buffer) {
    happy2.setBuffer(buffer);
    happy2.setLoop(false);
    happy2.setVolume(0.4);
});

audioLoader.load('https://github.com/nadiarodriguez00/davinky-426/raw/main/src/sounds/hurt1.wav', function(buffer) {
    hurt1.setBuffer(buffer);
    hurt1.setLoop(false);
    hurt1.setVolume(0.4);
});

audioLoader.load('https://github.com/nadiarodriguez00/davinky-426/raw/main/src/sounds/hurt2.wav', function(buffer) {
    hurt2.setBuffer(buffer);
    hurt2.setLoop(false);
    hurt2.setVolume(0.4);
});

audioLoader.load('https://github.com/nadiarodriguez00/davinky-426/raw/main/src/sounds/jump1.wav', function(buffer) {
    jump1.setBuffer(buffer);
    jump1.setLoop(false);
    jump1.setVolume(0.4);
});

audioLoader.load('https://github.com/nadiarodriguez00/davinky-426/raw/main/src/sounds/jump2.wav', function(buffer) {
    jump2.setBuffer(buffer);
    jump2.setLoop(false);
    jump2.setVolume(0.4);
});

audioLoader.load('https://github.com/nadiarodriguez00/davinky-426/raw/main/src/sounds/jump3.wav', function(buffer) {
    jump3.setBuffer(buffer);
    jump3.setLoop(false);
    jump3.setVolume(0.4);
});

audioLoader.load('https://github.com/nadiarodriguez00/davinky-426/raw/main/src/sounds/land1.wav', function(buffer) {
    land1.setBuffer(buffer);
    land1.setLoop(false);
    land1.setVolume(0.4);
});

audioLoader.load('https://github.com/nadiarodriguez00/davinky-426/raw/main/src/sounds/land2.wav', function(buffer) {
    land2.setBuffer(buffer);
    land2.setLoop(false);
    land2.setVolume(0.4);
});

audioLoader.load('https://github.com/nadiarodriguez00/davinky-426/raw/main/src/sounds/land3.wav', function(buffer) {
    land3.setBuffer(buffer);
    land3.setLoop(false);
    land3.setVolume(0.4);
});

audioLoader.load('https://github.com/nadiarodriguez00/davinky-426/raw/main/src/sounds/sad1.wav', function(buffer) {
    sad1.setBuffer(buffer);
    sad1.setLoop(false);
    sad1.setVolume(0.4);
});

audioLoader.load('https://github.com/nadiarodriguez00/davinky-426/raw/main/src/sounds/sad2.wav', function(buffer) {
    sad2.setBuffer(buffer);
    sad2.setLoop(false);
    sad2.setVolume(0.4);
});

audioLoader.load('https://github.com/nadiarodriguez00/davinky-426/raw/main/src/sounds/splash1.wav', function(buffer) {
    splash1.setBuffer(buffer);
    splash1.setLoop(false);
    splash1.setVolume(0.4);
});

audioLoader.load('https://github.com/nadiarodriguez00/davinky-426/raw/main/src/sounds/splash2.wav', function(buffer) {
    splash2.setBuffer(buffer);
    splash2.setLoop(false);
    splash2.setVolume(0.4);
});
//////////////////////////////////////////////////////////////////////////////////

const character = 'davinky';
const keypress = {};

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    //score = 0;
    // controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
    handlers.handleCharacterControls(scene, keypress, character, camera, sounds);
    handlers.handleUnitCollision(scene, character);
    handlers.handleEnemyMovement(scene, character);
    // handlers.handleCursor(scene, mouse, camera, cursor);
    handlers.handleEnemySpawning(scene);
    handlers.handlePaintSpawning(scene);
    //handlers.handleEnemyCulling(scene, character);
    handlers.handleCameraAngle(scene, character, camera);
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



