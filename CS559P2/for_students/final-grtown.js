/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/*jshint esversion: 6 */
// @ts-check

/**
 * Graphics Town Framework - "Main" File
 *
 * This is the main file - it creates the world, populates it with
 * objects and behaviors, and starts things running
 *
 * The initial distributed version has a pretty empty world.
 * There are a few simple objects thrown in as examples.
 *
 * It is the students job to extend this by defining new object types
 * (in other files), then loading those files as modules, and using this
 * file to instantiate those objects in the world.
 */

import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { WorldUI } from "../libs/CS559-Framework/WorldUI.js";
import * as T from "../libs/CS559-Three/build/three.module.js";
import * as InputHelpers from "../libs/CS559/inputHelpers.js";
import { main } from "./final-main.js";

/**m
 * The Graphics Town Main -
 * This builds up the world and makes it go...
 */

// To avoid error message
/** @type {HTMLElement} */ const div = document.getElementById("div1");
// make the world
let world = new GrWorld({
    width: 800,
    height: 600,
    where: div,
    groundplanesize: 1600, // make the ground plane big enough for a world of stuff
    background: "rgb(20%, 20%, 80%)",
    far: 20000
});
// Have the ground plane slightly below the roads
world.groundplane.objects[0].translateY(-5);
// To avoid the error message
world.active_object = world.groundplane;

// put stuff into the world
// this calls the example code (that puts a lot of objects into the world)
// you can look at it for reference, but do not use it in your assignment
main(world);

// while making your objects, be sure to identify some of them as "highlighted"

///////////////////////////////////////////////////////////////
// because I did not store the objects I want to highlight in variables, I need to look them up by name
// This code is included since it might be useful if you want to highlight your objects here
function highlight(obName) {
    const toHighlight = world.objects.find(ob => ob.name === obName);
    if (toHighlight) {
        toHighlight.highlighted = true;
    } else {
        throw `no object named ${obName} for highlighting!`;
    }
}
// of course, the student should highlight their own objects, not these
// highlight("SimpleHouse-5");
// highlight("Helicopter-0");
// highlight("Track Car");

///////////////////////////////////////////////////////////////
// build and run the UI
// only after all the objects exist can we build the UI
/** @type {WorldUI} */ const ui = new WorldUI(world, 300, div);
// @ts-ignore       // we're sticking a new thing into the world
world.ui = ui;
// Add a slider to the UI for time of day
/** @type {InputHelpers.LabelSlider} */ const slider = new InputHelpers.LabelSlider("Time of Day", {where: ui.div, min: 0, max: 24, step: 1/60, initial: world.lastTimeOfDay, id: "timeOfDay"});
// Increment time of day
function stepMinute() {
    // When the speed control is 0.1, step the time of day by 1 minute
    /** @type {number} */ const time = (world.lastTimeOfDay + Number(world.speedcontrol.value)/6) % 24;
    world.lastTimeOfDay = time;
    // Change the sky based on the time of day
    if (time < 5) world.scene.background = new T.Color("rgb(0%, 0%, 20%)");
    else if (time < 8) world.scene.background = new T.Color("rgb(20%, 20%, 80%)");
    else if (time < 16) world.scene.background = new T.Color("rgb(70%, 70%, 100%)");
    else if (time < 19) world.scene.background = new T.Color("rgb(20%, 20%, 80%)");
    else world.scene.background = new T.Color("rgb(0%, 0%, 20%)");
    // Update the slider
    slider.set(time);
}
// now make it go!
world.go({prestep:stepMinute});
