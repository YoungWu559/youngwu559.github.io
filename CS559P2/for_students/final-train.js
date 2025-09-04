/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/*jshint esversion: 6 */
// @ts-check

import * as THREE from "../libs/CS559-Three/build/three.module.js";
import { OrbitControls } from "../libs/CS559-Three/examples/jsm/controls/OrbitControls.js";
import { DragControls } from "../libs/CS559-Three/examples/jsm/controls/DragControls.js";
import { TransformControls } from "../libs/CS559-Three/examples/jsm/controls/TransformControls.js";

// Add renderer
/** @type {string} */ const div = "div1";
/** @type {THREE.WebGLRenderer} */ const renderer = new THREE.WebGLRenderer();
renderer.setSize(500, 500);
renderer.shadowMap.enabled = true;
document.getElementById(div).appendChild(renderer.domElement);
// Scene
/** @type {THREE.Scene} */ const scene = new THREE.Scene();
// Three cameras
/** @type {THREE.PerspectiveCamera} */ const worldCamera = new THREE.PerspectiveCamera();
worldCamera.position.set(0, 100, 200);
worldCamera.lookAt(0, 5, 0);
/** @type {THREE.PerspectiveCamera} */ const topCamera = new THREE.PerspectiveCamera();
topCamera.position.set(0, 250, 0);
topCamera.lookAt(0, 0, 0);
/** @type {THREE.PerspectiveCamera} */ const trainCamera = new THREE.PerspectiveCamera();
/** @type {THREE.PerspectiveCamera} */ let camera = worldCamera;
// Lights
/** @type {THREE.AmbientLight} */ const light = new THREE.AmbientLight("white", 0.2);
scene.add(light);
/** @type {THREE.SpotLight} */ const spotLight = new THREE.SpotLight("white", 1);
spotLight.position.set(0, 150, 0);
spotLight.castShadow = true;
scene.add(spotLight);
// Buttons and Checkboxes (Did not use the ones from InputHelper)
// Add a checkbox
function addCheckBox(name = "", initial = true, onchange = undefined) {
    /** @type {HTMLInputElement} */ const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = initial;
    if (onchange) box.onchange = onchange;
    document.getElementById(div).appendChild(box);
    document.getElementById(div).appendChild(document.createTextNode(name));
    return box;
}
// Add a button
function addButton(name = "", onchange = undefined) {
    /** @type {HTMLButtonElement} */ const box = document.createElement("button");
    box.innerHTML = name;
    if (onchange) box.onclick = onchange;
    document.getElementById(div).appendChild(box);
    return box;
}
// Add a file button
function addFile(name = "", onchange = undefined) {
    /** @type {HTMLInputElement} */ const box = document.createElement("input");
    box.type = "file";
    box.accept = "text/plain";
    if (onchange) box.onchange = onchange;
    document.getElementById(div).appendChild(document.createTextNode(name));
    document.getElementById(div).appendChild(box);
    return box;
}
// Add a dropdown menu
function addSelect(name = "", choices = [""], initial = 0, onchange = undefined) {
    /** @type {HTMLSelectElement} */ const select = document.createElement("select");
    for (let i = 0; i < choices.length; i++) {
        /** @type {HTMLOptionElement} */ const option = document.createElement("option");
        option.value = i.toString();
        option.text = choices[i];
        select.appendChild(option);
    }
    select.value = initial.toString();
    if (onchange) select.onchange = onchange;
    document.getElementById(div).appendChild(document.createTextNode(name));
    document.getElementById(div).appendChild(select);
    return select;
}
// Add a slider
function addSlider(name = "", min = 0, max = 100, initial = 50, onchange = undefined) {
    /** @type {HTMLInputElement} */ const slider = document.createElement("input");
    slider.type = "range";
    slider.min = min.toString();
    slider.max = max.toString();
    slider.step = ((max - min) / 100).toString();
    slider.value = initial.toString();
    if (onchange) slider.onchange = onchange;
    document.getElementById(div).appendChild(document.createTextNode(name));
    document.getElementById(div).appendChild(slider);
    return slider;
}
// Add a + button, number field, and a - button
function addIncrement(name = "", min = 1, max = 10, step = 1, initial = 5, onchange = undefined) {
    /** @type {HTMLButtonElement} */ const left = document.createElement("button");
    /** @type {HTMLInputElement} */ const field = document.createElement("input");
    /** @type {HTMLButtonElement} */ const right = document.createElement("button");
    field.type = "text";
    field.value = initial.toString();
    field.size = 2;
    field.readOnly = true;
    left.innerHTML = "-";
    right.innerHTML = "+";
    left.onclick = function () {
        field.value = Math.max((Number(field.value) || 0) - step, min).toFixed(step < 1 ? 2 : 0);
        onchange();
    };
    right.onclick = function () {
        field.value = Math.min((Number(field.value) || 0) + step, max).toFixed(step < 1 ? 2 : 0);
        onchange();
    };
    document.getElementById(div).appendChild(document.createTextNode(name));
    document.getElementById(div).appendChild(left);
    document.getElementById(div).appendChild(field);
    document.getElementById(div).appendChild(right);
    return field;
}
// Add a line break
function addBreak(text = "") {
    if (text) document.getElementById(div).appendChild(document.createTextNode(text));
    document.getElementById(div).appendChild(document.createElement("br"));
}
// Add the UI
addBreak();
/** @type {HTMLInputElement} */ const run = addCheckBox("Run", true, moveTrain);
/** @type {HTMLInputElement} */ const increment = addIncrement(": ", 0, 1, 0.01, 0, moveTrain);
/** @type {HTMLInputElement} */ const arcLength = addCheckBox("ArcLength", true, moveTrain);
addBreak();
/** @type {HTMLSelectElement} */ const view = addSelect("Camera : ", ["World", "Train", "Top"], 0, updateView);
addBreak();
/** @type {HTMLInputElement} */ const speed = addSlider("Speed", 0, 100, 50, moveTrain);
addBreak();
/** @type {HTMLSelectElement} */ const splineType = addSelect("Spline Type: ", ["Linear", "Cardinal Cubic", "Cubic B-Spline"], 1, moveTrack);
addBreak();
addBreak("Shift + Mouse Click to add Point ; Ctrl + Mouse Click to remove Point");
/** @type {HTMLSelectElement} */ const example = addSelect("Load Example: ", ["figure8", "loop0", "reset", "spiral", "sqiggle"], 2, loadExample);
addBreak();
addFile("Load: ", loadPoints);
addButton("Save", savePoints);
addButton("Reset", resetPoints);
addBreak();
addBreak("Use the TransformControls to rotate Point");
const trackType = addSelect("Track Type: ", ["Simple Track", "Parallel Rails", "Road Rail", "Fancy Rails"], 1, moveTrack);
addBreak();
/** @type {HTMLInputElement} */ const railTies = addCheckBox("Rail Ties", true, moveTrack);
/** @type {HTMLInputElement} */ const railTiesSimple = addCheckBox("Rail Ties Simple", false, moveTrack);
/** @type {HTMLInputElement} */ const railTiesArcLength = addCheckBox("Rail Ties ArcLength", true, moveTrack);
addBreak();
/** @type {HTMLInputElement} */ const tension = addSlider("Tension", 0, 1, 0.5, moveTrack);
addBreak();
/** @type {HTMLInputElement} */ const cars = addIncrement("Cars: ", 3, 10, 1, 5, updateTrain);
/** @type {HTMLInputElement} */ const trainHead = addCheckBox("Train", true, updateTrain);
/** @type {HTMLInputElement} */ const trainArcLength = addCheckBox("Train ArcLength", true, updateTrain);
// TransformControl
/** @type {TransformControls[]} */ const transformControls = [];
function addTransformControl(thePointMesh) {
    /** @type {TransformControls} */ const transformControl = new TransformControls(camera, renderer.domElement);
    transformControl.addEventListener('mouseDown', function (e) {
        /** @type {THREE.Mesh} */ (transformControl.object).material = thePointsMaterialHighlight;
        orbitControls.enabled = false;
    });
    transformControl.addEventListener('mouseUp', function (e) {
        /** @type {THREE.Mesh} */ (transformControl.object).material = thePointsMaterial;
        orbitControls.enabled = true;
        moveTrack();
    });
    transformControl.attach(thePointMesh);
    transformControl.setMode("rotate");
    transformControl.setSize(0.35);
    transformControls.push(transformControl);
    scene.add(transformControl);
}
// Initial Drawing
/** @type {number} */ const planeSize = 200;
/** @type {number} */ const trainSize = 15;
/** @type {number} */ const trackSize = 1;
/** @type {THREE.Mesh[]} */ const thePointsMesh = [];
/** @type {THREE.Vector3[]} */ let thePoints = [[50, 5, 0], [0, 5, 50], [-50, 5, 0], [0, 5, -50], [25, 5, -25]].map(p => new THREE.Vector3(...p));
/** @type {number} */ const pointSize = 2.5;
/** @type {THREE.LatheGeometry} */ const pointGeometry = new THREE.LatheGeometry([new THREE.Vector2(pointSize, 0), new THREE.Vector2(pointSize, pointSize), new THREE.Vector2(0, 2 * pointSize)], 4);
/** @type {THREE.MeshPhongMaterial} */ const thePointsMaterial = new THREE.MeshPhongMaterial({ color: "red" });
/** @type {THREE.MeshPhongMaterial} */ const thePointsMaterialHighlight = new THREE.MeshPhongMaterial({ color: "blue" });
// Draw one point
function drawPoint(p = new THREE.Vector3()) {
    /** @type {THREE.Mesh} */ const boxMesh = new THREE.Mesh(pointGeometry, thePointsMaterial);
    boxMesh.position.copy(p);
    thePointsMesh.push(boxMesh);
    addTransformControl(boxMesh);
    scene.add(boxMesh);
}
// Draw all points
function drawPoints() {
    /** @type {number} */ let i = thePointsMesh.length - 1;
    while (i >= 0) {
        transformControls[i].detach();
        transformControls[i].dispose();
        transformControls.splice(i, 1);
        scene.remove(thePointsMesh[i]);
        thePointsMesh.splice(i, 1);
        i--;
    }
    thePoints.forEach(p => drawPoint(p));
}
drawPoints();
/** @type {THREE.Group} */ let track = new THREE.Group();
// Use a CatmullRom curve to approximate a B-Spline
function bSplineToCatmullRom(points = thePoints, i = 0) {
    return ["x", "y", "z"].map(c => 1 / 6 * (points[i][c] + points[(i + 1) % points.length][c] * 4 + points[(i + 2) % points.length][c]));
}
// Create a CatmullRom curve based on a list of points
function createCurve(points = thePoints) {
    /** @type {THREE.CatmullRomCurve3} */ let curve = null;
    // Lines are CatmullRom curve with tension 0
    if (splineType.value == "0") curve = new THREE.CatmullRomCurve3(points, true, "catmullrom", 0.0);
    // CatmullRom
    else if (splineType.value == "1") curve = new THREE.CatmullRomCurve3(points, true, "catmullrom", Number(tension.value));
    // B-Spline approximated by CatmullRom (see the Train! Workbook for the exact B-Spline control points)
    else if (splineType.value == "2") {
        const b_points = points.map((_, i) => new THREE.Vector3(...bSplineToCatmullRom(points, i)));
        curve = new THREE.CatmullRomCurve3(b_points, true, "catmullrom", Number(tension.value));
    }
    return curve;
}
/** @type {THREE.CatmullRomCurve3} */ let trackCurve = createCurve();
// Find the offset point
function offsetPoint(pu = 0, offset = 0) {
    /** @type {THREE.Vector3} */ const point = new THREE.Vector3(0, 0, 0);
    point.crossVectors(trackCurve.getTangentAt(pu), getAngleAt(pu));
    point.normalize();
    point.multiplyScalar(offset * trainSize);
    point.add(trackCurve.getPointAt(pu));
    return point;
}
// Create the offset curve (an approximation using CatmullRom)
function offsetCurve(offset = 0) {
    /** @type {THREE.Vector3[]} */ const newTrack = [];
    /** @type {number} */ const incrementTrack = 1 / trackCurve.getLength();
    for (let i = 0; i < 1; i += incrementTrack) {
        newTrack.push(offsetPoint(i, offset));
    }
    return createCurve(newTrack);
}
// Get the angle at arc-length parameter pu on the track
function getAngleAt(pu = 0) {
    /** @type {number} */ const param = trackCurve.getUtoTmapping(pu, 0) * thePoints.length;
    return getAngleGeneral(param);
}
// Get the angle at parameter pu on the track
function getAngle(pu = 0) {
    /** @type {number} */ const param = pu * thePoints.length;
    return getAngleGeneral(param);
}
// Get the angle from the point on the track
function getAngleGeneral(param = 0) {
    /** @type {number} */ const current = Math.floor(param);
    /** @type {number} */ const next = (current + 1) % thePoints.length;
    /** @type {THREE.Vector3} */ const d0 = new THREE.Vector3(0, 1, 0);
    d0.applyEuler(thePointsMesh[current].rotation);
    /** @type {THREE.Vector3} */ const d1 = new THREE.Vector3(0, 1, 0);
    d1.applyEuler(thePointsMesh[next].rotation);
    /** @type {THREE.Vector3} */ const du = new THREE.Vector3(0, 1, 0);
    du.lerpVectors(d0, d1, param - current);
    return du;
}
// Draw the track
function drawTrack() {
    /** @type {THREE.Group} */ const trackGroup = new THREE.Group();
    /** @type {number} */ const totalLengthSeg = Math.round(trackCurve.getLength());
    // Single track
    if (trackType.value == "0") {
        /** @type {THREE.TubeGeometry} */ const trackGeometry = new THREE.TubeGeometry(trackCurve, totalLengthSeg, trackSize);
        /** @type {THREE.MeshPhongMaterial} */ const trackMaterial = new THREE.MeshPhongMaterial({ color: "burlywood" });
        /** @type {THREE.Mesh} */ const trackMesh = new THREE.Mesh(trackGeometry, trackMaterial);
        trackGroup.add(trackMesh);
    }
    // Double track
    else if (trackType.value == "1") {
        /** @type {THREE.MeshPhongMaterial} */ const trackMaterial = new THREE.MeshPhongMaterial({ color: "burlywood" });
        /** @type {THREE.CatmullRomCurve3} */ const outerTrack = offsetCurve(0.45);
        /** @type {THREE.TubeGeometry} */ const outerTrackGeometry = new THREE.TubeGeometry(outerTrack, totalLengthSeg, trackSize);
        /** @type {THREE.Mesh} */ const outerTrackMesh = new THREE.Mesh(outerTrackGeometry, trackMaterial);
        /** @type {THREE.CatmullRomCurve3} */ const innerTrack = offsetCurve(-0.45);
        /** @type {THREE.TubeGeometry} */ const innerTrackGeometry = new THREE.TubeGeometry(innerTrack, totalLengthSeg, trackSize);
        /** @type {THREE.Mesh} */ const innerTrackMesh = new THREE.Mesh(innerTrackGeometry, trackMaterial);
        trackGroup.add(outerTrackMesh, innerTrackMesh);
    }
    // Road track (made using a list of triangles)
    else if (trackType.value == "2") {
        /** @type {THREE.MeshPhongMaterial} */ const trackMaterial = new THREE.MeshPhongMaterial({ color: "burlywood", side: THREE.DoubleSide });
        /** @type {THREE.BufferGeometry} */ const trackGeometry = new THREE.BufferGeometry();
        /** @type {number} */ const incrementTrack = 1 / trackCurve.getLength() * 2;
        /** @type {number[]} */ const list = [];
        /** @type {THREE.Vector3} */ let previousOuter;
        /** @type {THREE.Vector3} */ let previousInner;
        for (let pu = 0; pu < 1 + incrementTrack; pu += incrementTrack) {
            /** @type {THREE.Vector3} */ const outer = offsetPoint(pu > 1 ? 0 : pu, 0.5);
            /** @type {THREE.Vector3} */ const inner = offsetPoint(pu > 1 ? 0 : pu, -0.5);
            if (previousOuter && previousInner) {
                list.push(outer.x, outer.y, outer.z);
                list.push(inner.x, inner.y, inner.z);
                list.push(previousInner.x, previousInner.y, previousInner.z);
                list.push(outer.x, outer.y, outer.z);
                list.push(previousInner.x, previousInner.y, previousInner.z);
                list.push(previousOuter.x, previousOuter.y, previousOuter.z);
            }
            previousOuter = outer;
            previousInner = inner;
        }
        /** @type {Float32Array} */ const vertices = new Float32Array(list);
        trackGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
        trackGeometry.computeVertexNormals();
        /** @type {THREE.Mesh} */ const trackMesh = new THREE.Mesh(trackGeometry, trackMaterial);
        trackGroup.add(trackMesh);
    }
    // Fancy (spheres) track
    else if (trackType.value == "3") {
        /** @type {THREE.MeshPhongMaterial} */ const trackMaterial = new THREE.MeshPhongMaterial({ color: "lime" });
        /** @type {THREE.SphereGeometry} */ const trackGeometry = new THREE.SphereGeometry(trackSize);
        /** @type {number} */ const incrementTrack = 1 / trackCurve.getLength() * 5;
        for (let pu = 0; pu < 1; pu += incrementTrack) {
            /** @type {THREE.Mesh} */ const trackMesh = new THREE.Mesh(trackGeometry, trackMaterial);
            trackMesh.position.copy(trackCurve.getPointAt(pu));
            trackGroup.add(trackMesh);
        }
    }
    // Rail ties
    if (railTies.checked && trackType.value != "2") {
        /** @type {THREE.TubeGeometry|THREE.BoxGeometry} */ let tieGeometry;
        if (railTiesSimple.checked) tieGeometry = new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(-0.5 * trainSize, 0, 0), new THREE.Vector3(0.5 * trainSize, 0, 0)), 64, trackSize);
        else tieGeometry = new THREE.BoxGeometry(trainSize, trackSize * 2, trackSize * 4);
        /** @type {THREE.MeshPhongMaterial} */ const tieMaterial = new THREE.MeshPhongMaterial({ color: "burlywood" });
        /** @type {THREE.Mesh[]} */ const tieMesh = [];
        /** @type {number} */ const incrementRail = 1 / trackCurve.getLength() * 15;
        for (let pu = 0; pu < 1 - incrementRail; pu += incrementRail) {
            /** @type {THREE.Mesh} */ const currentTieMesh = new THREE.Mesh(tieGeometry, tieMaterial);
            /** @type {THREE.Vector3} */ let currentPosition;
            /** @type {THREE.Vector3} */ let currentUp;
            /** @type {THREE.Vector3} */ let currentTangent;
            // Equally spaced ties
            if (railTiesArcLength.checked) {
                currentPosition = trackCurve.getPointAt(pu);
                currentUp = getAngleAt(pu);
                currentTangent = trackCurve.getTangentAt(pu);
            }
            // Unequally spaced ties
            else {
                currentPosition = trackCurve.getPoint(pu);
                currentUp = getAngle(pu);
                currentTangent = trackCurve.getTangent(pu);
            }
            currentTieMesh.position.copy(currentPosition);
            currentTieMesh.up = currentUp;
            currentTieMesh.lookAt(currentPosition.add(currentTangent));
            tieMesh.push(currentTieMesh);
        }
        trackGroup.add(...tieMesh);
    }
    trackGroup.traverse(c => c.castShadow = true);
    return trackGroup;
}
track = drawTrack();
scene.add(track);
/** @type {THREE.Group[]} */ const carts = [];
//const wheels = [];
// Draw one cart
function drawCart(cart = 0) {
    /** @type {THREE.Group} */ const trainGroup = new THREE.Group();
    // The first train cart
    if (cart == 0) {
        /** @type {THREE.BoxGeometry} */ const trainBodyGeometry = new THREE.BoxGeometry(0.5 * trainSize, 0.5 * trainSize, 1.5 * trainSize);
        /** @type {THREE.BoxGeometry} */ const trainTopGeometry = new THREE.BoxGeometry(0.5 * trainSize, 0.25 * trainSize, 0.5 * trainSize);
        /** @type {THREE.ConeGeometry} */ const trainChimneyGeometry = new THREE.ConeGeometry(0.25 * trainSize, 0.5 * trainSize, 4);
        /** @type {THREE.CylinderGeometry} */ const trainWheelGeometry = new THREE.CylinderGeometry(0.2 * trainSize, 0.2 * trainSize, 0.1 * trainSize);
        /** @type {THREE.MeshPhongMaterial} */ const trainMaterial = new THREE.MeshPhongMaterial({ color: "blue" });
        /** @type {THREE.MeshPhongMaterial} */ const trainWheelMaterial = new THREE.MeshPhongMaterial({ color: "black" });
        /** @type {THREE.Mesh} */ const trainBodyMesh = new THREE.Mesh(trainBodyGeometry, trainMaterial);
        /** @type {THREE.Mesh} */ const trainTopMesh = new THREE.Mesh(trainTopGeometry, trainMaterial);
        /** @type {THREE.Mesh} */ const trainChimneyMesh = new THREE.Mesh(trainChimneyGeometry, trainMaterial);
        /** @type {THREE.Mesh[]} */ const trainWheelMesh = [];
        for (let i = 0; i < 3; i++) {
            for (let j = -1; j <= 1; j += 2) {
                /** @type {THREE.Mesh} */ const currentTrainWheelMesh = new THREE.Mesh(trainWheelGeometry, trainWheelMaterial);
                currentTrainWheelMesh.position.set(0.25 * trainSize * j, 0.2 * trainSize + trackSize, 0.5 * trainSize * (i - 1));
                currentTrainWheelMesh.rotateZ(Math.PI / 2);
                trainWheelMesh.push(currentTrainWheelMesh);
                //wheels.push(currentTrainWheelMesh);
            }
        }
        trainBodyMesh.position.set(0, 0.45 * trainSize + trackSize, 0);
        trainTopMesh.position.set(0, 0.825 * trainSize + trackSize, -0.5 * trainSize);
        trainChimneyMesh.position.set(0, 0.825 * trainSize + trackSize, 0.5 * trainSize);
        trainChimneyMesh.rotateX(Math.PI);
        trainGroup.add(trainBodyMesh);
        trainGroup.add(trainTopMesh);
        trainGroup.add(trainChimneyMesh);
        trainGroup.add(...trainWheelMesh);
    }
    // Later train carts
    else if (cart > 0) {
        /** @type {THREE.BoxGeometry} */ const trainBodyGeometry = new THREE.BoxGeometry(0.5 * trainSize, 0.5 * trainSize, 1 * trainSize);
        /** @type {THREE.CylinderGeometry} */ const trainWheelGeometry = new THREE.CylinderGeometry(0.2 * trainSize, 0.2 * trainSize, 0.1 * trainSize);
        /** @type {THREE.MeshPhongMaterial} */ const trainMaterial = new THREE.MeshPhongMaterial({ color: "white" });
        /** @type {THREE.MeshPhongMaterial} */ const trainWheelMaterial = new THREE.MeshPhongMaterial({ color: "black" });
        /** @type {THREE.Mesh} */ const trainBodyMesh = new THREE.Mesh(trainBodyGeometry, trainMaterial);
        /** @type {THREE.Mesh[]} */ const trainWheelMesh = [];
        for (let i = -1; i < 2; i += 2) {
            for (let j = -1; j <= 1; j += 2) {
                /** @type {THREE.Mesh} */ const currentTrainWheelMesh = new THREE.Mesh(trainWheelGeometry, trainWheelMaterial);
                currentTrainWheelMesh.position.set(0.25 * trainSize * j, 0.2 * trainSize + trackSize, 0.5 * trainSize * i);
                currentTrainWheelMesh.rotateZ(Math.PI / 2);
                trainWheelMesh.push(currentTrainWheelMesh);
                //wheels.push(currentTrainWheelMesh);
            }
        }
        trainBodyMesh.position.set(0, 0.45 * trainSize + trackSize, 0);
        trainGroup.add(trainBodyMesh);
        trainGroup.add(...trainWheelMesh);
    }
    // If train head is not checked
    else {
        /** @type {THREE.BoxGeometry} */ const trainBodyGeometry = new THREE.BoxGeometry(0.5 * trainSize, 0.5 * trainSize, 1 * trainSize);
        /** @type {THREE.BoxGeometry} */ const trainTopGeometry = new THREE.BoxGeometry(0.5 * trainSize, 0.125 * trainSize, 0.5 * trainSize);
        /** @type {THREE.CylinderGeometry} */ const trainWheelGeometry = new THREE.CylinderGeometry(0.2 * trainSize, 0.2 * trainSize, 0.1 * trainSize);
        /** @type {THREE.MeshPhongMaterial} */ const trainMaterial = new THREE.MeshPhongMaterial({ color: "red" });
        /** @type {THREE.MeshPhongMaterial} */ const trainWheelMaterial = new THREE.MeshPhongMaterial({ color: "black" });
        /** @type {THREE.Mesh} */ const trainBodyMesh = new THREE.Mesh(trainBodyGeometry, trainMaterial);
        /** @type {THREE.Mesh} */ const trainTopMesh = new THREE.Mesh(trainTopGeometry, trainMaterial);
        /** @type {THREE.Mesh[]} */ const trainWheelMesh = [];
        for (let i = -1; i < 2; i += 2) {
            for (let j = -1; j <= 1; j += 2) {
                /** @type {THREE.Mesh} */ const currentTrainWheelMesh = new THREE.Mesh(trainWheelGeometry, trainWheelMaterial);
                currentTrainWheelMesh.position.set(0.25 * trainSize * j, 0.2 * trainSize + trackSize, 0.5 * trainSize * i);
                currentTrainWheelMesh.rotateZ(Math.PI / 2);
                trainWheelMesh.push(currentTrainWheelMesh);
                //wheels.push(currentTrainWheelMesh);
            }
        }
        trainBodyMesh.position.set(0, 0.45 * trainSize + trackSize, 0);
        trainTopMesh.position.set(0, 0.7625 * trainSize + trackSize, 0);
        trainGroup.add(trainBodyMesh);
        trainGroup.add(trainTopMesh);
        trainGroup.add(...trainWheelMesh);
    }
    trainGroup.traverse(c => c.castShadow = true);
    return trainGroup;
}
// Draw the train 
function drawTrain() {
    /** @type {THREE.Group} */ const trainGroup = new THREE.Group();
    /** @type {number} */ const nCart = Number(cars.value);
    /** @type {THREE.Group} */ let cart;
    if (trainHead.checked) cart = drawCart(0);
    else cart = drawCart(1);
    cart.add(trainCamera);
    trainCamera.rotateY(Math.PI);
    trainCamera.translateY(0.5 * trainSize);
    trainCamera.translateZ(-0.5 * trainSize);
    trainGroup.add(cart);
    carts.push(cart);
    for (let i = 1; i < nCart - 1; i++) {
        cart = drawCart(i);
        trainGroup.add(cart);
        carts.push(cart);
    }
    if (trainHead.checked) cart = drawCart(-1);
    else cart = drawCart(1);
    trainGroup.add(cart);
    carts.push(cart);
    return trainGroup;
}
/** @type {THREE.Group} */ const train = drawTrain();
scene.add(train);
// Draw the ground plane
function drawPlane() {
    /** @type {THREE.Group} */ const groundGroup = new THREE.Group();
    /** @type {number} */ const segments = 10;
    /** @type {THREE.PlaneGeometry} */ const groundGeometry = new THREE.PlaneGeometry(planeSize, planeSize, segments, segments);
    /** @type {THREE.MeshPhongMaterial} */ const materialEven = new THREE.MeshPhongMaterial({ color: "lightgray" });
    /** @type {THREE.MeshPhongMaterial} */ const materialOdd = new THREE.MeshPhongMaterial({ color: "gray" });
    materialEven.side = THREE.DoubleSide;
    materialOdd.side = THREE.DoubleSide;
    /** @type {THREE.MeshPhongMaterial[]} */ const materials = [materialEven, materialOdd];
    for (let x = 0; x < segments; x++) {
        for (let y = 0; y < segments; y++) {
            const i = 2 * (x * segments + y);
            groundGeometry.faces[i].materialIndex = groundGeometry.faces[i + 1].materialIndex = (x + y) % 2;
        }
    }
    /** @type {THREE.Mesh} */ const groundMesh = new THREE.Mesh(groundGeometry, materials);
    groundMesh.rotateX(-Math.PI / 2);
    groundMesh.receiveShadow = true;
    groundGroup.add(groundMesh);
    return groundGroup;
}
/** @type {THREE.Group} */ const ground = drawPlane();
scene.add(ground);
// Updates
/** @type {number} */ let u = 0;
// Move the track (i.e. change the geometry of the track)
function moveTrack() {
    thePoints = thePointsMesh.map(p => p.position);
    track.children.length = 0;
    trackCurve = createCurve();
    track.copy(drawTrack());
}
// Update thr controls
function updateView() {
    // World Camera
    if (view.value == "0") {
        camera = worldCamera;
        orbitControls.enabled = true;
        dragControls.enabled = true;
        transformControls.forEach(t => t.enabled = true);
    }
    // Train or Top Camera (disable all controls)
    else {
        camera = view.value == "1" ? trainCamera : topCamera;
        orbitControls.enabled = false;
        dragControls.enabled = false;
        transformControls.forEach(t => t.enabled = false);
    }
}
// Load a preset example
function loadExample() {
    /** @type {string} */ let file = "";
    if (example.value == "0") file = "8\n" +
        "6.45518 30.1941 -1.16114 0 1 0\n" +
        "54.5809 5 68.5436 0 1 0\n" +
        "94.922 5 -0.220045 0 1 0\n" +
        "72.8257 5 -60.8922 0 1 0\n" +
        "6.60905 5 -0.796328 0 1 0\n" +
        "-40.4197 5 68.9679 0 1 0\n" +
        "-91.0671 5 -4.40602 0 1 0\n" +
        "-46.5688 5 -64.7076 0 1 0";
    else if (example.value == "2") file = "\n" +
        "50 5 0 0 1 \n" +
        "0 5 50 0 1 0\n" +
        "-50 5 0 0 1 \n" +
        "0 5 -50 0 1 0";
    else if (example.value == "3") file = "25\n" +
        "-100	5	-50\n" +
        "-50	13	-100\n" +
        "0	21	-50\n" +
        "-50	29	0\n" +
        "-100	37	-50\n" +
        "-50	45	-100\n" +
        "0	53	-50\n" +
        "-50	61	0\n" +
        "-100	69	-50\n" +
        "-50	77	-100\n" +
        "0	85	-50\n" +
        "-50	93	0\n" +
        "-100	93	50\n" +
        "-50	93	100\n" +
        "0	85	50\n" +
        "-50	77	0\n" +
        "-100	69	50\n" +
        "-50	61	100\n" +
        "0	53	50\n" +
        "-50	45	0\n" +
        "-100	37	50\n" +
        "-50	29	100\n" +
        "0	21	50\n" +
        "-50	13	0";
    else if (example.value == "4") file = "9\n" +
        "97.9332 13.0475 -3.72687 0 1 0\n" +
        "70.2915 14.9594 71.127 0 0.707107 -0.707107\n" +
        "41.6882 13.7145 23.2595 0 0.707107 0.707107\n" +
        "7.32237 12.4695 71.1804 0 0.707107 -0.707107\n" +
        "-33.9496 9.9797 1.94439 0 0.707107 0.707107\n" +
        "-67.8405 5 58.5512 0 0.707107 -0.707107\n" +
        "-91.7602 5 -56.7403 0 1 0\n" +
        "-39.5639 5 -82.2834 0 1 0\n" +
        "69.9173 11.1356 -56.4903 0 1 0";
    else if (example.value == "1") file = "4\n" +
        "5.48518 51.1615 -3.1877 0 -1 0\n" +
        "0 23.8452 50.0442 0 0 -1\n" +
        "-7.38143 5 -3.98022 0 1 0\n" +
        "-2.52079 19.1453 -44.242 0 0 1";
    loadText(file);
}
// Load the text file
function loadText(file = "") {
    /** @type {string[]} */ let list = file.split("\n");
    list.splice(0, 1);
    while (list[list.length - 1].trim() == "") list.splice(list.length - 1);
    /** @type {string[][]} */const doubleList = list.map(l => l.indexOf("\t") >= 0 ? l.split("\t") : l.split(" "));
    try {
        thePoints = doubleList.map(l => new THREE.Vector3(Number(l[0]), Number(l[1]), Number(l[2])));
        drawPoints();
        thePointsMesh.forEach((p, i) => p.lookAt(Number(doubleList[i][0]) + Number(doubleList[i][3] || 0), Number(doubleList[i][1]) + Number(doubleList[i][4] || 1), Number(doubleList[i][2]) + Number(doubleList[i][5] || 0)));
        thePointsMesh.forEach(p => p.rotateX(Math.PI / 2));
        moveTrack();
    }
    catch (error) {
        resetPoints();
    }
}
// Load the points from a file
function loadPoints(event) {
    /** @type {object} */ const input = event.target;
    /** @type {FileReader} */ const reader = new FileReader();
    reader.onload = function () {
        loadText(reader.result.toString());
    };
    reader.readAsText(input.files[0]);
}
// Save the points to a text file
function savePoints() {
    /** @type {THREE.Vector3[]} */ const rot = thePointsMesh.map(() => new THREE.Vector3(0, 1, 0));
    rot.forEach((r, i) => r.applyEuler(thePointsMesh[i].rotation));
    /** @type {string} */ const list = thePoints.reduce((s, p, i) => s + p.x + "\t" + p.y + "\t" + p.z + "\t" + parseFloat(rot[i].x.toFixed(2)) + "\t" + parseFloat(rot[i].y.toFixed(2)) + "\t" + parseFloat(rot[i].z.toFixed(2)) + "\n", "");
    /** @type {HTMLAnchorElement} */ const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(list));
    element.setAttribute('download', "track.txt");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
