import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

/**
 * QuantumInk - A GPU-accelerated particle simulation.
 */
export class QuantumInk {
    /**
     * @param {HTMLElement} parent - The container element for the canvas.
     * @param {object} [options] - Optional configuration.
     * @param {number} [options.particleCount=1048576] - The number of particles to simulate.
     */
    constructor(parent, options = {}) {
        this.parent = parent;
        this.options = {
            particleCount: 1048576,
            ...options,
        };

        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000); // Set background to black
        this.camera = new THREE.PerspectiveCamera(75, this.parent.clientWidth / this.parent.clientHeight, 0.1, 1000);
        this.camera.position.z = 2; // Move camera back to see the cube
        this.renderer = new THREE.WebGLRenderer({ alpha: false }); // Set alpha to false

        // Initialize simulation scene and camera for FBO rendering
        this.simulationScene = new THREE.Scene();
        this.simulationCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.renderer.setSize(this.parent.clientWidth, this.parent.clientHeight);
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        this.renderer.domElement.style.display = 'block';
        this.parent.appendChild(this.renderer.domElement);

        this.mouse = new THREE.Vector3(); // Initialize mouse here

        // Bind event handlers
        this._onResize = this._onResize.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);

        this._initFBO();
        this._createShaders();
        this._addPostprocessing();
        this._addEvents();
        this.renderer.setAnimationLoop(this._update.bind(this));
    }

    _initFBO() {
        const particleCount = this.options.particleCount;
        const textureSize = Math.ceil(Math.sqrt(particleCount));
        this.textureSize = textureSize;

        const positions = new Float32Array(textureSize * textureSize * 4);
        const velocities = new Float32Array(textureSize * textureSize * 4);

        for (let i = 0; i < textureSize * textureSize; i++) {
            positions[i * 4] = (Math.random() * 2 - 1) * 0.5;
            positions[i * 4 + 1] = (Math.random() * 2 - 1) * 0.5;
            positions[i * 4 + 2] = 0;
            positions[i * 4 + 3] = Math.random(); // Lifetime

            velocities[i * 4] = 0;
            velocities[i * 4 + 1] = 0;
            velocities[i * 4 + 2] = 0;
            velocities[i * 4 + 3] = 0;
        }

        this.fbo = {
            position: {
                read: new THREE.WebGLRenderTarget(textureSize, textureSize, { type: THREE.FloatType }),
                write: new THREE.WebGLRenderTarget(textureSize, textureSize, { type: THREE.FloatType }),
                swap: () => { [this.fbo.position.read, this.fbo.position.write] = [this.fbo.position.write, this.fbo.position.read]; },
            },
            velocity: {
                read: new THREE.WebGLRenderTarget(textureSize, textureSize, { type: THREE.FloatType }),
                write: new THREE.WebGLRenderTarget(textureSize, textureSize, { type: THREE.FloatType }),
                swap: () => { [this.fbo.velocity.read, this.fbo.velocity.write] = [this.fbo.velocity.write, this.fbo.velocity.read]; },
            },
        };

        const positionTexture = new THREE.DataTexture(positions, textureSize, textureSize, THREE.RGBAFormat, THREE.FloatType);
        positionTexture.needsUpdate = true;
        const velocityTexture = new THREE.DataTexture(velocities, textureSize, textureSize, THREE.RGBAFormat, THREE.FloatType);
        velocityTexture.needsUpdate = true;

        this.fbo.position.read.texture.image = positionTexture.image;
        this.fbo.velocity.read.texture.image = velocityTexture.image;
    }

    _createShaders() {
        this.simulationMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uPositions: { value: this.fbo.position.read.texture },
                uVelocities: { value: this.fbo.velocity.read.texture },
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector3() },
                uMic: { value: 0 },
            },
            vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`,
            fragmentShader: `
float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

varying vec2 vUv;
uniform sampler2D uPositions;
uniform sampler2D uVelocities;
uniform float uTime;
uniform vec3 uMouse;
uniform float uMic;

// 4D Simplex Noise by Ian McEwan, Ashima Arts.
// https://github.com/ashima/webgl-noise
vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));;
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

vec3 snoiseVec3(vec3 x) {
  float s  = snoise(vec3(x));
  float s1 = snoise(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2));
  float s2 = snoise(vec3(x.z + 74.2, x.x - 124.5, x.y + 99.4));
  return vec3(s, s1, s2);
}

vec3 curlNoise(vec3 p, float t) {
  vec3 e = vec3(0.1, 0.0, 0.0);
  vec3 dx = snoiseVec3(p + e.xyy * t) - snoiseVec3(p - e.xyy * t);
  vec3 dy = snoiseVec3(p + e.yxy * t) - snoiseVec3(p - e.yxy * t);
  vec3 dz = snoiseVec3(p + e.yyx * t) - snoiseVec3(p - e.yyx * t);
  return vec3(dz.y - dy.z, dx.z - dz.x, dy.x - dx.y);
}

