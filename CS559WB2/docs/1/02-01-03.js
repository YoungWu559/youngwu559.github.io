// @ts-check

export {};  // export nothing, so that we know that this is a module

let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
let context = canvas.getContext('2d');
// note that we don't need to draw - it will just get over-drawn by the
// first time through the animation loop!

// with SVG we have to make the rect element - just like in box 2 
let svg = document.getElementById("svg1");
const svgns = "http://www.w3.org/2000/svg";
let square = document.createElementNS(svgns, 'rect');
square.setAttribute("x", "30");
square.setAttribute("y", "30");
square.setAttribute("width", "30");
square.setAttribute("height", "30");
square.setAttribute("fill", "#00F");
// now add the square to the svg, like any other DOM element
svg.appendChild(square);

// now, make an animation loop that moves the box across the screen
// we'll remember that the elements as 150 pixels wide (from the HTML)
function onTick(timestamp) {
    // put both squares at the same place:
    let newX = (timestamp/5) % 150;

    // when we animate the canvas, we have to redraw things
    // thanks to closure, we can remember the context
    // first we need to clear the window...
    // we draw a rectangle that covers the whole thing
    context.clearRect(0, 0, canvas.width, canvas.height);
    // now redraw the square
    context.fillStyle = "#00F";
    context.fillRect(newX,30,30,30);

    // for the SVG object, the square is an object - we
    // just need to move it
    square.setAttribute("x",newX.toString());

    // schedule the next redraw
    window.requestAnimationFrame(onTick);
}
// start the "loop" by doing the initial iteration
// (which will schedule the second iteration, ...)
window.requestAnimationFrame(onTick);
    