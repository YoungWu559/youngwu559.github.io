/**
 * @description: CS559 2023_Spring solution
 * @date: Jun.15 2023
 */

// @ts-check
export { };

// get message from HTML
/** @type {HTMLElement} */
const text = /** @type {HTMLElement}*/ (document.getElementById("ex3-span"));
let currentRunningButton = -1;

// create a set of buttons
/** @type {HTMLButtonElement} */  const redBtn    = createButton("Red", [255,0,0,1], 0);
/** @type {HTMLButtonElement} */  const yellowBtn = createButton("Yellow", [255,255,0,1], 1);
/** @type {HTMLButtonElement} */  const greenBtn  = createButton("Green", [0,255,0,1], 2);
/** @type {HTMLButtonElement} */  const blueBtn   = createButton("Blue", [0, 0, 255,1], 3);

/**
 * Since the required color-updating buttons share great similarities in 
 * functionalities, we may define a function to implement them.
 * 
 * There are there parts in this function:
 * 1. Button creation, which sets attributes of button and appends it to the HTML body.
 *    Note, we can do these in the '01-07-02.html' file and we've learn it from previous
 *    pages in this workbook. Here provides an example of how to do these in js file.
 * 
 * 2. We define a set of local variables and the update() function, which calls the
 *    requestAnimationFrame() running in next 2 seconds since the button is clicked.
 *    The requestAnimationFrame() handles our request of text-background color update.
 * 
 * 3. We create a button-click event handler to initiate the functionality of this button.
 * 
 * @param {string} btnContent - text content on a button
 * @param {number[]} color - the color for this button
 * @param {number} bid = unique id for button
 * @returns a butten element
 */
function createButton(btnContent, color, bid) {
    /* Part.1 */
    // create and cast a button object
    /** @type {HTMLButtonElement} */
    const btn = /** @type {HTMLButtonElement} */ (document.createElement("button"));

    // set attributes of button
    btn.textContent = btnContent;
    btn.style.width = '75px';
    btn.style.height = '30px';
    btn.style.marginRight = '10px';

    // append to HTML body and return it
    document.body.appendChild(btn);

    /* Part.2 */
    // prepare 'local' variables for update function
    const buttonID = bid;
    const tgtColor = color;
    let   srcColor = undefined;

    const lifespan = 2000;       // 2000 ms = 2 second
    let   lasttime = undefined;  // 
    let   timer    = undefined;  // keep track of accumulate time
    
    // define update() function 
    function update(currtime) {
        // check if this is the most recent call
        if (currentRunningButton != buttonID) {
            console.log(`${btnContent} is interrupt`);
            return;
        }
        console.log(`${btnContent} is running`);

        if (lasttime === undefined) {
            lasttime = currtime;
        }

        // update times
        const delta = currtime - lasttime;
        timer += delta;
        
        // update background with the interpolated color
        const t = clamp(timer / lifespan, 0, 1);
        const newColor = colorInterpolation(srcColor, tgtColor, t);
        text.style.backgroundColor = getRGBa(newColor);

        // timer is greater than 2 sec, we are done.
        if (timer >= 2000) {
            reset.disabled = false;     // this statement is not requred for student
            currentRunningButton = -1;  
            console.log(`${btnContent}: done with color ${newColor}`);
        }
        // timer is less than 2 sec, need next frame.
        else {
            window.requestAnimationFrame(update);
            lasttime = currtime;
        }
    }

    /* Part.3 */
    btn.onclick = () => {
        // immediately update text context
        text.innerHTML = `some text that will become ${btnContent.toUpperCase()}`;
        reset.disabled = true;

        // setup local variables for animation
        currentRunningButton = buttonID;
        timer = 0;
        lasttime = undefined;
        srcColor = extractRGBa(window.getComputedStyle(text, null).backgroundColor);
        
        // request frame for update() function
        window.requestAnimationFrame(update);
    }
    return btn;
}


// create a reset button for convenience (not required, students may skip it) -----------
/** @type {HTMLButtonElement} */
const reset = /** @type {HTMLButtonElement} */ (document.createElement("button"));

// set button attributes
reset.textContent = "Reset";
reset.style.width = '75px';
reset.style.height = '30px';
reset.style.marginRight = '10px';
document.body.appendChild(reset);  // append to HTML

// set event handler
reset.onclick = () => {
    text.innerHTML = "some text to make change.";
    text.style.backgroundColor = "";
}

// some helper functions ----------------------------------------------------------------
/**
 * Color interpolation
 * 
 * @param {number[]} c0 source color, either rgb or rgba
 * @param {number[]} c1 target color, either rgb or rgba
 * @param {number} t - parameter that determines a position between c0 and c1
 * @return {number[]} interpolated color
 */
function colorInterpolation(c0, c1, t) {
    return c0.map((v,i) => (v + (c1[i] - v) * t));
}

/**
 * Convert an array of numbers to rgb/rgba string form
 * 
 * @param {number[]} c - an array of number representing RGB/RGBA color
 * @return {string} a string representation of RGB/RGBA color
 */
function getRGBa(c) {
    if (c.length == 4)
        return `rgba(${c[0]},${c[1]},${c[2]},${c[3]})`;
    else
        return `rgb(${c[0]},${c[1]},${c[2]})`;
}

/**
 * This function assumes input is a valid rgb/rgba string,
 * it extract the rgb numbers from it and returns an array
 * eg. it converts `rgb(255,255,0)` to [255, 255, 0]
 *     it converts `rgba(200, 200, 100, 1)` to [200, 200, 100, 1]
 * 
 * @param {string} str - a rgb or rgba string
 * @returns {number[]} - return an array of numbers
 */
function extractRGBa(str) {
    return str.replace(/[^\d,]/g, '')   // only keep digit-chars and comma
              .split(',')               // split it by comma
              .map(x => Number(x));     // map each string to a number
}

/**
 * 
 * @param {number} num - unsafe number
 * @param {number} min - lower bound
 * @param {number} max - upper bound
 * @returns {number} number in range [min, max]
 */
function clamp(num, min, max) {
    if (num <= min) return min;
    if (num >= max) return max;
    return num;
}
