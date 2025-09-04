/**
 * 04-05-01.js - a simple JavaScript file that gets loaded with
 * page 5 of Workbook 4 (CS559).
 *
 * started by Michael Gleicher, January 2019
 * re-written by Xin Cai, Feb 2023
 *
 */

// @ts-check
export{};
/* jshint -W069, esversion:6 */

/**
 * Reference
 *  - JavaScript class
 *    https://graphics.cs.wisc.edu/Courses/559-sp2021/tutorials/oop-in-js-1/
 * 
 *  - Steering Behavior (Craig W. Reynolds)
 *    http://www.red3d.com/cwr/steer/gdc99/
 * 
 */

/** 
 * This class implements the Boid, objects/creates that form
 * certain patterns/orders when they move together.
 */
class Boid {
    // id generator for each instance of Boid
    static id = 0;     
    static color = [
        getRGBA([220, 220, 220, 0.9]),  // color of normal status
        getRGBA([255, 51, 51, 1]),      // color after hitting
    ];
    
    // timer total duration
    static B_DUR =  400;  // duration for boucing-timer
    static S_DUR = 2000;  // duration for signal-timer

    // detection scope (in square of radius)
    static HIT_R2 =  10 * 10;    // collision
    static SEP_R2 =  25 * 25;    // seperation
    static ALG_R2 = 100 * 100;   // alignment
    static COH_R2 = 200 * 200;   // cohesion 

    /**
     * constructor that creates a new Boid with
     * random position and orientation
     * 
     * @param {number} x   - initial x position
     * @param {number} y   - initial y position
     * @param {number} phi - initial orientation
     */
    constructor(x, y, phi) {
        this.bid = Boid.id++;  // unique id for this boid
        this.hit = -1;         // hitting id of some other boid
        this.phi = phi;        // current orientation
        this.pos = [x, y];     // current position
        this.fs  = [0, 0];     // net force
        this.bTmr = 0;         // bouncing timer
        this.sTmr = 0;         // signal timer
        this.isNew = true;
    }

    /**
     * 
     * @param {Boid} that - another boid that hits with this one 
     */
    hitWith(that) {
        // swap velocities
        [this.phi, that.phi] = [that.phi, this.phi];

        // set bouncing time with its init duration
        this.bTmr = Boid.B_DUR;
        that.bTmr = Boid.B_DUR;

        // set hitting-id for both boids
        this.hit = that.bid;
        that.hit = this.bid;

        // reset signal timer
        this.sTmr = 0;
        that.sTmr = 0;
    }

    /**
     * 
     * @param {number} dist - distance moved since last frame
     * @param {number} delta - time elasped since last frame
     */
    hitWall(dist, delta) {
        if (dist == 0) return;

        // update two timers
        this.sTmr = Math.max(this.sTmr - delta, 0);
        this.bTmr = Math.max(this.bTmr - delta, 0);
        
        /** @type {boolean[]} */
        const isHittingWall = [
            (this.pos[1] <= 5) || (this.pos[1] >= canvas.height - 5),
            (this.pos[0] <= 5) || (this.pos[0] >= canvas.width  - 5),
        ];

        /** @type {number[]} */
        const angles = [
            -this.phi,
            -this.phi + Math.PI * Math.sign(this.phi),
        ];

        // bouncing against wall
        isHittingWall.forEach((flag, i) => {
            if (flag) {
                this.phi = angles[i];
                add(this.pos, vecDM(this.phi, dist));
                
                this.hit = -1;
                this.bTmr = Boid.B_DUR;
                this.sTmr = Boid.S_DUR;
            }
        });

        // hit obstacle
        obstacles.forEach(obs => {
            if (distSq([obs.x, obs.y], this.pos) > (obs.r + 5) ** 2) 
                return;

            const ndir = Math.atan2(obs.y - this.pos[1], obs.x - this.pos[0]);  // normal direction
            const rdir = boundPI(this.phi + Math.PI);                           // reverse direction
            
            // new direction
            this.phi = boundPI(2 * ndir  - rdir);
            add(this.pos, vecDM(this.phi, dist));

            this.hit = -1;
            this.bTmr = Boid.B_DUR;
            this.sTmr = Boid.S_DUR;
        });
    }

