// @ts-check
export { };

// Begin Simple Example Solution
function version1() {
    // somewhere in your program (maybe not here) you'll want a line
    // that looks like:
    const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas3"));
    const context = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));
    /** @type {number} */const frontSpeed = 0.05; // Set the speed of the QuadCopter
    /** @type {number} */const propellerSpeed = 0.5; // Set the speed of the propeller
    /** @type {number} */const pathRadius = 200; // Set the radius of the circular path
    /** @type {number} */let x = 0.5 * canvas.width + pathRadius; // Initialize the current location and angles
    /** @type {number} */let y = 0.5 * canvas.height; // (x, y) keeps track of the location of the center of the QuadCopter
    /** @type {number} */let a = 0; // a keeps track of the path angle from the center of the canvas
    // This implies (x, y) = (radius * sin(a), radius * cos(a))
    /** @type {number} */let r = 0.5 * Math.PI; // r keeps track of the angle the QuadCopter is facing 
    /** @type {number} */let s = 0; // s keeps track of the angle of the propeller
    /** @type {number} */ const rate = 20; // Initialize the frame rate in milliseconds
    /** @type {number} */ let lastTime = 0; // Keep track of time
    /**
     * This function draws a simple arm
     * @param {number} s0 The angle of the propeller 
     */
    function drawSimpleArm(s0) {
        // Set the sizes of the parts of the QuadCopter
        const propellerAngle = s0;
        const armLength = 40;
        const armThick = 10;
        const propellerLength = 40;
        const propellerThick = 10;
        // Draw a rectangle as the arm
        context.fillRect(- 0.5 * armThick, - 0.5 * armThick, armLength, armThick);
        context.save();
        // Move the canvas to draw the propeller
        context.translate(armLength - armThick, 2);
        context.rotate(propellerAngle);
        // Draw a rectangle as the propeller
        context.fillRect(-0.5 * propellerLength, -0.5 * propellerThick, propellerLength, propellerThick);
        context.restore();
    }
    /**
     * This function draws a simple 
     * @param {number} x0 X-coordinate of the location
     * @param {number} y0 Y-coordinate of the location
     * @param {number} r0 Angle of the body
     * @param {number} s0 Angle of the propeller
     */
    function drawSimpleCopter(x0, y0, r0, s0) {
        // Set the sizes of the parts of the QuadCopter
        const frontX = x0;
        const frontY = y0;
        const frontAngle = r0;
        const frontLength = 80;
        const frontThick = 50;
        const armThick = 10;
        // Start drawing
        context.save();
        // Move the canvas to draw the front
        context.translate(frontX, frontY);
        context.rotate(frontAngle);
        context.fillStyle = "black";
        context.fillRect(-0.5 * frontLength, -0.5 * frontThick, frontLength, frontThick);
        // Draw four arms and propellers four times
        // See the other versions for drawing four of them in a loop
        context.save();
        context.translate(0.5 * (frontLength - armThick), 0.5 * (frontThick - armThick));
        context.rotate(0.25 * Math.PI);
        drawSimpleArm(s0); // CS559 Example Code
        context.restore();
        context.save();
        context.translate(-0.5 * (frontLength - armThick), 0.5 * (frontThick - armThick));
        context.rotate(0.75 * Math.PI);
        drawSimpleArm(s0); // CS559 Example Code
        context.restore();
        context.save();
        context.translate(0.5 * (frontLength - armThick), -0.5 * (frontThick - armThick));
        context.rotate(-0.25 * Math.PI);
        drawSimpleArm(s0); // CS559 Example Code
        context.restore();
        context.save();
        context.translate(-0.5 * (frontLength - armThick), -0.5 * (frontThick - armThick));
        context.rotate(-0.75 * Math.PI);
        drawSimpleArm(s0); // CS559 Example Code
        context.restore();
        context.restore();
    }
    // and you will want to make an animation loop with something like:
    /**
     * the animation loop gets a timestamp from requestAnimationFrame
     * This function animates the QuadCopters
     * @param {DOMHighResTimeStamp} timestamp 
     */
    function loop(timestamp) {
        if (timestamp - lastTime > rate) {
            lastTime = timestamp;
            // Clear the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            // Update the current angle along the circular path
            a = (a + frontSpeed) % (2 * Math.PI);
            // Compute the location of the front
            x = 0.5 * canvas.width + pathRadius * Math.sin(a);
            y = 0.5 * canvas.height + pathRadius * Math.cos(a);
            // Compute the angle of the front
            // The angle is the arctan of the change in y-coordinates over the change in the x-coordinates
            r = Math.atan((Math.cos(a) - Math.cos(a - frontSpeed)) / (Math.sin(a) - Math.sin(a - frontSpeed)));
            // It is also okay to use the derivatives instead of the discrete changes r = Math.atan(-Math.sin(a) / Math.cos(a));
            // Update the angle of propeller rotation
            s = (s + propellerSpeed) % (2 * Math.PI);
            drawSimpleCopter(x, y, r, s);
        }
        window.requestAnimationFrame(loop);
    }
    window.requestAnimationFrame(loop);
}
// End Simple Example Solution

