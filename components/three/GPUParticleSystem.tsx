import React, { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  optimizedParticleVertexShader,
  optimizedParticleFragmentShader,
  optimizedTrailVertexShader,
  optimizedTrailFragmentShader
} from './shaders/OptimizedParticleShaders';

interface GPUParticleSystemProps {
  count: number;
  variant: 'original' | 'lightweight';
  mousePosition: THREE.Vector3;
  time: number;
  gesture?: {
    type: 'none' | 'circular' | 'swipe' | 'hold' | 'drag';
    intensity: number;
    direction?: { x: number; y: number };
    center?: { x: number; y: number };
    radius?: number;
    velocity?: { x: number; y: number };
  };
  interactionState?: {
    mode: 'attract' | 'repel' | 'vortex' | 'explosion';
    isActive: boolean;
    chargeLevel: number;
  };
  velocity?: { x: number; y: number };
  trail?: Array<{ x: number; y: number }>;
  clickIntensity?: number;
}

interface ParticleData {
  positions: Float32Array;
  basePositions: Float32Array;
  particleIds: Float32Array;
  phases: Float32Array;
  sizes: Float32Array;
  energies: Float32Array;
  lifecycles: Float32Array;
  maxLifetimes: Float32Array;
  velocities: Float32Array;
  baseColors: Float32Array;
  targetColors: Float32Array;
}

interface TrailData {
  positions: Float32Array;
  previousPositions: Float32Array;
  trailProgress: Float32Array;
  particleIds: Float32Array;
  colors: Float32Array;
  energies: Float32Array;
}

