/**
 * 06-05-02.js - a simple JavaScript file that gets loaded with
 * page 5 of Workbook 7 (CS559).
 *
 * written by Michael Gleicher, January 2019
 * modified January 2020
 */

// @ts-check
/* jshint -W069, esversion:6 */

import * as T from "../libs/CS559-Three/build/three.module.js";
import { OrbitControls } from "../libs/CS559-Three/examples/jsm/controls/OrbitControls.js";

/**
 * Spotlight demo
 */
function spots(div) {
  let renderer = new T.WebGLRenderer();
  renderer.setSize(400, 400);

  document.getElementById(div).appendChild(renderer.domElement);

  let scene = new T.Scene();
  let camera = new T.PerspectiveCamera();
  camera.position.z = 10;
  camera.position.y = 5;
  camera.position.x = 5;
  camera.lookAt(0, 3, 0);

  // since we're animating, add OrbitControls
  let controls = new OrbitControls(camera, renderer.domElement);

  scene.add(new T.AmbientLight("white", 0.3));

  // make a ground plane
  let groundBox = new T.BoxGeometry(6, 0.1, 6);
  let groundMesh = new T.Mesh(
    groundBox,
    new T.MeshPhongMaterial({ color: 0x888888 })
  );
  // put the top of the box at the ground level (0)
  groundMesh.position.y = -0.05;
  scene.add(groundMesh);

  // first spot light: points at the origin
  let spot1 = new T.SpotLight("red");
  spot1.angle = Math.PI / 36; // narrow (5 degrees)
  spot1.position.set(0, 4, 0);
  // note this uses the default target of 0,0,0
  scene.add(spot1);

  // the second spot light: starts above the center and points closer to the edge
  let spot2 = new T.SpotLight("aqua");
  spot2.angle = Math.PI / 36; // narrow (5 degrees)
  spot2.position.set(0, 4, 0);
  spot2.target.position.set(2, 0, 0);
  // we will use the target
  scene.add(spot2.target);
  scene.add(spot2);

  // the third spot light: shines downward from around edge
  let spot3 = new T.SpotLight("yellow");
  spot3.angle = Math.PI / 36; // narrow (5 degrees)
  spot3.position.set(-2, 4, 0);
  spot3.target.position.set(-2, 0, 0);
  // we will use the target
  scene.add(spot3.target);
  scene.add(spot3);

  // this fourth spotlight is like spotlight 3, except that rather than putting the
  // target in the world, we'll put it in the coordinate system of the spotlight itself
  // so the target's position is relative
  // to do this, we need to create a "group" with the spotlight and target together
  // and move that around (rather than the light)
  let spot4 = new T.SpotLight("green");
  spot4.angle = Math.PI / 36; // narrow (5 degrees)
  spot4.position.set(0, 4, 0);
  spot4.target.position.set(0, 0, 0);
  // put these into a group
  let group4 = new T.Group();
  group4.add(spot4);
  scene.add(group4);
  group4.add(spot4.target);
  
  function animate(timestamp) {
    // make things go around the circle - once around every 2 second
    let t_theta = 0.5 * ((0.001 * timestamp) % 2.0);
    let theta = Math.PI * 2 * t_theta;
    let x = 2 * Math.cos(theta);
    let z = 2 * Math.sin(theta);

    // point spotlight 2
    spot2.target.position.set(x, 0, z);

    // position spotlight 3
    spot3.position.set(x, 4, z);

    // position spotlight 4
    // remember, we move the group
    group4.position.set(z, 0, x);

    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
  }
  window.requestAnimationFrame(animate);
}

spots("div1");