// Begin Advanced Example Solution
function version2() {
    // somewhere in your program (maybe not here) you'll want a line
    // that looks like:
    /** @type {HTMLCanvasElement} */ const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas3"));
    /** @type {CanvasRenderingContext2D} */const context = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));
    /** @type {number} */ const frontSpeed = 2; // Set the speed of the QuadCopter
    /** @type {number} */ const propellerSpeed = 0.5; // Set the speed of the propeller
    /** @type {number} */ const armSpeed = 0.2; // Set the speed of the person's arm waving
    /** @type {number} */ const rotateSpeed = 0.05; // Set the speed of the rotation of QuadCopter
    /** @type {number} */ const probPerson = 0.005; // Set the probability of a random Person appearing
    /** @type {number[]} */ const current = [0, 0, 0]; // Keep track of the current location of each QuadCopter
    /** @type {number[]} */ const changePath = [0, 0, 0]; // Keep track of whether each QuadCopter deviated from its circular motion
    /** @type {number[]} */ const changeAngle = [0, 0, 0]; // Keep track of whether each QuadCopter requires a change in its direction
    /** @type {number[][]} */ const pathX = [[], [], []]; // Initialize path control variables
    /** @type {number[][]} */ const pathY = [[], [], []]; // Initialize path control variables
    /** @type {object[]} */ const states = []; // Initialize the state variables
    /** @type {object[]} */ const styles = []; // Initialize the style variables
    /** @type {object} */ const personStates = { "x": -1, "y": -1, "r": 0 }; // Set the initial state of the Person
    /** @type {object} */ const personStyles = { "l": 5, "w": 2, "c": "green" }; // Set the initial style of the Person
    /** @type {number} */ const rate = 20; // Initialize the frame rate in milliseconds
    /** @type {number} */ let lastTime = 0; // Keep track of time
    // Code copied from Workbook 2
    /**
     * Get the y-coordinate relevant to the canvas' top left corner for mouse events
     * @param {MouseEvent} event The mouse event
     */
    function getX(event) {
        return event.clientX - /** @type {HTMLCanvasElement} */(event.target).getBoundingClientRect().left;
    }
    /**
     * Get the y-coordinate relevant to the canvas' top left corner for mouse events
     * @param {MouseEvent} event The mouse event
     */
    function getY(event) {
        return event.clientY - /** @type {HTMLCanvasElement} */(event.target).getBoundingClientRect().top;
    }
    /**
     * This function draws a QuadCopter
     * @param {object} state The state of the QuadCopter 
     * @param {object} style The style of the QuadCopter
     */
    function drawQuadCopter(state, style) {
        // Copy the states to local variables
        const frontX = state.x;
        const frontY = state.y;
        const frontAngle = state.r;
        const propellerAngle = state.s;
        // Copy the styles to local variables
        const frontLength = style.l;
        const frontThick = style.w;
        const armLength = style.la;
        const armThick = style.wa;
        const propellerLength = style.lp;
        const propellerThick = style.wp;
        const bodyColor = style.c;
        const armColor = style.ca;
        const propellerBackColor = style.cpb;
        const propellerColor = style.cp;
        // Start drawing
        context.save();
        // Move the canvas to draw the front
        context.translate(frontX, frontY);
        context.rotate(frontAngle);
        context.fillStyle = bodyColor;
        context.fillRect(-0.5 * frontLength, -0.5 * frontThick, frontLength, frontThick);
        // Draw four arms and propellers using a for loop over (-1, -1), (-1, +1), (+1, -1), (-1, -1)
        for (let i = -1; i <= 1; i += 2) {
            for (let j = -1; j <= 1; j += 2) {
                context.save();
                // Move the canvas to draw the arms
                context.translate(i * 0.5 * (frontLength - armThick), j * 0.5 * (frontThick - armThick));
                context.rotate(j * (2 - i) * 0.25 * Math.PI);
                context.fillStyle = armColor;
                context.fillRect(- 0.5 * armThick, - 0.5 * armThick, armLength, armThick);
                context.save();
                // Move the canvas to draw the propeller
                context.translate(armLength - armThick, 0);
                context.fillStyle = propellerBackColor;
                context.strokeStyle = bodyColor;
                // Draw a circle as the background for the propeller
                context.beginPath();
                context.arc(0, 0, 0.5 * propellerLength, 0, 2 * Math.PI);
                // Draw the boundary of the circle if the color is white
                // Fill the interior of the circle if the color is not white
                if (propellerBackColor == "white") context.stroke();
                context.fill();
                context.rotate(propellerAngle);
                context.fillStyle = propellerColor;
                // Draw a rectangle as the propeller
                context.fillRect(-0.5 * propellerLength, -0.5 * propellerThick, propellerLength, propellerThick);
                context.restore();
                context.restore();
            }
        }
        context.restore();
    }
    /**
     * This function draws a Person
     * @param {object} state The state of the Person
     * @param {object} style The style of the Person
     */
    function drawPerson(state, style) {
        // Copy the states to local variables
        const headX = state.x;
        const headY = state.y;
        const armAngle = state.r;
        // Copy the styles to local variables
        const personLength = style.l;
        const personThick = style.w;
        const personColor = style.c;
        context.save();
        // Move the canvas to draw the head and body of the Person
        context.translate(headX, headY);
        context.strokeStyle = personColor;
        context.lineWidth = personThick;
        // Draw the head of the Person
        context.beginPath();
        context.arc(0, 0, personLength, 0, 2 * Math.PI);
        context.moveTo(0, personLength);
        // Draw the body of the Person
        context.lineTo(0, personLength * 2);
        context.stroke();
        for (let i = -1; i <= 1; i += 2) {
            // Draw the legs of the Person
            context.beginPath();
            context.moveTo(0, personLength * 2);
            context.lineTo(i * personLength, personLength * 3);
            context.stroke();
            context.save();
            // Move the canvas the draw the arms of the Person
            context.translate(0, personLength);
            context.rotate(-armAngle + i * Math.PI / 2 - Math.PI / 4);
            // Draw the arms of the Person
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(personLength * 2, 0);
            context.stroke();
            context.restore();
        }
        context.restore();
    }
    /**
     * This function generates a list of x, y coordinates representing a circular path
     * @param {number[]} pX The list of x-coordinates on the path
     * @param {number[]} pY The list of y-coordinates on the path
     * @param {number} x Center x
     * @param {number} y Center y
     * @param {number} r Radius
     * @param {number} s Speed
     */
    function circlePath(pX, pY, x, y, r, s) {
        // Compute the number of steps given the speed
        const nSteps = 2 * Math.PI * r / s;
        // Clear the current path
        pX.length = 0;
        pY.length = 0;
        // Add points to the path uniformly along a circle
        for (let i = 0; i < nSteps; i++) {
            pX[i] = x + r * Math.sin(i * s / r); // CS559 Example Code
            pY[i] = y + r * Math.cos(i * s / r); // CS559 Example Code
        }
    }
    /**
     * This function generates a list of x, y coordinates representing a linear path
     * @param {number[]} pX The list of x-coordinates on the path
     * @param {number[]} pY The list of y-coordinates on the path
     * @param {number} c The current index
     * @param {number} x Destination x
     * @param {number} y Destination y
     * @param {number} s Speed
     */
    function linePath(pX, pY, c, x, y, s) {
        // Compute the number of steps given the speed
        const dx = pX[c] - x;
        const dy = pY[c] - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nSteps = dist / s;
        // Clear the current path
        pX.length = 0;
        pY.length = 0;
        // Add points to the path uniformly along a line
        for (let i = 0; i < nSteps; i++) {
            pX[i] = x + dx * (1 - i / nSteps); // CS559 Example Code
            pY[i] = y + dy * (1 - i / nSteps); // CS559 Example Code
        }
    }
    // The QuadCopter flies in a circle at the beginning 
    // Set the initial states and styles of the QuadCopters
    for (let i = 0; i < 3; i++) {
        circlePath(pathX[i], pathY[i], canvas.width / 4 * (i + 1), canvas.height / 4 * (i + 1), canvas.width / 8, frontSpeed);
        states[i] = { x: pathX[i][current[i]], y: pathY[i][current[i]], r: 0, s: 0 };
    }
    styles[0] = { l: 80, w: 50, la: 40, wa: 30, lp: 20, wp: 2, c: "gray", ca: "gray", cpb: "aqua", cp: "gray" };
    styles[1] = { l: 80, w: 50, la: 20, wa: 10, lp: 40, wp: 5, c: "green", ca: "rgba(0,0,0,0)", cpb: "white", cp: "green" };
    styles[2] = { l: 40, w: 25, la: 20, wa: 5, lp: 20, wp: 5, c: "red", ca: "green", cpb: "rgba(0,0,0,0)", cp: "blue" };
    /**
     * This helper function is used to convert a number to an angle between -PI/2 to +PI/2
     * @param {number} a The angle
     */
    let angle = a => (a + 2.5 * Math.PI) % Math.PI - 0.5 * Math.PI;
    /**
     * This function adds a person when the mouse is clicked
     * @param {MouseEvent} event
     */
    function click(event) {
        addPerson(getX(event), getY(event));
    }
    /**
     * This function adds a person at (x, y)
     * @param {number} x 
     * @param {number} y 
     */
    function addPerson(x, y) {
        // Change the path to a line from the current location to the location of the person
        linePath(pathX[0], pathY[0], current[0], x, y, frontSpeed);
        // Update the location of the person
        personStates.x = x;
        personStates.y = y;
        changePath[0] = 1;
        current[0] = 1;
        // Rotate the QuadCopter before moving
        changeAngle[0] = states[0].r - Math.atan((pathY[0][1] - pathY[0][0]) / (pathX[0][1] - pathX[0][0]));
        changeAngle[0] = angle(changeAngle[0]);
    }
    /**
     * This function moves a QuadCopter responding to key events
     * @param {KeyboardEvent} event
     */
    function key(event) {
        // Copy the current location
        pathX[1][0] = states[1].x;
        pathY[1][0] = states[1].y;
        current[1] = 0;
        // Change the path to a single point at the current location
        pathX[1].length = 1;
        pathY[1].length = 1;
        // KeyCode = 37 left, 38 up, 39 right, 40 down
        // KeyCode = 65 a, 67 c, 68 d, 69 e, 81 q, 83 s, 87 w, 88 x, 90 z
        let k = event.code;
        // Prevent up, down, left, right keys from move the whole page up, down, left, right
        if (k == "ArrowLeft" || k == "ArrowUp" || k == "ArrowRight" || k == "ArrowDown") event.preventDefault();
        // Move the QuadCopter up, down, left, right according to the key
        if (k == "ArrowLeft" || k == "KeyQ" || k == "KeyA" || k == "KeyZ") pathX[1][0] -= frontSpeed;
        if (k == "ArrowUp" || k == "KeyQ" || k == "KeyW" || k == "KeyE") pathY[1][0] -= frontSpeed;
        if (k == "ArrowRight" || k == "KeyE" || k == "KeyD" || k == "KeyC") pathX[1][0] += frontSpeed;
        if (k == "ArrowDown" || k == "KeyS" || k == "KeyZ" || k == "KeyX" || k == "KeyC") pathY[1][0] += frontSpeed;
        // Change the QuadCopter angle according to the key
        if (k == "ArrowLeft" || k == "KeyA" || k == "ArrowRight" || k == "KeyD") changeAngle[1] = states[1].r - Math.PI;
        else if (k == "ArrowUp" || k == "KeyW" || k == "ArrowDown" || k == "KeyS" || k == "KeyX") changeAngle[1] = states[1].r - 0.5 * Math.PI;
        else if (k == "KeyQ" || k == "KeyC") changeAngle[1] = states[1].r - 0.25 * Math.PI;
        else if (k == "KeyE" || k == "KeyZ") changeAngle[1] = states[1].r - 0.75 * Math.PI;
        changeAngle[1] = angle(changeAngle[1]);
    }
    // and you will want to make an animation loop with something like:
    /**
     * the animation loop gets a timestamp from requestAnimationFrame
     * This function animates the QuadCopters
     * @param {DOMHighResTimeStamp} timestamp 
     */
    function loop(timestamp) {
        if (timestamp - lastTime > rate) {
            lastTime = timestamp;
            // Clear the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            // Draw the person if there is one and wave its arms
            if (personStates.x >= 0) {
                drawPerson(personStates, personStyles);
                personStates.r = (personStates.r + armSpeed) % (0.5 * Math.PI);
            }
            // Add a person with small probability if there is no one
            else if (Math.random() < probPerson) addPerson(Math.random() * canvas.width, Math.random() * canvas.height);
            // Draw three QuadCopters
            for (let i = 0; i < 3; i++) {
                // Change the path back to a circle as a QuadCopter reaches a Person
                if (changePath[i] == 1 && current[i] == pathX[i].length - 1) {
                    circlePath(pathX[i], pathY[i], pathX[i][current[i]], pathY[i][current[i]] - 100, 100, frontSpeed);
                    // Move the Person out of canvas
                    personStates.x = -1;
                    personStates.y = -1;
                    changePath[i] = 0;
                    current[i] = 0;
                    // Rotate the QuadCopter before moving
                    changeAngle[0] = states[0].r - Math.atan((pathY[0][1] - pathY[0][0]) / (pathX[0][1] - pathY[0][0]));
                    changeAngle[0] = angle(changeAngle[0]);
                }
                // Rotate before moving if the current direction is incorrect
                // If a positive rotation is needed, decrement the angle 
                if (changeAngle[i] > 1e-6) {
                    states[i].r -= Math.min(changeAngle[i], rotateSpeed);
                    changeAngle[i] -= Math.min(changeAngle[i], rotateSpeed);
                }
                // If a negative rotation is needed, increment the angle 
                else if (changeAngle[i] < -1e-6) {
                    states[i].r += Math.min(-changeAngle[i], rotateSpeed);
                    changeAngle[i] += Math.min(-changeAngle[i], rotateSpeed);
                }
                // If the angle is correct, move the QuadCopter
                else {
                    // Update the location of the QuadCopter according to the next element in the path
                    states[i].x = pathX[i][current[i]];
                    states[i].y = pathY[i][current[i]];
                    // Update the angle of the QuadCopter according to the change between the current and the previous element in the path
                    // The angle is the arctan of the change in y-coordinates over the change in the x-coordinates
                    const dy = pathY[i][current[i]] - pathY[i][(current[i] - 1 + pathY[i].length) % pathY[i].length];
                    const dx = pathX[i][current[i]] - pathX[i][(current[i] - 1 + pathX[i].length) % pathX[i].length];
                    if (pathX[i].length > 1) states[i].r = Math.atan(dy / dx);
                    // Move to the next element in the path
                    current[i] = (current[i] + 1) % pathX[i].length;
                }
                // Update the angle of propeller rotation
                states[i].s = (states[i].s + propellerSpeed) % (2 * Math.PI);
                drawQuadCopter(states[i], styles[i]);
            }
        }
        window.requestAnimationFrame(loop);
    }
    // Assign the mouse and key events
    canvas.onclick = click;
    window.onkeydown = key;
    // and then you would start the loop with:
    window.requestAnimationFrame(loop);
}
// End Advanced Example Solution

//version1();
version2();