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
  
  let shaderMat = shaderMaterial("./shaders/10-02-04.vs", "./shaders/10-02-04.fs", {
    side: T.DoubleSide,
  });

  const ob1 = new SimpleObjects.GrSphere({ x: -2, y: 1, material: shaderMat });
  const ob2 = new SimpleObjects.GrSquareSign({ x: 2, y: 1, size: 1, material: shaderMat });

  /**
   * take a GrObj (assume it's first THREE object is a Mesh)
   * get the buffer geometry from the mesh, and make a new attribute
   * for it ("dim") and have it alternate between 1 and 0
   * 
   * @param {GrObject} ob 
   */
  function addDimAttribute(ob) {
    const mesh = /** @type T.Mesh */ (ob.objects[0]);
    const bg = mesh.geometry;
    const posAt = bg.attributes["position"];
    const nverts = posAt.count;
    console.log("nverts:",nverts);
    const fbuf = new Float32Array(nverts);
    // fill will alternating pattern
    for(let i=0; i<nverts; i++) fbuf[i] = i%2;
    const ab = new T.BufferAttribute(fbuf,1);
    bg.setAttribute("dim",ab);  
  }

  addDimAttribute(ob1);
  addDimAttribute(ob2);
 
  world.add(ob1);
  world.add(ob2);
 
  world.go();
}