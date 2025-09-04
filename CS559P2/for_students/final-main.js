/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/*jshint esversion: 6 */
// @ts-check

import { GrSimpleSubdivision, GrChurch } from "./final-suburbs.js";
import { GrStraightRoad, GrIntersection, GrRoad, GrRoundRoad } from "./final-roads.js";
import { GrSUV, GrHatchBack, GrVan } from "./final-cars.js";
import { GrObjCube, GrShadedCube, GrTestCube } from "./final-objects.js";

export function main(world) {
    // place your buildings and trees into the world here
    world.add(new GrChurch({ x: -1250, z: 100, rotate: Math.PI * 0.5, length: 60, width: 80, height: 40 }));
/** @type {GrRoundRoad} */ const round = new GrRoundRoad({ x: -1400, z: 250, width: 15 });
    world.add(round);
/** @type {number} */ const dx = -1150; // Offset position x
/** @type {number} */ const dz = 0; // Offset position z
/** @type {number} */ const n = 5; // Number of subdivisions
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            // Add the subdivisions
            world.add(new GrSimpleSubdivision({ x: dx + r * 530, z: dz + c * 230, nh: 5 }));
            // Add the horizontal straight roads
            world.add(new GrStraightRoad({ width: 15, ax: dx + r * 530, az: dz + c * 230, bx: dx + r * 530 + 500, bz: dz + c * 230 }));
        }
    }
    for (let r = 0; r <= n; r++) {
        for (let c = 0; c < n - 1; c++) {
            // Add the vertical straight roads
            world.add(new GrStraightRoad({ width: 15, ax: dx + r * 530 - 15, az: dz + c * 230 + 15, bx: dx + r * 530 - 15, bz: dz + c * 230 + 215 }));
        }
    }
    for (let r = 0; r <= n; r++) {
        for (let c = 0; c < n; c++) {
            // Add the intersections are the end so that they can connect to the straight roads
            world.add(new GrIntersection({ width: 15, cx: dx + r * 530 - 15, cz: dz + c * 230 }));
        }
    }
// Test the cars on the road system
/** @type {GrRoad} */ const roadSystem = new GrRoad();
    // Add a car on the road system
    for (let i = 0; i < n * n * 2; i++) {
/** @type {GrRoad} */ const track = roadSystem.randomTrack();
/** @type {GrSUV|GrHatchBack|GrVan} */ let car;
/** @type {number} */ const type = Math.floor(Math.random() * 3);
/** @type {number} */ const color = Math.floor(Math.random() * 6);
        if (type == 0) car = new GrSUV({ index: color, track: track, road: track.road, toRoad: (track.road + 2) % 4 });
        else if (type == 1) car = new GrHatchBack({ index: color, track: track, road: track.road, toRoad: (track.road + 2) % 4 });
        else if (type == 2) car = new GrVan({ index: color, track: track, road: track.road, toRoad: (track.road + 2) % 4 });
        world.add(car);
    }
    // Add two cars on the round road
    for (let i = 0; i < 2; i++) world.add(new GrHatchBack({ track: round, road: i, toRoad: i }));
    // Test other things
    world.add(new GrObjCube({x: -1250, y: 5, scale: 5}));
    world.add(new GrShadedCube({x: -1250, z: -20, y: 5, scale: 10}));
    world.add(new GrTestCube({x: -1250, z: -40, y: 5, scale: 10}));
    world.go();
}