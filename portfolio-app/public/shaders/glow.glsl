precision highp float;

uniform sampler2D tex0;
uniform vec2 uTexOffset;
uniform float uThreshold;
uniform float uGlowStrength;

varying vec2 vTexCoord;

void main() {
    vec2 uv = vTexCoord;

    // luminance
    vec3 src = texture2D(tex0, uv).rgb;
    float bright = max(max(src.r, src.g), src.b);

    float mask = smoothstep(uThreshold, uThreshold + 0.05, bright);

    vec4 glow = vec4(0.0);

    // blur weights (13 taps)
    float w[7];
    w[0]=0.20; w[1]=0.15; w[2]=0.12; w[3]=0.10;
    w[4]=0.08; w[5]=0.05; w[6]=0.03;

    for (int i=0; i<7; i++) {
        vec2 off = uTexOffset * float(i);

        glow += texture2D(tex0, uv + vec2(off.x, 0.0)) * w[i];
        glow += texture2D(tex0, uv - vec2(off.x, 0.0)) * w[i];
        glow += texture2D(tex0, uv + vec2(0.0, off.y)) * w[i];
        glow += texture2D(tex0, uv - vec2(0.0, off.y)) * w[i];
    }

    glow *= mask * uGlowStrength;

    vec4 col = texture2D(tex0, uv);
    gl_FragColor = col + glow;
}
