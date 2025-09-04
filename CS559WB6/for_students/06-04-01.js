// @ts-check
/* jshint -W069, esversion:6 */

import * as T from "../libs/CS559-Three/build/three.module.js";
import { OrbitControls } from "../libs/CS559-Three/examples/jsm/controls/OrbitControls.js";

let renderer = new T.WebGLRenderer();
renderer.setSize(400, 400);
document.getElementById("div1").appendChild(renderer.domElement);

let scene = new T.Scene();
let camera = new T.PerspectiveCamera();
camera.position.z = 10;
camera.position.y = 5;
camera.position.x = 5;
camera.lookAt(0, 3, 0);

scene.add(new T.AmbientLight("white", 0.2));
let point = new T.PointLight("white", 1, 0, 0);
point.position.set(20, 10, 15);
scene.add(point);

// put an axis mark at the origin
let axesMarker = new T.AxesHelper();
scene.add(axesMarker);

// add OrbitControls
let controls = new OrbitControls(camera, renderer.domElement);

// make a ground plane
let groundBox = new T.BoxGeometry(5, 0.1, 5);
let groundMesh = new T.Mesh(
    groundBox,
    new T.MeshLambertMaterial({ color: 0x888888 })
);
// put the top of the box at the ground level (0)
groundMesh.position.y = -0.05;
scene.add(groundMesh);

let box = new T.BoxGeometry(1, 1, 1);

let cube1 = new T.Mesh(box, new T.MeshStandardMaterial({ color: "purple" }));
cube1.rotateY(Math.PI/4);
cube1.position.set(2, 0.5, 0);
scene.add(cube1);

let cube2 = new T.Mesh(box, new T.MeshStandardMaterial({ color: "red" }));
cube2.rotateY(Math.PI/4);
cube2.translateX(2);
cube2.translateY(0.5);
scene.add(cube2);

function animate(timestamp) {
  // now we just need to draw the scene with the camera
  renderer.render(scene, camera);
  // have an animation loop
  window.requestAnimationFrame(animate);
}
window.requestAnimationFrame(animate);