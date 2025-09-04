/**
 * @description: CS559 2023_Spring solution
 * @date: Jun.15 2023
 */

// @ts-check
export { };

/**
 * @description update text backgound color between 3 colors gradually and repeatly
 * @date Jun. 2023
 */

/** @type {HTMLElement} */
const text = /** @type {HTMLElement}*/ (document.getElementById("ex3-span"));

// prepare color list
/** @type {number[][]} */
const colors = [
    [255,   0, 0],  // red
    [255, 255, 0],  // yellow
    [  0, 255, 0],  // green

    // you are free to add extra colors to this list
    // [  0, 0, 255],  // blue
    // [255, 0, 255],  // purple
];

const speed = 0.0008;    // controls how fast color changes per ms
const dbMax = 2 * (colors.length - 1);
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

    // explanation: how we use `t` to do the interpulation over a list of colors
    // short version: 
    //  - the decimal-part of `t` points to the index of source color;
    //  - the fractional-part of `t` is the parameter for interpolation;
    const deci = Math.floor(t);
    const frac = t - deci;
    const color = colorInterpolation(colors[deci], colors[deci + 1], frac);
    text.style.backgroundColor = getRGB(color);

    // callback and update lasttime
    window.requestAnimationFrame(updateText);
    lasttime = currtime;
}
window.requestAnimationFrame(updateText);


/**
 * Note:
 *  - we have learned using linear interpolation to change color gradually
 *  - the following code is a concise way in doing that
 *  - it works for both rgb and rgba
 * 
 * @param {number[]} c0 source color
 * @param {number[]} c1 target color
 * @param {number} t - parameter that determines a position between c0 and c1
 * @return {number[]} interpolated color
 */
function colorInterpolation(c0, c1, t) {
    return c0.map((v, i) => (v + (c1[i] - v) * t));
}

/**
 * 
 * @param {number[]} color - an array of number representing RGB color
 * @return {string} a string representation of RGB color
 */
function getRGB(color) {
    return `rgb(${color[0]},${color[1]},${color[2]})`;
}
