/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/*jshint esversion: 6 */
// @ts-check

// import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
// import { GrObject } from "../libs/CS559-Framework/GrObject.js";

// your vehicles are defined in another file... you should import them
// here
import { GrSUV, GrHatchBack, GrVan } from "./08-07-car.js";

let world = new GrWorld({ groundplanesize: 50 });

// place your vehicles into the world here
for (let i = 0; i < 6; i++) {
    /** @type {GrSUV} */ const suv = new GrSUV({ index: i, x: (i - 2.5) * 15, z: -30 });
    world.add(suv);
    /** @type {GrHatchBack} */ const hatchBack = new GrHatchBack({ index: i, x: (i - 2.5) * 15, z: 0 });
    world.add(hatchBack);
    /** @type {GrVan} */ const van = new GrVan({ index: i, x: (i - 2.5) * 15, z: 30 });
    world.add(van);
}

world.go();

