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

/** @type {String} */ const imageFolder = "../images/";
/** @type {number} */ let simpleTree1Count = 0;
/** @type {T.ConeGeometry} */ const coneGeometry = new T.ConeGeometry();
/** @type {T.CylinderGeometry} */ const cylinderGeometry = new T.CylinderGeometry();
/** @type {T.MeshPhongMaterial} */ const greenMaterial = new T.MeshPhongMaterial({ color: "rgb(0%, 60%, 30%)" });
/** @type {T.MeshPhongMaterial} */ const yellowMaterial = new T.MeshPhongMaterial({ color: "rgb(60%, 50%, 30%)" });
export class GrSimpleTree1 extends GrObject {
  /**
   * The constructor
   * @param {Object} params Parameters
   */
  constructor(params = {}) {
    // Set up an empty group and call the GrObject constructor
    /** @type {T.Group} */ const treeGroup = new T.Group();
    super(`SimpleTree1-${++simpleTree1Count}`, treeGroup);
    // Copy all the parameters with defaults
    /** @type {number} */ const height = params.height || 1; // The height
    /** @type {number} */ const radius = params.radius || 1; // The radius
    /** @type {number} */ const x = params.x || 0; // Position x
    /** @type {number} */ const y = params.y || 0; // Position y
    /** @type {number} */ const z = params.z || 0; // Position z
    /** @type {number} */ const scale = params.scale || 1; // Scale
    /** @type {T.Mesh} */ const cone = new T.Mesh(coneGeometry, greenMaterial);
    /** @type {T.Mesh} */ const stem = new T.Mesh(cylinderGeometry, yellowMaterial);
    // Set the transformations for the cone
    cone.scale.set(radius, height * 0.75, radius);
    cone.translateY(height * (0.25 + 0.75 * 0.5)); // CS559 Sample Code
    // Set the transformations for the stem
    stem.scale.set(radius * 0.2, height * 0.25, radius * 0.2);
    stem.translateY(height * 0.25 * 0.5); // CS559 Sample Code
    // Put everything into the group and transform the group
    treeGroup.add(cone, stem);
    treeGroup.position.set(x, y, z);
    treeGroup.scale.set(scale, scale, scale);
  }
}

/** @type {number} */ let streetLightCount = 0;
/** @type {T.MeshPhongMaterial} */ const lightMaterial = new T.MeshPhongMaterial({ color: "rgb(100%, 100%, 0%)", transparent: true, opacity: 0.2 });
export class GrStreetLight extends GrObject {
  /**
   * The constructor
   * @param {Object} params Parameters
   */
  constructor(params = {}) {
    // Set up an empty group and call the GrObject constructor
    /** @type {T.Group} */ const streetLightGroup = new T.Group();
    super(`StreetLight-${++streetLightCount}`, streetLightGroup);
    // Copy all the parameters with defaults
    /** @type {number} */ const height = params.height || 1; // The height
    /** @type {number} */ const radius = params.radius || 1; // The radius
    /** @type {number} */ const pole = params.pole || 0; // The pole height
    /** @type {number} */ const x = params.x || 0; // Position x
    /** @type {number} */ const y = params.y || 0; // Position y
    /** @type {number} */ const z = params.z || 0; // Position z
    /** @type {number} */ const scale = params.scale || 1; // Scale
    /** @type {T.Mesh} */ const vStem = new T.Mesh(cylinderGeometry, yellowMaterial);
    /** @type {T.Mesh} */ const hStem = new T.Mesh(cylinderGeometry, yellowMaterial);
    /** @type {T.Mesh} */ const cone = new T.Mesh(coneGeometry, lightMaterial);
    // Set the transformations for the vertical stem
    vStem.scale.set(radius * 0.1, height, radius * 0.1);
    vStem.translateY(height * 0.5); // CS559 Sample Code
    // Set the transformations for the horizontal stem
    hStem.scale.set(radius * 0.1, radius, radius * 0.1);
    hStem.position.set(radius * 0.5, height, 0); // CS559 Sample Code
    hStem.rotateZ(Math.PI * 0.5);
    // Set the transformations for the cone
    cone.scale.set(radius, height, radius);
    cone.position.set(radius, height * 0.5, 0); // CS559 Sample Code
    // Put everything into the group and transform the group
    streetLightGroup.add(cone, vStem, hStem);
    streetLightGroup.position.set(x, y, z + pole); // CS559 Sample Code
    streetLightGroup.scale.set(scale, scale, scale);
    streetLightGroup.rotateY(Math.sign(pole) * Math.PI * 0.5);
  }
}

