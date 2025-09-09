// @ts-check

export {};

/**
 * Example 2 (Insides and Outsides) - Squares with style
 * Part A
 */
/** @type {HTMLCanvasElement} */
let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("box2canvas1"));
let context = canvas.getContext('2d');

// a yellow rectangle with a darker border
context.fillStyle = "yellow";
context.strokeStyle = "goldenrod";
// note that we draw the rectangle twice - once for inside, once for outside
context.fillRect(30,30,30,30);
context.strokeRect(30,30,30,30);

// same thing, but with a thicker border
// a yellow rectangle with a darker border
context.lineWidth = 3;

// note that we draw the rectangle twice - once for inside, once for outside
context.fillRect(80,30,30,30);
context.strokeRect(80,30,30,30);

// there are many different styles we can use
context.fillStyle = "lightblue";
context.strokeStyle = "darkblue";
context.lineWidth = 4;
context.setLineDash([4,4]);
context.fillRect(130,30,30,30);
context.strokeRect(130,30,30,30);

// note that if we don't change things, we're stuck with what
// we're left with
context.fillStyle = "lightgreen";
context.strokeStyle = "darkgreen";
context.fillRect(180,30,30,30);
context.strokeRect(180,30,30,30);
