/**
 * CS559 Spring 2023 Example Solution
 * Written by CS559 course staff
 * 
 * Note: this example is not as well documented as some of the others
 * 
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

// Begin Mike's Basic Example Solution
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
   * the initial track is edited to show off arc length
   */
  /** @type Array<number[]> */
  let thePoints = [[150, 150], [200, 450], [300, 500], [400, 450], [450, 150]]; // CS559 Sample Code
  /**
   * Draw function - this is the meat of the operation
   *
   * It's the main thing that needs to be changed
   *
   * @param {HTMLCanvasElement} canvas
   * @param {number} param
   */
  function draw(canvas, param) {
    /** @type {CanvasRenderingContext2D} */ const context = canvas.getContext("2d");
    // clear the screen
    context.clearRect(0, 0, canvas.width, canvas.height);
    // draw the control points
    thePoints.forEach(function (pt) {
      context.beginPath();
      context.arc(pt[0], pt[1], 5, 0, Math.PI * 2);
      context.closePath();
      context.fill();
    });
    // get the value
    // do the heavy lifting
    mikesDraw(canvas, context, thePoints, param);
  }
  /**
   * Setup stuff - make a "window.onload" that sets up the UI and starts
   * the train
   */
  /** @type {HTMLCanvasElement} */ const theCanvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
  ///** @type {CanvasRenderingContext2D} */ const theContext = theCanvas.getContext("2d");
  // we need the slider for the draw function, but we need the draw function
  // to create the slider - so create a variable and we'll change it later
  /** @type {HTMLInputElement} */ let theSlider; // = undefined;
  // note: we wrap the draw call so we can pass the right arguments
  function wrapDraw() {
    // do modular arithmetic since the end of the track should be the beginning
    draw(theCanvas, Number(theSlider.value) % thePoints.length);
  }
  // create a UI
  /** @type {RunCanvas} */ const runCanvas = new RunCanvas(theCanvas, wrapDraw);
  // now we can connect the draw function correctly
  theSlider = runCanvas.range;
  // this is a helper function that makes a checkbox and sets up handlers
  // it sticks it at the end after everything else
  // you could also just put checkboxes into the HTML, but I found this more
  // convenient
  /**
   * Old version of the checkbox helper function
   * @param {string} name Name
   * @param {boolean} initial Initial
   */
  function addCheckbox(name, initial = false) {
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    document.getElementById("div1").appendChild(checkbox);
    checkbox.id = name;
    checkbox.onchange = wrapDraw;
    checkbox.checked = initial;
    const checkLabel = document.createElement("label");
    checkLabel.setAttribute("for", name);
    checkLabel.innerText = name;
    document.getElementById("div1").appendChild(checkLabel);
  }
  // note: if you add these features, uncomment the lines for the checkboxes
  // in your code, you can test if the checkbox is checked by something like:
  // document.getElementById("simple-track").checked
  addCheckbox("simple-track", false);
  addCheckbox("arc-length", true);
  addCheckbox("b" + "spline", false);
  addCheckbox("smoke", true);
  // helper function - set the slider to have max = # of control points
  function setNumPoints() {
    runCanvas.setupSlider(0, thePoints.length, 0.05);
  }
  setNumPoints();
  runCanvas.setValue(0);
  // add the point dragging UI
  draggablePoints(theCanvas, thePoints,
    wrapDraw,
    10, setNumPoints);
}
/**
 * Vector from p2 to p1
 * @param {number[]} p1 The first point
 * @param {number[]} p2 The second point
 * @returns 
 */
function vMinus(p1, p2) {
  return [p1[0] - p2[0], p1[1] - p2[1]];
}
/* keep a set of "smoke points", x,y, size */
/** @type Array<number[]> */ let smokePoints = [];
/**
 * The main draw function
 * @param {HTMLCanvasElement} canvas 
 * @param {CanvasRenderingContext2D} context 
 * @param {Array<number[]>} thePoints 
 * @param {object} param 
 */
