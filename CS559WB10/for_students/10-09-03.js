/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
// import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as InputHelpers from "../libs/CS559/inputHelpers.js";
import * as SimpleObjects from "../libs/CS559-Framework/SimpleObjects.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";

{
  let mydiv = document.getElementById("div0");

  let world = new GrWorld({ width: mydiv ? 600 : 800, where: mydiv });

  let shaderMat = shaderMaterial("./shaders/10-09-03.vs", "./shaders/10-09-03.fs", {
    side: T.DoubleSide,
    uniforms: {
      time: { value: 0 },
      amplitude: { value: 0 },
      numRings: { value: 0 }
    },
  });

  // this slider lets you modify the amplitude of the waves
  let s1 = new InputHelpers.LabelSlider("Amplitude", {
    width: 700,
    min: 0,
    max: 1.0,
    step: 0.01,
    initial: 0.10,
    where: mydiv,
  });

  // this slider lets you change the number of waves on the sphere (or lines on square)
  let s2 = new InputHelpers.LabelSlider("Number_of_Waves", {
    width: 700,
    min: 1.0,
    max: 40.0,
    step: 1.0,
    initial: 5.0,
    where: mydiv,
  });

    // this slider lets you change the number of waves on the sphere (or lines on square)
    let s3 = new InputHelpers.LabelSlider("Propagation_speed", {
        width: 700,
        min: 0.0,
        max: 5.0,
        step: 0.1,
        initial: 1.0,
        where: mydiv,
    });

  let speed = 1.0;
  function onchange() {
    shaderMat.uniforms.amplitude.value = s1.value();
    shaderMat.uniforms.numRings.value = s2.value();
    speed = s3.value();
  }

  s1.oninput = onchange;
  s2.oninput = onchange;
  s3.oninput = onchange;
  onchange();

  let sphere = new SimpleObjects.GrSphere({ x: -2, y: 1, widthSegments: 400, heightSegments: 400, material: shaderMat });
  let sign = new SimpleObjects.GrSquareSign({ x: 2, y: 1, size: 1, material: shaderMat });
  let time = 0;
  sphere.stepWorld = (delta, d) => {
    time += delta/100 * speed;
    shaderMat.uniforms.time.value = time;
  };

  world.add(sphere);
  world.add(sign);
  world.go();
}
