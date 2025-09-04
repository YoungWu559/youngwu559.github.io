/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */
/* Procedural shading example for Exercise 8-3 */
/* the student should make this more interesting */

/* pass interpolated variables to from the vertex */
precision highp float;
varying vec2 v_uv;

uniform float time;
uniform float numRings;
uniform float amplitude;

varying vec3 v_normal;
const vec3 color1 = vec3(.2, .9, .2);
const vec3 color2 = vec3(.2, .2, .9);

const vec3 lightDirWorld = vec3(3,3,0);
const vec3 baseColor = vec3(2.0,0.2,0.2);

void main()
{
    // pattern
    float x = v_uv.x;
    float y = v_uv.y;

    float dc = (sin(y * numRings * 6.28 + time) + 1.0) / 2.0;

    vec3 surfaceColor = mix(color1,color2,dc);

    // lighting
    vec3 nhat = normalize(v_normal);
    vec3 lightDir = normalize(viewMatrix * vec4(lightDirWorld, 0)).xyz;
    float light = abs(dot(nhat, lightDir));

    gl_FragColor = vec4(surfaceColor + light * baseColor * 0.5, 1.);
}

