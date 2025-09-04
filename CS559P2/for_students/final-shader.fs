/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

varying vec3 v_normal;
void main() {
    gl_FragColor = vec4(0.1,0.8,0.1,1);
    vec3 myColor = normalize(v_normal) * 0.5 + vec3(0.5, 0.5, 0.5);
    gl_FragColor = vec4(myColor, 1.0);
}
