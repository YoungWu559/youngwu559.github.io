/**
 * @description: CS559 2023 Spring Workbook Solution
 * @date: Jan.31 2023
 */

//@ts-check
export { };

// How to use functions from other js file ?
// 1. Write the function names in the curly braces after `import`
// 2. Write the source file name after `from`
// 3. Add `export` keywords for functions is the source file ("./03-06-01bs.js")ß
import {makeQuadCopter, drawBackground, getRGBA, drawCircle} from "./03-06-01bs.js"
// Therefore, we can use the above functions in file "./03-06-01bs.js"


// get canvas
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas2'));
const context = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
const mouse = [0, 0];

let lasttime = undefined;
/**
 * For larger programs, there tends to be logs of drawings in each frame.
 * It's better to wrtie some functions to draw each object and 
 * make the `animiation` function concise and clean.
 * 
 * Eg. this function clearly shows that there are two
 *     quadcopters in this animation.
 * 
 * @param {number} currtime - timestamp
 */
function animation(currtime) {
    // get time delta
    if (lasttime === undefined) {
        lasttime = currtime;
    }
    const delta = (currtime - lasttime);
    
    // drawing
    drawBackground(context);
    drawQuadCopter(context, delta, path.getState(delta, true));

    // request next frame
    window.requestAnimationFrame(animation);
    lasttime = currtime;
}
window.requestAnimationFrame(animation);


// create an instance of quadcopter from the function
// `makeQuadCopter()` in `03-06-01bs.js` file
const drawQuadCopter = makeQuadCopter(0.7);


/**
 * An closure function defines a segment path, and returns two functions.
 *  - update(): allows a mouse click event to update current target position
 *  - getState(): returns the current position and direction of a coordinates
 * 
 * @returns {object} 
 */
function segmentPath() {
    const colorList = {
        white: getRGBA([255,255,255,1]),
        gray : getRGBA([235, 235, 235, 0.2]),
    };

    const speed = 0.1;
    let src = [canvas.width/2, canvas.height/2];  // source position of the segment path
    let tgt = [canvas.width/2, canvas.height/2];  // target position of the segment path
    let cur = [canvas.width/2, canvas.height/2];  // current position on the path
    let dir = -Math.PI;                           // direction of this path
    let lim = dist(src, tgt) / speed;             // total time to pass along this path
    let tmr = 0;                                  // timer

    /**
     * This function updates the target position whenever a mouse is clicked.
     * the `tgt` array keeps track of the most recent mouse click.
     */
    function updateTarget() {
        // set current position as a new source
        // set the mouse click position as a new target
        src = cur.map(x => x);
        tgt = mouse.map(x => x);

        // updates direction
        const dy = tgt[1] - src[1];
        const dx = tgt[0] - src[0];
        dir = Math.atan2(dy, dx) - Math.PI / 2;

        // updates total time and reset timer
        lim = dist(src, tgt) / speed;
        tmr = 0;
    }

    /**
     * This function calculate the current position and direction of
     * the local coordinates for a quadcopter.
     * 
     * @param {number} delta - time delta
     * @param {boolean} showPath - flag to control whether or not to display the path
     * @return {object} an object contains position and direction
     */
    function getCurrentPosAndDir(delta, showPath) {
        // if true, draw the segment path
        if (showPath) {
            context.beginPath();
            context.moveTo.apply(context, cur);
            context.lineTo.apply(context, tgt);
            context.closePath();
            
            context.strokeStyle = colorList.gray;
            context.stroke();

            drawCircle(context, src[0], src[1], 3, colorList.gray, undefined);
            drawCircle(context, tgt[0], tgt[1], 3, colorList.white, undefined);
        }

        // accumulate timer and use lerp to find current sate
        tmr += delta;
        const t = clamp(tmr/lim, 0, 1);
        cur = lerp(src, tgt, t);

        if (t == 1) showText();

        // return current state
        return {
            px: cur[0],
            py: cur[1],
            dir: dir,
        }
    }

    // return an object of two functions
    return {
        update: updateTarget,
        getState: getCurrentPosAndDir
    };
}

// The variable path is an object that contains two functions
//  - path.update()
//  - path.getState()
const path = segmentPath();


/**
 * This function updates the target position of the quadcopter whenenver
 * a mouse is clicked.
 * 
 * @param {MouseEvent} event - mouse left-single-click event
 */
canvas.onclick = (event) => {
    const box = /** @type {HTMLCanvasElement} */ (event.target).getBoundingClientRect();
    mouse[0] = event.clientX - box.left;
    mouse[1] = event.clientY - box.top;

    // update the target posisiton
    path.update();
};


/**
 * Display prompt text
 */
function showText() {
    
    context.save();
    {
        context.fillStyle = getRGBA([200, 170, 130, 1]);
        context.font = '24px sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        context.fillText('click to pick a target point', canvas.width / 2, canvas.height * 0.85);
    }
    context.restore();
}


/**
 * Distance calculation function
 * 
 * @param {number[]} p - a point
 * @param {number[]} q - another point
 * @returns {number} return the distance between points p and q
 */
function dist(p, q) {
    return Math.sqrt((q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2);
}


/**
 * Linear interpolation
 * 
 * @param {number[]} a - initial state
 * @param {number[]} b - target state
 * @param {number} t - the t parameter in range 0:1
 * @returns {number[]} state in between a and b
 */
function lerp(a, b, t) {
    return a.map((v, i) => (v + (b[i] - v) * t));
}


/**
 * Returns a number bounded by min and max, inclusive
 * 
 * @param {number} num - number
 * @param {number} min - lower bounds
 * @param {number} max - upper bounds
 * @returns {number}
 */
function clamp(num, min, max) {
    if (num <= min) return min;
    if (num >= max) return max;
    return num;
}
