precision highp float;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform float uTime;
uniform float uGlitchScale;

attribute vec4 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;
varying vec3 vWorldPos;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vTexCoord = aTexCoord;

    vec4 randOffset = vec4(0.0);
    if (rand(vec2(uTime, aPosition.y)) > 0.998) {
        float r1 = ( rand(vec2(uTime*16548.0, aPosition.y)) * uGlitchScale) - uGlitchScale / 2.0;
        float r2 = ( rand(vec2(uTime*16858.0, aPosition.y)) * uGlitchScale) - uGlitchScale / 2.0;
        float r3 = ( rand(vec2(uTime*16458.0, aPosition.y)) * uGlitchScale) - uGlitchScale / 2.0;

        randOffset = vec4(r1, r2, r3, 0.0);
    }

    vWorldPos = (uModelViewMatrix * aPosition + randOffset).xyz;

    vec4 pos = aPosition;
    gl_Position = uProjectionMatrix * (uModelViewMatrix * pos + randOffset);
}
