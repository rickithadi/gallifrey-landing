// High-performance fragment shader for GPU particle system
// Handles particle rendering with quality-based effects and brand colors

precision highp float;

// Uniforms
uniform float time;
uniform float globalOpacity;
uniform sampler2D particleTexture;
uniform bool useTexture;
uniform float deviceQuality;

// Varyings from vertex shader
varying vec3 vColor;
varying float vOpacity;
varying float vSize;
varying float vDistance;
varying float vEnergy;

void main() {
  // Calculate distance from center of point
  vec2 coord = gl_PointCoord - vec2(0.5);
  float distance = length(coord);
  
  // Early discard for pixels outside circle (performance optimization)
  if (distance > 0.5) {
    discard;
  }
  
  // Base circular falloff for particle shape
  float alpha = 1.0 - smoothstep(0.3, 0.5, distance);
  
  // Quality-based visual effects for performance scaling
  vec3 finalColor = vColor;
  
  if (deviceQuality > 1.5) {
    // High quality: Complex multi-layer effects
    
    // Inner core with high intensity
    float innerCore = 1.0 - smoothstep(0.0, 0.15, distance);
    
    // Mid glow layer
    float midGlow = 1.0 - smoothstep(0.15, 0.35, distance);
    
    // Outer soft glow
    float outerGlow = 1.0 - smoothstep(0.35, 0.5, distance);
    
    // Energy-based color enhancement
    vec3 energyGlow = vec3(0.3, 0.5, 0.8) * innerCore * vEnergy * 0.6;
    vec3 midLayer = vec3(0.2, 0.4, 0.7) * midGlow * vEnergy * 0.3;
    
    // Gallifrey brand colors with energy boost
    vec3 coreColor = vColor * (1.0 + innerCore * 0.8);
    
    // Combine layers for rich visual depth
    finalColor = coreColor + energyGlow + midLayer;
    
    // Enhanced alpha with multiple falloffs
    alpha = innerCore * 0.9 + midGlow * 0.6 + outerGlow * 0.3;
    
  } else if (deviceQuality > 0.5) {
    // Medium quality: Simple glow effect
    
    float innerGlow = 1.0 - smoothstep(0.0, 0.25, distance);
    float outerGlow = 1.0 - smoothstep(0.25, 0.45, distance);
    
    // Energy-enhanced glow
    vec3 glowColor = vec3(0.2, 0.4, 0.6) * innerGlow * vEnergy * 0.4;
    finalColor = vColor + glowColor;
    
    alpha = innerGlow * 0.8 + outerGlow * 0.4;
    
  } else {
    // Low quality: Basic particle with minimal effects
    
    float simpleGlow = 1.0 - smoothstep(0.0, 0.3, distance);
    finalColor = vColor * (1.0 + simpleGlow * 0.2);
    
    // Simple alpha falloff
    alpha = 1.0 - smoothstep(0.2, 0.5, distance);
  }
  
  // Energy-based pulsing effect
  float pulse = 0.8 + 0.2 * sin(time * 3.0 + vDistance * 0.1) * vEnergy;
  
  // Distance-based LOD fading
  float distanceFade = 1.0 - smoothstep(15.0, 25.0, vDistance);
  
  // Size-based alpha adjustment (smaller particles fade more)
  float sizeFade = smoothstep(0.5, 2.0, vSize);
  
  // Final alpha calculation with all fade factors
  float finalAlpha = alpha * vOpacity * globalOpacity * pulse * distanceFade * sizeFade;
  
  // Brand color consistency check
  // Ensure colors stay within Gallifrey/OYN palette bounds
  finalColor = clamp(finalColor, vec3(0.0), vec3(1.2));
  
  // Premultiplied alpha for correct blending
  gl_FragColor = vec4(finalColor * finalAlpha, finalAlpha);
  
  // Performance optimization: discard nearly invisible fragments
  if (finalAlpha < 0.01) {
    discard;
  }
}