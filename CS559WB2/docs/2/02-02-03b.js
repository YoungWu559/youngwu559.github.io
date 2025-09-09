// @ts-check
export {};

/**
 * Example 3 (Drawing Order and Transparency)
 * Part B
 */

// ordering of stroke and fill
/** @type {HTMLCanvasElement} */
let canvas32 = /** @type {HTMLCanvasElement} */ (document.getElementById("box3canvas2"));
let context32 = canvas32.getContext('2d');

context32.fillStyle = "yellow";
context32.strokeStyle = "goldenrod";
context32.lineWidth = 7;

context32.fillRect(30,30,40,40);
context32.strokeRect(30,30,40,40);

context32.strokeRect(90,30,40,40);
context32.fillRect(90,30,40,40);
