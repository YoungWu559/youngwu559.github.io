// @ts-check
export {};

/**
 * Example 2 (Insides and Outsides) - Squares with style
 * Part C
 */
/** @type {HTMLCanvasElement} */
let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("box2canvas3"));
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
    context.save();
        context.fillStyle = "lightpink";
        context.strokeStyle = "darkred";
        context.lineWidth = 5;
        context.setLineDash([5,5]);
        context.fillRect(130,30,30,30);
        context.strokeRect(130,30,30,30);
    context.restore();
    context.fillRect(180,30,30,30);
    context.strokeRect(180,30,30,30);
context.restore();
context.fillRect(230,30,30,30);
context.strokeRect(230,30,30,30);
