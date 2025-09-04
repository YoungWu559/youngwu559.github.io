/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as Geom from "../libs/CS559-Three/examples/jsm/deprecated/Geometry.js";

// define your vehicles here - remember, they need to be imported
// into the "main" program

/** @type {String} */ const imageFolder = "./images/";
/** @type {T.TextureLoader} */ const textureLoader = new T.TextureLoader();
/** @type {Object[]} */ const carParams = [{ type: 0, w: 3.5, f: 3, r: 7, h: 1, m: 1.5, t: 4, s: 0.3, a: 0.2, sr: 0.5, br: 0.5 },
{ type: 1, w: 2.5, f: 2.5, r: 5, h: 1, m: 1.5, t: 3, s: 0.4, a: 0.6, sr: 1, br: 2.5 },
{ type: 2, w: 3, f: 2, r: 8, h: 1, m: 2.5, t: 5, s: 0.3, a: 1, sr: 0.5, br: 0.5 }]; // CS559 Sample Code
/** @type {Object[]} */ const carColors = [{ name: "red", r: 220, g: 30, b: 30 },
{ name: "white", r: 225, g: 225, b: 225 },
{ name: "black", r: 50, g: 50, b: 70 },
{ name: "green", r: 30, g: 225, b: 30 },
{ name: "blue", r: 30, g: 30, b: 225 },
{ name: "yellow", r: 225, g: 225, b: 30 }]; // CS559 Sample Code
// Create the car geometries outside of the constructor so that they do not need to be created for each of the 100s of the cars
/** @type {T.BufferGeometry[][]} */ const carGeometries = carParams.map(function (params) {
/** @type {number} */ const w = params.w || 3.5; // Half of width
/** @type {number} */ const f = params.f || 3; // Length of front part
/** @type {number} */ const r = params.r || 6; // Length of back part
/** @type {number} */ const h = params.h || 1; // Height of ground
/** @type {number} */ const m = params.m || 1.5; // Height of motor
/** @type {number} */ const t = params.t || 4; // Height of back part
/** @type {number} */ const s = params.s || 0.3; // Slope of windshield
/** @type {number} */ const a = params.a || 0.2; // Rake of hood
/** @type {number} */ const sr = params.sr || 0.1; // ?
/** @type {number} */ const br = params.br || 0.2; // ?
    let geometries = [];
    geometries.push(polygonBuffer([-w, h, 0, -w, h + m - a, 0, w, h + m - a, 0, w, h, 0])); // CS559 Sample Code
    geometries.push(polygonBuffer([-w, h + m - a, 0, -w, h + m, f, w, h + m, f, w, h + m - a, 0])); // CS559 Sample Code
    geometries.push(polygonBuffer([-w, h, 0, -w, h, f, -w, h + m, f, -w, h + m - a, 0])); // CS559 Sample Code
    geometries.push(polygonBuffer([w, h, 0, w, h, f, w, h + m, f, w, h + m - a, 0], true)); // CS559 Sample Code
    geometries.push(polygonBuffer([-w + sr, t + h, f, -w + sr, t + h, f + r - br, w - sr, t + h, f + r - br, w - sr, t + h, f])); // CS559 Sample Code
    geometries.push(polygonBuffer([-w, h, f, -w, h, f + r, -w, m + h, f + r, -w, m + h, f])); // CS559 Sample Code
    geometries.push(polygonBuffer([w, h, f, w, h, f + r, w, m + h, f + r, w, m + h, f], true)); // CS559 Sample Code
    geometries.push(polygonBuffer([-w, h + m, f - s, -w, h + m, f + r, -w + sr, t + h, f + r - br, -w + sr, t + h, f])); // CS559 Sample Code
    geometries.push(polygonBuffer([w, h + m, f - s, w, h + m, f + r, w - sr, t + h, f + r - br, w - sr, t + h, f], true)); // CS559 Sample Code
    geometries.push(polygonBuffer([-w, h + m, f - s, -w + sr, t + h, f, w - sr, t + h, f, w, h + m, f - s])); // CS559 Sample Code
    geometries.push(polygonBuffer([-w, h + m, f + r, -w + sr, t + h, f + r - br, w - sr, t + h, f + r - br, w, h + m, f + r], true)); // CS559 Sample Code
    geometries.push(polygonBuffer([-w, h, f + r, -w, h + m, f + r, w, h + m, f + r, w, h, f + r], true)); // CS559 Sample Code
    return geometries;
});
/** @type {T.CylinderGeometry} */ const wheelGeometry = new T.CylinderGeometry();
/** @type {T.ConeGeometry} */ const beamGeometry = new T.ConeGeometry();
/** @type {T.Texture} */ const carFrontTexture = textureLoader.load(imageFolder + "suv-front.png");
/** @type {T.Texture} */ const carSideTexture = textureLoader.load(imageFolder + "suv-side.png");
/** @type {T.MeshPhongMaterial[]} */ const carMaterials = carColors.map(c => new T.MeshPhongMaterial({ color: `rgb(${c.r},${c.g},${c.b})` }));
/** @type {T.MeshPhongMaterial[]} */ const carFrontMaterials = carColors.map(c => new T.MeshPhongMaterial({ color: `rgb(${c.r},${c.g},${c.b})`, map: carFrontTexture }));
/** @type {T.MeshPhongMaterial[]} */ const carSideMaterials = carColors.map(c => new T.MeshPhongMaterial({ color: `rgb(${c.r},${c.g},${c.b})`, map: carSideTexture }));
/** @type {T.MeshPhongMaterial} */ const wheelMaterial = new T.MeshPhongMaterial({ color: "black" });
/** @type {T.MeshPhongMaterial} */ const beamMaterial = new T.MeshPhongMaterial({ color: "rgb(100%, 100%, 0%)", transparent: true, opacity: 0.2 });
export class GrCar extends GrObject {
    /**
     * The constructor
     * @param {Object} params Parameters
     */
    constructor(params = {}) {
/** @type {T.Group} */ const carGroup = new T.Group();
        super(params.name, carGroup);
// Copy all the parameters with defaults
/** @type {number} */ const w = params.w || 3.5; // Half of width
/** @type {number} */ const f = params.f || 3; // Length of front part
/** @type {number} */ const r = params.r || 6; // Length of back part
/** @type {number} */ const h = params.h || 1; // Height of ground
/** @type {number} */ const m = params.m || 1.5; // Height of motor
/** @type {number} */ const cone_length = params.cone_length || 20; // Length of the head lights
/** @type {number} */ const radius = params.radius || 3; // Radius of the head lights
/** @type {number} */ const color = params.index || 0; // Index of the color
/** @type {number} */ const type = params.type || 0; // 0 - SUV, 1 - HatchBack, 2 - Van
/** @type {number} */ const x = params.x || 0; // Position x
/** @type {number} */ const y = params.y || 0; // Position y
/** @type {number} */ const z = params.z || 0; // Position z
/** @type {number} */ const scale = params.scale || 1; // Scale
/** @type {T.Mesh} */ const first = new T.Mesh(carGeometries[type][0], carMaterials[color]);
/** @type {T.Mesh} */ const hood = new T.Mesh(carGeometries[type][1], carMaterials[color]);
/** @type {T.Mesh} */ const leftFender = new T.Mesh(carGeometries[type][2], carMaterials[color]);
/** @type {T.Mesh} */ const rightFender = new T.Mesh(carGeometries[type][3], carMaterials[color]);
/** @type {T.Mesh} */ const top = new T.Mesh(carGeometries[type][4], carMaterials[color]);
/** @type {T.Mesh} */ const leftSide = new T.Mesh(carGeometries[type][5], carMaterials[color]);
/** @type {T.Mesh} */ const rightSide = new T.Mesh(carGeometries[type][6], carMaterials[color]);
/** @type {T.Mesh} */ const left = new T.Mesh(carGeometries[type][7], carSideMaterials[color]);
/** @type {T.Mesh} */ const right = new T.Mesh(carGeometries[type][8], carSideMaterials[color]);
/** @type {T.Mesh} */ const front = new T.Mesh(carGeometries[type][9], carFrontMaterials[color]);
/** @type {T.Mesh} */ const back = new T.Mesh(carGeometries[type][10], carFrontMaterials[color]);
/** @type {T.Mesh} */ const last = new T.Mesh(carGeometries[type][11], carMaterials[color]);
/** @type {Object[]} */ const wheels = [{ x: w, y: h, z: f - h },
        { x: w, y: h, z: f + r - h - 1 },
        { x: -w, y: h, z: f - h },
        { x: -w, y: h, z: f + r - h - 1 }]; // CS559 Sample Code
/** @type {Object[]} */ const beams = [{ x: -w * 0.7, y: h + m * 0.5, z: 2 }, { x: w * 0.7, y: h + m * 0.5, z: 2 }]; // CS559 Sample Code
        wheels.forEach(function (p) {
    /** @type {T.Mesh} */ const wheel = new T.Mesh(wheelGeometry, wheelMaterial);
            // Put everything into the group and transform the group
            wheel.position.set(p.x, p.y, p.z);
            wheel.scale.set(h, 1, h);
            wheel.rotateZ(Math.PI * 0.5);
            carGroup.add(wheel);
        });
    /** @type {T.Mesh[]} */ const headLights = [];
        beams.forEach(function (p) {
    /** @type {T.Mesh} */ const beam = new T.Mesh(beamGeometry, beamMaterial);
            // Put everything into the group and transform the group
            beam.position.set(p.x, p.y, p.z - cone_length * 0.5);
            beam.scale.set(radius, cone_length, radius);
            beam.rotateX(Math.PI * 0.5);
            headLights.push(beam);
            carGroup.add(beam);
        });
        // Put everything into the group and transform the group
        carGroup.add(first, hood, leftFender, rightFender, top, leftSide, rightSide, left, right, front, back, last);
        carGroup.position.set(x, y, z);
        carGroup.scale.set(scale, scale, scale);
        // Set the parameters for the class (to be used in the animation function)
        this.group = carGroup;
        this.track = params.track;
        this.road = params.road;
        this.toRoad = params.toRoad;
        this.speed = params.speed || 1;
        this.rideable = carGroup;
        this.headLights = headLights;
        // The initial position on the road
        this.t = this.track ? Math.random() * this.track.length : 0;
    }
    /**
     * The animation function
     * @param {number} delta Delta
     * @param {number} timeOfDay Time of day 
     */
    stepWorld(delta = 0, timeOfDay = 0) {
        if (this.track) {
            // Increment the arc-length parameter
            this.t += this.speed * delta / 20;
            this.t = Math.min(this.t, this.track.length);
            // Find the position (the track provides it)
            let position = this.track.position(this.t, this.road, this.toRoad);
            this.group.position.copy(position[0]);
            // Find the tangent (the track provides it)
            this.group.lookAt(position[1]);
            if (this.t >= this.track.length) {
                // Move to the next track
                this.track = this.track.tracks[this.toRoad];
                // The previous track is in the opposite direction of the next track (0 vs 2 and 1 vs 3)
                this.road = (this.toRoad + 2) % 4;
                // Pick the next, next track
                this.toRoad = this.track.pickDirection(this.road);
                // Reset the arc-length parameter
                this.t = 0;
            }
        }
        // Turn lights on and off based on the time of day
        if (timeOfDay >= 6 && timeOfDay <= 19) this.headLights.forEach(light => light.visible = false);
        else this.headLights.forEach(light => light.visible = true);
    }
}

