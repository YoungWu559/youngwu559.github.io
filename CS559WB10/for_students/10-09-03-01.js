/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
//import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as InputHelpers from "../libs/CS559/inputHelpers.js";
import * as SimpleObjects from "../libs/CS559-Framework/SimpleObjects.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";

/* Image of a  blue red green grid made in Microsoft Paint. Use as the 'tex' 
uniform input for shaderMaterial()*/
let image = new T.TextureLoader().load("./textures/blue_red_grid.png");
let mydiv = document.getElementById("div1");
let world = new GrWorld({ width: mydiv ? 600 : 800, where: mydiv });
// The shader maps the blue red green grid to the object.
let shaderMat = shaderMaterial("./shaders/10-09-03-01.vs", "./shaders/10-09-03-01.fs", {
  side: T.DoubleSide,
  uniforms: {
    tex: { value: image },
    height: { value: 0.3 },
  },
});
// The slider lets you change the heights of the blue, red, green sections
let s1 = new InputHelpers.LabelSlider("multi-dimensional shift", {
  width: 700,
  min: -2.0,
  max: 2.0,
  step: 0.01,
  initial: 0.0,
  where: mydiv,
});
function onchange() {
  shaderMat.uniforms.height.value = s1.value();
}
s1.oninput = onchange;
onchange();
world.add(new SimpleObjects.GrSphere({
  x: -2, y: 1, material: shaderMat, widthSegments: 500,
  heightSegments: 500
}));
world.add(
  new SimpleObjects.GrSquareSign({ x: 2, y: 1, size: 1, material: shaderMat })
);

world.go();
