import React, { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AuroraEffectProps {
  variant: 'original' | 'lightweight';
  mousePosition: THREE.Vector3;
  time: number;
}

// Optimized vertex shader for aurora waves with reduced noise complexity
const auroraVertexShader = `
  uniform float time;
  uniform vec3 mousePos;
  uniform float performanceLevel; // 0.0 = low, 1.0 = high
  varying vec2 vUv;
  varying vec3 vPosition;
  varying float vWave;
  varying float vMouseInfluence;

  // Optimized noise function using fewer calculations
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  void main() {
    vUv = uv;
    vPosition = position;

    // Precompute mouse influence to reduce fragment shader work
    vMouseInfluence = 1.0 / (1.0 + distance(mousePos.xy, position.xy) * 0.5);

    // Adaptive wave complexity based on performance level
    float timeScale = time * 0.3;
    vec2 pos = position.xy;

    if (performanceLevel > 0.7) {
      // High quality: 3 wave layers
      float wave1 = noise(pos * 0.3 + timeScale);
      float wave2 = noise(pos * 0.5 + timeScale * 1.4) * 0.5;
      float wave3 = noise(pos * 0.7 - timeScale * 0.8) * 0.3;
      vWave = (wave1 + wave2 + wave3) * vMouseInfluence;
    } else if (performanceLevel > 0.3) {
      // Medium quality: 2 wave layers
      float wave1 = noise(pos * 0.3 + timeScale);
      float wave2 = noise(pos * 0.5 + timeScale * 1.4) * 0.5;
      vWave = (wave1 + wave2) * vMouseInfluence;
    } else {
      // Low quality: 1 wave layer
      vWave = noise(pos * 0.3 + timeScale) * vMouseInfluence;
    }

    // Displace vertices slightly for organic movement
    vec3 displaced = position;
    displaced.z += vWave * 0.2;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

// Optimized fragment shader with reduced calculations
const auroraFragmentShader = `
  uniform float time;
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  uniform vec3 mousePos;
  uniform float opacity;
  uniform float performanceLevel;

  varying vec2 vUv;
  varying vec3 vPosition;
  varying float vWave;
  varying float vMouseInfluence;

  void main() {
    // Precomputed time values to reduce redundant calculations
    float timeOffset1 = time * 0.5;
    float timeOffset2 = time * 0.3;

    // Optimized color mixing using fewer trig functions
    float colorMix1 = sin(vUv.x * 3.14159 + timeOffset1 + vWave) * 0.5 + 0.5;

    // Adaptive color complexity based on performance
    vec3 color;
    if (performanceLevel > 0.5) {
      float colorMix2 = cos(vUv.y * 3.14159 - timeOffset2 + vWave * 0.7) * 0.5 + 0.5;
      color = mix(color1, color2, colorMix1);
      color = mix(color, color3, colorMix2 * 0.6);
    } else {
      // Simplified color mixing for low performance
      color = mix(color1, color2, colorMix1);
      color = mix(color, color3, vWave * 0.3 + 0.3);
    }

    // Use precomputed mouse influence from vertex shader
    float brightness = 1.0 + vMouseInfluence * 0.5;

    // Optimized edge fade calculation
    vec2 edgeFactors = smoothstep(vec2(0.0), vec2(0.3), vUv) *
                      smoothstep(vec2(1.0), vec2(0.7), vUv);
    float edgeFade = edgeFactors.x * edgeFactors.y;

    // Final aurora effect with reduced calculations
    float alpha = opacity * edgeFade * (0.3 + abs(vWave) * 0.7) * brightness;

    gl_FragColor = vec4(color * brightness, alpha);
  }
`;

export function AuroraEffect({ variant, mousePosition, time }: AuroraEffectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const performanceLevel = useRef(1.0);
  const frameCounter = useRef(0);
  const lastPerformanceCheck = useRef(0);

  // Aurora color schemes based on brand
  const colorScheme = useMemo(() => {
    if (variant === 'lightweight') {
      return {
        color1: new THREE.Color('#2D5A87'), // Gallifrey teal
        color2: new THREE.Color('#F97316'), // OYN orange
        color3: new THREE.Color('#10B981'), // Emerald accent
      };
    }
    return {
      color1: new THREE.Color('#2D5A87'), // Gallifrey blue
      color2: new THREE.Color('#3B82F6'), // Bright blue
      color3: new THREE.Color('#8B5CF6'), // Purple accent
    };
  }, [variant]);

  // Adaptive geometry based on performance
  const geometry = useMemo(() => {
    // Start with high detail, will be adapted based on performance
    const segments = 32;
    return new THREE.PlaneGeometry(25, 15, segments, segments);
  }, []);

  // Performance monitoring
  const adaptGeometryDetail = useCallback((currentFPS: number) => {
    if (currentFPS < 30) {
      performanceLevel.current = 0.2;
    } else if (currentFPS < 45) {
      performanceLevel.current = 0.5;
    } else {
      performanceLevel.current = 1.0;
    }
  }, []);

  // Create optimized shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: auroraVertexShader,
      fragmentShader: auroraFragmentShader,
      uniforms: {
        time: { value: 0 },
        mousePos: { value: mousePosition },
        color1: { value: colorScheme.color1 },
        color2: { value: colorScheme.color2 },
        color3: { value: colorScheme.color3 },
        opacity: { value: 0.4 },
        performanceLevel: { value: 1.0 },
      },
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [colorScheme, mousePosition]);

  // Update uniforms with performance monitoring
  useFrame((state, delta) => {
    frameCounter.current++;

    // Performance check every 60 frames (about 1 second at 60fps)
    if (frameCounter.current - lastPerformanceCheck.current > 60) {
      const currentFPS = 1000 / (delta * 1000 || 16.67);
      adaptGeometryDetail(currentFPS);
      lastPerformanceCheck.current = frameCounter.current;
    }

    if (material.uniforms) {
      material.uniforms.time.value = time;
      material.uniforms.mousePos.value.copy(mousePosition);
      material.uniforms.performanceLevel.value = performanceLevel.current;

      // Adaptive opacity based on performance
      const baseOpacity = 0.4;
      material.uniforms.opacity.value = baseOpacity * (0.5 + performanceLevel.current * 0.5);
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[0, 0, -8]}
      rotation={[0, 0, 0]}
    />
  );
}
