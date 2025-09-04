/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/*
 * Simple Shader for exercise 8-2
 * The student should make this more interesting, but the interesting parts
 * might be the fragment shader.
  */

/* pass interpolated variables to the fragment */
varying vec2 v_uv;

// @@Snippet:vertex_shader
varying vec3 v_normal;
uniform sampler2D colormap;

/* the vertex shader just passes stuff to the fragment shader after doing the
 * appropriate transformations of the vertex information
 */
void main() {
    // pass the texture coordinate to the fragment
    v_uv = uv;
    float height = texture2D(colormap,uv).g;    // get the green value
    
    // alter the position by raising it by the height
    // we know the direction from the normal (which should be a unit vector)
    vec3 pos = position + height*normal *.4;
    
    // the main output of the shader (the vertex position)
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    
    // compute the view-space normal and pass it to fragment shader
    v_normal = normalMatrix * normal;
}

