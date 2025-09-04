/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as InputHelpers from "../libs/CS559/inputHelpers.js";
import {GrSphere, GrCube, GrCylinder} from "../libs/CS559-Framework/SimpleObjects.js";

let parentOfCanvas = document.getElementById("div1");
let world = new GrWorld({ where: parentOfCanvas });

// Begin Example Solution
// set a constant to pick which texture to use
// this is the path to the set of 6 images, missing the "_Front.png" part
const envTextureBase = "Textures/HDRIHeaven/rooituo";

/**
 * Read in a set of textures from HDRI Heaven, as converted by 
 * https://www.360toolkit.co/convert-spherical-equirectangular-to-cubemap
 * 
 * this uses a specific naming convention, and seems to (usually) swap bottom and front,
 * so I provide to undo this
 * 
 * @param {string} name 
 * @param {string} [ext="png"]
 * @param {boolean} [swapBottomFront=true]
 */
function cubeTextureHelp(name, ext = "png", swapBottomFront = true) {
  return new T.CubeTextureLoader().load([
    name + "_Right." + ext,
    name + "_Left." + ext,
    name + "_Top." + ext,
    name + (swapBottomFront ? "_Front." : "_Bottom.") + ext,
    name + "_Back." + ext,
    name + (swapBottomFront ? "_Bottom." : "_Front.") + ext
  ]);
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

export class ShinySculpture extends GrObject {
  /**
   * 
   * @param {GrWorld} world 
   */
  constructor(world, radius = 1) {
    let group = new T.Group();
    super("ShinySculpture", group);

    this.world = world;
    // note that we set the near distance of the camera just a little bit outside
    // of the sphere as a way to avoid feedback
    const cubeRenderTarget = new T.WebGLCubeRenderTarget( 128, { generateMipmaps: true, minFilter: T.LinearMipmapLinearFilter } );
    this.cubecam = new T.CubeCamera(radius * 1.1, 1000, cubeRenderTarget);
    this.sculptureGeom = new T.SphereGeometry(radius, 20, 10);
    this.sculptureMaterial = new T.MeshStandardMaterial(
      {
        color: "white",
        roughness: 0.2,
        metalness: .8,
        // @ts-ignore   // envMap has the wrong type
        envMap: this.cubecam.renderTarget.texture
      });
    this.sculpture = new T.Mesh(this.sculptureGeom, this.sculptureMaterial);
    group.add(this.cubecam);
    group.add(this.sculpture);

    group.translateY(2);
  }

  stepWorld(delta, timeOfDay) {
    this.cubecam.update(this.world.renderer, this.world.scene);
  }
}

export class Screen extends GrObject {
  /**
   * 
   * @param {GrWorld} world 
   */
  constructor(world, size=3) {
    let group = new T.Group();
    super("Screen", group);

    this.world = world;
    this.renderTarget = new T.WebGLRenderTarget( 128, 128, { generateMipmaps: true, minFilter: T.LinearMipmapLinearFilter } );
    this.cam = /** @type {THREE.PerspectiveCamera} */ new T.PerspectiveCamera(90, 1, 0.2, 50);
    this.cam.layers.set(0);
    this.cam.up.set( 0, 1, 0 );
    this.cam.translateX(2).translateY(2);

		this.cam.lookAt( -1, 0, 0 );
    this.screenGeom = polygonBuffer([0, 0, size/2, 0, size, size/2, 0, size, -size/2, 0, 0, -size/2, ]);
    this.screenMaterial = new T.MeshBasicMaterial(
      {
        map: new T.CanvasTexture(this.world.renderer.domElement),
        side: T.DoubleSide
      });
    this.screen = new T.Mesh(this.screenGeom, this.screenMaterial);
    // avoid feedback
    this.screen.layers.set(1);
    world.camera.layers.enable(1);

    group.add(this.cam);
    group.add(this.screen);
  }

  stepWorld(delta, timeOfDay) {
    let tmp = this.world.renderer.getRenderTarget();
    this.world.renderer.setRenderTarget(null);
    this.world.renderer.render(this.world.scene, this.cam);
    
    let texture = new T.CanvasTexture(this.world.renderer.domElement);
    this.screen.material = new T.MeshBasicMaterial(
      {
        map: texture,
        side: T.DoubleSide
      });
    this.screenMaterial.map.dispose();
    this.screenMaterial.dispose();
    this.screenMaterial = this.screen.material;

    this.world.renderer.setRenderTarget(tmp);
  }
}

let cubeTexture = cubeTextureHelp(envTextureBase)
world.scene.background = cubeTexture;

// some solid color things to look at
world.add(new GrCylinder({ x: -4, z: -4, y: 2.5, radius: .4, height: 5, color: "red" }));
world.add(new GrCylinder({ x: -4, z: 4, y: 2.5, radius: .4, height: 5, color: "purple" }));
world.add(new GrCylinder({ x: 4, z: 4, y: 2.5, radius: .4, height: 5, color: "yellow" }));
world.add(new GrCylinder({ x: -4, z: 0, y: 2.5, radius: .4, height: 5, color: "orange" }));
world.add(new GrCylinder({ x: 4, z: 0, y: 2.5, radius: .4, height: 5, color: "blue" }));
world.add(new GrCylinder({ x: 4, z: -4, y: 2.5, radius: .4, height: 5 }));

let s1 = new Screen(world, 5);
s1.setPos(-3, 3, 0);
world.add(s1);

let s2 = new ShinySculpture(world, 0.5);
world.add(s2);
s2.setPos(2, .5, 0);
let s2t = 0;

// when we over-write tick to make this object move, make sure we still call the old
// tick function that updates the map
s2.oldStepWorld = s2.stepWorld;
s2.stepWorld = function (delta) {
  s2t += delta;
  s2.setPos(3 * Math.cos(s2t / 1000), .5, 3 * Math.sin(s2t / 1000));
  s2.oldStepWorld(delta);
}

// a moving thing
let cube2 = new GrCube({ x: 0, y: .5, z: 2, color: "blue" });
world.add(cube2);
let cb2t = 0;
cube2.stepWorld = function (delta) { cb2t += delta; cube2.objects[0].position.x = 3 * Math.sin(cb2t / 500); }
// End Example Solution

world.go();

