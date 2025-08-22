// High-performance GPU-optimized particle shaders for Three.js
// Converts CPU-heavy calculations to WebGL shaders for maximum performance

export const optimizedParticleVertexShader = `
  precision highp float;
  
  // Attributes - per particle data
  attribute vec3 position;
  attribute vec3 basePosition;
  attribute float particleId;
  attribute float phase;
  attribute float size;
  attribute float energy;
  attribute float lifecycle;
  attribute float maxLifetime;
  attribute vec3 velocity;
  attribute vec3 baseColor;
  attribute vec3 targetColor;
  
  // Uniforms - global data
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float time;
  uniform vec3 mousePosition;
  uniform float mouseInfluence;
  uniform int interactionMode; // 0=attract, 1=repel, 2=vortex, 3=explosion
  uniform float chargeLevel;
  uniform bool isActive;
  uniform float globalScale;
  uniform float deviceQuality; // 0=low, 1=medium, 2=high
  uniform float particleCount;
  uniform sampler2D flockingTexture; // Texture containing neighbor data
  
  // Varyings - pass to fragment shader
  varying vec3 vColor;
  varying float vOpacity;
  varying float vSize;
  varying float vDistance;
  varying float vEnergy;
  
  // Enhanced noise functions for organic movement
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
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  // GPU-based flocking calculation
  vec3 calculateFlockingForce(vec3 currentPos, float currentId) {
    vec3 cohesion = vec3(0.0);
    vec3 separation = vec3(0.0);
    vec3 alignment = vec3(0.0);
    float neighborCount = 0.0;
    
    // Sample flocking texture for neighbor data
    // This would contain pre-computed neighbor information
    vec2 texCoord = vec2(currentId / particleCount, 0.5);
    vec4 flockData = texture2D(flockingTexture, texCoord);
    
    // Extract flocking forces from texture
    // This is a simplified approach - in a full implementation,
    // you'd use compute shaders or multiple passes
    cohesion = flockData.xyz * 0.001;
    separation = normalize(currentPos) * flockData.w * 0.003;
    
    return cohesion + separation + alignment;
  }
  
  void main() {
    // Calculate lifecycle progress
    float lifeProgress = lifecycle / maxLifetime;
    
    // Fade in/out calculations
    float fadeIn = lifeProgress < 0.1 ? lifeProgress / 0.1 : 1.0;
    float fadeOut = lifeProgress > 0.85 ? 1.0 - ((lifeProgress - 0.85) / 0.15) : 1.0;
    vOpacity = fadeIn * fadeOut;
    
    // Base position with time-based animations
    vec3 particlePos = basePosition;
    
    // Organic floating motion using multiple noise layers
    float timeScale = time * 0.5;
    vec3 noiseInput = basePosition * 0.1 + vec3(particleId * 0.1);
    
    float noise1 = snoise(noiseInput + vec3(timeScale));
    float noise2 = snoise(noiseInput * 1.5 + vec3(timeScale * 1.2));
    float noise3 = snoise(noiseInput * 0.8 + vec3(timeScale * 0.7));
    
    // Quality-based animation complexity
    if (deviceQuality > 1.5) { // High quality
      particlePos.y += sin(time + phase) * 0.5 + noise1 * 0.3;
      particlePos.x += cos(time * 0.7 + phase) * 0.3 + noise2 * 0.2;
      particlePos.z += sin(time * 0.8 + phase * 1.5) * 0.2 + noise3 * 0.1;
    } else if (deviceQuality > 0.5) { // Medium quality
      particlePos.y += sin(time + phase) * 0.4 + noise1 * 0.2;
      particlePos.x += cos(time * 0.5 + phase) * 0.2;
    } else { // Low quality
      particlePos.y += sin(time + phase) * 0.3;
    }
    
    // Mouse interaction based on mode
    vec3 toMouse = mousePosition - particlePos;
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
          // Explosion
          mouseForce = normalize(-toMouse) * chargeLevel * influence * 0.025;
        } else if (isActive) {
          // Charging
          mouseForce = normalize(toMouse) * influence * 0.005;
        }
      }
      
      particlePos += mouseForce;
      vEnergy = min(energy + 0.015, 1.0);
    } else {
      vEnergy = max(energy - 0.005, 0.3);
    }
    
    // GPU-based flocking (simplified for performance)
    if (deviceQuality > 1.0) {
      vec3 flockingForce = calculateFlockingForce(particlePos, particleId);
      particlePos += flockingForce;
    }
    
    // Boundary constraints
    float boundary = 10.0;
    particlePos = clamp(particlePos, vec3(-boundary), vec3(boundary));
    
    // Dynamic color transitions
    float colorTransition = sin(time * 0.3 + phase) * 0.5 + 0.5;
    vColor = mix(baseColor, targetColor, colorTransition * 0.6);
    
    // Enhanced size calculation with interaction effects
    float pulseScale = 1.0 + sin(time * 2.0 + phase) * 0.3 * vEnergy;
    float energyScale = 0.7 + vEnergy * 0.6;
    float interactionScale = 1.0;
    
    if (mouseDistance < maxInfluenceDistance) {
      float interactionStrength = 1.0 - (mouseDistance / maxInfluenceDistance);
      interactionScale = 1.0 + interactionStrength * 0.5;
      
      if (interactionMode == 3 && chargeLevel > 0.1) { // Explosion mode
        interactionScale *= 1.0 + chargeLevel * 2.0;
      }
    }
    
    vSize = size * globalScale * pulseScale * energyScale * interactionScale;
    
    // Transform to screen space
    vec4 mvPosition = modelViewMatrix * vec4(particlePos, 1.0);
    vDistance = -mvPosition.z;
    
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = vSize * (300.0 / vDistance);
    
    // Clamp point size for performance
    gl_PointSize = clamp(gl_PointSize, 1.0, 128.0);
  }
`;