void main() {
    vec4 posData = texture2D(uPositions, vUv);
    vec3 pos = posData.xyz;
    float life = posData.w;

    vec4 velData = texture2D(uVelocities, vUv);
    vec3 vel = velData.xyz;

    if (life > 0.0) {
        vec3 noise = curlNoise(pos * 0.5, uTime * 0.1) * 0.6;
        vel += noise * 0.001;

        vec2 mouse = uMouse.xy - pos.xy;
        float mouseDist = length(mouse);
        if (mouseDist < 0.1) {
            if (uMouse.z == 1.0) { // Left click
                vel += vec3(normalize(mouse), 0.0) * 0.01;
            } else if (uMouse.z == 2.0) { // Right click
                vel -= vec3(normalize(mouse), 0.0) * 0.01;
            }
        }

        pos += vel;
        life -= 0.001;
    } else {
        pos = vec3((rand(vUv + uTime) - 0.5) * 2.0, (rand(vUv + uTime * 2.0) - 0.5) * 2.0, 0.0);
        life = 1.0;
    }

    gl_FragColor = vec4(pos, life);
}
`,
        });

        // Add a plane to the simulation scene to render the FBOs
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.simulationMaterial);
        this.simulationScene.add(plane);

        const particleCount = this.options.particleCount;
        const textureSize = this.textureSize;
        const uvs = new Float32Array(particleCount * 2);
        for (let i = 0; i < particleCount; i++) {
            uvs[i * 2] = (i % textureSize) / textureSize;
            uvs[i * 2 + 1] = Math.floor(i / textureSize) / textureSize;
        }

        const geometry = new THREE.InstancedBufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

        this.renderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uPositions: { value: this.fbo.position.read.texture },
                uVelocities: { value: this.fbo.velocity.read.texture },
            },
            vertexShader: `uniform sampler2D uPositions;
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
}`,
            fragmentShader: `void main() { gl_FragColor = vec4(1.0, 1.0, 1.0, 0.1); }`,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthTest: false,
        });

        this.particles = new THREE.Points(geometry, this.renderMaterial);
        this.scene.add(this.particles);

        // Debug: Add a simple red cube to the main scene
        const debugGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const debugMaterial = new THREE.MeshNormalMaterial(); // Changed to MeshNormalMaterial
        this.debugCube = new THREE.Mesh(debugGeometry, debugMaterial);
        this.scene.add(this.debugCube);
    }

    _addPostprocessing() {
        // ... (post-processing is commented out)
    }

    _addEvents() {
        // ...
    }

    _onResize() {
        // ...
    }

    _onMouseMove(e) {
        // ...
    }

    _onMouseDown(e) {
        // ...
    }

    _onMouseUp(e) {
        // ...
    }

    _onKeyDown(e) {
        // ...
    }

    _update(time) {
        console.log("QuantumInk _update running"); // Added log
        this.simulationMaterial.uniforms.uTime.value = time / 1000;
        this.simulationMaterial.uniforms.uMouse.value = this.mouse;

        this.renderer.setRenderTarget(this.fbo.position.write);
        this.renderer.render(this.simulationScene, this.simulationCamera);
        this.fbo.position.swap();
        this.simulationMaterial.uniforms.uPositions.value = this.fbo.position.read.texture;

        this.renderer.setRenderTarget(this.fbo.velocity.write);
        this.renderer.render(this.simulationScene, this.simulationCamera);
        this.fbo.velocity.swap();
        this.simulationMaterial.uniforms.uVelocities.value = this.fbo.velocity.read.texture;

        this.renderMaterial.uniforms.uPositions.value = this.fbo.position.read.texture;
        this.renderMaterial.uniforms.uVelocities.value = this.fbo.velocity.read.texture;

        this.renderer.setRenderTarget(null);
        this.renderer.render(this.scene, this.camera); // Render main scene to screen
        // this.composer.render();
    }

    exportPNG() {
        const link = document.createElement('a');
        link.download = 'QuantumInk.png';
        link.href = this.renderer.domElement.toDataURL('image/png');
        link.click();
    }

    destroy() {
        this.renderer.setAnimationLoop(null);
        this.parent.removeChild(this.renderer.domElement);

        // Dispose Three.js resources
        this.renderer.dispose();
        this.scene.dispose();
        this.simulationScene.dispose();

        this.simulationMaterial.dispose();
        this.renderMaterial.dispose();

        if (this.particles) {
            this.particles.geometry.dispose();
            this.particles.material.dispose();
        }

        // Dispose FBO render targets and their textures
        if (this.fbo) {
            if (this.fbo.position) {
                this.fbo.position.read.dispose();
                this.fbo.position.write.dispose();
                if (this.fbo.position.read.texture) this.fbo.position.read.texture.dispose();
                if (this.fbo.position.write.texture) this.fbo.position.write.texture.dispose();
                this.fbo.position = null; // Explicitly nullify after disposal
            }
            if (this.fbo.velocity) {
                this.fbo.velocity.read.dispose();
                this.fbo.velocity.write.dispose();
                if (this.fbo.velocity.read.texture) this.fbo.velocity.read.texture.dispose();
                if (this.fbo.velocity.write.texture) this.fbo.velocity.write.texture.dispose();
                this.fbo.velocity = null; // Explicitly nullify after disposal
            }
            this.fbo = null; // Explicitly nullify the fbo object
        }

        if (this.composer) this.composer.dispose();
        if (this.bloomPass) this.bloomPass.dispose();
        if (this.chromaticAberrationPass) this.chromaticAberrationPass.dispose();

        // Nullify properties to prevent memory leaks and stale references
        this.renderer = null;
        this.scene = null;
        this.simulationScene = null;
        this.camera = null;
        this.simulationCamera = null;
        this.simulationMaterial = null;
        this.renderMaterial = null;
        this.particles = null;
        this.composer = null;
        this.bloomPass = null;
        this.chromaticAberrationPass = null;
        this.mouse = null;
        this.parent = null;
        this.options = null;
        this.textureSize = null;

        // Remove event listeners
        window.removeEventListener('resize', this._onResize);
        this.parent.removeEventListener('mousemove', this._onMouseMove);
        this.parent.removeEventListener('mousedown', this._onMouseDown);
        this.parent.removeEventListener('mouseup', this._onMouseUp);
        window.removeEventListener('keydown', this._onKeyDown);
    }

    _toggleHelp() {
        // TODO: Implement help overlay
    }
}