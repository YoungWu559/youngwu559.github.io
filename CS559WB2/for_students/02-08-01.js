/**
 * @description: CS559 2023 Spring Workbook Solution
 * @date: Jan.17 2023
 * @overview: This file provides a complex solution that also covers all advance points
 */

//@ts-check
export {};

/* ------------------------------------------------------------------------- */
/* 1. Get, Create and Append HTML Elements                                   */
/* ------------------------------------------------------------------------- */
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('box2canvas'));
const context = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
const message = /** @type {HTMLInputElement} */ (document.createElement('span'));
const div = /** @type {HTMLInputElement} */ (document.createElement('div'));

// a checkbox, if checked, the program auto-launch fireworks
const autoLaunch = /** @type {HTMLInputElement} */ (document.createElement('input'));

autoLaunch.type = 'checkbox';
autoLaunch.checked = true;
autoLaunch.id = 'checkboxID_0';

// display how many fireworks and particles we have
const label = /** @type {HTMLLabelElement} */ (document.createElement('label'));

label.htmlFor = 'checkboxID_0';
label.innerHTML = 'Auto launch fireworks';

// append elements to HTML
document.body.appendChild(message);
document.body.appendChild(div);
div.appendChild(autoLaunch);
div.appendChild(label);


/* ------------------------------------------------------------------------- */
/* 2. Declare Global Variables and Define Animation and Drawing Functions    */
/* ------------------------------------------------------------------------- */

let fireworks = [];      // a list of rising fireworks objects
let particles = [];      // a list of exploding particles objects

const HORIZON = 360;       // y-coordinate of horizon
let tgtRadius = 0;         // helps to show the target marker
let deplTimer = 0;         // controls fireworks auto-deployment
let lasttime = undefined;  // helper for calculate delta


/**
 * Animation function
 * @param {number} currtime 
 */
function animation(currtime) {
    // track elapsed time
    if (lasttime === undefined) {
        lasttime = currtime;
    }
    const delta = (currtime - lasttime);
    
    // do the drawings
    preprocessing(delta);
    drawFireworks(delta);
    drawParticles(delta);
    
    // request next frame
    lasttime = currtime;
    window.requestAnimationFrame(animation);
}
drawBackGround(1);
window.requestAnimationFrame(animation);


/**
 * 
 * @param {number} delta - elasped time from last frame
 */
function preprocessing(delta) {
    tgtRadius = (tgtRadius + delta) % 300;

    // set alpha = 0.08 to enhance the tail-flame effect
    drawBackGround(0.08);

    // we use deploy timer to help us add next new wave of fireworks
    deplTimer -= delta;
    if (deplTimer < 0) {
        while (autoLaunch.checked && fireworks.length < 5) {
            addFireworks();
        }
        deplTimer = 4000;
    }

    // update statistics
    message.innerHTML = `<b>Fireworks</b>: ${fireworks.length}, 
                         <b>Particles</b>: ${particles.length}`;
}


/**
 * This function initialize meta-data for a firework and push it into
 * the `fireworks` array.
 * 
 * 1. For auto-launched fireworks, meta-data is generated randomly.
 * 2. For user-calling fireworks, meta-data is set to ensure it hits
 *    the calling point, then explodes there. 
 *    We use formula: y = a * (x - h) ^ 2 + k
 * 
 * @param {number | undefined} cx - user-click x pos or undefined
 * @param {number | undefined} cy - user-click y pos or undefined
 * @param {boolean} isFromUser if this firework is calling from a user
 */
function addFireworks(cx = undefined, cy = undefined, isFromUser = false) {
    // receive or randomly select target position
    const tx = cx ? cx : (75 + randomInt(canvas.width - 150));
    const ty = cy ? cy : (100 + randomInt(50));

    // randomly select starting x-position
    const px = 20 + randomInt(canvas.width - 40);
    const GA = 0.0002;         // gravity

    const dy = HORIZON - ty;   // vertical difference
    const dx = px - tx;        // horizontal difference

    // we use formula: y = a * (x - h) ^ 2 + k
    const time = Math.sqrt(2 * dy / GA);
    const coeA = dy / (dx ** 2);

    // randomly selected angle for auto-launched fireworks
    const beta = clamp(Math.atan2(dy, dx), 0.9, Math.PI - 0.9);

    fireworks.push({
        px: px,                  // position x
        py: HORIZON,             // position y
        sx: px,                  // source x
        sy: HORIZON,             // source y
        tx: tx,                  // target x
        ty: ty,                  // target y
        vx: Math.cos(beta),      // velocity x
        vy: Math.sin(beta),      // velocity y
        vm: random(0.5, 0.8),    // velocity magnitude
        ga: 1.5,                 // gravity acceleration
        ms: time,                // millisecond timer
        tt: time,                // total time
        wait: random(0, 1500),   // waiting time
        coeA: coeA,              // coefficient a
        isFromUser: isFromUser,
        color: randColor(150, 255, [0,0,0]),
    });
}


