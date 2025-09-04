/**
 * @description: CS559 2023 Spring Workbook Solution
 * @date: Jan.30 2023
 */

//@ts-check
export { };

// get canvas
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas1'));
const context = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));

// Math constant
const PI = Math.PI;
const P2 = PI * 2;


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

    // 
    // For each quadcopter, the path parameter returns
    // the current position and direction of the quadcopter, 
    // which help us to transform the local coordinates of the quadcopter.
    // After updating its local coordinates, we can draw the quadcopter.
    //
    drawQuadCopter0(context, delta, path0(delta, true));  // bottom-left smaller
    drawQuadCopter1(context, delta, path1(delta, true));  // top-right larger
    
    // request next frame
    window.requestAnimationFrame(animation);
    lasttime = currtime;
}
window.requestAnimationFrame(animation);


/**
 * This function is an example of closure.
 * 1. It defines all needed variables for this quadcopter.
 * 2. It defines some functions that draw some component of the quadcopter
 * 3. Finally, it defines and returns a function `draw()` for animation
 * 
 * @param {number} sval - scale value
 * @returns {CallableFunction} - a function that updates and draws the quadcopter
 */
export function makeQuadCopter(sval) {
    // propeller speed
    const propSpeed = [0.03, 0.02, 0.01, 0.005];  

    const bodyWD = 40;    // body width
    const bodyHT = 50;    // body height

    const armWD = 3;      // arm width
    const armHT = 40;     // arm height

    const propRD = 20;    // propellor width
    const propWD = 4;     // propellor height

    // armPos defines the origin of each arm
    const dx = -5;
    const dy = -5;
    const armPos = [
        [+(bodyWD/2 + dx), +(bodyHT/2 + dy)],
        [+(bodyWD/2 + dx), -(bodyHT/2 + dy)],
        [-(bodyWD/2 + dx), +(bodyHT/2 + dy)],
        [-(bodyWD/2 + dx), -(bodyHT/2 + dy)],
    ];

    // armDir defines the direction for each arm
    const rho = Math.PI * 0.22;
    const armDir = [-rho, rho - Math.PI, rho, -rho - Math.PI];

    // scale coeeficient
    const scaleCoef = [sval, sval];

    // colorlist for this quadcopter
    const colorList = {
        white: getRGBA([255,255,255,1]),
        blue : getRGBA([62, 120, 255, 1]),
        red  : getRGBA([250, 80, 90,1]),
        gray : getRGBA([235, 235, 235, 0.2]),
    };

    // variables that will be updated dynamically
    let angles = [0, 0, 0, 0];

    
    /**
     * This function draws a pair of propellers for ONE arm
     * 
     * @param {CanvasRenderingContext2D} context - context
     * @param {number} theta - current angle of the local coordinate system of this propeller-pair
     */
    function drawPropeller(context, theta) {
        context.save();
        {
            // TRANSFORMATION-2: defines local coordinates for the center of this propeller-pairs
            context.translate(0, armHT);

            // draw propellers
            context.save();
            {
                // TRANSFORMATION-3: dynamically updates rotation for this propeller-pairs
                context.rotate(theta);

                // draw propellers
                context.fillStyle = colorList.white;
                context.fillRect(-propRD, -propWD/2, propRD * 2, propWD);
                context.fillRect(-propWD/2, -propRD, propWD, propRD * 2);
            }
            context.restore();

            drawCircle(context, 0, 0, propRD, undefined, colorList.blue, 4);  // outer circle
            drawCircle(context, 0, 0, 3, colorList.blue, undefined);          // inner dot
        }
        context.restore();
    }

    /**
     * This function dynamically does three things:
     * 1. updates key parameters that are determined by delta
     * 2. makes transformations to update some local coordinate systems
     * 3. draws each component in their updated local coordinate systems
     * 
     * @param {CanvasRenderingContext2D} context - context
     * @param {number} delta - time delta
     * @param {object} state - contains current position and angle information
     */
    function draw(context, delta, state) {
        // updates angles
        angles.forEach((p, i) => angles[i] = (p + delta * propSpeed[i]) % P2);
        
        // draws all components of this quadcopter
        context.save();
        {
            // TRANSFORMATION-0: defines local coordinates for the quadcopter
            context.translate(state.px, state.py);
            context.rotate(state.dir);
            context.scale.apply(context, scaleCoef);

            // draw body and head
            drawCircle(context, 0, bodyHT/2, 12, colorList.red, undefined);
            drawRect(context, bodyWD, bodyHT, colorList.white, undefined);  
            drawCircle(context, 0, 12, 7, colorList.blue, undefined);
            
            // draw arms
            for (let i = 0; i < 4; ++i) {
                context.save();
                {
                    // TRANSFORMATION-1: defines local coordinates for current arm
                    context.translate.apply(context, armPos[i]);
                    context.rotate(armDir[i]);

                    drawCapsula(context, armWD, armHT, colorList.red, undefined);  // draw this arm
                    drawPropeller(context, angles[i]);                             // draw propeller
                }
                context.restore();
            }
        }
        context.restore();
    }
    return draw;
}

