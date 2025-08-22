/**
 * Web Worker-enabled Particle System
 * Uses background thread for physics calculations to achieve maximum performance
 * Fallback to main thread if Web Workers are not supported
 */

interface NavigatorDeviceMemory extends Navigator {
  deviceMemory?: number;
}

import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { 
  SpatialHashGrid, 
  SpatialParticle, 
  DistanceUtils, 
  Vector3Pool, 
  PerformanceMonitor 
} from '../../lib/spatial-optimization';

interface WebWorkerParticleSystemProps {
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

interface WorkerParticle extends SpatialParticle {
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

export function WebWorkerParticleSystem({ 
  count, 
  variant, 
  mousePosition, 
  time
}: WebWorkerParticleSystemProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particlesRef = useRef<Array<WorkerParticle>>([]);
  const glowMeshRef = useRef<THREE.InstancedMesh>(null);
  const trailMeshRef = useRef<THREE.Points>(null);
  const frameCounter = useRef(0);
  const maxParticles = count * 2;

  // Web Worker state
  const workerRef = useRef<Worker | null>(null);
  const workerSupported = useRef(true);
  const pendingPhysicsUpdate = useRef(false);
  const lastWorkerUpdate = useRef(0);

  // Fallback optimization systems (used if Web Worker fails)
  const spatialGrid = useRef<SpatialHashGrid>(new SpatialHashGrid(2.5));
  const vectorPool = useRef<Vector3Pool>(new Vector3Pool(100));
  const performanceMonitor = useRef<PerformanceMonitor>(new PerformanceMonitor());

  // Device quality detection
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

  // Quality-based settings
  const qualitySettings = useMemo(() => {
    const settings = {
      low: {
        geometryDetail: { sphere: 6, octahedron: 0, icosahedron: 0 },
        trailLength: 8,
        flockingRadius: 1.2,
        separationRadius: 0.5,
        updateInterval: 3,
        maxFlockingNeighbors: 5,
        workerUpdateFrequency: 4, // Update worker every 4th frame
      },
      medium: {
        geometryDetail: { sphere: 10, octahedron: 0, icosahedron: 0 },
        trailLength: 12,
        flockingRadius: 1.8,
        separationRadius: 0.7,
        updateInterval: 2,
        maxFlockingNeighbors: 8,
        workerUpdateFrequency: 2, // Update worker every 2nd frame
      },
      high: {
        geometryDetail: { sphere: 14, octahedron: 1, icosahedron: 1 },
        trailLength: 18,
        flockingRadius: 2.2,
        separationRadius: 0.9,
        updateInterval: 1,
        maxFlockingNeighbors: 12,
        workerUpdateFrequency: 1, // Update worker every frame
      },
    };
    return settings[deviceQuality];
  }, [deviceQuality]);

  // Initialize Web Worker
  useEffect(() => {
    if (typeof window === 'undefined' || !window.Worker) {
      workerSupported.current = false;
      return;
    }

    try {
      const worker = new Worker('/physics-worker.js');
      
      worker.onmessage = (e) => {
        const { type, data, error } = e.data;
        
        switch (type) {
          case 'WORKER_READY':
            console.log('Physics worker initialized successfully');
            break;
            
          case 'PHYSICS_UPDATED':
            // Update particles with physics results from worker
            if (Array.isArray(data) && data.length === particlesRef.current.length) {
              data.forEach((updatedParticle, i) => {
                const particle = particlesRef.current[i];
                if (particle) {
                  // Update position and velocity from worker
                  particle.position.set(
                    updatedParticle.position.x,
                    updatedParticle.position.y,
                    updatedParticle.position.z
                  );
                  particle.velocity.set(
                    updatedParticle.velocity.x,
                    updatedParticle.velocity.y,
                    updatedParticle.velocity.z
                  );
                  particle.energy = updatedParticle.energy;
                  particle.lifecycle = updatedParticle.lifecycle;
                }
              });
            }
            pendingPhysicsUpdate.current = false;
            break;
            
          case 'ERROR':
            console.warn('Physics worker error:', error);
            workerSupported.current = false;
            break;
            
          case 'CACHE_CLEARED':
            console.log('Worker cache cleared');
            break;
        }
      };
      
      worker.onerror = (error) => {
        console.warn('Web Worker failed to load:', error);
        workerSupported.current = false;
        worker.terminate();
      };
      
      workerRef.current = worker;
    } catch (error) {
      console.warn('Web Worker initialization failed:', error);
      workerSupported.current = false;
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  // Convert particle to worker-friendly format
  const particleToWorkerFormat = useCallback((particle: WorkerParticle) => ({
    index: particle.index,
    position: { x: particle.position.x, y: particle.position.y, z: particle.position.z },
    velocity: { x: particle.velocity.x, y: particle.velocity.y, z: particle.velocity.z },
    basePosition: { x: particle.basePosition.x, y: particle.basePosition.y, z: particle.basePosition.z },
    phase: particle.phase,
    energy: particle.energy,
    lifecycle: particle.lifecycle,
    maxLifetime: particle.maxLifetime,
    updateFrequency: particle.updateFrequency,
    qualityLevel: particle.qualityLevel,
  }), []);

  // Send physics update to worker
  const sendPhysicsToWorker = useCallback((delta: number) => {
    if (!workerRef.current || !workerSupported.current || pendingPhysicsUpdate.current) {
      return false;
    }

    // Only send every N frames based on quality settings
    if (frameCounter.current % qualitySettings.workerUpdateFrequency !== 0) {
      return false;
    }

    const workerData = {
      particles: particlesRef.current.map(particleToWorkerFormat),
      mouseData: {
        position: { x: mousePosition.x, y: mousePosition.y, z: mousePosition.z },
        radius: 4,
        radiusSquared: 16,
      },
      interactionState: interactionState || { mode: 'attract', isActive: false, chargeLevel: 0 },
      settings: {
        flockingEnabled: true,
        flockingRadius: qualitySettings.flockingRadius,
        separationRadius: qualitySettings.separationRadius,
        maxFlockingNeighbors: qualitySettings.maxFlockingNeighbors,
      },
      time,
      deltaTime: delta,
    };

    try {
      workerRef.current.postMessage({
        type: 'UPDATE_PHYSICS',
        data: workerData
      });
      pendingPhysicsUpdate.current = true;
      lastWorkerUpdate.current = frameCounter.current;
      return true;
    } catch (error) {
      console.warn('Failed to send data to worker:', error);
      workerSupported.current = false;
      return false;
    }
  }, [mousePosition, time, qualitySettings, particleToWorkerFormat]);

  // Fallback physics calculation (when worker is not available)
  const calculatePhysicsFallback = useCallback((delta: number) => {
    spatialGrid.current.clear();
    
    // Insert particles into spatial grid
    particlesRef.current.forEach(particle => {
      spatialGrid.current.insert(particle);
    });

    // Update each particle
    particlesRef.current.forEach((particle, i) => {
      // Skip update based on LOD
      if ((frameCounter.current + i) % qualitySettings.updateInterval !== 0) {
        return;
      }

      // Mouse interaction
      const mouseDistance = DistanceUtils.distanceSquared(particle.position, mousePosition);
      const mouseRadius = 4;
      const mouseRadiusSquared = mouseRadius * mouseRadius;

      if (mouseDistance < mouseRadiusSquared) {
        const distance = Math.sqrt(mouseDistance);
        const interactionStrength = 1 - (distance / mouseRadius);
        const mode = interactionState?.mode || 'attract';

        const forceDirection = vectorPool.current.get();
        
        switch (mode) {
          case 'attract':
            forceDirection.subVectors(mousePosition, particle.position).normalize();
            forceDirection.multiplyScalar(interactionStrength * 0.008);
            break;
          case 'repel':
            forceDirection.subVectors(particle.position, mousePosition).normalize();
            forceDirection.multiplyScalar(interactionStrength * 0.012);
            break;
          case 'vortex':
            const angle = Math.atan2(
              particle.position.y - mousePosition.y,
              particle.position.x - mousePosition.x
            );
            forceDirection.set(
              -Math.sin(angle) * interactionStrength * 0.015,
              Math.cos(angle) * interactionStrength * 0.015,
              0
            );
            break;
        }

        particle.velocity.add(forceDirection);
        particle.energy = Math.min(particle.energy + 0.015, 1.0);
        vectorPool.current.release(forceDirection);
      } else {
        particle.energy = Math.max(particle.energy - 0.005, 0.3);
      }

      // Flocking behavior
      const neighbors = spatialGrid.current.queryRadius(particle.position, qualitySettings.flockingRadius);
      if (neighbors.length > 0) {
        const clusterForce = vectorPool.current.get();
        const separationForce = vectorPool.current.get();
        let neighborCount = 0;

        neighbors.slice(0, qualitySettings.maxFlockingNeighbors).forEach(neighbor => {
          if (neighbor.index !== particle.index) {
            neighborCount++;
            clusterForce.add(neighbor.position);

            const dist = DistanceUtils.distanceSquared(particle.position, neighbor.position);
            if (dist < qualitySettings.separationRadius * qualitySettings.separationRadius) {
              const sep = vectorPool.current.get();
              sep.subVectors(particle.position, neighbor.position).normalize();
              separationForce.add(sep);
              vectorPool.current.release(sep);
            }
          }
        });

        if (neighborCount > 0) {
          clusterForce.divideScalar(neighborCount).sub(particle.position);
          clusterForce.multiplyScalar(0.001);
          separationForce.multiplyScalar(0.003);
          
          particle.velocity.add(clusterForce).add(separationForce);
        }

        vectorPool.current.release(clusterForce);
        vectorPool.current.release(separationForce);
      }

      // Float animation
      const floatY = Math.sin(time + particle.phase) * 0.5;
      const floatX = Math.cos(time * 0.7 + particle.phase) * 0.3;

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

      // Update lifecycle
      particle.lifecycle = Math.min(particle.lifecycle + delta, particle.maxLifetime);
    });

    // Release all pooled vectors
    vectorPool.current.releaseAll();
  }, [mousePosition, time, qualitySettings]);

  // Create optimized particle
  const createWorkerParticle = useCallback((position: THREE.Vector3, index: number): WorkerParticle => {
    const geometries = ['sphere', 'octahedron', 'icosahedron'] as const;
    const colorVariation = Math.random();
    const colorIntensity = Math.random();
    let color: THREE.Color;
    
    // Color generation based on variant
    if (variant === 'lightweight') {
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

    const targetColor = color.clone();
    if (variant === 'lightweight') {
      const targetVariation = (colorVariation + 0.3) % 1.0;
      targetColor.setHex(targetVariation < 0.5 ? 0xB8860B : 0xCD853F);
    }

    return {
      position: position.clone(),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.01
      ),
      basePosition: position.clone(),
      phase: Math.random() * Math.PI * 2,
      size: 0.02 + Math.random() * 0.03,
      geometry: geometries[Math.floor(Math.random() * geometries.length)],
      color: color.clone(),
      baseColor: color.clone(),
      targetColor: targetColor,
      colorTransitionSpeed: 0.3 + Math.random() * 0.4,
      trail: [],
      energy: Math.random() * 0.5 + 0.5,
      lifecycle: 0,
      maxLifetime: 8 + Math.random() * 12,
      fadeIn: 0,
      fadeOut: 1,
      index,
      lastUpdateFrame: 0,
      updateFrequency: 1,
      qualityLevel: 'high'
    };
  }, [variant]);

  // Initialize particles
  const particleData = useMemo(() => {
    const workerParticles: WorkerParticle[] = [];
    
    for (let i = 0; i < count; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 10
      );
      
      workerParticles.push(createWorkerParticle(position, i));
    }
    
    particlesRef.current = workerParticles;
    return workerParticles;
  }, [count, createWorkerParticle]);

  // Color scheme and materials
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

  // Main animation loop
  useFrame((state, delta) => {
    if (!meshRef.current || !glowMeshRef.current || !trailMeshRef.current) return;

    frameCounter.current++;
    performanceMonitor.current.update();

    // Try to use Web Worker for physics, fallback to main thread
    const workerSuccess = sendPhysicsToWorker(delta);
    if (!workerSuccess && workerSupported.current === false) {
      calculatePhysicsFallback(delta);
    }

    const dummy = new THREE.Object3D();
    const glowDummy = new THREE.Object3D();
    const trailPositions = trailGeometry.attributes.position.array as Float32Array;
    const trailColors = trailGeometry.attributes.color.array as Float32Array;

    // Update visual elements (always on main thread)
    particlesRef.current.forEach((particle, i) => {
      // Update particle lifecycle and visual properties
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

      // Dynamic color transitions
      const colorTransitionFactor = Math.sin(time * particle.colorTransitionSpeed + particle.phase) * 0.5 + 0.5;
      particle.color.lerpColors(particle.baseColor, particle.targetColor, colorTransitionFactor * 0.6);

      // Update trail
      particle.trail.unshift(particle.position.clone());
      if (particle.trail.length > qualitySettings.trailLength) {
        particle.trail.pop();
      }

      // Update instance matrices
      const pulseScale = 1 + Math.sin(time * 2 + particle.phase) * 0.3 * particle.energy;
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
        const trailLength = qualitySettings.trailLength;
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
      
      {/* Performance indicator */}
      {workerSupported.current && (
        <mesh position={[8, 5, 0]} scale={[0.1, 0.1, 0.1]}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshBasicMaterial color="#00ff00" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}