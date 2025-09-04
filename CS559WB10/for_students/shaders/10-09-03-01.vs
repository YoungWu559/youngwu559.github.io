/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/* pass interpolated variables to the fragment */
varying vec2 v_uv;
varying vec3 v_normal;

uniform sampler2D tex;
uniform float height;

/* the vertex shader just passes stuff to the fragment shader after doing the
 * appropriate transformations of the vertex information
 */
void main() {
    // Written by Kevin Wilson
    float r_val = texture2D(tex,uv).r;
    float b_val = texture2D(tex,uv).b;
    float g_val = texture2D(tex,uv).g;
    vec3 pos;
    float change_height = height;
     if (r_val > 0.5)
    {
      if (height > 1.0 || height < -1.0)
      {
        change_height = -height;
      }
      pos =  position + r_val*normal * change_height; // CS559 Sample Code
    }
    else if (b_val > 0.5) {
      if (height > 1.0 || height < -1.0)
      {
        change_height = -height;
      }
      pos = position - b_val*normal * change_height; // CS559 Sample Code
    }
    else{
      if (height > 1.5)
      {
        change_height = height * 3.0;
      }
      pos = position - g_val*normal * change_height * 0.6; // CS559 Sample Code
    }
    // pass the texture coordinate to the fragment
    v_uv = uv;
    
    v_normal = normalMatrix * normal;
    
    // the main output of the shader (the vertex position)
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}