/**
 * This function draws fireworks and update its meta data;
 * it removes the firework that hits its target point.
 * 
 * For user-calling fireworks,
 *  - we ignore air-resistance, only a constant gravity affects its velocity
 *  - we let the user-selected point be the vertex of the parabola along
 *    which the firework moves; we randomly pick another point on HORIZON.
 *    With these two points, we can easily find the expression of the curve
 *    with the formula: Y = A * (X - H) ^ 2 + K
 * 
 * For auto-launched fireworks,
 *  - air-resistance affects both horizontal and vertical velocities
 * 
 * @param {number} delta - elasped time from last frame
 */
function drawFireworks(delta) {
    fireworks.forEach(f => {
        // draw target indicator at user-click-position
        if (f.isFromUser) {
            drawtarget(f.tx, f.ty);
        }
        // update waiting time 
        if (f.wait > 0) {
            f.wait -= delta;
            return;
        }
        // draw fireworks
        const style = f.isFromUser ? randColor(0, 256, [0,0,0]) : f.color;
        fillCircle( style, f.px, f.py, 2);
        fillCircle('#FFF', f.px, f.py, 1);

        // update meta-data of user-calling fireworks
        if (f.isFromUser) {
            f.ms = clamp(f.ms - delta, 0, f.ms);
            f.px = lerp(f.sx, f.tx, 1 - (f.ms / f.tt));
            f.py = f.coeA * ((f.px - f.tx) ** 2) + f.ty;
        }
        // update meta-data of auto-launched fireworks
        else {
            f.vm *= 0.98 ** (delta / 16);
            f.px -= f.vx * f.vm * delta;
            f.py -= f.vy * f.vm * delta - (f.ga * delta / 16);
            f.ms -= delta;
        }

        // check terminal conditions
        if ((f.isFromUser && f.ms == 0) ||
           (!f.isFromUser && f.ms <= -500 && f.py >= 50)) {
            // deploy particles
            addParticles(f.px, f.py, random(60, 110));
            f.ms = -10000;
        }
    });

    // remove fireworks that are exploding
    fireworks = fireworks.filter(f => f.ms > -5000);
}


/**
 * This function initialize a bunch of particles and push them
 * into the `particles` array for drawing.
 * 
 * @param {number} x - original x pos
 * @param {number} y - original y pos
 * @param {number} n - number of particles
 */
function addParticles(x, y, n) {
    // for particles in one fireworks, we made their color
    // "near" each other, so we only random pick colors in 
    // a small space, rather than in the whole color space.
    const raw = [0, 0, 0];
    raw[randomInt(3)] = random(175, 255);
    raw[randomInt(3)] = random(175, 255);

    // we add `n` particles to our data structure
    for (let i = 0; i < n; ++i) {
        const beta = random(0, Math.PI * 2);
        particles.push({
            px: x,                   // position x
            py: y,                   // position y
            vx: Math.cos(beta),      // velocity x
            vy: Math.sin(beta),      // velocity y
            vm: random(0.05, 0.7),   // velocity magnitude
            ga: 0.45,                // gravity acceleration
            ms: 0,                   // lifetime (ms)
            alpha: 1,                
            size: 3,                 
            color: randColor(50, 255, raw),
        });
    }
}


/**
 * This function draws exploding particles and updates their meta-data;
 * it removes particles who's lifetime has exceed certain limit.
 * 
 * @param {number} delta - elasped time from last frame
 */
function drawParticles(delta) {
    particles.forEach(p => {
        // decrease size to fade-out
        if (p.ms > 200)
            p.size *= 0.95 ** (delta / 16);         

        // update meta-data
        p.ms += delta;
        p.px -= p.vx * p.vm * delta;
        p.py -= p.vy * p.vm * delta - (p.ga * delta / 16);
        p.vm *= 0.91 ** (delta / 16);

        // drawing
        fillRect(p.color, p.px, p.py, p.size);
        fillRect('white', p.px, p.py, p.size * 0.3);
    });

    // remove desappeared particles
    particles = particles.filter(p => p.ms < 1500);
}


/**
 * This function draws the background with black color and given alpha.
 * 
 * @param {number} alpha - transparent parameter
 */
