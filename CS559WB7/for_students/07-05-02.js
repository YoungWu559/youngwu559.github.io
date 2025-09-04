/*jshint -W008, esversion: 6 */
// @ts-check

// A very simple demo to show off hierarchy in three

// this rotates the second cube by its corner.

// Note: this uses the Framework - which is described later in the workbook

import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrCube, GrGroup } from "../libs/CS559-Framework/SimpleObjects.js";
import { AutoUI } from "../libs/CS559-Framework/AutoUI.js";
import * as T from "../libs/CS559-Three/build/three.module.js";

// define a special kind of cube that spins
class SliderCube extends GrCube {
  constructor(color,x=0,y=1,z=0) {
    super({ color: color, x:x, y:y, z:z }, 
        [
            ["pos.x",-3,3,x,.1],
            ["pos.y",-3,3,y,.1],
            ["pos.z",-3,3,z,.1],
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

class SliderGroup extends GrGroup {
    constructor(x,y,z) {
      super({x:x, y:y, z:z}, 
          [
            ["pos.x",-3,3,x,.1],
            ["pos.y",-3,3,y,.1],
            ["pos.z",-3,3,z,.1],
            ["rot.y",-180,180,0],
            ["rot.z",-180,180,0]
          ]
          );
    }
    update(vec) {
        this.objects[0].position.x = vec[0];
        this.objects[0].position.y = vec[1];
        this.objects[0].position.z = vec[2];
        this.objects[0].rotation.y = vec[3]*Math.PI/180;
        this.objects[0].rotation.z = vec[4]*Math.PI/180;
    }
  }
  
function go() {
  let world = new GrWorld({
    groundplanecolor: "gray",
    where: document.getElementById("simplespin")
  });

// @@Snippet:makeobjects
  // place the green cube in the center of the group plane, touching the floor
  let cube0 = new SliderCube("green",0,0.5,0);
  // place the group at the top corner of the cube (local coordinates)
  let group = new SliderGroup(.5,.5,.5);
  // place the second cube so its corner is at the origin of the groups coordinate system
  let cube1 = new SliderCube("cyan", -0.5, 0.5, -0.5);
// @@Snippet:end
  
  // cube0 and cube1 are "GrObject" (framework objects)
  // to make things clearer, we'll get the "THREE Object3D" from them...
  let obj0 = cube0.objects[0];
  let grp  = group.objects[0];
  let obj1 = cube1.objects[0];


  // put the top level cube in the world
  world.add(cube0);
  // we build hierarchy by adding one GrObject3D to another
  obj0.add(grp);
  grp.add(obj1);

  let cubeUI1 = new AutoUI(cube0, 200);
  let cubeGRP = new AutoUI(group, 200);
  let cubeUI2 = new AutoUI(cube1, 200);

  grp.add(new T.AxesHelper(2));

  world.go();
}
go();