export const optimizedParticleFragmentShader = `
  precision highp float;
  
  uniform float time;
  uniform float globalOpacity;
  uniform sampler2D particleTexture;
  uniform bool useTexture;
  uniform float deviceQuality;
  
  varying vec3 vColor;
  varying float vOpacity;
  varying float vSize;
  varying float vDistance;
  varying float vEnergy;
  
  void main() {
    // Circular particle shape with soft edges
    vec2 coord = gl_PointCoord - vec2(0.5);
    float distance = length(coord);
    
    // Discard pixels outside circle for performance
    if (distance > 0.5) {
      discard;
    }
    
    // Soft circular falloff
    float alpha = 1.0 - smoothstep(0.3, 0.5, distance);
    
    // Quality-based effects
    vec3 finalColor = vColor;
    
    if (deviceQuality > 1.0) {
      // High quality: Inner glow and complex lighting
      float innerGlow = 1.0 - smoothstep(0.0, 0.25, distance);
      float outerGlow = 1.0 - smoothstep(0.25, 0.45, distance);
      
      // Energy-based color enhancement
      vec3 energyGlow = vec3(0.3, 0.5, 0.8) * innerGlow * vEnergy * 0.4;
      vec3 coreColor = vColor * (1.0 + innerGlow * 0.5);
      
      finalColor = mix(coreColor + energyGlow, vColor, outerGlow);
    } else if (deviceQuality > 0.5) {
      // Medium quality: Simple glow
      float glow = 1.0 - smoothstep(0.0, 0.3, distance);
      finalColor = vColor + vec3(0.2, 0.3, 0.5) * glow * vEnergy * 0.2;
    }
    // Low quality: Just basic color
    
    // Pulsing effect based on energy
    float pulse = 0.8 + 0.2 * sin(time * 3.0 + vDistance * 0.1) * vEnergy;
    
    // Distance-based fading for LOD
    float distanceFade = 1.0 - smoothstep(15.0, 25.0, vDistance);
    
    // Final alpha calculation
    float finalAlpha = alpha * vOpacity * globalOpacity * pulse * distanceFade;
    
    // Premultiplied alpha for better blending
    gl_FragColor = vec4(finalColor * finalAlpha, finalAlpha);
    
    // Discard nearly invisible fragments
    if (finalAlpha < 0.01) {
      discard;
    }
  }
`;

export const optimizedTrailVertexShader = `
  precision highp float;
  
  attribute vec3 position;
  attribute vec3 previousPosition;
  attribute float trailProgress;
  attribute float particleId;
  attribute vec3 particleColor;
  attribute float particleEnergy;
  
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float time;
  uniform float globalOpacity;
  uniform float deviceQuality;
  
  varying vec3 vColor;
  varying float vAlpha;
  varying float vProgress;
  varying float vDistance;
  
  void main() {
    vProgress = trailProgress;
    vColor = particleColor;
    
    // Smooth trail interpolation
    vec3 trailPosition = mix(previousPosition, position, smoothstep(0.0, 1.0, trailProgress));
    
    // Trail fade based on progress and energy
    vAlpha = (1.0 - trailProgress) * particleEnergy * globalOpacity;
    
    // Quality-based trail length
    if (deviceQuality < 1.0) {
      // Low quality: shorter trails
      vAlpha *= 0.6;
    }
    
    vec4 mvPosition = modelViewMatrix * vec4(trailPosition, 1.0);
    vDistance = -mvPosition.z;
    
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 2.0 + trailProgress * 3.0;
  }
`;