function mikesDraw(canvas, context, thePoints, param) {
  /** @type {boolean} */ const simpleTrack = /** @type{HTMLInputElement} */ (document.getElementById("simple-track")).checked;
  /** @type {boolean} */ const doArcLength = /** @type{HTMLInputElement} */ (document.getElementById("arc-length")).checked;
  /** @type {boolean} */ const doBSpline = /** @type{HTMLInputElement} */ (document.getElementById("b" + "spline")).checked;
  /** @type {boolean} */ const doSmoke = /** @type{HTMLInputElement} */ (document.getElementById("smoke")).checked;
  /** @type {number} */ const n = thePoints.length;
  /**
   * Find position and velocity of a cardinal curve with parameter
   * @param {number} parameter The parameter between 0 and number of points
   * @returns 
   */
  function cardinal(parameter) {
    /** @type {number} */ const u = parameter % 1; // Fraction part of the parameter in (0, 1)
    /** @type {number} */ const seg = parameter - u; // Integer part of the parameter from 0 to number of points - 1
    /** @type {number[]} */ const p0 = thePoints[(seg - 1 + n) % n]; // the previous point
    /** @type {number[]} */ const p1 = thePoints[seg]; // the current point
    /** @type {number[]} */ const p2 = thePoints[(seg + 1) % n]; // the next point
    /** @type {number[]} */ const p3 = thePoints[(seg + 2) % n]; // the next, next point
    // cardinal basis functions
    /** @type {number} */ const s = 0.5; // Tension = 0.5
    /** @type {number} */ const u2 = u * u;
    /** @type {number} */ const u3 = u * u * u;
    /** @type {number} */ const b0 = -s * u + 2 * s * u2 - s * u3; // See Workbook 5 Page 4 for the formulas
    /** @type {number} */ const b1 = 1 + (s - 3) * u2 + (2 - s) * u3; // See Workbook 5 Page 4 for the formulas
    /** @type {number} */ const b2 = s * u + (3 - 2 * s) * u2 + (s - 2) * u3; // See Workbook 5 Page 4 for the formulas
    /** @type {number} */ const b3 = -s * u2 + s * u3; // See Workbook 5 Page 4 for the formulas
    /** @type {number} */ const x0 = b0 * p0[0] + b1 * p1[0] + b2 * p2[0] + b3 * p3[0];
    /** @type {number} */ const y0 = b0 * p0[1] + b1 * p1[1] + b2 * p2[1] + b3 * p3[1];
    // derivative of cardinal basis functions
    const d0 = -s + 2 * u * (2 * s) + 3 * u2 * (-s); // See Workbook 5 Page 4 for the formulas
    const d1 = 2 * u * (s - 3) + 3 * u2 * (2 - s); // See Workbook 5 Page 4 for the formulas
    const d2 = s + 2 * u * (3 - 2 * s) + 3 * u2 * (s - 2); // See Workbook 5 Page 4 for the formulas
    const d3 = 2 * u * (-s) + 3 * u2 * s; // See Workbook 5 Page 4 for the formulas
    const dx0 = d0 * p0[0] + d1 * p1[0] + d2 * p2[0] + d3 * p3[0];
    const dy0 = d0 * p0[1] + d1 * p1[1] + d2 * p2[1] + d3 * p3[1];
    return [x0, y0, dx0, dy0];
  }
  /**
   * Find position and velocity of a b-spline curve with parameter
   * @param {number} parameter The parameter between 0 and number of points
   * @returns 
   */
  function bSpline(parameter) {
    /** @type{number} */ const u = parameter % 1; // Fraction part of the parameter in (0, 1)
    /** @type{number} */ const seg = parameter - u; // Integer part of the parameter from 0 to number of points - 1
    /** @type{number[]} */ const p0 = thePoints[(seg - 1 + n) % n]; // the previous point
    /** @type{number[]} */ const p1 = thePoints[seg]; // the current point
    /** @type{number[]} */ const p2 = thePoints[(seg + 1) % n]; // the next point
    /** @type{number[]} */ const p3 = thePoints[(seg + 2) % n]; // the next, next point
    // b-spline basis functions
    /** @type{number} */ const u2 = u * u;
    /** @type{number} */ const u3 = u * u * u;
    /** @type{number} */ const b0 = 1 / 6 * (-u3 + 3 * u2 - 3 * u + 1); // See Textbook FCG Chapter 15.2.6 for the formulas
    /** @type{number} */ const b1 = 1 / 6 * (3 * u3 - 6 * u2 + 4); // See Textbook FCG Chapter 15.2.6 for the formulas
    /** @type{number} */ const b2 = 1 / 6 * (-3 * u3 + 3 * u2 + 3 * u + 1); // See Textbook FCG Chapter 15.2.6 for the formulas
    /** @type{number} */ const b3 = 1 / 6 * u3; // See Textbook FCG Chapter 15.2.6 for the formulas
    /** @type{number} */ const x0 = b0 * p0[0] + b1 * p1[0] + b2 * p2[0] + b3 * p3[0];
    /** @type{number} */ const y0 = b0 * p0[1] + b1 * p1[1] + b2 * p2[1] + b3 * p3[1];
    // derivative of b-spline basis functions
    /** @type{number} */ const d0 = 1 / 6 * (-3 * u2 + 6 * u - 3); // See Textbook FCG Chapter 15.2.6 for the formulas
    /** @type{number} */ const d1 = 1 / 6 * (9 * u2 - 12 * u); // See Textbook FCG Chapter 15.2.6 for the formulas
    /** @type{number} */ const d2 = 1 / 6 * (-9 * u2 + 6 * u + 3); // See Textbook FCG Chapter 15.2.6 for the formulas
    /** @type{number} */ const d3 = 1 / 6 * (3 * u2); // See Textbook FCG Chapter 15.2.6 for the formulas
    /** @type{number} */ const dx0 = d0 * p0[0] + d1 * p1[0] + d2 * p2[0] + d3 * p3[0];
    /** @type{number} */ const dy0 = d0 * p0[1] + d1 * p1[1] + d2 * p2[1] + d3 * p3[1];
    return [x0, y0, dx0, dy0];
  }
  /** @type {function} */ let basis = doBSpline ? bSpline : cardinal;
  // build an arc-length table
  /** @type Array<Object> */ const alTable = [];
  /** @type {number[]} */ let lp = basis(0); // The position at 0
  // Initialize the previous point
  lp.push(0);
  alTable.push({ "u": 0, "a": 0 });
  for (let pa = 0.1; pa <= thePoints.length; pa += 0.1) {
    // Position of the current point
    const p = basis(pa);
    // Approximate the x-velocity
    const dx0 = p[0] - lp[0];
    // Approximate the y-velocity
    const dy0 = p[1] - lp[1];
    // Find the distance of the segment
    const d = Math.sqrt(dx0 * dx0 + dy0 * dy0);
    // Push everything to the table
    p.push(d + lp[4]);
    alTable.push({ "u": pa, "a": p[4] });
    lp = p;
  }
  /** @type {number[]} */ const buf = [lp[0], lp[1], 0, 0, lp[4] + 1];
  alTable.push(buf);   // push an extra to keep from going off end
  // draw the track as a line
  if (simpleTrack) {
    context.beginPath();
    context.moveTo(thePoints[0][0], thePoints[0][1]);
    for (let i = 0; i < n; i++) {
      /** @type{number[]} */ const p0 = thePoints[(i - 1 + n) % n]; // The previous point
      /** @type{number[]} */ const p1 = thePoints[i]; // The current point
      /** @type{number[]} */ const p2 = thePoints[(i + 1) % n]; // The next point
      /** @type{number[]} */ const p3 = thePoints[(i + 2) % n]; // The next, next point
      /** @type{number[]} */ const d1 = vMinus(p2, p0);
      /** @type{number[]} */ const d2 = vMinus(p3, p1);
      /** @type{number} */ const b2x = p1[0] + d1[0] / 2 / 3; // See Workbook 5 Page 5 for the formulas
      /** @type{number} */ const b2y = p1[1] + d1[1] / 2 / 3; // See Workbook 5 Page 5 for the formulas
      /** @type{number} */ const b3x = p2[0] - d2[0] / 2 / 3; // See Workbook 5 Page 5 for the formulas
      /** @type{number} */ const b3y = p2[1] - d2[1] / 2 / 3; // See Workbook 5 Page 5 for the formulas
      context.bezierCurveTo(b2x, b2y, b3x, b3y, p2[0], p2[1]);
    }
  }
  context.closePath();
  context.stroke();
  /**
   * Linear interpolation for the arc-length table
   * @param {object} p1 The first point
   * @param {object} p2 The second point
   * @param {number} v The distance parameter
   * @returns 
   */
  function tabLerp(p1, p2, v) {
    if (!p2) {
      // console.log("no p2!");
      return p1.u;
    }
    if (!p1) {
      // console.log("no p1!");
      return 0;
    }
    /** @type {number} */ const a = (v - p1.a) / (p2.a - p1.a); // Percentage closer to p1
    /** @type {number} */ const a1 = 1 - a; // Percentage closer to p2
    return a1 * p1.u + a * p2.u;
  }
  /** @type {number} */ const tieSpacing = 20;
  /** @type {number} */ const tieSize = 20;
  /** @type {number} */ const tieSize2 = tieSize / 2;
  context.save();
  context.fillStyle = "brown";
  if (!simpleTrack) {
    /** @type {number} */ let cs = 0;
    /** @type {number} */ let np = 0;
    /** @type {number} */ let pt = basis(0); // The position at 0
    for (let ud = 0; ud <= lp[4]; ud += tieSpacing) {
      // Find the parameter np corresponding the distance ud from the arc-length table
      // It is the first index after the total distance so far is larger than the distance in the arc-length table
      for (np = cs; alTable[np].a < ud; np++);
      if (np > 0) {
        // Find the parameter cs as the index before np in the arc-length table
        // The arc-length parameter is between cs and np interpolated using the distance ud
        cs = np - 1;
        // Find the position on the curve based on the arc-length table
        pt = basis(tabLerp(alTable[cs], alTable[np], ud));
      }
      context.save();
      context.translate(pt[0], pt[1]);
      context.rotate(Math.atan2(pt[3], pt[2]));
      // Draw the rail tie as a rectangle
      context.fillRect(-2, -tieSize2, 4, tieSize);
      context.restore();
    }
  }
  context.restore();
  context.save();
  if (!simpleTrack) {
    for (let lr = -5; lr <= 5; lr += 10) {
      context.beginPath();
      /** @type {number} */ let cs = 0;
      /** @type {number} */ let np = 0;
      /** @type {number} */ let pt = basis(0); // The position at 0
      /** @type {number} */ const d = Math.sqrt(pt[2] * pt[2] + pt[3] * pt[3]); // The length of the velocity (so that it can be normalized to 1)
      /** @type {number} */ const dx0 = lr * pt[2] / d; // The x-offset from the center of the track to one of the parallel tracks
      /** @type {number} */ const dy0 = lr * pt[3] / d; // The y-offset from the center of the track to one of the parallel tracks
      context.moveTo(pt[0] + dy0, pt[1] - dx0);
      for (let ud = 0; ud <= lp[4]; ud += 10) {
        // Find the parameter np corresponding the distance ud from the arc-length table
        // It is the first index after the total distance so far is larger than the distance in the arc-length table
        for (np = cs; alTable[np].a < ud; np++);
        if (np > 0) {
          // Find the parameter cs as the index before np in the arc-length table
          // The arc-length parameter is between cs and np interpolated using the distance ud
          cs = np - 1;
          // Find the position on the curve based on the arc-length table
          pt = basis(tabLerp(alTable[cs], alTable[np], ud));
        }
        // Find the length of the velocity (so that it can be normalized to 1)
        let distance = Math.sqrt(pt[2] * pt[2] + pt[3] * pt[3]);
        // Find the x-offset from the center of the track to one of the parallel tracks
        let dx1 = lr * pt[2] / distance;
        // Find the y-offset from the center of the track to one of the parallel tracks
        let dy1 = lr * pt[3] / distance;
        /* note - we need to rotate by 90 degrees! */
        context.lineTo(pt[0] + dy1, pt[1] - dx1);
      }
      context.closePath();
      context.stroke();
    }
  }
  context.restore();
  // where is the train
  /** @type {number} */ let x, y, dx, dy;
  if (doArcLength) {
    /* convert the parameter from arc length to regular */
    // first scale so that 100% of the slider = 100% of arc length
    /** @type {number} */ const parameter = (param / thePoints.length) * lp[4];
    /** @type {number} */ let cs = 0;
    /** @type {number} */ let np;
    // Find the parameter np corresponding the distance parameter from the arc-length table
    // It is the first index after the total distance so far is larger than the distance in the arc-length table
    for (np = 0; alTable[np].a < parameter; np++);
    // Find the parameter cs as the index before np in the arc-length table
    // The arc-length parameter is between cs and np interpolated using the distance ud
    cs = np - 1;
    /** @type {number} */ const npp = alTable[np];
    /** @type {number} */ const csp = alTable[cs];
    // Find the position on the curve based on the arc-length table
    [x, y, dx, dy] = basis(tabLerp(csp, npp, parameter));
  } else {
    /* compute the value of the current point */
    [x, y, dx, dy] = basis(param);
  }
  context.save();
  context.save();
  context.translate(x, y);
  context.rotate(Math.atan2(dy, dx));
  context.fillRect(-20, -10, 40, 20);  // CS559 Sample Code
  // headlight
  context.fillStyle = "#FFFF0080";
  context.beginPath();
  context.moveTo(20, 0);  // CS559 Sample Code
  context.lineTo(80, -30);  // CS559 Sample Code
  context.lineTo(80, 30);  // CS559 Sample Code
  context.closePath();
  context.fill();
  context.restore();
  context.restore();
  // smoke...
  // make each smoke dot bigger
  smokePoints.forEach(function (pt) { pt[2] += 1; });
  // get rid of smoke dots that are old (big)
  smokePoints = smokePoints.filter(pt => pt[2] < 30);
  // add a smoke dot for the train
  if (doSmoke && (Math.random() < .5))
    smokePoints.push([x, y, 3]);
  // draw the smoke dots
  context.save();
  context.fillStyle = "#80808080"; // CS559 Sample Code
  smokePoints.forEach(function (pt) {
    context.beginPath();
    context.arc(pt[0], pt[1], pt[2], 0, Math.PI * 2); // CS559 Sample Code
    context.fill();
  });
  context.restore();
}
version1();
// End Mike's Basic Example Solution