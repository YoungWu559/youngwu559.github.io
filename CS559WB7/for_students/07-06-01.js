/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/*jshint esversion: 6 */
// @ts-check

/**
 * Minimal Starter Code for the QuadCopter assignment
 */

import * as T from "../libs/CS559-Three/build/three.module.js";
import { OrbitControls } from "../libs/CS559-Three/examples/jsm/controls/OrbitControls.js";


let renderer = new T.WebGLRenderer();
renderer.setSize(600, 400);
document.body.appendChild(renderer.domElement);

let scene = new T.Scene();
let camera = new T.PerspectiveCamera(
  40,
  renderer.domElement.width / renderer.domElement.height,
  1,
  1000
);

camera.position.z = 10;
camera.position.y = 5;
camera.position.x = 5;
camera.lookAt(0, 0, 0);

// since we're animating, add OrbitControls
let controls = new OrbitControls(camera, renderer.domElement);

scene.add(new T.AmbientLight("white", 0.2));

// two lights - both a little off white to give some contrast
let dirLight1 = new T.DirectionalLight(0xf0e0d0, 1);
dirLight1.position.set(1, 1, 0);
scene.add(dirLight1);

let dirLight2 = new T.DirectionalLight(0xd0e0f0, 1);
dirLight2.position.set(-1, 1, -0.2);
scene.add(dirLight2);

// make a ground plane
let groundBox = new T.BoxGeometry(10, 0.1, 10);
let groundMesh = new T.Mesh(
  groundBox,
  new T.MeshStandardMaterial({ color: 0x88b888, roughness: 0.9 })
);
// put the top of the box at the ground level (0)
groundMesh.position.y = -0.05;
scene.add(groundMesh);

// this is the part the student should change
//** GET RID OF THIS SILLY DONUT! Replace it with an aircraft*/
let tempGeom = new T.TorusGeometry();
let tempMaterial = new T.MeshStandardMaterial({ color: "red" });
let tempMesh = new T.Mesh(tempGeom, tempMaterial);
// scene.add(tempMesh);
tempMesh.scale.set(0.5, 0.5, 0.5);
tempMesh.position.y = 2;

// Begin Example Solution
// Enable Shadow
renderer.shadowMap.enabled = true;
// Set the lights
dirLight1.castShadow = true;
dirLight1.position.set(5, 5, 0);
dirLight2.castShadow = false;
/** @type {T.Group} */ const ground = new T.Group();
ground.add(groundMesh);
scene.add(ground);
/**
 * Enable shadow on all children of the group
 * @param {T.Group} group The group
 */