export const optimizedTrailFragmentShader = `
  precision highp float;
  
  uniform float time;
  uniform float deviceQuality;
  
  varying vec3 vColor;
  varying float vAlpha;
  varying float vProgress;
  varying float vDistance;
  
  void main() {
    // Circular trail points
    vec2 coord = gl_PointCoord - vec2(0.5);
    float distance = length(coord);
    
    if (distance > 0.5) {
      discard;
    }
    
    // Soft edge for trail points
    float alpha = (1.0 - smoothstep(0.2, 0.5, distance)) * vAlpha;
    
    // Distance-based fading
    alpha *= 1.0 - smoothstep(10.0, 20.0, vDistance);
    
    // Quality-based effects
    vec3 finalColor = vColor;
    if (deviceQuality > 1.0) {
      // High quality: subtle glow
      float glow = 1.0 - smoothstep(0.0, 0.3, distance);
      finalColor += vec3(0.1, 0.2, 0.3) * glow * 0.3;
    }
    
    gl_FragColor = vec4(finalColor * alpha, alpha);
    
    if (alpha < 0.005) {
      discard;
    }
  }
`;

export const optimizedConnectionVertexShader = `
  precision highp float;
  
  attribute vec3 position;
  attribute vec3 targetPosition;
  attribute float connectionStrength;
  attribute float connectionId;
  attribute float segmentProgress;
  
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float time;
  uniform float deviceQuality;
  uniform float globalOpacity;
  
  varying float vStrength;
  varying float vDistance;
  varying float vSegment;
  varying vec3 vWorldPosition;
  
  void main() {
    vStrength = connectionStrength;
    vSegment = segmentProgress;
    vWorldPosition = position;
    
    // Interpolate along connection line
    vec3 connectionPos = mix(position, targetPosition, segmentProgress);
    
    // Quality-based wave animation
    if (deviceQuality > 1.0) {
      // High quality: complex wave with multiple harmonics
      float wave1 = sin(time * 2.0 + connectionId + segmentProgress * 6.28) * 0.05;
      float wave2 = sin(time * 3.0 + connectionId * 1.5 + segmentProgress * 12.56) * 0.02;
      
      vec3 perpendicular = normalize(cross(targetPosition - position, vec3(0.0, 0.0, 1.0)));
      connectionPos += perpendicular * (wave1 + wave2) * connectionStrength;
    } else if (deviceQuality > 0.5) {
      // Medium quality: simple wave
      float wave = sin(time * 1.5 + connectionId + segmentProgress * 6.28) * 0.03;
      vec3 perpendicular = normalize(cross(targetPosition - position, vec3(0.0, 0.0, 1.0)));
      connectionPos += perpendicular * wave * connectionStrength;
    }
    
    vec4 mvPosition = modelViewMatrix * vec4(connectionPos, 1.0);
    vDistance = -mvPosition.z;
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const optimizedConnectionFragmentShader = `
  precision highp float;
  
  uniform float time;
  uniform float globalOpacity;
  uniform float deviceQuality;
  
  varying float vStrength;
  varying float vDistance;
  varying float vSegment;
  varying vec3 vWorldPosition;
  
  void main() {
    // Connection strength affects base opacity
    float alpha = vStrength * 0.4 * globalOpacity;
    
    // Distance-based fading
    alpha *= 1.0 - smoothstep(10.0, 20.0, vDistance);
    
    // Segment-based fading (stronger in center)
    float segmentFade = sin(vSegment * 3.14159) * 0.5 + 0.5;
    alpha *= segmentFade;
    
    // Quality-based effects
    vec3 connectionColor = vec3(0.2, 0.4, 0.7); // Gallifrey blue
    
    if (deviceQuality > 1.0) {
      // High quality: pulsing and color variation
      float pulse = 0.7 + 0.3 * sin(time * 1.5 + vWorldPosition.x * 0.1);
      connectionColor *= 1.0 + 0.2 * sin(time * 2.0 + vWorldPosition.y * 0.05);
      alpha *= pulse;
    } else if (deviceQuality > 0.5) {
      // Medium quality: simple pulse
      float pulse = 0.8 + 0.2 * sin(time * 1.0);
      alpha *= pulse;
    }
    
    gl_FragColor = vec4(connectionColor * alpha, alpha);
    
    if (alpha < 0.005) {
      discard;
    }
  }
`;

// Shader utility functions
export const createParticleShaderMaterial = (uniforms: Record<string, THREE.IUniform>) => {
  return new THREE.ShaderMaterial({
    vertexShader: optimizedParticleVertexShader,
    fragmentShader: optimizedParticleFragmentShader,
    uniforms,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: true,
    depthWrite: false,
    vertexColors: false,
  });
};

export const createTrailShaderMaterial = (uniforms: Record<string, THREE.IUniform>) => {
  return new THREE.ShaderMaterial({
    vertexShader: optimizedTrailVertexShader,
    fragmentShader: optimizedTrailFragmentShader,
    uniforms,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false,
  });
};

export const createConnectionShaderMaterial = (uniforms: Record<string, THREE.IUniform>) => {
  return new THREE.ShaderMaterial({
    vertexShader: optimizedConnectionVertexShader,
    fragmentShader: optimizedConnectionFragmentShader,
    uniforms,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false,
  });
};