/** @type {number} */ let signCount = 0;
/** @type {T.MeshPhongMaterial} */ const whiteMaterial = new T.MeshPhongMaterial({ color: "white" });
/** @type {T.MeshPhongMaterial} */ const signMaterial = new T.MeshPhongMaterial({ color: "red" });
export class GrSign extends GrObject {
  /**
   * The constructor
   * @param {Object} params Parameters
   */
  constructor(params = {}) {
    // Set up an empty group and call the GrObject constructor
    /** @type {T.Group} */ const signGroup = new T.Group();
    super(`Sign-${++signCount}`, signGroup);
    // Copy all the parameters with defaults
    /** @type {number} */ const thickness = params.thickness || 1; // The thickness
    /** @type {number} */ const radius = params.radius || 1; // The radius
    /** @type {number} */ const x = params.x || 0; // Position x
    /** @type {number} */ const y = params.y || 0; // Position y
    /** @type {number} */ const z = params.z || 0; // Position z
    /** @type {number} */ const scale = params.scale || 1; // Scale
    /** @type {number} */ const rotate = params.rotate || 0; // Rotation y
    /** @type {T.Mesh} */ const stem = new T.Mesh(cylinderGeometry, whiteMaterial);
    /** @type {T.Mesh} */ const sign = new T.Mesh(cylinderGeometry, signMaterial);
    // Set the transformations for the stem
    stem.scale.set(thickness, radius * 2, thickness);
    stem.translateY(radius); // CS559 Sample Code
    // Set the transformations for the sign
    sign.scale.set(radius, thickness, radius);
    sign.translateY(radius * 3); // CS559 Sample Code
    sign.rotateX(Math.PI * 0.5);
    // Put everything into the group and transform the group
    signGroup.add(sign, stem);
    signGroup.position.set(x, y, z); // CS559 Sample Code
    signGroup.scale.set(scale, scale, scale);
    signGroup.rotateY(rotate);
  }
}

/** @type {number} */ let simpleHouse1Count = 0;
/** @type {T.BoxGeometry} */ const boxGeometry = new T.BoxGeometry();
/** @type {T.Shape} */ const triangle = new T.Shape();
triangle.moveTo(0, 1);
triangle.lineTo(-0.5, 0);
triangle.lineTo(0.5, 0);
triangle.lineTo(0, 1);
/** @type {T.ExtrudeGeometry} */ const triangleGeometry = new T.ExtrudeGeometry(triangle, { depth: 1, bevelEnabled: false });
/** @type {String[]} */ const houseColors = ["rgb(240, 240, 240)", "rgb(180, 175, 100)", "rgb(200, 100, 100)", "rgb(147, 144, 244)", "rgb(250, 249, 157)", "rgb(199, 144, 186)"];
/** @type {T.TextureLoader} */ const textureLoader = new T.TextureLoader();
/** @type {T.Texture} */ const simpleHouse1Texture = textureLoader.load(imageFolder + "simpleHouse1-front.png");
/** @type {T.MeshPhongMaterial[]} */ const simpleHouseMaterials = houseColors.map(c => new T.MeshPhongMaterial({ color: c }));
/** @type {T.MeshPhongMaterial[]} */ const simpleHouse1TextureMaterials = houseColors.map(c => new T.MeshPhongMaterial({ color: c, map: simpleHouse1Texture }));
export class GrSimpleHouse1 extends GrObject {
  /**
   * The constructor
   * @param {Object} params Parameters
   */
  constructor(params = {}) {
    // Set up an empty group and call the GrObject constructor
    /** @type {T.Group} */ const houseGroup = new T.Group();
    super(`SimpleHouse1-${++simpleHouse1Count}`, houseGroup);
    // Copy all the parameters with defaults
    /** @type {number} */ const length = params.length || 1; // The length
    /** @type {number} */ const width = params.width || 1; // The width
    /** @type {number} */ const height = params.height || 1; // The height
    /** @type {number} */ const x = params.x || 0; // Position x
    /** @type {number} */ const y = params.y || 0; // Position y
    /** @type {number} */ const z = params.z || 0; // Position z
    /** @type {number} */ const scale = params.scale || 1; // Scale
    /** @type {number} */ const color = params.index || 0; // Color
    /** @type {T.MeshPhongMaterial} */ const door = simpleHouse1TextureMaterials[color];
    /** @type {T.MeshPhongMaterial} */ const wall = simpleHouseMaterials[color];
    /** @type {T.Mesh} */ const base = new T.Mesh(boxGeometry, [wall, wall, wall, wall, door, door]);
    /** @type {T.Mesh} */ const roof = new T.Mesh(triangleGeometry, wall);
    // Set the transformations for the base
    base.scale.set(length, height, width);
    base.translateY(height * 0.5); // CS559 Sample Code
    // Set the transformations for the roof
    roof.scale.set(length, height * 0.5, width);
    roof.position.set(0, height, -width * 0.5); // CS559 Sample Code
    // Put everything into the group and transform the group
    houseGroup.add(base, roof);
    houseGroup.position.set(x, y, z); // CS559 Sample Code
    houseGroup.scale.set(scale, scale, scale);
  }
}

