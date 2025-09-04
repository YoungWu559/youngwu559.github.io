/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/*jshint -W008, esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

function degreesToRadians(deg) {
  return (deg * Math.PI) / 180;
}

let craneObCtr = 0;

// A simple crane
/**
 * @typedef CraneProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrCrane extends GrObject {
  /**
   * @param {CraneProperties} params
   */
  constructor(params = {}) {
    let crane = new T.Group();

    let exSettings = {
      steps: 2,
      depth: 0.5,
      bevelEnabled: false
    };

    // first, we define the base of the crane.
    // Just draw a curve for the shape, then use three's "ExtrudeGeometry"
    // to create the shape itself.
    /**@type THREE.Shape */
    let base_curve = new T.Shape();
    base_curve.moveTo(-0.5, 0);
    base_curve.lineTo(-0.5, 2);
    base_curve.lineTo(-0.25, 2.25);
    base_curve.lineTo(-0.25, 5);
    base_curve.lineTo(-0.2, 5);
    base_curve.lineTo(-0.2, 5.5);
    base_curve.lineTo(0.2, 5.5);
    base_curve.lineTo(0.2, 5);
    base_curve.lineTo(0.25, 5);
    base_curve.lineTo(0.25, 2.25);
    base_curve.lineTo(0.5, 2);
    base_curve.lineTo(0.5, 0);
    base_curve.lineTo(-0.5, 0);
    let base_geom = new T.ExtrudeGeometry(base_curve, exSettings);
    let crane_mat = new T.MeshStandardMaterial({
      color: "yellow",
      metalness: 0.5,
      roughness: 0.7
    });
    let base = new T.Mesh(base_geom, crane_mat);
    crane.add(base);
    base.translateZ(-0.25);

    // Use a similar process to create the cross-arm.
    // Note, we create a group for the arm, and move it to the proper position.
    // This ensures rotations will behave nicely,
    // and we just have that one point to work with for animation/sliders.
    let arm_group = new T.Group();
    crane.add(arm_group);
    arm_group.translateY(4.5);
    let arm_curve = new T.Shape();
    arm_curve.moveTo(-1.5, 0);
    arm_curve.lineTo(-1.5, 0.25);
    arm_curve.lineTo(-0.5, 0.5);
    arm_curve.lineTo(4, 0.4);
    arm_curve.lineTo(4, 0);
    arm_curve.lineTo(-1.5, 0);
    let arm_geom = new T.ExtrudeGeometry(arm_curve, exSettings);
    let arm = new T.Mesh(arm_geom, crane_mat);
    arm_group.add(arm);
    arm.translateZ(-0.25);

    // Finally, add the hanging "wire" for the crane arm,
    // which is what carries materials in a real crane.
    // The extrusion makes this not look very wire-like, but that's fine for what we're doing.
    let wire_group = new T.Group();
    arm_group.add(wire_group);
    wire_group.translateX(3);
    let wire_curve = new T.Shape();
    wire_curve.moveTo(-0.25, 0);
    wire_curve.lineTo(-0.25, -0.25);
    wire_curve.lineTo(-0.05, -0.3);
    wire_curve.lineTo(-0.05, -3);
    wire_curve.lineTo(0.05, -3);
    wire_curve.lineTo(0.05, -0.3);
    wire_curve.lineTo(0.25, -0.25);
    wire_curve.lineTo(0.25, 0);
    wire_curve.lineTo(-0.25, 0);
    let wire_geom = new T.ExtrudeGeometry(wire_curve, exSettings);
    let wire_mat = new T.MeshStandardMaterial({
      color: "#888888",
      metalness: 0.6,
      roughness: 0.3
    });
    let wire = new T.Mesh(wire_geom, wire_mat);
    wire_group.add(wire);
    wire.translateZ(-0.25);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    // This is also where we define parameters for UI sliders.
    // These have format "name," "min", "max", "starting value."
    // Sliders are standardized to have 30 "steps" per slider,
    // so if your starting value does not fall on one of the 30 steps,
    // the starting value in the UI may be slightly different from the starting value you gave.
    super(`Crane-${craneObCtr++}`, crane, [
      ["x", -4, 4, 0],
      ["z", -4, 4, 0],
      ["theta", 0, 360, 0],
      ["wire", 1, 3.5, 2],
      ["arm_rotation", 0, 360, 0]
    ]);
    // Here, we store the crane, arm, and wire groups as part of the "GrCrane" object.
    // This allows us to modify transforms as part of the update function.
    this.whole_ob = crane;
    this.arm = arm_group;
    this.wire = wire_group;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    crane.scale.set(scale, scale, scale);
  }

  // Wire up the wire position and arm rotation to match parameters,
  // given in the call to "super" above.
  update(paramValues) {
    this.whole_ob.position.x = paramValues[0];
    this.whole_ob.position.z = paramValues[1];
    this.whole_ob.rotation.y = degreesToRadians(paramValues[2]);
    this.wire.position.x = paramValues[3];
    this.arm.rotation.y = degreesToRadians(paramValues[4]);
  }
}

