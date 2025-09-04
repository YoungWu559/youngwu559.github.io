// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { OBJLoader } from "../libs/CS559-Three/examples/jsm/loaders/OBJLoader.js";

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

// make a ground plane
let groundBox = new T.BoxGeometry(5, 0.1, 5);
let groundMesh = new T.Mesh(
groundBox,
new T.MeshLambertMaterial({ color: 0x888888 })
);
// put the top of the box at the ground level (0)
groundMesh.position.y = -0.05;
scene.add(groundMesh);

// @@Snippet:loader
let loader = new OBJLoader();
loader.load("./objects/07-astronaut.obj", function(astronaut) {
        astronaut.position.set(1.5, 4, 0);
        astronaut.scale.set(0.5, 0.5, 0.5);
        scene.add(astronaut);
        // note that we have to render
        renderer.render(scene, camera);
    });
// @@Snippet:end

// try it with a promise...
let obj = loader.loadAsync("./objects/07-astronaut.obj");
obj.then(function(astronaut) {
    astronaut.position.set(-2, 4, 0);
    astronaut.scale.set(0.5, 0.5, 0.5);
    scene.add(astronaut);
    // note that we have to render
    renderer.render(scene, camera);
    });

// warning - this has to be after everything is all set up!
// it takes advantage of the fact that modules are allowed to be async
// but the TS error checker doesn't know that
let astro = await loader.loadAsync("./objects/07-astronaut.obj");
console.log(astro);
astro.position.set(-0, 4, -2);
astro.scale.set(0.5, 0.5, 0.5);
scene.add(astro);

// HINT: (big hint)
// the OBJ Loader returns a group, not a single mesh
// so it you want to manipulate the mesh, you need to do 
// it more carefully
// for example, 
// we can do it with a JavaScript forEach
// astro.children.forEach(obj => obj.material = new T.MeshStandardMaterial({color:"yellow"}));

// but even better, is to do it with the THREE build in things!
astro.traverse(obj => {
        if (obj instanceof T.Mesh) {
            obj.material = new T.MeshStandardMaterial({color:"yellow"});
        }
    });

// note that we have to render
renderer.render(scene, camera);
