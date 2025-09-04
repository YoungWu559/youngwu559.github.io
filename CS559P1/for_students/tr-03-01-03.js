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

// Begin Bonus Example Solution 2
function version2() {
  var mainSplineTension = 50;
  const stepPerCurve = 1000;
  var mode = 0; // 0 = normal, 1 = arc length parameterization
  const numRailTiesPer100Meter = 4;
  const railTieWidth = 30;
  const railTieThickness = 8;
  const parallelRailWidth = 18;
  var numTrains = 6;
  const distBetweenCars = 60;
  var simpleTrack = false;
  const reparamStep = 0.0001;
  const trainLinkOffset = 15;
  var showPoints = false;
  var showSmoke = true;
  var simpleTrain = false;
  var showTerrain = true;
  const treeDistance = 20;
  var smokeCounter = 10;
  const recordPoints = true;
  var bSplineOn = false;
  var wasBSpline = false;
  const truckedWheelDistance = 30;
  const wheelThickness = 10;
  const wheelLength = 10;
  const extraWheelDist = 7;
  var truckedWheels = true;

  var table = [];
  var lastPoints = [];
  var lastSplineTension = 50;

  var railTies = [];
  var parallelRails = [];
  var bSplinePoints = [];

  let thePoints = [
    [554, 76], [557, 520], [463, 502], [413, 388], [479, 250], [207, 177], [348, 553], [38, 513], [123, 246], [40, 120], [145, 115], [190, 40]
  ];

  let smoke = [];

  let trees = [];

  /**
   * Draw function - this is the meat of the operation
   *
   * It's the main thing that needs to be changed
   *
   * @param {HTMLCanvasElement} canvas
   * @param {number} param
   */
  function draw(canvas, param) {
    let context = canvas.getContext("2d");
    // clear the screen
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (recordPoints) {
      let string = "points: ";
      for (let i = 0; i < thePoints.length; i++) {
        string += "[" + thePoints[i][0] + ", " + thePoints[i][1] + "], ";
      }
      // console.log(string);
    }

    // draw the control points
    let drawControlPoints = () => {
      context.save();
      context.fillStyle = "#ffb700";
      context.strokeStyle = "black";
      context.lineWidth = 2;
      thePoints.forEach(function (pt) {
        context.beginPath();
        context.arc(pt[0], pt[1], 6, 0, Math.PI * 2);
        context.closePath();
        context.fill();
        context.stroke();
      });
      context.restore();
    }

    // now, the student should add code to draw the track and train


    let copyPoints = () => {
      lastPoints = [];
      for (let i = 0; i < thePoints.length; i++) {
        lastPoints.push([thePoints[i][0], thePoints[i][1]])
      }
    }

    let isUpdated = () => {
      if (lastSplineTension != mainSplineTension || lastPoints.length != thePoints.length) {
        lastSplineTension = mainSplineTension;
        copyPoints();
        return true;
      }
      for (let i = 0; i < thePoints.length; i++) {
        if (thePoints[i][0] != lastPoints[i][0] || thePoints[i][1] != lastPoints[i][1]) {
          lastSplineTension = mainSplineTension;
          copyPoints();
          return true;
        }
      }
      if (wasBSpline != bSplineOn) {
        wasBSpline = bSplineOn;
        return true;
      }
      return false;
    }

    // ---------- DRAW FUNCTIONS ---------

    let drawTrack = (points1, splineTension, isTerrain = false, fancyTrack = false) => {
      let points;
      context.save();
      context.beginPath();
      if (bSplineOn && !fancyTrack) {
        let thisCurve = bspline(0);
        context.moveTo(thisCurve[0], thisCurve[1]);
        points = bSplinePoints;
        splineTension = 1;
      }
      else {
        points = points1;
        context.moveTo(points[0][0], points[0][1]);
      }

      for (let i = 0; i < points.length; i++) {
        let prevPt = points[(i - 1 + points.length) % points.length];
        let currPt = points[i % points.length];
        let nextPt = points[(i + 1) % points.length];
        let nextNextPt = points[(i + 2) % points.length];

        let slope1 = (nextPt[1] - prevPt[1]) / (nextPt[0] - prevPt[0]);
        let slope2 = (nextNextPt[1] - points[i % points.length][1]) / (nextNextPt[0] - points[i % points.length][0]);

        let sign1X = (nextPt[0] - prevPt[0]) / Math.abs((nextPt[0] - prevPt[0]));
        let sign2X = (nextNextPt[0] - points[i % points.length][0]) / Math.abs((nextNextPt[0] - points[i % points.length][0]));

        let angle1 = Math.atan2(sign1X * slope1, sign1X);
        let angle2 = Math.atan2(sign2X * slope2, sign2X) + Math.PI;

        let ctrlPt1 = [splineTension * Math.cos(angle1) + currPt[0], splineTension * Math.sin(angle1) + currPt[1]];
        let ctrlPt2 = [splineTension * Math.cos(angle2) + nextPt[0], splineTension * Math.sin(angle2) + nextPt[1]];

        if ((nextPt[0] - prevPt[0]) == 0) {
          let sign1Y = (nextPt[1] - prevPt[1]) / Math.abs((nextPt[1] - prevPt[1]));
          ctrlPt1 = [currPt[0], splineTension * sign1Y + currPt[1]];
        }

        if ((nextNextPt[0] - points[i % points.length][0]) == 0) {
          let sign2Y = -(nextNextPt[1] - points[i % points.length][1]) / Math.abs((nextNextPt[1] - points[i % points.length][1]));
          ctrlPt2 = [nextPt[0], splineTension * sign2Y + nextPt[1]];
        }

        context.bezierCurveTo(ctrlPt1[0], ctrlPt1[1], ctrlPt2[0], ctrlPt2[1], points[(i + 1) % points.length][0], points[(i + 1) % points.length][1]);
      }
      if (isTerrain && !fancyTrack) {
        context.strokeStyle = "#7a5618";
        context.lineWidth = 70;
        context.stroke();
        context.strokeStyle = "#947051";
        context.lineWidth = 60;
        context.stroke();
      }
      else if (simpleTrack) {
        context.strokeStyle = "black";
        context.lineWidth = 1;
        context.stroke();
      }
      else {
        context.strokeStyle = "black";
        context.lineWidth = 5;
        context.stroke();
        context.strokeStyle = "grey";
        context.lineWidth = 3;
        context.stroke();
      }
    }

    let drawFrontCar = (x, y, angle) => {
      context.save();
      if (simpleTrain) {
        context.lineWidth = 2;
        if (mode == 0) {
          context.strokeStyle = "darkred";
          context.fillStyle = "red";
        }
        else {
          context.strokeStyle = "darkgreen";
          context.fillStyle = "darkgreen";
        }

        context.translate(x, y);
        context.rotate(angle);
        context.beginPath();
        context.arc(0, 0, 3, 0, Math.PI * 2);
        context.fill()
        context.beginPath();
        context.rect(-20, -10, 40, 20);
        context.moveTo(20, 10);
        context.lineTo(30, 0);
        context.lineTo(20, -10);
        context.closePath();
        context.stroke();
      }
      else {
        context.translate(x, y);
        context.rotate(angle);
        context.fillStyle = "#333333";
        context.lineWidth = 2;
        context.fillRect(-25, -8, 42, 16);
        context.beginPath();

        context.moveTo(13, 13);
        context.lineTo(25, 0);
        context.lineTo(13, -13);
        context.closePath();

        context.strokeStyle = "black";
        context.fill();
        context.stroke();

        // wheels
        context.lineWidth = 3;
        context.strokeStyle = "#6c6f75";
        context.beginPath();
        context.moveTo(-17, -11);
        context.lineTo(7, -11);

        context.moveTo(-17, 11);
        context.lineTo(7, 11);
        context.stroke();

        context.lineWidth = 2;
        context.strokeStyle = "black";
        context.fillStyle = "#111111"

        context.fillRect(-22, -13, 10, 5);
        context.fillRect(-10, -13, 10, 5);
        context.fillRect(2, -13, 10, 5);

        context.fillRect(-22, 8, 10, 5);
        context.fillRect(-10, 8, 10, 5);
        context.fillRect(2, 8, 10, 5);

        // box
        context.fillStyle = "#404040"
        context.fillRect(-25, -14, 15, 28);
        context.strokeRect(-25, -14, 15, 28);

        // exhaust
        context.beginPath();
        context.fillStyle = "#101010"
        context.arc(9, 0, 8, 0, Math.PI * 2);
        context.fill();

        // arc length indicator
        if (mode == 0) {
          context.fillStyle = "red";
        }
        else {
          context.fillStyle = "green";
        }
        context.strokeStyle = "white";
        context.lineWidth = 1;
        context.fillRect(-21, -6, 7, 12);
        context.strokeRect(-21, -6, 7, 12);
      }
      context.restore();
    }

    let drawCar = (x, y, angle, type = 0) => {
      context.save();
      if (simpleTrain) {
        context.lineWidth = 2;
        if (mode == 0) {
          context.strokeStyle = "red";
          context.fillStyle = "red";
        }
        else {
          context.strokeStyle = "green";
          context.fillStyle = "green";
        }
        context.translate(x, y);
        context.rotate(angle);
        context.beginPath();
        context.arc(0, 0, 3, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.rect(-20, -10, 40, 20);
        context.moveTo(20, 10);
        context.lineTo(30, 0);
        context.lineTo(20, -10);
        context.closePath();
        context.stroke();
        context.restore();
      }
      else {
        context.translate(x, y);
        context.rotate(angle);
        if (type <= 2) {
          context.beginPath();
          context.fillStyle = "#595959";
          context.fillRect(-20, -10, 40, 20);

          // adding some coal
          let coal = [
            [0, 0], [10, 3], [-15, -3], [5, 4], [6, -2], [-2, 2], [-4, -4], [-9, -2], [-14, 5], [15, 3], [14, -2]
          ];
          context.lineWidth = 1;
          context.strokeStyle = "black";
          context.fillStyle = "#333333";
          for (let i = 0; i < coal.length; i++) {
            context.beginPath();
            context.arc(coal[i][0], coal[i][1], 4, 0, Math.PI * 2);
            context.fill();
            context.stroke();
          }

          context.strokeStyle = "#474747";
          context.lineWidth = 5;
          context.strokeRect(-20, -10, 40, 20);
        } else {
          context.fillStyle = "black";
          context.fillRect(-18, -12, 36, 24);

          context.beginPath();
          context.fillStyle = "#364d4c";
          context.moveTo(-20, 5);
          context.ellipse(-20, 0, 2, 10, 0, Math.PI * .5, Math.PI * 1.5);
          context.ellipse(20, 0, 2, 10, 0, Math.PI * 1.5, Math.PI * .5);
          context.lineTo(-20, 10);
          context.closePath();
          context.fill();

          context.fillStyle = "#2b3333";
          context.fillRect(-15, -12, 4, 24);
          context.fillRect(10, -12, 4, 24);
          context.fillRect(-2, -12, 4, 24);
        }
      }
      context.restore();
    }

    let drawTruckedWheels = (x, y, angle) => {
      context.save();
      context.lineWidth = 2;
      context.translate(x, y);
      context.rotate(angle);

      context.fillStyle = "#753e22";
      context.fillRect(-wheelLength / 4, -parallelRailWidth / 2, wheelLength / 2, parallelRailWidth);

      context.lineWidth = 2;
      context.fillStyle = "grey";
      context.strokeStyle = "black";
      context.fillRect(-wheelLength / 2, -parallelRailWidth / 2 - extraWheelDist, wheelLength, wheelThickness);
      context.fillRect(-wheelLength / 2, parallelRailWidth / 2 - wheelThickness + extraWheelDist, wheelLength, wheelThickness);
      context.strokeRect(-wheelLength / 2, -parallelRailWidth / 2 - extraWheelDist, wheelLength, wheelThickness);
      context.strokeRect(-wheelLength / 2, parallelRailWidth / 2 - wheelThickness + extraWheelDist, wheelLength, wheelThickness);

      context.restore();
    }

    let drawTruckedWheelLink = (frontWheelPos, backWheelPos) => {
      context.save();
      context.beginPath();
      context.moveTo(frontWheelPos[0], frontWheelPos[1]);
      context.lineTo(backWheelPos[0], backWheelPos[1]);

      context.strokeStyle = "#3b1703";
      context.lineWidth = 6;
      context.stroke();

      // context.strokeStyle = "#e6bd95";
      // context.lineWidth = 4;
      // context.stroke();

      context.restore();
    }

    let drawRailTie = (x, y, angle) => {
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      context.fillStyle = "#9e5808";
      context.strokeStyle = "#613504";
      context.lineWidth = 3;
      context.fillRect(-railTieWidth / 2, -railTieThickness / 2, railTieWidth, railTieThickness);
      context.strokeRect(-railTieWidth / 2, -railTieThickness / 2, railTieWidth, railTieThickness);
      context.restore();
    }

    let drawTrainLink = (trainPos, nextTrainPos) => {
      context.save();
      context.beginPath();
      context.moveTo(trainPos[0] - trainLinkOffset * Math.cos(trainPos[2]), trainPos[1] - trainLinkOffset * Math.sin(trainPos[2]));
      context.lineTo(nextTrainPos[0] + trainLinkOffset * Math.cos(nextTrainPos[2]), nextTrainPos[1] + trainLinkOffset * Math.sin(nextTrainPos[2]));

      context.strokeStyle = "black";
      context.lineWidth = 8;
      context.stroke();

      context.strokeStyle = "#e6bd95";
      context.lineWidth = 4;
      context.stroke();

      context.restore();
    }

    let drawTerrain = (table) => {
      context.save();
      // water
      context.fillStyle = "#308dbf";
      context.fillRect(0, 0, canvas.width, canvas.height);
      // bridge
      drawTrack(thePoints, mainSplineTension, true)
      // grass
      context.fillStyle = "#34b338";
      context.beginPath();
      context.moveTo(100, 600);
      context.bezierCurveTo(100, 400, 300, 200, 350, 0);
      context.lineTo(0, 0);
      context.lineTo(0, 600);
      context.closePath();

      context.moveTo(200, 600);
      context.bezierCurveTo(250, 400, 300, 200, 600, 400);
      context.lineTo(600, 600);
      context.closePath();

      context.moveTo(420, 0);
      context.bezierCurveTo(250, 500, 300, 150, 600, 350);
      context.lineTo(600, 0);
      context.closePath();

      // context.fillRect(0,0,200,canvas.height);
      // context.fillRect(300,0,canvas.width-300,canvas.height);
      context.fill();

      // trees
      let circles = [];
      for (let i = 0; i < thePoints.length; i += 0.1) {
        let circlePos = getTrainPos(arcLengthReparameterize(i, table));
        circles.push([circlePos[0], circlePos[1]]);
      }
      context.fillStyle = "#1b961f";
      context.strokeStyle = "black";
      context.lineWidth = 1;
      trees.forEach(tree => {
        let blocked = false;
        circles.forEach(circle => {
          let distance = Math.sqrt(Math.pow(circle[0] - tree[0], 2) + Math.pow(circle[1] - tree[1], 2));
          if (distance < tree[2] + treeDistance) {
            blocked = true;
          }
        });
        if (!blocked) {
          context.beginPath();
          context.arc(tree[0], tree[1], tree[2], 0, Math.PI * 2);
          context.fill();
          context.stroke();
        }
      })

      context.restore();
    }

    let drawSmoke = (x, y) => {
      context.save();
      smokeCounter--;
      if (smokeCounter <= 0) {
        smokeCounter = 2;
        let angle = Math.random() * Math.PI * 2;
        let magnitude = Math.random() * (1) + 1;
        smoke.push([x, y, magnitude * Math.cos(angle), magnitude * Math.sin(angle), Math.round(Math.random() * 5) + 10, Math.round(Math.random() * 100 + 100)]);
      }
      for (let i = 0; i < smoke.length; i++) {
        let puff = smoke[i];
        puff[5] -= 3;
        puff[0] += puff[2];
        puff[1] += puff[3];
        context.fillStyle = "#000000" + puff[5].toString(16);
        context.beginPath();
        context.arc(puff[0], puff[1], puff[4], 0, Math.PI * 2);
        context.fill();
      }
      smoke = smoke.filter(p => p[5] > 20);
      context.restore();
    }

    // --------- Curve Functions ----------

    // returns [p0, p0', p1, p1']
    let getCurvePoints = (t, splineTension) => {
      let u = Math.floor(t) % thePoints.length;
      let prevPt = thePoints[(u - 1 + thePoints.length) % thePoints.length];
      let currPt = thePoints[u + thePoints.length % thePoints.length];
      let nextPt = thePoints[(u + 1) % thePoints.length];
      let nextNextPt = thePoints[(u + 2) % thePoints.length];

      let slope1 = (nextPt[1] - prevPt[1]) / (nextPt[0] - prevPt[0]);
      let slope2 = (nextNextPt[1] - thePoints[Math.floor(t % thePoints.length)][1]) / (nextNextPt[0] - thePoints[Math.floor(t % thePoints.length)][0]);

      let sign1X = (nextPt[0] - prevPt[0]) / Math.abs((nextPt[0] - prevPt[0]));
      let sign2X = (nextNextPt[0] - thePoints[Math.floor(t % thePoints.length)][0]) / Math.abs((nextNextPt[0] - thePoints[Math.floor(t % thePoints.length)][0]));

      let angle1 = Math.atan2(sign1X * slope1, sign1X);
      let angle2 = Math.atan2(sign2X * slope2, sign2X);

      let ctrlPt1 = [3 * splineTension * Math.cos(angle1), 3 * splineTension * Math.sin(angle1)];
      let ctrlPt2 = [3 * splineTension * Math.cos(angle2), 3 * splineTension * Math.sin(angle2)];

      if ((nextPt[0] - prevPt[0]) == 0) {
        let sign1Y = (nextPt[1] - prevPt[1]) / Math.abs((nextPt[1] - prevPt[1]));
        ctrlPt1 = [0, 3 * splineTension * sign1Y];
      }

      if ((nextNextPt[0] - thePoints[Math.floor(t % thePoints.length)][0]) == 0) {
        let sign2Y = (nextNextPt[1] - thePoints[Math.floor(t % thePoints.length)][1]) / Math.abs((nextNextPt[1] - thePoints[Math.floor(t % thePoints.length)][1]));
        ctrlPt2 = [0, 3 * splineTension * sign2Y];
      }

      return [currPt, ctrlPt1, nextPt, ctrlPt2];
    }

    let bspline = (t) => {
      let u = t % 1;
      let seg = Math.floor(t);
      let p0 = thePoints[(seg - 1 + thePoints.length) % thePoints.length];
      let p1 = thePoints[seg];
      let p2 = thePoints[(seg + 1) % thePoints.length];
      let p3 = thePoints[(seg + 2) % thePoints.length];
      // cardinal basis functions
      const s = 0.5;
      let u2 = u * u;
      let u3 = u * u * u;
      let b0 = 1 / 6 * (-u3 + 3 * u2 - 3 * u + 1);
      let b1 = 1 / 6 * (3 * u3 - 6 * u2 + 4);
      let b2 = 1 / 6 * (-3 * u3 + 3 * u2 + 3 * u + 1);
      let b3 = 1 / 6 * u3;
      let x = b0 * p0[0] + b1 * p1[0] + b2 * p2[0] + b3 * p3[0];
      let y = b0 * p0[1] + b1 * p1[1] + b2 * p2[1] + b3 * p3[1];
      // derivative of cardinal basis functions
      let d0 = 1 / 6 * (-3 * u2 + 6 * u - 3);
      let d1 = 1 / 6 * (9 * u2 - 12 * u);
      let d2 = 1 / 6 * (-9 * u2 + 6 * u + 3);
      let d3 = 1 / 6 * (3 * u2);
      let dx = d0 * p0[0] + d1 * p1[0] + d2 * p2[0] + d3 * p3[0];
      let dy = d0 * p0[1] + d1 * p1[1] + d2 * p2[1] + d3 * p3[1];
      return [x, y, dx, dy];
    }

    let getTrainPos = (t) => {
      t = (t + thePoints.length) % thePoints.length;

      if (bSplineOn) {
        let curve = bspline(t);
        return [curve[0], curve[1], Math.atan2(curve[3], curve[2])];
      }

      let curvePoints = getCurvePoints(t, mainSplineTension);

      let u = Math.round(100 * (t - Math.floor(t))) / 100;

      let b0 = 1 - 3 * Math.pow(u, 2) + 2 * Math.pow(u, 3);
      let b1 = u - 2 * Math.pow(u, 2) + Math.pow(u, 3);
      let b2 = 3 * Math.pow(u, 2) - 2 * Math.pow(u, 3);
      let b3 = -Math.pow(u, 2) + Math.pow(u, 3);

      let db0 = -6 * u + 6 * Math.pow(u, 2);
      let db1 = 1 - 4 * u + 3 * Math.pow(u, 2);
      let db2 = 6 * u - 6 * Math.pow(u, 2);
      let db3 = -2 * u + 3 * Math.pow(u, 2);

      let trainPosX = b0 * curvePoints[0][0] + b1 * curvePoints[1][0] + b2 * curvePoints[2][0] + b3 * curvePoints[3][0];
      let trainPosY = b0 * curvePoints[0][1] + b1 * curvePoints[1][1] + b2 * curvePoints[2][1] + b3 * curvePoints[3][1];

      let trainPosDX = db0 * curvePoints[0][0] + db1 * curvePoints[1][0] + db2 * curvePoints[2][0] + db3 * curvePoints[3][0];
      let trainPosDY = db0 * curvePoints[0][1] + db1 * curvePoints[1][1] + db2 * curvePoints[2][1] + db3 * curvePoints[3][1];

      let carAngle = Math.atan2(trainPosDY, trainPosDX);

      return [trainPosX, trainPosY, carAngle]
    }

    let getTotalLength = () => {
      let getLengthOfCurve = (t) => {
        t = (t + thePoints.length) % thePoints.length;
        let l = 0;
        for (let i = t; i < t + 1; i += 1 / stepPerCurve) {
          let pts1 = getTrainPos(i);
          let pts2 = getTrainPos(i + 1 / stepPerCurve);
          l += Math.sqrt(Math.pow((pts2[0] - pts1[0]), 2) + Math.pow((pts2[1] - pts1[1]), 2));
        }
        return l;
      }
      let l = 0;
      for (let i = 0; i < thePoints.length; i++) {
        l += getLengthOfCurve(i);
      }
      return l;
    }

    let getReparamTable = () => {
      let totalLength = getTotalLength();
      let table = [];
      let currDist = 0;
      let step = 0;
      for (let i = 0; i < thePoints.length; i += reparamStep) {
        let goalPos = (i / thePoints.length) * totalLength;
        while (currDist < goalPos) {
          let pts1 = getTrainPos(step);
          let pts2 = getTrainPos(step + 1 / stepPerCurve);
          currDist += Math.sqrt(Math.pow((pts2[0] - pts1[0]), 2) + Math.pow((pts2[1] - pts1[1]), 2));
          step += 1 / 1000;
        }
        table.push(step)
      }
      return table;
    }

    let arcLengthReparameterize = (t, table) => {
      return table[(Math.round(t / reparamStep) + table.length) % table.length];
    }

    let binarySearch = (element, arr, start = 0, end = arr.length) => {
      let mid = Math.round(start + (end - start) / 2);
      if (end <= start) {
        return end;
      } else if (Math.abs((arr[mid] - element)) <= reparamStep) {
        return mid;
      } else {
        if (element > arr[mid]) {
          return binarySearch(element, arr, mid + 1, end);
        } else {
          return binarySearch(element, arr, start, mid - 1)
        }
      }
    }

    let distFromPointReparam = (currPt, dist, totalLength, table) => {
      let indexDistance = Math.floor(((dist / totalLength) * thePoints.length) / reparamStep) * reparamStep;
      return arcLengthReparameterize((currPt - indexDistance) % thePoints.length, table);
    }

    let getRailTies = (numTiePer100, table) => {
      let points = [];
      let totalLength = getTotalLength();
      let spacing = Math.round((1 / reparamStep) * thePoints.length / Math.floor(totalLength / (100 / numTiePer100))) / (1 / reparamStep);

      for (let i = 0; i < thePoints.length; i += spacing) {
        let param = arcLengthReparameterize(i, table);
        let pos = getTrainPos(param);
        points.push({
          "pos": [pos[0], pos[1]],
          "angle": pos[2]
        });
      }
      return points;
    }

    let getParallelRailPoints = () => {
      let sideRailWidth = parallelRailWidth / 2;
      let innerRailPoints = [];
      let outerRailPoints = [];

      for (let i = 0; i < thePoints.length; i += 0.02) {
        let innerPoint = getTrainPos(i);
        innerRailPoints.push([
          innerPoint[0] + sideRailWidth * Math.cos(innerPoint[2] + Math.PI / 2),
          innerPoint[1] + sideRailWidth * Math.sin(innerPoint[2] + Math.PI / 2),
          innerPoint[2]
        ]);
        let outerPoint = getTrainPos(i)
        outerRailPoints.push([
          outerPoint[0] + sideRailWidth * Math.cos(outerPoint[2] - Math.PI / 2),
          outerPoint[1] + sideRailWidth * Math.sin(outerPoint[2] - Math.PI / 2),
          outerPoint[2]
        ]);
      }
      return [innerRailPoints, outerRailPoints];
    }

    let drawFancyRails = () => {
      for (let i = 0; i < railTies.length; i++) {
        drawRailTie(railTies[i].pos[0], railTies[i].pos[1], railTies[i].angle + Math.PI / 2);
      }
      drawTrack(parallelRails[0], 1, showTerrain, true);
      drawTrack(parallelRails[1], 1, showTerrain, true);
    }

    let getTruckedWheelPos = (t) => {
      t = t % thePoints.length;
      let dist = 0;
      let t1 = t;
      let t2 = t1;
      let distReached = false;
      while (!distReached) {
        t1 = (t1 + 1 / stepPerCurve) % thePoints.length;
        let pts1 = getTrainPos(t);
        let pts2 = getTrainPos(t1);
        dist = Math.sqrt(Math.pow((pts2[0] - pts1[0]), 2) + Math.pow((pts2[1] - pts1[1]), 2));
        if (dist >= truckedWheelDistance / 2) {
          distReached = true;
        }
      }
      // let t1 = t;
      distReached = false;
      while (!distReached) {
        t2 = (t2 - 1 / stepPerCurve) % thePoints.length;
        let pts1 = getTrainPos(t1);
        let pts2 = getTrainPos(t2);
        dist = Math.sqrt(Math.pow((pts2[0] - pts1[0]), 2) + Math.pow((pts2[1] - pts1[1]), 2));
        if (dist >= truckedWheelDistance) {
          distReached = true;
        }
      }

      let frontWheelPos = getTrainPos(t1);
      let backWheelPos = getTrainPos(t2);

      let trainX = backWheelPos[0] + (frontWheelPos[0] - backWheelPos[0]) / 2;
      let trainY = backWheelPos[1] + (frontWheelPos[1] - backWheelPos[1]) / 2;

      let slope = (frontWheelPos[1] - backWheelPos[1]) / (frontWheelPos[0] - backWheelPos[0]);
      let signX = (frontWheelPos[0] - backWheelPos[0]) / Math.abs(frontWheelPos[0] - backWheelPos[0]);
      let angle = Math.atan2(signX * slope, signX);

      let trainPos = [trainX, trainY, angle];

      return [frontWheelPos, backWheelPos, trainPos];
    }

    let drawTrains = (t, table) => {
      t = t % thePoints.length;
      let currPt;
      let paramPos = arcLengthReparameterize(t, table);
      if (mode == 0) {
        currPt = binarySearch(t, table, 0, table.length) * reparamStep;
      } else {
        currPt = binarySearch(paramPos, table, 0, table.length) * reparamStep;
      }
      let totalLength = getTotalLength();

      let trainPos = getTrainPos(distFromPointReparam(currPt, 0, totalLength, table));
      let frontTrainPos = [trainPos[0], trainPos[1]];

      let wheelU = distFromPointReparam(currPt, 0, totalLength, table);

      for (let i = 0; i < numTrains; i++) {
        let u = distFromPointReparam(currPt, (i + 1) * distBetweenCars, totalLength, table);
        let nextTrainPos = getTrainPos(u);

        if (truckedWheels) {
          let wheels = getTruckedWheelPos(wheelU);
          drawTruckedWheelLink(wheels[0], wheels[1]);
          drawTruckedWheels(wheels[0][0], wheels[0][1], wheels[0][2]);
          drawTruckedWheels(wheels[1][0], wheels[1][1], wheels[1][2]);
          trainPos = wheels[2];
          nextTrainPos = getTruckedWheelPos(distFromPointReparam(currPt, (i + 1) * distBetweenCars, totalLength, table))[2];
        }

        if (i + 1 < numTrains && !simpleTrain) {
          drawTrainLink(trainPos, nextTrainPos);
        }
        if (i == 0) {
          drawFrontCar(trainPos[0], trainPos[1], trainPos[2])
        } else {
          drawCar(trainPos[0], trainPos[1], trainPos[2], i);
        }

        wheelU = distFromPointReparam(currPt, (i + 1) * distBetweenCars, totalLength, table);
        trainPos = nextTrainPos;
      }

      if (showSmoke) {
        drawSmoke(frontTrainPos[0], frontTrainPos[1]);
      } else {
        smoke = [];
      }
    }

    if (table.length == 0) {
      table = getReparamTable();
      railTies = getRailTies(numRailTiesPer100Meter, table);
      parallelRails = getParallelRailPoints();
      bSplinePoints = [];
      for (let i = 0; i < thePoints.length; i += 0.05) {
        let point = bspline(i);
        bSplinePoints.push([point[0], point[1]]);
      }
      copyPoints();
    }
    if (thePoints.length >= 3) {
      if (isUpdated()) {
        table = getReparamTable();
        railTies = getRailTies(numRailTiesPer100Meter, table);
        parallelRails = getParallelRailPoints();
        bSplinePoints = [];
        for (let i = 0; i < thePoints.length; i += 0.05) {
          let point = bspline(i);
          bSplinePoints.push([point[0], point[1]]);
        }
        console.log("updated");
      }
      if (showTerrain) {
        drawTerrain(table);
      }
      if (simpleTrack) {
        drawTrack(thePoints, mainSplineTension);
      } else {
        drawFancyRails();
      }
      drawTrains(param, table);
    }
    if (showPoints) {
      drawControlPoints();
    }
  }

  /**
   * Setup stuff - make a "window.onload" that sets up the UI and starts
   * the train
   */

  let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById(
    "canvas3"
  ));
  let context = canvas.getContext("2d");

  let generateTrees = (x, y, numTrees, distance) => {
    for (let i = 0; i < numTrees; i++) {
      let angle = Math.random() * Math.PI * 2;
      let magnitude = Math.random() * (distance - 20) + 20;
      trees.push([x + magnitude * Math.cos(angle), y + magnitude * Math.sin(angle), Math.round(Math.random() * 3) + 10]);
    }
  }
  generateTrees(110, 30, 210, 200);
  generateTrees(100, 300, 40, 90);
  generateTrees(60, 420, 40, 60);
  generateTrees(400, 480, 150, 140);
  generateTrees(530, 130, 120, 140);

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

     /** @type{HTMLInputElement} */ let slider2 = (/** @type{HTMLInputElement} */ document.getElementById("tensionSlider"));
  slider2.oninput = () => {
    mainSplineTension = Number(slider2.value);
    draw(canvas, Number(slider.value) % thePoints.length);
  }

    /** @type{HTMLInputElement} */ let slider3 = (/** @type{HTMLInputElement} */ document.getElementById("trainNumSlider"));
  slider3.oninput = () => {
    numTrains = Number(slider3.value);
    draw(canvas, Number(slider.value) % thePoints.length);
  }

  // this is a helper function that makes a checkbox and sets up handlers
  // it sticks it at the end after everything else
  // you could also just put checkboxes into the HTML, but I found this more
  // convenient
  function addCheckbox(name, initial = false) {
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    document.getElementsByTagName("body")[0].appendChild(checkbox);
    checkbox.id = name;
    checkbox.onchange = wrapDraw;
    checkbox.checked = initial;
    let checklabel = document.createElement("label");
    checklabel.setAttribute("for", name);
    checklabel.innerText = name;
    document.getElementsByTagName("body")[0].appendChild(checklabel);
  }
  // note: if you add these features, uncomment the lines for the checkboxes
  // in your code, you can test if the checkbox is checked by something like:
  // document.getElementById("simple-track").checked
  // in your drawing code
  //
  // lines to uncomment to make checkboxes
  addCheckbox("Simple-Track", false);
    /** @type{HTMLInputElement} */ let simpleTrackCheck = (/** @type{HTMLInputElement} */ document.getElementById("Simple-Track"));
  simpleTrackCheck.onchange = () => {
    if (simpleTrackCheck.checked) {
      simpleTrack = true;
    } else {
      simpleTrack = false;
    }
    draw(canvas, Number(slider.value) % thePoints.length);
  }

  addCheckbox("Simple-Train", false);
    /** @type{HTMLInputElement} */ let simpleTrainCheck = (/** @type{HTMLInputElement} */ document.getElementById("Simple-Train"));
  simpleTrainCheck.onchange = () => {
    if (simpleTrainCheck.checked) {
      simpleTrain = true;
    } else {
      simpleTrain = false;
    }
    draw(canvas, Number(slider.value) % thePoints.length);
  }

  addCheckbox("Arc-Length", false);
    /** @type{HTMLInputElement} */ let arcLengthCheck = (/** @type{HTMLInputElement} */ document.getElementById("Arc-Length"));
  arcLengthCheck.onchange = () => {
    if (arcLengthCheck.checked) {
      mode = 1;
    } else {
      mode = 0;
    }
    draw(canvas, Number(slider.value) % thePoints.length);
  }

  addCheckbox("Trucked Wheels", true);
    /** @type{HTMLInputElement} */ let TruckedWheelsCheck = (/** @type{HTMLInputElement} */ document.getElementById("Trucked Wheels"));
  TruckedWheelsCheck.onchange = () => {
    if (TruckedWheelsCheck.checked) {
      truckedWheels = true;
    } else {
      truckedWheels = false;
    }
    draw(canvas, Number(slider.value) % thePoints.length);
  }

  addCheckbox("Smoke", true);
    /** @type{HTMLInputElement} */ let smokeCheck = (/** @type{HTMLInputElement} */ document.getElementById("Smoke"));
  smokeCheck.onchange = () => {
    if (smokeCheck.checked) {
      showSmoke = true;
    } else {
      showSmoke = false;
    }
    draw(canvas, Number(slider.value) % thePoints.length);
  }

  addCheckbox("Terrain", true);
    /** @type{HTMLInputElement} */ let terrainCheck = (/** @type{HTMLInputElement} */ document.getElementById("Terrain"));
  terrainCheck.onchange = () => {
    if (terrainCheck.checked) {
      showTerrain = true;
    } else {
      showTerrain = false;
    }
    draw(canvas, Number(slider.value) % thePoints.length);
  }

  addCheckbox("BSpline", false);
    /** @type{HTMLInputElement} */ let BSplineCheck = (/** @type{HTMLInputElement} */ document.getElementById("BSpline"));
  BSplineCheck.onchange = () => {
    if (BSplineCheck.checked) {
      bSplineOn = true;
    } else {
      bSplineOn = false;
    }
    draw(canvas, Number(slider.value) % thePoints.length);
  }

  addCheckbox("Show Points", false);
    /** @type{HTMLInputElement} */ let showPointsCheck = (/** @type{HTMLInputElement} */ document.getElementById("Show Points"));
  showPointsCheck.onchange = () => {
    if (showPointsCheck.checked) {
      showPoints = true;
    } else {
      showPoints = false;
    }
    draw(canvas, Number(slider.value) % thePoints.length);
  }

  // helper function - set the slider to have max = # of control points
  function setNumPoints() {
    runcavas.setupSlider(0, thePoints.length, 0.025);
  }

  setNumPoints();
  runcavas.setValue(0);

  // add the point dragging UI
  draggablePoints(canvas, thePoints, wrapDraw, 10, setNumPoints);
}
version2();
// End Bonus Example Solution 2