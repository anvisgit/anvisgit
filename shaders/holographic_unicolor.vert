precision highp float;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform float uTime;
uniform bool uGlitch;

attribute vec3 aPosition;
attribute vec2 aTexCoord;
attribute vec3 aNormal;

varying vec2 vTexCoord;
varying vec3 vWorldPos;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

/*float fresnel(float amount, vec3 normal, vec3 view)
{
	return pow((1.0 - clamp(dot(normalize(normal), normalize(view)), 0.0, 1.0 )), amount);
}
*/
void main() {
    vTexCoord = aTexCoord;

    vec4 randOffset = vec4(0.0);
    float glitchChance = 0.998;
    if( uGlitch ){
        glitchChance = 0.95;
    }
    if (rand(vec2(uTime, aPosition.y)) > glitchChance ) {
        float r1 = ( rand(vec2(uTime*16548.0, aPosition.y)) * 20.0) - 10.0;
        float r2 = ( rand(vec2(uTime*16548.0, aPosition.y)) * 20.0) - 10.0;
        float r3 = ( rand(vec2(uTime*15548.0, aPosition.y)) * 20.0) - 10.0;

        randOffset = vec4(r1, r2, r3, 0.0);
    }

    vWorldPos = (uModelViewMatrix * vec4(aPosition,1.0)).xyz;

    vec4 pos = vec4(aPosition, 1.0);
    gl_Position = uProjectionMatrix * (uModelViewMatrix * pos + randOffset);
}
