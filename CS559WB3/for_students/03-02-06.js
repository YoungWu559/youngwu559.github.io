/**
 * @description: CS559 2023 Spring Workbook Solution
 * @date: Jan.27 2023
 */

// @ts-check
export { };

import * as trisquare from "./03-02-TriSquare.js";

const canvas1 = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
const context1 = /** @type {CanvasRenderingContext2D} */ (canvas1.getContext('2d'));

context1.scale(2,1);
context1.scale(1,0.25);
context1.scale(4,4);
context1.scale(.5,1);
trisquare.drawTriSquare(context1);

const canvas2 = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas2"));
const context2 = /** @type {CanvasRenderingContext2D} */ (canvas2.getContext('2d'));

/* Explanation:
   multiple scale-transformations can be combined together
   to one scale-transformation by multiplication:
        sx = (2 * 1 * 4 * 0.5)  = 4
        sy = (1 * 0.25 * 4 * 1) = 1
*/
context2.scale(4, 1); // solution
trisquare.drawTriSquare(context2);
