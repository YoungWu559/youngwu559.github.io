/**
 * A simple JavaScript file that gets loaded with Workbook (CS559).
 *
 * written by Michael Gleicher, January 2019
 * modified January 2020
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
    worldCamera.position.set(0, 7.5, 10);
    worldCamera.lookAt(0, 5, 0);
    let topCamera = new THREE.PerspectiveCamera();
    topCamera.position.set(0, 10, 0);
    topCamera.lookAt(0, 0, 0);
    let trainCamera = new THREE.PerspectiveCamera();
    let camera = worldCamera;
    let light = new THREE.AmbientLight("white", 0.2);
    scene.add(light);
    let directionalLight = new THREE.DirectionalLight("white", 0.8);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = -10;
    directionalLight.shadow.camera.far = 10;
    scene.add(directionalLight);
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
    let increment = addIncrement(" : ", 0, 1, 0.01, 0, moveTrain);
    let arcLength = addCheckBox("ArcLength", true, moveTrain);
    addBreak();
    let view = addSelect("Camera : ", ["World", "Train", "Top"], 0, updateView);
    addBreak();
    let speed = addSlider("Speed", 0, 100, 50, moveTrain);
    addBreak();
    let splineType = addSelect("Spline Type : ", ["Linear", "Cardinal Cubic", "Cubic B-Spline (not working)"], 1, moveTrack);
    addBreak();
    addBreak("Shift + Mouse Click to add Point ; Ctrl + Mouse Click to remove Point");
    addBreak("Load Save Reset (not working)");
    addBreak("Use the TransformControls to rotate Point");
    let trackType = addSelect("Track Type : ", ["Simple Track", "Parallel Rails", "Road Rail (not working)", "Fancy Rails (not working)"], 1, moveTrack);
    addBreak();
    let railTies = addCheckBox("Rail Ties", true, moveTrack);
    let railTiesSimple = addCheckBox("Rail Ties Simple", false, moveTrack);
    let railTiesArcLength = addCheckBox("Rail Ties ArcLength", true, moveTrack);
    addBreak();
    let tension = addSlider("Tension", 0, 1, 0.5, moveTrack);
    addBreak();
    let cars = addIncrement("Cars : ", 3, 10, 1, 5, updateTrain);
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
        transformControl.setSize(0.5);
        transformControls.push(transformControl);
        scene.add(transformControl);
    }
    // Initial Drawing
    let trainSize = 1;
    let trackSize = 0.05;
    let thePointsMesh = [];
    let thePoints = [[2, 0, 2], [2, 0, -2], [-2, 0, -2], [-3, 0, 0], [-2, 0, 2]].map(p => new THREE.Vector3(...p));
    let pointSize = 0.3;
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
    thePoints.forEach(p => drawPoint(p));
    let track = new THREE.Group();
    function createCurve(points = thePoints) {
        let curve = null;
        if (splineType.value == "0") {
            curve = new THREE.CurvePath();
            for (let i = 0; i < points.length; i++) curve.add(new THREE.LineCurve3(points[i], points[(i + 1) % points.length]));
            curve.updateArcLengths();
        }
        else curve = new THREE.CatmullRomCurve3(points, true, "catmullrom", tension.value);
        return curve;
    }
    let trackCurve = createCurve();
    function offsetPoint(u = 0, offset = 0) {
        let point = new THREE.Vector3(0, 0, 0);
        point.crossVectors(trackCurve.getTangentAt(u), getAngleAt(u));
        point.normalize();
        point.multiplyScalar(offset * trainSize);
        point.add(trackCurve.getPointAt(u));
        return point;
    }
    function offsetCurve(offset) {
        let newTrack = [];
        let totalLength = trackCurve.getLength();
        for (let i = 0; i < totalLength; i += 0.5) {
            newTrack.push(offsetPoint(i / totalLength, offset));
        }
        return createCurve(newTrack);
    }
    function getAngleAt(u) {
        let param = trackCurve.getUtoTmapping(u) * thePoints.length;
        return getAngleGeneral(param);
    }
    function getAngle(u) {
        let param = u * thePoints.length;
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
        let track = new THREE.Group();
        if (trackType.value == "0") {
            let trackGeometry = new THREE.TubeBufferGeometry(trackCurve, 64, trackSize);
            let trackMaterial = new THREE.MeshPhongMaterial({ color: "burlywood" });
            let trackMesh = new THREE.Mesh(trackGeometry, trackMaterial);
            track.add(trackMesh);
        }
        else {
            let trackMaterial = new THREE.MeshPhongMaterial({ color: "burlywood" });
            let outerTrack = offsetCurve(0.45);
            let outerTrackGeometry = new THREE.TubeBufferGeometry(outerTrack, 64, trackSize);
            let outerTrackMesh = new THREE.Mesh(outerTrackGeometry, trackMaterial);
            let innerTrack = offsetCurve(-0.45);
            let innerTrackGeometry = new THREE.TubeBufferGeometry(innerTrack, 64, trackSize);
            let innerTrackMesh = new THREE.Mesh(innerTrackGeometry, trackMaterial);
            track.add(outerTrackMesh, innerTrackMesh);
        }
        if (railTies.checked) {
            let tieGeometry = null;
            if (railTiesSimple.checked) tieGeometry = new THREE.TubeBufferGeometry(new THREE.LineCurve3(new THREE.Vector3(-0.5, 0, 0), new THREE.Vector3(0.5, 0, 0)), 64, trackSize);
            else tieGeometry = new THREE.BoxBufferGeometry(1, trackSize * 2, trackSize * 4);
            let tieMaterial = new THREE.MeshPhongMaterial({ color: "burlywood" });
            let tieMesh = [];
            let increment = 1 / trackCurve.getLength() * 0.75;
            for (let u = 0; u < 1 - increment; u += increment) {
                let currentTieMesh = new THREE.Mesh(tieGeometry, tieMaterial);
                let currentPosition = null;
                let currentUp = null;
                let currentTangent = null;
                if (railTiesArcLength.checked) {
                    currentPosition = trackCurve.getPointAt(u);
                    currentUp = getAngleAt(u);
                    currentTangent = trackCurve.getTangentAt(u);
                }
                else {
                    currentPosition = trackCurve.getPoint(u);
                    currentUp = getAngle(u);
                    currentTangent = trackCurve.getTangent(u);
                }
                currentTieMesh.position.copy(currentPosition);
                currentTieMesh.up = currentUp;
                currentTieMesh.lookAt(currentPosition.add(currentTangent));
                tieMesh.push(currentTieMesh);
            }
            track.add(...tieMesh);
        }
        track.traverse(c => c.castShadow = true);
        return track;
    }
    track = drawTrack();
    scene.add(track);
    let carts = [];
    let wheels = [];
    function drawCart(cart = 0) {
        let train = new THREE.Group();
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
                    wheels.push(currentTrainWheelMesh);
                }
            }
            trainBodyMesh.position.set(0, 0.45 * trainSize + trackSize, 0);
            trainTopMesh.position.set(0, 0.825 * trainSize + trackSize, -0.5 * trainSize);
            trainChimneyMesh.position.set(0, 0.825 * trainSize + trackSize, 0.5 * trainSize);
            trainChimneyMesh.rotateX(Math.PI);
            train.add(trainBodyMesh);
            train.add(trainTopMesh);
            train.add(trainChimneyMesh);
            train.add(...trainWheelMesh);
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
                    wheels.push(currentTrainWheelMesh);
                }
            }
            trainBodyMesh.position.set(0, 0.45 * trainSize + trackSize, 0);
            train.add(trainBodyMesh);
            train.add(...trainWheelMesh);
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
                    wheels.push(currentTrainWheelMesh);
                }
            }
            trainBodyMesh.position.set(0, 0.45 * trainSize + trackSize, 0);
            trainTopMesh.position.set(0, 0.7625 * trainSize + trackSize, 0);
            train.add(trainBodyMesh);
            train.add(trainTopMesh);
            train.add(...trainWheelMesh);
        }
        train.traverse(c => c.castShadow = true);
        return train;
    }
    function drawTrain() {
        let train = new THREE.Group();
        let nCart = Number(cars.value);
        let cart;
        if (trainHead.checked) cart = drawCart(0);
        else cart = drawCart(1);
        cart.add(trainCamera);
        trainCamera.rotateY(Math.PI);
        trainCamera.translateY(0.5 * trainSize);
        trainCamera.translateZ(-0.5 * trainSize);
        train.add(cart);
        carts.push(cart);
        for (let i = 1; i < nCart - 1; i++) {
            cart = drawCart(i);
            train.add(cart);
            carts.push(cart);
        }
        if (trainHead.checked) cart = drawCart(-1);
        else cart = drawCart(1);
        train.add(cart);
        carts.push(cart);
        return train;
    }
    let train = drawTrain();
    scene.add(train);
    function drawPlane() {
        let ground = new THREE.Group();
        let segments = 8;
        let groundGeometry = new THREE.PlaneGeometry(10, 10, segments, segments);
        let materialEven = new THREE.MeshPhongMaterial({ color: "lightgray" });
        let materialOdd = new THREE.MeshStandardMaterial({ color: "gray" });
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
        groundMesh.translateY(-2);
        groundMesh.rotateX(-Math.PI / 2);
        groundMesh.receiveShadow = true;
        ground.add(groundMesh);
        return ground;
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
        for (let i = 0; i < carts.length; i++) {
            let up = (u0 - ((trainSize * 1.4) * i / trackCurve.getLength()) + 1) % 1;
            if (i > 0) up = (up - (trainSize * 0.125) / trackCurve.getLength() + 1) % 1;
            let pup = trainArcLength.checked ? trackCurve.getPointAt(up) : trackCurve.getPoint(up);
            let aup = trainArcLength.checked ? getAngleAt(up) : getAngle(up);
            let tup = trainArcLength.checked ? trackCurve.getTangentAt(up) : trackCurve.getTangent(up);
            carts[i].position.copy(pup);
            carts[i].up = aup;
            carts[i].lookAt(pup.add(tup));
        }
        let du = speed.value;
        wheels.forEach(w => w.rotateY(-du / 800));
        u = (u + du / 8000) % 1;
    }
    // OrbitControl and DragControl
    let rayCaster = new THREE.Raycaster();
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
            let mouse = new THREE.Vector2(0, 0);
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            rayCaster.setFromCamera(mouse, camera);
            let intersections = rayCaster.intersectObjects(ground.children);
            if (intersections.length > 0) {
                let intersection = intersections[0].point;
                intersection.y = 0;
                drawPoint(intersection);
            }
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
