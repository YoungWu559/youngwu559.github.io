/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/*jshint -W008, esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

let simpleRoundaboutObCtr = 0;
// A simple merry-go-round.
/**
 * @typedef SimpleRoundaboutProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrSimpleRoundabout extends GrObject {
  /**
   * @param {SimpleRoundaboutProperties} params
   */
  constructor(params = {}) {
    let simpleRoundabout = new T.Group();

    let base_geom = new T.CylinderGeometry(0.5, 1, 0.5, 16);
    let base_mat = new T.MeshStandardMaterial({
      color: "#888888",
      metalness: 0.5,
      roughness: 0.8
    });
    let base = new T.Mesh(base_geom, base_mat);
    base.translateY(0.25);
    simpleRoundabout.add(base);

    let platform_geom = new T.CylinderGeometry(2, 1.8, 0.3, 8, 4);
    let platform_mat = new T.MeshStandardMaterial({
      color: "blue",
      metalness: 0.3,
      roughness: 0.6
    });

    let platform_group = new T.Group();
    base.add(platform_group);
    platform_group.translateY(0.25);
    let platform = new T.Mesh(platform_geom, platform_mat);
    platform_group.add(platform);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`SimpleRoundabout-${simpleRoundaboutObCtr++}`, simpleRoundabout);
    this.whole_ob = simpleRoundabout;
    this.platform = platform_group;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    simpleRoundabout.scale.set(scale, scale, scale);
  }
  /**
   * StepWorld method
   * @param {*} delta 
   * @param {*} timeOfDay 
   */
  stepWorld(delta, timeOfDay) {
    this.platform.rotateY(0.005 * delta);
  }

}

let roundaboutObCtr = 0;
// A colorful merry-go-round, with handles and differently-colored sections.
/**
 * @typedef ColoredRoundaboutProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrColoredRoundabout extends GrObject {
  /**
   * @param {ColoredRoundaboutProperties} params
   */
  constructor(params = {}) {
    let roundabout = new T.Group();

    let base_geom = new T.CylinderGeometry(0.5, 1, 0.5, 16);
    let base_mat = new T.MeshStandardMaterial({
      color: "#888888",
      metalness: 0.5,
      roughness: 0.8
    });
    let base = new T.Mesh(base_geom, base_mat);
    base.translateY(0.25);
    roundabout.add(base);

    let platform_group = new T.Group();
    base.add(platform_group);
    platform_group.translateY(0.25);

    let section_geom = new T.CylinderGeometry(
      2,
      1.8,
      0.3,
      8,
      4,
      false,
      0,
      Math.PI / 2
    );
    let section_mat;
    let section;

    let handle_geom = buildHandle();
    let handle_mat = new T.MeshStandardMaterial({
      color: "#999999",
      metalness: 0.8,
      roughness: 0.2
    });
    let handle;

    // in the loop below, we add four differently-colored sections, with handles,
    // all as part of the platform group.
    let section_colors = ["red", "blue", "yellow", "green"];
    for (let i = 0; i < section_colors.length; i++) {
      section_mat = new T.MeshStandardMaterial({
        color: section_colors[i],
        metalness: 0.3,
        roughness: 0.6
      });
      section = new T.Mesh(section_geom, section_mat);
      handle = new T.Mesh(handle_geom, handle_mat);
      section.add(handle);
      handle.rotation.set(0, Math.PI / 4, 0);
      handle.translateZ(1.5);
      platform_group.add(section);
      section.rotateY((i * Math.PI) / 2);
    }

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`Roundabout-${roundaboutObCtr++}`, roundabout);
    this.whole_ob = roundabout;
    this.platform = platform_group;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    roundabout.scale.set(scale, scale, scale);

    // This helper function defines a curve for the merry-go-round's handles,
    // then extrudes a tube along the curve to make the actual handle geometry.
    function buildHandle() {
      /**@type THREE.CurvePath */
      let handle_curve = new T.CurvePath();
      handle_curve.add(
        new T.LineCurve3(new T.Vector3(-0.5, 0, 0), new T.Vector3(-0.5, 0.8, 0))
      );
      handle_curve.add(
        new T.CubicBezierCurve3(
          new T.Vector3(-0.5, 0.8, 0),
          new T.Vector3(-0.5, 1, 0),
          new T.Vector3(0.5, 1, 0),
          new T.Vector3(0.5, 0.8, 0)
        )
      );
      handle_curve.add(
        new T.LineCurve3(new T.Vector3(0.5, 0.8, 0), new T.Vector3(0.5, 0, 0))
      );
      return new T.TubeGeometry(handle_curve, 64, 0.1, 8);
    }
  }
  /**
   * StepWorld Method
   * @param {*} delta 
   * @param {*} timeOfDay 
   */
  stepWorld(delta, timeOfDay) {
    this.platform.rotateY(0.005 * delta);
  }


}

