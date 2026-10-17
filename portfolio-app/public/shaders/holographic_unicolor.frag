precision highp float;

uniform vec4 uColor;
uniform float uTime;

varying vec2 vTexCoord;
varying vec3 vWorldPos;

void main() {

    float a = (cos(vWorldPos.y * 3.0 + uTime * 5.0) + 1.0)/2.0;
    float b = (cos(vWorldPos.y * 0.2 + uTime * 5.0) + 1.0) * -0.5;

    gl_FragColor = uColor * vec4(0.77 - b*1.5, 0.92 - b*1.5, 0.98 - b, a - b) * a;
}
