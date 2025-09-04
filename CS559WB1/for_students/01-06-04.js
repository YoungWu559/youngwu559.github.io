/**
 * @description: CS559 2023_Spring solution
 * @date: Jun.15 2023
 */

// @ts-check
export { };

/**
 * @description update text backgound color between 2 colors gradually
 * Xin added in Jun.3 2023
 */

/** @type {HTMLElement} */
const text = /** @type {HTMLElement}*/ (document.getElementById("ex3-span"));

const white = [255, 255, 255];   // source color 1
const red   = [255,   0,   0];   // target color 1
const green = [  0, 255,   0];   // source color 2
const blue  = [  0,   0, 255];   // target color 2

const speed = 0.001;    // this parameter controls how fast color changes
const dbMax = 2;       // our target param `t` is in range [0:1], its double range is 2
let dbVal = 0;
let lasttime = undefined;

/**
 * Callback function that updates the color of text background
 * @param {number} currtime 
 */
function updateText(currtime) {
    // initialize lasttime
    if (lasttime === undefined) {
        lasttime = currtime;
    }
    
    // use `time delta` and double-range technique to find parameter `t`
    const delta = (currtime - lasttime) * speed;
    dbVal = (dbVal + delta) % dbMax;                
    const t = Math.min(dbVal, dbMax - dbVal);

    // use interpolation to find color for this frame
    const color = colorInterpolation(white, red, t); 
    //const color = colorInterpolation(green, blue, t); 
    text.style.backgroundColor = getRGB(color);
    
    window.requestAnimationFrame(updateText);
    lasttime = currtime;
}
window.requestAnimationFrame(updateText);

/**
 * 
 * @param {number[]} c0 source color
 * @param {number[]} c1 target color
 * @param {number} t - parameter that determines a position between c0 and c1
 * @return {number[]} interpolated color
 */
function colorInterpolation(c0, c1, t) {
    const r = c0[0] + (c1[0] - c0[0]) * t;
    const g = c0[1] + (c1[1] - c0[1]) * t;
    const b = c0[2] + (c1[2] - c0[2]) * t;
    return [r, g, b];
}

/**
 * 
 * @param {number[]} color - an array of number representing RGB color
 * @return {string} - a string representation of RGB color
 */
function getRGB(color) {
    return `rgb(${color[0]},${color[1]},${color[2]})`;
}