function shadow(group = ground) {
  // Use traverse if children have children
  group.children.forEach(function (component) {
    component.castShadow = true;
    component.receiveShadow = true;
  });
}
shadow();
// Create materials to be used for copters
/** @type {T.BoxGeometry} */ const box = new T.BoxGeometry();
/** @type {T.MeshPhongMaterial} */ const red = new T.MeshPhongMaterial({ color: "red" });
/** @type {T.MeshPhongMaterial} */ const green = new T.MeshPhongMaterial({ color: "green" });
/** @type {T.MeshPhongMaterial} */ const blue = new T.MeshPhongMaterial({ color: "blue" });
// QuadCopter group
/** @type {T.Group} */ const quadCopter = new T.Group();
quadCopter.position.y = 2;
quadCopter.scale.set(0.5, 0.5, 0.5);
scene.add(quadCopter);
// Body of quadCopter
/** @type {T.Mesh} */ const body = new T.Mesh(box, red);
body.scale.set(2, 1, 1); // CS559 Sample Code
/** @type {T.Mesh[]} */ const arms = [];
/** @type {T.Mesh[]} */ const propellers = [];
for (let i = -1; i <= 1; i += 2) {
// Two arms
/** @type {T.Mesh} */ const arm = new T.Mesh(box, green);
  arm.scale.set(0.2, 4, 0.2); // CS559 Sample Code
  arm.rotateZ(Math.PI / 4 * i);
  arms.push(arm);
  for (let j = -1; j <= 1; j += 2) {
  // Four propellers
  /** @type {T.Mesh} */ const propeller = new T.Mesh(box, blue);
    propeller.position.set(i * Math.sqrt(2), j * Math.sqrt(2), 0);
    propeller.scale.set(0.2, 1.5, 0.1); // CS559 Sample Code
    propellers.push(propeller);
  }
}
// Add everything and shadow to the group
quadCopter.add(body, ...arms, ...propellers);
shadow(quadCopter);
// Create materials for the helicopter
/** @type {T.SphereGeometry} */ const sphere = new T.SphereGeometry();
/** @type {T.SphereGeometry} */ const quarterSphere = new T.SphereGeometry(1, 20, 20, 0, Math.PI / 2, 0, Math.PI);
/** @type {T.CylinderGeometry} */ const cylinder = new T.CylinderGeometry();
/** @type {T.MeshPhongMaterial} */ const silver = new T.MeshPhongMaterial({ color: "silver" });
/** @type {T.MeshPhongMaterial} */ const glass = new T.MeshPhongMaterial({ color: "blue" });
// Helicopter group
/** @type {T.Group} */ const helicopter = new T.Group();
helicopter.position.set(-3, 1, -3);
helicopter.scale.set(0.5, 0.5, 0.5); // CS559 Sample Code
scene.add(helicopter);
// Helicopter body
/** @type {T.Mesh} */ const main = new T.Mesh(sphere, silver);
main.scale.set(1.5, 1, 1); // CS559 Sample Code
// Helicopter glass window
/** @type {T.Mesh} */ const front = new T.Mesh(quarterSphere, glass);
front.scale.set(1.55, 1.05, 1.05); // CS559 Sample Code
front.rotateX(-Math.PI / 2);
// Helicopter leg
/** @type {T.Mesh} */ const leg = new T.Mesh(cylinder, silver);
leg.position.set(1.5, 0, 0);
leg.scale.set(0.25, 3, 0.25); // CS559 Sample Code
leg.rotateZ(Math.PI / 2);
// Helicopter tail propeller
/** @type {T.Mesh} */ const tail = new T.Mesh(box, silver);
tail.position.set(3, 0, 0);
tail.scale.set(0.2, 2, 0.2); // CS559 Sample Code
// Helicopter top propeller
/** @type {T.Mesh} */ const wing = new T.Mesh(box, silver);
wing.position.set(0, 1.1, 0);
wing.scale.set(0.2, 5, 0.6); // CS559 Sample Code
wing.rotateZ(Math.PI / 2);
// Add everything and shadow to the group
helicopter.add(main, front, leg, tail, wing);
shadow(helicopter);
// Creates points for radar dish
/** @type {T.Vector2[]} */ const points = [];
for (let i = -3; i < 10; i++) points.push(new T.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));
// Create materials for the radar dish
/** @type {T.LatheGeometry} */ const lathe = new T.LatheGeometry(points, 40);
/** @type {T.MeshPhongMaterial} */ const glowRed = new T.MeshPhongMaterial({ color: "red", emissive: "red", transparent: true, opacity: 0.4 });
// Radar group
/** @type {T.Group} */ const radar = new T.Group();
radar.scale.set(0.03, 0.03, 0.03); // CS559 Sample Code
scene.add(radar);
// Radar dish surface
/** @type {T.Mesh} */ const dish = new T.Mesh(lathe, silver);
dish.position.set(0, 0, -20);
// Cover for radar dish
/** @type {T.Mesh} */ const lid = new T.Mesh(cylinder, silver);
lid.position.set(0, 7, -20);
lid.scale.set(15, 1, 15); // CS559 Sample Code
// Laser beam from radar to quadcopter
/** @type {T.Mesh} */ const laser = new T.Mesh(cylinder, glowRed);
laser.position.set(0, 60, -20);
laser.scale.set(1, 120, 1); // CS559 Sample Code
// Add everything and shadow to the group
radar.add(dish, lid, laser);
shadow(radar);
laser.castShadow = false;
// Create materials for the bowl
/** @type {T.SphereGeometry} */ const semiSphere = new T.SphereGeometry(1, 20, 20, 0, Math.PI, Math.PI * 2, Math.PI);
// Bowl group
/** @type {T.Group} */ const bowl = new T.Group();
bowl.scale.set(0.5, 0.5, 0.5); // CS559 Sample Code
bowl.position.set(5, 1, 5);
scene.add(bowl);
// Bowl dish surface
/** @type {T.Mesh} */ const base = new T.Mesh(semiSphere, silver);
base.rotateX(Math.PI);
// Cover for bowl dish
/** @type {T.Mesh} */ const cover = new T.Mesh(cylinder, silver);
cover.scale.set(1, 0.05, 1); // CS559 Sample Code
cover.rotateX(Math.PI / 2);
// Laser beam from radar to quadCopter
/** @type {T.Mesh} */ const beam = new T.Mesh(cylinder, glowRed);
beam.position.set(0, 0, 15);
beam.scale.set(0.05, 30, 0.05); // CS559 Sample Code
beam.rotateX(Math.PI / 2);
// Add everything and shadow to the group
bowl.add(base, cover, beam);
shadow(bowl);
beam.castShadow = false;
// Landing pad
/** @type {T.Mesh} */ const land = new T.Mesh(cylinder, glowRed);
land.scale.set(0, 0, 0);
scene.add(land);
// Initialize the two positions and the angle
/** @type {number} */ let t = 0;
/** @type {number} */ let oldX = -3;
/** @type {number} */ let oldY = -3;
/** @type {number} */ let newX = 3;
/** @type {number} */ let newY = 3;
/** @type {number} */ let oldA = Math.atan2(newY - oldY, newX - oldX);
/** @type {number} */ let newA = oldA;
// End Example Solution