let excavatorObCtr = 0;

// A simple excavator
/**
 * @typedef ExcavatorProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrExcavator extends GrObject {
  /**
   * @param {ExcavatorProperties} params
   */
  constructor(params = {}) {
    let excavator = new T.Group();

    let exSettings = {
      steps: 2,
      depth: 0.4,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.1,
      bevelSegments: 2
    };

    // As with the crane, we define the base (treads) of the excavator.
    // We draw a line, then extrude the line with ExtrudeGeometry,
    // to get the "cutout" style object.
    // Note, for this object, we translate each piece by 0.25 on the negative x-axis.
    // This makes rotation about the y-axis work nicely
    // (since the extrusion happens along +z, a y-rotation goes around an axis on the back face of the piece,
    //  rather than an axis through the center of the piece).
    /**@type THREE.Shape */
    let base_curve = new T.Shape();
    base_curve.moveTo(-1, 0);
    base_curve.lineTo(-1.2, 0.2);
    base_curve.lineTo(-1.2, 0.4);
    base_curve.lineTo(-1, 0.6);
    base_curve.lineTo(1, 0.6);
    base_curve.lineTo(1.2, 0.4);
    base_curve.lineTo(1.2, 0.2);
    base_curve.lineTo(1, 0);
    base_curve.lineTo(-1, 0);
    let base_geom = new T.ExtrudeGeometry(base_curve, exSettings);
    let excavator_mat = new T.MeshStandardMaterial({
      color: "yellow",
      metalness: 0.5,
      roughness: 0.7
    });
    let base = new T.Mesh(base_geom, excavator_mat);
    excavator.add(base);
    base.translateZ(-0.2);

    // We'll add the "pedestal" piece for the cab of the excavator to sit on.
    // It can be considered a part of the treads, to some extent,
    // so it doesn't need a group of its own.
    let pedestal_curve = new T.Shape();
    pedestal_curve.moveTo(-0.35, 0);
    pedestal_curve.lineTo(-0.35, 0.25);
    pedestal_curve.lineTo(0.35, 0.25);
    pedestal_curve.lineTo(0.35, 0);
    pedestal_curve.lineTo(-0.35, 0);
    let pedestal_geom = new T.ExtrudeGeometry(pedestal_curve, exSettings);
    let pedestal = new T.Mesh(pedestal_geom, excavator_mat);
    excavator.add(pedestal);
    pedestal.translateY(0.6);
    pedestal.translateZ(-0.2);

    // For the cab, we create a new group, since the cab should be able to spin on the pedestal.
    let cab_group = new T.Group();
    excavator.add(cab_group);
    cab_group.translateY(0.7);
    let cab_curve = new T.Shape();
    cab_curve.moveTo(-1, 0);
    cab_curve.lineTo(1, 0);
    cab_curve.lineTo(1.2, 0.35);
    cab_curve.lineTo(1, 0.75);
    cab_curve.lineTo(0.25, 0.75);
    cab_curve.lineTo(0, 1.5);
    cab_curve.lineTo(-0.8, 1.5);
    cab_curve.lineTo(-1, 1.2);
    cab_curve.lineTo(-1, 0);
    let cab_geom = new T.ExtrudeGeometry(cab_curve, exSettings);
    let cab = new T.Mesh(cab_geom, excavator_mat);
    cab_group.add(cab);
    cab.translateZ(-0.2);

    // Next up is the first part of the bucket arm.
    // In general, each piece is just a series of line segments,
    // plus a bit of extra to get the geometry built and put into a group.
    // We always treat the group as the "pivot point" around which the object should rotate.
    // It is helpful to draw the lines for extrusion with the zero at our desired "pivot point."
    // This minimizes the fiddling needed to get the piece placed correctly relative to its parent's origin.
    // The remaining few pieces are very similar to the arm piece.
    let arm_group = new T.Group();
    cab_group.add(arm_group);
    arm_group.position.set(-0.8, 0.5, 0);
    let arm_curve = new T.Shape();
    arm_curve.moveTo(-2.25, 0);
    arm_curve.lineTo(-2.35, 0.15);
    arm_curve.lineTo(-1, 0.5);
    arm_curve.lineTo(0, 0.25);
    arm_curve.lineTo(-0.2, 0);
    arm_curve.lineTo(-1, 0.3);
    arm_curve.lineTo(-2.25, 0);
    let arm_geom = new T.ExtrudeGeometry(arm_curve, exSettings);
    let arm_mat = new T.MeshStandardMaterial({
      color: "#888888",
      metalness: 0.6,
      roughness: 0.3
    });
    let arm = new T.Mesh(arm_geom, arm_mat);
    arm_group.add(arm);
    arm.translateZ(-0.2);

    let forearm_group = new T.Group();
    arm_group.add(forearm_group);
    forearm_group.position.set(-2.1, 0, 0);
    let forearm_curve = new T.Shape();
    forearm_curve.moveTo(-1.5, 0);
    forearm_curve.lineTo(-1.5, 0.1);
    forearm_curve.lineTo(0, 0.15);
    forearm_curve.lineTo(0.15, 0);
    forearm_curve.lineTo(-1.5, 0);
    let forearm_geom = new T.ExtrudeGeometry(forearm_curve, exSettings);
    let forearm = new T.Mesh(forearm_geom, arm_mat);
    forearm_group.add(forearm);
    forearm.translateZ(-0.2);

    let bucket_group = new T.Group();
    forearm_group.add(bucket_group);
    bucket_group.position.set(-1.4, 0, 0);
    let bucket_curve = new T.Shape();
    bucket_curve.moveTo(-0.25, -0.9);
    bucket_curve.lineTo(-0.5, -0.5);
    bucket_curve.lineTo(-0.45, -0.3);
    bucket_curve.lineTo(-0.3, -0.2);
    bucket_curve.lineTo(-0.15, 0);
    bucket_curve.lineTo(0.1, 0);
    bucket_curve.lineTo(0.05, -0.2);
    bucket_curve.lineTo(0.5, -0.7);
    bucket_curve.lineTo(-0.25, -0.9);
    let bucket_geom = new T.ExtrudeGeometry(bucket_curve, exSettings);
    let bucket = new T.Mesh(bucket_geom, arm_mat);
    bucket_group.add(bucket);
    bucket.translateZ(-0.2);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    // The parameters for sliders are also defined here.
    super(`Excavator-${excavatorObCtr++}`, excavator, [
      ["x", -10, 10, 0],
      ["z", -10, 10, 0],
      ["theta", 0, 360, 0],
      ["spin", 0, 360, 0],
      ["arm_rotate", 0, 50, 45],
      ["forearm_rotate", 0, 90, 45],
      ["bucket_rotate", -90, 45, 0]
    ]);
    // As with the crane, we save the "excavator" group as the "whole object" of the GrExcavator class.
    // We also save the groups of each object that may be manipulated by the UI.
    this.whole_ob = excavator;
    this.cab = cab_group;
    this.arm = arm_group;
    this.forearm = forearm_group;
    this.bucket = bucket_group;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    excavator.scale.set(scale, scale, scale);
  }

  // As with the crane, we wire up each saved group with the appropriate parameter defined in the "super" call.
  // Note, with the forearm, there is an extra bit of rotation added, which allows us to create a rotation offset,
  // while maintaining a nice 0-90 range for the slider itself.
  update(paramValues) {
    this.whole_ob.position.x = paramValues[0];
    this.whole_ob.position.z = paramValues[1];
    this.whole_ob.rotation.y = degreesToRadians(paramValues[2]);
    this.cab.rotation.y = degreesToRadians(paramValues[3]);
    this.arm.rotation.z = degreesToRadians(-paramValues[4]);
    this.forearm.rotation.z = degreesToRadians(paramValues[5]) + Math.PI / 16;
    this.bucket.rotation.z = degreesToRadians(paramValues[6]);
  }
}

