uniform sampler2D tDiffuse;
uniform float amount;
varying vec2 vUv;

void main() {
    vec2 offset = amount * (vUv - 0.5);
    vec4 color = vec4(0.0);
    color.r = texture2D(tDiffuse, vUv - offset).r;
    color.g = texture2D(tDiffuse, vUv).g;
    color.b = texture2D(tDiffuse, vUv + offset).b;
    gl_FragColor = color;
}