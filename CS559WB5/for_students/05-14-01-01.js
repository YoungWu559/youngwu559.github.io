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
// import { makeCheckbox } from "../libs/CS559/inputHelpers.js";
// import { LabelSlider } from "../libs/CS559/inputHelpers.js";

// Begin Basic Example Solution 1
function version0() {
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
      return 0.5 * (thePoints[incr(i)][j] - thePoints[decr(i)][j]);
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
      return thePoints[i][j] + sign * 1.0 / 3.0 * theDerivatives[i][j];
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
      return thePoints[i][j] + theDerivatives[i][j] * v + (-3 * thePoints[i][j] - 2 * theDerivatives[i][j] + 3 * thePoints[incr(i)][j] - theDerivatives[incr(i)][j]) * v2 + (2 * thePoints[i][j] + theDerivatives[i][j] - 2 * thePoints[incr(i)][j] + theDerivatives[incr(i)][j]) * v3;
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
      return theDerivatives[i][j] + 2 * (-3 * thePoints[i][j] - 2 * theDerivatives[i][j] + 3 * thePoints[incr(i)][j] - theDerivatives[incr(i)][j]) * v + 3 * (2 * thePoints[i][j] + theDerivatives[i][j] - 2 * thePoints[incr(i)][j] + theDerivatives[incr(i)][j]) * v2;
    }
    // Draw the simple track
    context.beginPath();
    // Connect the control points using cubic Bezier curves (both catmull-rom and uniform-b)
    context.moveTo(theControls[n - 1][4], theControls[n - 1][5]);
    theControls.forEach(ci => context.bezierCurveTo(ci[0], ci[1], ci[2], ci[3], ci[4], ci[5]));
    context.closePath();
    context.stroke();
    // Draw the train
    /** @type {number} */ const h = 20;
    /** @type {number} */ const w = 15;
    // Draw the number of cars equal to the number of segments
    /** @type {number} */ let u = param;
    // Determines which segment the car is currently on
    /** @type {number} */ let seg = Math.floor(u);
    // Compute the position and velocity of the car
    /** @type {number} */ let x = position(u - seg, seg, 0);
    /** @type {number} */ let y = position(u - seg, seg, 1);
    /** @type {number} */ let dx = velocity(u - seg, seg, 0);
    /** @type {number} */ let dy = velocity(u - seg, seg, 1);
    // Draw the car
    context.save();
    context.fillStyle = "blue";
    context.translate(x, y);
    context.rotate(Math.atan2(dy, dx));
    context.fillRect(-h, -w, 2 * h, 2 * w); // CS559 Sample Code
    context.strokeRect(-h, -w, 2 * h, 2 * w); // CS559 Sample Code
    // Draw the triangle
    context.fillStyle = "green";
    context.beginPath();
    context.moveTo(0.5 * h, 0); // CS559 Sample Code
    context.lineTo(-0.25 * h, 0.5 * w); // CS559 Sample Code
    context.lineTo(-0.25 * h, -0.5 * w); // CS559 Sample Code
    context.closePath();
    context.fill();
    context.stroke();
    context.restore();
  }
  /**
   * Initialization code - sets up the UI and start the train
   */
  let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById(
    "canvas0"
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
  let runcavas = new RunCanvas(canvas, wrapDraw);
  // now we can connect the draw function correctly
  slider = runcavas.range;
  // note: if you add these features, uncomment the lines for the checkboxes
  // in your code, you can test if the checkbox is checked by something like:
  // document.getElementById("check-simple-track").checked
  // in your drawing code
  // WARNING: makeCheckbox adds a "check-" to the id of the checkboxes
  // helper function - set the slider to have max = # of control points
  function setNumPoints() {
    runcavas.setupSlider(0, thePoints.length, 0.05);
  }
  setNumPoints();
  runcavas.setValue(0);
  // add the point dragging UI
  draggablePoints(canvas, thePoints, wrapDraw, 10, setNumPoints);
}
version0();
// End Basic Example Solution 1