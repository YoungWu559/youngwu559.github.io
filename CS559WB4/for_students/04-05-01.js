/**
 * CS559 Spring 2023 Example Solution
 * Written by CS559 course staff
 */

/**
 * 04-05-01.js - a simple JavaScript file that gets loaded with
 * page 5 of Workbook 4 (CS559).
 *
 * written by Michael Gleicher, January 2019
 * modified January 2020, February 2021
 *
 */

/**
 * If you want to read up on JavaScript classes, 
 * see the tutorial on the class website:
 * 
 * https://cs559.github.io/559Tutorials/javascript/oop-in-js-1/
 */

// Begin Simple Example Solution
// Mike's Flock
function version1() {
    /**
 * If you want to read up on JavaScript classes, 
 * see the tutorial on the class website:
 * 
 * https://cs559.github.io/559Tutorials/javascript/oop-in-js-1/
 */
    class Boid {
        /**
         * 
         * @param {number} x    - initial X position
         * @param {number} y    - initial Y position
         * @param {number} vx   - initial X velocity
         * @param {number} vy   - initial Y velocity
         */
        constructor(x, y, vx = 1, vy = 0) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.s = 0;
        }
        /**
         * Draw the Boid
         * @param {CanvasRenderingContext2D} context 
         */
        draw(context) {
            context.save();
            context.translate(this.x, this.y);
            //context.fillRect(-5, -5, 10, 10);
            context.fillStyle = this.s > 0 ? "red" : "black";
            context.rotate(Math.atan2(this.vy, this.vx));
            context.beginPath();
            context.moveTo(5, 0);
            context.lineTo(-5, 5);
            context.lineTo(-5, -5);
            context.closePath();
            context.fill();
            context.restore();
        }
        /**
         * Perform the "steering" behavior -
         * This function should update the velocity based on the other
         * members of the flock.
         * It is passed the entire flock (an array of Boids) - that includes
         * "this"!
         * Note: dealing with the boundaries does not need to be handled here
         * (in fact it can't be, since there is no awareness of the canvas)
         * *
         * And remember, (vx,vy) should always be a unit vector!
         * @param {Array<Boid>} flock 
         */
        steer(flock) {
            /*
            // Note - this sample behavior is just to help you understand
            // what a steering function might  do
            // all this one does is have things go in circles, rather than
            // straight lines
            // Something this simple would not count for the advanced points:
            // a "real" steering behavior must consider other boids,
            // or at least obstacles.
        	
            // a simple steering behavior: 
            // create a rotation matrix that turns by a small amount
            // 2 degrees per time step
            const angle = 2 * Math.PI / 180;
            const s = Math.sin(angle);
            const c = Math.cos(angle);
    
            let ovx = this.vx;
            let ovy = this.vy;
    
            this.vx =  ovx * c + ovy * s;
            this.vy = -ovx * s + ovy * c;
            */
        }
    }


    /** the actual main program
     * this used to be inside of a function definition that window.onload
     * was set to - however, now we use defer for loading
     */

    /** @type Array<Boid> */
    let boids = [];

    let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("flock1"));
    let context = canvas.getContext("2d");

    let speedSlider = /** @type {HTMLInputElement} */ (document.getElementById("speed1"));

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        boids.forEach(boid => boid.draw(context));
    }

    /**
     * Create some initial boids
     * STUDENT: may want to replace this
     */
    boids.push(new Boid(100, 100));
    boids.push(new Boid(200, 200, -1, 0));
    boids.push(new Boid(300, 300, 0, -1));
    boids.push(new Boid(400, 400, 0, 1));

    /**
     * Handle the buttons
     */
    document.getElementById("add1").onclick = function () {
        // Students Fill This In
        for (let i = 0; i < 10; i++) {
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            let a = Math.random() * Math.PI * 2;
            boids.push(new Boid(x, y, Math.cos(a), Math.sin(a)));
        }
    };
    document.getElementById("clear1").onclick = function () {
        // Student Fill This In
        boids.length = 0;
    };

    let lastTime; // will be undefined by default
    /**
     * The Actual Execution
     */
    function loop(timestamp) {
        // time step - convert to 1/60th of a second frames
        // 1000ms / 60fps
        const delta = (lastTime ? timestamp - lastTime : 0) / 1000.0 * 60.0;
        if (delta >= 0 || delta >= 1) {
            lastTime = timestamp;
            // change directions
            boids.forEach(boid => boid.steer(boids));
            // move forward
            let speed = Number(speedSlider.value);
            boids.forEach(function (boid) {
                boid.x += boid.vx * speed;
                boid.y += boid.vy * speed;
            });
            // make sure that we stay on the screen
            boids.forEach(function (boid) {
                /**
                 * Students should replace this with collision code
                 */
                // boid.x = boid.x % canvas.width;
                // boid.y = boid.y % canvas.height;
                // if (boid.x < 0) boid.x += canvas.width;
                // if (boid.y < 0) boid.y += canvas.height;
                if (boid.x >= canvas.width) {
                    boid.x = canvas.width - (boid.x - canvas.width);
                    boid.vx *= -1;
                    boid.s = 10;
                }
                if (boid.y >= canvas.height) {
                    boid.y = canvas.height - (boid.y - canvas.height);
                    boid.vy *= -1;
                    boid.s = 10;
                }
                if (boid.x <= 0) {
                    boid.x = -boid.x;
                    boid.vx *= -1;
                    boid.s = 10;
                }
                if (boid.y <= 0) {
                    boid.y = -boid.y;
                    boid.vy *= -1;
                    boid.s = 10;
                }
                boids.forEach(function (otherBoid) {
                    if ((boid.x - otherBoid.x) * (boid.x - otherBoid.x) + (boid.y - otherBoid.y) * (boid.y - otherBoid.y) <= 10 * 10 && (boid.x != otherBoid.x || boid.y != otherBoid.y)) boid.s = 10;
                });
                boid.s = Math.max(boid.s - 1, 0);
            });
            // now we can draw
            draw();
            // and loop
            window.requestAnimationFrame(loop);
        }
    }
    // start the loop with the first iteration
    window.requestAnimationFrame(loop);
}
version1();
// End Simple Example Solution

