/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

varying vec3 v_normal;
void main() { 
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    v_normal = normalMatrix * normal;
}