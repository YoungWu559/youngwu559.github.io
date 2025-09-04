/*jshint esversion: 6 */
// @ts-check

// A very simple demo to show off hierarchy in three

// Note: this uses the Framework - which is described later in the workbook

import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrCube } from "../libs/CS559-Framework/SimpleObjects.js";
import { AutoUI } from "../libs/CS559-Framework/AutoUI.js";

// define a special kind of cube that spins
class SliderCube extends GrCube {
  constructor(color) {
    super({ color: color }, 
        [
            ["pos.x",-5,5,0],
            ["pos.y",-5,5,1],
            ["pos.z",-5,5,0],
            ["rot.y",-180,180,0],
            ["rot.z",-180,180,0],
            ["scale",0.2,2,1]
        ]
        );
    this.name += "-" + color;
  }
  update(vec) {
      this.objects[0].position.x = vec[0];
      this.objects[0].position.y = vec[1];
      this.objects[0].position.z = vec[2];
      this.objects[0].rotation.y = vec[3]*Math.PI/180;
      this.objects[0].rotation.z = vec[4]*Math.PI/180;
      this.objects[0].scale.set(vec[5],vec[5],vec[5]);
  }
}


let world = new GrWorld({
    groundplanecolor: "gray",
    where: document.getElementById("simplespin")
});

let cube0 = new SliderCube("green");
world.add(cube0);

let cube1 = new SliderCube("cyan");

// cube0 and cube1 are "GrObject" (framework objects)
// to make things clearer, we'll get the "THREE Object3D" from them...
let obj0 = cube0.objects[0];
let obj1 = cube1.objects[0];

// we build hierarchy by adding one GrObject3D to another
obj0.add(obj1);

let cubeUI1 = new AutoUI(cube0, 200);
let cubeUI2 = new AutoUI(cube1, 200);

world.go();
