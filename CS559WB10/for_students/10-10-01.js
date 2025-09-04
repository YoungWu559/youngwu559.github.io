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
import * as SimpleObjects from "../libs/CS559-Framework/SimpleObjects.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";

{
  let mydiv = document.getElementById("div1");

  let world = new GrWorld({ groundplane: false, width: mydiv ? 600 : 800, where: mydiv });


  let world_resolution = new T.Vector2(600,600);

  

  let shaderMat = shaderMaterial("./shaders/10-10-01.vs", "./shaders/10-10-01.fs", {
      side: T.DoubleSide,
      uniforms: {
          resolution: { value: world_resolution},
          time: {value: 1.0},
      },
  });

  // Add the shader onto a big square sign and the sphere.
  // let sphere = new SimpleObjects.GrSphere({ x: -2, y: 1, size: 100, material: shaderMat });
  let sign = new SimpleObjects.GrSquareSign({ x: 0, y: 1, size: 100, material: shaderMat });

  // add an "advance" function to update the time uniform for the shader.
  let signTime = 0;
  sign.stepWorld = function (delta, timeofday) {
      signTime += delta/800;
      shaderMat.uniforms.time.value = signTime;
  };
  // sphere.stepWorld = function (delta, timeofday) {
  //   signTime += delta/800;
  //   shaderMat.uniforms.time.value = signTime;
  // };

  world.add(sign);
  // world.add(sphere);

  world.go();
}