export function GPUParticleSystem({
  count,
  variant,
  mousePosition,
  time,
  interactionState = { mode: 'attract', isActive: false, chargeLevel: 0 }
}: GPUParticleSystemProps) {
  const particleMeshRef = useRef<THREE.Points>(null);
  const trailMeshRef = useRef<THREE.Points>(null);
  
  // Performance tracking
  const performanceRef = useRef({
    frameCount: 0,
    lastFPSCheck: 0,
    currentFPS: 60,
  });

  // Device quality detection (same as original system)
  const deviceQuality = useMemo(() => {
    if (typeof window === 'undefined') return 1; // medium
    
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return 0; // low
    
    // Performance scoring
    let score = 0;
    const isMobile = window.innerWidth < 768;
    const hardwareConcurrency = navigator.hardwareConcurrency;
    const memoryInfo = (navigator as { deviceMemory?: number }).deviceMemory;
    
    if (!isMobile) score += 2;
    if (hardwareConcurrency >= 8) score += 2;
    else if (hardwareConcurrency >= 4) score += 1;
    if (memoryInfo >= 8) score += 2;
    else if (memoryInfo >= 4) score += 1;
    
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    if (maxTextureSize >= 4096) score += 1;
    
    if (score >= 7) return 2; // high
    if (score >= 4) return 1; // medium
    return 0; // low
  }, []);

  // Quality-based settings
  const qualitySettings = useMemo(() => {
    const settings = {
      0: { // low
        trailLength: 8,
        connectionDistance: 1.5,
        maxConnections: 5,
        updateInterval: 2,
      },
      1: { // medium
        trailLength: 12,
        connectionDistance: 2.0,
        maxConnections: 8,
        updateInterval: 1,
      },
      2: { // high
        trailLength: 16,
        connectionDistance: 2.5,
        maxConnections: 12,
        updateInterval: 1,
      },
    };
    return settings[deviceQuality as keyof typeof settings];
  }, [deviceQuality]);

  // Generate optimized particle data for GPU
  const particleData: ParticleData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const basePositions = new Float32Array(count * 3);
    const particleIds = new Float32Array(count);
    const phases = new Float32Array(count);
    const sizes = new Float32Array(count);
    const energies = new Float32Array(count);
    const lifecycles = new Float32Array(count);
    const maxLifetimes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);
    const baseColors = new Float32Array(count * 3);
    const targetColors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Random positions
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 10;
      
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      
      basePositions[i3] = x;
      basePositions[i3 + 1] = y;
      basePositions[i3 + 2] = z;
      
      // Particle properties
      particleIds[i] = i;
      phases[i] = Math.random() * Math.PI * 2;
      sizes[i] = 0.02 + Math.random() * 0.03;
      energies[i] = Math.random() * 0.5 + 0.5;
      lifecycles[i] = 0;
      maxLifetimes[i] = 8 + Math.random() * 12;
      
      // Initial velocities
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
      
      // Brand-accurate colors
      let baseColor: THREE.Color;
      let targetColor: THREE.Color;
      
      if (variant === 'lightweight') {
        const colorVariation = Math.random();
        if (colorVariation < 0.4) {
          baseColor = new THREE.Color().lerpColors(
            new THREE.Color('#2D5A87'),
            new THREE.Color('#1B365D'),
            Math.random() * 0.7
          );
        } else if (colorVariation < 0.7) {
          baseColor = new THREE.Color().lerpColors(
            new THREE.Color('#B8860B'),
            new THREE.Color('#CD853F'),
            Math.random()
          );
        } else {
          baseColor = new THREE.Color().lerpColors(
            new THREE.Color('#2D5A87'),
            new THREE.Color('#B8860B'),
            Math.random() * 0.4
          );
        }
        
        // Target color for transitions
        targetColor = new THREE.Color().lerpColors(
          new THREE.Color('#B8860B'),
          new THREE.Color('#CD853F'),
          Math.random()
        );
      } else {
        // Professional Gallifrey colors
        baseColor = new THREE.Color().lerpColors(
          new THREE.Color('#2D5A87'),
          new THREE.Color('#1B365D'),
          Math.random() * 0.8
        );
        
        targetColor = new THREE.Color().lerpColors(
          new THREE.Color('#1B365D'),
          new THREE.Color('#2D5A87'),
          Math.random()
        );
      }
      
      baseColors[i3] = baseColor.r;
      baseColors[i3 + 1] = baseColor.g;
      baseColors[i3 + 2] = baseColor.b;
      
      targetColors[i3] = targetColor.r;
      targetColors[i3 + 1] = targetColor.g;
      targetColors[i3 + 2] = targetColor.b;
    }

    return {
      positions,
      basePositions,
      particleIds,
      phases,
      sizes,
      energies,
      lifecycles,
      maxLifetimes,
      velocities,
      baseColors,
      targetColors,
    };
  }, [count, variant]);

  // Trail data for GPU-based trails
  const trailData: TrailData = useMemo(() => {
    const trailCount = count * qualitySettings.trailLength;
    const positions = new Float32Array(trailCount * 3);
    const previousPositions = new Float32Array(trailCount * 3);
    const trailProgress = new Float32Array(trailCount);
    const particleIds = new Float32Array(trailCount);
    const colors = new Float32Array(trailCount * 3);
    const energies = new Float32Array(trailCount);

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < qualitySettings.trailLength; j++) {
        const index = i * qualitySettings.trailLength + j;
        const index3 = index * 3;
        
        // Initialize trail points to particle position
        const particleIndex3 = i * 3;
        positions[index3] = particleData.positions[particleIndex3];
        positions[index3 + 1] = particleData.positions[particleIndex3 + 1];
        positions[index3 + 2] = particleData.positions[particleIndex3 + 2];
        
        previousPositions[index3] = positions[index3];
        previousPositions[index3 + 1] = positions[index3 + 1];
        previousPositions[index3 + 2] = positions[index3 + 2];
        
        trailProgress[index] = j / qualitySettings.trailLength;
        particleIds[index] = i;
        
        // Trail colors match particle colors
        colors[index3] = particleData.baseColors[particleIndex3];
        colors[index3 + 1] = particleData.baseColors[particleIndex3 + 1];
        colors[index3 + 2] = particleData.baseColors[particleIndex3 + 2];
        
        energies[index] = particleData.energies[i];
      }
    }

    return {
      positions,
      previousPositions,
      trailProgress,
      particleIds,
      colors,
      energies,
    };
  }, [count, qualitySettings.trailLength, particleData]);

  // Create particle geometry
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    
    geometry.setAttribute('position', new THREE.BufferAttribute(particleData.positions, 3));
    geometry.setAttribute('basePosition', new THREE.BufferAttribute(particleData.basePositions, 3));
    geometry.setAttribute('particleId', new THREE.BufferAttribute(particleData.particleIds, 1));
    geometry.setAttribute('phase', new THREE.BufferAttribute(particleData.phases, 1));
    geometry.setAttribute('size', new THREE.BufferAttribute(particleData.sizes, 1));
    geometry.setAttribute('energy', new THREE.BufferAttribute(particleData.energies, 1));
    geometry.setAttribute('lifecycle', new THREE.BufferAttribute(particleData.lifecycles, 1));
    geometry.setAttribute('maxLifetime', new THREE.BufferAttribute(particleData.maxLifetimes, 1));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(particleData.velocities, 3));
    geometry.setAttribute('baseColor', new THREE.BufferAttribute(particleData.baseColors, 3));
    geometry.setAttribute('targetColor', new THREE.BufferAttribute(particleData.targetColors, 3));
    
    return geometry;
  }, [particleData]);

  // Create trail geometry
  const trailGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    
    geometry.setAttribute('position', new THREE.BufferAttribute(trailData.positions, 3));
    geometry.setAttribute('previousPosition', new THREE.BufferAttribute(trailData.previousPositions, 3));
    geometry.setAttribute('trailProgress', new THREE.BufferAttribute(trailData.trailProgress, 1));
    geometry.setAttribute('particleId', new THREE.BufferAttribute(trailData.particleIds, 1));
    geometry.setAttribute('particleColor', new THREE.BufferAttribute(trailData.colors, 3));
    geometry.setAttribute('particleEnergy', new THREE.BufferAttribute(trailData.energies, 1));
    
    return geometry;
  }, [trailData]);

  // Create flocking texture for GPU-based neighbor calculations
  const flockingTexture = useMemo(() => {
    const size = Math.ceil(Math.sqrt(count));
    const data = new Float32Array(size * size * 4);
    
    // Initialize with default values
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 0; // cohesion.x
      data[i + 1] = 0; // cohesion.y
      data[i + 2] = 0; // cohesion.z
      data[i + 3] = 0; // separation strength
    }
    
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
    texture.needsUpdate = true;
    
    return texture;
  }, [count]);

  // Shader uniforms
  const particleUniforms = useMemo(() => ({
    time: { value: 0 },
    mousePosition: { value: mousePosition.clone() },
    mouseInfluence: { value: 1.0 },
    interactionMode: { value: 0 }, // 0=attract, 1=repel, 2=vortex, 3=explosion
    chargeLevel: { value: 0 },
    isActive: { value: false },
    globalScale: { value: 1.0 },
    deviceQuality: { value: deviceQuality },
    particleCount: { value: count },
    flockingTexture: { value: flockingTexture },
    globalOpacity: { value: variant === 'lightweight' ? 0.85 : 0.8 },
    useTexture: { value: false },
    particleTexture: { value: null },
  }), [mousePosition, deviceQuality, count, flockingTexture, variant]);

  const trailUniforms = useMemo(() => ({
    time: { value: 0 },
    globalOpacity: { value: 0.6 },
    deviceQuality: { value: deviceQuality },
  }), [deviceQuality]);

  // Create shader materials
  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: optimizedParticleVertexShader,
      fragmentShader: optimizedParticleFragmentShader,
      uniforms: particleUniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false,
    });
  }, [particleUniforms]);

  const trailMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: optimizedTrailVertexShader,
      fragmentShader: optimizedTrailFragmentShader,
      uniforms: trailUniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
    });
  }, [trailUniforms]);

  // Update interaction mode uniform
  const updateInteractionMode = useCallback(() => {
    const modeMap = { attract: 0, repel: 1, vortex: 2, explosion: 3 };
    particleUniforms.interactionMode.value = modeMap[interactionState.mode];
    particleUniforms.chargeLevel.value = interactionState.chargeLevel;
    particleUniforms.isActive.value = interactionState.isActive;
  }, [interactionState, particleUniforms]);

  // Performance monitoring
  const updatePerformance = useCallback(() => {
    const perf = performanceRef.current;
    perf.frameCount++;
    
    if (time - perf.lastFPSCheck > 1.0) {
      perf.currentFPS = perf.frameCount;
      perf.frameCount = 0;
      perf.lastFPSCheck = time;
      
      // Adaptive quality based on performance
      if (perf.currentFPS < 30 && deviceQuality > 0) {
        particleUniforms.deviceQuality.value = Math.max(0, deviceQuality - 1);
      } else if (perf.currentFPS > 55 && deviceQuality < 2) {
        particleUniforms.deviceQuality.value = Math.min(2, deviceQuality + 1);
      }
    }
  }, [time, deviceQuality, particleUniforms]);

  // Animation loop - GPU does most of the work
  useFrame((state, delta) => {
    updateInteractionMode();
    updatePerformance(delta);
    
    // Update uniform values - much lighter than CPU calculations
    particleUniforms.time.value = time;
    particleUniforms.mousePosition.value.copy(mousePosition);
    trailUniforms.time.value = time;
    
    // Gesture-based mouse influence
    const gestureInfluence = gesture.type !== 'none' ? gesture.intensity : clickIntensity;
    particleUniforms.mouseInfluence.value = gestureInfluence;
    
    // Only minimal CPU work for buffer updates if needed
    // The GPU shaders handle position updates, interactions, and animations
  });

  return (
    <group>
      {/* Main GPU particle system */}
      <points
        ref={particleMeshRef}
        geometry={particleGeometry}
        material={particleMaterial}
        frustumCulled={false}
      />
      
      {/* GPU-optimized particle trails */}
      {deviceQuality > 0 && (
        <points
          ref={trailMeshRef}
          geometry={trailGeometry}
          material={trailMaterial}
          frustumCulled={false}
          renderOrder={-1}
        />
      )}
    </group>
  );
}