import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GPUParticlesProps {
  variant: 'original' | 'lightweight';
  mousePosition: THREE.Vector3;
  time: number;
}

// Vertex shader for GPU-accelerated particles
const gpuVertexShader = `
  uniform float time;
  uniform vec3 mousePos;
  uniform float particleCount;
  
  attribute float size;
  attribute vec3 customColor;
  attribute float phase;
  attribute float energy;
  
  varying vec3 vColor;
  varying float vAlpha;
  varying float vSize;
  
  // Simplex noise for organic movement
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    vColor = customColor;
    
    // Calculate world position
    vec3 worldPos = position;
    
    // Add organic floating motion using multiple noise layers
    float noise1 = snoise(vec2(worldPos.x * 0.1, worldPos.y * 0.1) + time * 0.3) * 2.0;
    float noise2 = snoise(vec2(worldPos.x * 0.2, worldPos.z * 0.15) + time * 0.5) * 1.0;
    float noise3 = snoise(vec2(worldPos.y * 0.08, worldPos.z * 0.12) + time * 0.2) * 0.5;
    
    worldPos.x += noise1 + sin(time + phase) * 0.3;
    worldPos.y += noise2 + cos(time + phase * 1.3) * 0.2;
    worldPos.z += noise3 + sin(time * 0.7 + phase * 0.8) * 0.4;
    
    // Mouse interaction effects
    float mouseDistance = distance(worldPos.xy, mousePos.xy);
    float mouseInfluence = 1.0 / (1.0 + mouseDistance * 0.3);
    
    // Attraction/repulsion based on mouse proximity
    if (mouseDistance < 4.0) {
      vec3 toMouse = normalize(mousePos - worldPos);
      worldPos += toMouse * mouseInfluence * 0.5;
      
      // Energy boost from mouse interaction
      vColor = mix(vColor, vec3(1.0, 0.8, 0.2), mouseInfluence * 0.3);
    }
    
    // Calculate size with pulsing and energy effects
    float pulse = sin(time * 2.0 + phase) * 0.3 + 0.7;
    vSize = size * pulse * (0.5 + energy * 0.5) * (0.8 + mouseInfluence * 0.4);
    
    // Alpha based on energy and distance from camera
    float cameraDistance = length(worldPos - cameraPosition);
    vAlpha = energy * (1.0 - smoothstep(5.0, 15.0, cameraDistance)) * 0.8;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPos, 1.0);
    gl_PointSize = vSize * (300.0 / gl_Position.w); // Perspective scaling
  }
`;

// Fragment shader for GPU particles
const gpuFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vSize;
  
  void main() {
    // Create circular particles with soft edges
    vec2 center = gl_PointCoord - vec2(0.5);
    float distance = length(center);
    
    if (distance > 0.5) {
      discard;
    }
    
    // Soft falloff for smooth edges
    float alpha = (1.0 - smoothstep(0.2, 0.5, distance)) * vAlpha;
    
    // Add inner glow effect
    float glow = 1.0 - smoothstep(0.0, 0.3, distance);
    vec3 color = vColor + vec3(0.2, 0.4, 0.6) * glow * 0.5;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

export function GPUParticles({ variant, mousePosition, time }: GPUParticlesProps) {
  const meshRef = useRef<THREE.Points>(null);
  const particleCount = 150;
  
  // Generate particle data
  const particleData = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);
    const energies = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // Random positions in 3D space
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      
      // Brand-appropriate colors
      let color: THREE.Color;
      if (variant === 'lightweight') {
        // Mix of Gallifrey teal and OYN orange
        const mix = Math.random();
        color = new THREE.Color().lerpColors(
          new THREE.Color('#2D5A87'),
          new THREE.Color('#F97316'),
          mix * 0.4
        );
      } else {
        // Professional blue palette
        const mix = Math.random();
        color = new THREE.Color().lerpColors(
          new THREE.Color('#2D5A87'),
          new THREE.Color('#3B82F6'),
          mix
        );
      }
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Particle properties
      sizes[i] = 15 + Math.random() * 25; // Point size
      phases[i] = Math.random() * Math.PI * 2;
      energies[i] = 0.3 + Math.random() * 0.7;
    }
    
    return { positions, colors, sizes, phases, energies };
  }, [particleCount, variant]);
  
  // Create geometry
  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    
    geometry.setAttribute('position', new THREE.BufferAttribute(particleData.positions, 3));
    geometry.setAttribute('customColor', new THREE.BufferAttribute(particleData.colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(particleData.sizes, 1));
    geometry.setAttribute('phase', new THREE.BufferAttribute(particleData.phases, 1));
    geometry.setAttribute('energy', new THREE.BufferAttribute(particleData.energies, 1));
    
    return geometry;
  }, [particleData]);
  
  // Create shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: gpuVertexShader,
      fragmentShader: gpuFragmentShader,
      uniforms: {
        time: { value: 0 },
        mousePos: { value: mousePosition },
        particleCount: { value: particleCount },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false,
      vertexColors: true,
    });
  }, [mousePosition, particleCount]);
  
  // Animation loop
  useFrame(() => {
    if (material.uniforms) {
      material.uniforms.time.value = time;
      material.uniforms.mousePos.value.copy(mousePosition);
    }
  });
  
  return (
    <points
      ref={meshRef}
      geometry={geometry}
      material={material}
      frustumCulled={false}
    />
  );
}