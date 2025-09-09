// @ts-check
export {};

// we'll keep track of a set of "dots"
let dots = [];

let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("boxcanvas"));
let context = canvas.getContext('2d');

// when the mouse moves in the canvas, remember where it moves to
canvas.onmousemove = function(event) {
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    // unfortunately, X,Y is relative to the overall window -
    // we need the X,Y inside the canvas!
    // we know that event.target is a HTMLCanvasElement, so tell typescript
    let box = /** @type {HTMLCanvasElement} */ (event.target).getBoundingClientRect();
    mouseX -= box.left;
    mouseY -= box.top;
    dots.push({"x":mouseX,"y":mouseY});
};

function animate() {
    // clear the canvas
    context.clearRect(0,0,canvas.width,canvas.height);

    // draw all of the dots
    dots.forEach(function(dot){
        context.fillStyle = "#8888FF88";
        context.fillRect(dot.x-3,dot.y-3,6,6);
    });

    window.requestAnimationFrame(animate);
}
animate();

document.getElementById("mybutton").onclick = function() {
    dots = [];
};


