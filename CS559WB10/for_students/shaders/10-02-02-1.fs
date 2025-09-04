/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/* simplest possible fragment shader - just a constant color */
/* but a wrinkle: we pass the color from the javascript program in a uniform */
uniform vec3 color;

// We also passed in the time as a uniform (for bonus exercise)
uniform float time;

void main()
{
    // This reproduces the same list of colors as the original shader
    gl_FragColor = vec4(sin(time * 1000.0 / 200.0) / 2.0 + 0.5, color[1], color[2], 1);
}

