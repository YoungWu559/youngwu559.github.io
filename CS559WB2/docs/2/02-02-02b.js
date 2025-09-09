// @ts-check
export {};

/**
 * Example 2 (Insides and Outsides) - Squares with style
 * Part B
 */

/** @type {HTMLCanvasElement} */
let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("box2canvas2"));
let context = canvas.getContext('2d');

context.fillStyle = "yellow";
context.strokeStyle = "goldenrod";
context.fillRect(30,30,30,30);
context.strokeRect(30,30,30,30);

context.save();
    context.fillStyle = "lightblue";
    context.strokeStyle = "darkblue";
    context.lineWidth = 3;
    context.setLineDash([3,3]);
    context.fillRect(80,30,30,30);
    context.strokeRect(80,30,30,30);
context.restore();

// now we're back to think yellow
context.fillRect(130,30,30,30);
context.strokeRect(130,30,30,30);
