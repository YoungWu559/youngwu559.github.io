// @ts-check
export {};

// use defer, not onload

// we'll keep track of a set of "dots"
let dots = [];

let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("boxcanvas"));
let context = canvas.getContext('2d');

// we want to know where the mouse is, but we only find out on movement events!
// so we'll keep some state
let mouseX = -10;
let mouseY = -10;
// when the mouse moves in the canvas, remember where it moves to
canvas.onmousemove = function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    // unfortunately, X,Y is relative to the overall window -
    // we need the X,Y inside the canvas!
    // we know that event.target is a HTMLCanvasElement, so tell typescript
    let box = /** @type {HTMLCanvasElement} */(event.target).getBoundingClientRect();
    mouseX -= box.left;
    mouseY -= box.top;
};
// if the mouse moves outside the canvas, give an outside value
canvas.onmouseleave = function() {
    mouseX = -10;
    mouseY = -10;
};

function box2animate() {
    // clear the canvas
    context.clearRect(0,0,canvas.width,canvas.height);
    // figure out where the mouse is
    // that's handled outside
    // if we're inside the canvas, then we'll make a dot
    if ( (mouseX > 0) && (mouseY > 0) ) {
        dots.push({"x":mouseX,"y":mouseY});
    }

    // move each dot downwards
    dots.forEach(function(dot) {
        dot.y = dot.y + 2;
    });
    // remove dots that went below the bottom
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
    dots = dots.filter(
        // this defines a function using "arrow notation"
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
        dot => (dot.y<canvas.height)
    );


    // draw all of the dots
    dots.forEach(function(dot){
        context.fillStyle = "#8888FF88";
        context.fillRect(dot.x-3,dot.y-3,6,6);
    });
    window.requestAnimationFrame(box2animate);
}
box2animate();

document.getElementById("mybutton").onclick = function() {
    dots = [];
};