/** @type {number} */ let simpleHouse2Count = 0;
/** @type {T.Texture} */ const simpleHouse2Texture = textureLoader.load(imageFolder + "simpleHouse2-front.png");
/** @type {T.Texture} */ const simpleRoof2Texture = textureLoader.load(imageFolder + "roof3.png");
simpleRoof2Texture.rotation = Math.PI * 1.5;
simpleRoof2Texture.center.set(0.5, 0.5);
/** @type {T.MeshPhongMaterial[]} */ const simpleHouse2TextureMaterials = houseColors.map(c => new T.MeshPhongMaterial({ color: c, map: simpleHouse2Texture }));
/** @type {T.MeshPhongMaterial[]} */ const simpleRoof2Materials = houseColors.map(c => new T.MeshPhongMaterial({ color: c, map: simpleRoof2Texture }));
export class GrSimpleHouse2 extends GrObject {
  /**
   * The constructor
   * @param {Object} params Parameters
   */
  constructor(params = {}) {
    // Set up an empty group and call the GrObject constructor
    /** @type {T.Group} */ const houseGroup = new T.Group();
    super(`SimpleHouse2-${++simpleHouse2Count}`, houseGroup);
    // Copy all the parameters with defaults
    /** @type {number} */ const length = params.length || 1; // The length
    /** @type {number} */ const width = params.width || 1; // The width
    /** @type {number} */ const height = params.height || 1; // The height
    /** @type {number} */ const x = params.x || 0; // Position x
    /** @type {number} */ const y = params.y || 0; // Position y
    /** @type {number} */ const z = params.z || 0; // Position z
    /** @type {number} */ const scale = params.scale || 1; // Scale
    /** @type {number} */ const color = params.index || 0; // Color
    /** @type {T.MeshPhongMaterial} */ const door = simpleHouse2TextureMaterials[color];
    /** @type {T.MeshPhongMaterial} */ const wall = simpleHouseMaterials[color];
    /** @type {T.MeshPhongMaterial} */ const top = simpleRoof2Materials[color];
    /** @type {T.Mesh} */ const base = new T.Mesh(boxGeometry, [wall, wall, wall, wall, door, door]);
    /** @type {T.Mesh} */ const roof = new T.Mesh(triangleGeometry, [wall, top]);
    // Set the transformations for the base
    base.scale.set(length, height, width);
    base.translateY(height * 0.5); // CS559 Sample Code
    // Set the transformations for the roof
    roof.scale.set(width, height * 0.5, length);
    roof.position.set(-length * 0.5, height, 0); // CS559 Sample Code
    roof.rotateY(Math.PI * 0.5);
    // Put everything into the group and transform the group
    houseGroup.add(base, roof);
    houseGroup.position.set(x, y, z); // CS559 Sample Code
    houseGroup.scale.set(scale, scale, scale);
  }
}