const drawQuadCopter0 = makeQuadCopter(0.5);  // create one instance of quadcopter
const drawQuadCopter1 = makeQuadCopter(0.7);  // create another instance of quadcopter


/**
 * Another closure function that defines the `path` abstraction.
 * 
 * @param {number} cx - x pos of center
 * @param {number} cy - y pos of center
 * @param {number} rd - radius of the circle
 * @param {number} speed - moving magnitude along the path
 * @returns 
 */
function circlePath(cx, cy, rd, speed) {
    const CX = cx;
    const CY = cy;
    const RD = rd;
    const moveSpeed = speed / RD;
    const movingDir = (moveSpeed >= 0) ? 0 : PI;
    const colorList = {
        white: getRGBA([255,255,255,1]),
        gray : getRGBA([235, 235, 235, 0.2]),
    };

    let beta = 0;

    /**
     * This function updates the current movement states according to time delta
     * 
     * @param {number} delta - time delta
     * @param {boolean} showPath - flag that controls whether to show the path
     * @returns 
     */
    function getCurrentPosAndDir(delta, showPath) {
        if (showPath) {
            drawCircle(context, CX, CY, 3, colorList.white, undefined);  // draw rotation center
            drawCircle(context, CX, CY, RD, undefined, colorList.gray)   // draw circle path
        }

        // update current direction
        beta = (beta + delta * moveSpeed) % P2;

        // return current state
        const currentState = {
            px: CX + Math.cos(beta) * RD,  // current pos x
            py: CY + Math.sin(beta) * RD,  // current pos y
            dir: beta + movingDir,         // current direction
        }
        return currentState;
    }
    return getCurrentPosAndDir;
}

const path0 = circlePath(150, 450, 100,  0.15);  // create a path for quadcopter-0
const path1 = circlePath(400, 200, 150, -0.10);  // create a path for quadcopter-1


// Below are helper functions ................................................................. //

/**
 * This function draws a capsula, one center of the circle is on (0,0) of local
 * coordinate system, the other side is along the y-axis
 *
 * @param {CanvasRenderingContext2D} context - context 
 * @param {number} r - radius of circle
 * @param {number} h - distance between the centers of two circles
 * @param {string | undefined} fill - fill style
 * @param {string | undefined} stroke - stroke style
 */
function drawCapsula(context, r, h, fill, stroke) {
    context.save();
    {
        // build a path for a capsula shape
        context.beginPath();
        context.arc(0, 0, r, PI, 0, false);
        context.lineTo(r, h);
        context.arc(0, h, r, 0, PI, false);
        context.closePath();

        if (fill) {
            context.fillStyle = fill;
            context.fill();
        }

        if (stroke) {
            context.strokeStyle = stroke;
            context.stroke();
        }
    }
    context.restore();
}


/**
 * This function draws a rectangle at the center of the local coordinate system.
 * 
 * @param {CanvasRenderingContext2D} context - context
 * @param {number} w - width
 * @param {number} h - height
 * @param {string | undefined} fill - fill style
 * @param {string | undefined} stroke - stroke style
 */
function drawRect(context, w, h, fill, stroke) {
    context.save();
    {
        if (fill) {
            context.fillStyle = fill;
            context.fillRect(-w/2, -h/2, w, h);
        }
        if (stroke) {
            context.strokeStyle = stroke;    
            context.strokeRect(-w/2, -h/2, w, h);
        }
    }
    context.restore();
}


/**
 * This function draws a circle
 * 
 * @param {CanvasRenderingContext2D} context - context
 * @param {number} x - x pos of center
 * @param {number} y - y pos of center
 * @param {number} r - radius of the circle
 * @param {string | undefined} fill - fill style
 * @param {string | undefined} stroke  - stroke style
 * @param {number} w - line width
 */
export function drawCircle(context, x, y, r, fill, stroke, w=1) {
    context.save();
    {
        context.beginPath();
        context.arc(x, y, r, 0, Math.PI * 2, false);
        context.closePath();

        if (fill) {
            context.fillStyle = fill;
            context.fill();
        }

        if (stroke) {
            context.lineWidth = w;
            context.strokeStyle = stroke;
            context.stroke();
        }
    }
    context.restore();
}


/**
 * This frunction draws the background
 * @param {CanvasRenderingContext2D} context
 */
export function drawBackground(context) {
    context.save();
    {
        context.fillStyle = getRGBA([40, 40, 40, 1]);
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
export function getRGBA(c) {
    return `rgba(${c[0]},${c[1]},${c[2]},${c[3]})`;
}
