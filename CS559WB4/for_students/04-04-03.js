/**
 * CS559 Spring 2023 Example Solution
 * Written by CS559 course staff
 */

/**
 * 04-04-03.js - a simple JavaScript file that gets loaded with
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
 * This should perform some transformation - you can decide how it works
 *
 * @param {CanvasRenderingContext2D} context
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
function twoDots(context, x1, y1, x2, y2) {

    //  .  .  .  .  .  .  .  .  .  .  .  .  .  .
    //  .  .  .  .  .  .  .  .  . (F) .  .  .  .
    //  .  .  .  .  .  .  .  .  .  .  .  .  .  .
    //  .  .  . (R) .  .  .  .  .  .  .  .  .  .
    //  .  .  . ********  .  .  .  .  .  .  .  .
    //  .  .  **************(B) .  .  .  .  .  .
    //  .  . *************** .  .  .  .  .  .  .
    //  . (N)**************  .  .  .  .  .  .  .
    //  .  .  .  ******** .  .  .  .  .  .  .  .
    //  .  .  .  .  . (G) .  .  .  .  .  .  .  .
    //  .  .  .  .  .  .  .  .  .  .  .  .  .  .
    //  .  .  .  .  .  .  .  .  .  .  .  .  .  .
    //
    // We are given R (x1, y1) and G (x2, y2),
    // If we could find B (Bx, By), the following part of
    // this question would be the same as Box2. Let's find
    // B in the following way:
    //
    // 1. if we rotate vector RG -90 degree, we get RF,
    //    which can be easily done by the formula of 
    //    vector rotation -90 degree: (x, y) => (y, -x),
    //    so, we have:
    //          RG = <dx,  dy>
    //          RF = <dy, -dx>
    //
    // 2. G is the middle point of G and F, so we can easily
    //    calculate B by middle point formula:
    //    RB = (RG + RF) / 2
    
    const dx = x2 - x1;
    const dy = y2 - y1;

    const Bx = (dy + dx) / 2;
    const By = (dy - dx) / 2;

    const a = Bx / 10;
    const b = By / 10;
    const c = -b;
    const d =  a;
    const e = x1;
    const f = y1;
    // please leave this line - you should CHANGE the 6 lines above
    context.transform(a, b, c, d, e, f);
}


// start the program running
utilities.setup("canvas1", twoDots);

