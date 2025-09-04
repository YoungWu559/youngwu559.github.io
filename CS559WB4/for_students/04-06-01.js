/**
 * CS559 Spring 2023 Example Solution
 * Written by CS559 course staff
 */

// @ts-check
/* jshint -W069, esversion:6 */

import { runCanvas } from "../libs/CS559/runCanvas.js";

/* no need for onload - we use defer */

/* note how the draw function takes two arguments: the canvas and the time */
/* note that this is DIFFERENT than what we need for requestAnimationFrame */

/**
 * These parameter specifications are used by the type checker to find bugs!
 * @param {HTMLCanvasElement} canvas 
 * @param {Number} time 
 */
function myDraw(canvas, time) {
    // note the unsafe cast - this is to allow the type checker
    // to find bugs later, but not here...
    /** @type {CanvasRenderingContext2D} */ const context = canvas.getContext("2d");

    context.clearRect(0,0,canvas.width,canvas.height);
    context.save();
    context.translate(100,100);
    context.rotate(time * Math.PI);
    context.fillRect(-25,-50,50,100);
    context.restore();
}

// note - we can pass "runCanvas" either the name of the canvas, or the canvas element
runCanvas("canvas1",myDraw,1.0,false,0,2,.05);