// animation loop
function animateLoop(timestamp) {
  //** EXAMPLE CODE - STUDENT SHOULD REPLACE */
  // move in a circle
  let theta = timestamp / 1000;
  let x = 3 * Math.cos(theta);
  let z = 3 * Math.sin(theta);
  tempMesh.position.x = x;
  tempMesh.position.z = z;

  // Begin Example Solution
  quadCopter.position.x = x;
  quadCopter.position.z = z;
  quadCopter.lookAt(radar.position);
  // Rotate quadCopter body and propellers
  quadCopter.rotateX(0.35 * Math.PI);
  propellers.forEach(function (propeller) { propeller.rotateZ(0.25); });
  // Rotate helicopter propellers
  wing.rotateX(0.25);
  tail.rotateZ(0.25);
  // Update the position of the helicopter
  if (newA == oldA) {
    // (x, z) position is the linear interpolation between the old and new location
    // (y) position is an arbitrary quadratic function in the time
    helicopter.position.set(oldX * (1 - t) + newX * t, -12 * t * t + 12 * t + 1, oldY * (1 - t) + newY * t);
    helicopter.lookAt(newX, -12 * t * t + 12 * t + 1, newY);
    helicopter.rotateY(Math.PI / 2);
    // Decrease the size of the landing pad as the helicopter flies towards it
    land.position.set(newX, 0.2, newY); // CS559 Sample Code
    land.scale.set(1 - t + 0.5, 0.1, 1 - t + 0.5);
    t += 0.005;
    // Update the target position and angle after the previous target is arrived at
    if (t >= 1) {
      t = 0;
      oldX = newX;
      oldY = newY;
      // Randomly update the new positions
      newX = (Math.random() - 0.5) * 10;
      newY = (Math.random() - 0.5) * 10;
      newA = Math.atan2(newY - oldY, newX - oldX);
      // Reset the target
      land.position.set(newX, 0.2, newY);
      land.scale.set(1 - t + 0.5, 0.1, 1 - t + 0.5); // CS559 Sample Code
    }
  }
  // Update the angle of the helicopter
  // Keep rotating until the new angle is reached
  else {
    // If the two angles are close enough, set them equal in 1 step
    if (Math.abs(newA - oldA) < 0.05) {
      helicopter.rotateY(oldA - newA);
      oldA = newA;
    }
    // If the two angles are different, rotate the angle by 0.05
    else {
      helicopter.rotateY(Math.sign(oldA - newA) * 0.05);
      oldA += Math.sign(newA - oldA) * 0.05;
    }
  }
  // Rotate radar dish
  radar.lookAt(quadCopter.position);
  // Look slightly above the quadCopter position
  radar.rotateX(0.55 * Math.PI);
  // Rotate bowl
  bowl.lookAt(helicopter.position);
  // End Example Solution

  renderer.render(scene, camera);
  window.requestAnimationFrame(animateLoop);
}
window.requestAnimationFrame(animateLoop);