// Begin Example Solution
let roboticArmObCtr = 0;

// A simple robotic arm
/**
 * @typedef RoboticArmProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrRoboticArm extends GrObject {
  /**
   * @param {RoboticArmProperties} params
   */
  constructor(params = {}) {
    /** @type {T.Group} */ const arm = new T.Group();
    // Create all the geometries
    /** @type {T.SphereGeometry} */ const sphere = new T.SphereGeometry();
    /** @type {T.CylinderGeometry} */ const cylinder = new T.CylinderGeometry();
    // Create all materials
    /** @type {T.MeshStandardMaterial} */ const yellow = new T.MeshStandardMaterial({ color: "yellow", metalness: 0.5, roughness: 0.7 });
    /** @type {T.MeshStandardMaterial} */ const black = new T.MeshStandardMaterial({ color: "#888888", metalness: 0.6, roughness: 0.3 });
    // Set up the lengths of the arm pieces
    /** @type {number[]} */ const lengths = [0.5, 2.5, 2, 1.5, 1];
    /** @type {number} */ const width = 0.5;
    /** @type {T.Group[]} */ const links = [];
    // Create the base
    /** @type {T.Group} */ const base = new T.Group();
    /** @type {T.Mesh} */ const baseSphere = new T.Mesh(cylinder, black);
    // Place the base
    baseSphere.translateY(lengths[0] * 0.5);
    baseSphere.scale.set(width * 2, lengths[0], width * 2);
    // Add the parts to the group
    base.add(baseSphere);
    // Add the group to the hierarchy
    links.push(base);
    arm.add(base);
    // Create the pieces of the arms (cylinders) and the links (spheres)
    for (let i = 1; i < lengths.length; i++) {
      // Create one link, one sphere plus one cylinder
      /** @type {T.Group} */ const link = new T.Group();
      /** @type {T.Mesh} */ const linkCylinder = new T.Mesh(cylinder, yellow);
      /** @type {T.Mesh} */ const linkSphere = new T.Mesh(sphere, black);
      // Place the arm and link
      linkCylinder.translateY(lengths[i] * 0.5);
      linkCylinder.scale.set(width * 0.75, lengths[i], width * 0.75);
      linkSphere.scale.set(width, width, width);
      // Add the parts to the group
      link.translateY(lengths[i - 1]);
      link.add(linkCylinder, linkSphere);
      // Add the group to the hierarchy
      links[i - 1].add(link);
      links.push(link);
    }
    // Create the gripper (sphere)
    /** @type {T.Group} */ const gripper = new T.Group();
    /** @type {T.Mesh} */ const gripperSphere = new T.Mesh(sphere, black);
    /** @type {T.Mesh} */ const gripperLeftHand = new T.Mesh(cylinder, yellow);
    /** @type {T.Mesh} */ const gripperRightHand = new T.Mesh(cylinder, yellow);
    // Place the left hand
    gripperLeftHand.position.set(-width * 0.25, width, 0);
    gripperLeftHand.scale.set(width * 0.25, 2 * width, width * 0.25);
    gripperLeftHand.rotateZ(Math.PI * 0.125);
    // Place the right hand
    gripperRightHand.position.set(width * 0.25, width, 0);
    gripperRightHand.scale.set(width * 0.25, 2 * width, width * 0.25);
    gripperRightHand.rotateZ(-Math.PI * 0.125);
    gripperSphere.scale.set(width, width, width);
    // Add the parts to the group
    gripper.translateY(lengths[lengths.length - 1]);
    gripper.add(gripperLeftHand, gripperRightHand, gripperSphere);
    // Add the group to the hierarchy
    links[lengths.length - 1].add(gripper);
    // Define the parameters
    super(`RoboticArm-${roboticArmObCtr++}`, arm, [
      ["x", -10, 10, 5],
      ["z", -10, 10, -5],
      ["theta", 0, 360, 0],
      ["waist_rotate", 0, 360, 90],
      ["shoulder_rotate", 0, 360, 90],
      ["elbow_rotate", 0, 360, 90],
      ["wrist_rotate", 0, 360, 270],
      ["gripper_rotate", 0, 360, 270],
      ["config", 0, 2, 0, 1]
    ]);
    // Copy the groups for the parts so that they can be used in the UI
    this.arm = arm;
    this.waist = links[1];
    this.shoulder = links[2];
    this.elbow = links[3];
    this.wrist = links[4];
    this.gripper = gripper;
    // Set the positions
    arm.position.x = params.x ? Number(params.x) : 0;
    arm.position.y = params.y ? Number(params.y) : 0;
    arm.position.z = params.z ? Number(params.z) : 0;
    // Se the scales
    let scale = params.size ? Number(params.size) : 1;
    arm.scale.set(scale, scale, scale);
  }
  /**
   * Update according to the parameters
   * @param {number[]} paramValues The parameters
   */
  update(paramValues) {
    // Update the position
    this.arm.position.x = paramValues[0];
    this.arm.position.z = paramValues[1];
    this.arm.rotation.y = degreesToRadians(paramValues[2]);
    // Pre-set configuration 1: the arms form 90 degrees to each other
    if (paramValues[8] == 1) paramValues = [0, 0, 0, 90, 90, 90, 270, 270];  // CS559 Sample Code
    // Pre-set configuration 2: the arms form a straight line
    else if (paramValues[8] == 2) paramValues = [0, 0, 0, 360, 360, 360, 360, 360];  // CS559 Sample Code
    // Rotate the arms
    this.waist.rotation.y = degreesToRadians(paramValues[3]);
    this.shoulder.rotation.x = degreesToRadians(paramValues[4]);
    this.elbow.rotation.x = degreesToRadians(paramValues[5]);
    this.wrist.rotation.x = degreesToRadians(paramValues[6]);
    this.gripper.rotation.y = degreesToRadians(paramValues[7]);
  }
}

