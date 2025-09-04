/**
 * CS559 Spring 2023 Example Solution
 * Written by CS559 course staff
 */

/**
 * 06-09-01.js - a simple JavaScript file that gets loaded with
 * page 9 of Workbook 7 (CS559).
 *
 * written by Michael Gleicher, January 2019
 * modified January 2020
 */

// @ts-check
/* jshint -W069, esversion:6 */

import * as T from "../libs/CS559-Three/build/three.module.js";
import { OrbitControls } from "../libs/CS559-Three/examples/jsm/controls/OrbitControls.js";
import { setupBasicScene } from "./06-09-01-helpers.js";

// students can use the object loader
// uncomment this if necessary
import { OBJLoader } from "../libs/CS559-Three/examples/jsm/loaders/OBJLoader.js";

function version1() {
  /** Setup the window */
  /** @type{number} */
  let wid = 670; // window.innerWidth;
  /** @type{number} */
  let ht = 500; // window.innerHeight;
  /** @type{T.WebGLRenderer} */
  let renderer = new T.WebGLRenderer();
  renderer.setSize(wid, ht);
  renderer.shadowMap.enabled = true;

  document.getElementById("museum_area").appendChild(renderer.domElement);

  /* setupBasicScene creates a scene and puts the pedestals in place */
  /** @type{T.Scene} */
  let scene = setupBasicScene();

  // Here, we add a basic, simple first object to the museum.
  /**@type{T.Material} */
  let material = new T.MeshPhongMaterial({
    color: "#00aa00",
    shininess: 15,
    specular: "#00ff00",
  });
  /**@type{T.BufferGeometry} */
  let geometry = new T.BoxGeometry(0.5, 0.5, 0.5);
  /**@type{T.Mesh} */
  let cube = new T.Mesh(geometry, material);
  cube.position.set(2, 1.35, 2);
  cube.rotation.set(Math.PI / 4, 0, Math.PI / 4);
  cube.castShadow = true;

  // TODO: You need to create three more objects, and place them on pedestals.
  // Begin Example Solution.
  /**@type{T.Object3D} */
  let astronaut;
  let loader = new OBJLoader();
  loader.load("./objects/07-astronaut.obj", function (obj) {
    astronaut = obj;
    obj.position.set(-2, 2.04, 2);
    obj.scale.set(0.2, 0.2, 0.2);
    astronaut.rotation.y += 0.41;
    obj.children[0].castShadow = true;
    spotlight_2.target = obj;
    camera_2.lookAt(astronaut.position);
    scene.add(obj);
  });

  geometry = new T.TorusKnotGeometry(0.2, 0.04, 64, 16, 4, 5);
  material = new T.MeshStandardMaterial({ color: "#8888ff", metalness: 0.5, roughness: 0.5 });
  /**@type{T.Mesh} */
  let knot = new T.Mesh(geometry, material);
  knot.position.set(2, 1.45, -2);
  knot.rotateX(5 * Math.PI / 8);
  knot.rotateY(-Math.PI / 16);
  // knot.rotateZ(Math.PI/2);
  knot.castShadow = true;
  scene.add(knot);

  geometry = new T.SphereGeometry(0.35, 16, 16);
  material = new T.MeshStandardMaterial({ color: "#ffffff", metalness: 0.4, roughness: 0.8 });
  let base = new T.Mesh(geometry, material);
  base.castShadow = true;
  base.position.set(-2, 1.6, -2);
  let mid = new T.Mesh(geometry, material);
  mid.scale.set(0.7, 0.7, 0.7);
  mid.position.set(0, 0.45, 0);
  base.add(mid);
  let head = new T.Mesh(geometry, material);
  head.scale.set(0.7, 0.7, 0.7);
  head.position.set(0, 0.45, 0);
  mid.add(head);
  geometry = new T.ConeGeometry(0.07, 0.4, 8, 4);
  material = new T.MeshPhongMaterial({ color: "#ffaa11", shininess: 0.3 });
  let nose = new T.Mesh(geometry, material);
  nose.position.set(0.45, 0, 0);
  nose.rotateZ(-Math.PI / 2);
  nose.castShadow = true;
  head.add(nose);
  head.rotateY(-Math.PI / 8);
  scene.add(base);
  // End Example Solution

  /* put a spotlight on the first object */
  /**@type{T.SpotLight} */
  let spotlight_1 = new T.SpotLight(0xaaaaff, 0.5);
  spotlight_1.angle = Math.PI / 16;
  spotlight_1.position.set(2, 5, 2);
  spotlight_1.target = cube;
  spotlight_1.castShadow = true;
  scene.add(spotlight_1);

  // TODO: You need to place the lights.
  let spotlight_2 = new T.SpotLight(0xaaaaff, 0.5);
  spotlight_2.angle = Math.PI / 16;
  spotlight_2.castShadow = true;
  let spotlight_3 = new T.SpotLight(0xaaaaff, 0.5);
  spotlight_3.angle = Math.PI / 16;
  spotlight_3.castShadow = true;
  let spotlight_4 = new T.SpotLight(0xaaaaff, 0.5);
  spotlight_4.angle = Math.PI / 16;
  spotlight_4.castShadow = true;

  // Begin Example Solution
  spotlight_2.position.set(-2, 5, 2);
  scene.add(spotlight_2);
  spotlight_3.position.set(2, 5, -2);
  spotlight_3.target = knot;
  scene.add(spotlight_3);
  spotlight_4.position.set(-2, 5, -2);
  spotlight_4.target = base;
  scene.add(spotlight_4);
  // End Example Solution

  /** create a "main camera" */
  /** @type{T.PerspectiveCamera} */
  let main_camera = new T.PerspectiveCamera(60, wid / ht, 1, 100);
  main_camera.position.set(0, 4, 6);
  main_camera.rotation.set(-0.5, 0, 0);

  /** this will be the "current camera" - we will switch when a button is pressed */
  let active_camera = main_camera;

  // TODO: You need to place these cameras.
  let camera_1 = new T.PerspectiveCamera(60, wid / ht, 1, 100);
  let camera_2 = new T.PerspectiveCamera(60, wid / ht, 1, 100);
  let camera_3 = new T.PerspectiveCamera(60, wid / ht, 1, 100);
  let camera_4 = new T.PerspectiveCamera(60, wid / ht, 1, 100);
  scene.add(cube);

  // Begin Example Solution
  camera_1.position.set(2.75, 2.75, 2.75);
  camera_1.lookAt(cube.position);
  camera_2.position.set(-3, 3.5, 3);
  camera_3.position.set(-3, 3, -3);
  camera_3.lookAt(base.position);
  camera_4.position.set(2.75, 2.75, -2.75);
  camera_4.lookAt(knot.position);
  // End Example Solution

  // add orbit controls - but only to the main camera
  let controls = new OrbitControls(main_camera, renderer.domElement);

  /** Tie the buttons to the cameras */
  function setupCamButton(name, camera) {
    const button = document.getElementById(name);
    if (!(button instanceof HTMLButtonElement))
      throw new Error(`Button ${name} doesn't exist`);
    button.onclick = function () {
      active_camera = camera;
      renderer.render(scene, active_camera);
    };
  }
  setupCamButton("main_cam", main_camera);
  setupCamButton("cam_1", camera_1);
  setupCamButton("cam_2", camera_2);
  setupCamButton("cam_3", camera_3);
  setupCamButton("cam_4", camera_4);

  // finally, draw the scene. Also, add animation.
  renderer.render(scene, active_camera);

  let lastTimestamp; // undefined to start

  function animate(timestamp) {
    // Convert time change from milliseconds to seconds
    let timeDelta = 0.001 * (lastTimestamp ? timestamp - lastTimestamp : 0);
    lastTimestamp = timestamp;

    // Animate the cube (basic object)
    cube.rotateOnWorldAxis(new T.Vector3(0, 1, 0), timeDelta);

    // TODO: animate your objects
    // Begin Example Solution
    if (astronaut) astronaut.rotateOnAxis(new T.Vector3(0, 1, 0), timeDelta);
    knot.rotateX(timeDelta);
    base.rotateY(timeDelta);
    // End Example Solution

    // draw and loop
    renderer.render(scene, active_camera);
    window.requestAnimationFrame(animate);
  }
  window.requestAnimationFrame(animate);
}
version1();