    /**
     * Composition of forces
     * 
     * @param {Boid} that - another boid 
     */
    compForce(that) {
        // d2: square of distance between this and that
        // norm: a normalized vector pointing from this to that
        const d2 = distSq(this.pos, that.pos);
        const norm = scale(vecPQ(this.pos, that.pos), Math.sqrt(1/d2));

        // default behavior: bouncding
        if (!doFlocks.checked) {
            if (d2 < Boid.HIT_R2 && this.hit != that.bid) {
                this.hitWith(that);
            }
            return;
        }

        // read slider values
        const sval = Number(separSld.value);
        const aval = Number(alignSld.value);
        const cval = Number(cohesSld.value);

        // flock behavior: separation
        if (d2 < Boid.SEP_R2) {
            const power = lerp(0, 64, sval) / d2;
            add(this.fs, scale(norm, -power));
            add(that.fs, scale(norm, +power));
        }

        // flock behavior: alignment
        if (d2 < Boid.ALG_R2) {
            const power = lerp(0, 32, aval) / d2;
            add(this.fs, vecDM(that.phi, power));
            add(that.fs, vecDM(this.phi, power));
        }

        // flock behavior: cohesion
        if (d2 < Boid.COH_R2) {
            const power = lerp(0, 8, cval) / d2;
            add(this.fs, scale(norm, +power));
            add(that.fs, scale(norm, -power));
        }
    }


    /**
     * @param {number} dist - distance during the current frame
     */
    update(dist) {
        // safety check
        if (dist == 0) return;

        if (this.sTmr == 0) {
            // applys the net force to current velocity
            // then, update phi with the direction of new velocity
            add(this.fs, vecDM(this.phi, dist));
            this.phi = dir(this.fs);
        }

        // update position and reset net force for next turn
        add(this.pos, vecDM(this.phi, dist));
        this.fs = [0, 0];
    }


    /**
     * Draws this Boid on given canvas
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        // points that determines the shape of bois
        const pts = [
            [3, 0], [0, 8], [-5, 1], [-18, 0.1],
        ].map(p => scale(p, 0.5));

        context.save();
        {
            // affine transfermation to move coordinates
            context.translate.apply(context, this.pos);
            context.rotate(this.phi);

            // build path to draw the boid
            context.beginPath();
            buildPath(context, pts, 0);
            context.closePath();

            // select color (default, after-collision) and fill
            context.fillStyle = Boid.color[Math.sign(this.bTmr)];
            context.fill();
        }
        context.restore();
    }
}


/** the actual main program
 * this used to be inside of a function definition that window.onload
 * was set to - however, now we use defer for loading
 */

/** @type {Boid[]} */
const theBoids = [];
const obstacles = [
    {x: 125, y: 125, r: 30},
    {x: 475, y: 125, r: 30},
    {x: 125, y: 475, r: 30},
    {x: 475, y: 475, r: 30},
];

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('flockx'));
const context = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
const addBoids = /** @type {HTMLButtonElement} */ (document.getElementById("addx"));
const speed = /** @type {HTMLInputElement} */ (document.getElementById('speedx'));

const doFlocks = /** @type {HTMLInputElement} */ (document.getElementById('ckboxx'));
const alignSld = /** @type {HTMLInputElement} */ (document.getElementById('alignx'));
const cohesSld = /** @type {HTMLInputElement} */ (document.getElementById('cohesx'));
const separSld = /** @type {HTMLInputElement} */ (document.getElementById('separx'));
const reset = /** @type {HTMLButtonElement} */ (document.getElementById('resetx'));

addBoids.onclick = function() {
    const capacity = 110;
    if (theBoids.length >= capacity) {
        console.log(`boids reach their capacity: ${capacity}...`);
        return;
    }

    let i = 0;
    while (i < 10) {
        const px = random(10, canvas.width - 10);
        const py = random(10, canvas.height - 10);

        if (obstacles.some(obs => distSq([obs.x, obs.y],[px, py]) <= (obs.r + 15) ** 2)) {
            continue;
        }
        // unsafe add FIXME to check obstacles
        theBoids.push(new Boid(px, py, random(-Math.PI, Math.PI)));
        i++;
    }
};
addBoids.click();


/** @type {HTMLButtonElement} */ 
(document.getElementById("clear")).onclick = () => theBoids.length = 0;

/**
 * reset flock behavior to a balanced status
 */
reset.onclick = function() {
    speed.value = '0.5';
    alignSld.value = '0.5';
    cohesSld.value = '0.5';
    separSld.value = '0.5'; 
}


/**
 * disable switch while checking/unchecking the checkbox of flock behavior
 */
doFlocks.onchange = function() {
    [alignSld, cohesSld, separSld].forEach(sld => sld.disabled = !this.checked);
}