function drawBackGround(alpha) {
    context.save();
    {
        context.fillStyle = getRGBA([0,0,0,alpha]);
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.restore();
}


/**
 * This function draws a target indicator. When user clicks an valid
 * position on canvas, there is a marker (little flashing circle)
 * shows up there.
 * 
 * @param {number} x - x pos of center
 * @param {number} y - y pos of center
 */
function drawtarget(x, y) {
    context.save();
    {
        context.strokeStyle = getRGBA([255, 200, 50, 1]);
        context.lineWidth = 1;
        context.beginPath();
        context.arc(x, y, tgtRadius * 0.015, 0, Math.PI * 2, true);
        context.closePath();
        context.stroke();
    }
    context.restore();
}


/**
 * This function draws (fills) a circle
 * 
 * @param {string} style - context fillStyle
 * @param {number} x - center's x pos
 * @param {number} y - center's y pos
 * @param {number} r - radius
 */
function fillCircle(style, x, y, r) {
    context.save();
    {
        context.beginPath();
        context.arc(x, y, r, 0, Math.PI * 2, true);
        context.closePath();

        context.fillStyle = style;
        context.fill();
    }
    context.restore();
}


/**
 * This function fill a square
 * 
 * @param {string} style - fill style
 * @param {number} x - center x of this square
 * @param {number} y - center y of this square
 * @param {number} s - side size
 */
function fillRect(style, x, y, s) {
    const a = s / 2;
    context.save();
    {
        context.fillStyle = style;
        context.fillRect(x - a, y - a, s, s);
    }
    context.restore();
}


/* ------------------------------------------------------------------------- */
/* 3. Event Handler Functions                                                */
/* ------------------------------------------------------------------------- */

/**
 * If user clicks a valid position on canvas, 
 * a firework shoots torwards there.
 * 
 * @param {MouseEvent} event - mouse click event
 */
canvas.onclick = function (event) {
    const box = /** @type {HTMLCanvasElement} */
        (event.target).getBoundingClientRect();

    // get the mouse coordinate on canvas
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;

    addFireworks(x, y, true);
}


/**
 * (Optional - students may ignore this function, it is not
 * required in this couse, although it may help you in some
 * cases.)
 * 
 * This function does a protection: whenever the current
 * tag is inactive, it resets `lasttime = undefined`.
 * 
 * Explanation: Users may switche to other browser tags or minimize
 * the browser window to do something else. When they switch back to
 * the tag running the animation, the animation tends to receive an
 * extreme large `delta` value, which may cause unpredictable issues.
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden)
        lasttime = undefined;
});


/* ------------------------------------------------------------------------- */
/* 4. Helper Functions (Math, random, color-conversion, etc)                 */
/* ------------------------------------------------------------------------- */

/**
 * Linear interpolation
 * 
 * @param {number} a - starting value
 * @param {number} b - ending value
 * @param {number} t - parameter in range [0:1] 
 * @returns {number} - interpolated value
 */
function lerp(a, b, t) {
    return a + (b - a) * t;
}


/**
 * Clamp input number in valid range
 * 
 * @param {number} num - unsafe number
 * @param {number} min - lower bound (inclusive)
 * @param {number} max - upper bound (inclusive)
 * @returns {number} valid number in range [min : max]
 */
function clamp(num, min, max) {
    if (num <= min) return min;
    if (num >= max) return max;
    return num;
}


/**
 * Returns a random float number in given range
 * 
 * @param {number} min - lower bound (inclusive)
 * @param {number} max - upper bound (exclusive)
 * @returns {number} random number in range [min : max)
 */
function random(min, max) {
    return min + Math.random() * (max - min);
}


/**
 * Returns a random integer less than given value
 * 
 * @param {number} x - input number as an exclusive upper bound
 * @returns {number} a random integer in range [0 : x)
 */
function randomInt(x) {
    return Math.floor(Math.random() * x);
}

/**
 * This function returns a number that is random generated within
 * a given range.
 * eg. suppose we have a function call: randColor(50, 250, [100, 100, 0]),
 *     then we will pick a number x in range [50, 250) to fill in the third
 *     position of given array so that it will be [100, 100, x].
 * 
 * In sum, we do not modify positive numbers in given array, and we only
 * pick random numbers in range [min, max) to fill in blank.
 * 
 * @param {number} min - lower bound of any R, G or B value
 * @param {number} max - upper bound of any R, G or B value
 * @param {number[]} raw - given RGB data
 * @returns {string} a random selected color within given range
 */
function randColor(min, max, raw) {
    // we random pick some number in range [min: max) to fill in
    // raw array only when we found a zero
    const color = raw.map(x => {
        if (x == 0) 
            return min + randomInt(max - min);
        else
            return x;
        });

    return getRGBA([...color, 1]);
}


/**
 * Returns a string in rgba-string format
 * @param {number[]} c - color
 * @returns {string} - rgba(*,*,*,)
 */
function getRGBA(c) {
    return `rgba(${c[0]},${c[1]},${c[2]},${c[3]})`;
}
