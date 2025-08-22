/**
 * Optimized Particle System with O(n log n) algorithms
 * Implements spatial partitioning, LOD system, and calculation caching
 * Target: 60% CPU reduction, 1000+ particles at 60fps
 */

interface NavigatorDeviceMemory extends Navigator {
  deviceMemory?: number;
}

import React, { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { 
  SpatialHashGrid, 
  SpatialParticle, 
  DistanceUtils, 
  Vector3Pool, 
  LODSystem, 
  PerformanceMonitor,
  CalculationCache 
} from '../../lib/spatial-optimization';

interface OptimizedParticleSystemProps {
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

interface OptimizedParticle extends SpatialParticle {
  basePosition: THREE.Vector3;
  phase: number;
  size: number;
  geometry: 'sphere' | 'octahedron' | 'icosahedron';
  color: THREE.Color;
  baseColor: THREE.Color;
  targetColor: THREE.Color;
  colorTransitionSpeed: number;
  trail: THREE.Vector3[];
  energy: number;
  lifecycle: number;
  maxLifetime: number;
  fadeIn: number;
  fadeOut: number;
  lastUpdateFrame: number;
  updateFrequency: number;
  qualityLevel: 'high' | 'medium' | 'low';
}

export function OptimizedParticleSystem({ 
  count, 
  variant, 
  mousePosition, 
  time 
}: OptimizedParticleSystemProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particlesRef = useRef<Array<OptimizedParticle>>([]);
  const activeParticleCount = useRef(0);
  const trailMeshRef = useRef<THREE.Points>(null);
  const glowMeshRef = useRef<THREE.InstancedMesh>(null);
  const frameCounter = useRef(0);
  const maxParticles = count * 2;

  // Optimization systems
  const spatialGrid = useRef<SpatialHashGrid>(new SpatialHashGrid(2.5));
  const vectorPool = useRef<Vector3Pool>(new Vector3Pool(100));
  const performanceMonitor = useRef<PerformanceMonitor>(new PerformanceMonitor());
  const calculationCache = useRef<CalculationCache>(new CalculationCache());
  const lodSystem = useRef<LODSystem | null>(null);

  // Cached mouse interaction data
  const mouseInteractionCache = useRef({
    position: new THREE.Vector3(),
    radius: 4,
    radiusSquared: 16,
    lastUpdateFrame: -1
  });

  // Performance-based quality settings
  const adaptiveQuality = useRef({
    maxParticles: count,
    updateInterval: 1,
    trailLength: 20,
    flockingEnabled: true,
    particleSpawning: true
  });

  // Device quality detection (optimized)
  const deviceQuality = useMemo(() => {
    if (typeof window === 'undefined') return 'medium';
    
    const isMobile = window.innerWidth < 768;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    const memoryInfo = (navigator as NavigatorDeviceMemory).deviceMemory || 4;
    
    let score = 0;
    if (!isMobile) score += 2;
    if (hardwareConcurrency >= 8) score += 2;
    else if (hardwareConcurrency >= 4) score += 1;
    if (memoryInfo && memoryInfo >= 8) score += 2;
    else if (memoryInfo && memoryInfo >= 4) score += 1;
    
    if (score >= 5) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  }, []);

  // Quality-based settings (optimized)
  const qualitySettings = useMemo(() => {
    const settings = {
      low: {
        geometryDetail: { sphere: 6, octahedron: 0, icosahedron: 0 },
        trailLength: 8,
        flockingRadius: 1.2,
        separationRadius: 0.5,
        updateInterval: 3,
        maxFlockingNeighbors: 5,
        spatialGridSize: 3.0,
      },
      medium: {
        geometryDetail: { sphere: 10, octahedron: 0, icosahedron: 0 },
        trailLength: 12,
        flockingRadius: 1.8,
        separationRadius: 0.7,
        updateInterval: 2,
        maxFlockingNeighbors: 8,
        spatialGridSize: 2.5,
      },
      high: {
        geometryDetail: { sphere: 14, octahedron: 1, icosahedron: 1 },
        trailLength: 18,
        flockingRadius: 2.2,
        separationRadius: 0.9,
        updateInterval: 1,
        maxFlockingNeighbors: 12,
        spatialGridSize: 2.0,
      },
    };
    return settings[deviceQuality];
  }, [deviceQuality]);

  // Initialize LOD system with camera reference
  const initLODSystem = useCallback((camera: THREE.Camera) => {
    if (!lodSystem.current) {
      lodSystem.current = new LODSystem(camera);
    }
  }, []);

  // Optimized particle creation
  const createOptimizedParticle = useCallback((position: THREE.Vector3, isFromCursor: boolean = false): OptimizedParticle => {
    const geometries = ['sphere', 'octahedron', 'icosahedron'] as const;
    const colorVariation = Math.random();
    const colorIntensity = Math.random();
    let color: THREE.Color;
    
    // Optimized color generation
    if (variant === 'lightweight') {
      if (isFromCursor) {
        color = new THREE.Color().lerpColors(
          new THREE.Color('#B8860B'),
          new THREE.Color('#CD853F'),
          colorIntensity
        );
      } else {
        if (colorVariation < 0.4) {
          color = new THREE.Color().lerpColors(
            new THREE.Color('#2D5A87'),
            new THREE.Color('#1B365D'),
            colorIntensity * 0.7
          );
        } else if (colorVariation < 0.7) {
          color = new THREE.Color().lerpColors(
            new THREE.Color('#B8860B'),
            new THREE.Color('#CD853F'),
            colorIntensity
          );
        } else {
          color = new THREE.Color().lerpColors(
            new THREE.Color('#2D5A87'),
            new THREE.Color('#B8860B'),
            colorIntensity * 0.4
          );
        }
      }
    } else {
      if (isFromCursor) {
        color = new THREE.Color('#2D5A87');
      } else {
        if (colorVariation < 0.6) {
          color = new THREE.Color().lerpColors(
            new THREE.Color('#2D5A87'),
            new THREE.Color('#1B365D'),
            colorIntensity * 0.8
          );
        } else {
          color = new THREE.Color().lerpColors(
            new THREE.Color('#2D5A87'),
            new THREE.Color('#234669'),
            colorIntensity
          );
        }
      }
    }

    const targetColor = color.clone();
    if (variant === 'lightweight') {
      const targetVariation = (colorVariation + 0.3) % 1.0;
      if (targetVariation < 0.5) {
        targetColor.setHex(0xB8860B);
      } else {
        targetColor.setHex(0xCD853F);
      }
    }

    return {
      position: position.clone(),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * (isFromCursor ? 0.05 : 0.02),
        (Math.random() - 0.5) * (isFromCursor ? 0.05 : 0.02),
        (Math.random() - 0.5) * 0.01
      ),
      basePosition: position.clone(),
      phase: Math.random() * Math.PI * 2,
      size: (isFromCursor ? 0.025 : 0.02) + Math.random() * 0.03,
      geometry: geometries[Math.floor(Math.random() * geometries.length)],
      color: color.clone(),
      baseColor: color.clone(),
      targetColor: targetColor,
      colorTransitionSpeed: 0.3 + Math.random() * 0.4,
      trail: [],
      energy: isFromCursor ? 1.0 : Math.random() * 0.5 + 0.5,
      lifecycle: 0,
      maxLifetime: isFromCursor ? 5 + Math.random() * 8 : 8 + Math.random() * 12,
      fadeIn: 0,
      fadeOut: 1,
      index: -1, // Will be set when added to system
      lastUpdateFrame: 0,
      updateFrequency: 1,
      qualityLevel: 'high'
    };
  }, [variant]);

  // Optimized flocking calculation using spatial grid
  const calculateFlockingForces = useCallback((particle: OptimizedParticle, neighbors: OptimizedParticle[]) => {
    const clusterForce = vectorPool.current.get();
    const separationForce = vectorPool.current.get();
    const alignmentForce = vectorPool.current.get();
    
    let neighborCount = 0;
    const maxNeighbors = qualitySettings.maxFlockingNeighbors;
    const flockRadius = qualitySettings.flockingRadius;
    const separationRadius = qualitySettings.separationRadius;
    const flockRadiusSquared = flockRadius * flockRadius;
    const separationRadiusSquared = separationRadius * separationRadius;
    
    // Process only nearby neighbors (already filtered by spatial grid)
    for (let j = 0; j < Math.min(neighbors.length, maxNeighbors); j++) {
      const otherParticle = neighbors[j];
      if (otherParticle.index === particle.index) continue;
      
      const distanceSquared = DistanceUtils.distanceSquared(particle.position, otherParticle.position);
      
      if (distanceSquared < flockRadiusSquared && distanceSquared > 0) {
        neighborCount++;
        
        // Cohesion - move toward center of nearby particles
        clusterForce.add(otherParticle.position);
        
        // Alignment - align velocity with nearby particles
        alignmentForce.add(otherParticle.velocity);
        
        // Separation - avoid crowding
        if (distanceSquared < separationRadiusSquared) {
          const separationDir = vectorPool.current.get();
          separationDir.subVectors(particle.position, otherParticle.position);
          separationDir.normalize().multiplyScalar(1 / Math.sqrt(distanceSquared));
          separationForce.add(separationDir);
          vectorPool.current.release(separationDir);
        }
      }
    }
    
    if (neighborCount > 0) {
      // Apply cohesion
      clusterForce.divideScalar(neighborCount).sub(particle.position);
      clusterForce.multiplyScalar(0.001);
      
      // Apply alignment
      alignmentForce.divideScalar(neighborCount).sub(particle.velocity);
      alignmentForce.multiplyScalar(0.002);
      
      // Apply separation
      separationForce.multiplyScalar(0.003);
      
      // Add flocking forces to velocity
      particle.velocity.add(clusterForce).add(alignmentForce).add(separationForce);
    }
    
    // Release vectors back to pool
    vectorPool.current.release(clusterForce);
    vectorPool.current.release(separationForce);
    vectorPool.current.release(alignmentForce);
  }, [qualitySettings]);

  // Optimized mouse interaction calculation
  const calculateMouseInteraction = useCallback((particle: OptimizedParticle) => {
    const cache = mouseInteractionCache.current;
    
    // Update cache if needed
    if (cache.lastUpdateFrame !== frameCounter.current) {
      cache.position.copy(mousePosition);
      cache.lastUpdateFrame = frameCounter.current;
    }
    
    const distanceSquared = DistanceUtils.distanceSquared(particle.position, cache.position);
    
    if (distanceSquared < cache.radiusSquared) {
      const distance = Math.sqrt(distanceSquared);
      const interactionStrength = 1 - (distance / cache.radius);
      const mode = interactionState?.mode || 'attract';
      
      const forceDirection = vectorPool.current.get();
      
      switch (mode) {
        case 'attract':
          forceDirection.subVectors(cache.position, particle.position).normalize();
          forceDirection.multiplyScalar(interactionStrength * 0.008);
          break;
          
        case 'repel':
          forceDirection.subVectors(particle.position, cache.position).normalize();
          forceDirection.multiplyScalar(interactionStrength * 0.012);
          break;
          
        case 'vortex':
          const angle = Math.atan2(
            particle.position.y - cache.position.y,
            particle.position.x - cache.position.x
          );
          const sinAngle = calculationCache.current.sin(angle);
          const cosAngle = calculationCache.current.cos(angle);
          
          forceDirection.set(
            -sinAngle * interactionStrength * 0.015,
            cosAngle * interactionStrength * 0.015,
            0
          );
          
          const radialForce = vectorPool.current.get();
          radialForce.subVectors(cache.position, particle.position).normalize();
          radialForce.multiplyScalar(interactionStrength * 0.003);
          forceDirection.add(radialForce);
          vectorPool.current.release(radialForce);
          break;
          
        case 'explosion':
          const chargeLevel = interactionState?.chargeLevel || 0;
          if (chargeLevel > 0.1) {
            forceDirection.subVectors(particle.position, cache.position).normalize();
            const explosionStrength = chargeLevel * interactionStrength * 0.025;
            forceDirection.multiplyScalar(explosionStrength);
            
            // Add randomness
            forceDirection.add(new THREE.Vector3(
              (Math.random() - 0.5) * 0.01,
              (Math.random() - 0.5) * 0.01,
              (Math.random() - 0.5) * 0.005
            ));
          } else if (interactionState?.isActive) {
            forceDirection.subVectors(cache.position, particle.position).normalize();
            forceDirection.multiplyScalar(interactionStrength * 0.005);
          }
          break;
      }
      
      particle.velocity.add(forceDirection);
      particle.energy = Math.min(particle.energy + 0.015, 1.0);
      
      vectorPool.current.release(forceDirection);
      return true;
    }
    
    return false;
  }, [mousePosition, calculationCache]);

  // Initialize particles
  const particleData = useMemo(() => {
    const optimizedParticles: OptimizedParticle[] = [];
    
    for (let i = 0; i < count; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 10
      );
      
      const particle = createOptimizedParticle(position, false);
      particle.index = i;
      optimizedParticles.push(particle);
    }
    
    particlesRef.current = optimizedParticles;
    activeParticleCount.current = optimizedParticles.length;
    return optimizedParticles;
  }, [count, createOptimizedParticle]);

  // Color scheme and materials (same as original)
  const colorScheme = useMemo(() => {
    if (variant === 'lightweight') {
      return {
        primary: new THREE.Color('#2D5A87'),
        secondary: new THREE.Color('#1B365D'),
        accent: new THREE.Color('#B8860B'),
        accent2: new THREE.Color('#CD853F'),
        aurora: new THREE.Color('#234669'),
        glow: new THREE.Color('#2D5A87'),
      };
    }
    return {
      primary: new THREE.Color('#2D5A87'),
      secondary: new THREE.Color('#1B365D'),
      accent: new THREE.Color('#234669'),
      accent2: new THREE.Color('#1F2937'),
      aurora: new THREE.Color('#2D5A87'),
      glow: new THREE.Color('#234669'),
    };
  }, [variant]);

  const geometries = useMemo(() => ({
    sphere: new THREE.SphereGeometry(0.02, qualitySettings.geometryDetail.sphere, qualitySettings.geometryDetail.sphere / 2),
    octahedron: new THREE.OctahedronGeometry(0.025, qualitySettings.geometryDetail.octahedron),
    icosahedron: new THREE.IcosahedronGeometry(0.02, qualitySettings.geometryDetail.icosahedron),
  }), [qualitySettings]);

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: colorScheme.primary,
    emissive: colorScheme.glow,
    emissiveIntensity: variant === 'lightweight' ? 0.4 : 0.3,
    transparent: true,
    opacity: variant === 'lightweight' ? 0.85 : 0.8,
    roughness: 0.1,
    metalness: 0.9,
  }), [colorScheme.primary, colorScheme.glow, variant]);

  const glowMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: colorScheme.aurora,
    transparent: true,
    opacity: variant === 'lightweight' ? 0.25 : 0.2,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  }), [colorScheme.aurora, variant]);

  const trailGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const trailLength = qualitySettings.trailLength;
    const positions = new Float32Array(maxParticles * 3 * trailLength);
    const colors = new Float32Array(maxParticles * 3 * trailLength);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, [maxParticles, qualitySettings.trailLength]);

  const trailMaterial = useMemo(() => new THREE.PointsMaterial({
    size: 0.005,
    transparent: true,
    opacity: 0.6,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
  }), []);

  // Main animation loop (optimized)
  useFrame((state, delta) => {
    if (!meshRef.current || !glowMeshRef.current || !trailMeshRef.current) return;

    frameCounter.current++;
    performanceMonitor.current.update();

    // Initialize LOD system with camera
    if (!lodSystem.current) {
      initLODSystem(state.camera);
    }

    // Adaptive quality based on performance
    const performance = performanceMonitor.current;
    if (frameCounter.current % 60 === 0) { // Check every 60 frames
      if (performance.isPerformancePoor(50)) {
        adaptiveQuality.current.updateInterval = Math.min(adaptiveQuality.current.updateInterval + 1, 4);
        adaptiveQuality.current.flockingEnabled = false;
      } else if (performance.getFPS() > 55) {
        adaptiveQuality.current.updateInterval = Math.max(adaptiveQuality.current.updateInterval - 1, 1);
        adaptiveQuality.current.flockingEnabled = true;
      }
    }

    // Clear and rebuild spatial grid
    spatialGrid.current.clear();
    
    const dummy = new THREE.Object3D();
    const glowDummy = new THREE.Object3D();
    const trailPositions = trailGeometry.attributes.position.array as Float32Array;
    const trailColors = trailGeometry.attributes.color.array as Float32Array;

    // Insert all particles into spatial grid
    particlesRef.current.forEach(particle => {
      spatialGrid.current.insert(particle);
    });

    // Update particles with optimized calculations
    particlesRef.current.forEach((particle, i) => {
      // LOD system - skip updates for distant particles
      if (lodSystem.current) {
        particle.updateFrequency = lodSystem.current.getUpdateFrequency(particle.position);
        particle.qualityLevel = lodSystem.current.getQualityLevel(particle.position);
        
        // Skip update if not this particle's frame
        if ((frameCounter.current + i) % (particle.updateFrequency * adaptiveQuality.current.updateInterval) !== 0) {
          return;
        }
      }

      // Update particle lifecycle
      particle.lifecycle = Math.min(particle.lifecycle + delta, particle.maxLifetime);
      const lifeProgress = particle.lifecycle / particle.maxLifetime;
      
      // Handle fade in/out
      if (lifeProgress < 0.1) {
        particle.fadeIn = lifeProgress / 0.1;
        particle.fadeOut = 1;
      } else if (lifeProgress > 0.85) {
        particle.fadeIn = 1;
        particle.fadeOut = 1 - ((lifeProgress - 0.85) / 0.15);
      } else {
        particle.fadeIn = 1;
        particle.fadeOut = 1;
      }

      // Dynamic color transitions (cached)
      const colorTransitionFactor = calculationCache.current.sin(time * particle.colorTransitionSpeed + particle.phase) * 0.5 + 0.5;
      particle.color.lerpColors(particle.baseColor, particle.targetColor, colorTransitionFactor * 0.6);

      // Float animation (cached trigonometric functions)
      const floatY = calculationCache.current.sin(time + particle.phase) * 0.5 + 
                    calculationCache.current.sin(time * 1.5 + particle.phase * 2) * 0.2;
      const floatX = calculationCache.current.cos(time * 0.7 + particle.phase) * 0.3;

      // Mouse interaction (optimized)
      const hadMouseInteraction = calculateMouseInteraction(particle);
      if (!hadMouseInteraction) {
        particle.energy = Math.max(particle.energy - 0.005, 0.3);
      }

      // Flocking behavior using spatial grid (O(n log n))
      if (adaptiveQuality.current.flockingEnabled && particle.qualityLevel !== 'low') {
        const neighbors = spatialGrid.current.queryRadius(particle.position, qualitySettings.flockingRadius);
        calculateFlockingForces(particle, neighbors);
      }

      // Update trail (adaptive length based on quality)
      const trailLength = particle.qualityLevel === 'high' ? qualitySettings.trailLength : 
                         particle.qualityLevel === 'medium' ? Math.floor(qualitySettings.trailLength * 0.7) : 
                         Math.floor(qualitySettings.trailLength * 0.4);
      
      particle.trail.unshift(particle.position.clone());
      if (particle.trail.length > trailLength) {
        particle.trail.pop();
      }

      // Update position
      particle.position.add(particle.velocity);
      particle.position.y += floatY * 0.001;
      particle.position.x += floatX * 0.0005;

      // Boundary constraints
      const boundary = 10;
      if (Math.abs(particle.position.x) > boundary) {
        particle.velocity.x *= -0.7;
        particle.position.x = Math.sign(particle.position.x) * boundary;
      }
      if (Math.abs(particle.position.y) > boundary) {
        particle.velocity.y *= -0.7;
        particle.position.y = Math.sign(particle.position.y) * boundary;
      }

      // Return force
      const returnForce = vectorPool.current.get();
      returnForce.subVectors(particle.basePosition, particle.position);
      returnForce.multiplyScalar(0.001 * (1 - particle.energy * 0.5));
      particle.velocity.add(returnForce);
      vectorPool.current.release(returnForce);

      // Damping
      particle.velocity.multiplyScalar(0.99 - particle.energy * 0.01);

      // Update instance matrices
      const pulseScale = 1 + calculationCache.current.sin(time * 2 + particle.phase) * 0.3 * particle.energy;
      const energyScale = 0.7 + particle.energy * 0.6;
      const fadeScale = particle.fadeIn * particle.fadeOut;
      const finalScale = pulseScale * energyScale * fadeScale;
      
      dummy.position.copy(particle.position);
      dummy.scale.setScalar(finalScale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      glowDummy.position.copy(particle.position);
      glowDummy.scale.setScalar(finalScale * 2.5);
      glowDummy.updateMatrix();
      glowMeshRef.current.setMatrixAt(i, glowDummy.matrix);

      // Update trail positions and colors
      particle.trail.forEach((trailPoint, trailIndex) => {
        const trailIdx = i * trailLength * 3 + trailIndex * 3;
        if (trailIdx + 2 < trailPositions.length) {
          trailPositions[trailIdx] = trailPoint.x;
          trailPositions[trailIdx + 1] = trailPoint.y;
          trailPositions[trailIdx + 2] = trailPoint.z;
          
          const trailFade = (1 - trailIndex / trailLength);
          const alpha = trailFade * particle.energy * particle.fadeIn * particle.fadeOut;
          trailColors[trailIdx] = particle.color.r * alpha;
          trailColors[trailIdx + 1] = particle.color.g * alpha;
          trailColors[trailIdx + 2] = particle.color.b * alpha;
        }
      });
    });

    // Release all pooled vectors at end of frame
    vectorPool.current.releaseAll();

    // Update instance matrices
    meshRef.current.instanceMatrix.needsUpdate = true;
    glowMeshRef.current.instanceMatrix.needsUpdate = true;
    trailGeometry.attributes.position.needsUpdate = true;
    trailGeometry.attributes.color.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[geometries.sphere, material, count]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />
      
      <instancedMesh
        ref={glowMeshRef}
        args={[geometries.sphere, glowMaterial, count]}
        frustumCulled={false}
        renderOrder={-1}
      />
      
      <points
        ref={trailMeshRef}
        geometry={trailGeometry}
        material={trailMaterial}
        frustumCulled={false}
      />
    </group>
  );
}