let lastTime = undefined;
/**
 * Animation loop
 * @param {number} timestamp 
 */
function loop(timestamp) {
    // use `time delta` to calculate distance
    const delta = lastTime ? (timestamp - lastTime) : 0;
    const dist = Number(speed.value) * 0.1 * delta;
    
    drawBackground();
    drawObstacles();
    
    theBoids.forEach(b => b.hitWall(dist, delta));
        
    // two-layer for-loop that does pairwise-checking
    for (let i = 0; i < theBoids.length; ++i)
        for (let j = i + 1; j < theBoids.length; ++j)
            theBoids[i].compForce(theBoids[j]);
    
    theBoids.forEach(b => {
        b.update(dist);
        b.draw(context);
    });
    
    // request next frame
    window.requestAnimationFrame(loop);
    lastTime = timestamp;
}
// start to run
window.requestAnimationFrame(loop);


/**
 * 
 */
function drawBackground() {
    context.save();
    context.fillStyle = getRGBA([35, 35, 35, 1]);
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
}


function drawObstacles() {
    obstacles.forEach(obs => {
        context.save();
        {
            context.beginPath();
            context.arc(obs.x, obs.y, obs.r, 0, Math.PI * 2, true);
            context.closePath();

            context.fillStyle = getRGBA([100, 100, 250, 1]);
            context.fill();
        }
        context.restore();
    });
}

/* reset lastTime when tag is inactive */
document.addEventListener('visibilitychange', () => {
    if (document.hidden)
        lastTime = undefined;
});


/* Vector/Math and other utility Functions --------------------------------- */

/**
 * @param {number} dir - an angle (direction)
 * @param {number} mag - a scalar
 * @returns {number[]} - a vector with given direction and magnitude
 */
function vecDM(dir, mag) {
    return [Math.cos(dir) * mag, Math.sin(dir) * mag];
}

/**
 * @param {number[]} p - a point 
 * @param {number[]} q - another point 
 * @returns {number[]} a vector from p to q
 */
function vecPQ(p, q) {
    return q.map((v, i) => v - p[i]);
}

/**
 * @param {number[]} vec - vector
 * @param {number} s - scalar
 * @returns {number[]} - a new vector that multiplies a scalar
 */
function scale(vec, s) {
    return vec.map(v => v * s);
}

/**
 * This function add v to u
 * @param {number[]} u - vector
 * @param {number[]} v - vector
 */
function add(u, v) {
    u.forEach((_, i) => u[i] += v[i]);
}


/**
 * @param {number[]} v - a vector
 * @throws {Error} - zero vector has no difined direction
 * @returns {number} - the direction of this vector in range [-PI, +PI]
 */
function dir(v) {
    if (v[0] == 0 && v[1] == 0)
        throw new Error(`Error: undefined direction from zero vector`);

    return Math.atan2(v[1], v[0]);
}


/**
 * @param {number[]} p - a point
 * @param {number[]} q - another point
 * @returns {number} - square of distance between two points 
 */
function distSq(p, q) {
    const dx = q[0] - p[0];
    const dy = q[1] - p[1];
    return dx * dx + dy * dy;
}


/**
 * @param {number} min 
 * @param {number} max 
 * @returns a random number in range [min, max)
 */
function random(min, max) {
    return min + Math.random() * (max - min);
}


/**
 * return a string in rgba form
 * @param {number[]} c - color
 * @returns {string}
 */
function getRGBA(c) {
    return `rgba(${c[0]},${c[1]},${c[2]},${c[3]})`;
}


/**
 * Recursion function helps to build
 * path from a given list of points
 * 
 * @param {CanvasRenderingContext2D} ctx - target canvas context
 * @param {number[][]} pts - an array of points for building a path
 * @param {number} i - index of current point
 */
function buildPath(ctx, pts, i) {
    if (i == pts.length)
        return;

    ctx.lineTo(pts[i][0], +pts[i][1]);
    buildPath(ctx, pts, i + 1);
    ctx.lineTo(pts[i][0], -pts[i][1]);
}

/**
 * @param {number} beta - input anlge 
 * @returns an angle in range [-PI, +PI]
 */
function boundPI(beta) {
    if (beta > +Math.PI) {
        return beta - Math.PI * 2;
    }
    if (beta < -Math.PI) {
        return beta + Math.PI * 2;
    }
    return beta;
}


/**
 * 
 * @param {number} a 
 * @param {number} b 
 * @param {number} t 
 * @returns {number} 
 */
function lerp(a, b, t) {
    return a + (b - a) * t;
}