// A crane that has a wrecking ball attached, made by Kevin Wilson
let wreckingBallObCtr = 0;
/**
 * @typedef WreckingBallProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrWreckingBall extends GrObject {
  /**
 * @param {WreckingBallProperties} params
 */
  constructor(params = {}) {
    let wreckingBall = new T.Group();

    let wbSettings = {
      steps: 2,
      depth: 0.4,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.1,
      bevelSegments: 2
    };

    // As with the crane, we define the base (treads) of the wrecking ball.
    // We draw a line, then extrude the line with ExtrudeGeometry,
    // to get the "cutout" style object.
    // This makes rotation about the y-axis work nicely
    // (since the extrusion happens along +z, a y-rotation goes around an axis on the back face of the piece,
    //  rather than an axis through the center of the piece).
    /**@type THREE.Shape */
    let base_curve = new T.Shape();
    base_curve.moveTo(-1, 0);
    base_curve.lineTo(-2.2, 0.4);
    base_curve.lineTo(-2.2, 0.8);
    base_curve.lineTo(-1, 0.8);
    base_curve.lineTo(1, 0.8);
    base_curve.lineTo(2.2, 0.8);
    base_curve.lineTo(2.2, 0.6);
    base_curve.lineTo(1, 0);
    base_curve.lineTo(-1, 0);
    let base_geom = new T.ExtrudeGeometry(base_curve, wbSettings);
    let wreckingBall_mat = new T.MeshStandardMaterial({
      color: "yellow",
      metalness: 0.5,
      roughness: 0.7
    });
    let base = new T.Mesh(base_geom, wreckingBall_mat);
    wreckingBall.add(base);
    base.translateZ(-0.2);  // CS559 Sample Code

    // We'll add the "pedestal" piece for the cab of the wrecking ball to sit on.
    // It can be considered a part of the treads, to some extent,
    // so it doesn't need a group of its own.
    let pedestal_curve = new T.Shape();
    pedestal_curve.moveTo(-0.35, 0);
    pedestal_curve.lineTo(-0.35, 0.25);
    pedestal_curve.lineTo(0.35, 0.25);
    pedestal_curve.lineTo(0.35, 0);
    pedestal_curve.lineTo(-0.35, 0);
    let pedestal_geom = new T.ExtrudeGeometry(pedestal_curve, wbSettings);
    let pedestal = new T.Mesh(pedestal_geom, wreckingBall_mat);
    wreckingBall.add(pedestal);
    pedestal.translateY(0.6);  // CS559 Sample Code
    pedestal.translateZ(-0.2);

    // For the cab, we create a new group, since the cab should be able to spin on the pedestal.
    let cab_group = new T.Group();
    wreckingBall.add(cab_group);
    cab_group.translateY(0.7);  // CS559 Sample Code
    let cab_curve = new T.Shape();
    cab_curve.moveTo(-1, 0);
    cab_curve.lineTo(1, 0);
    cab_curve.lineTo(1.2, 0.35);
    cab_curve.lineTo(1, 1.75);
    cab_curve.lineTo(0.25, 1.75);
    cab_curve.lineTo(0, 1.5);
    cab_curve.lineTo(-0.8, 1.5);
    cab_curve.lineTo(-1, 1.2);
    cab_curve.lineTo(-1, 0);
    let cab_geom = new T.ExtrudeGeometry(cab_curve, wbSettings);
    let cab = new T.Mesh(cab_geom, wreckingBall_mat);
    cab_group.add(cab);
    cab.translateZ(-0.2);

    // Next up is the first part of the crane arm arm.
    // In general, each piece is just a series of line segments,
    // plus a bit of extra to get the geometry built and put into a group.
    // We always treat the group as the "pivot point" around which the object should rotate.
    // It is helpful to draw the lines for extrusion with the zero at our desired "pivot point."
    // This minimizes the fiddling needed to get the piece placed correctly relative to its parent's origin.
    // The remaining few pieces are very similar to the arm piece.
    let arm_group = new T.Group();
    cab_group.add(arm_group);
    arm_group.position.set(-1, 0.4, 0);  // CS559 Sample Code
    let arm_curve = new T.Shape();
    arm_curve.moveTo(-4.25, 0);
    arm_curve.lineTo(-4.35, 0.15);
    arm_curve.lineTo(-1, 0.5);
    arm_curve.lineTo(0, 0.25);
    arm_curve.lineTo(-0.2, 0);
    arm_curve.lineTo(-1, 0.1);
    arm_curve.lineTo(-4.25, 0);
    let arm_geom = new T.ExtrudeGeometry(arm_curve, wbSettings);
    let arm_mat = new T.MeshStandardMaterial({
      color: "#888888",
      metalness: 0.6,
      roughness: 0.3
    });
    let arm = new T.Mesh(arm_geom, arm_mat);
    arm.rotation.z = (150);
    arm_group.add(arm);
    arm.translateZ(-0.2);

    let forearm_group = new T.Group();
    arm_group.add(forearm_group);
    forearm_group.position.set(-2.8, 2.8, 0);  // CS559 Sample Code
    let forearm_curve = new T.Shape();
    forearm_curve.moveTo(-4.5, 1);
    forearm_curve.lineTo(-4.5, 0.2);
    forearm_curve.lineTo(0, 0.15);
    forearm_curve.lineTo(0.15, 0);
    forearm_curve.lineTo(-4.5, 1);
    let forearm_geom = new T.ExtrudeGeometry(forearm_curve, wbSettings);
    let forearm = new T.Mesh(forearm_geom, arm_mat);
    forearm_group.add(forearm);
    forearm.rotateZ(50);
    forearm.translateZ(-0.2);

    // Create the chain for ball to swing on
    let chain_group = new T.Group();
    forearm_group.add(chain_group);
    chain_group.position.set(-4, 0, 0.2);
    let chain_geom = new T.CylinderGeometry(0.05, 0.14, 4, 100, 100);  // CS559 Sample Code
    let chain_mat = new T.MeshStandardMaterial({
      color: "blue",
      metalness: 1,
      roughness: 0.3,
      emissive: "blue",
      emissiveIntensity: 0.3
    });
    let chain = new T.Mesh(chain_geom, chain_mat);
    chain.rotation.z = (0);
    chain_group.add(chain);
    chain.translateZ(-0.2);

    // Create the wrecking ball
    let ball_group = new T.Group();
    chain_group.add(ball_group);
    ball_group.position.set(0, -2, 0);
    let ball_geom = new T.SphereGeometry(1, 100, 100);
    let ball_mat = new T.MeshPhongMaterial({
      color: "orange",
      shininess: 100,
      specular: "yellow",
      emissive: "red",
      emissiveIntensity: 0.3
    });
    let ball = new T.Mesh(ball_geom, ball_mat);
    ball_group.add(ball);
    ball.translateZ(-0.2);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    // The parameters for sliders are also defined here.
    super(`WreckingBall-${wreckingBallObCtr++}`, wreckingBall, [
      ["x", -10, 10, 0],
      ["z", -10, 10, 0],
      ["theta", 0, 360, 0],
      ["spin", 0, 360, 0],
      ["arm_rotate", -60, 60, 0],
      ["forearm_rotate", -12, 15, 0],
      ["ball_rotate_X", -9, 9, 0],
      ["ball_rotate_Z", -45, 6.5, 0]
    ]);
    // As with the crane, we save the "wreckingBall" group as the "whole object" of the GrWreckingBall class.
    // We also save the groups of each object that may be manipulated by the UI.
    this.whole_ob = wreckingBall;
    this.cab = cab_group;
    this.arm = arm_group;
    this.forearm = forearm_group;
    this.chain = chain_group;
    this.ball = ball_group;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    wreckingBall.scale.set(scale, scale, scale);
  }


  // As with the crane, we wire up each saved group with the appropriate parameter defined in the "super" call.
  // Note, with the chain, there is an extra bit of rotation added, which allows us to create a rotation offset,
  // while maintaining a nice 0-90 range for the slider itself.
  update(paramValues) {
    this.whole_ob.position.x = paramValues[0];
    this.whole_ob.position.z = paramValues[1];
    this.whole_ob.rotation.y = degreesToRadians(paramValues[2]);
    this.cab.rotation.y = degreesToRadians(paramValues[3]);
    this.arm.rotation.y = degreesToRadians(-paramValues[4]);
    this.forearm.rotation.z = degreesToRadians(paramValues[5]);
    this.chain.rotation.x = degreesToRadians(paramValues[6]);
    this.chain.rotation.z = degreesToRadians(paramValues[7]);
  }
}

