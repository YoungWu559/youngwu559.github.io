/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

// define your buildings here - remember, they need to be imported
// into the "main" program

/** @type {String} */ const imageFolder = "./images/";
/** @type {GrRoad[]} */ const theTracks = [];
export class GrRoad extends GrObject {
    /**
     * The constructor
     * @param {String} name Name
     * @param {T.Group} objects The group
     */
    constructor(name = "GrRoad", objects = new T.Group()) {
        super(name, objects);
        // Push the road into the list of roads
        theTracks.push(this);
        // Store the roads this road is connected to in the four directions, east, south, west, north
        this.tracks = [undefined, undefined, undefined, undefined];
        // Store whether the road is an intersection
        this.intersection = true;
        // Store whether the road is in the system of interconnected roads
        this.system = false;
        // Each car came from a default direction: 0 - east, 1 - south, 2 - west, 3 - north
        this.road = 0;
        // Each road has a starting and ending point
        this.a = new T.Vector3();
        this.b = new T.Vector3();
    }
    /**
     * All GrRoads are required to have a position function
     * Calculate the position and the tangent (the position it looks at) at arc-length parameter t
     * @param {number} t The arc-length parameter
     * @param {number} road the direction the car came from: 0 - east, 1 - south, 2 - west, 3 - north
     * @param {number} toRoad the direction the car is going to: 0 - east, 1 - south, 2 - west, 3 - north
     * @returns {T.Vector3[]} [position, tangent]
     */
    position(t = 0, road = 0, toRoad = 2) {
        // Place the car at one endpoint looking at the other endpoint
        if (t < 0.5 && road >= 0 && toRoad >= 0) return [this.a, this.b];
        if (t >= 0.5 && road >= 0 && toRoad >= 0) return [this.b, this.a];
    }
    /**
     * Pick one of the four directions to go to
     * @param {number} road the direction the car came from: 0 - east, 1 - south, 2 - west, 3 - north
     * @returns {number} the direction the car is going to
     */
    pickDirection(road = 0) {
/** @type {number[]} */ const list = [];
        // If the road is not in the system, always stay on the road
        if (!this.system) return road;
        // Find the directions in which there is a road connecting to this road
        this.tracks.forEach(function (r, i) {
            if (r && i != road) list.push(i);
        });
        // If there are no roads connecting to this road, stay on the road
        if (list.length == 0) return road;
        // Otherwise pick a random road
        else return list[Math.floor(Math.random() * list.length)];
    }
    /**
     * Pick a random road to start the car on
     * @returns {GrRoad} the random road
     */
    randomTrack() {
        if (theTracks.length) {
/** @type {number[]} */ const list = [];
            // List the roads that are in the system and not an intersection
            theTracks.forEach(function (road, i) {
                if (road.system && !road.intersection) list.push(i);
            });
            // If there are roads available, pick a random road
            if (list.length) return theTracks[list[Math.floor(Math.random() * list.length)]];
            // Otherwise put the car at the origin
            else return this;
        }
        else return this;
    }
}