let simpleSwingObCtr = 0;

// A basic, one-seat swingset.
/**
 * @typedef SimpleSwingProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrSimpleSwing extends GrObject {
  /**
   * @param {SimpleSwingProperties} params
   */
  constructor(params = {}) {
    let simpleSwing = new T.Group();
    addPosts(simpleSwing);

    // Here, we create a "hanger" group, which the swing chains will hang from.
    // The "chains" for the simple swing are just a couple thin cylinders.
    let hanger = new T.Group();
    simpleSwing.add(hanger);
    hanger.translateY(1.8);
    let chain_geom = new T.CylinderGeometry(0.05, 0.05, 1.4);
    let chain_mat = new T.MeshStandardMaterial({
      color: "#777777",
      metalness: 0.8,
      roughness: 0.2
    });
    let l_chain = new T.Mesh(chain_geom, chain_mat);
    let r_chain = new T.Mesh(chain_geom, chain_mat);
    hanger.add(l_chain);
    hanger.add(r_chain);
    l_chain.translateY(-0.75);
    l_chain.translateZ(0.4);
    r_chain.translateY(-0.75);
    r_chain.translateZ(-0.4);

    let seat_group = new T.Group();
    let seat_geom = new T.BoxGeometry(0.4, 0.1, 1);
    let seat_mat = new T.MeshStandardMaterial({
      color: "#554433",
      metalness: 0.1,
      roughness: 0.6
    });
    let seat = new T.Mesh(seat_geom, seat_mat);
    seat_group.add(seat);
    seat_group.position.set(0, -1.45, 0);
    hanger.add(seat_group);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`SimpleSwing-${simpleSwingObCtr++}`, simpleSwing);
    this.whole_ob = simpleSwing;
    this.hanger = hanger;
    this.seat = seat_group;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    simpleSwing.scale.set(scale, scale, scale);

    this.swing_max_rotation = Math.PI / 4;
    this.swing_direction = 1;

    // This helper function creates the 5 posts for a swingset frame,
    // and positions them appropriately.
    function addPosts(group) {
      let post_material = new T.MeshStandardMaterial({
        color: "red",
        metalness: 0.6,
        roughness: 0.5
      });
      let post_geom = new T.CylinderGeometry(0.1, 0.1, 2, 16);
      let flPost = new T.Mesh(post_geom, post_material);
      group.add(flPost);
      flPost.position.set(0.4, 0.9, 0.9);
      flPost.rotateZ(Math.PI / 8);
      let blPost = new T.Mesh(post_geom, post_material);
      group.add(blPost);
      blPost.position.set(-0.4, 0.9, 0.9);
      blPost.rotateZ(-Math.PI / 8);
      let frPost = new T.Mesh(post_geom, post_material);
      group.add(frPost);
      frPost.position.set(0.4, 0.9, -0.9);
      frPost.rotateZ(Math.PI / 8);
      let brPost = new T.Mesh(post_geom, post_material);
      group.add(brPost);
      brPost.position.set(-0.4, 0.9, -0.9);
      brPost.rotateZ(-Math.PI / 8);
      let topPost = new T.Mesh(post_geom, post_material);
      group.add(topPost);
      topPost.position.set(0, 1.8, 0);
      topPost.rotateX(-Math.PI / 2);
    }
  }
  /* stepWorld method - make the swing swing! */
  stepWorld(delta, timeOfDay) {
    // if we swing too far forward or too far backward, switch directions.
    if (this.hanger.rotation.z >= this.swing_max_rotation)
      this.swing_direction = -1;
    else if (this.hanger.rotation.z <= -this.swing_max_rotation)
      this.swing_direction = 1;
    this.hanger.rotation.z += this.swing_direction * 0.003 * delta;
  }

}

let swingObCtr = 0;

