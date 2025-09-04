/**
 * @description: CS559 2023 Spring Workbook Solution
 * @date: Jan.17 2023
 */

//@ts-check
export { };

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('box1canvas'));
const context = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));

// build an array of colors, since there may be some
// circles overlap with each other, here we use alpha = 0.8
// for each circle-color, so it will provide a better
// visualization.
/** @type {string[]} */
const colorList = [
    getRGBA([15, 157, 88, 0.8]),   // green: initial color
    getRGBA([250, 210, 50, 0.8]),  // yellow: mouseover color
    getRGBA([219, 68, 55, 0.8]),   // red: reclick color
    getRGBA([250, 125, 0, 0.8]),   // orange: mouseover color
];

const RADIUS = 20;                // radius of circle
const RSQR = RADIUS * RADIUS;   // square of radius
const mouse = [0, 0];            // keep track of current posiiton of mouse

// stores a list of circles, we use an array of 3 numbers to keep track
// of each circle's meta-data as [cx, cy, state],
//  - cx and cy are center coordinates of that circle,
//  - for a green/yellow circle, state = 0
//  - for a   red/orange cirlce, state = 2
/** @type {number[][]} */
const circles = [];


/**
 * loop: in each frame, it clears the
 * background and draws the circles
 */
function loop() {
    clearCanvas();
    showText(); // optional
    circles.forEach(c => drawCircle(c));
    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);

/**
 * Event handler on mouse click:
 *  - for any circle that is clicked, we set its state to 2 and set flag false
 *  - if no circle is clicked, we add a new circle
 */
canvas.onclick = () => {
    let clickOnBoard = true;

    circles.forEach(c => {
        if (mouseIsOver(c) == 1) {
            c[2] = 2;  // update the state of circle
            clickOnBoard = false;
        }
    });

    if (clickOnBoard)
        circles.push([mouse[0], mouse[1], 0]);
};


/**
 * Event handler, keep track of current mouse's 
 * position on canvas coordinate system
 * 
 * @param {MouseEvent} event - mouse move event
 */
canvas.onmousemove = (event) => {
    const box = /** @type {HTMLCanvasElement} */ (event.target).getBoundingClientRect();
    mouse[0] = event.clientX - box.left;
    mouse[1] = event.clientY - box.top;
}


/**
 * Detect whether the mouse is over this circle
 * 
 * @param {number[]} c - an instance of circle
 * @returns {number} 1 if mouse is over the circle, otherwise 0
 */
function mouseIsOver(c) {
    return ((mouse[0] - c[0]) ** 2 + (mouse[1] - c[1]) ** 2) <= RSQR ? 1 : 0;
}


/**
 * Draws a circle
 * 
 * @param {number[]} c - an instance of circle
 */
function drawCircle(c) {
    context.save();
    {
        context.beginPath();
        context.arc(c[0], c[1], RADIUS, 0, Math.PI * 2, false);
        context.closePath();

        // select correct color according to the circle's state
        // and whether mouse is over it
        context.fillStyle = colorList[c[2] + mouseIsOver(c)];
        context.fill();
    }
    context.restore();
}


/**
 * This function fills the canvas
 */
function clearCanvas() {
    context.save();
    {
        context.fillStyle = getRGBA([245, 245, 245, 1]);
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.restore();
}


/**
 * Returns a string in rgba-string format
 * 
 * @param {number[]} c - color
 * @returns {string} - rgba(*,*,*,)
 */
function getRGBA(c) {
    return `rgba(${c[0]},${c[1]},${c[2]},${c[3]})`;
}




// ---- Below are utility functions which are optional -------
// ---- Students may ignore them -----------------------------

/**
 * create a reset button; double clicking it clears the canvas
 */
function createResetBtn() {
    const button = /** @type {HTMLButtonElement} */ (document.createElement('button'));

    button.textContent = 'Double click to clear';
    button.ondblclick = () => circles.length = 0;
    document.body.appendChild(button);
};
createResetBtn();

/**
 * Display prompt text
 */
function showText() {
    if (circles.length > 0)
        return;

    context.save();
    {
        context.fillStyle = getRGBA([200, 170, 130, 1]);
        context.font = '24px sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        context.fillText('click to add circles', canvas.width / 2, canvas.height / 2);
    }
    context.restore();
}
