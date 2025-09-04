/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/*jshint esversion: 6 */
// @ts-check

// get things we need
// import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { AutoUI } from "../libs/CS559-Framework/AutoUI.js";
import { GrCrane, GrExcavator, GrWreckingBall, GrForklift, GrRoboticArm } from "./07-09-constructionobjects.js";

let cDiv = document.getElementById("construction");
let world = new GrWorld({ groundplanesize: 10, where: cDiv });

// Begin Example Solution
// Add the robotic arm
let roboticArm = new GrRoboticArm() ;
world.add(roboticArm);
let r_ui = new AutoUI(roboticArm, 300, cDiv, 1, false, "inline");
r_ui.set("config", 0);

// Add the wreckingBall
let wreckingBall = new GrWreckingBall({x: 0, z: 0});
world.add(wreckingBall);
let wb_ui = new AutoUI(wreckingBall, 300, cDiv, 1, false, "inline");
wb_ui.set("x", -3.33);
wb_ui.set("z", 1.33);
wb_ui.set("theta", 72);

// Add the forklift
let forklift = new GrForklift({ x: 0, z: 0, size: 0.5 });
world.add(forklift);
let f_ui = new AutoUI(forklift, 300, cDiv, 1, false, "inline");
f_ui.set("x", 0);
f_ui.set("z", 5);
f_ui.set("theta", 240);
// End Example Solution

let crane = new GrCrane({ x: 2, z: -2 });
world.add(crane);
let c_ui = new AutoUI(crane, 300, cDiv, 1, false, "inline");

let excavator = new GrExcavator({ x: -2, z: 2 });
world.add(excavator);
let e_ui = new AutoUI(excavator, 300, cDiv, 1, false, "inline");
e_ui.set("x", 6);
e_ui.set("z", 3);
e_ui.set("theta", 36);

world.go();