// A more complicated, one-seat swingset.
// This one has actual chain links for its chains,
// and uses a nicer animation to give a more physically-plausible motion.
/**
 * @typedef AdvancedSwingProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrAdvancedSwing extends GrObject {
  /**
   * @param {AdvancedSwingProperties} params
   */
  constructor(params = {}) {
    let swing = new T.Group();
    addPosts(swing);

    let hanger = new T.Group();
    swing.add(hanger);
    hanger.translateY(1.8);
    let l_chain = new T.Group();
    let r_chain = new T.Group();
    hanger.add(l_chain);
    hanger.add(r_chain);
    // after creating chain groups, call the function to add chain links.
    growChain(l_chain, 20);
    growChain(r_chain, 20);
    l_chain.translateZ(0.4);
    r_chain.translateZ(-0.4);

    let seat_group = new T.Group();
    let seat_geom = new T.BoxGeometry(0.4, 0.1, 1);
    let seat_mat = new T.MeshStandardMaterial({
      color: "#554433",
      metalness: 0.1,
      roughness: 0.6
    });
    let seat = new T.Mesh(seat_geom, seat_mat);
    seat_group.add(seat);
    seat_group.position.set(0, -1.45, 0);
    hanger.add(seat_group);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`Swing-${swingObCtr++}`, swing);
    this.whole_ob = swing;
    this.hanger = hanger;
    this.seat = seat_group;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    swing.scale.set(scale, scale, scale);

    this.swing_angle = 0;

    // This helper function creates the 5 posts for a swingset frame,
    // and positions them appropriately.
    function addPosts(group) {
      let post_material = new T.MeshStandardMaterial({
        color: "red",
        metalness: 0.6,
        roughness: 0.5
      });
      let post_geom = new T.CylinderGeometry(0.1, 0.1, 2, 16);
      let flPost = new T.Mesh(post_geom, post_material);
      group.add(flPost);
      flPost.position.set(0.4, 0.9, 0.9);
      flPost.rotateZ(Math.PI / 8);
      let blPost = new T.Mesh(post_geom, post_material);
      group.add(blPost);
      blPost.position.set(-0.4, 0.9, 0.9);
      blPost.rotateZ(-Math.PI / 8);
      let frPost = new T.Mesh(post_geom, post_material);
      group.add(frPost);
      frPost.position.set(0.4, 0.9, -0.9);
      frPost.rotateZ(Math.PI / 8);
      let brPost = new T.Mesh(post_geom, post_material);
      group.add(brPost);
      brPost.position.set(-0.4, 0.9, -0.9);
      brPost.rotateZ(-Math.PI / 8);
      let topPost = new T.Mesh(post_geom, post_material);
      group.add(topPost);
      topPost.position.set(0, 1.8, 0);
      topPost.rotateX(-Math.PI / 2);
    }

    // Helper function to add "length" number of links to a chain.
    function growChain(group, length) {
      let chain_geom = new T.TorusGeometry(0.05, 0.015);
      let chain_mat = new T.MeshStandardMaterial({
        color: "#777777",
        metalness: 0.8,
        roughness: 0.2
      });
      let link = new T.Mesh(chain_geom, chain_mat);
      group.add(link);
      for (let i = 0; i < length; i++) {
        let l_next = new T.Mesh(chain_geom, chain_mat);
        l_next.translateY(-0.07);
        link.add(l_next);
        l_next.rotation.set(0, Math.PI / 3, 0);
        link = l_next;
      }
    }
  }
  /**
   * StepWorld method
   * @param {*} delta 
   * @param {*} timeOfDay 
   */
  stepWorld(delta, timeOfDay) {
    // in this animation, use the sine of the accumulated angle to set current rotation.
    // This means the swing moves faster as it reaches the bottom of a swing,
    // and faster at either end of the swing, like a pendulum should.
    this.swing_angle += 0.005 * delta;
    this.hanger.rotation.z = (Math.sin(this.swing_angle) * Math.PI) / 4;
    this.seat.rotation.z = (Math.sin(this.swing_angle) * Math.PI) / 16;
  }

}


