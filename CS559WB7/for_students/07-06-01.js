/*jshint esversion: 6 */
// @ts-check

/**
 * Minimal Starter Code for the QuadCopter assignment
 */

import * as T from "../libs/CS559-Three/build/three.module.js";
import { OrbitControls } from "../libs/CS559-Three/examples/jsm/controls/OrbitControls.js";


let renderer = new T.WebGLRenderer({preserveDrawingBuffer:true});
renderer.setSize(600, 400);
document.body.appendChild(renderer.domElement);
renderer.domElement.id = "canvas";

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
scene.add(tempMesh);
tempMesh.scale.set(0.5, 0.5, 0.5);
tempMesh.position.y = 2;

// animation loop
function animateLoop(timestamp) {
    //** EXAMPLE CODE - STUDENT SHOULD REPLACE */
    // move in a circle
    let theta = timestamp / 1000;
    let x = 3 * Math.cos(theta);
    let z = 3 * Math.sin(theta);
    tempMesh.position.x = x;
    tempMesh.position.z = z;

    renderer.render(scene, camera);
    window.requestAnimationFrame(animateLoop);
  }
window.requestAnimationFrame(animateLoop);
// CS559 2025 Workbook
