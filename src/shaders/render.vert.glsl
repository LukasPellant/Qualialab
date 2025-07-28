uniform sampler2D uPositions;
uniform sampler2D uVelocities;
varying vec3 vColor;

void main() {
    vec4 posData = texture2D(uPositions, uv);
    vec3 pos = posData.xyz;
    float life = posData.w;

    vec4 velData = texture2D(uVelocities, uv);
    vec3 vel = velData.xyz;

    float speed = length(vel);
    vColor = vec3(speed * 10.0, 1.0 - speed * 5.0, 1.0 - speed * 10.0);

    gl_PointSize = 2.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}