let carouselObCtr = 0;
// A Carousel.
/**
 * @typedef CarouselProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrCarousel extends GrObject {
  /**
   * @param {CarouselProperties} params
   */
  constructor(params = {}) {
    let width = 3;
    let carousel = new T.Group();

    let base_geom = new T.CylinderGeometry(width, width, 1, 32);
    let base_mat = new T.MeshStandardMaterial({
      color: "lightblue",
      metalness: 0.3,
      roughness: 0.8
    });
    let base = new T.Mesh(base_geom, base_mat);
    base.translateY(0.5);
    carousel.add(base);

    let platform_group = new T.Group();
    base.add(platform_group);
    platform_group.translateY(0.5);

    let platform_geom = new T.CylinderGeometry(
      0.95 * width,
      0.95 * width,
      0.2,
      32
    );
    let platform_mat = new T.MeshStandardMaterial({
      color: "gold",
      metalness: 0.3,
      roughness: 0.8
    });
    let platform = new T.Mesh(platform_geom, platform_mat);
    platform_group.add(platform);

    let cpole_geom = new T.CylinderGeometry(0.3 * width, 0.3 * width, 3, 16);
    let cpole_mat = new T.MeshStandardMaterial({
      color: "gold",
      metalness: 0.8,
      roughness: 0.5
    });
    let cpole = new T.Mesh(cpole_geom, cpole_mat);
    platform_group.add(cpole);
    cpole.translateY(1.5);

    let top_trim = new T.Mesh(platform_geom, platform_mat);
    platform_group.add(top_trim);
    top_trim.translateY(3);

    let opole_geom = new T.CylinderGeometry(0.03 * width, 0.03 * width, 3, 16);
    let opole_mat = new T.MeshStandardMaterial({
      color: "#aaaaaa",
      metalness: 0.8,
      roughness: 0.5
    });
    let opole;
    let num_poles = 10;
    let poles = [];
    for (let i = 0; i < num_poles; i++) {
      opole = new T.Mesh(opole_geom, opole_mat);
      platform_group.add(opole);
      opole.translateY(1.5);
      opole.rotateY((2 * i * Math.PI) / num_poles);
      opole.translateX(0.8 * width);
      poles.push(opole);
    }

    let roof_geom = new T.ConeGeometry(width, 0.5 * width, 32, 4);
    let roof = new T.Mesh(roof_geom, base_mat);
    carousel.add(roof);
    roof.translateY(4.8);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`Carousel-${carouselObCtr++}`, carousel);
    this.whole_ob = carousel;
    this.platform = platform;
    this.poles = poles;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    carousel.scale.set(scale, scale, scale);
  }
}


let advancedCarouselObCtr = 0;

// Begin Example Solution
// A more advanced carousel that has more color, spins, and has 'horses' which move, made by Kevin Wilson
/**
 * @typedef AdvancedCarouselProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrAdvancedCarousel extends GrObject {
  /**
 * @param {AdvancedCarouselProperties} params
 */
  constructor(params = {}) {
    let width = 3;
    let advancedCarousel = new T.Group();

    let base_geom = new T.CylinderGeometry(width, width, 1, 32);
    let base_mat = new T.MeshPhongMaterial({
      color: "indigo",
      shininess: 20,
      //emissive : "orange",
      //emissiveIntensity : 0.5
    });
    let base = new T.Mesh(base_geom, base_mat);
    base.translateY(0.5);
    advancedCarousel.add(base);

    let platform_group = new T.Group();
    base.add(platform_group);
    platform_group.translateY(0.5);

    let platform_geom = new T.CylinderGeometry(
      0.95 * width,
      0.95 * width,
      0.2,
      32
    );
    let platform_mat = new T.MeshPhongMaterial({
      color: "#2d88a6",
      shininess: 30,
      emissive: "turquoise",
      emissiveIntensity: 0.3
    });
    let platform = new T.Mesh(platform_geom, platform_mat);
    platform_group.add(platform);

    let cpole_geom = new T.CylinderGeometry(0.3 * width, 0.3 * width, 3, 16);
    let cpole_mat = new T.MeshPhongMaterial({
      color: "#ab58fe",
      shininess: 100,
      emissive: "#ab58fe",
      emissiveIntensity: 0.1
    });
    let cpole = new T.Mesh(cpole_geom, cpole_mat);
    platform_group.add(cpole);
    cpole.translateY(1.5);

    let top_trim = new T.Mesh(platform_geom, platform_mat);
    platform_group.add(top_trim);
    top_trim.translateY(3);

    let horse_geometry = buildHorseThing();
    let horse;
    let horse_material;

    let opole_geom = new T.CylinderGeometry(0.03 * width, 0.03 * width, 3, 16);
    let opole_mat = new T.MeshStandardMaterial({
      color: "#999999",
      metalness: 0.8,
      roughness: 0.2
    });

    // set the # of poles you want on the carousel
    let opole;
    let num_poles = 10;
    let poles = [];
    let horses = [];
    // Create a list of 'horses', really just spheres for this solution
    let horse_color = ["red", "blue", "yellow", "green", "orange", "white", "turquoise", "magenta", "gold", "pink"]; // CS559 Sample Code

    // Add the 'horses' to the poles at varying heights
    for (let i = 0; i < num_poles; i++) {
      opole = new T.Mesh(opole_geom, opole_mat);

      horse_material = new T.MeshPhongMaterial({
        color: horse_color[i],
        shininess: 0.8,
        emissive: "red",
        emissiveIntensity: 0.5
      });

      horse = new T.Mesh(horse_geometry, horse_material);
      opole.add(horse);
      horse.translateY(0.1 * i); // CS559 Sample Code

      opole.translateY(1.5);
      opole.rotateY((2 * i * Math.PI) / num_poles);
      opole.translateX(0.8 * width);
      poles.push(opole);
      horses.push(horse);
      platform_group.add(opole);
    }

    let roof_geom = new T.ConeGeometry(width, 0.5 * width, 32, 4);
    let roof_mat = new T.MeshPhongMaterial({
      color: "purple",
      shininess: 100,

    });
    let roof = new T.Mesh(roof_geom, roof_mat);
    advancedCarousel.add(roof);
    roof.translateY(4.8);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`AdvancedCarousel-${advancedCarouselObCtr++}`, advancedCarousel);
    this.whole_ob = advancedCarousel;
    this.poles = poles;
    this.horses = horses;
    this.platform = platform_group;


    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    this.time = 0;
    let scale = params.size ? Number(params.size) : 1;
    advancedCarousel.scale.set(scale, scale, scale);

    this.tick = function (delta, timeOfDay) {

      this.time += delta / 1000; // time in seconds
      // set the y position based on the time
      let t = this.time % 1; // where are we in the cycle?

      let i = 0;
      for (i = 0; i < horses.length; i++) {
        if (t < 0.1 || t > 0.9) this.horses[i].position.y = -0.9;
        else {
          this.horses[i].position.y = -0.9 + 10 * (0.20 - (0.4 - t) * (0.5 - t));
        }
      }

      this.platform.rotateY(-0.003 * delta);

    };

    // This helper function creates 'horse' objects for the carousel
    function buildHorseThing() {
      return new T.SphereGeometry(0.3, 100, 100);

    }

  }
  // Use the stepWorld() method to make the carousel spin, and the 'horses' jump up and down
  /**
       * StepWorld Method
       * @param {*} delta 
       * @param {*} timeOfDay 
       */
  stepWorld(delta, timeOfDay) {
    this.time += delta / 1000; // time in seconds
    // set the y position based on the time
    let t = this.time % 1;

    let i = 0;
    for (i = 0; i < this.horses.length; i++) {
      if (t < 0.1 || t > 0.9) this.horses[i].position.y = -0.9;
      else {
        this.horses[i].position.y = -0.9 + 10 * (0.20 - (0.4 - t) * (0.5 - t));
      }
    }

    this.platform.rotateY(-0.003 * delta);
  }
}