/** @type {number} */ let straightRoadCount = 0;
/** @type {T.PlaneGeometry} */ const planeGeometry = new T.PlaneGeometry();
/** @type {T.TextureLoader} */ const textureLoader = new T.TextureLoader();
/** @type {T.Texture} */ const roadTexture = textureLoader.load(imageFolder + "asphalt.png");
roadTexture.wrapS = T.RepeatWrapping;
/** @type {T.MeshPhongMaterial} */ const roadMaterial = new T.MeshPhongMaterial({ map: roadTexture });
export class GrStraightRoad extends GrRoad {
    /**
     * The constructor
     * @param {Object} params Parameters
     */
    constructor(params = {}) {
// Set up an empty group and call the GrObject constructor
/** @type {T.Group} */ const roadGroup = new T.Group();
        super(`StraightRoad-${++straightRoadCount}`, roadGroup);
// Copy all the parameters with defaults
/** @type {number} */ const width = params.width || 1;
/** @type {number} */ const ax = params.ax || 0; // Start position x
/** @type {number} */ const ay = params.ay || 0; // Start position y
/** @type {number} */ const az = params.az || 0; // Start position z
/** @type {number} */ const bx = params.bx || 0; // End position x
/** @type {number} */ const by = params.by || 0; // End position y
/** @type {number} */ const bz = params.bz || 0; // End position z
/** @type {number} */ let ux = bx - ax; // Vector perpendicular to the road x
/** @type {number} */ let uy = by - ay; // Vector perpendicular to the road y
/** @type {number} */ let uz = bz - az; // Vector perpendicular to the road z
/** @type {number} */ const length = Math.sqrt(ux * ux + uy * uy + uz * uz); // Length of the road
        ux /= length; // Normalize the vector
        uy = 0; // Assumes the vector is flat
        uz /= length; // Normalize the vector
        roadTexture.repeat.set(length / width, 1);
        roadMaterial.needsUpdate = true;
/** @type {T.Mesh} */ const road = new T.Mesh(planeGeometry, roadMaterial);
        // Set the transformations for the road
        road.scale.set(length, width * 2, 1);
        road.rotateX(-Math.PI * 0.5);
        road.rotateZ(Math.atan2(uz, ux));
        // Put everything into the group and transform the group
        roadGroup.add(road);
        roadGroup.position.set(0.5 * (ax + bx), 0.5 * (ay + by), 0.5 * (az + bz)); // CS559 Sample Code
        // The starting point of the road
        this.a = new T.Vector3(ax, ay, az);
        // The end point of the road
        this.b = new T.Vector3(bx, by, bz);
        // The vector perpendicular to the road (need this because there are two lanes)
        this.u = new T.Vector3(uz * width * 0.5, 0, -ux * width * 0.5);
        // Start with a random direction to assume that the car came from
        this.road = (Math.random() > 0.5 ? (ux == 0 ? 1 : 0) : (ux == 0 ? 3 : 2));
        // The length of the road (used for arc-length parameterization)
        this.length = length;
        // Straight roads are not intersections
        this.intersection = false;
        // Straight roads are in the system
        this.system = true;
    }
    /**
    * Calculate the position and the tangent (the position it looks at) at arc-length parameter t
    * @param {number} t The arc-length parameter
    * @param {number} road the direction the car came from: 0 - east, 1 - south, 2 - west, 3 - north
    * @param {number} toRoad the direction the car is going to: 0 - east, 1 - south, 2 - west, 3 - north
    * @returns {T.Vector3[]} [position, tangent]
    */
    position(t = 0, road = 0, toRoad = 2) {
// The arc-length parameter
/** @type {number} */ const u = t / this.length;
// Lane 1 and -1 for cars moving from a to b and b to a
/** @type {number} */ const lane = (toRoad - road) / 2;
// The starting point
/** @type {T.Vector3} */ const inn = lane > 0 ? this.a : this.b;
// The end point
/** @type {T.Vector3} */ const out = lane > 0 ? this.b : this.a;
        // Find the position (interpolation between the end points) and tangent vector (one of the end points)
        return [new T.Vector3().lerpVectors(inn, out, 1 - u).addScaledVector(this.u, lane), new T.Vector3().copy(out).addScaledVector(this.u, lane)];
    }
}

