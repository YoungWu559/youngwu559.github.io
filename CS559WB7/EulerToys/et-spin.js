/*jshint esversion: 6 */
// @ts-check

/**
 * CS 559 Demos for in-class use
 *
 * Students are welcome to experiment with these demonstrations.
 *
 * The code was written to have a quick demo to show in class, it was
 * not designed to be good to read.
 */

import * as T from "../libs/CS559-Three/build/three.module.js";
import { spinnableObject, etScene, getAxisAngle } from "./et-helpers.js";
import { OrbitControls } from "../libs/CS559-Three/examples/jsm/controls/OrbitControls.js";
import {
  makeCheckbox,
  makeButton,
  makeBoxDiv,
  makeOutbox,
  makeFlexDiv,
  makeBreak,
  makeHead
} from "../libs/CS559/inputHelpers.js";

let et = etScene("div1");

// since we're animating, add OrbitControls
let controls = new OrbitControls(et.camera, et.renderer.domElement);

// left = add, right = rotate
let objLeft = spinnableObject();
let objRight = spinnableObject();

// move them to an appropriate place
objLeft.position.x = -2;
objRight.position.x = 2;

// add to the scene (we'll use the top level obj for the rotation)
et.scene.add(objLeft);
et.scene.add(objRight);

// we don't use timing in the regular sense - we pick a step
// size and commit to it (to keep things constant)
let timeDelta;
// see firstStep function below

// this is the demo values (a rotate around x and then y)
let dx = 5;
let dy = 5;
let dz = 0;

let astep = null;
let axisObj = null;

function draw() { 
    // add to make weird precession
    objLeft.rotation.x += dx * timeDelta;
    objLeft.rotation.y += dy * timeDelta;
    objLeft.rotation.z += dz * timeDelta;

    // rotate to go around an axis
    objRight.rotateX(dx*timeDelta);
    objRight.rotateY(dy*timeDelta);
    objRight.rotateZ(dz*timeDelta);

    // note that we can't figure out the axis/angle until we
    // know the step size! (ugh!)
    if (!astep) {
        astep = getAxisAngle(objRight.quaternion);
    }

    if (!axisObj) {
        // the axis of rotation 
        let axis = new T.CylinderGeometry(.05,.05,4);
        let axisMesh = new T.Mesh(axis,new T.MeshBasicMaterial({color:"yellow"}));
        axisMesh.rotation.x = Math.PI/2;     // point along Z
        // put it in a group so we can orient the Z in the right way
        axisObj = new T.Group();
        axisObj.add(axisMesh);
        axisObj.position.x = 2;
        et.scene.add(axisObj);
    }
    axisObj.lookAt(2+astep.axis.x,astep.axis.y,astep.axis.z);

    et.renderer.render(et.scene, et.camera);


    window.setTimeout(draw,timeDelta*1000);
}

// we'll figure out the step by doing a reqAnimationFram
function firstStep(time1) {
    window.requestAnimationFrame(function (time2) {
        /*
        timeDelta = (time2 - time1)/1000;
        console.log("time delta = "+timeDelta);
        console.log(time2,time1,timeDelta)
        */
       // we can't really compute the time delta, because
       // the window is often hidden to start
        timeDelta = 1/30;
        draw();
    });
}
window.requestAnimationFrame(firstStep);
