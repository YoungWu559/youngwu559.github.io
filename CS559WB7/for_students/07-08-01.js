/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/*jshint esversion: 6 */
// @ts-check

// get things we need
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import {
  GrSimpleSwing,
  GrColoredRoundabout,
  GrSimpleRoundabout,
  GrAdvancedSwing,
  GrCarousel,
  GrAdvancedCarousel,
  GrCarousel3,
  GrBumperCars
} from "./07-08-parkobjects.js";
// import { SimpleBouncer } from "./07-08-simplepark.js";

let parkDiv = document.getElementById("div1");
let world = new GrWorld({ groundplanesize: 25, where: parkDiv });

// world.add(new SimpleBouncer(0, 5));

let roundabout = new GrSimpleRoundabout({ x: -2 });
world.add(roundabout);

let roundabout_2 = new GrColoredRoundabout({ x: 5 });
world.add(roundabout_2);

let swing_2 = new GrSimpleSwing({ x: 10 });
world.add(swing_2);

// Begin Example Solution
// Add the other swing (provided in the workbook)
let swing = new GrAdvancedSwing({ x: 15 });
world.add(swing);

// Add the empty carousel (provided in the workbook)
let carousel = new GrCarousel({ x: -10, z: -10 });
world.add(carousel);

// Add the new carousel, see 07-08-parkobjects.js
let advancedCarousel = new GrAdvancedCarousel({x: -10, z: 10, size: 1});
world.add(advancedCarousel);

// Add the other new carousel, see 07-08-parkobjects.js
let carousel3 = new GrCarousel3({ x: 10, z: 10 });
world.add(carousel3);

// Add the bumper cars, see 07-08-parkobjects.js
let bumperCars = new GrBumperCars({ x: 15, z: -15 });
world.add(bumperCars);
// End Example Solution

world.go();
