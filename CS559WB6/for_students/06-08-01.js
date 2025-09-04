/**
 * CS559 Spring 2023 Example Solution
 * Written by CS559 course staff
 */

/**
 * 06-08-01.js - a simple JavaScript file that gets loaded with
 * page 8 of Workbook 7 (CS559).
 *
 * written by Michael Gleicher, January 2019
 * modified January 2020
 */

// @ts-check
/* jshint -W069, esversion:6 */

import * as T from "../libs/CS559-Three/build/three.module.js";
import { OrbitControls } from "../libs/CS559-Three/examples/jsm/controls/OrbitControls.js";

let renderer = new T.WebGLRenderer();
renderer.setSize(500, 500);
document.getElementById("div1").appendChild(renderer.domElement);

// student does the rest.
// Begin Example Solution
// Add scene
/** @type {T.Scene} */ const scene = new T.Scene();
// Add camera
/** @type {T.PerspectiveCamera} */ const camera = new T.PerspectiveCamera();
camera.position.set(0, 7.5, 7.5);
camera.lookAt(0, 5, 0);
// Add lights
/** @type {T.DirectionalLight} */ const light = new T.DirectionalLight("white", 1);
light.position.set(10, 10, 10);
scene.add(light);
// Make a ground plane
/** @type {T.Mesh} */ const groundMesh = new T.Mesh(new T.BoxGeometry(6, 0.1, 6), new T.MeshStandardMaterial({ color: 0x888888 }));
let groundLevel = -1.5;
// Put the top of the box at the ground level (0)
groundMesh.position.y = -0.05 + groundLevel;
scene.add(groundMesh);
// Create snow material
/** @type {T.MeshStandardMaterial} */ const snow = new T.MeshStandardMaterial({color: "White", roughness: 1.0});
// Create eye material
/** @type {T.MeshStandardMaterial} */ const glass = new T.MeshStandardMaterial({color: "red", metalness: 1.0});
// Create hands material
/** @type {T.MeshStandardMaterial} */ const tree = new T.MeshStandardMaterial({color: "brown", roughness: 1.0});
// Create hat material
/** @type {T.MeshStandardMaterial} */ const cloth = new T.MeshStandardMaterial({color: "blue", roughness: 1.0, metalness: 1.0});
// Create button material
/** @type {T.MeshStandardMaterial} */ const plastic = new T.MeshStandardMaterial({color: "green", roughness: 0.0, metalness: 0.0});
// Create sphere geometry
/** @type {T.SphereGeometry} */ const sphere = new T.SphereGeometry(1, 20, 20);
// Create cone geometry
/** @type {T.ConeGeometry} */ const cone = new T.ConeGeometry(1, 5, 20, 20);
// Create thin cylinder
/** @type {T.CylinderGeometry} */ const cylinder = new T.CylinderGeometry(1, 1, 5, 20, 20);
// Make a body
/** @type {T.Mesh} */ const body = new T.Mesh(sphere, snow);
body.position.set(0, 1.8, 0); // CS559 Sample Code
// Make a base
/** @type {T.Mesh} */ const base = new T.Mesh(sphere, snow);
base.position.set(0, 0, 0); // CS559 Sample Code
base.scale.set(1.5, 1.5, 1.5);
// Make a head
/** @type {T.Mesh} */ const head = new T.Mesh(sphere, snow);
head.position.set(0, 3.2, 0); // CS559 Sample Code
head.scale.set(0.8, 0.8, 0.8);
// Add everything to the scene, could use a group
scene.add(body, base, head);
/**
 * Function to rotate an object along the surface of a sphere
 * @param {T.Mesh} obj The object
 * @param {number} theta Angle 1
 * @param {number} phi Angle 2
 */
