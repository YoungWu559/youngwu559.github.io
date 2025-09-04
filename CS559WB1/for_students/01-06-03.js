/**
 * @description: CS559 2023_Spring solution
 * @date: Jun.15 2023
 */

// @ts-check
export { };

/** @type {HTMLInputElement} */
const sldr = /** @type {HTMLInputElement} */ (document.getElementById('slider'));

// set min and max to some other values to show the following algorithm
// works for any arbitrary values, rather than only works for [0:100]
sldr.min = "-80";
sldr.max = "220";
sldr.setAttribute("step", ".001");  // use higher resolution

// initialization
const dbMax = (Number(sldr.max) - Number(sldr.min)) * 2;  // double range
const speed = dbMax / 2000;        // set speed: a round trip costs 2 seconds
let   dbVal = Number(sldr.min);    // use `min` to initialize `dbVal`
let   lasttime = undefined;        

/**
 * We could use `double-range` technique to handle `back-and-forth` request.
 * 
 *  min                 max                dbMax
 *   |_ _ _ _ _ _ _ _ _ _|_ _ _ _ _ _ _ _ _ _|
 *   0        *         100       *         200
 *            |                   |
 *   |---50---|                   |
 *                                |
 *   |------ (dbVal = 150) -------|
 * 
 * Eg. if dbVal = 150, then (dbMax - dbVal) = 50, 
 *     the min of them (50, in this case) shows the corret offset from min 
 * 
 * Algorithm:
 * 1. we calculate changed value using elapse-time * speed
 * 2. we increment `dbVal` by delta and then take the remainder (%) of dbMax
 * 3. we could find the offset by taking the min of `dbVal` and `dbMax - dbVal`
 * 4. we update slider value by adding offset to its min value
 *  
 * @param {number} currtime 
 */
function bounce(currtime) {
    if (lasttime === undefined) {
        lasttime = currtime;
    }
    const delta = (currtime - lasttime) * speed;         // 1
    dbVal = (dbVal + delta) % dbMax;                     // 2

    const offset = Math.min(dbVal, dbMax - dbVal);       // 3
    sldr.value = (Number(sldr.min) + offset).toString(); // 4

    window.requestAnimationFrame(bounce);
    lasttime = currtime;
}
window.requestAnimationFrame(bounce);