// Reset the points
function resetPoints() {
    thePoints = [[50, 5, 0], [0, 5, 50], [-50, 5, 0], [0, 5, -50]].map(p => new THREE.Vector3(...p));
    drawPoints();
    moveTrack();
}
// Change the geometry of the train
function updateTrain() {
    train.children.length = 0;
    carts.length = 0;
    /** @type {THREE.Group} */ const group = drawTrain();
    train.add(...group.children);
    moveTrain();
}
// Move the train
function moveTrain() {
    if (!run.checked) u = Number(increment.value);
    else increment.value = u.toFixed(2);
    /** @type {number} */ let u0 = 0;
    // No arc-length
    if (!arcLength.checked) {
        let min = 1;
        let cur = 0;
        for (let t = 0; t < 1; t += 0.01) {
            cur = Math.abs(trackCurve.getUtoTmapping(t, 0) - u);
            if (cur < min) {
                min = cur;
                u0 = t;
            }
        }
    }
    else u0 = u;
    // Arc-length
    /** @type {number} */ const totalLength = trackCurve.getLength();
    for (let i = 0; i < carts.length; i++) {
        let up = (u0 - ((trainSize * 1.4) * i / totalLength) + 1) % 1;
        if (i > 0) up = (up - (trainSize * 0.125) / totalLength + 1) % 1;
        const pup = trainArcLength.checked ? trackCurve.getPointAt(up) : trackCurve.getPoint(up);
        const aup = trainArcLength.checked ? getAngleAt(up) : getAngle(up);
        const tup = trainArcLength.checked ? trackCurve.getTangentAt(up) : trackCurve.getTangent(up);
        carts[i].position.copy(pup);
        carts[i].up = aup;
        carts[i].lookAt(pup.add(tup));
    }
    /** @type {number} */ const du = Number(speed.value);
    u = (u + du / totalLength / 30) % 1;
}
// OrbitControl
/** @type {OrbitControls} */ const orbitControls = new OrbitControls(camera, renderer.domElement);
// DragControl
/** @type {DragControls} */ const dragControls = new DragControls(thePointsMesh, camera, renderer.domElement);
dragControls.addEventListener('hoveron', function (e) {
    if (dragControls.enabled) {
        e.object.material = thePointsMaterialHighlight;
        transformControls.forEach(t => t.enabled = false);
    }
});
dragControls.addEventListener('hoveroff', function (e) {
    if (dragControls.enabled) {
        e.object.material = thePointsMaterial;
        transformControls.forEach(t => t.enabled = true);
    }
});
dragControls.addEventListener('dragstart', function (e) {
    orbitControls.enabled = false;
    transformControls.forEach(t => t.enabled = false);
    // Remove a point
    if (ctrlKey && thePointsMesh.length > 1) {
        /** @type {THREE.Vector3} */ const pos = e.object.position;
        /** @type {number} */ let i = thePointsMesh.length - 1;
        while (i >= 0) {
            if (thePointsMesh[i].position.equals(pos)) {
                transformControls[i].detach();
                transformControls[i].dispose();
                transformControls.splice(i, 1);
                thePointsMesh.splice(i, 1);
            }
            i--;
        }
        scene.remove(e.object);
        moveTrack();
    }
    else e.object.material = thePointsMaterialHighlight;
});
dragControls.addEventListener('drag', function (e) {
    moveTrack();
});
dragControls.addEventListener('dragend', function (e) {
    orbitControls.enabled = true;
    transformControls.forEach(t => t.enabled = true);
    e.object.material = thePointsMaterial;
});
// Key and Mouse
/** @type {boolean} */ let ctrlKey = false;
/** @type {boolean} */ let shiftKey = false;
document.addEventListener("keydown", function (e) {
    if (e.ctrlKey) ctrlKey = true;
    if (e.shiftKey) shiftKey = true;
});
document.addEventListener("keyup", function (e) {
    ctrlKey = false;
    shiftKey = false;
});
document.addEventListener("mousedown", function (e) {
    // Add a point
    if (shiftKey && view.value == "0") {
        /** @type {THREE.Vector3} */ const mouse = new THREE.Vector3(0, 0, 0.5);
        mouse.x = (e.offsetX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = - (e.offsetY / renderer.domElement.clientHeight) * 2 + 1;
        mouse.unproject(camera);
        mouse.sub(camera.position).normalize();
        /** @type {number} */ const distance = (5 - camera.position.y) / mouse.y;
        /** @type {THREE.Vector3} */ const intersection = new THREE.Vector3(0, 0, 0);
        intersection.copy(camera.position).add(mouse.multiplyScalar(distance));
        drawPoint(intersection);
        moveTrack();
    }
});
// Animation Loop
function draw() {
    if (run.checked) moveTrain();
    renderer.render(scene, camera);
    window.requestAnimationFrame(draw);
}
draw();
