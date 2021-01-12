/**
 * A simple JavaScript file that gets loaded with Workbook (CS559).
 *
 * written by Young Wu, 2020
 */

/* jshint -W069, esversion:6 */

import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";

window.onload = function () {
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(500, 500);
    renderer.shadowMap.enabled = true;
    document.getElementById("div1").appendChild(renderer.domElement);
    // Scene and Lights
    let boxSize = 100;
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera();
    camera.position.set(0, 0, 3 * boxSize);
    camera.lookAt(0, -boxSize, 0);
    let light = new THREE.AmbientLight("white", 0.2);
    scene.add(light);
    let spotLight = new THREE.SpotLight("white", 1);
    spotLight.position.set(0, boxSize * 2, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);
    // Sliders Controls
    function addButton(name = "", onchange = undefined) {
        let box = document.createElement("button");
        box.innerHTML = name;
        if (onchange) box.onclick = onchange;
        document.getElementById("div1").appendChild(box);
        return box;
    }
    function addCheckBox(name = "", initial = true, onchange = undefined) {
        let box = document.createElement("input");
        box.type = "checkbox";
        box.checked = initial;
        if (onchange) box.onchange = onchange;
        document.getElementById("div1").appendChild(box);
        document.getElementById("div1").appendChild(document.createTextNode(name));
        return box;
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
    function addBreak(text = "") {
        if (text) document.getElementById("div1").appendChild(document.createTextNode(text));
        document.getElementById("div1").appendChild(document.createElement("br"));
    }
    addBreak();
    let speed = addSlider("Speed: ", 0, 200, 100);
    addBreak();
    addButton("Add", addBoid);
    addButton("Clear", clear);
    // Box
    let boidSize = 5;
    let maxBoid = 100;
    let maxDimension = 4;
    let maxCountDown = 10;
    let curBoid = 0;
    let boidGeometry = new THREE.SphereBufferGeometry(boidSize, 32, 32);
    let color = new THREE.Color("blue");
    let hitColor = new THREE.Color("red");
    let boidMaterial = new THREE.MeshPhongMaterial();
    let boidMesh = new THREE.InstancedMesh(boidGeometry, boidMaterial, maxBoid);
    let boids = [];
    let dimensions = [1, 1, 0, 0];
    let drawDimensions = [1, 1, 1, 0];
    function drawBox() {
        let boxGeometry = new THREE.BoxBufferGeometry(boxSize * 2, boxSize * 2, boxSize * 2, 1, 1, 1);
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "green", emissive: "green", opacity: 0.1, transparent: true });
        let boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        scene.add(boxMesh);
        scene.add(boidMesh);
    }
    drawBox();
    // Boids
    function clear() {
        for (let i = 0; i < maxBoid; i++) {
            boidMesh.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
            boidMesh.setColorAt(i, color);
        }
        boidMesh.instanceMatrix.needsUpdate = true;
        boidMesh.instanceColor.needsUpdate = true;
        curBoid = 0;
        boids.length = 0;
    }
    function randomBetween(max = boxSize, min = -max) {
        let x = Math.random() * (max - min) + min;
        return x == 0 ? randomBetween(max, min) : x;
    }
    function randomVector(dimension = dimensions, max = boxSize, min = -max) {
        return dimension.map(di => di ? randomBetween(max, min) : 0);
    }
    function normalize(vector = [0, 0, 0, 0]) {
        let length = vector.reduce((sum, vi) => sum + vi * vi, 0);
        length = 1 / Math.sqrt(length);
        return vector.map(vi => vi * length);
    }
    function drawPosition(vector = [0, 0, 0, 0], dimension = [1, 1, 1, 0]) {
        return new THREE.Vector3(...vector.filter((_, i) => dimension[i]));
    }
    function addBoid() {
        let n = 10;
        if (curBoid < maxBoid) {
            for (let i = curBoid; i < curBoid + n; i++) {
                let boid = { position: randomVector(), velocity: normalize(randomVector()), countDown: 0 };
                boidMesh.setMatrixAt(i, new THREE.Matrix4().setPosition(drawPosition(boid.position, drawDimensions)));
                boids.push(boid);
            }
            curBoid += n;
        }
    }
    clear();
    addBoid();
    let orbitControls = new OrbitControls(camera, renderer.domElement);
    // Animation Loop
    function distanceBetween(vector = [0, 0, 0, 0], other = [0, 0, 0, 0]) {
        let distance = vector.reduce((sum, vi, i) => sum + (vi - other[i]) * (vi - other[i]), 0);
        return Math.sqrt(distance);
    }
    function reflectVector(center = [0, 0, 0, 0], other = [0, 0, 0, 0], input = [1, 0, 0, 0]) {
        let normal = normalize(center.map((ci, i) => ci - other[i]));
        let dot = normal.reduce((sum, ni, i) => sum + ni * input[i], 0);
        return input.map((ii, i) => ii - 2 * dot * normal[i]);
    }
    function update(boid, index = 0) {
        if (index < curBoid) {
            boid.position = boid.position.map((pi, i) => pi + boid.velocity[i] * Number(speed.value) / 100);
            for (let i = 0; i < curBoid; i ++) {
                if (i != index && (boid.countDown == 0 || boids[i].countDown == 0) && distanceBetween(boids[i].position, boid.position) < boidSize * 2) {
                    boid.velocity = reflectVector(boids[i].position, boid.position, boid.velocity);
                    boid.countDown = maxCountDown;
                }
            } 
            for (let d = 0; d < maxDimension; d++) {
                if (Math.abs(boid.position[d]) > boxSize) {
                    boid.velocity[d] *= -1;
                    boid.position[d] = Math.max(-boxSize, Math.min(boid.position[d], boxSize));
                    boid.countDown = maxCountDown;
                }
            }
            if (boid.countDown == 0) boidMesh.setColorAt(index, color);
            else boidMesh.setColorAt(index, hitColor);
            if (boid.countDown > 0) boid.countDown--;
            boidMesh.setMatrixAt(index, new THREE.Matrix4().setPosition(drawPosition(boid.position, drawDimensions)));
        }
    }
    function draw() {
        renderer.render(scene, camera);
        orbitControls.update();
        boids.forEach((boid, i) => update(boid, i));
        boidMesh.instanceColor.needsUpdate = true;
        boidMesh.instanceMatrix.needsUpdate = true;
        window.requestAnimationFrame(draw);
    }
    draw();
};
