// @ts-check
export {};

/**
 * Box 1 (Animation with Canvas) - animate something moving, and many things not moving
 * with Canvas. Both with and without display lists
 */

////////////////////////////////////////////////////////////////
// version 1 - just draw it over and over
//
// for Canvas, our "scene" is defined by the drawing function
// which redraws everything.
// we need to know the position of the moving box
/**
 * draw everything for Box 1 Canvas
 * @param {number} xpos
 */
function box1canvDrawAll(xpos) {
    // for real speed, these could be put outside the loop
    let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("box1canvas1"));
    let context = canvas.getContext('2d');
    // clear the canvas
    context.clearRect(0,0,canvas.width,canvas.height);
    // draw the static rectangles
    context.fillStyle = "#888";
    for(let c=0; c<4; c++) {
        for(let r=0; r<3; r++) {
            context.fillRect(30+c*50,20+r*20,30,10);
        }
    }
    // draw the moving rectangle
    context.fillStyle = "black";
    context.fillRect(xpos,35,20,20);
}
// the animation loop - we can have 1 function for both elements
function box1animate1(timestamp) {
    let xpos = (timestamp/10 % 260) - 10;

    // with Canvas, we have to redraw EVERYTHING
    box1canvDrawAll(xpos);

    // schedule the next "loop"
    window.requestAnimationFrame(box1animate1);
}
box1animate1();

///////////////////////////////////////////////////////////
// version 2 - a simple display list
/**
 * a display list made of rectangles
 * each "object" will store x1,y1,w,h,color
 * and whether or not it is clicked
 * we'll take advantage that unset properties are undefined
 */
// first we make a list of all the rectangles
let rects = [];
for(let c=0; c<4; c++) {
    for(let r=0; r<3; r++) {
        rects.push({"x":30+c*50,"y":20+r*20,"w":30,"h":10,color:"#888",clicked:false});
    }
}
// the last rectangle that moves
let rb = {"x":0,"y":35,"w":20,"h":20,"color":"black"};
rects.push(rb);     // need to draw this one as well

// now, draw all the rectangles
function box1animate2(timestamp) {
    // we need to move the moving rectangle - this is like what
    // we did in SVG
    rb.x = (timestamp/10 % 260) - 10;

    // now the drawing - we are responsible for redrawing
    // but that's easy since we just need to use the list
    let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("box1canvas2"));
    let context = canvas.getContext('2d');
    // clear the canvas
    context.clearRect(0,0,canvas.width,canvas.height);
   
    // draw the rectangles
    for(let r of rects) {
        context.fillStyle = r.color;
        context.fillRect(r.x, r.y, r.w, r.h);
    }
    window.requestAnimationFrame(box1animate2);
}
window.requestAnimationFrame(box1animate2);
