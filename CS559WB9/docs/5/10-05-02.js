/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as InputHelpers from "../libs/CS559/inputHelpers.js";
import * as SimpleObjects from "../libs/CS559-Framework/SimpleObjects.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";

{
  let mydiv = document.getElementById("div1");

  let world = new GrWorld({ width: mydiv ? 600 : 800, where: mydiv });

  let shaderMat = shaderMaterial("./shaders/10-05-02.vs", "./shaders/10-05-02.fs", {
    side: T.DoubleSide,
    uniforms: {
      radius: { value: 0.3 },
      dots: { value: 4.0 },
      light: { value: new T.Vector3(1, 1, 1) },
      dark: { value: new T.Vector3(0.2, 0.2, 0.7) },
    },
  });

  let s1 = new InputHelpers.LabelSlider("dots", {
    width: 400,
    min: 1,
    max: 20,
    step: 0.5,
    initial: 4,
    where: mydiv,
  });
  let s2 = new InputHelpers.LabelSlider("radius", {
    width: 400,
    min: 0.1,
    max: 0.5,
    step: 0.01,
    initial: 0.2,
    where: mydiv,
  });
  let s3 = new InputHelpers.LabelSlider("segs", {
    width: 400,
    min: 4,
    max: 32,
    step: 1,
    initial: 8,
    where: mydiv,
  });

  function onchange() {
    shaderMat.uniforms.dots.value = s1.value();
    shaderMat.uniforms.radius.value = s2.value();
  }
  s1.oninput = onchange;
  s2.oninput = onchange;
  onchange();

  let sphere = new SimpleObjects.GrSphere({ x: -2, y: 1, material: shaderMat });
  let square = new SimpleObjects.GrSquareSign({ x: 2, y: 1, size: 1, material: shaderMat });
  
  world.add(sphere);
  world.add(square);
  
  world.go();
  
  function onchangecomplexity() {
    let m = s3.value();
    sphere.setSegmentation(m,m-2);
  }
  s3.oninput = onchangecomplexity;
  onchangecomplexity();
}
