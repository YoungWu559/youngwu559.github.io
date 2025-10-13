/*jshint esversion: 6 */
// @ts-check

// get things we need
import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { AutoUI } from "../libs/CS559-Framework/AutoUI.js";
import { GrCrane, GrExcavator } from "./07-09-01-constructionobjects.js";

let cDiv = document.getElementById("construction");
let world = new GrWorld({ groundplanesize: 10, where: cDiv, renderparams: {preserveDrawingBuffer:true}, id:"canvas" });

let crane = new GrCrane({ x: 2, z: -2 });
world.add(crane);
let c_ui = new AutoUI(crane, 300, cDiv, 1, true);

let excavator = new GrExcavator({ x: -2, z: 2 });
world.add(excavator);
let e_ui = new AutoUI(excavator, 300, cDiv, 1, true);
e_ui.set("x", 6);
e_ui.set("z", 3);
e_ui.set("theta", 36);

// let excavator2 = new GrExcavator({ x: -2, z: 2 });
// world.add(excavator2);
// let e_ui2 = new AutoUI(excavator, 300, cDiv, 1, true);
// e_ui2.set("x", 6);
// e_ui2.set("z", 3);
// e_ui2.set("theta", 36);

world.go();

// CS559 2025 Workbook
