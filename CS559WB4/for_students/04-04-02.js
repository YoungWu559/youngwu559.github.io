/**
 * CS559 Spring 2023 Example Solution
 * Written by CS559 course staff
 */

/**
 * 04-04-02.js - a simple JavaScript file that gets loaded with
 * page 4 of Workbook 4 (CS559).
 *
 * written by Michael Gleicher, January 2019
 * modified January 2020
 *
 */

// @ts-check
/* jshint -W069, esversion:6 */

import * as utilities from "./04-04-utilities.js";

/**
 * TwoDots - a function for the student to write
 * Notice that it gets the two points and the context as arguments
 * This function should apply a transformation
 *
 * You must write this function using transform.
 * There should not be any rotate, translate or scale function calls.
 *
 * @param {CanvasRenderingContext2D} context
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
function twoDots(context, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;

    // Suppose O is the origin
    // RBGN is any arbitrary square, where
    // R: red-dot, B: Black-dot, G: green-dot
    //
    //   O  .  e  .  U  .  .  .  .  .  .  .  .
    //   .  .  .  .  f  .  .  .  .  .  .  .  .
    //   .  .  W  c (R) .  a  .  V  .  .  .  .
    //   .  .  .  .  #  #  #  .  b  .  .  .  .
    //   .  .  d  #  #  #  #  # (B) .  .  .  .
    //   .  .  .  #  #  #  #  #  .  .  .  .  .
    //   .  . (N) #  #  #  #  #  .  .  .  .  .
    //   .  .  .  .  #  #  #  .  .  .  .  .  .
    //   .  .  .  .  .  . (G) .  .  .  .  .  .
    //   .  .  .  .  .  .  .  .  .  .  .  .  .
  
    //   a  c  e
    // [ b  d  f ]
    //   0  0  1
    const a = (dx / 10);
    const b = (dy / 10);
    const c = -b;
    const d =  a;
    const e = x1;
    const f = y1;
    // please leave this line - you should CHANGE the 6 lines above
    context.transform(a, b, c, d, e, f);
}


// setup and start the program
utilities.setup("canvas1", twoDots, "black");

