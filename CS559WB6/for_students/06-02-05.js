// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";

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
// @@Snippet:makeCamera
let camera = new T.PerspectiveCamera(50, 1);
camera.position.set(3, 5, 5);
camera.lookAt(0, 0, 0);
// @@Snippet:end

// we are going to make our box out of green "stuff"
// this green stuff shows up as green even if there is no lighting
let greenStuff = new T.MeshStandardMaterial({ color: 0x00ff00 });

// make a box - note that we make the geometry (a collection of triangles)
// and then make a mesh object out of that geometry - which attaches the
// triangles to a material
let geometry = new T.BoxGeometry(1, 1, 1);
let mesh1 = new T.Mesh(geometry, greenStuff);

// now we need to put that box into the world
scene.add(mesh1);

// this makes a second (yellow) box, to the right of and behind the first
let yellowStuff = new T.MeshStandardMaterial({ color: 0xffff00 });
let mesh2 = new T.Mesh(geometry, yellowStuff);
mesh2.position.x = 0.2;
mesh2.position.z = -1;
scene.add(mesh2);

let ambientLight = new T.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
let pointLight = new T.PointLight(0xffffff, 1);
pointLight.position.set(0, 10, 5);
scene.add(pointLight);

// now we just need to draw the scene with the camera
renderer.render(scene, camera);
