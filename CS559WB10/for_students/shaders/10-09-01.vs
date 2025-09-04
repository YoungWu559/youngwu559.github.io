/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/*
 * Simple Shader for exercise 8-1
 * The student should make this more interesting, but the interesting parts
 * might be the fragment shader.
  */

/* pass interpolated variables to the fragment */
varying vec2 v_uv;

// @@Snippet:vertex_shader
varying vec3 v_normal;

/* the vertex shader just passes stuff to the fragment shader after doing the
 * appropriate transformations of the vertex information
 */
void main() {
    // pass the texture coordinate to the fragment
    v_uv = uv;

    // the main output of the shader (the vertex position)
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    // compute the view-space normal and pass it to fragment shader
    v_normal = normalMatrix * normal;
}

