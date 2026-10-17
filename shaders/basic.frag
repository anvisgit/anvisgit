precision highp float;
uniform float uTime;
uniform sampler2D uTexture;

varying vec2 vTexCoord; 

void main() {
  vec4 base = texture2D(uTexture, vTexCoord);
  // Set each pixel's RGBA value to yellow.
  gl_FragColor = base / 2.0 + vec4(vec3((cos(uTime)+1.0)/2.0), 1.0)*0.5;
}