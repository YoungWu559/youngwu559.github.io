/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */
/*
 * Simple Shader for exercise 8-3
 * The student should make this more interesting, but the interesting parts
 * might be the fragment shader.
  */

/* pass interpolated variables to the fragment */
varying vec2 v_uv;

/* the vertex shader just passes stuff to the fragment shader after doing the
 * appropriate transformations of the vertex information
 */

varying vec3 v_normal;
uniform float time;
uniform float numRings;
uniform float amplitude;

void main() {
    // pass the texture coordinate to the fragment
    v_uv = uv;

    // pattern
    float x = v_uv.x;
    float y = v_uv.y;

    float dist = (sin(y * numRings * 6.28 + time) + 1.0) / 2.0;

    vec3 pos = position * (0.8 + dist * amplitude);

    v_normal = normalMatrix * normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0 );
}

