// @ts-check

export {}; // null export tells vscode to treat this as a module

/**
 * Example 1 (Review the Basics) - just a simple square
 */
// use type information to make TypeScript happy
let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("box1canvas"));
let context = canvas.getContext("2d");

// now that we have the context, we can use it to issue drawing commands
// the results appear "immediately"
context.fillStyle = "#F00";
context.fillRect(30,30,30,30); 
