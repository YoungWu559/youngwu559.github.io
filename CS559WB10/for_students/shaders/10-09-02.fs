/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/* Procedural shading example for Exercise 8-2 */
/* the student should make this more interesting */

/* pass interpolated variables to from the vertex */
varying vec2 v_uv;

// @@Snippet:vertex_shader
varying vec3 v_normal;

// note that this is in VIEW COORDINATES
const vec3 lightDir = vec3(0,0,1);

// get the texture from the program
uniform sampler2D tex;
uniform sampler2D colormap;

void main()
{
    // we need to renormalize the normal since it was interpolated
    vec3 nhat = normalize(v_normal);
    // deal with two sided lighting
    // light comes from above and below (use clamp rather than abs to get one sided)
    float light = max(0.0,dot(nhat, lightDir));
    gl_FragColor = clamp(texture2D(tex, v_uv) + texture2D(colormap, v_uv), 0.0, 1.0) * light;
}

