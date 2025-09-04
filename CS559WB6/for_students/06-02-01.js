// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";

// the simplest thing I can do
// draw a box

// create the window that we want to draw into - this will
// create a Canvas element - we'll set it to be
// @@Snippet:setupRenderer
let renderer = new T.WebGLRenderer();
renderer.setSize(200, 200);
// put the canvas into the DOM
document.getElementById("div1").appendChild(renderer.domElement);
// @@Snippet:end

// make a "scene" - a world to put the box into
// @@Snippet:makeScene
let scene = new T.Scene();
// @@Snippet:end

// This transforms the world to the view
// in this case a simple scaling
// @@Snippet:makeCamera
let camera = new T.OrthographicCamera(-2, 2, -2, 2, -2, 2);
// @@Snippet:end

// we are going to make our box out of green "stuff"
// this green stuff shows up as green even if there is no lighting
// @@Snippet:makeMaterial
let material = new T.MeshBasicMaterial({ color: 0x00ff00 });
// @@Snippet:end

// make a box - note that we make the geometry (a collection of triangles)
// and then make a mesh object out of that geometry - which attaches the
// triangles to a material
// @@Snippet:makeMesh
let geometry = new T.BoxGeometry(1, 1, 1);
let mesh = new T.Mesh(geometry, material);
// @@Snippet:end

// now we need to put that box into the world
scene.add(mesh);

// now we just need to draw the scene with the camera
// @@Snippet:render
renderer.render(scene, camera);
// @@Snippet:end