/** @type {number} */ let simpleHouse3Count = 0;
/** @type {T.ConeGeometry} */ const pyramidGeometry = new T.ConeGeometry(1, 1, 4);
/** @type {T.Texture} */ const simpleHouse3Texture = textureLoader.load(imageFolder + "simpleHouse3-side.png");
/** @type {T.Texture} */ const simpleRoof3Texture = textureLoader.load(imageFolder + "roof3.png");
simpleRoof3Texture.wrapS = T.RepeatWrapping;
simpleRoof3Texture.repeat.set(4, 1);
/** @type {T.MeshPhongMaterial[]} */ const simpleHouse3TextureMaterials = houseColors.map(c => new T.MeshPhongMaterial({ color: c, map: simpleHouse3Texture }));
/** @type {T.MeshPhongMaterial[]} */ const simpleRoof3Materials = houseColors.map(c => new T.MeshPhongMaterial({ color: c, map: simpleRoof3Texture }));
export class GrSimpleHouse3 extends GrObject {
  /**
   * The constructor
   * @param {Object} params Parameters
   */
  constructor(params = {}) {
    // Set up an empty group and call the GrObject constructor
    /** @type {T.Group} */ const houseGroup = new T.Group();
    super(`SimpleHouse3-${++simpleHouse3Count}`, houseGroup);
    // Copy all the parameters with defaults
    /** @type {number} */ const length = params.length || 1; // The length
    /** @type {number} */ const width = params.width || 1; // The width
    /** @type {number} */ const height = params.height || 1; // The height
    /** @type {number} */ const x = params.x || 0; // Position x
    /** @type {number} */ const y = params.y || 0; // Position y
    /** @type {number} */ const z = params.z || 0; // Position z
    /** @type {number} */ const scale = params.scale || 1; // Scale
    /** @type {number} */ const color = params.index || 0; // Color
    /** @type {T.MeshPhongMaterial} */ const door = simpleHouse2TextureMaterials[color];
    /** @type {T.MeshPhongMaterial} */ const window = simpleHouse3TextureMaterials[color];
    /** @type {T.MeshPhongMaterial} */ const wall = simpleHouseMaterials[color];
    /** @type {T.MeshPhongMaterial} */ const top = simpleRoof3Materials[color];
    /** @type {T.Mesh} */ const base = new T.Mesh(boxGeometry, [window, window, wall, wall, door, door]);
    /** @type {T.Mesh} */ const roof = new T.Mesh(pyramidGeometry, top);
    // Set the transformations for the base
    base.scale.set(length, height, width);
    base.translateY(height * 0.5); // CS559 Sample Code
    // Set the transformations for the roof
    roof.scale.set(width * 0.5 * Math.SQRT2, height * 0.5, length * 0.5 * Math.SQRT2);
    roof.position.set(0, height * 1.25, 0); // CS559 Sample Code
    roof.rotateY(Math.PI * 0.25);
    // Put everything into the group and transform the group
    houseGroup.add(base, roof);
    houseGroup.position.set(x, y, z); // CS559 Sample Code
    houseGroup.scale.set(scale, scale, scale);
  }
}