/** @type {number} */ let intersectionCount = 0;
/** @type {T.MeshPhongMaterial} */ const intersectionMaterial = new T.MeshPhongMaterial({ color: "rgb(20%, 20%, 20%)" });
export class GrIntersection extends GrRoad {
    /**
    * The constructor
    * @param {Object} params Parameters
    */
    constructor(params = {}) {
// Set up an empty group and call the GrObject constructor
/** @type {T.Group} */ const roadGroup = new T.Group();
        super(`Intersection-${++intersectionCount}`, roadGroup);
// Copy all the parameters with defaults
/** @type {number} */ const width = params.width || 1; // The width
/** @type {number} */ const cx = params.cx || 0; // Position x
/** @type {number} */ const cy = params.cy || 0; // Position y
/** @type {number} */ const cz = params.cz || 0; // Position z
/** @type {T.Mesh} */ const road = new T.Mesh(planeGeometry, intersectionMaterial);
        // Set the transformations for the road
        road.scale.set(width * 2, width * 2, 1);
        road.rotateX(-Math.PI * 0.5);
        // Put everything into the group and transform the group
        roadGroup.add(road);
        roadGroup.position.set(cx, cy, cz); // CS559 Sample Code
// The center of the intersection
/** @type {T.Vector3} */ const c = new T.Vector3(cx, cy, cz);
/** @type {GrIntersection} */ const intersection = this;
        // Find all (straight) roads connecting to this intersection
        theTracks.forEach(function (road) {
            if (!road.intersection) {
// Find the changes in x and z directions
/** @type {T.Vector3} */ const da = new T.Vector3().subVectors(c, road.a);
/** @type {T.Vector3} */ const db = new T.Vector3().subVectors(c, road.b);
/** @type {number} */ let update = -1; // Which direction put the road in: 0 - east, 1 - south, 2 - west, 3 - north
                if (da.x == 0) {
                    if (da.z == -width) update = 1; // CS559 Sample Code
                    else if (da.z == width) update = 3; // CS559 Sample Code
                }
                else if (da.z == 0) {
                    if (da.x == -width) update = 0; // CS559 Sample Code
                    else if (da.x == width) update = 2; // CS559 Sample Code
                }
                if (db.x == 0) {
                    if (db.z == -width) update = 1; // CS559 Sample Code
                    else if (db.z == width) update = 3; // CS559 Sample Code
                }
                else if (db.z == 0) {
                    if (db.x == -width) update = 0; // CS559 Sample Code
                    else if (db.x == width) update = 2; // CS559 Sample Code
                }
                if (update >= 0) {
                    // Update the road connecting to the intersection
                    road.tracks[(update + 2) % 4] = intersection;
                    // Update the intersection to connect to the road
                    intersection.tracks[update] = road;
                }
            }
        });
        // The center of the intersection
        this.c = c;
        // Store the width 
        this.u = [width, cy, width];
        // Start with 0 direction
        this.road = 0;
        // The length of the road (used for arc-length parameterization)
        this.length = 4 * width;
        // Intersection roads are intersections
        this.intersection = true;
        // Intersection roads are in the system
        this.system = true;
    }
    /**
    * Calculate the position and the tangent (the position it looks at) at arc-length parameter t
    * @param {number} t The arc-length parameter
    * @param {number} road the direction the car came from: 0 - east, 1 - south, 2 - west, 3 - north
    * @param {number} toRoad the direction the car is going to: 0 - east, 1 - south, 2 - west, 3 - north
    * @returns {T.Vector3[]} [position, tangent]
    */
    position(t = 0, road = 0, toRoad = 2) {
/** @type {number[]} */ let inn = [0, 0, 0, 0];
/** @type {number[]} */ let out = [0, 0, 0, 0];
/** @type {number} */ const width = this.u[0];
        // Starting point of the turn: 0 - east, 1 - south, 2 - west, 3 - north
        if (road == 0) inn = [width, -width * 0.5, -1, 0];
        else if (road == 1) inn = [width * 0.5, width, 0, -1];
        else if (road == 2) inn = [-width, width * 0.5, 1, 0];
        else if (road == 3) inn = [-width * 0.5, -width, 0, 1];
        // End point of the turn: 0 - east, 1 - south, 2 - west, 3 - north
        if (toRoad == 0) out = [width, width * 0.5, 1, 0];
        else if (toRoad == 1) out = [-width * 0.5, width, 0, 1];
        else if (toRoad == 2) out = [-width, -width * 0.5, -1, 0];
        else if (toRoad == 3) out = [-width * 0.5, -width, 0, -1];
// The radius of the circle the car is turning around
/** @type {number} */ const radius = Math.abs(inn[3] ? out[0] - inn[0] : out[1] - inn[1]);
// The arc-length parameter
/** @type {number} */ const u = t / this.length;
/** @type {T.Vector3} */ let pos = new T.Vector3().copy(this.c);
/** @type {T.Vector3} */ let dir = new T.Vector3();
        // The case the car is turning
        if ((road + toRoad) % 2) {
// The center of the circle the car is turning around
/** @type {number} */ const x = inn[3] ? out[0] : inn[0];
/** @type {number} */ const z = inn[2] ? out[1] : inn[1];
// The starting and ending angle of the circle the car is turning around
/** @type {number} */ let a0 = Math.atan2(inn[1] - z, inn[0] - x);
/** @type {number} */ let a1 = Math.atan2(out[1] - z, out[0] - x);
            // Make sure that a1 > a0
            if (a0 - a1 > Math.PI * 0.5) a1 += 2 * Math.PI;
            else if (a1 - a0 > Math.PI * 0.5) a0 += 2 * Math.PI;
// Interpolate the angles
/** @type {number} */ const a = (1 - u) * a0 + u * a1;
            // Find the position at u (x + r cos(a), y + r sin(a))
            pos = pos.add(new T.Vector3(x + radius * Math.cos(a), 0, z + radius * Math.sin(a)));
            // Find the tangent at u (r sin(u) du, -r cos(u) du), du is the derivative with respect to t / length
            dir = new T.Vector3().copy(pos).add(new T.Vector3(radius * Math.sin(a) * (a1 - a0), 0, -radius * Math.cos(a) * (a1 - a0)));
        }
        // The case the car is not turning
        else {
            // Find the position at u (interpolating between the start and end)
            pos = pos.add(new T.Vector3(inn[0], 0, inn[1]).lerp(new T.Vector3(out[0], 0, out[1]), u));
            // Find the tangent at u (the vector from the start to the end)
            dir = new T.Vector3().copy(pos).sub(new T.Vector3(out[0] - inn[0], 0, out[1] - inn[1]));
        }
        return [pos, dir];
    }
}

