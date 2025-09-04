/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as InputHelpers from "../libs/CS559/inputHelpers.js";

/*
 * Define your 3 objects here. If the objects fit inside +/- 1,
 * the world code below will place them nicely.
 * Otherwise, you need to modify the world code below to make the
 * world bigger and space the objects out differently.
 */

const s2 = Math.sqrt(2) / 2;
class Object1 extends GrObject {
  constructor() {
    let geometry = new T.BufferGeometry();
    //
    // while the two triangles have 4 certices, we need to split the vertices
    // so that they can have different normals
    const vertices = new Float32Array( [
       -1, 1, -1,     // 1A note that we need to keep this ccw
       0, 0, 0,       // 1B
       0, 2, 0,       // 1C
       
       1, 1, -1,      // second triangle
       0, 2, 0,       // 2B
       0, 0, 0,       // 2C

       1, 1, -1,      //third
       -1, 1, -1,
       0, 2, 0,
    ]);
    // don't ask where we learn to call this "position" and "normal"
    // the only thing I can find is to read examples...
    geometry.setAttribute('position',new T.BufferAttribute(vertices,3));

    // in 01, we computed these with cross product, here, we use them
    // from the way it was done above
    const normals = new Float32Array([
          -s2,0,s2,
          -s2,0,s2,
          -s2,0,s2,

          s2,0,s2,
          s2,0,s2,
          s2,0,s2,

          0,s2,-s2,
          0,s2,-s2,
          0,s2,-s2,
      ]);
    geometry.setAttribute("normal",new T.BufferAttribute(normals,3));

    const colors = new Float32Array( [
      1,1,0,    // yellow (3 vertices)
      1,1,0,
      1,1,0,
      1,.65,0,  // orange (#FFA500)
      1,.65,0,
      1,.65,0 
  ]);
    geometry.setAttribute("colors",new T.BufferAttribute(colors,3));
    
    let material = new T.MeshStandardMaterial({
      color: T.VertexColors,
      roughness: 0.75
    });

    let mesh = new T.Mesh(geometry, material);

    //
    super("Object1", mesh);
  }
}
class Object2 extends GrObject {
  constructor() {
    let geometry = new T.BufferGeometry();
    //
    // while the two triangles have 4 certices, we need to split the vertices
    // so that they can have different normals
    const vertices = new Float32Array( [
       -1, 1, -1,     // 1A note that we need to keep this ccw
       0, 0, 0,       // 1B
       0, 2, 0,       // 1C   
       1, 1, -1,      // second triangle
       0, 2, 0,       // 2B
       0, 0, 0,       // 2C
       1, 1, -1,      //third
       -1, 1, -1,
       0, 2, 0,
    ]);
    // don't ask where we learn to call this "position" and "normal"
    // the only thing I can find is to read examples...
    geometry.setAttribute('position',new T.BufferAttribute(vertices,3));
    // in theory, we could "compute vertex normals" since the triangles are separate
    // so each vertex is just used once, so it will just average over the one triangle
    // see the TwoTrianglesBG for an example of computing them explicitly
    geometry.computeVertexNormals();

    // the colors
    const colors = new Float32Array( [
        1,0,0,   
        1,1,0,
        1,1,1,
        1,0,0,   
        1,1,0,
        1,1,1,
        1,0,0,   
        1,1,0,
        1,1,1,
    ]);
    geometry.setAttribute("color",new T.BufferAttribute(colors,3));

    let material = new T.MeshStandardMaterial({
      roughness: 0.75,
      vertexColors: true
    });
    let mesh = new T.Mesh(geometry, material);

    //
    super("TwoTrianglesBuff", mesh);
  }
}
class Object3 extends GrObject {
  constructor() {
    let geometry = new T.BufferGeometry();
    //
    // while the two triangles have 4 certices, we need to split the vertices
    // so that they can have different normals
    const vertices = new Float32Array( [
       -1, 1, -1,     // 1A note that we need to keep this ccw
       0, 0, 0,       // 1B
       0, 2, 0,       // 1C
       
       1, 1, -1,      // second triangle
       0, 2, 0,       // 2B
       0, 0, 0,      // 2C

       1, 1, -1,      //third
       -1, 1, -1,
       0, 2, 0,
    ]);

    // don't ask where we learn to call this "position" and "normal"
    // the only thing I can find is to read examples...
    geometry.setAttribute('position',new T.BufferAttribute(vertices,3));
    // in theory, we could "compute vertex normals" since the triangles are separate
    // so each vertex is just used once, so it will just average over the one triangle
    // see the TwoTrianglesBG for an example of computing them explicitly
    geometry.computeVertexNormals();

    // the colors
    const colors = new Float32Array( [
        
        // 1,0,0,   
        // 1,1,0,
        // 1,1,1,
        // 1,0,0,   
        // 1,1,0,
        // 1,1,1,
        1,1,0,    // yellow (3 vertices)
        1,1,0,
        1,1,0,
        1,1,0,    // yellow (3 vertices)
        1,1,0,
        1,1,0,
        1,1,0,    // yellow (3 vertices)
        1,1,0,
        1,1,0,
       
    ]);
    geometry.setAttribute("color",new T.BufferAttribute(colors,3));

    const normals = new Float32Array([
      -s2,0,s2,
      0,0,1,
      0,0,1,
      s2,0,s2,
      0,0,1,
      0,0,1,
      -s2,0,s2,
      s2,0,s2,
      0,0,1,
      
      ]);
    geometry.setAttribute("normal",new T.BufferAttribute(normals,3));

    let material = new T.MeshStandardMaterial({
      roughness: 0.75,
      vertexColors: true
    });
    let mesh = new T.Mesh(geometry, material);

    //
    super("TwoTriangles1", mesh);
  }
}

// translate an object in the X direction
function shift(grobj, x) {
    grobj.objects.forEach(element => {
        element.translateX(x);
    });
  return grobj;
}

// Set the Object's Y rotate
function roty(grobj, ry) {
    grobj.objects.forEach(element => {
        element.rotation.y = ry;
    });
  return grobj;
}

/*
 * The world making code here assumes the objects are +/- 1
 * and have a single mesh as their THREE objects.
 * If you don't follow this convention, you will need to modify
 * the code below.
 * The code is a little funky because it is designed to work for
 * a variety of demos.
 */
let mydiv = document.getElementById("div1");

let box = InputHelpers.makeBoxDiv({ width: mydiv ? 640 : 820 }, mydiv);
if (!mydiv) {
    InputHelpers.makeBreak(); // sticks a break after the box
}
InputHelpers.makeHead("Three Different Objects", box);

let world = new GrWorld({ width: mydiv ? 600 : 800, where: box });
let tt = shift(new Object1(), -3);
world.add(tt);

let t2 = shift(new Object2(), 0);
world.add(t2);

let t3 = shift(new Object3(), 3);
world.add(t3);

let div = InputHelpers.makeBoxDiv({}, box);

let sl = new InputHelpers.LabelSlider("ry", { min: -2, max: 2, where: div });

InputHelpers.makeBreak(box);

sl.oninput = function(evt) {
    let v = sl.value();
    roty(tt,v);
    roty(t2,v);
    roty(t3,v);
};

world.go();