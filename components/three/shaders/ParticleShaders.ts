// GPU-optimized particle shaders for maximum performance

export const particleVertexShader = `
  precision highp float;
  
  // Attributes
  attribute vec3 position;
  attribute float particleId;
  attribute vec3 basePosition;
  attribute float phase;
  attribute float scale;
  
  // Uniforms
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float time;
  uniform vec3 mousePosition;
  uniform float mouseInfluence;
  uniform float animationComplexity;
  uniform float globalScale;
  
  // Varyings
  varying float vPhase;
  varying float vDistance;
  varying vec3 vColor;
  varying float vOpacity;
  
  // Noise function for organic movement
  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec3 permute(vec3 x) {
    return mod289(((x * 34.0) + 1.0) * x);
  }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i.xyxy);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    vPhase = phase;
    
    // Base particle position
    vec3 particlePos = basePosition;
    
    // Floating animation with noise for organic movement
    float noiseTime = time * 0.5;
    vec2 noiseCoord = basePosition.xy * 0.1 + vec2(particleId * 0.1);
    float noise1 = snoise(noiseCoord + noiseTime);
    float noise2 = snoise(noiseCoord * 1.5 + noiseTime * 1.2);
    
    // Vertical floating motion
    particlePos.y += sin(time + phase) * 0.3 + noise1 * 0.2;
    
    // Horizontal drift based on complexity
    if (animationComplexity > 1.5) { // High complexity
      particlePos.x += cos(time * 0.7 + phase) * 0.2 + noise2 * 0.1;
      particlePos.z += sin(time * 0.8 + phase * 1.5) * 0.15;
    } else if (animationComplexity > 0.5) { // Medium complexity
      particlePos.x += cos(time * 0.5 + phase) * 0.1;
    }
    
    // Mouse interaction
    vec3 toMouse = mousePosition - particlePos;
    float mouseDistance = length(toMouse);
    float maxInfluenceDistance = 3.0;
    
    if (mouseDistance < maxInfluenceDistance && mouseInfluence > 0.0) {
      float influence = (1.0 - mouseDistance / maxInfluenceDistance) * mouseInfluence;
      
      // Attraction or repulsion based on distance
      vec3 mouseForce = normalize(toMouse) * influence * 0.5;
      if (mouseDistance < 1.0) {
        mouseForce *= -1.0; // Repulsion when very close
      }
      
      particlePos += mouseForce;
    }
    
    // Scale variation with pulse effect
    float pulseScale = 1.0 + sin(time * 2.0 + phase) * 0.2;
    float finalScale = scale * globalScale * pulseScale;
    
    // Distance for LOD and fading
    vec4 mvPosition = modelViewMatrix * vec4(particlePos, 1.0);
    vDistance = -mvPosition.z;
    
    // Color variation based on position and time
    float colorPhase = phase + time * 0.1;
    vec3 baseColor = vec3(0.2, 0.4, 0.8); // Gallifrey blue
    vec3 accentColor = vec3(0.8, 0.3, 0.1); // OYN orange
    
    float colorMix = (sin(colorPhase) + 1.0) * 0.5;
    vColor = mix(baseColor, accentColor, colorMix * 0.3);
    
    // Opacity based on distance and animation
    vOpacity = 1.0 - smoothstep(15.0, 25.0, vDistance);
    vOpacity *= 0.6 + 0.4 * (sin(time + phase * 2.0) + 1.0) * 0.5;
    
    // Apply scale to position
    vec3 scaledPosition = particlePos;
    scaledPosition += normalize(mvPosition.xyz) * (finalScale - 1.0) * 0.1;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(scaledPosition, 1.0);
    gl_PointSize = finalScale * (300.0 / vDistance);
    
    // Clamp point size for performance
    gl_PointSize = clamp(gl_PointSize, 1.0, 64.0);
  }
`;

