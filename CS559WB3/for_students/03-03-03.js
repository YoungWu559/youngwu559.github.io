/**
 * @description: CS559 2023 Spring Workbook Solution
 * @date: Jan.27 2023
 */

// @ts-check
export { };

import * as trisquare from "./03-02-TriSquare.js";

// the first canvas - which works
{
    // note that I am just using braces to have a new scope so I can keep my variable names
    const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
    const context = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));
    
    // scale first and then translate the right amount
    context.scale(0.5, 0.5);

    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 8; c++) {
            context.save();
            context.translate(c * 40, r * 40);
            trisquare.drawTriSquare(context);
            context.restore();
        }
    }
}

// the second Canvas - solution
// Canvas1. transformation (scale then translate):   (x + c * 40) * 0.5 
// Canvas2. transformation (translate then scale):   (x * ?) + c * 20
// The two expressions should be equal to each other, 
// so we have the following equation:
//      (x + c * 40) * 0.5 = (x * ?) + c * 20
// Solve for `?`, we have `?` = 0.5
{
    // note that I am just using braces to have a new scope so I can keep my variable names
    const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas2"));
    const context = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));

    // scale first and then translate the right amount
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 8; c++) {
            context.save();
            context.translate(c * 20, r * 20);

            context.scale(0.5, 0.5);   // solution: add scale(0.5, 0.5)
            trisquare.drawTriSquare(context);
            context.restore();
        }
    }
}
