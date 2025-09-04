/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/* pass interpolated variables to from the vertex */
varying vec2 v_uv;
uniform sampler2D tex;
varying vec3 v_normal;

// note that this is in WORLD COORDINATES
const vec3 lightDirWorld = vec3(0,3,0);
const vec3 baseColor = vec3(0.0,1.0,1.0);

void main()
{   
     // we need to renormalize the normal since it was interpolated
    vec3 nhat = normalize(v_normal);
    // get the lighting vector in the view coordinates
    // warning: this is REALLY wasteful!
    vec3 lightDir = normalize(viewMatrix * vec4(lightDirWorld, 0)).xyz;
    // deal with two sided lighting
    float light = abs(dot(nhat, lightDir));
    gl_FragColor = texture2D(tex,v_uv) + vec4(light * baseColor,1) ;;
}
