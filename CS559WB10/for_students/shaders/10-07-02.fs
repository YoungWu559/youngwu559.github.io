// Anti-Aliased Checkerboard - Fast Solution
//
// April 2022 - by Mike Gleicher
//
// This was written to see 
// (1) how quickly I could do it, and 
// (2) if there was a simple and understandable way to do it
// so, the code is meant to be simple and readable (and easy to debug)
// rather than as efficient and short as possible

/* pass interpolated variables to from the vertex */
varying vec2 v_uv;

uniform vec3 light;
uniform vec3 dark;

// uniform float sw;
uniform float checks;

uniform float blur;

void main()
{
    // the UV value overall (so that each square is 1x1)
    float u = v_uv.x * checks;
    float v = v_uv.y * checks;

    // figure out which square we're in
    float ui = floor(u);
    float vi = floor(v);

    // is this a dark square or a light square
    // set the color and the "not color" (we need this for anti-aliasing)
    vec3 color, notcolor;
    if ( mod(ui+vi,2.0) >= 1.0) {
        color = light;
        notcolor = dark;
    } else {
        color = dark;
        notcolor = light;
    }

    // if we weren't doing anti-aliasing, we could just do
    gl_FragColor = vec4(color,1);

    // now, for anti-aliasing
    // we need to figure out how far we are from an edge
    // to do this, we'll use the distance to the center
    // we do this in each direction
    // so that the edge is at .5
    float ud = abs(0.5-fract(u));
    float vd = abs(0.5-fract(v));

    // pick the direction we are closest to the edge in
    float d = max(ud,vd);

    // the real amount of blur (since the specified might be -1)
    float rblur = blur >= 0.0 ? blur : fwidth(d);

    // compute the amount of notcolor to mix in to do anti-aliasing
    // note the division by 2: at the boundary, we want it to be halfway between colors
    float aa = smoothstep(0.5 - rblur, 0.5, d ) / 2.0;

    gl_FragColor = vec4(mix(color,notcolor,aa),1);
    // gl_FragColor = vec4(d,d,d,1);
}