/** @type {number} */ let churchCount = 0;
/** @type {T.Texture} */ const churchFrontTexture = textureLoader.load(imageFolder + "church-front.png");
/** @type {T.Texture} */ const churchSideTexture = textureLoader.load(imageFolder + "church-side.png");
/** @type {T.MeshPhongMaterial} */ const churchMaterial = new T.MeshPhongMaterial({ color: "rgb(60%, 70%, 80%)", flatShading: true });
/** @type {T.MeshPhongMaterial} */ const churchFrontMaterial = new T.MeshPhongMaterial({ color: "rgb(60%, 70%, 80%)", map: churchFrontTexture });
/** @type {T.MeshPhongMaterial} */ const churchSideMaterial = new T.MeshPhongMaterial({ color: "rgb(60%, 70%, 80%)", map: churchSideTexture });
export class GrChurch extends GrObject {
  /**
   * The constructor
   * @param {Object} params Parameters
   */
  constructor(params = {}) {
    // Set up an empty group and call the GrObject constructor
    /** @type {T.Group} */ const churchGroup = new T.Group();
    super(`Church-${++churchCount}`, churchGroup);
    // Copy all the parameters with defaults
    /** @type {number} */ const length = params.length || 1; // The length
    /** @type {number} */ const width = params.width || 1; // The width
    /** @type {number} */ const height = params.height || 1; // The height
    /** @type {number} */ const x = params.x || 0; // Position x
    /** @type {number} */ const y = params.y || 0; // Position y
    /** @type {number} */ const z = params.z || 0; // Position z
    /** @type {number} */ const scale = params.scale || 1; // Scale
    /** @type {T.MeshPhongMaterial} */ const door = churchFrontMaterial;
    /** @type {T.MeshPhongMaterial} */ const window = churchSideMaterial;
    /** @type {T.MeshPhongMaterial} */ const wall = churchMaterial;
    /** @type {T.Mesh} */ const base = new T.Mesh(boxGeometry, [window, window, wall, wall, door, door]);
    /** @type {T.Mesh} */ const roof = new T.Mesh(triangleGeometry, wall);
    /** @type {T.Mesh} */ const steeple = new T.Mesh(boxGeometry, wall);
    /** @type {T.Mesh} */ const top = new T.Mesh(pyramidGeometry, wall);
    // Set the transformations for the base
    base.scale.set(length, height, width);
    base.translateY(height * 0.5); // CS559 Sample Code
    // Set the transformations for the roof
    roof.scale.set(length, length * 0.25, width);
    roof.position.set(0, height, -0.5 * width); // CS559 Sample Code
    // Set the transformations for the steeple
    steeple.scale.set(width * 0.25, length, width * 0.25);
    steeple.position.set(0, length * 0.5, width * 0.5); // CS559 Sample Code
    // Set the transformations for the top
    top.scale.set(width * 0.125 * Math.SQRT2, length, width * 0.125 * Math.SQRT2);
    top.position.set(0, length * 1.5, width * 0.5); // CS559 Sample Code
    top.rotateY(Math.PI * 0.25);
    // Put everything into the group and transform the group
    churchGroup.add(base, roof, steeple, top);
    churchGroup.position.set(x, y, z); // CS559 Sample Code
    churchGroup.scale.set(scale, scale, scale);
  }
}

/** @type {number} */ let lawnCount = 0;
/** @type {T.PlaneGeometry} */ const planeGeometry = new T.PlaneGeometry();
/** @type {T.Texture} */ const lawnTexture = textureLoader.load(imageFolder + "grass.png");
lawnTexture.wrapS = T.RepeatWrapping;
lawnTexture.wrapT = T.RepeatWrapping;
lawnTexture.repeat.set(25, 50);
/** @type {T.MeshPhongMaterial} */ const lawnMaterial = new T.MeshPhongMaterial({ map: lawnTexture });
export class GrLawn extends GrObject {
  /**
   * The constructor
   * @param {Object} params Parameters
   */
  constructor(params = {}) {
    // Set up an empty group and call the GrObject constructor
    /** @type {T.Group} */ const lawnGroup = new T.Group();
    super(`Lawn-${++lawnCount}`, lawnGroup);
    // Copy all the parameters with defaults
    /** @type {number} */ const length = params.length || 1; // The length
    /** @type {number} */ const width = params.width || 1; // The width
    /** @type {number} */ const x = params.x || 0; // Position x
    /** @type {number} */ const y = params.y || 0; // Position y
    /** @type {number} */ const z = params.z || 0; // Position z
    /** @type {number} */ const scale = params.scale || 1; // Scale
    /** @type {T.Mesh} */ const lawn = new T.Mesh(planeGeometry, lawnMaterial);
    // Set the transformations for the lawn
    lawn.scale.set(length, width, 1); // CS559 Sample Code
    lawn.rotateX(-Math.PI * 0.5);
    // Put everything into the group and transform the group
    lawnGroup.add(lawn);
    lawnGroup.position.set(x, y, z); // CS559 Sample Code
    lawnGroup.scale.set(scale, scale, scale);
  }
}