/** @type {number} */ let roundRoadCount = 0;
/** @type {T.RingGeometry} */ const ringGeometry = new T.RingGeometry(6, 8, 32);
export class GrRoundRoad extends GrRoad {
    /**
    * The constructor
    * @param {Object} params Parameters
    */
    constructor(params = {}) {
// Set up an empty group and call the GrObject constructor
/** @type {T.Group} */ const roadGroup = new T.Group();
        super(`RoundRoad-${++roundRoadCount}`, roadGroup);
// Copy all the parameters with defaults
/** @type {number} */ const width = params.width || 1; // The width
/** @type {number} */ const x = params.x || 0; // Position x
/** @type {number} */ const y = params.y || 0; // Position y
/** @type {number} */ const z = params.z || 0; // Position z
/** @type {T.Mesh} */ const road = new T.Mesh(ringGeometry, intersectionMaterial);
        // Set the transformations for the road
        road.scale.set(width, width, 1);
        road.rotateX(-Math.PI * 0.5);
        // Put everything into the group and transform the group
        roadGroup.add(road);
        roadGroup.position.set(x, y, z); // CS559 Sample Code
        this.tracks = [this, this, this, this];
        // The center of the track
        this.c = new T.Vector3(x, y, z);
        // Store the width
        this.u = width * 0.5;
        // Start with a random direction (clockwise or counter-clockwise)
        this.road = Math.random() > 0.5 ? 0 : 1;
        // The length of the road (used for arc-length parameterization)
        this.length = Math.PI * 2 * width * 7;
        // Round roads are not intersections
        this.intersection = false;
        // Round roads are not in the system
        this.system = false;
    }
    /**
    * Calculate the position and the tangent (the position it looks at) at arc-length parameter t
    * @param {number} t The arc-length parameter
    * @param {number} road the direction the car came from: 0 - east, 1 - south, 2 - west, 3 - north
    * @param {number} toRoad the direction the car is going to: 0 - east, 1 - south, 2 - west, 3 - north
    * @returns {T.Vector3[]} [position, tangent]
    */
    position(t = 0, road = 0, toRoad = 0) {
// Either the lane is 0 (clockwise) or 1 (counter-clockwise)
/** @type {number} */ const lane = road % 2 + toRoad % 2 - 1;
// The arc-length parameter
/** @type {number} */ const u = t / this.length * Math.PI * 2 * lane;
// The radius (depends on whether the lane is 0 or 1)
/** @type {number} */ const r = this.length / Math.PI * 0.5 + this.u * lane;
// Find the position at u (x + r cos(u), z + r sin(u))
/** @type {T.Vector3} */ const pos = new T.Vector3(this.c.x + r * Math.cos(u), this.c.y, this.c.z + r * Math.sin(u));
// Find the tangent at u (r sin(u) du, -r cos(u) du), du is the derivative with respect to t / length
/** @type {T.Vector3} */ const dir = new T.Vector3().copy(pos).add(new T.Vector3(r * Math.sin(u) * Math.PI * 2 * lane, 0, -r * Math.cos(u) * Math.PI * 2 * lane));
        return [pos, dir];
    }
}