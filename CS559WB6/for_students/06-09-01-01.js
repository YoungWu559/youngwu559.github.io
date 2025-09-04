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
import { MeshStandardMaterial } from "../libs/CS559-Three/build/three.module.js";

function version2() {
  /** Setup the window */
  /** @type{number} */
  let wid = 670; // window.innerWidth;
  /** @type{number} */
  let ht = 500; // window.innerHeight;
  /** @type{T.WebGLRenderer} */
  let renderer = new T.WebGLRenderer();
  renderer.setSize(wid, ht);
  renderer.shadowMap.enabled = true;

  document.getElementById("museum_area_1").appendChild(renderer.domElement);

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
  /**@type{T.Geometry} */
  let geometry = new T.BoxGeometry(0.5, 0.5, 0.5);
  /**@type{T.Mesh} */
  let cube = new T.Mesh(geometry, material);
  cube.position.set(2, 1.35, 2);
  cube.rotation.set(Math.PI / 4, 0, Math.PI / 4);
  cube.castShadow = true;

  // TODO: You need to create three more objects, and place them on pedestals.
  // Begin Example Solution.
  // Load the teapot
  /** @type {T.Object3D} */ let teapot;
  /** @type {OBJLoader} */ const teaLoader = new OBJLoader();
  /** @type {MeshStandardMaterial} */ const silver = new T.MeshStandardMaterial();
  silver.color = new T.Color("silver");
  teaLoader.load('./objects/07-teapot.obj', function (obj) {
    teapot = obj;
    // Set the position and scale of the object
    obj.position.set(2, 1.55, -2); // CS559 Sample Code
    obj.scale.set(0.025, 0.025, 0.025);
    // Use traverse if there are more than one child
    obj.children[0].castShadow = true;
    /** @type {T.Mesh} */ (obj.children[0]).material = silver;
    scene.add(obj);
  });
  // Load the Suzanne, what is a Suzanne?!
  /** @type {T.Object3D} */ let suzanne;
  /** @type {OBJLoader} */ const suLoader = new OBJLoader();
  /** @type {MeshStandardMaterial} */ const purple = new T.MeshStandardMaterial();
  purple.color = new T.Color("purple");
  purple.roughness = 1.0;
  suLoader.load('./objects/07-suzanne.obj', function (obj) {
    suzanne = obj;
    // Set the position and scale of the object
    obj.position.set(-2, 1.65, -2); // CS559 Sample Code
    obj.scale.set(0.05, 0.05, 0.05);
    // Use traverse if there are more than one child
    obj.children[0].castShadow = true;
    /** @type {T.Mesh} */ (obj.children[0]).material = purple;
    scene.add(obj);
  });
  // Draw a PokeBall
  /** @type {T.Group} */ const pokeBall = new T.Group();
  pokeBall.position.set(-2, 1.5, 2); // CS559 Sample Code
  /** @type {T.SphereGeometry} */ const halfSphere = new T.SphereGeometry(0.4, 20, 20, 0, 2 * Math.PI, 0, 0.5 * Math.PI - 0.06);
  /** @type {T.CylinderGeometry} */ const cylinder = new T.CylinderGeometry(0.39, 0.39, 0.06, 20, 20);
  /** @type {T.MeshStandardMaterial} */ const red = new T.MeshStandardMaterial();
  red.color = new T.Color("red");
  /** @type {T.MeshStandardMaterial} */ const white = new T.MeshStandardMaterial();
  white.color = new T.Color("white");
  /** @type {T.MeshStandardMaterial} */ const black = new T.MeshStandardMaterial();
  black.color = new T.Color("black");
  /** @type {T.Mesh} */ const top = new T.Mesh(halfSphere, red);
  /** @type {T.Mesh} */ const bottom = new T.Mesh(halfSphere, white);
  /** @type {T.Mesh} */ const edge = new T.Mesh(cylinder, black);
  /** @type {T.Mesh} */ const front = new T.Mesh(cylinder, black);
  /** @type {T.Mesh} */ const base = new T.Mesh(cylinder, white);
  /** @type {T.Mesh} */ const button = new T.Mesh(cylinder, white);
  bottom.rotateZ(Math.PI);
  // Set the position and scale of the button in the front
  front.position.set(0, 0, 0.39); // CS559 Sample Code
  front.scale.set(0.35, 0.05, 0.35);
  front.rotateX(Math.PI / 2);
  // Set the position and scale of the bottom half sphere
  base.position.set(0, 0, 0.39); // CS559 Sample Code
  base.scale.set(0.25, 0.3, 0.25);
  base.rotateX(Math.PI / 2);
  // Set the position and scale of the button in the front
  button.position.set(0, 0, 0.39); // CS559 Sample Code
  button.scale.set(0.15, 1, 0.15);
  button.rotateX(Math.PI / 2);
  // Add everything to the group
  pokeBall.add(top, bottom, edge, front, base, button);
  // Cast shadow on all the parts
  pokeBall.traverse(function (obj) { obj.castShadow = true; });
  scene.add(pokeBall);
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
  // Create an empty group as the target of the spotlight
  /** @type {T.Group} */ const cube2 = new T.Group();
  cube2.position.set(-2, 1.35, 2); // CS559 Sample Code
  scene.add(cube2);
  spotlight_2.position.set(-2, 5, 2); // CS559 Sample Code
  spotlight_2.target = cube2;
  scene.add(spotlight_2);
  // Create an empty group as the target of the spotlight
  /** @type {T.Group} */ const cube3 = new T.Group();
  cube3.position.set(2, 1.35, -2); // CS559 Sample Code
  scene.add(cube3);
  spotlight_3.position.set(2, 5, -2); // CS559 Sample Code
  spotlight_3.target = cube3;
  scene.add(spotlight_3);
  // Create an empty group as the target of the spotlight
  /** @type {T.Group} */ const cube4 = new T.Group();
  cube4.position.set(-2, 1.35, -2); // CS559 Sample Code
  scene.add(cube4);
  spotlight_4.position.set(-2, 5, -2); // CS559 Sample Code
  spotlight_4.target = cube4;
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
  // Set the camera at the center and look at the position of the object
  camera_1.position.set(0, 2.35, 0);
  camera_1.lookAt(2, 1.35, 2); // CS559 Sample Code
  // Set the camera at the center and look at the position of the object
  camera_2.position.set(0, 2.35, 0);
  camera_2.lookAt(2, 1.35, -2); // CS559 Sample Code
  // Set the camera at the center and look at the position of the object
  camera_3.position.set(0, 2.35, 0);
  camera_3.lookAt(-2, 1.35, 2); // CS559 Sample Code
  // Set the camera at the center and look at the position of the object
  camera_4.position.set(0, 2.35, 0);
  camera_4.lookAt(-2, 1.35, -2); // CS559 Sample Code
  /** @type {number} */ let angle = 0; // Keep track of the angle of Suzanne and PokeBall
  /** @type {number} */ let direction = 1; // Keep track of the direction of Suzanne and PokeBall
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
  setupCamButton("main_cam_1", main_camera);
  setupCamButton("cam_1_1", camera_1);
  setupCamButton("cam_2_1", camera_2);
  setupCamButton("cam_3_1", camera_3);
  setupCamButton("cam_4_1", camera_4);

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
    // Bound the rotation of the PokeBall between plus and minus 45 degrees
    timeDelta = 0.05;
    angle += direction * timeDelta;
    if (Math.abs(angle) >= Math.PI / 4) direction *= -1;
    // Check to make sure Teapot is loaded
    if (teapot) {
      // Rotate and tilt the teapot
      teapot.rotateOnWorldAxis(new T.Vector3(0, 1, 0), timeDelta);
      teapot.rotateX(timeDelta);
    }
    // Check to make sure Suzanne is loaded
    if (suzanne) {
      // Rotate and shake the Suzanne
      suzanne.rotateOnWorldAxis(new T.Vector3(0, 1, 0), timeDelta);
      suzanne.rotateZ(direction * timeDelta);
    }
    // Rotate and translate the PokeBall so that it appears to be shaking
    pokeBall.rotateZ(direction * timeDelta);
    pokeBall.position.set(-2 - angle * 0.2, 1.5, 2);
    controls.update();
    // End Example Solution

    // draw and loop
    renderer.render(scene, active_camera);
    window.requestAnimationFrame(animate);
  }
  window.requestAnimationFrame(animate);
}
version2();