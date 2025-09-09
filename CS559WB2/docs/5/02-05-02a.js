 // @ts-check
export {};

// useful constant for doing SVG
const svgns = "http://www.w3.org/2000/svg";

/** a Helper - make an SVG rectangle
 * the click has type any (rather than [function] because handlers have complex signatures)
 *
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {string} fill
 */
function makeSVGrect(x,y,w,h,fill) {
    let rect = document.createElementNS(svgns, 'rect');
    rect.setAttribute("x", x.toString());
    rect.setAttribute("y", y.toString());
    rect.setAttribute("width", w.toString());
    rect.setAttribute("height", h.toString());
    rect.setAttribute("fill", fill);
    return rect;
}

/**
 * Part 2a (Events) - handling click events
 * for SVG, this is basically the same as Box 1 (just adding event handlers)
 * for Canvas, we need to do things differently...
 */
// define the event handler function
// trick - we know that the target is an svg object
function handleClick(event) {
    event.target.classList.toggle("lightredwithborder");
}
let svg2 = document.getElementById("boxsvg");
for(let c=0; c<4; c++) {
    for(let r=0; r<3; r++) {
        let rect = makeSVGrect(30+c*50,20+r*20,30,10,"#888");
        svg2.appendChild(rect);
        rect.onclick = handleClick;
    }
}
let svg2rect = makeSVGrect(0,35,20,20,"black");
svg2rect.onclick = handleClick;
svg2.appendChild(svg2rect);
function box2svgAnimate(timestamp) {
    let xpos = (timestamp/10 % 260) - 10;
    svg2rect.setAttribute('x',xpos.toString());
    window.requestAnimationFrame(box2svgAnimate);
}
window.requestAnimationFrame(box2svgAnimate);


