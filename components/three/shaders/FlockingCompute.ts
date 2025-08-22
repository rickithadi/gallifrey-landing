// GPU-based flocking algorithm using WebGL compute capabilities
// Optimizes particle neighbor calculations and flocking behaviors

import * as THREE from 'three';

export interface FlockingParameters {
  cohesionRadius: number;
  separationRadius: number;
  alignmentRadius: number;
  cohesionStrength: number;
  separationStrength: number;
  alignmentStrength: number;
  maxSpeed: number;
  maxForce: number;
}

export class GPUFlockingCompute {
  private renderer: THREE.WebGLRenderer;
  private particleCount: number;
  private textureSize: number;
  
  // Render targets for ping-pong buffer updates
  private positionRenderTarget1: THREE.WebGLRenderTarget;
  private positionRenderTarget2: THREE.WebGLRenderTarget;
  private velocityRenderTarget1: THREE.WebGLRenderTarget;
  private velocityRenderTarget2: THREE.WebGLRenderTarget;
  private flockingDataTarget: THREE.WebGLRenderTarget;
  
  // Shader materials for compute passes
  private positionUpdateMaterial: THREE.ShaderMaterial;
  private velocityUpdateMaterial: THREE.ShaderMaterial;
  private flockingComputeMaterial: THREE.ShaderMaterial;
  
  // Geometry for full-screen passes
  private fullScreenGeometry: THREE.PlaneGeometry;
  private fullScreenMesh: THREE.Mesh;
  
  // Current frame toggle for ping-pong
  private currentFrame: boolean = false;

  constructor(renderer: THREE.WebGLRenderer, particleCount: number) {
    this.renderer = renderer;
    this.particleCount = particleCount;
    this.textureSize = Math.ceil(Math.sqrt(particleCount));
    
    this.initializeRenderTargets();
    this.initializeShaders();
    this.initializeGeometry();
  }

  private initializeRenderTargets(): void {
    const rtOptions = {
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      stencilBuffer: false,
      depthBuffer: false,
    };

    // Position buffers (xyz + lifecycle)
    this.positionRenderTarget1 = new THREE.WebGLRenderTarget(
      this.textureSize, 
      this.textureSize, 
      rtOptions
    );
    this.positionRenderTarget2 = new THREE.WebGLRenderTarget(
      this.textureSize, 
      this.textureSize, 
      rtOptions
    );

    // Velocity buffers (xyz + energy)
    this.velocityRenderTarget1 = new THREE.WebGLRenderTarget(
      this.textureSize, 
      this.textureSize, 
      rtOptions
    );
    this.velocityRenderTarget2 = new THREE.WebGLRenderTarget(
      this.textureSize, 
      this.textureSize, 
      rtOptions
    );

    // Flocking data (cohesion.xyz + separation strength)
    this.flockingDataTarget = new THREE.WebGLRenderTarget(
      this.textureSize, 
      this.textureSize, 
      rtOptions
    );
  }

