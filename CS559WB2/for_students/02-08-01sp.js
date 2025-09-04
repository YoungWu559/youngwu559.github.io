/**
 * @description: CS559 2023 Spring Workbook Solution
 * @date: Jan.17 2023
 * @overview: This file provides a simple solution that only covers for the basic points.
 */

//@ts-check
export {};

// get and set Canvas
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('box2canvas0'));
const context = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));

let fireworks = [];        // a list of rising fireworks objects
let particles = [];        // a list of exploding particles objects
let lasttime = undefined;

/**
 * Animation function
 * @param {number} currtime 
 */
export function animation(currtime) {
    // track elapsed time
    if (lasttime === undefined) {
        lasttime = currtime;
    }
    const delta = (currtime - lasttime);
    
    // clear and draw
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    showPrompt(delta);
    updateAndDrawFireworks(delta);
    updateAndDrawParticles(delta);
    
    // request next frame
    lasttime = currtime;
    window.requestAnimationFrame(animation);
}
window.requestAnimationFrame(animation);


/**
 * 
 * @param {number} delta 
 */
function updateAndDrawFireworks(delta) {
    fireworks.forEach(f => {
        // if the firework reaches its target position
        if (f.sy <= f.ty) {
            for (let i = 0; i < 60; ++i) {
                const beta = randomInt(360) * Math.PI / 180;  // random velocity direction
                const speed = randomInt(10) * 0.03;           // random velocity magnitude
                // create a new particle
                const newParticle = {
                    px: f.sx,
                    py: f.ty,
                    vx: Math.cos(beta) * speed,
                    vy: Math.sin(beta) * speed,
                    color: randColor(),
                    lifetime: 0,
                };
                // push a particle
                particles.push(newParticle);
            }

            // set this firework is done and return
            f.done = true;
            return;
        }

        // update position
        f.sy -= f.speed * delta;

        // draw fireworks
        fillCircle("gray", f.sx, f.ty, 2);  // clicking position
        fillCircle(f.color, f.sx, f.sy, 5);  // firework position
    });

    // remove fireworks that have already done
    fireworks = fireworks.filter(f => !f.done);
}


/**
 * 
 * @param {number} delta 
 */
function updateAndDrawParticles(delta) {
    
    particles.forEach(p => {
        // update position and lifetime
        p.px += p.vx * delta;
        p.py += p.vy * delta;
        p.lifetime += delta;

        // draw particles
        fillRect(p.color, p.px, p.py, 4);
    });

    // filter particles by lifetime
    particles = particles.filter(p => p.lifetime < 500);
}


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

    const newFirework = {
        sx: x,                // source x pos
        sy: canvas.height,    // source y pos
        ty: y,                // target y pos
        speed: 0.3,           // pixel per ms
        color: randColor(),   // fireball color
        done: false,          // reach target and explode
    };

    fireworks.push(newFirework);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
/*       Below are some utility functions that wraps the drawing or do some calculating          */
///////////////////////////////////////////////////////////////////////////////////////////////////

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
 * Generates and returns a randome color
 * 
 * @returns {string} - a random color
 */
function randColor() {
    return getRGBA([randomInt(256), randomInt(256), randomInt(256), 1]);
}


/**
 * Returns a string in rgba-string format
 * @param {number[]} c - color
 * @returns {string} - rgba(*,*,*,)
 */
function getRGBA(c) {
    return `rgba(${c[0]},${c[1]},${c[2]},${c[3]})`;
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


let alpha = 1;
/**
 * (Optional) This function adds some prompts to guide users.
 * 
 * @param {number} delta 
 */
function showPrompt(delta) {
    alpha += delta * 0.0005;
    if (fireworks.length > 0 || particles.length > 0)
        alpha = 0;
    
    context.save();
    {
        context.fillStyle = getRGBA([200, 170, 130, alpha]);
        context.font = '30px sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        context.fillText('click to add some fireworks', canvas.width * 0.5, canvas.height * 0.5);
    }
    context.restore();
}