let carousel3ObCtr = 0;

// A Carousel, made by Gia-Phong Nguyen
/**
 * @typedef CarouselProperties3
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
export class GrCarousel3 extends GrObject {
  /**
   * @param {CarouselProperties3} params
   */
  constructor(params = {}) {
    let width = 3;
    let carousel = new T.Group();

    let base_geom = new T.CylinderGeometry(width, width, 1, 32);
    let base_mat = new T.MeshStandardMaterial({
      color: "lightblue",
      metalness: 0.3,
      roughness: 0.8
    });
    let base = new T.Mesh(base_geom, base_mat);
    base.translateY(0.5);
    carousel.add(base);

    let platform_group = new T.Group();
    base.add(platform_group);
    platform_group.translateY(0.5);

    let platform_geom = new T.CylinderGeometry(
      0.95 * width,
      0.95 * width,
      0.2,
      32
    );
    let platform_mat = new T.MeshStandardMaterial({
      color: "gold",
      metalness: 0.3,
      roughness: 0.8
    });
    let platform = new T.Mesh(platform_geom, platform_mat);
    platform_group.add(platform);

    let cpole_geom = new T.CylinderGeometry(0.3 * width, 0.3 * width, 3, 16);
    let cpole_mat = new T.MeshStandardMaterial({
      color: "gold",
      metalness: 0.8,
      roughness: 0.5
    });
    let cpole = new T.Mesh(cpole_geom, cpole_mat);
    platform_group.add(cpole);
    cpole.translateY(1.5);

    let top_trim = new T.Mesh(platform_geom, platform_mat);
    platform_group.add(top_trim);
    top_trim.translateY(3);

    let opole_geom = new T.CylinderGeometry(0.03 * width, 0.03 * width, 3, 16);
    let opole_mat = new T.MeshStandardMaterial({
      color: "#aaaaaa",
      metalness: 0.8,
      roughness: 0.5
    });
    let opole;
    let num_poles = 8;
    let poles = [];
    for (let i = 0; i < num_poles; i++) {
      opole = new T.Mesh(opole_geom, opole_mat);
      platform_group.add(opole);
      opole.translateY(1.5);
      opole.rotateY((2 * i * Math.PI) / num_poles);
      opole.translateX(0.8 * width);
      poles.push(opole);
    }

    // Returns a Group for the horse with a given color
    let createHorse = (color) => {
      let horse = new T.Group();
      let horseMat = new T.MeshStandardMaterial({
        color: color,
        metalness: .3,
        roughness: .4
      });

      // horse body
      let bodyShape = new T.Shape();
      bodyShape.moveTo(-3, -1); // CS559 Sample Code
      bodyShape.lineTo(-3, .5);
      bodyShape.lineTo(-2, 1);
      bodyShape.lineTo(3, 1);
      bodyShape.lineTo(3, 0);
      bodyShape.lineTo(2.5, -1);

      let exSettingsBody = {
        steps: 2,
        depth: 1.2,
        bevelEnabled: true,
        bevelThickness: .6,
        bevelSize: .6,
        bevelSegments: 1
      };

      let bodyGeom = new T.ExtrudeGeometry(bodyShape, exSettingsBody);
      let bodyMesh = new T.Mesh(bodyGeom, horseMat);
      bodyMesh.rotation.y = Math.PI / 2;
      bodyMesh.position.x = -.6;

      horse.add(bodyMesh);

      // horse head
      let headShape = new T.Shape();
      headShape.moveTo(1, .5); // CS559 Sample Code
      headShape.lineTo(4, 3.5);
      headShape.lineTo(5.5, 3);
      headShape.lineTo(5, 2.5);
      headShape.lineTo(4, 2.5);
      headShape.lineTo(3, .5);

      let exSettingsHead = {
        steps: 2,
        depth: .6,
        bevelEnabled: true,
        bevelThickness: .5,
        bevelSize: .5,
        bevelSegments: 1
      };

      let headGeom = new T.ExtrudeGeometry(headShape, exSettingsHead);
      let headMesh = new T.Mesh(headGeom, horseMat);
      headMesh.rotation.y = Math.PI / 2;
      headMesh.position.x = -.3;

      horse.add(headMesh);

      // horse legs
      let legShape = new T.Shape();
      legShape.moveTo(-2, 0); // CS559 Sample Code
      legShape.lineTo(2, 0);
      legShape.lineTo(2.5, -1);
      legShape.lineTo(3, -2);
      legShape.lineTo(2.5, -2.5);
      legShape.lineTo(1.5, -2.5);
      legShape.lineTo(2, -2);
      legShape.lineTo(1.5, -1);
      legShape.lineTo(1.5, -.5);
      legShape.lineTo(-1.5, -.5);
      legShape.lineTo(-1.5, -1);
      legShape.lineTo(-2, -2);
      legShape.lineTo(-3, -2.5);
      legShape.lineTo(-3.5, -2);
      legShape.lineTo(-2.5, -1.5);
      legShape.lineTo(-2.5, 0);

      let exSettingsLegs = {
        steps: 2,
        depth: .2,
        bevelEnabled: true,
        bevelThickness: .2,
        bevelSize: .2,
        bevelSegments: 1
      };

      let legGeom = new T.ExtrudeGeometry(legShape, exSettingsLegs);
      let legMesh1 = new T.Mesh(legGeom, horseMat);
      let legMesh2 = new T.Mesh(legGeom, horseMat);

      legMesh1.position.y = -.8; // CS559 Sample Code
      legMesh1.rotation.y = Math.PI / 2;
      legMesh1.position.x = -.1 - .6;

      legMesh2.position.y = -.8; // CS559 Sample Code
      legMesh2.rotation.y = Math.PI / 2;
      legMesh2.position.x = -.1 + .6;

      horse.add(legMesh1);
      horse.add(legMesh2);

      horse.scale.set(.2, .2, .15);
      return horse;
    };

    // add a horse to each pole
    let horses = [];
    for (let i = 0; i < num_poles; i++) {
      // generate color for horse
      let color = "#" + (Math.floor(50 + Math.random() * 100 - 50)).toString(16) +
        (Math.floor(170 + Math.random() * 100 - 50)).toString(16) +
        (Math.floor(220 + Math.random() * 50 - 25)).toString(16); // CS559 Sample Code
      let horse = createHorse(color);
      // add horse to main group
      platform_group.add(horse);
      horse.translateY(1.5);
      // rotate horse to be perpendicular to carousel
      horse.rotateY((2 * i * Math.PI) / num_poles);
      horse.translateX(0.8 * width);
      horses.push(horse);
    }

    let roof_geom = new T.ConeGeometry(width, 0.5 * width, 32, 4);
    let roof = new T.Mesh(roof_geom, base_mat);
    carousel.add(roof);
    roof.translateY(4.8);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`Carousel3-${carousel3ObCtr++}`, carousel);
    this.whole_ob = carousel;
    this.platform = platform_group;
    this.poles = poles;
    this.horses = horses;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    carousel.scale.set(scale, scale, scale);

    this.time = 0;
  }
  stepWorld(delta, timeOfDay) {
    this.time += delta / 500;
    this.platform.rotation.y = this.time;
    // make the horses go up and down using sin function
    for (let i = 0; i < this.horses.length; i++) {
      this.horses[i].position.y = Math.sin(this.time + (i * this.horses.length) / (Math.PI * 2)) / 2 + 1.5;
    }
  }
}