/**
* Draw a polygon shape with four vertices using THREE.BufferGeometry, *for future use only, not Spring 2021*
* @param {number[]} vertexList The list of vertices
* @param {Boolean} flip Whether to flip the face (look at the other side)
* @param {number[]} uvList The list uvs
* @returns {T.BufferGeometry}
*/
export function polygonBuffer(vertexList = [], flip = false, uvList = [0, 0, 0, 1, 1, 1, 1, 0]) {
    // Set the vertices
    /** @type {T.Geometry} */ const geometry = new T.BufferGeometry();

    // Set the faces, flip means the texture is on the other side
    let vertices = [];
    let faces = [];
    if (flip) {
        faces = [0, 3, 2, 2, 1, 0];
    } else {
        faces = [0, 1, 2, 2, 3, 0];
    }
    for (let i = 0; i < faces.length; i++) {
        vertices.push(vertexList[3 * faces[i]], vertexList[3 * faces[i] + 1], vertexList[3 * faces[i] + 2]);
    }
    geometry.setAttribute('position', new T.BufferAttribute(new Float32Array(vertices), 3));

    // Set the uvs
    let faceVertexUvs = new Float32Array( [
    // The first triangle
        uvList[0], uvList[1],
        uvList[2], uvList[3],
        uvList[4], uvList[5]
    ,
    // The second triangle
        uvList[4], uvList[5],
        uvList[6], uvList[7],
        uvList[0], uvList[1]
    ]);
    // Compute the normals

    geometry.setAttribute('uv', new T.BufferAttribute(faceVertexUvs, 2));
    geometry.computeVertexNormals();

    return geometry;
}

/** @type {number} */ let carCount = 0;
export class GrSUV extends GrCar {
    /**
     * The constructor
     * @param {Object} params Parameters
     */
    constructor(params = {}) {
        let newParams = Object.assign({ name: `SUV-${carColors[params.index || 0].name}-${++carCount}` }, params, carParams[0]);
        super(newParams);
    }
}

export class GrHatchBack extends GrCar {
    /**
     * The constructor
     * @param {Object} params Parameters
     */
    constructor(params = {}) {
        let newParams = Object.assign({ name: `HatchBack-${carColors[params.index || 0].name}-${++carCount}` }, params, carParams[1]);
        super(newParams);
    }
}

export class GrVan extends GrCar {
    /**
     * The constructor
     * @param {Object} params Parameters
     */
    constructor(params = {}) {
        let newParams = Object.assign({ name: `Van-${carColors[params.index || 0].name}-${++carCount}` }, params, carParams[2]);
        super(newParams);
    }
}