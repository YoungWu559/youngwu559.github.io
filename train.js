/**
 * A simple JavaScript file that gets loaded with Workbook (CS559).
 *
 * written by Young Wu, 2020
 */

/* jshint -W069, esversion:6 */

import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";
import { DragControls } from "./DragControls.js";
import { TransformControls } from "./TransformControls.js";
import { BufferGeometryUtils } from "./BufferGeometryUtils.js";

window.onload = function () {
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(500, 500);
    renderer.shadowMap.enabled = true;
    document.getElementById("div1").appendChild(renderer.domElement);
    // Scene and Lights
    let scene = new THREE.Scene();
    let worldCamera = new THREE.PerspectiveCamera();
    worldCamera.position.set(0, 100, 200);
    worldCamera.lookAt(0, 5, 0);
    let topCamera = new THREE.PerspectiveCamera();
    topCamera.position.set(0, 250, 0);
    topCamera.lookAt(0, 0, 0);
    let trainCamera = new THREE.PerspectiveCamera();
    let camera = worldCamera;
    let light = new THREE.AmbientLight("white", 0.2);
    scene.add(light);
    let spotLight = new THREE.SpotLight("white", 1);
    spotLight.position.set(0, 150, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);
    // Buttons and Checkboxes
    function addCheckBox(name = "", initial = true, onchange = undefined) {
        let box = document.createElement("input");
        box.type = "checkbox";
        box.checked = initial;
        if (onchange) box.onchange = onchange;
        document.getElementById("div1").appendChild(box);
        document.getElementById("div1").appendChild(document.createTextNode(name));
        return box;
    }
    function addButton(name = "", onchange = undefined) {
        let box = document.createElement("button");
        box.innerHTML = name;
        if (onchange) box.onclick = onchange;
        document.getElementById("div1").appendChild(box);
        return box;
    }
    function addFile(name = "", onchange = undefined) {
        let box = document.createElement("input");
        box.type = "file";
        box.accept = "text/plain";
        if (onchange) box.onchange = onchange;
        document.getElementById("div1").appendChild(document.createTextNode(name));
        document.getElementById("div1").appendChild(box);
        return box;
    }
    function addSelect(name = "", choices = [""], initial = 0, onchange = undefined) {
        let select = document.createElement("select");
        for (let i = 0; i < choices.length; i++) {
            let option = document.createElement("option");
            option.value = i;
            option.text = choices[i];
            select.appendChild(option);
        }
        select.value = initial;
        if (onchange) select.onchange = onchange;
        document.getElementById("div1").appendChild(document.createTextNode(name));
        document.getElementById("div1").appendChild(select);
        return select;
    }
    function addSlider(name = "", min = 0, max = 100, initial = 50, onchange = undefined) {
        let slider = document.createElement("input");
        slider.type = "range";
        slider.min = min;
        slider.max = max;
        slider.step = (max - min) / 100;
        slider.value = initial;
        if (onchange) slider.onchange = onchange;
        document.getElementById("div1").appendChild(document.createTextNode(name));
        document.getElementById("div1").appendChild(slider);
        return slider;
    }
    function addIncrement(name = "", min = 1, max = 10, step = 1, initial = 5, onchange = undefined) {
        let left = document.createElement("button");
        let field = document.createElement("input");
        let right = document.createElement("button");
        field.type = "text";
        field.value = initial;
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
        document.getElementById("div1").appendChild(document.createTextNode(name));
        document.getElementById("div1").appendChild(left);
        document.getElementById("div1").appendChild(field);
        document.getElementById("div1").appendChild(right);
        return field;
    }
    function addBreak(text = "") {
        if (text) document.getElementById("div1").appendChild(document.createTextNode(text));
        document.getElementById("div1").appendChild(document.createElement("br"));
    }
    addBreak();
    let run = addCheckBox("Run", true, moveTrain);
    let increment = addIncrement(": ", 0, 1, 0.01, 0, moveTrain);
    let arcLength = addCheckBox("ArcLength", true, moveTrain);
    addBreak();
    let view = addSelect("Camera : ", ["World", "Train", "Top"], 0, updateView);
    addBreak();
    let speed = addSlider("Speed", 0, 100, 50, moveTrain);
    addBreak();
    let splineType = addSelect("Spline Type: ", ["Linear", "Cardinal Cubic", "Cubic B-Spline"], 1, moveTrack);
    addBreak();
    addBreak("Shift + Mouse Click to add Point ; Ctrl + Mouse Click to remove Point");
    let example = addSelect("Load Example: ", ["figure8", "loop0", "reset", "spiral", "sqiggle"], 2, loadExample);
    addBreak();
    addFile("Load: ", loadPoints);
    addButton("Save", savePoints);
    addButton("Reset", resetPoints);
    addBreak();
    addBreak("Use the TransformControls to rotate Point");
    let trackType = addSelect("Track Type: ", ["Simple Track", "Parallel Rails", "Road Rail", "Fancy Rails"], 1, moveTrack);
    addBreak();
    let railTies = addCheckBox("Rail Ties", true, moveTrack);
    let railTiesSimple = addCheckBox("Rail Ties Simple", false, moveTrack);
    let railTiesArcLength = addCheckBox("Rail Ties ArcLength", true, moveTrack);
    addBreak();
    let tension = addSlider("Tension", 0, 1, 0.5, moveTrack);
    addBreak();
    let cars = addIncrement("Cars: ", 3, 10, 1, 5, updateTrain);
    let trainHead = addCheckBox("Train", true, updateTrain);
    let trainArcLength = addCheckBox("Train ArcLength", true, updateTrain);
    // TransformControl
    let transformControls = [];
    function addTransformControl(thePointMesh) {
        let transformControl = new TransformControls(camera, renderer.domElement);
        transformControl.addEventListener('mouseDown', function (e) {
            transformControl.object.material = thePointsMaterialHighlight;
            orbitControls.enabled = false;
        });
        transformControl.addEventListener('mouseUp', function (e) {
            transformControl.object.material = thePointsMaterial;
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
    let planeSize = 200;
    let trainSize = 15;
    let trackSize = 1;
    let thePointsMesh = [];
    let thePoints = [[50, 5, 0], [0, 5, 50], [-50, 5, 0], [0, 5, -50], [25, 5, -25]].map(p => new THREE.Vector3(...p));
    let pointSize = 5;
    let boxGeometry = new THREE.BoxBufferGeometry(pointSize, pointSize, pointSize);
    let pyramidGeometry = new THREE.ConeBufferGeometry(pointSize / Math.SQRT2, pointSize, 4);
    pyramidGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, pointSize, 0));
    pyramidGeometry.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI / 4));
    let pointGeometry = BufferGeometryUtils.mergeBufferGeometries([boxGeometry, pyramidGeometry]);
    let thePointsMaterial = new THREE.MeshPhongMaterial({ color: "red" });
    let thePointsMaterialHighlight = new THREE.MeshPhongMaterial({ color: "blue" });
    function drawPoint(p) {
        let boxMesh = new THREE.Mesh(pointGeometry, thePointsMaterial);
        boxMesh.position.copy(p);
        thePointsMesh.push(boxMesh);
        addTransformControl(boxMesh);
        scene.add(boxMesh);
    }
    function drawPoints() {
        let i = thePointsMesh.length - 1;
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
    let track = new THREE.Group();
    function bSplineToCatmullRom(points = thePoints, i = 0) {
        return ["x", "y", "z"].map(c => 1 / 6 * (points[i][c] + points[(i + 1) % points.length][c] * 4 + points[(i + 2) % points.length][c]));
    }
    function createCurve(points = thePoints) {
        let curve = null;
        if (splineType.value == "0") {
            curve = new THREE.CurvePath();
            for (let i = 0; i < points.length; i++) curve.add(new THREE.LineCurve3(points[i], points[(i + 1) % points.length]));
            curve.updateArcLengths();
        }
        else if (splineType.value == "1") curve = new THREE.CatmullRomCurve3(points, true, "catmullrom", tension.value);
        else if (splineType.value == "2") {
            let b_points = points.map((_, i) => new THREE.Vector3(...bSplineToCatmullRom(points, i)));
            curve = new THREE.CatmullRomCurve3(b_points, true, "catmullrom", tension.value);
        }
        return curve;
    }
    let trackCurve = createCurve();
    function offsetPoint(pu = 0, offset = 0) {
        let point = new THREE.Vector3(0, 0, 0);
        point.crossVectors(trackCurve.getTangentAt(pu), getAngleAt(pu));
        point.normalize();
        point.multiplyScalar(offset * trainSize);
        point.add(trackCurve.getPointAt(pu));
        return point;
    }
    function offsetCurve(offset) {
        let newTrack = [];
        let incrementTrack = 1 / trackCurve.getLength();
        for (let i = 0; i < 1; i += incrementTrack) {
            newTrack.push(offsetPoint(i, offset));
        }
        return createCurve(newTrack);
    }
    function getAngleAt(pu) {
        let param = trackCurve.getUtoTmapping(pu) * thePoints.length;
        return getAngleGeneral(param);
    }
    function getAngle(pu) {
        let param = pu * thePoints.length;
        return getAngleGeneral(param);
    }
    function getAngleGeneral(param) {
        let current = Math.floor(param);
        let next = (current + 1) % thePoints.length;
        let d0 = new THREE.Vector3(0, 1, 0);
        d0.applyEuler(thePointsMesh[current].rotation);
        let d1 = new THREE.Vector3(0, 1, 0);
        d1.applyEuler(thePointsMesh[next].rotation);
        let du = new THREE.Vector3(0, 1, 0);
        du.lerpVectors(d0, d1, param - current);
        return du;
    }
    function drawTrack() {
        let trackGroup = new THREE.Group();
        let totalLengthSeg = Math.round(trackCurve.getLength());
        if (trackType.value == "0") {
            let trackGeometry = new THREE.TubeBufferGeometry(trackCurve, totalLengthSeg, trackSize);
            let trackMaterial = new THREE.MeshPhongMaterial({ color: "burlywood" });
            let trackMesh = new THREE.Mesh(trackGeometry, trackMaterial);
            trackGroup.add(trackMesh);
        }
        else if (trackType.value == "1") {
            let trackMaterial = new THREE.MeshPhongMaterial({ color: "burlywood" });
            let outerTrack = offsetCurve(0.45);
            let outerTrackGeometry = new THREE.TubeBufferGeometry(outerTrack, totalLengthSeg, trackSize);
            let outerTrackMesh = new THREE.Mesh(outerTrackGeometry, trackMaterial);
            let innerTrack = offsetCurve(-0.45);
            let innerTrackGeometry = new THREE.TubeBufferGeometry(innerTrack, totalLengthSeg, trackSize);
            let innerTrackMesh = new THREE.Mesh(innerTrackGeometry, trackMaterial);
            trackGroup.add(outerTrackMesh, innerTrackMesh);
        }
        else if (trackType.value == "2") {
            let trackMaterial = new THREE.MeshPhongMaterial({ color: "burlywood", side: THREE.DoubleSide });
            let trackGeometry = new THREE.BufferGeometry();
            let incrementTrack = 1 / trackCurve.getLength() * 2;
            let list = [];
            let previousOuter;
            let previousInner;
            for (let pu = 0; pu < 1 + incrementTrack; pu += incrementTrack) {
                let outer = offsetPoint(pu > 1 ? 0 : pu, 0.5);
                let inner = offsetPoint(pu > 1 ? 0 : pu, -0.5);
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
            let vertices = new Float32Array(list);
            trackGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
            trackGeometry.computeVertexNormals();
            let trackMesh = new THREE.Mesh(trackGeometry, trackMaterial);
            trackGroup.add(trackMesh);
        }
        else if (trackType.value == "3") {
            let trackMaterial = new THREE.MeshPhongMaterial({ color: "lime" });
            let trackGeometry = new THREE.SphereBufferGeometry(trackSize);
            let incrementTrack = 1 / trackCurve.getLength() * 5;
            for (let pu = 0; pu < 1; pu += incrementTrack) {
                let trackMesh = new THREE.Mesh(trackGeometry, trackMaterial);
                trackMesh.position.copy(trackCurve.getPointAt(pu));
                trackGroup.add(trackMesh);
            }
        }
        if (railTies.checked && trackType.value != "2") {
            let tieGeometry = null;
            if (railTiesSimple.checked) tieGeometry = new THREE.TubeBufferGeometry(new THREE.LineCurve3(new THREE.Vector3(-0.5 * trainSize, 0, 0), new THREE.Vector3(0.5 * trainSize, 0, 0)), 64, trackSize);
            else tieGeometry = new THREE.BoxBufferGeometry(trainSize, trackSize * 2, trackSize * 4);
            let tieMaterial = new THREE.MeshPhongMaterial({ color: "burlywood" });
            let tieMesh = [];
            let incrementRail = 1 / trackCurve.getLength() * 15;
            for (let pu = 0; pu < 1 - incrementRail; pu += incrementRail) {
                let currentTieMesh = new THREE.Mesh(tieGeometry, tieMaterial);
                let currentPosition = null;
                let currentUp = null;
                let currentTangent = null;
                if (railTiesArcLength.checked) {
                    currentPosition = trackCurve.getPointAt(pu);
                    currentUp = getAngleAt(pu);
                    currentTangent = trackCurve.getTangentAt(pu);
                }
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
    let carts = [];
    //let wheels = [];
    function drawCart(cart = 0) {
        let trainGroup = new THREE.Group();
        if (cart == 0) {
            let trainBodyGeometry = new THREE.BoxBufferGeometry(0.5 * trainSize, 0.5 * trainSize, 1.5 * trainSize);
            let trainTopGeometry = new THREE.BoxBufferGeometry(0.5 * trainSize, 0.25 * trainSize, 0.5 * trainSize);
            let trainChimneyGeometry = new THREE.ConeBufferGeometry(0.25 * trainSize, 0.5 * trainSize, 4);
            let trainWheelGeometry = new THREE.CylinderBufferGeometry(0.2 * trainSize, 0.2 * trainSize, 0.1 * trainSize);
            let trainMaterial = new THREE.MeshPhongMaterial({ color: "blue" });
            let trainWheelMaterial = new THREE.MeshPhongMaterial({ color: "black" });
            let trainBodyMesh = new THREE.Mesh(trainBodyGeometry, trainMaterial);
            let trainTopMesh = new THREE.Mesh(trainTopGeometry, trainMaterial);
            let trainChimneyMesh = new THREE.Mesh(trainChimneyGeometry, trainMaterial);
            let trainWheelMesh = [];
            for (let i = 0; i < 3; i++) {
                for (let j = -1; j <= 1; j += 2) {
                    let currentTrainWheelMesh = new THREE.Mesh(trainWheelGeometry, trainWheelMaterial);
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
        else if (cart > 0) {
            let trainBodyGeometry = new THREE.BoxBufferGeometry(0.5 * trainSize, 0.5 * trainSize, 1 * trainSize);
            let trainWheelGeometry = new THREE.CylinderBufferGeometry(0.2 * trainSize, 0.2 * trainSize, 0.1 * trainSize);
            let trainMaterial = new THREE.MeshPhongMaterial({ color: "white" });
            let trainWheelMaterial = new THREE.MeshPhongMaterial({ color: "black" });
            let trainBodyMesh = new THREE.Mesh(trainBodyGeometry, trainMaterial);
            let trainWheelMesh = [];
            for (let i = -1; i < 2; i += 2) {
                for (let j = -1; j <= 1; j += 2) {
                    let currentTrainWheelMesh = new THREE.Mesh(trainWheelGeometry, trainWheelMaterial);
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
        else {
            let trainBodyGeometry = new THREE.BoxBufferGeometry(0.5 * trainSize, 0.5 * trainSize, 1 * trainSize);
            let trainTopGeometry = new THREE.BoxBufferGeometry(0.5 * trainSize, 0.125 * trainSize, 0.5 * trainSize);
            let trainWheelGeometry = new THREE.CylinderBufferGeometry(0.2 * trainSize, 0.2 * trainSize, 0.1 * trainSize);
            let trainMaterial = new THREE.MeshPhongMaterial({ color: "red" });
            let trainWheelMaterial = new THREE.MeshPhongMaterial({ color: "black" });
            let trainBodyMesh = new THREE.Mesh(trainBodyGeometry, trainMaterial);
            let trainTopMesh = new THREE.Mesh(trainTopGeometry, trainMaterial);
            let trainWheelMesh = [];
            for (let i = -1; i < 2; i += 2) {
                for (let j = -1; j <= 1; j += 2) {
                    let currentTrainWheelMesh = new THREE.Mesh(trainWheelGeometry, trainWheelMaterial);
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
    function drawTrain() {
        let trainGroup = new THREE.Group();
        let nCart = Number(cars.value);
        let cart;
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
    let train = drawTrain();
    scene.add(train);
    function drawPlane() {
        let groundGroup = new THREE.Group();
        let segments = 10;
        let groundGeometry = new THREE.PlaneGeometry(planeSize, planeSize, segments, segments);
        let materialEven = new THREE.MeshPhongMaterial({ color: "lightgray" });
        let materialOdd = new THREE.MeshPhongMaterial({ color: "gray" });
        materialEven.side = THREE.DoubleSide;
        materialOdd.side = THREE.DoubleSide;
        let materials = [materialEven, materialOdd];
        for (let x = 0; x < segments; x++) {
            for (let y = 0; y < segments; y++) {
                let i = 2 * (x * segments + y);
                groundGeometry.faces[i].materialIndex = groundGeometry.faces[i + 1].materialIndex = (x + y) % 2;
            }
        }
        let groundMesh = new THREE.Mesh(groundGeometry, materials);
        groundMesh.rotateX(-Math.PI / 2);
        groundMesh.receiveShadow = true;
        groundGroup.add(groundMesh);
        return groundGroup;
    }
    let ground = drawPlane();
    scene.add(ground);
    // Updates
    let u = 0;
    function moveTrack() {
        thePoints = thePointsMesh.map(p => p.position);
        track.children.length = 0;
        trackCurve = createCurve();
        track.copy(drawTrack());
    }
    function updateView() {
        if (view.value == "0") {
            camera = worldCamera;
            orbitControls.enabled = true;
            dragControls.enabled = true;
            transformControls.forEach(t => t.enabled = true);
        }
        else {
            camera = view.value == "1" ? trainCamera : topCamera;
            orbitControls.enabled = false;
            dragControls.enabled = false;
            transformControls.forEach(t => t.enabled = false);
        }
    }
    function loadExample() {
        let file = "";
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
    function loadText(file = "") {
        let list = file.split("\n");
        list.splice(0, 1);
        while (list[list.length - 1].trim() == "") list.splice(list.length - 1);
        list = list.map(l => l.indexOf("\t") >= 0 ? l.split("\t") : l.split(" "));
        try {
            thePoints = list.map(l => new THREE.Vector3(Number(l[0]), Number(l[1]), Number(l[2])));
            drawPoints();
            thePointsMesh.forEach((p, i) => p.lookAt(Number(list[i][0]) + Number(list[i][3] || 0), Number(list[i][1]) + Number(list[i][4] || 1), Number(list[i][2]) + Number(list[i][5] || 0)));
            thePointsMesh.forEach(p => p.rotateX(Math.PI / 2));
            moveTrack();
        }
        catch (error) {
            resetPoints();
        }
    }
    function loadPoints(event) {
        let input = event.target;
        let reader = new FileReader();
        reader.onload = function () {
            loadText(reader.result);
        };
        reader.readAsText(input.files[0]);
    }
    function savePoints() {
        let rot = thePointsMesh.map(() => new THREE.Vector3(0, 1, 0));
        rot.forEach((r, i) => r.applyEuler(thePointsMesh[i].rotation));
        let list = thePoints.reduce((s, p, i) => s + p.x + "\t" + p.y + "\t" + p.z + "\t" + parseFloat(rot[i].x.toFixed(2)) + "\t" + parseFloat(rot[i].y.toFixed(2)) + "\t" + parseFloat(rot[i].z.toFixed(2)) + "\n", "");
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(list));
        element.setAttribute('download', "track.txt");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    function resetPoints() {
        thePoints = [[50, 5, 0], [0, 5, 50], [-50, 5, 0], [0, 5, -50]].map(p => new THREE.Vector3(...p));
        drawPoints();
        moveTrack();
    }
    function updateTrain() {
        train.children.length = 0;
        carts.length = 0;
        let group = drawTrain();
        train.add(...group.children);
        moveTrain();
    }
    function moveTrain() {
        if (!run.checked) u = Number(increment.value);
        else increment.value = u.toFixed(2);
        let u0 = 0;
        if (!arcLength.checked) {
            let min = 1;
            let cur = 0;
            for (let t = 0; t < 1; t += 0.01) {
                cur = Math.abs(trackCurve.getUtoTmapping(t) - u);
                if (cur < min) {
                    min = cur;
                    u0 = t;
                }
            }
        }
        else u0 = u;
        let totalLength = trackCurve.getLength();
        for (let i = 0; i < carts.length; i++) {
            let up = (u0 - ((trainSize * 1.4) * i / totalLength) + 1) % 1;
            if (i > 0) up = (up - (trainSize * 0.125) / totalLength + 1) % 1;
            let pup = trainArcLength.checked ? trackCurve.getPointAt(up) : trackCurve.getPoint(up);
            let aup = trainArcLength.checked ? getAngleAt(up) : getAngle(up);
            let tup = trainArcLength.checked ? trackCurve.getTangentAt(up) : trackCurve.getTangent(up);
            carts[i].position.copy(pup);
            carts[i].up = aup;
            carts[i].lookAt(pup.add(tup));
        }
        let du = speed.value;
        u = (u + du / totalLength / 30) % 1;
    }
    // OrbitControl and DragControl
    let orbitControls = new OrbitControls(camera, renderer.domElement);
    let dragControls = new DragControls(thePointsMesh, camera, renderer.domElement);
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
        if (ctrlKey && thePointsMesh.length > 1) {
            let pos = e.object.position;
            let i = thePointsMesh.length - 1;
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
    let ctrlKey = false;
    let shiftKey = false;
    document.addEventListener("keydown", function (e) {
        if (e.ctrlKey) ctrlKey = true;
        if (e.shiftKey) shiftKey = true;
    });
    document.addEventListener("keyup", function (e) {
        ctrlKey = false;
        shiftKey = false;
    });
    document.addEventListener("mousedown", function (e) {
        if (shiftKey && view.value == "0") {
            let mouse = new THREE.Vector3(0, 0, 0.5);
            mouse.x = (e.offsetX / renderer.domElement.clientWidth) * 2 - 1;
            mouse.y = - (e.offsetY / renderer.domElement.clientHeight) * 2 + 1;
            mouse.unproject(camera);
            mouse.sub(camera.position).normalize();
            let distance = (5 - camera.position.y) / mouse.y;
            let intersection = new THREE.Vector3(0, 0, 0);
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
};
