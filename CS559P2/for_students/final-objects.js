/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { GrCube } from "../libs/CS559-Framework/SimpleObjects.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";
import * as Loaders from "../libs/CS559-Framework/loaders.js";

/** @type {T.MeshPhongMaterial} */ const objCubeMaterial = new T.MeshPhongMaterial({ color: "rgb(30%, 60%, 70%)" });
export class GrObjCube extends Loaders.ObjGrObject {
    /**
     * The constructor
     * @param {Object} params Parameters
     */
    constructor(params = {}) {
        super({
            obj: "./cube.obj",
            name: "ObjCube"
        });
// Copy all the parameters with defaults
/** @type {number} */ const x = params.x || 0; // Position x
/** @type {number} */ const y = params.y || 0; // Position y
/** @type {number} */ const z = params.z || 0; // Position z
/** @type {number} */ const scale = params.scale || 1; // Scale
        // Put everything into the group and transform the group
        this.objects[0].position.set(x, y, z); // CS559 Sample Code
        this.objects[0].scale.set(scale, scale, scale);
        this.loaded = false;
    }
    /**
     * The animation function
     * @param {number} delta Time delta
     */
    stepWorld(delta = 0) {
        if (!this.loaded && this.objects[0].children[0]) {
/** @type {T.Mesh} */ const mesh = /** @type {T.Mesh} */(this.objects[0].children[0].children[0]);
            mesh.material = objCubeMaterial;
            this.loaded = true;
        }
        this.objects[0].rotateY(delta / 200);
    }
}

/** @type {T.BoxGeometry} */ const boxGeometry = new T.BoxGeometry();
/** @type {T.MeshPhongMaterial} */ const testCubeBaseMaterial = new T.MeshPhongMaterial({ color: "rgb(70%, 30%, 60%)" });
/** @type {T.MeshPhongMaterial} */ const testCubeTopMaterial = new T.MeshPhongMaterial({ color: "rgb(100%, 0%, 100%)" });
export class GrTestCube extends GrObject {
    /**
     * The constructor
     * @param {Object} params Parameters
     */
    constructor(params = {}) {
/** @type {T.Group} */ const cubeGroup = new T.Group();
        super("TestCube", cubeGroup);
// Copy all the parameters with defaults
/** @type {number} */ const x = params.x || 0; // Position x
/** @type {number} */ const y = params.y || 0; // Position y
/** @type {number} */ const z = params.z || 0; // Position z
/** @type {number} */ const scale = params.scale || 1; // Scale
/** @type {T.Mesh} */ const base = new T.Mesh(boxGeometry, testCubeBaseMaterial);
/** @type {T.Mesh} */ const top = new T.Mesh(boxGeometry, testCubeTopMaterial);
        // Set the transformations for the top
        top.translateY(0.75);
        top.scale.set(0.5, 0.5, 0.5);
        base.add(top);
        // Put everything into the group and transform the group
        cubeGroup.add(base);
        cubeGroup.position.set(x, y, z); // CS559 Sample Code
        cubeGroup.scale.set(scale, scale, scale);
        this.base = base;
    }
    /**
     * The animation function
     * @param {number} delta Time delta
     */
    stepWorld(delta = 0) {
        this.base.rotateY(delta / 400);
    }
}

const shaderMat = shaderMaterial("./final-shader.vs", "./final-shader.fs", { side: T.DoubleSide });
export class GrShadedCube extends GrCube {
    /**
     * The constructor
     * @param {Object} params Parameters
     */
    constructor(params = {}) {
        super({ material: shaderMat, x: params.x || 0, y: params.y || 0, z: params.z || 0, size: params.scale || 1 });
    }
}
