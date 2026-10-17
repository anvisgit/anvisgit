precision highp float;

uniform sampler2D uTexture;
uniform float uTime;

varying vec2 vTexCoord;
varying vec3 vWorldPos;


void main() {
    vec4 base = texture2D(uTexture, vTexCoord);

    float a = (cos(vWorldPos.y * 3.0 /*+ uTime * 5.0*/) + 1.0) * 0.5;
    float b = (cos(vWorldPos.y * 0.2 + uTime * 5.0) + 1.0) * -0.5;

    gl_FragColor = base * vec4(0.77 - b*1.5, 0.92 - b*1.5, 0.98 - b, a - b)*a;
    
    //gl_FragColor = vec4(0.77 - b*1.5, 0.92 - b*1.5, 0.98 - b, 1) * a;
}
