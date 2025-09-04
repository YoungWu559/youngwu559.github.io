/**
 * CS559 Spring 2023 Example Solution
 * Written by CS559 course staff
 */

/*jshint esversion: 6 */
// @ts-check

// these two things are the main UI code for the train
// students learned about them in last week's workbook

import { draggablePoints } from "../libs/CS559/dragPoints.js";
import { RunCanvas } from "../libs/CS559/runCanvas.js";

// this is a utility that adds a checkbox to the page 
// useful for turning features on and off
import { makeCheckbox } from "../libs/CS559/inputHelpers.js";
import { LabelSlider } from "../libs/CS559/inputHelpers.js";

// Begin Bonus Example Solution 1
function version1() {
  /**
   * Have the array of control points for the track be a
   * "global" (to the module) variable
   *
   * Note: the control points are stored as Arrays of 2 numbers, rather than
   * as "objects" with an x,y. Because we require a Cardinal Spline (interpolating)
   * the track is defined by a list of points.
   *
   * things are set up with an initial track
   */
  /** @type Array<number[]> */
  let thePoints = [[150, 150], [200, 450], [300, 500], [400, 450], [450, 150]];
  /** @type {number[][]} */ let theSmoke = [];
  /** @type {number[][]} */ let theCircle;
  /**
   * Draw function - this is the meat of the operation
   *
   * It's the main thing that needs to be changed
   *
   * @param {HTMLCanvasElement} theCanvas
   * @param {number} param
   */
  function draw(theCanvas, param) {
    /** @type {CanvasRenderingContext2D} */ const context = theCanvas.getContext("2d");
    // clear the screen
    context.clearRect(0, 0, theCanvas.width, theCanvas.height);
    // draw the control points
    thePoints.forEach(function (pt) {
      context.beginPath();
      context.arc(pt[0], pt[1], 5, 0, Math.PI * 2);
      context.closePath();
      context.fill();
    });
    // now, the student should add code to draw the track and train
    /** @type {boolean} */ const simple = /** @type {HTMLInputElement} */ (document.getElementById("check-simple-track")).checked;
    /** @type {boolean} */ const bSpline = /** @type {HTMLInputElement} */ (document.getElementById("check-b-spline")).checked;
    /** @type {boolean} */ const wheel = /** @type {HTMLInputElement} */ (document.getElementById("check-trucked-wheel")).checked;
    /** @type {boolean} */ const arcLength = /** @type {HTMLInputElement} */ (document.getElementById("check-arc-length")).checked;
    /** @type {boolean} */ const smoke = /** @type {HTMLInputElement} */ (document.getElementById("check-smoke")).checked;
    /** @type {boolean} */ const scenery = /** @type {HTMLInputElement} */ (document.getElementById("check-scenery")).checked;
    /** @type {number} */ const tension = tensionSlider ? tensionSlider.value() : 0.5;
    /** @type {number} */ const n = thePoints.length;
    // Small helper functions
    /**
     * The function to increment the index without running out of bound
     * @param {number|string} i Index
     * @returns {number} The new index
     */
    function incr(i = 0) {
      return (Number(i) + 1) % n;
    }
    /**
     * The function to decrement the index without running out of bound
     * @param {number|string} i Index
     * @returns {number} The new index
     */
    function decr(i = 0) {
      return (Number(i) - 1 + n) % n;
    }
    /**
     * The function to calculate derivative at point i coordinate j
     * See Workbook Page 3 Box 3 for the formula
     * @param {number} i The index of the point
     * @param {number} j The coordinate x = 0, y = 1, z = 2
     * @returns {number} The derivative
     */
    function deriv(i = 0, j = 0) {
      return tension * (thePoints[incr(i)][j] - thePoints[decr(i)][j]);
    }
    // Compute the derivatives for the cardinal spline
    /** @type {number[][]} */ let theDerivatives = [];
    thePoints.forEach((_, i) => theDerivatives.push([deriv(i, 0), deriv(i, 1)]));
    /**
     * The function to calculate control point at point i coordinate j
     * If sign is 1, add 1/3 of the derivative, if sign is -1, subtract 1/3 of the derivative
     * See Workbook Page 5 Box 1 for the formula
     * @param {number} i The index of the point
     * @param {number} j The coordinate x = 0, y = 1, z = 2
     * @param {number} sign Whether it is first or last control point
     * @returns {number} The control point
     */
    function control(i = 0, j = 0, sign = 1) {
      if (bSpline) {
        // This is the Bohm's Algorithm to convert B-splines to Bezier curves
        // we didn't discuss this in class, it would be fine to simply draw the curves by
        // sampling points on them
        if (sign) return 2.0 / 3.0 * thePoints[i][j] + 1.0 / 3.0 * thePoints[sign > 0 ? incr(i) : decr(i)][j];
        return 1.0 / 6.0 * (4 * thePoints[i][j] + thePoints[decr(i)][j] + thePoints[incr(i)][j]);
      }
      else return thePoints[i][j] + sign * 1.0 / 3.0 * theDerivatives[i][j];
    }
    // Compute the control points for the Bezier curves
    /** @type {number[][]} */ let theControls = [];
    thePoints.forEach((_, i) => theControls.push([control(i, 0, 1), control(i, 1, 1), control(incr(i), 0, -1), control(incr(i), 1, -1), control(incr(i), 0, 0), control(incr(i), 1, 0)]));
    /**
     * The function to calculate the position along the curve
     * @param {number} v The parameter of the curve
     * @param {number} i The index of the point
     * @param {number} j The coordinate x = 0, y = 1
     * @returns {number} The position
     */
    function position(v = 0, i = 0, j = 0) {
      /** @type {number} */ const v2 = v * v;
      /** @type {number} */ const v3 = v2 * v;
      // This is the uniform cubic B-spline basis from the Textbook
      if (bSpline) return 1 / 6 * ((-v3 + 3 * v2 - 3 * v + 1) * thePoints[i][j] + (3 * v3 - 6 * v2 + 4) * thePoints[incr(i)][j] + (-3 * v3 + 3 * v2 + 3 * v + 1) * thePoints[incr(incr(i))][j] + v3 * thePoints[incr(incr(incr(i)))][j]);
      else return thePoints[i][j] + theDerivatives[i][j] * v + (-3 * thePoints[i][j] - 2 * theDerivatives[i][j] + 3 * thePoints[incr(i)][j] - theDerivatives[incr(i)][j]) * v2 + (2 * thePoints[i][j] + theDerivatives[i][j] - 2 * thePoints[incr(i)][j] + theDerivatives[incr(i)][j]) * v3;
    }
    /**
     * The function to calculate the velocity along the curve
     * @param {number} v The parameter of the curve
     * @param {number} i The index of the point
     * @param {number} j The coordinate x = 0, y = 1
     * @returns {number} The velocity
     */
    function velocity(v = 0, i = 0, j = 0) {
      /** @type {number} */ const v2 = v * v;
      if (bSpline) return 1 / 6 * ((-3 * v2 + 6 * v - 3) * thePoints[i][j] + (9 * v2 - 12 * v) * thePoints[incr(i)][j] + (-9 * v2 + 6 * v + 3) * thePoints[incr(incr(i))][j] + 3 * v2 * thePoints[incr(incr(incr(i)))][j]);
      else return theDerivatives[i][j] + 2 * (-3 * thePoints[i][j] - 2 * theDerivatives[i][j] + 3 * thePoints[incr(i)][j] - theDerivatives[incr(i)][j]) * v + 3 * (2 * thePoints[i][j] + theDerivatives[i][j] - 2 * thePoints[incr(i)][j] + theDerivatives[incr(i)][j]) * v * v;
    }
    /**
     * The function to calculate the distance between two points
     * @param {number[]} p1 The first point
     * @param {number[]} p2 The second point
     * @returns {number} The distance
     */
    function distance(p1 = [0, 0], p2 = [0, 0]) {
      return Math.sqrt((p2[0] - p1[0]) * (p2[0] - p1[0]) + (p2[1] - p1[1]) * (p2[1] - p1[1]));
    }
    // Draw the track and calculate the arc-length parameterization
    /** @type {number[][]} */ let theStops = [];
    /** @type {number[][]} */ let theDistances = [];
    /** @type {number[][]} */ let theVelocities = [];
    /** @type {number} */ let dist = 0; // Keep track of the distance
    /** @type {number} */ let totalDist = 0; // Keep track of the total distance
    /** @type {number} */ let seg = 0;
    /** @type {number} */ const di = 0.001; // Increment of parameter
    /** @type {number} */ const m = n / di; // Number of segments to divide the curve into
    /**
     * The function to normalize a vector to a fixed length
     * @param {number[]} p The input vector
     * @param {number} l The length
     * @return {number[]} The output vector
     */
    function normalize(p = [1, 0], l = 1) {
      let norm = Math.sqrt(p[0] * p[0] + p[1] * p[1]);
      if (norm == 0) return [0, 0];
      return [p[0] / norm * l, p[1] / norm * l];
    }
    // Compute the distance table
    for (let i = 0; i < m; i++) {
      seg = Math.floor(di * i);
      // Sample the positions
      theStops[i] = [position(di * i - seg, seg, 0), position(di * i - seg, seg, 1)];
      theDistances[i] = [di * i, totalDist];
      // Compute the distance between consecutive samples
      if (i > 0) dist = distance(theStops[i], theStops[i - 1]);
      // Accumulate the distances
      totalDist += dist;
      // Also compute and normalize the velocities to draw the double tracks
      theVelocities[i] = normalize([velocity(di * i - seg, seg, 0), velocity(di * i - seg, seg, 1)], 5);
    }
    /**
     * Compute the arc length parameter
     * @param {number} x The arc-length parameter of a segment at x
     * @returns {number} The arc length parameter
     */
    function arcU(x = 0) {
      seg = 0;
      // Find the segment x corresponds to by incrementing until x exceeds the total-distance-so-far the first time
      while (x > theDistances[seg][1] && seg < m - 1) seg++;
      // Since di is set to be very small, interpolation is not done
      return theDistances[seg][0];
    }
    /**
     * Compute the point on the curve that is d distance away from x
     * @param {number} v The parameter of the curve
     * @param {number} d The desired distance
     * @returns {number} The fixed distance parameter
     */
    function distU(v = 0, d = 1) {
      seg = 0;
      while (theDistances[seg][0] < v) { seg++; }
      /** @type {number[]} */ let p0 = theStops[seg];
      while (distance(theStops[seg], p0) < d && seg > 0) { seg--; }
      if (distance(theStops[seg], p0) < d) {
        seg = m - 1;
        while (distance(theStops[seg], p0) < d && seg > 0) { seg--; }
      }
      return theDistances[seg][0];
    }
    /** @type {number} */ let u = 0;
    // Draw the background circles
    if (scenery) {
      if (!theCircle) theCircle = new Array(100).fill(0).map(() => [Math.random() * canvas.width, Math.random() * canvas.height]);
      context.fillStyle = "lightgray";
      theCircle.forEach(function (ci) {
        // Check if the circle is too close to one of the points on the track
        if (!theStops.reduce((over, si) => over || distance(ci, si) < 25, false)) {
          // Draw the circle
          context.beginPath();
          context.arc(ci[0], ci[1], 10, 0, Math.PI * 2);
          context.fill();
        }
      });
      context.fillStyle = "black";
    }
    // Draw the simple track
    context.beginPath();
    if (simple) {
      // Connect the control points using cubic Bezier curves (both catmull-rom and uniform-b)
      context.moveTo(theControls[n - 1][4], theControls[n - 1][5]);
      theControls.forEach(ci => context.bezierCurveTo(ci[0], ci[1], ci[2], ci[3], ci[4], ci[5]));
      context.closePath();
    }
    else {
      // Draw the parallel tracks
      // Note that (dx, dy) is perpendicular to (-dx, dy) and (dx, -dy)
      context.moveTo(theStops[m - 1][0] + theVelocities[m - 1][1], theStops[m - 1][1] - theVelocities[m - 1][0]);
      theStops.forEach((si, i) => context.lineTo(si[0] + theVelocities[i][1], si[1] - theVelocities[i][0]));
      // Draw the other parallel tracks
      // Note that (dx, dy) is perpendicular to (-dx, dy) and (dx, -dy)
      context.moveTo(theStops[m - 1][0] - theVelocities[m - 1][1], theStops[m - 1][1] + theVelocities[m - 1][0]);
      theStops.forEach((si, i) => context.lineTo(si[0] - theVelocities[i][1], si[1] + theVelocities[i][0]));
    }
    context.stroke();
    // Draw the rail ties
    if (!simple) {
      for (let i = 0; i <= totalDist - 20; i += 20) {
        u = arcU(i);
        seg = Math.floor(u);
        // Draw a rectangle every 20 units of distance
        context.save();
        context.translate(position(u - seg, seg, 0), position(u - seg, seg, 1));
        context.rotate(0.5 * Math.PI + Math.atan2(velocity(u - seg, seg, 1), velocity(u - seg, seg, 0)));
        context.fillRect(-10, -2.5, 20, 5); // CS559 Sample Code
        context.restore();
      }
    }
    // Draw the train
    /** @type {number} */ const h = 20;
    /** @type {number} */ const w = 15;
    /** @type {number} */ let nextU = param;
    /** @type {number} */ let nextSeg = Math.floor(param);
    // Draw the number of cars equal to the number of segments
    for (let i = 0; i < n; i++) {
      // Note that param is between 0 and n, so the current distance (from 0) is totalDist * param / n
      // Draw the cars three times its lengths (3 * h) distance apart
      // Make sure the current distance is between 0 and totalDist
      if (wheel) u = distU(nextU, h * 0.5);
      else if (arcLength) u = arcU((totalDist * param / n - i * h * 3 + totalDist) % totalDist);
      // Draw the cars one percent of its length in terms of param unit
      // Make sure the resulting param is between 0 and n
      else u = (param - i * h / 100 + n) % n;
      // Determines which segment the car is currently on
      seg = Math.floor(u);
      /** @type {number} */ let x = position(u - seg, seg, 0);
      /** @type {number} */ let y = position(u - seg, seg, 1);
      /** @type {number} */ let dx = velocity(u - seg, seg, 0);
      /** @type {number} */ let dy = velocity(u - seg, seg, 1);
      // Draw the car
      context.save();
      context.fillStyle = "blue";
      if (wheel) {
        // This implementation puts the two circles on the track instead of edges of the car
        // It also does not add actual wheel, to see the complete version, look at the other example solution
        nextU = distU(u, h * 2.5);
        nextSeg = Math.floor(nextU);
        /** @type {number} */ let nextX = position(nextU - nextSeg, nextSeg, 0);
        /** @type {number} */ let nextY = position(nextU - nextSeg, nextSeg, 1);
        // The direction is determined by the two wheels (circles in this case)
        dx = x - nextX;
        dy = y - nextY;
        // The position of the car the midpoint of the two wheels (circles in this case)
        x = 0.5 * (x + nextX);
        y = 0.5 * (y + nextY);
      }
      context.translate(x, y);
      context.rotate(Math.atan2(dy, dx));
      context.fillRect(-h, -w, 2 * h, 2 * w); // CS559 Sample Code
      context.strokeRect(-h, -w, 2 * h, 2 * w); // CS559 Sample Code
      // Draw two circles as links
      context.beginPath();
      context.arc(1.25 * h, 0, 0.25 * h, 0, 2 * Math.PI); // CS559 Sample Code
      context.closePath();
      context.fill();
      context.stroke();
      context.beginPath();
      context.arc(-1.25 * h, 0, 0.25 * h, 0, 2 * Math.PI); // CS559 Sample Code
      context.closePath();
      context.fill();
      context.stroke();
      // Draw a triangle on the first car
      if (i == 0) {
        // Push a smoke at the position;
        if (smoke) theSmoke.push([x, y, w]);
        // Draw the triangle
        context.fillStyle = "green";
        context.beginPath();
        context.moveTo(0.5 * h, 0); // CS559 Sample Code
        context.lineTo(-0.25 * h, 0.5 * w); // CS559 Sample Code
        context.lineTo(-0.25 * h, -0.5 * w); // CS559 Sample Code
        context.closePath();
        context.fill();
        context.stroke();
      }
      context.restore();
    }
    // Draw the smoke
    if (smoke) {
      context.save();
      // Transparent smoke so that they do not cover the triangle on the train
      context.fillStyle = "lightgray";
      context.globalAlpha = 0.25;
      // Get rid of the smoke that disappeared
      theSmoke = theSmoke.filter(si => si[2] > 0);
      theSmoke.forEach(function (si) {
        // Draw the circle
        context.beginPath();
        context.arc(si[0], si[1], si[2], 0, Math.PI * 2);
        context.fill();
        // Decrease the size of the smoke
        si[2]--;
      });
      context.restore();
    }
  }
  /**
   * Initialization code - sets up the UI and start the train
   */
  let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById(
    "canvas2"
  ));
  // let context = canvas.getContext("2d");
  // we need the slider for the draw function, but we need the draw function
  // to create the slider - so create a variable and we'll change it later
  let slider; // = undefined;
  // note: we wrap the draw call so we can pass the right arguments
  function wrapDraw() {
    // do modular arithmetic since the end of the track should be the beginning
    draw(canvas, Number(slider.value) % thePoints.length);
  }
  // create a UI
  let runCanvas = new RunCanvas(canvas, wrapDraw);
  // now we can connect the draw function correctly
  slider = runCanvas.range;
  // note: if you add these features, uncomment the lines for the checkboxes
  // in your code, you can test if the checkbox is checked by something like:
  // document.getElementById("check-simple-track").checked
  // in your drawing code
  // WARNING: makeCheckbox adds a "check-" to the id of the checkboxes
  //
  // lines to uncomment to make checkboxes
  /** @type {HTMLDivElement} */ const div = /** @type {HTMLDivElement} */ (document.getElementById("div2"));
  makeCheckbox("simple-track", div);
  makeCheckbox("arc-length", div);
  makeCheckbox("trucked-wheel", div);
  makeCheckbox("b-spline", div);
  makeCheckbox("smoke", div);
  makeCheckbox("scenery", div);
  /** @type {LabelSlider} */ let tensionSlider; // Create empty slider so wrapDraw can call slider before it is initialized
  tensionSlider = new LabelSlider("tension", { min: 0, max: 1, step: 0.01, initial: 0.5, oninput: wrapDraw, where: div, id: "slide-tension" });
  /** @type {HTMLInputElement} */ (document.getElementById("check-simple-track")).onchange = wrapDraw;
  /** @type {HTMLInputElement} */ (document.getElementById("check-arc-length")).onchange = wrapDraw;
  /** @type {HTMLInputElement} */ (document.getElementById("check-trucked-wheel")).onchange = wrapDraw;
  /** @type {HTMLInputElement} */ (document.getElementById("check-b-spline")).onchange = wrapDraw;
  /** @type {HTMLInputElement} */ (document.getElementById("check-smoke")).onchange = wrapDraw;
  /** @type {HTMLInputElement} */ (document.getElementById("check-scenery")).onchange = wrapDraw;
  /** @type {HTMLInputElement} */ (document.getElementById("check-smoke")).checked = true;
  /** @type {HTMLInputElement} */ (document.getElementById("check-scenery")).checked = true;
  // helper function - set the slider to have max = # of control points
  function setNumPoints() {
    runCanvas.setupSlider(0, thePoints.length, 0.05);
  }
  setNumPoints();
  runCanvas.setValue(0);
  // add the point dragging UI
  draggablePoints(canvas, thePoints, wrapDraw, 10, setNumPoints);
}
version1();
// End Bonus Example Solution 1