/**
 * CS559 Spring 2023 Example Solution
 * Written by CS559 course staff
 */

/**
 * 06-02-02.js - a simple JavaScript file that gets loaded with
 * page 2 of Workbook 7 (CS559).
 *
 * written by Michael Gleicher, January 2019
 * modified January 2020
 */

// @ts-check
/* jshint -W069, esversion:6 */

import * as T from "../libs/CS559-Three/build/three.module.js";

//
// just like 2-1, except with a second box - farther away

// create the window that we want to draw into - this will
// create a Canvas element - we'll set it to be
let renderer = new T.WebGLRenderer();
renderer.setSize(200, 200);
// put the canvas into the DOM
document.getElementById("div1").appendChild(renderer.domElement);

// make a "scene" - a world to put the box into
let scene = new T.Scene();

// This transforms the world to the view
// in this case a simple scaling
let camera = new T.OrthographicCamera(-2, 2, -2, 2, -2, 2);

// we are going to make our box out of green "stuff"
// this green stuff shows up as green even if there is no lighting
let greenStuff = new T.MeshBasicMaterial({ color: 0x00ff00 });

// make a box - note that we make the geometry (a collection of triangles)
// and then make a mesh object out of that geometry - which attaches the
// triangles to a material
let geometry = new T.BoxGeometry(1, 1, 1);
let mesh1 = new T.Mesh(geometry, greenStuff);

// now we need to put that box into the world
scene.add(mesh1);

// a second box
// @@Snippet:secondBox
let yellowStuff = new T.MeshBasicMaterial({ color: 0xffff00 });
let mesh2 = new T.Mesh(geometry, yellowStuff);
mesh2.position.x = 0.2;
// Begin Example Solution
mesh2.position.z = 1;
// End Example Solution
scene.add(mesh2);
// @@Snippet:end

// now we just need to draw the scene with the camera
renderer.render(scene, camera);