// Forklift, made by Gia-Phong Nguyen 
let forkliftObcCtr = 0;
export class GrForklift extends GrObject {
  constructor(params = {}) {

    let forklift = new T.Group();

    // setup materials
    let mainMat = new T.MeshStandardMaterial({
      color: "yellow",
      metalness: 0.5,
      roughness: 0.7
    });
    let sideMat = new T.MeshStandardMaterial({
      color: "#dbb11a",
      metalness: 0.5,
      roughness: 0.7
    });
    let metalMat = new T.MeshStandardMaterial({
      color: "#888888",
      metalness: 0.5,
      roughness: 0.7
    });
    let exSettings = {
      steps: 2,
      depth: 2,
      bevelEnabled: true,
      bevelThickness: .4,
      bevelSize: .4,
      bevelSegments: 1
    };

    // main body
    let mainBodyGroup = new T.Group();

    let bodyShape = new T.Shape();
    bodyShape.moveTo(-3, 1);
    bodyShape.lineTo(-2, 3);
    bodyShape.lineTo(0, 3);
    bodyShape.lineTo(1, 1);
    bodyShape.lineTo(2, 1);
    bodyShape.lineTo(2, 0);
    bodyShape.lineTo(-3, 0);
    bodyShape.closePath();

    let bodyGeom = new T.ExtrudeGeometry(bodyShape, exSettings);
    let bodyMesh = new T.Mesh(bodyGeom, mainMat);
    mainBodyGroup.add(bodyMesh);

    // base of forklift arms
    let armGeom = new T.BoxGeometry(.5, 4, .5);  // CS559 Sample Code
    let armMesh1 = new T.Mesh(armGeom, mainMat);
    armMesh1.position.x = 2.3;
    armMesh1.position.z = .2;
    armMesh1.position.y = 2;
    let armMesh2 = new T.Mesh(armGeom, mainMat);
    armMesh2.position.x = 2.3;
    armMesh2.position.z = 1.8;
    armMesh2.position.y = 2;
    mainBodyGroup.add(armMesh1);
    mainBodyGroup.add(armMesh2);

    let wheelMat = new T.MeshStandardMaterial({
      color: "black",
      roughness: .6
    });

    // wheels
    let wheelGeom = new T.CylinderGeometry(.6, .6, 3.2);  // CS559 Sample Code
    let wheelMesh1 = new T.Mesh(wheelGeom, wheelMat);
    wheelMesh1.rotation.x = Math.PI / 2;
    wheelMesh1.position.z = 1;
    wheelMesh1.position.x = 1;
    let wheelMesh2 = new T.Mesh(wheelGeom, wheelMat);
    wheelMesh2.rotation.x = Math.PI / 2;
    wheelMesh2.position.z = 1;
    wheelMesh2.position.x = -2;

    mainBodyGroup.add(wheelMesh1);
    mainBodyGroup.add(wheelMesh2);

    forklift.add(mainBodyGroup);

    // extension lift
    let extensionGroup = new T.Group();

    let subArmGeom = new T.BoxGeometry(.2, 4, .3);  // CS559 Sample Code
    let sArmMesh1 = new T.Mesh(subArmGeom, sideMat);
    sArmMesh1.position.z = .2;
    sArmMesh1.position.y = 2;
    let sArmMesh2 = new T.Mesh(subArmGeom, sideMat);
    sArmMesh2.position.z = 1.8;
    sArmMesh2.position.y = 2;
    extensionGroup.add(sArmMesh1);
    extensionGroup.add(sArmMesh2);

    mainBodyGroup.add(extensionGroup);
    extensionGroup.position.x = 2.65;

    // fork
    let forkGroup = new T.Group();

    let forkBaseGeom = new T.BoxGeometry(.2, 1, 2);  // CS559 Sample Code
    let forkBaseMesh = new T.Mesh(forkBaseGeom, mainMat);
    forkBaseMesh.position.y = .42;
    forkGroup.add(forkBaseMesh);

    let forkArmGeom = new T.BoxGeometry(1.6, .05, .4);  // CS559 Sample Code
    let forkArm1 = new T.Mesh(forkArmGeom, sideMat);
    forkArm1.position.x = .8;
    forkArm1.position.z = .6;
    let forkArm2 = new T.Mesh(forkArmGeom, sideMat);
    forkArm2.position.x = .8;
    forkArm2.position.z = -.6;
    forkGroup.add(forkArm1);
    forkGroup.add(forkArm2);

    extensionGroup.add(forkGroup);
    forkGroup.position.x = .2;
    forkGroup.position.z = 1;

    // fork extrusion
    let forkArmExtrudeGeom = new T.BoxGeometry(1.6, .05, .3);  // CS559 Sample Code

    let forkExtrusionGroup = new T.Group();
    let forkExtrudeArm1 = new T.Mesh(forkArmExtrudeGeom, metalMat);
    forkExtrudeArm1.position.z = .6;
    let forkExtrudeArm2 = new T.Mesh(forkArmExtrudeGeom, metalMat);
    forkExtrudeArm2.position.z = -.6;
    forkExtrusionGroup.add(forkExtrudeArm1);
    forkExtrusionGroup.add(forkExtrudeArm2);

    forkGroup.add(forkExtrusionGroup);
    forkExtrusionGroup.position.x = 0.9;
    forkExtrusionGroup.position.y = 0.05;

    mainBodyGroup.position.z = -1;

    super(`Forklift-${forkliftObcCtr++}`, forklift, [
      ["x", -10, 10, 0],
      ["z", -10, 10, 0],
      ["theta", 0, 360, 0],
      ["Lift_extender_height", 0, 3.6, 0],
      ["Lift_height", 0, 3.6, 0],
      ["Fork_extrusion", 0, 1.2, 0]
    ]);

    this.wholeObject = forklift;
    this.extensionLifts = extensionGroup;
    this.forkPlatform = forkGroup;
    this.forkExtrudeArms = forkExtrusionGroup;

    this.wholeObject.position.x = params.x ? Number(params.x) : 0;
    this.wholeObject.position.y = params.y ? Number(params.y) + .21 : .21;
    this.wholeObject.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;

    forklift.scale.set(scale, scale, scale);
  }
  // update respective components position
  update(paramValues) {
    this.wholeObject.position.x = paramValues[0];
    this.wholeObject.position.z = paramValues[1];
    this.wholeObject.rotation.y = degreesToRadians(paramValues[2]);
    this.extensionLifts.position.y = paramValues[3];
    this.forkPlatform.position.y = paramValues[4];
    this.forkExtrudeArms.position.x = paramValues[5] + .9;
  }
}
// End Example Solution