  private initializeShaders(): void {
    // Flocking computation shader
    const flockingComputeShader = `
      precision highp float;
      
      uniform sampler2D positionTexture;
      uniform sampler2D velocityTexture;
      uniform float textureSize;
      uniform float particleCount;
      uniform float cohesionRadius;
      uniform float separationRadius;
      uniform float alignmentRadius;
      uniform float time;
      
      varying vec2 vUv;
      
      void main() {
        vec2 uv = vUv;
        float particleId = floor(uv.x * textureSize) + floor(uv.y * textureSize) * textureSize;
        
        if (particleId >= particleCount) {
          gl_FragColor = vec4(0.0);
          return;
        }
        
        vec4 currentPos = texture2D(positionTexture, uv);
        vec4 currentVel = texture2D(velocityTexture, uv);
        
        vec3 cohesion = vec3(0.0);
        vec3 separation = vec3(0.0);
        vec3 alignment = vec3(0.0);
        float neighborCount = 0.0;
        float separationCount = 0.0;
        
        // Sample all other particles for flocking calculation
        for (float i = 0.0; i < textureSize * textureSize; i += 1.0) {
          if (i >= particleCount || i == particleId) continue;
          
          vec2 neighborUv = vec2(
            mod(i, textureSize) / textureSize,
            floor(i / textureSize) / textureSize
          );
          
          vec4 neighborPos = texture2D(positionTexture, neighborUv);
          vec4 neighborVel = texture2D(velocityTexture, neighborUv);
          
          vec3 diff = neighborPos.xyz - currentPos.xyz;
          float distance = length(diff);
          
          // Cohesion: move toward average position of neighbors
          if (distance < cohesionRadius && distance > 0.0) {
            cohesion += neighborPos.xyz;
            neighborCount += 1.0;
          }
          
          // Separation: avoid crowding
          if (distance < separationRadius && distance > 0.0) {
            vec3 flee = normalize(currentPos.xyz - neighborPos.xyz);
            flee /= distance; // Weight by distance
            separation += flee;
            separationCount += 1.0;
          }
          
          // Alignment: steer toward average heading of neighbors
          if (distance < alignmentRadius && distance > 0.0) {
            alignment += neighborVel.xyz;
          }
        }
        
        // Average the forces
        if (neighborCount > 0.0) {
          cohesion /= neighborCount;
          cohesion = normalize(cohesion - currentPos.xyz);
        }
        
        if (separationCount > 0.0) {
          separation /= separationCount;
          separation = normalize(separation);
        }
        
        if (neighborCount > 0.0) {
          alignment /= neighborCount;
          alignment = normalize(alignment - currentVel.xyz);
        }
        
        // Pack flocking forces into texture
        // RGB: cohesion + alignment forces
        // A: separation strength
        vec3 combinedForce = cohesion * 0.5 + alignment * 0.3;
        float separationStrength = length(separation);
        
        gl_FragColor = vec4(combinedForce, separationStrength);
      }
    `;

    // Position update shader
    const positionUpdateShader = `
      precision highp float;
      
      uniform sampler2D positionTexture;
      uniform sampler2D velocityTexture;
      uniform sampler2D flockingTexture;
      uniform vec3 mousePosition;
      uniform float mouseInfluence;
      uniform int interactionMode;
      uniform float chargeLevel;
      uniform bool isActive;
      uniform float time;
      uniform float deltaTime;
      uniform float textureSize;
      uniform float particleCount;
      
      varying vec2 vUv;
      
      // Simplex noise for organic movement
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      
      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        
        i = mod289(i);
        vec4 p = permute(permute(permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        
        float n_ = 0.142857142857; // 1.0/7.0
        vec3 ns = n_ * D.wyz - D.xzx;
        
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }
      
      void main() {
        vec2 uv = vUv;
        float particleId = floor(uv.x * textureSize) + floor(uv.y * textureSize) * textureSize;
        
        if (particleId >= particleCount) {
          gl_FragColor = vec4(0.0);
          return;
        }
        
        vec4 currentPos = texture2D(positionTexture, uv);
        vec4 currentVel = texture2D(velocityTexture, uv);
        vec4 flockingData = texture2D(flockingTexture, uv);
        
        vec3 position = currentPos.xyz;
        float lifecycle = currentPos.w;
        vec3 velocity = currentVel.xyz;
        float energy = currentVel.w;
        
        // Apply flocking forces
        vec3 flockingForce = flockingData.xyz * 0.001;
        vec3 separationForce = normalize(position + vec3(0.001)) * flockingData.w * 0.003;
        
        velocity += flockingForce + separationForce;
        
        // Add organic noise movement
        vec3 noiseInput = position * 0.1 + vec3(time * 0.5);
        float noise1 = snoise(noiseInput);
        float noise2 = snoise(noiseInput * 1.5);
        
        velocity.x += noise1 * 0.001;
        velocity.y += noise2 * 0.001;
        
        // Mouse interaction forces
        vec3 toMouse = mousePosition - position;
        float mouseDistance = length(toMouse);
        float maxInfluenceDistance = 4.0;
        
        if (mouseDistance < maxInfluenceDistance && mouseInfluence > 0.0) {
          float influence = (1.0 - mouseDistance / maxInfluenceDistance) * mouseInfluence;
          vec3 mouseForce = vec3(0.0);
          
          if (interactionMode == 0) { // Attract
            mouseForce = normalize(toMouse) * influence * 0.008;
          } else if (interactionMode == 1) { // Repel
            mouseForce = normalize(-toMouse) * influence * 0.012;
          } else if (interactionMode == 2) { // Vortex
            float angle = atan(toMouse.y, toMouse.x);
            vec3 tangential = vec3(-sin(angle), cos(angle), 0.0) * influence * 0.015;
            vec3 radial = normalize(toMouse) * influence * 0.003;
            mouseForce = tangential + radial;
          } else if (interactionMode == 3) { // Explosion
            if (chargeLevel > 0.1) {
              mouseForce = normalize(-toMouse) * chargeLevel * influence * 0.025;
            } else if (isActive) {
              mouseForce = normalize(toMouse) * influence * 0.005;
            }
          }
          
          velocity += mouseForce;
          energy = min(energy + 0.015, 1.0);
        }
        
        // Apply velocity damping
        velocity *= 0.99;
        
        // Boundary constraints
        float boundary = 10.0;
        if (abs(position.x) > boundary) {
          velocity.x *= -0.7;
          position.x = sign(position.x) * boundary;
        }
        if (abs(position.y) > boundary) {
          velocity.y *= -0.7;
          position.y = sign(position.y) * boundary;
        }
        if (abs(position.z) > boundary * 0.5) {
          velocity.z *= -0.7;
          position.z = sign(position.z) * boundary * 0.5;
        }
        
        // Update position
        position += velocity * deltaTime;
        
        // Update lifecycle
        lifecycle += deltaTime;
        
        gl_FragColor = vec4(position, lifecycle);
      }
    `;

    // Velocity update shader
    const velocityUpdateShader = `
      precision highp float;
      
      uniform sampler2D velocityTexture;
      uniform sampler2D flockingTexture;
      uniform float deltaTime;
      uniform float textureSize;
      uniform float particleCount;
      
      varying vec2 vUv;
      
      void main() {
        vec2 uv = vUv;
        float particleId = floor(uv.x * textureSize) + floor(uv.y * textureSize) * textureSize;
        
        if (particleId >= particleCount) {
          gl_FragColor = vec4(0.0);
          return;
        }
        
        vec4 currentVel = texture2D(velocityTexture, uv);
        vec4 flockingData = texture2D(flockingTexture, uv);
        
        vec3 velocity = currentVel.xyz;
        float energy = currentVel.w;
        
        // Apply flocking to velocity
        velocity += flockingData.xyz * 0.002;
        
        // Energy decay
        energy = max(energy - 0.005 * deltaTime, 0.3);
        
        gl_FragColor = vec4(velocity, energy);
      }
    `;

    // Create shader materials
    this.flockingComputeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        positionTexture: { value: null },
        velocityTexture: { value: null },
        textureSize: { value: this.textureSize },
        particleCount: { value: this.particleCount },
        cohesionRadius: { value: 2.0 },
        separationRadius: { value: 0.8 },
        alignmentRadius: { value: 2.5 },
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: flockingComputeShader,
    });

    this.positionUpdateMaterial = new THREE.ShaderMaterial({
      uniforms: {
        positionTexture: { value: null },
        velocityTexture: { value: null },
        flockingTexture: { value: null },
        mousePosition: { value: new THREE.Vector3() },
        mouseInfluence: { value: 1.0 },
        interactionMode: { value: 0 },
        chargeLevel: { value: 0 },
        isActive: { value: false },
        time: { value: 0 },
        deltaTime: { value: 0.016 },
        textureSize: { value: this.textureSize },
        particleCount: { value: this.particleCount },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: positionUpdateShader,
    });

    this.velocityUpdateMaterial = new THREE.ShaderMaterial({
      uniforms: {
        velocityTexture: { value: null },
        flockingTexture: { value: null },
        deltaTime: { value: 0.016 },
        textureSize: { value: this.textureSize },
        particleCount: { value: this.particleCount },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: velocityUpdateShader,
    });
  }

  private initializeGeometry(): void {
    this.fullScreenGeometry = new THREE.PlaneGeometry(2, 2);
    this.fullScreenMesh = new THREE.Mesh(this.fullScreenGeometry);
  }

  public initializeTextures(positions: Float32Array, velocities: Float32Array): void {
    const positionData = new Float32Array(this.textureSize * this.textureSize * 4);
    const velocityData = new Float32Array(this.textureSize * this.textureSize * 4);

    // Copy particle data to texture format
    for (let i = 0; i < this.particleCount; i++) {
      const i4 = i * 4;
      const i3 = i * 3;

      // Position (xyz + lifecycle)
      positionData[i4] = positions[i3] || 0;
      positionData[i4 + 1] = positions[i3 + 1] || 0;
      positionData[i4 + 2] = positions[i3 + 2] || 0;
      positionData[i4 + 3] = 0; // lifecycle

      // Velocity (xyz + energy)
      velocityData[i4] = velocities[i3] || 0;
      velocityData[i4 + 1] = velocities[i3 + 1] || 0;
      velocityData[i4 + 2] = velocities[i3 + 2] || 0;
      velocityData[i4 + 3] = 0.5 + Math.random() * 0.5; // energy
    }

    const positionTexture1 = new THREE.DataTexture(
      positionData, 
      this.textureSize, 
      this.textureSize, 
      THREE.RGBAFormat, 
      THREE.FloatType
    );
    positionTexture1.needsUpdate = true;

    const velocityTexture1 = new THREE.DataTexture(
      velocityData, 
      this.textureSize, 
      this.textureSize, 
      THREE.RGBAFormat, 
      THREE.FloatType
    );
    velocityTexture1.needsUpdate = true;

    // Initialize render targets with data
    this.renderer.setRenderTarget(this.positionRenderTarget1);
    this.fullScreenMesh.material = new THREE.MeshBasicMaterial({ map: positionTexture1 });
    this.renderer.render(this.fullScreenMesh, new THREE.Camera());

    this.renderer.setRenderTarget(this.velocityRenderTarget1);
    this.fullScreenMesh.material = new THREE.MeshBasicMaterial({ map: velocityTexture1 });
    this.renderer.render(this.fullScreenMesh, new THREE.Camera());

    this.renderer.setRenderTarget(null);
  }

  public update(
    time: number, 
    deltaTime: number, 
    mousePosition: THREE.Vector3,
    mouseInfluence: number,
    interactionMode: number,
    chargeLevel: number,
    isActive: boolean,
    parameters: FlockingParameters
  ): void {
    const currentPositionTarget = this.currentFrame ? this.positionRenderTarget1 : this.positionRenderTarget2;
    const currentVelocityTarget = this.currentFrame ? this.velocityRenderTarget1 : this.velocityRenderTarget2;
    const nextPositionTarget = this.currentFrame ? this.positionRenderTarget2 : this.positionRenderTarget1;
    const nextVelocityTarget = this.currentFrame ? this.velocityRenderTarget2 : this.velocityRenderTarget1;

    // 1. Compute flocking forces
    this.flockingComputeMaterial.uniforms.positionTexture.value = currentPositionTarget.texture;
    this.flockingComputeMaterial.uniforms.velocityTexture.value = currentVelocityTarget.texture;
    this.flockingComputeMaterial.uniforms.time.value = time;
    this.flockingComputeMaterial.uniforms.cohesionRadius.value = parameters.cohesionRadius;
    this.flockingComputeMaterial.uniforms.separationRadius.value = parameters.separationRadius;
    this.flockingComputeMaterial.uniforms.alignmentRadius.value = parameters.alignmentRadius;

    this.renderer.setRenderTarget(this.flockingDataTarget);
    this.fullScreenMesh.material = this.flockingComputeMaterial;
    this.renderer.render(this.fullScreenMesh, new THREE.Camera());

    // 2. Update positions
    this.positionUpdateMaterial.uniforms.positionTexture.value = currentPositionTarget.texture;
    this.positionUpdateMaterial.uniforms.velocityTexture.value = currentVelocityTarget.texture;
    this.positionUpdateMaterial.uniforms.flockingTexture.value = this.flockingDataTarget.texture;
    this.positionUpdateMaterial.uniforms.mousePosition.value.copy(mousePosition);
    this.positionUpdateMaterial.uniforms.mouseInfluence.value = mouseInfluence;
    this.positionUpdateMaterial.uniforms.interactionMode.value = interactionMode;
    this.positionUpdateMaterial.uniforms.chargeLevel.value = chargeLevel;
    this.positionUpdateMaterial.uniforms.isActive.value = isActive;
    this.positionUpdateMaterial.uniforms.time.value = time;
    this.positionUpdateMaterial.uniforms.deltaTime.value = deltaTime;

    this.renderer.setRenderTarget(nextPositionTarget);
    this.fullScreenMesh.material = this.positionUpdateMaterial;
    this.renderer.render(this.fullScreenMesh, new THREE.Camera());

    // 3. Update velocities
    this.velocityUpdateMaterial.uniforms.velocityTexture.value = currentVelocityTarget.texture;
    this.velocityUpdateMaterial.uniforms.flockingTexture.value = this.flockingDataTarget.texture;
    this.velocityUpdateMaterial.uniforms.deltaTime.value = deltaTime;

    this.renderer.setRenderTarget(nextVelocityTarget);
    this.fullScreenMesh.material = this.velocityUpdateMaterial;
    this.renderer.render(this.fullScreenMesh, new THREE.Camera());

    this.renderer.setRenderTarget(null);

    // Toggle for next frame
    this.currentFrame = !this.currentFrame;
  }

  public getCurrentPositionTexture(): THREE.Texture {
    return this.currentFrame ? this.positionRenderTarget1.texture : this.positionRenderTarget2.texture;
  }

  public getCurrentVelocityTexture(): THREE.Texture {
    return this.currentFrame ? this.velocityRenderTarget1.texture : this.velocityRenderTarget2.texture;
  }

  public getFlockingTexture(): THREE.Texture {
    return this.flockingDataTarget.texture;
  }

  public dispose(): void {
    this.positionRenderTarget1.dispose();
    this.positionRenderTarget2.dispose();
    this.velocityRenderTarget1.dispose();
    this.velocityRenderTarget2.dispose();
    this.flockingDataTarget.dispose();
    
    this.positionUpdateMaterial.dispose();
    this.velocityUpdateMaterial.dispose();
    this.flockingComputeMaterial.dispose();
    
    this.fullScreenGeometry.dispose();
  }
}