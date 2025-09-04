/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/* Procedural shading example for Exercise 8-1 */
/* the student should make this more interesting */

/* pass interpolated variables to from the vertex */
varying vec2 v_uv;

// @@Snippet:simple_lighting
varying vec3 v_normal;

// note that this is in VIEW COORDINATES
const vec3 lightDir = vec3(0,0,1);

const float checks = 5.0;
const vec3 notDark = vec3(1.0,1.0,1.0);
const vec3 dark = vec3(0.2,0.2,0.7);

void main()
{
    // we need to renormalize the normal since it was interpolated
    vec3 nhat = normalize(v_normal);
    
    // deal with two sided lighting
    // light comes from above and below (use clamp rather than abs to get one sided)
    float light = max(0.0,dot(nhat, lightDir));
    
    /* work out the U coordinate */
    float u = v_uv.x * checks;      // real value of u
    float cu = floor(u);            // which column are we in
    float iu = mod(cu,2.0);         // dark or light stripe
    float pu = mod(u,1.0);          // where in the column are we
    float du = abs(.5-pu);          // how far from the center
    
    /* work out the V coordinate */
    float v = v_uv.y * checks;      // real value of v
    float cv = floor(v);            // which column are we in
    float iv = mod(cv,2.0);         // dark or light stripe
    float pv = mod(v,1.0);          // where in the column are we
    float dv = abs(.5-pv);          // how far from the center
    
    // are we in an even or odd checkerboard (light or dark)?
    float cc = mod(cu+cv,2.0);
    
    // which is the closest edge (farthest from center)
    float ed = max(du,dv);
    
    // how much are we in the "v stripe" (within .5 of center)
    float cs = step(.5,ed);
    
    // if we are in the dark stripe, then flip the color
    if (cc > .5) cs = 1.0-cs;
    float st = cs;
    gl_FragColor = vec4(mix(notDark,dark,st)*light, 1.);
}

