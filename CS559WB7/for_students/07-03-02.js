/*jshint esversion: 6 */
// @ts-check

/**
 * CS 559 Demos for in-class use
 *
 * Students are welcome to experiment with these demonstrations.
 *
 * The code was written to have a quick demo to show in class, it was
 * not designed to be good to read.
 */

import * as T from "../libs/CS559-Three/build/three.module.js";
import { OrbitControls } from "../libs/CS559-Three/examples/jsm/controls/OrbitControls.js";
import {
  makeCheckbox,
  makeButton,
  makeBoxDiv,
  makeOutbox,
  makeFlexDiv,
  makeBreak,
  makeHead
} from "../libs/CS559/inputHelpers.js";

// the object that we spin
function spinableObject() {
  let group = new T.Group();
  let frame = new T.AxesHelper(1);
  group.add(frame);

  let cube = new T.BoxGeometry(0.5, 0.5, 0.5);
  let c0 = new T.Mesh(cube, new T.MeshStandardMaterial({ color: "white" }));
  group.add(c0);
  let cx = new T.Mesh(cube, new T.MeshStandardMaterial({ color: "red" }));
  cx.position.x = 1;
  group.add(cx);
  let cy = new T.Mesh(cube, new T.MeshStandardMaterial({ color: "green" }));
  cy.position.y = 1;
  group.add(cy);
  let cz = new T.Mesh(cube, new T.MeshStandardMaterial({ color: "blue" }));
  cz.position.z = 1;
  group.add(cz);

  return group;
}

