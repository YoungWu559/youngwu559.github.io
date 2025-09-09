export {};

let canvas1 = document.getElementById("box2canvas1");
let span1 = document.getElementById("box2span1");
// get the event, look at what x and y are
canvas1.onclick = function(event) {
    const x = event.clientX;
    const y = event.clientY;
    // unfortunately, X,Y is relative to the overall window -
    // we need the X,Y inside the canvas!
    // we know that event.target is a HTMLCanvasElement, so tell typescript
    let box = /** @type {HTMLCanvasElement} */(event.target).getBoundingClientRect();
    const mx = x-box.left;
    const my = y-box.top;

    span1.innerHTML = `click in box1 event@(${x},${y}) - in canvas@(${mx.toFixed(0)},${my.toFixed(0)})`;
};

let canvas2 = document.getElementById("box2canvas2");
// get the event, look at what x and y are
canvas2.onclick = function(event) {
    const x = event.clientX;
    const y = event.clientY;
    // unfortunately, X,Y is relative to the overall window -
    // we need the X,Y inside the canvas!
    // we know that event.target is a HTMLCanvasElement, so tell typescript
    let box = /** @type {HTMLCanvasElement} */(event.target).getBoundingClientRect();
    const mx = x-box.left;
    const my = y-box.top;

    span1.innerHTML = `click in box2 event@(${x},${y}) - in canvas@(${mx.toFixed(0)},${my.toFixed(0)})`;
};