// Bumper cars, made by Gia-Phong Nguyen
let bumperCarsObCtr = 0;

export class GrBumperCars extends GrObject {

  constructor(params = {}) {
    let bumperCars = new T.Group();
    let cars = [];
    let carRadius = 1.5;
    let boxWidth = 14;
    let numCars = 5;
    let moveSpeed = .05;

    // platform and walls for the bumpercars to move in
    let boxMaterial = new T.MeshStandardMaterial({
      color: "grey",
      roughness: .7,
      metalness: .3
    });
    let baseGeom = new T.BoxGeometry(boxWidth + carRadius * 2, .5, boxWidth + carRadius * 2);
    let baseMesh = new T.Mesh(baseGeom, boxMaterial);

    let wallGeom = new T.BoxGeometry(boxWidth + carRadius * 2 + .3, 1.2, .5);
    let wallMaterial = new T.MeshStandardMaterial({
      color: "red",
      metalness: .5,
      roughness: .5
    });
    for (let i = 0; i < 4; i++) {
      let wallMesh = new T.Mesh(wallGeom, wallMaterial);
      wallMesh.rotateY(i * Math.PI / 2);
      wallMesh.translateZ(boxWidth / 2 + carRadius);
      wallMesh.position.y = .2;
      bumperCars.add(wallMesh);
    }

    bumperCars.add(baseMesh);

    // returns a group for a car at position with color
    let createCar = (x, z, color) => {
      let group = new T.Group();

      // car body
      let baseMat = new T.MeshStandardMaterial({
        color: "grey",
        metalness: .5,
        roughness: .5
      });
      let baseGeom = new T.CylinderGeometry(carRadius, carRadius, carRadius / 2, 20);
      let baseMesh = new T.Mesh(baseGeom, baseMat);
      baseMesh.position.y = .2;

      let bodyMat = new T.MeshStandardMaterial({
        color: color,
        metalness: .5,
        roughness: .5
      });

      let bodyShape = new T.Shape();
      bodyShape.moveTo(-1, 0); // CS559 Sample Code
      bodyShape.lineTo(-.75, 1);
      bodyShape.lineTo(-.5, .25);
      bodyShape.lineTo(.75, .25);
      bodyShape.lineTo(1, .5);
      bodyShape.lineTo(1, 0);

      let exSettings = {
        steps: 2,
        depth: 1,
        bevelEnabled: true,
        bevelThickness: .2,
        bevelSize: .2,
        bevelSegments: 1
      };

      let bodyGeom = new T.ExtrudeGeometry(bodyShape, exSettings);
      let bodyMesh = new T.Mesh(bodyGeom, bodyMat);
      bodyMesh.position.x = .5;
      bodyMesh.position.y = .4;
      bodyMesh.rotation.y = -Math.PI / 2;

      // car wheels
      let wheelMat = new T.MeshStandardMaterial({
        color: "black",
        roughness: .6
      });

      // driving wheel
      let driveWheelGeom = new T.CylinderGeometry(.3, .3, .1); // CS559 Sample Code
      let driveWheelMesh = new T.Mesh(driveWheelGeom, wheelMat);
      driveWheelMesh.rotation.x = -Math.PI / 4;
      driveWheelMesh.position.y = 1;
      driveWheelMesh.position.z = .8;

      // actual wheels
      let wheelGeom = new T.CylinderGeometry(.4, .4, .2); // CS559 Sample Code
      let wheelMesh1 = new T.Mesh(wheelGeom, wheelMat);
      wheelMesh1.rotation.z = Math.PI / 2;
      wheelMesh1.position.y = .5;
      wheelMesh1.position.x = -.9;
      wheelMesh1.position.z = -.7;

      let wheelMesh2 = new T.Mesh(wheelGeom, wheelMat);
      wheelMesh2.rotation.z = Math.PI / 2;
      wheelMesh2.position.y = .5;
      wheelMesh2.position.x = -.9;
      wheelMesh2.position.z = .7;

      let wheelMesh3 = new T.Mesh(wheelGeom, wheelMat);
      wheelMesh3.rotation.z = Math.PI / 2;
      wheelMesh3.position.y = .5;
      wheelMesh3.position.x = .9;
      wheelMesh3.position.z = -.7;

      let wheelMesh4 = new T.Mesh(wheelGeom, wheelMat);
      wheelMesh4.rotation.z = Math.PI / 2;
      wheelMesh4.position.y = .5;
      wheelMesh4.position.x = .9;
      wheelMesh4.position.z = .7;

      group.add(baseMesh);
      group.add(bodyMesh);
      group.add(driveWheelMesh);
      group.add(wheelMesh1);
      group.add(wheelMesh2);
      group.add(wheelMesh3);
      group.add(wheelMesh4);

      // give the car a random starting angle
      let angle = Math.random() * Math.PI * 2;

      return {
        "group": group,
        "x": x,
        "z": z,
        "vel": [Math.cos(angle), Math.sin(angle)],
      };
    };

    // add all the cars
    for (let i = 0; i < numCars; i++) {
      let valid = false;
      let pos = [Math.random() * boxWidth - boxWidth / 2, Math.random() * boxWidth - boxWidth / 2];
      // keeps trying different positions until finds one that doesn't collide with other cars
      while (!valid) {
        valid = true;
        for (let i = 0; i < cars.length; i++) {
          if (Math.sqrt(Math.pow(pos[0] - cars[i].x, 2) + Math.pow(pos[1] - cars[i].z, 2)) < carRadius * 2) {
            valid = false;
            pos = [Math.random() * boxWidth - boxWidth / 2, Math.random() * boxWidth - boxWidth / 2];
            i = cars.length;
          }
        }
      }

      // generates a color for car
      let color = "#" + (Math.floor(200 + Math.random() * 100 - 50)).toString(16) +
        (Math.floor(100 + Math.random() * 100 - 50)).toString(16) +
        (Math.floor(100 + Math.random() * 100 - 50)).toString(16); // CS559 Sample Code
      let car = createCar(pos[0], pos[1], color);
      bumperCars.add(car.group);
      car.group.position.x = car.x;
      car.group.position.z = car.z;
      cars.push(car);
    }

    // cars collide and bounce off each other (similar code to boids from wb4)
    let collisionHandle = (thisCar) => {
      cars.forEach(car1 => {
        cars.forEach(car2 => {
          if (Math.sqrt(Math.pow(car1.x - car2.x, 2) + Math.pow(car1.z - car2.z, 2)) < 2 * carRadius && car1 != car2) {
            let incidencePoint = [(car1.x + car2.x) / 2, (car1.z + car2.z) / 2];

            car1.vel = [car1.x - incidencePoint[0], car1.z - incidencePoint[1]];
            let car1Magnitude = Math.sqrt(car1.vel[0] * car1.vel[0] + car1.vel[1] * car1.vel[1]);
            car1.vel[0] /= car1Magnitude;
            car1.vel[1] /= car1Magnitude;
            car1.x += car1.vel[0] * moveSpeed;
            car1.z += car1.vel[1] * moveSpeed;

            car2.vel = [car2.x - incidencePoint[0], car2.z - incidencePoint[1]];
            let car2Magnitude = Math.sqrt(car1.vel[0] * car1.vel[0] + car1.vel[1] * car1.vel[1]);
            car2.vel[0] /= car2Magnitude;
            car2.vel[1] /= car2Magnitude;
            car2.x += car2.vel[0] * moveSpeed;
            car2.z += car2.vel[1] * moveSpeed;
          }
        });
      });
    };

    super(`Bumper Cars-${bumperCarsObCtr++}`, bumperCars);

    // moves each of the car forward and handles collision
    this.updateCars = () => {
      cars.forEach(car => {
        // moves each car forward
        car.x += car.vel[0] * moveSpeed;
        car.z += car.vel[1] * moveSpeed;
        car.group.position.x = car.x;
        car.group.position.z = car.z;

        // collision handling
        collisionHandle(car);

        // bounces cars off of walls
        if (car.x > boxWidth / 2 || car.x < -boxWidth / 2) {
          car.vel[0] *= -1;
          car.x = (car.x / Math.abs(car.x)) * boxWidth / 2 + car.vel[0] * moveSpeed * 2;
        }
        if (car.z > boxWidth / 2 || car.z < -boxWidth / 2) {
          car.vel[1] *= -1;
          car.z = (car.z / Math.abs(car.z)) * boxWidth / 2 + car.vel[1] * moveSpeed * 2;
        }

        // fix car angle if necessary
        car.angle = Math.atan2(car.vel[0], car.vel[1]);
        car.group.rotation.y = car.angle;
      });
    };

    this.whole_ob = bumperCars;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;

  }
  stepWorld(delta, timeOfDay) {
    this.updateCars();
  }
}
// End Example Solution