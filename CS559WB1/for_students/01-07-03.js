/**
 * @description: CS559 2023_Spring solution
 * @date: Jun.15 2023
 */

// @ts-check
export { };

// get message from HTML
/** @type {HTMLElement} */
const text = /** @type {HTMLElement}*/ (document.getElementById("ex3-span"));

// reference: https://htmlcolorcodes.com/color-names/
// create an array of objects, containing 10 colors (name, rbg values)
/**@type {object[]} */
const colorList = [
    { name: "Crimson",          rgb: [220,  20,  60] },
    { name: "LightSalmon",      rgb: [255, 160, 122] },
    { name: "Orange",           rgb: [255, 165,   0] },
    { name: "Lavender",         rgb: [230, 230, 250] },
    { name: "MediumPurple",     rgb: [147, 112, 219] },
    { name: "DarkSlateBlue",    rgb: [ 72,  61, 139] },
    { name: "Olive",            rgb: [128, 128,   0] },
    { name: "MediumAquamarine", rgb: [102, 205, 170] },
    { name: "Tan",              rgb: [210, 180, 140] },
    { name: "Silver",           rgb: [192, 192, 192] },
];

/** @type {number[]} */ 
let userRequest = [];    // a queue for collecting user's request

// create 10 buttons
colorList.forEach((_, i) => createButton(i));

/**
 * 
 * @param {number} cid 
 */
function createButton(cid) {
    // create and cast a button object
    /** @type {HTMLButtonElement} */
    const btn = /** @type {HTMLButtonElement} */ (document.createElement("button"));
    document.body.appendChild(btn);  // append to HTML body

    // each click append a new request to the `userRequest` queue
    btn.onclick = () => {
        console.log(`${colorList[cid].name} (click)`);

        // for each click, we only need to push the corresponding color
        // into the userRequest queue, we are done.
        userRequest.push(cid);    
    }

    // student can ignore the following block, which handles style issues:
    {
        // set attributes
        btn.textContent = colorList[cid].name;
        btn.style.width = '140px';
        btn.style.height = '30px';
        btn.style.fontWeight = '500';
        btn.style.marginRight = '10px';
        btn.style.marginBottom = '10px';
        btn.style.backgroundColor = getRGB(colorList[cid].rgb);
        btn.style.borderWidth = 'thin';

        btn.onmouseover = () => {
            btn.style.borderWidth = 'medium';
        }

        btn.onmouseleave = () => {
            btn.style.borderWidth = 'thin';
        }

        btn.onmousedown = () => {
            btn.style.fontWeight = '700';
            btn.style.color = "white";
        }

        btn.onmouseup = () => {
            btn.style.fontWeight = '500';
            btn.style.color = "black";
        }
    }
}


// define variables for color update
const lifespan = 2000;                // 2 sec is 2000 ms 
let   lasttime = undefined;           // used for calculate `time delta`
let   dbVal    = 0;                   // uded for find correct interpolation parameter

const baseColor = [255, 255, 255];    // white color
let   prevColor = baseColor;          // color in previous cycle
let   nextColor = undefined;          // color in next cycle

let pause = false;

/**
 * 
 * @param {number} currtime 
 */
function update(currtime) {
    if (lasttime === undefined) {
        lasttime = currtime;          
    }
    // get `time delta` and update current `position` within each 2-sec cycle
    const delta = pause ? 0 : (currtime - lasttime);
    dbVal = (dbVal + delta) % lifespan;

    slider.value = dbVal.toString();
    msg.innerHTML = `${(dbVal / 1000).toFixed(2)} sec`;

    // stage.1 color transition: previous color to white
    if (dbVal < 500) {
        const newColor = colorInterpolation(prevColor, baseColor, dbVal / 500);
        text.style.backgroundColor = getRGB(newColor);
    }

    // stage.2 color transition: white to next color
    else if (dbVal < 1000) {

        // if next color is not picked
        if (nextColor === undefined) {
            // try to poll the earilest user's request
            let k = userRequest.shift();

            if (k !== undefined) {
                // pick user selected color if possible
                nextColor = colorList[k].rgb;
                console.log(`${colorList[k].name} (serve)`);
            }
            else {
                // otherwise, pick a random color
                k = randomInt(0, colorList.length);
                nextColor = colorList[k].rgb;
                console.log(`${colorList[k].name} (random)`);
            }
        }

        // update color
        const newColor = colorInterpolation(baseColor, nextColor, (dbVal - 500) / 500);
        text.style.backgroundColor = getRGB(newColor);
    }

    // stage.3 hold current color for 1 sec
    else if (nextColor !== undefined) {
        prevColor = nextColor;
        text.style.backgroundColor = getRGB(prevColor);
        nextColor = undefined;
    }

    window.requestAnimationFrame(update);
    lasttime = currtime;
}
window.requestAnimationFrame(update);


// student can ignore the following part:
// we add a button and slider for good visualization
// the button can pause/resume the current animation
// the slider spends 2 seconds to move from left to right

/** @type {HTMLButtonElement} */
const pauseBtn = /** @type {HTMLButtonElement} */ (document.createElement("button"));

// set button attributes
pauseBtn.textContent = "Pause";
pauseBtn.style.width = '75px';
pauseBtn.style.height = '30px';
pauseBtn.style.marginRight = '10px';
document.body.appendChild(pauseBtn);  // append to HTML

// set event handler
pauseBtn.onclick = () => {
    if (!pause) {
        pause = true;
        console.log("pausing...");
        pauseBtn.textContent = "Run";
        lasttime = undefined;
    }
    else {
        pause = false;
        pauseBtn.textContent = "Pause";
    }
}
// start in running state - click the button twice to make sure things are synced
pauseBtn.click();
pauseBtn.click();

/** @type {HTMLInputElement} */
const slider = /** @type {HTMLInputElement} */ (document.createElement("input"));
slider.type = 'range';
slider.min = '0';
slider.max = '2000';
slider.step = '0.01';
slider.value = '0';
slider.disabled = true;
document.body.appendChild(slider);

/** @type {HTMLLabelElement} */
const msg = /** @type {HTMLLabelElement} */ (document.createElement("label"));
msg.innerHTML = 'undefined';
msg.style.marginLeft = '10px';
document.body.appendChild(msg);


/**
 * Convert an array of numbers to rgb string form
 * 
 * @param {number[]} color - an array of number representing RGB color
 * @return {string} a string representation of RGB color
 */
function getRGB(color) {
    return `rgb(${color[0]},${color[1]},${color[2]})`;
}

/**
 * Color interpolation
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
 * @param {number} min - an integer, lower bound (inclusive)
 * @param {number} max - an integer, upper bound (exclusive)
 * @returns {number} a randome integer in range [min : max)
 */
function randomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}
