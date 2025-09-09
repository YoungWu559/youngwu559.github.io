// @ts-check
export {};

/**
 * Example 3 (Drawing Order and Transparency)
 * Part A
 */
/** @type {HTMLCanvasElement} */
let canvas31 = /** @type {HTMLCanvasElement} */ (document.getElementById("box3canvas1"));
let context31 = canvas31.getContext('2d');

context31.lineWidth = 3;

context31.fillStyle = "yellow";
context31.strokeStyle = "goldenrod";
context31.fillRect(30,30,40,40);
context31.strokeRect(30,30,40,40);

context31.fillStyle = "lightpink";
context31.strokeStyle = "darkred";
context31.fillRect(50,35,30,30);
context31.strokeRect(50,35,30,30);

// same thing, different order
context31.fillStyle = "lightpink";
context31.strokeStyle = "darkred";
context31.fillRect(120,35,30,30);
context31.strokeRect(120,35,30,30);

context31.fillStyle = "yellow";
context31.strokeStyle = "goldenrod";
context31.fillRect(100,30,40,40);
context31.strokeRect(100,30,40,40);

// if we don't fill, we don't cover over the inside
context31.fillStyle = "yellow";
context31.strokeStyle = "goldenrod";
context31.fillRect(170,30,40,40);
context31.strokeRect(170,30,40,40);

context31.fillStyle = "lightpink";
context31.strokeStyle = "darkred";
context31.strokeRect(190,35,30,30);
