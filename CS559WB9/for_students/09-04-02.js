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

let parentOfCanvas = document.getElementById("div1");
let world = new GrWorld({ where: parentOfCanvas, groundplane: false, lookfrom: new T.Vector3(0, 0, -100), far: 20000 });

// Begin Example Solution
// set a constant to pick which texture to use
// this is the path to the set of 6 images, missing the "_Front.png" part
const envTextureBase = "Textures/HDRIHeaven/hdri_machine_shop_02_2k";

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

class Rock extends GrObject {
  constructor(params = {}) {
    let geometry = new T.SphereGeometry(1, 100, 100);
    let loader = new T.TextureLoader();
    let texture = loader.load("Textures/Rock/bc.jpg");
    let normal = loader.load("Textures/Rock/nl.jpg");
    let height = loader.load("Textures/Rock/ht.png");
    let ambient = loader.load("Textures/Rock/ao.jpg");
    let rough = loader.load("Textures/Rock/rg.jpg");
    let material = new T.MeshStandardMaterial({ map: texture, side: T.DoubleSide, normalMap: normal, displacementMap: height, aoMap: ambient, roughnessMap: rough });
    let mesh = new T.Mesh(geometry, material);
    let size = params.size || 1;
    mesh.scale.set(size, size, size);
    super("Rock", mesh);
  }
}

world.scene.background = cubeTextureHelp(envTextureBase);

let metal = new Rock({ size: 5 });
world.add(metal);
// End Example Solution

world.go();