export const particleFragmentShader = `
  precision highp float;
  
  uniform float time;
  uniform float opacity;
  uniform sampler2D particleTexture;
  
  varying float vPhase;
  varying float vDistance;
  varying vec3 vColor;
  varying float vOpacity;
  
  void main() {
    // Circular particle shape with soft edges
    vec2 coord = gl_PointCoord - vec2(0.5);
    float distance = length(coord);
    
    // Soft circular falloff
    float alpha = 1.0 - smoothstep(0.3, 0.5, distance);
    
    // Inner glow effect
    float innerGlow = 1.0 - smoothstep(0.0, 0.2, distance);
    innerGlow *= 0.5;
    
    // Pulsing effect
    float pulse = 0.8 + 0.2 * sin(time * 3.0 + vPhase);
    
    // Final color with glow
    vec3 finalColor = vColor + vec3(innerGlow * 0.3);
    float finalAlpha = alpha * vOpacity * opacity * pulse;
    
    // Premultiplied alpha for better blending
    gl_FragColor = vec4(finalColor * finalAlpha, finalAlpha);
    
    // Discard invisible fragments for performance
    if (finalAlpha < 0.01) discard;
  }
`;

export const trailVertexShader = `
  precision highp float;
  
  attribute vec3 position;
  attribute vec3 previousPosition;
  attribute float trailProgress;
  attribute float particleId;
  
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float time;
  
  varying float vProgress;
  varying float vParticleId;
  varying vec3 vPosition;
  
  void main() {
    vProgress = trailProgress;
    vParticleId = particleId;
    vPosition = position;
    
    // Interpolate between current and previous position for smooth trails
    vec3 trailPosition = mix(previousPosition, position, smoothstep(0.0, 1.0, trailProgress));
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(trailPosition, 1.0);
  }
`;

export const trailFragmentShader = `
  precision highp float;
  
  uniform float time;
  uniform float opacity;
  
  varying float vProgress;
  varying float vParticleId;
  varying vec3 vPosition;
  
  void main() {
    // Trail fade out from head to tail
    float alpha = (1.0 - vProgress) * 0.3;
    
    // Color based on particle ID for variety
    float colorPhase = vParticleId * 0.1 + time * 0.05;
    vec3 trailColor = vec3(0.3, 0.5, 0.9) * (0.8 + 0.2 * sin(colorPhase));
    
    gl_FragColor = vec4(trailColor * alpha * opacity, alpha * opacity);
    
    if (alpha < 0.01) discard;
  }
`;

export const connectionVertexShader = `
  precision highp float;
  
  attribute vec3 position;
  attribute vec3 targetPosition;
  attribute float connectionStrength;
  attribute float connectionId;
  
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float time;
  
  varying float vStrength;
  varying float vDistance;
  varying vec3 vWorldPosition;
  
  void main() {
    vStrength = connectionStrength;
    vWorldPosition = position;
    
    // Animate connection line with wave effect
    vec3 midPoint = (position + targetPosition) * 0.5;
    float waveOffset = sin(time * 2.0 + connectionId) * 0.05;
    
    vec3 animatedPosition = position + normalize(midPoint - position) * waveOffset;
    
    vec4 mvPosition = modelViewMatrix * vec4(animatedPosition, 1.0);
    vDistance = -mvPosition.z;
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const connectionFragmentShader = `
  precision highp float;
  
  uniform float time;
  uniform float opacity;
  
  varying float vStrength;
  varying float vDistance;
  varying vec3 vWorldPosition;
  
  void main() {
    // Connection strength affects opacity and color intensity
    float alpha = vStrength * 0.4 * opacity;
    
    // Distance-based fading
    alpha *= 1.0 - smoothstep(10.0, 20.0, vDistance);
    
    // Pulsing effect
    float pulse = 0.7 + 0.3 * sin(time * 1.5);
    alpha *= pulse;
    
    // Gallifrey blue color with subtle variation
    vec3 connectionColor = vec3(0.2, 0.4, 0.7);
    connectionColor *= 1.0 + 0.2 * sin(time + vWorldPosition.x * 0.1);
    
    gl_FragColor = vec4(connectionColor * alpha, alpha);
    
    if (alpha < 0.005) discard;
  }
`;