// Begin Advanced Example Solution
// This was written by the course staff over the years...
function version2() {
    /** @type {number} */ const size = 5; // Set the size of the boids
    /** @type {number} */ const duration = 10; // Set the duration of the boids staying red after collision
    /** @type {number} */ const leader = 0.05; // Set the probability that a boid is a leader
    /** @type {number} */ let mouseX = -1; // Initialize the mouse positions
    /** @type {number} */ let mouseY = -1; // Initialize the mouse positions
    /** @type {number} */ let max_angle = 0; // Initialize the slider variables
    /** @type {number} */ let nearby_distance = 0;
    /** @type {number} */ let weight_alignment = 1;
    /** @type {number} */ let weight_separation = 1;
    /** @type {number} */ let weight_cohesion = 1;
    /** @type {number} */ let weight_chasing = 1;
    /** @type {number} */ let weight_mouse = 1;
    // Helper Functions
    /**
     * Find a random number between a and b
     * @param {number} a The min
     * @param {number} b The max 
     */
    function rand(a = 0, b = 1) {
        return Math.random() * (b - a) + a;
    }
    class Boid {
        /**
         * 
         * @param {number} x    - initial X position
         * @param {number} y    - initial Y position
         * @param {number} vx   - initial X velocity
         * @param {number} vy   - initial Y velocity
         * @param {number} mv - maximum speed, leader = 2, other = 1
         * @param {number} s - state
         */
        constructor(x, y, vx = 1, vy = 0, mv = 1, s = 0) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.s = s;
            this.mv = mv;
            this.normalize();
        }
        /**
         * Make sure the speed is 1 at all times
         */
        normalize() {
            let norm = this.vx * this.vx + this.vy * this.vy;
            // If by accident, the norm is 0, normalize another random vector
            if (norm == 0) {
                this.vx = rand(-1, 1);
                this.vy = rand(-1, 1);
                this.normalize();
            }
            // Otherwise, divide the vector by its norm
            else if (norm != this.mv) {
                norm = Math.sqrt(norm);
                this.vx *= this.mv / norm;
                this.vy *= this.mv / norm;
            }
        }
        /**
         * Draw the Boid
         * @param {CanvasRenderingContext2D} ctx 
         */
        draw(ctx) {
            ctx.save();
            // Set the color to red if the Boid is in a positive state
            if (this.s > 0) ctx.fillStyle = "red";
            // The leaders are blue
            else if (this.mv == 2) ctx.fillStyle = "blue";
            // Decrement the state by 1 each time.
            this.s = Math.max(this.s - 1, 0);
            // Move the Boid to (x, y)
            ctx.translate(this.x, this.y);
            // Rotate the Boid so that it is facing where it is going
            ctx.rotate(Math.atan2(this.vy, this.vx));
            // Draw the triangle
            ctx.beginPath();
            ctx.moveTo(size, 0);
            ctx.lineTo(-size, size);
            ctx.lineTo(-size, -size);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
        /**
         * Perform the "steering" behavior -
         * This function should update the velocity based on the other
         * members of the flock.
         * It is passed the entire flock (an array of Boids) - that includes
         * "this"!
         * Note: dealing with the boundaries does not need to be handled here
         * (in fact it can't be, since there is no awareness of the canvas)
         * *
         * And remember, (vx,vy) should always be a unit vector!
         * @param {Array<Boid>} flock 
         */
        steer(flock) {
            /*
            // Note - this sample behavior is just to help you understand
            // what a steering function might  do
            // all this one does is have things go in circles, rather than
            // straight lines
            // Something this simple would not count for the advanced points:
            // a "real" steering behavior must consider other boids,
            // or at least obstacles.
        	
            // a simple steering behavior: 
            // create a rotation matrix that turns by a small amount
            // 2 degrees per time step
            const angle = 2 * Math.PI / 180;
            const s = Math.sin(angle);
            const c = Math.cos(angle);
    
            let ovx = this.vx;
            let ovy = this.vy;
    
            this.vx =  ovx * c + ovy * s;
            this.vy = -ovx * s + ovy * c;
            */
            // Only steer if the Boid is not red
            if (this.s == 0) {
                // This is the final angle
                /** @type {number} */ let angle = 0;
                // These are the current positions and angle of the boid
                /** @type {number} */ const x = this.x;
                /** @type {number} */ const y = this.y;
                /** @type {number} */ const a = Math.atan2(this.vy, this.vx);
                // These are variables used to calculate the alignment angle
                /** @type {number} */ let alignment = a;
                /** @type {number} */ let total_alignment = 0;
                /** @type {number} */ let total_distance = 0;
                /** @type {number} */ let distance = 0;
                // These are variables used to calculate the separation angle
                /** @type {number} */ let separation = a;
                /** @type {number} */ let min_distance = -1;
                /** @type {number} */ let min_x = 0;
                /** @type {number} */ let min_y = 0;
                // These are variables used to calculate the cohesion angle
                /** @type {number} */ let cohesion = a;
                /** @type {number} */ let average_x = 0;
                /** @type {number} */ let average_y = 0;
                /** @type {number} */ let count = 0;
                // These are variables used to calculate the chasing angle
                /** @type {number} */ let chasing = a;
                /** @type {number} */ let leader_distance = -1;
                /** @type {number} */ let leader_x = 0;
                /** @type {number} */ let leader_y = 0;
                // These are variables used to calculate the mouse angle
                /** @type {number} */ let mouse = a;
                flock.forEach(function (boid) {
                    // Compute the distance between the boids
                    distance = Math.sqrt((boid.x - x) * (boid.x - x) + (boid.y - y) * (boid.y - y));
                    if (distance > 0 && distance < nearby_distance) {
                        // Accumulate weighted angles from nearby boids
                        total_distance += 1.0 / distance;
                        // Note that the angle is calculated as the difference between the angles of boids and normalized between -PI and PI
                        total_alignment += 1.0 / distance * ((Math.atan2(boid.vy, boid.vx) - a + 3 * Math.PI) % (2 * Math.PI) - Math.PI);
                        // Accumulate the closest boid
                        if (min_distance < 0 || distance < min_distance) {
                            min_distance = distance;
                            min_x = boid.x;
                            min_y = boid.y;
                        }
                        // Accumulate the average nearby boid location
                        average_x += boid.x;
                        average_y += boid.y;
                        count++;
                    }
                    // Accumulate the closest leader
                    if (boid.mv == 2 && (leader_distance < 0 || distance < leader_distance)) {
                        leader_distance = distance;
                        leader_x = boid.x;
                        leader_y = boid.y;
                    }
                });
                // Compute the change in angles for alignment
                if (total_distance != 0) alignment = a + total_alignment / total_distance;
                // Compute the change in angles for separation
                if (min_distance > 0) separation = Math.PI + Math.atan2(min_y - y, min_x - x);
                // Compute the change in angles for cohesion
                if (count > 0) cohesion = Math.atan2(average_y / count - y, average_x / count - x);
                // Compute the change in angles for chasing
                if (this.mv != 2 && leader_distance > 0) chasing = Math.atan2(leader_y - y, leader_x - x);
                // Compute the change in angles for mouse
                if (mouseX >= 0 && mouseY >= 0) mouse = Math.atan2(mouseY - y, mouseX - x);
                // Compute the weighted sum of the changes and bound it by maximum turning angle
                angle = alignment * weight_alignment + separation * weight_separation + cohesion * weight_cohesion + weight_chasing * chasing + weight_mouse * mouse;
                // Normalize the weights by dividing it by the total weight and make sure the angle is between -pi/2 and pi/2
                if (weight_alignment + weight_separation + weight_cohesion + weight_chasing + weight_mouse == 0) angle = 2 * Math.PI / 180;
                else angle = (a - angle / (weight_alignment + weight_separation + weight_cohesion + weight_chasing + weight_mouse) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
                // Bound the angle between + and - maximum angle
                angle = Math.max(Math.min(angle, max_angle), -max_angle);
                // Compute the new rotation vector
                const s = Math.sin(angle);
                const c = Math.cos(angle);

                let ovx = this.vx;
                let ovy = this.vy;

                this.vx = ovx * c + ovy * s;
                this.vy = -ovx * s + ovy * c;
            }
        }
    }
    /** the actual main program
     * this used to be inside of a function definition that window.onload
     * was set to - however, now we use defer for loading
     */
    /** @type Array<Boid> */
    let boids = [];
    /** @type {HTMLCanvasElement} */ const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("flock2"));
    /** @type {CanvasRenderingContext2D} */ const context = canvas.getContext("2d");
    /** @type {HTMLInputElement} */ const speedSlider = /** @type {HTMLInputElement} */ (document.getElementById("speed2"));
    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Draw the obstacles
        theObstacles.forEach(function (obstacle) {
            context.save();
            context.translate(obstacle.x, obstacle.y);
            context.fillStyle = "green";
            // Type 0 obstacles are circles
            if (obstacle.t == 0) {
                context.beginPath();
                context.arc(0, 0, obstacle.r, 0, 2 * Math.PI);
                context.closePath();
                context.fill();
            }
            // Type 1 obstacles are squares
            else context.fillRect(- obstacle.r, - obstacle.r, obstacle.r * 2, obstacle.r * 2);
            context.restore();
        });
        boids.forEach(boid => boid.draw(context));
    }
    // Sample of the mouse click location
    canvas.onmousedown = function (event) {
        mouseX = event.clientX - /** @type {HTMLElement} */ (event.target).getBoundingClientRect().left;
        mouseY = event.clientY - /** @type {HTMLElement} */ (event.target).getBoundingClientRect().top;
    };
    // Clear the mouse click location
    canvas.onmouseup = function () {
        mouseX = -1;
        mouseY = -1;
    };
    /**
     * Create some initial boids
     * STUDENT: may want to replace this
     */
    boids.push(new Boid(100, 100));
    boids.push(new Boid(200, 200, -1, 0));
    boids.push(new Boid(300, 300, 0, -1));
    boids.push(new Boid(400, 400, 0, 1));
    // (x, y) is the position, r is the size, and t = 0 if it is circle, and t = 1 if it is a square
    /** @type {object[]} */ const theObstacles = [{ "x": 100, "y": 500, "r": 50, "t": 0 }, { "x": 500, "y": 100, "r": 50, "t": 1 }, { "x": 200, "y": 400, "r": 50, "t": 1 }, { "x": 400, "y": 200, "r": 50, "t": 0 }];
    /**
     * Handle the buttons
     */
    document.getElementById("add2").onclick = function () {
        // Students Fill This In
        for (let i = 0; i < 10; i++) {
            /** @type {number} */ const x = rand(size, canvas.width - size); // Random x location of an obstacle
            /** @type {number} */ const y = rand(size, canvas.height - size); // Random y location of an obstacle
            // Check to make sure it is not inside any obstacles
            /** @type {object[]} */ let inside = theObstacles.filter(obstacle => checkInside(x, y, obstacle));
            // Set the speed depending on whether the boid is a leader
            /** @type {number} */ let speed = 1;
            if (Math.random() < leader) speed = 2;
            // Set random speed between -1 and 1
            if (inside.length == 0) boids.push(new Boid(x, y, rand(-1, 1), rand(-1, 1), speed));
            else i--;
        }
    };
    /**
     * Check if (x, y) is inside the obstacle
     * @param {number} x The x coordinate
     * @param {number} y The y coordinate
     * @param {*} obstacle The obstacle object
     */
    let checkInside = function (x, y, obstacle) {
        // Check if (x, y) is inside a circle
        if (obstacle.t == 0) return Math.sqrt((obstacle.x - x) * (obstacle.x - x) + (obstacle.y - y) * (obstacle.y - y)) <= obstacle.r + size;
        // Check if (x, y) is inside a square
        else return Math.abs(obstacle.x - x) < obstacle.r + size && Math.abs(obstacle.y - y) <= obstacle.r + size;
    };
    document.getElementById("clear2").onclick = function () {
        // Student Fill This In
        boids.length = 0;
    };
    /**
     * // Set the slider values
     * @param {number} a Alignment weight
     * @param {number} b Separation weight
     * @param {number} c Cohesion weight
     * @param {number} d Chasing weight
     * @param {number} e Mouse weight
     */
    function set_sliders(a, b, c, d, e) {
        /** @type {HTMLInputElement} */ (document.getElementById("weight_alignment")).value = String(a);
        /** @type {HTMLInputElement} */ (document.getElementById("weight_separation")).value = String(b);
        /** @type {HTMLInputElement} */ (document.getElementById("weight_cohesion")).value = String(c);
        /** @type {HTMLInputElement} */ (document.getElementById("weight_chasing")).value = String(d);
        /** @type {HTMLInputElement} */ (document.getElementById("weight_mouse")).value = String(e);
        update_weights();
    }
    // Update the parameters according to the sliders
    function update_weights() {
        max_angle = Number(/** @type {HTMLInputElement} */(document.getElementById("max_angle")).value);
        nearby_distance = Number(/** @type {HTMLInputElement} */(document.getElementById("nearby_distance")).value);
        weight_alignment = Number(/** @type {HTMLInputElement} */(document.getElementById("weight_alignment")).value);
        weight_separation = Number(/** @type {HTMLInputElement} */(document.getElementById("weight_separation")).value);
        weight_cohesion = Number(/** @type {HTMLInputElement} */(document.getElementById("weight_cohesion")).value);
        weight_chasing = Number(/** @type {HTMLInputElement} */(document.getElementById("weight_chasing")).value);
        weight_mouse = Number(/** @type {HTMLInputElement} */(document.getElementById("weight_mouse")).value);
    }
    // Handle the sliders
    update_weights();
    document.getElementById("max_angle").onchange = update_weights;
    document.getElementById("nearby_distance").onchange = update_weights;
    document.getElementById("weight_alignment").onchange = update_weights;
    document.getElementById("weight_separation").onchange = update_weights;
    document.getElementById("weight_cohesion").onchange = update_weights;
    document.getElementById("weight_chasing").onchange = update_weights;
    document.getElementById("weight_mouse").onchange = update_weights;
    // Update the sliders according to the buttons
    document.getElementById("alignment").onclick = function () { set_sliders(1, 0, 0, 0, 0); };
    document.getElementById("separation").onclick = function () { set_sliders(0, 1, 0, 0, 0); };
    document.getElementById("cohesion").onclick = function () { set_sliders(0, 0, 1, 0, 0); };
    document.getElementById("chasing").onclick = function () { set_sliders(0, 0, 0, 1, 0); };
    document.getElementById("mouse").onclick = function () { set_sliders(0, 0, 0, 0, 1); };
    document.getElementById("balanced").onclick = function () { set_sliders(0.5, 0.5, 0.5, 0.5, 0.5); };
    document.getElementById("none").onclick = function () { set_sliders(0, 0, 0, 0, 0); };
    let lastTime; // will be undefined by default
    /**
     * The Actual Execution
     */
    function loop(timestamp) {
        // time step - convert to 1/60th of a second frames
        // 1000ms / 60fps
        const delta = (lastTime ? timestamp - lastTime : 0) / 1000.0 * 60.0;
        if (delta == 0 || delta >= 1) {
            lastTime = timestamp;
            // change directions
            boids.forEach(boid => boid.steer(boids));
            // move forward
            let speed = Number(speedSlider.value);
            boids.forEach(function (boid) {
                boid.x += boid.vx * speed;
                boid.y += boid.vy * speed;
            });
            // make sure that we stay on the screen
            boids.forEach(function (boid) {
                /**
                 * Students should replace this with collision code
                 */
                // Change the direction if the boid hit the vertical boundaries of the canvas
                if (boid.s == 0 && (boid.x <= size && boid.vx < 0) || (boid.x >= canvas.width - size && boid.vx > 0)) {
                    boid.vx = -boid.vx;
                    // Reset the count down for the Boid to stay red after collision
                    boid.s = duration;
                }
                // Change the direction if the boid hit the horizontal boundaries of the canvas
                if (boid.s == 0 && (boid.y <= size && boid.vy < 0) || (boid.y >= canvas.height - size && boid.vy > 0)) {
                    boid.vy = -boid.vy;
                    // Reset the count down for the Boid to stay red after collision
                    boid.s = duration;
                }
                // Change the direction if the boid hits an obstacle
                theObstacles.forEach(function (obstacle) {
                    if (checkInside(boid.x, boid.y, obstacle)) {
                        // Change to the direction opposite to the center of the obstacle if it is a circle
                        if (obstacle.t == 0) {
                            boid.vy = boid.y - obstacle.y;
                            boid.vx = boid.x - obstacle.x;
                        }
                        // Change to the direction according to which edge the boid hits if it is a rectangle
                        else {
                            if (Math.abs(boid.y - obstacle.y) <= Math.abs(boid.x - obstacle.x)) boid.vx = Math.sign(boid.x - obstacle.x) * Math.abs(boid.vx);
                            else boid.vy = Math.sign(boid.y - obstacle.y) * Math.abs(boid.vy);
                        }
                        // Normalize the velocity
                        boid.normalize();
                        // Reset the count down for the Boid to stay red after collision
                        boid.s = duration;
                    }
                });
                // Change the direction if the boid hits another boid
                boids.forEach(function (otherBoid) {
                    if (boid != otherBoid && (boid.x - otherBoid.x) * (boid.x - otherBoid.x) + (boid.y - otherBoid.y) * (boid.y - otherBoid.y) <= 4 * size * size) {
                        // Change to the direction opposite to the center of the other boid
                        boid.vx = boid.x - otherBoid.x;
                        boid.vy = boid.y - otherBoid.y;
                        // Normalize the velocity
                        boid.normalize();
                        // Reset the count down for the Boid to stay red after collision
                        boid.s = duration;
                    }
                });
            });
            // now we can draw
            draw();
        }
        // and loop
        window.requestAnimationFrame(loop);
    }
    // start the loop with the first iteration
    window.requestAnimationFrame(loop);
}
version2();
// End Advanced Example Solution