function move(obj = new T.Mesh(sphere, glass), theta = 0, phi = 0) {
    obj.position.set(Math.sin(theta * Math.PI) * Math.sin(phi * Math.PI), Math.cos(phi * Math.PI), Math.cos(theta * Math.PI) * Math.sin(phi * Math.PI));
}
// Make eyes
/** @type {T.Mesh} */ const leftEye = new T.Mesh(sphere, glass);
move(leftEye, 0.15, 0.4); // CS559 Sample Code
leftEye.scale.set(0.15, 0.15, 0.15);
/** @type {T.Mesh} */ const rightEye = new T.Mesh(sphere, glass);
move(rightEye, -0.15, 0.4); // CS559 Sample Code
rightEye.scale.set(0.15, 0.15, 0.15);
// Make nose
/** @type {T.Mesh} */ const nose = new T.Mesh(cone, glass);
move(nose, 0, 0.5); // CS559 Sample Code
nose.scale.set(0.25, 0.25, 0.25);
nose.rotateX(Math.PI / 2);
head.add(leftEye, rightEye, nose);
// Make arms
/** @type {T.Mesh} */ const leftArm = new T.Mesh(cylinder, tree);
move(leftArm, 0.5, 0.5); // CS559 Sample Code
leftArm.scale.set(0.1, 0.5, 0.1);
leftArm.rotateZ(Math.PI / 3);
/** @type {T.Mesh} */ const rightArm = new T.Mesh(cylinder, tree);
move(rightArm, 0.5, -0.5); // CS559 Sample Code
rightArm.scale.set(0.1, 0.5, 0.1);
rightArm.rotateZ(Math.PI / 3);
body.add(leftArm, rightArm);
// Make hands
/** @type {T.Mesh} */ const leftHand = new T.Mesh(cylinder, tree);
leftHand.position.set(0, -2, 0); // CS559 Sample Code
leftHand.scale.set(0.5, 2, 0.1);
leftHand.rotateX(Math.PI / 2);
leftArm.add(leftHand);
/** @type {T.Mesh} */ const rightHand = new T.Mesh(cylinder, tree);
rightHand.position.set(0, 2, 0); // CS559 Sample Code
rightHand.scale.set(0.5, 2, 0.1);
rightHand.rotateX(Math.PI / 2);
rightArm.add(rightHand);
// Make mouth
/** @type {T.Mesh[]} */ const mouths = [];
for (let i = 0; i < 4; i++) {
    mouths[i] = new T.Mesh(sphere, glass);
    move(mouths[i], 0.05 * i - 0.075, 0.6); // CS559 Sample Code
    mouths[i].scale.set(0.05, 0.05, 0.05);
    head.add(mouths[i]);
}
// Make hat
/** @type {T.Mesh} */ const hat = new T.Mesh(cylinder, cloth);
hat.position.set(0, 1, 0); // CS559 Sample Code
hat.scale.set(0.7, 0.2, 0.7);
/** @type {T.Mesh} */ const hatEdge = new T.Mesh(cylinder, cloth);
hatEdge.position.set(0, 0.7, 0); // CS559 Sample Code
hatEdge.scale.set(1.4, 0.02, 1.4);
head.add(hat, hatEdge);
// Make buttons
/** @type {T.Mesh[]} */ const buttons = [];
for (let i = 0; i < 3; i++) {
    buttons[i] = new T.Mesh(sphere, plastic);
    move(buttons[i], 0, 0.3 + 0.1 * i); // CS559 Sample Code
    buttons[i].scale.set(0.1, 0.1, 0.1);
    body.add(buttons[i]);
}
// Add snow flake at random positions
/** @type {T.Mesh[]} */ const snowflake = [];
/** @type {number[][]} */ const snows = [];
for (let i = 0; i < 100; i++) {
    // Compute random locations and sizes
    snows[i] = [Math.random() * 6 - 3, Math.random() * 5, Math.random() * 6 - 3, 0.05 + 0.05 * Math.random()];
    // Create the snowflake
    snowflake[i] = new T.Mesh(sphere, snow);
    snowflake[i].position.set(snows[i][0], snows[i][1], snows[i][2]);
    snowflake[i].scale.set(snows[i][3], snows[i][3], snows[i][3]);
    scene.add(snowflake[i]);
}
//Set OrbitControls
let controls = new OrbitControls(camera, renderer.domElement);
controls.keys = {
    LEFT: 65, //left arrow
    UP: 87, // up arrow
    RIGHT: 68, // right arrow
    BOTTOM: 83 // down arrow
};
// Add animation loop for OrbitControls
/** @type {number} */ let angle = 0;
/** @type {number} */ let direction = 1;
/**
 * The main draw function, does not use timeStamp
 */
function draw() {
    // Move the arms up and down, change direction when angle is larger than 45 degrees
    angle += direction * 0.01;
    // Bound the angle of the hands by 0 and 0.5
    if (angle <= 0 || angle >= 0.5) direction *= -1;
    // Rotate the arms
    leftArm.rotateZ(direction * 0.01 * Math.PI);
    rightArm.rotateZ(direction * 0.01 * Math.PI);
    // Move the snowflakes down by 1 and to the left or right randomly
    snowflake.forEach(function(flake, i) {
        // Update the position of the snow
        snows[i][1] -= 0.01;
        snows[i][0] += 0.02 * (Math.random() - 0.5);
        snows[i][2] += 0.02 * (Math.random() - 0.5);
        // Move the snow back up to the top when they hit the ground
        if (snows[i][1] < groundLevel) {
            snows[i][1] = 5;
            snows[i][3] = 0.05 + 0.05 * Math.random();
        }
        // Reset the position of the meshes
        flake.position.set(snows[i][0], snows[i][1], snows[i][2]);
    });
    renderer.render(scene, camera);
    window.requestAnimationFrame(draw);
}
window.requestAnimationFrame(draw);
// End Example Solution