/** @type {number} */ let simpleLotCount = 0;
export class GrSimpleLot extends GrObject {
  /**
   * The constructor
   * @param {Object} params Parameters
   */
  constructor(params = {}) {
    // Set up an empty group and call the GrObject constructor
    /** @type {T.Group} */ const simpleLotGroup = new T.Group();
    super(`SimpleLot-${++simpleLotCount}`, simpleLotGroup);
    // Copy all the parameters with defaults
    /** @type {number} */ const x = params.x || 0; // Position x
    /** @type {number} */ const y = params.y || 0; // Position y
    /** @type {number} */ const z = params.z || 0; // Position z
    /** @type {number} */ const scale = params.scale || 1; // Scale
    /** @type {number} */ const rotate = params.rotate || 0; // Rotation y
    /** @type {number} */ const ht = params.ht || 1; // House type
    /** @type {number} */ const hc = params.hc || 1; // House color
    if (rotate >= 0) {
      /** @type {GrLawn} */ const lawn = new GrLawn({ length: 100, width: 200, x: 50, z: 100 });
      simpleLotGroup.add(...lawn.objects);
    }
    /** @type {GrSimpleHouse1|GrSimpleHouse2|GrSimpleHouse3} */ let house;
    if (ht == 0) house = new GrSimpleHouse1({ length: 40, width: 50, height: 30, x: 50, z: 60, index: hc });
    if (ht == 1) house = new GrSimpleHouse2({ length: 60, width: 40, height: 30, x: 50, z: 60, index: hc });
    if (ht == 2) house = new GrSimpleHouse3({ length: 40, width: 40, height: 30, x: 50, z: 60, index: hc });
    // Put everything into the group and transform the group
    simpleLotGroup.add(...house.objects);
    /** @type {GrSimpleTree1} */ const tree = new GrSimpleTree1({ height: 15, radius: 5, x: 10, z: 10 });
    simpleLotGroup.add(...tree.objects);
    for (let i = 0; i < 4; i++) {
      /** @type {GrSimpleTree1} */ const tree = new GrSimpleTree1({ height: 15, radius: 5, x: 10 + 20 * i, z: 190 });
      simpleLotGroup.add(...tree.objects);
    }
    simpleLotGroup.position.set(x, y, z); // CS559 Sample Code
    simpleLotGroup.scale.set(scale, scale, scale);
    simpleLotGroup.rotateY(rotate);
  }
}

/** @type {number} */ let simpleSubdivisionCount = 0;
export class GrSimpleSubdivision extends GrObject {
  /**
   * The constructor
   * @param {Object} params Parameters
   */
  constructor(params = {}) {
    // Set up an empty group and call the GrObject constructor
    /** @type {T.Group} */ const subdivisionGroup = new T.Group();
    super(`SimpleSubdivision-${++simpleSubdivisionCount}`, subdivisionGroup);
    // Copy all the parameters with defaults
    /** @type {number} */ const x = params.x || 0; // Position x
    /** @type {number} */ const y = params.y || 0; // Position y
    /** @type {number} */ const z = params.z || 0; // Position z
    /** @type {number} */ const scale = params.scale || 1; // Scale
    /** @type {number} */ const nh = params.nh || 1; // Number of houses
    // Put everything into the group and transform the group
    for (let i = 0; i < nh; i++) {
      /** @type {GrStreetLight} */ const streetLight = new GrStreetLight({ height: 20, radius: 10, pole: i % 2 ? 9 : -9, x: i * 100 + 25, z: i % 2 ? 8 : -9 });
      subdivisionGroup.add(...streetLight.objects);
    }
    for (let i = 0; i < nh; i++) {
      /** @type {GrSimpleLot} */ const lot1 = new GrSimpleLot({ ht: Math.floor(Math.random() * 3), hc: Math.floor(Math.random() * houseColors.length), x: i * 100, z: 15 });
      /** @type {GrSimpleLot} */ const lot2 = new GrSimpleLot({ ht: Math.floor(Math.random() * 3), hc: Math.floor(Math.random() * houseColors.length), x: i * 100 + 100, z: -15, rotate: Math.PI });
      subdivisionGroup.add(...lot1.objects, ...lot2.objects);
    }
    /** @type {GrSign} */ const stop1 = new GrSign({ radius: 2, thickness: 0.1, x: 100 * nh - 2, z: 17, rotate: -Math.PI * 0.5 });
    /** @type {GrSign} */ const stop2 = new GrSign({ radius: 2, thickness: 0.1, x: 2, z: -17, rotate: Math.PI * 0.5 });
    subdivisionGroup.add(...stop1.objects, ...stop2.objects);
    subdivisionGroup.position.set(x, y, z); // CS559 Sample Code
    subdivisionGroup.scale.set(scale, scale, scale);
  }
}