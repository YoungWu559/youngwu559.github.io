// @ts-check
/* jshint -W069, esversion:6 */

import * as T from "../libs/CS559-Three/build/three.module.js";

// this is exactly the code from
// https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene
//
// with the following modifications:
//    - rather than making the render target fill the screen, it gets put in the
//      right location in the box at an appropriate size; this requires setting
//      the aspect ratio correctly
//    - i added a light source and used a material that responds to do
//    - i re-ordered the statements into a more logical order

let renderer = new T.WebGLRenderer();
renderer.setSize(200, 200); // was (window.innerWidth, window.innerHeight );
document.getElementById("div1").appendChild(renderer.domElement);

// the aspect ratio is set to 1 - since we're making the window 200x200
let camera = new T.PerspectiveCamera(50, 1, 0.1, 1000);

let scene = new T.Scene();

let geometry = new T.BoxGeometry(1, 1, 1);
// this was "MeshBasicMaterial"
let material = new T.MeshStandardMaterial({ color: 0x00ff00 });
let cube = new T.Mesh(geometry, material);
scene.add(cube);

// we don't see anything if there is no light
let ambientLight = new T.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
let pointLight = new T.PointLight(0xffffff, 1);
pointLight.position.set(25, 50, 25);
scene.add(pointLight);

camera.position.z = 5;

let lastTimestamp; // undefined to start

// @@Snippet:animate
function animate(timestamp) {
  let timeDelta = 0.002 * (lastTimestamp ? timestamp - lastTimestamp : 0);
  lastTimestamp = timestamp;

  cube.rotation.x += 0.5 * timeDelta;
  cube.rotation.y += 0.5 * timeDelta;

  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}
// @@Snippet:end

window.requestAnimationFrame(animate);
