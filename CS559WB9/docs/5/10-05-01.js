/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as SimpleObjects from "../libs/CS559-Framework/SimpleObjects.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";

{
  let mydiv = document.getElementById("div1");

  let world = new GrWorld({ width: mydiv ? 600 : 800, where: mydiv });
  
  let shaderMat1 = shaderMaterial("./shaders/10-05-01.vs", "./shaders/10-05-01a.fs");
  let shaderMat2 = shaderMaterial("./shaders/10-05-01.vs", "./shaders/10-05-01b.fs");

  let s1 = new SimpleObjects.GrSphere({ x: -2, y: 1, material: shaderMat1 });
  let s2 = new SimpleObjects.GrSphere({ x: 2, y: 1, material: shaderMat2 });

  // add a time accumulator to those objects...
  s1.time = 0;
  s2.time = Math.PI * 1000;

  // beware! non-lexical this (it will become a method when we attach it to an object)
  function spinner(delta, tod) {
    this.time += delta;
    this.objects[0].position.x = 2 * Math.sin(this.time / 1000);
    this.objects[0].position.z = 2 * Math.cos(this.time / 1000);
  }
  s1.stepWorld = spinner;
  s2.stepWorld = spinner;

  world.add(s1);
  world.add(s2);

  world.go();
}