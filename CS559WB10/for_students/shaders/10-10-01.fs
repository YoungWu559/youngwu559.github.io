/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */
 /*
 * Placeholder shader for exercise 10-01.
 * The student should replace this with their own shader file.
 */
 
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 resolution;
uniform float time;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}

float mycross(in vec2 _st, float _size){
    return  box(_st, vec2(_size,_size/4.)) +
            box(_st, vec2(_size/4.,_size));
}

void main(){
    // Calculate position of pixel.
     vec2 st = gl_FragCoord.xy/resolution.xy;
     // Bigger the #, smaller the cross compared to window.
     st = st *1.8;
    vec3 color = vec3(0.0);

    // move space from the center to the vec2(0.0)
    st -= vec2(0.5);
    // rotate the space
    st = rotate2d( -cos(time*0.6)*PI ) * st;
    // move it back to the original place
    st += vec2(0.5);

    // To move the cross we move the space
    vec2 translate = vec2(cos(time),sin(time));
    st += translate*0.20;

    // Show the coordinates of the space on the background
    color = vec3(st.x,st.y,0.0);

    // Add the shape on the foreground
    color += vec3(mycross(st,0.25)) + 0.5* cos(time*1.4);

    gl_FragColor = vec4(color,1.0);
}