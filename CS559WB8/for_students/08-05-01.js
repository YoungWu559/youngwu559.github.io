/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/*jshint esversion: 6 */
// @ts-check

//import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
//import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { GrDice } from "./08-05-dice.js";

// define a class of Dice here - it should be a subclass of GrObject
// The Dice is defined in the 08-05-dice.js file.

/** @type {boolean} */ const ground = true;
/** @type {GrWorld} */ const world = ground ? new GrWorld() : new GrWorld({groundplane: false});

// put the two dice into the world Here
// don't forget to orient them so they have different numbers facing up
// Begin Example Solution
/** @type {GrDice} */ const dice1 = new GrDice({ y: 1.5, x: 2, z: -2, offset: 0.5 });
world.add(dice1);
/** @type {GrDice} */const dice2 = new GrDice({ y: 1.5, x: -2, z: -2, offset: 0.5, rx: Math.PI * 0.5 });
world.add(dice2);
// End Example Solution

world.go();