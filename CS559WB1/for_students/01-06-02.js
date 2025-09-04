/**
 * @description: CS559 2023_Spring solution
 * @date: Jun.15 2023
 */

// @ts-check
export { };

// get elements from document
/** @type {HTMLInputElement} */
const slider = /** @type {HTMLInputElement} */ (document.getElementById("slider"));

// get the real range = (max - min) of the slider,
// rather than assume it is 100
const sRange = Number(slider.max) - Number(slider.min);
let lasttime = undefined;
let speed = 0;

// add event handler to `start` and `stop` buttons
/** @type {HTMLButtonElement} */
(document.getElementById("start")).onclick = () => speed = 0.1;

/** @type {HTMLButtonElement} */
(document.getElementById("stop")).onclick = () => speed = 0;

/**
 * use `time delta` strategy to smoothly control the animation loops
 * @param {number} currtime 
 */
function advanceSLR(currtime) {
    if (lasttime === undefined) {
        lasttime = currtime;
    }
    
    const delta = (currtime - lasttime) * speed;
    slider.value = ((Number(slider.value) + delta) % sRange).toString();
    
    window.requestAnimationFrame(advanceSLR);
    lasttime = currtime;
};
window.requestAnimationFrame(advanceSLR);