function compareRot() {
  let rotDiv = document.getElementById("div1");
  let renderer = new T.WebGLRenderer();
  renderer.setSize(600, 400);
  rotDiv.appendChild(renderer.domElement);

  let scene = new T.Scene();
  let camera = new T.PerspectiveCamera(
    18,
    renderer.domElement.width / renderer.domElement.height,
    1,
    1000
  );

  camera.position.z = 20;
  camera.position.y = 10;
  camera.position.x = 0;
  camera.lookAt(0, 0, 0);

  // since we're animating, add OrbitControls
  let controls = new OrbitControls(camera, renderer.domElement);

  scene.add(new T.AmbientLight("white", 0.2));
  let pointLight = new T.PointLight("white", 1, 0, 0);
  pointLight.position.set(20, 10, 15);
  scene.add(pointLight);

  let dirLight = new T.DirectionalLight("white", 1);
  dirLight.position.set(1, 1, 1);
  scene.add(dirLight);

  // make a ground plane
  let groundBox = new T.BoxGeometry(12, 0.1, 12);
  let groundMesh = new T.Mesh(
    groundBox,
    new T.MeshStandardMaterial({ color: 0x888888 })
  );
  // put the top of the box at the ground level (0)
  groundMesh.position.y = -3;
  scene.add(groundMesh);

  /*** Specific to this demo */

  // 4 sets of axes
  let objLeft = spinableObject();
  let objRight = spinableObject();
  let objCenter = spinableObject();

  // move them to an appropriate place
  objLeft.position.x = -3;
  objRight.position.x = 3;

  // add to the scene (we'll use the top level obj for the rotation)
  scene.add(objLeft);
  scene.add(objRight);
  scene.add(objCenter);

  // to keep track of the world
  let axWorld = new T.AxesHelper();
  scene.add(axWorld);

  // put the world axes with the ground plane
  axWorld.position.y = -2.49;

  const step = 0.01;

  let dx = step;
  let dy = 0;
  let dz = step;

  // convert the Euler angles to Axis Angle
  function axisAngle(ex, ey, ez) {
    let e = new T.Euler(ex, ey, ez);
    let q = new T.Quaternion();
    q.setFromEuler(e);

    let angle = 2 * Math.acos(q.w);
    let axisL = Math.sqrt(q.x * q.x + q.y * q.z + q.z * q.z);
    let axisX = q.x / axisL;
    let axisY = q.y / axisL;
    let axisZ = q.z / axisL;
    let axis = new T.Vector3(axisX, axisY, axisZ);

    return { angle: angle, axis: axis };
  }

  let axAng = axisAngle(dx, dy, dz);
  let axis = axAng.axis;
  let angle = axAng.angle;

  // create a line showing the axis of rotation
  // in the old days, this used Geometry, now we have to use BufferGeometry
  let lineMaterial = new T.LineBasicMaterial({ color: "white" });
  let points = [];
  points.push(new T.Vector3(-axis.x, -axis.y, -axis.z));
  points.push(axis);
  let lineGeom = new T.BufferGeometry().setFromPoints(points);

  let lineCenter = new T.Line(lineGeom, lineMaterial);
  scene.add(lineCenter);

  let lineRight = new T.Line(lineGeom, lineMaterial);
  lineRight.position.set(
    objRight.position.x,
    objRight.position.y,
    objRight.position.z
  );
  scene.add(lineRight);

  let inputs = makeBoxDiv({ width: renderer.domElement.width }, rotDiv);
  let runCheck = makeCheckbox("run", inputs);

  function stepper(speed=1) {
    objLeft.rotation.x += dx*speed;
    objLeft.rotation.y += dy*speed;
    objLeft.rotation.z += dz*speed;

    objCenter.rotateX(dx*speed);
    objCenter.rotateY(dy*speed);
    objCenter.rotateZ(dz*speed);

    objRight.rotateOnAxis(axis, angle*speed);
  }

  let stepButton = makeButton("step", inputs);
  stepButton.onclick = function() { stepper(5); };

  let zeroButton = makeButton("zero", inputs);
  zeroButton.onclick = function() {
    objLeft.rotation.set(0, 0, 0);
    objCenter.rotation.set(0, 0, 0);
    objRight.rotation.set(0, 0, 0);
  };

  let outs = makeFlexDiv(rotDiv);

  function dg(id, heading) {
    let out = {};
    out.outdiv = makeBoxDiv({ width: 190 }, outs);
    makeHead(heading, out.outdiv, { tight: true });
    out.outX = makeOutbox("X" + id, out.outdiv, "EulerX");
    makeBreak(out.outdiv);
    out.outY = makeOutbox("Y" + id, out.outdiv, "EulerY");
    makeBreak(out.outdiv);
    out.outZ = makeOutbox("Z" + id, out.outdiv, "EulerZ");
    makeBreak(out.outdiv);
    out.angl = makeOutbox("A" + id, out.outdiv, "Angle");
    makeBreak(out.outdiv);
    out.axX = makeOutbox("AX" + id, out.outdiv, "Axis X");
    makeBreak(out.outdiv);
    out.axY = makeOutbox("AY" + id, out.outdiv, "Axis Y");
    makeBreak(out.outdiv);
    out.axZ = makeOutbox("AZ" + id, out.outdiv, "Axis Z");
    makeBreak(out.outdiv);
    return out;
  }
  let d1 = dg("1", "Euler Steps");
  let d2 = dg("2", "Compose Rotations");
  let d3 = dg("3", "Axis Angle");

  // render
  let lasttime = undefined;
  function animLoop(timestamp) {
    let delta = lasttime ? (timestamp-lasttime) : 0;
    lasttime = timestamp;
    if (runCheck.checked) {
      stepper(delta/2);
    }

    function updateBox(object, d) {
      d.outX.value = object.rotation.x.toPrecision(3);
      d.outY.value = object.rotation.y.toPrecision(3);
      d.outZ.value = object.rotation.z.toPrecision(3);
      let aa = axisAngle(
        object.rotation.x,
        object.rotation.y,
        object.rotation.z
      );
      d.angl.value = aa.angle.toPrecision(3);
      d.axX.value = aa.axis.x.toPrecision(3);
      d.axY.value = aa.axis.y.toPrecision(3);
      d.axZ.value = aa.axis.z.toPrecision(3);
    }
    updateBox(objLeft, d1);
    updateBox(objCenter, d2);
    updateBox(objRight, d3);

    renderer.render(scene, camera);
    window.requestAnimationFrame(animLoop);
  }
  animLoop();
}
compareRot();
