/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/*jshint esversion: 6 */
// @ts-check

// import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
// import { GrObject } from "../libs/CS559-Framework/GrObject.js";

// your buildings are defined in another file... you should import them
// here
import { GrSimpleSubdivision, GrChurch } from "./08-06-buildings.js";

let world = new GrWorld({ groundplanesize: 550 });
world.groundplane.objects[0].translateY(-5);

// place your buildings and trees into the world here
world.add(new GrChurch({ z: -300, length: 60, width: 80, height: 50 }));
/** @type {number} */ const dx = -520; // Offset position x
/** @type {number} */ const dz = 0; // Offset position z
/** @type {number} */ const n = 2; // Number of subdivisions
for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
        // Add the subdivisions
        world.add(new GrSimpleSubdivision({ x: dx + r * 530, z: dz + c * 230, nh: 5 }));
    }
}

world.go();


