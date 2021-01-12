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
    let planeSize = 100;
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera();
    camera.position.set(0, 0, 3 * planeSize);
    camera.lookAt(0, -planeSize, 0);
    let light = new THREE.AmbientLight("white", 0.2);
    scene.add(light);
    let spotLight = new THREE.SpotLight("white", 1);
    spotLight.position.set(0, planeSize * 1.5, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);
    // Sliders Controls
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
    let mousePlane = addSlider("Mouse Plane Position", -planeSize, planeSize, 0);
    let zPlane = addCheckBox("Mouse Intersection with xy-plane?", true);
    // Ground Plane
    function drawPlane() {
        let groundGroup = new THREE.Group();
        let segments = 10;
        let groundGeometry = new THREE.PlaneGeometry(planeSize * 2, planeSize * 2, segments, segments);
        let materialEven = new THREE.MeshPhongMaterial({ color: "lightgray" });
        let materialOdd = new THREE.MeshPhongMaterial({ color: "gray" });
        materialEven.side = THREE.DoubleSide;
        materialOdd.side = THREE.DoubleSide;
        let materialList = [materialEven, materialOdd];
        for (let x = 0; x < segments; x++) {
            for (let y = 0; y < segments; y++) {
                let i = 2 * (x * segments + y);
                groundGeometry.faces[i].materialIndex = groundGeometry.faces[i + 1].materialIndex = (x + y) % 2;
            }
        }
        let groundMesh = new THREE.Mesh(groundGeometry, materialList);
        groundMesh.translateY(-planeSize);
        groundMesh.rotateX(-Math.PI / 2);
        groundMesh.receiveShadow = true;
        groundGroup.add(groundMesh);
        return groundGroup;
    }
    let ground = drawPlane();
    scene.add(ground);
    let fireworks = new THREE.Group();
    scene.add(fireworks);
    // Fireworks
    let sphereSize = 5;
    let cubeSize = 3;
    let numColor = 10;
    let sphereSpeed = 5;
    let cubeSpeed = 0.5;
    let numCubes = 25;
    let gravity = 0.01;
    let sphereGeometry = new THREE.SphereBufferGeometry(sphereSize, 32, 32);
    let cubeGeometry = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize, 1, 1, 1);
    let colors = Array.from(Array(numColor).keys()).map(i => new THREE.Color(`hsl(${i / numColor * 360}, 50%, 50%)`));
    let materials = colors.map(c => new THREE.MeshPhongMaterial({ color: c }));
    function randomBetween(max = planeSize, min = -max) {
        let x = Math.random() * (max - min) + min;
        return x == 0 ? randomBetween(max, min) : x;
    }
    function randomVector(max = planeSize, min = -max) {
        return new THREE.Vector3(randomBetween(max, min), randomBetween(max, min), randomBetween(max, min));
    }
    function addSphere(target) {
        if (!isOutside(target)) {
            let data = { type: 0, color: Math.floor(Math.random() * numColor) };
            data.position = randomVector();
            data.position.y = -planeSize;
            data.target = target;
            data.velocity = new THREE.Vector3().subVectors(data.target, data.position).normalize().multiplyScalar(sphereSpeed);
            let mesh = new THREE.Mesh(sphereGeometry, materials[data.color]);
            mesh.position.set(data.position);
            mesh.userData = data;
            mesh.castShadow = true;
            fireworks.add(mesh);
        }
    }    
    function addCubes(sphere) {
        let data = { type: 1, color: sphere.userData.color };
        data.position = Array(numCubes).fill(0).map(() => new THREE.Vector3().copy(sphere.userData.position));
        data.velocity = Array(numCubes).fill(0).map(() => randomVector(cubeSpeed));
        let mesh = new THREE.InstancedMesh(cubeGeometry.clone(), materials[data.color].clone(), numCubes);
        for (let i = 0; i < numCubes; i++) mesh.setMatrixAt(i, new THREE.Matrix4().setPosition(data.position));
        mesh.userData = data;
        mesh.castShadow = true;
        fireworks.add(mesh);
    }
    let orbitControls = new OrbitControls(camera, renderer.domElement);
    // Mouse Control
    function mouseToPlane(event, axis = "z", value = 0) {
        let mouse = new THREE.Vector3(0, 0, 0.5);
        mouse.x = (event.offsetX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = - (event.offsetY / renderer.domElement.clientHeight) * 2 + 1;
        mouse.unproject(camera).sub(camera.position).normalize();
        let distance = (value - camera.position[axis]) / mouse[axis];
        let intersection = new THREE.Vector3(0, 0, 0);
        intersection.copy(camera.position).add(mouse.multiplyScalar(distance));
        return intersection;
    }
    document.addEventListener("mousedown", function (event) {
        let intersection = mouseToPlane(event, zPlane.checked ? "z" : "x", mousePlane.value);
        addSphere(intersection);
    });
    // Animation Loop
    function isOutside(position, target) {
        let outside = ["x", "y", "z"].reduce((out, c) => out || Math.abs(position[c]) > planeSize, false);
        return outside || (target && position.y > target.y);
    }
    let disposeList = [];
    function update(firework) {
        let data = firework.userData;
        if (data.type == 0) {
            data.position.add(data.velocity);
            firework.position.copy(data.position);
            if (isOutside(data.position, data.target)) {
                if (data.position.y > data.target.y) addCubes(firework);
                disposeList.push(firework);
            }
        }
        else if (data.type == 1) {
            let count = 0;
            for (let i = 0; i < numCubes; i++) {
                data.position[i].add(data.velocity[i]);
                data.velocity[i].sub(new THREE.Vector3(0, gravity, 0));
                firework.setMatrixAt(i, new THREE.Matrix4().setPosition(data.position[i]));
                if (isOutside(data.position[i])) {
                    firework.setMatrixAt(i, new THREE.Matrix4().makeScale(0, 0, 0));
                    count++;
                }
                firework.instanceMatrix.needsUpdate = true;
            }
            if (count == numCubes) {
                disposeList.push(firework);
            }
        }
    }
    addSphere(new THREE.Vector3(0, 0, 0));
    function draw() {
        renderer.render(scene, camera);
        orbitControls.update();
        if (Math.random() < 0.01) addSphere(randomVector(0.5 * planeSize));
        fireworks.traverse(firework => update(firework));
        for (let dispose of disposeList) {
            if (dispose.userData.type == 1) {
                dispose.material.dispose();
                dispose.geometry.dispose();
            }
            fireworks.remove(dispose);
        }
        window.requestAnimationFrame(draw);
    }
    draw();
};
