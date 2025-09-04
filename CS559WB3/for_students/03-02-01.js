// @ts-check

export {};

import * as trisquare from "./03-02-TriSquare.js";

/** @type {HTMLCanvasElement} */
const canvas1 = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
const context1 = /** @type {CanvasRenderingContext2D} */ (canvas1.getContext('2d'));
trisquare.drawTriSquare(context1);

/** @type {HTMLCanvasElement} */
const canvas2 = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas2"));
const context2 = /** @type {CanvasRenderingContext2D} */ (canvas2.getContext('2d'));
context2.scale(2, 2);
trisquare.drawTriSquare(context2);

/** @type {HTMLCanvasElement} */
const canvas3 = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas3"));
const context3 = /** @type {CanvasRenderingContext2D} */ (canvas3.getContext('2d'));
context3.scale(0.5, 0.5);
trisquare.drawTriSquare(context3);
