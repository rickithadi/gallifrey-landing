import React, { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NavigatorDeviceMemory extends Navigator {
  deviceMemory?: number;
}

interface ParticleSystemProps {
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

interface EnhancedParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
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
  lifecycle: number; // 0-1, particle age
  maxLifetime: number; // seconds
  fadeIn: number; // 0-1, fade in progress
  fadeOut: number; // 0-1, fade out progress
}

export function ParticleSystem({ 
  count, 
  variant, 
  mousePosition, 
  time,
  interactionState,
  gesture,
  velocity,
  trail,
  clickIntensity
}: ParticleSystemProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particlesRef = useRef<Array<EnhancedParticle>>([]);
  const particlePool = useRef<Array<EnhancedParticle>>([]);
  const activeParticleCount = useRef(0);
  const trailMeshRef = useRef<THREE.Points>(null);
  const glowMeshRef = useRef<THREE.InstancedMesh>(null);
  const lastMousePosition = useRef(mousePosition);
  const spawnCooldown = useRef(0);
  const maxParticles = count * 2; // Allow up to 2x particles for cursor spawning
  
  // Geometry pooling for better memory management
  const geometryPool = useRef<Map<string, THREE.BufferGeometry>>(new Map());
  const materialPool = useRef<Map<string, THREE.Material>>(new Map());
  const matrixCache = useRef<THREE.Matrix4[]>([]);
  const tempMatrix = useRef<THREE.Matrix4>(new THREE.Matrix4());
  
  // Performance monitoring
  const frameSkipCounter = useRef(0);
  const performanceAdaptiveSettings = useRef({
    trailEnabled: true,
    glowEnabled: true,
    flockingEnabled: true,
    updateFrequency: 1
  });

  // Adaptive quality based on device capabilities
  const deviceQuality = useMemo(() => {
    if (typeof window === 'undefined') return 'medium';
    
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return 'low';
    
    // Check for device indicators
    const isMobile = window.innerWidth < 768;
    const isHighDPI = window.devicePixelRatio > 1.5;
    const memoryInfo = (navigator as NavigatorDeviceMemory).deviceMemory;
    const hardwareConcurrency = navigator.hardwareConcurrency;
    
    // Performance scoring
    let score = 0;
    if (!isMobile) score += 2;
    if (hardwareConcurrency >= 8) score += 2;
    else if (hardwareConcurrency >= 4) score += 1;
    if (memoryInfo && memoryInfo >= 8) score += 2;
    else if (memoryInfo && memoryInfo >= 4) score += 1;
    if (isHighDPI) score += 1;
    
    // Check WebGL capabilities
    const webgl = gl as WebGLRenderingContext;
    const maxTextureSize = webgl.getParameter(webgl.MAX_TEXTURE_SIZE);
    const maxRenderBufferSize = webgl.getParameter(webgl.MAX_RENDERBUFFER_SIZE);
    if (maxTextureSize >= 4096) score += 1;
    if (maxRenderBufferSize >= 4096) score += 1;
    
    if (score >= 7) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  }, []);

  // Quality-based rendering parameters
  const qualitySettings = useMemo(() => {
    const settings = {
      low: {
        geometryDetail: { sphere: 8, octahedron: 0, icosahedron: 0 },
        trailLength: 10,
        flockingRadius: 1.5,
        separationRadius: 0.6,
        updateInterval: 2, // Skip frames
      },
      medium: {
        geometryDetail: { sphere: 12, octahedron: 0, icosahedron: 0 },
        trailLength: 15,
        flockingRadius: 2.0,
        separationRadius: 0.8,
        updateInterval: 1,
      },
      high: {
        geometryDetail: { sphere: 16, octahedron: 1, icosahedron: 1 },
        trailLength: 20,
        flockingRadius: 2.5,
        separationRadius: 1.0,
        updateInterval: 1,
      },
    };
    return settings[deviceQuality];
  }, [deviceQuality]);

  // Particle pool management functions
  const getParticleFromPool = (): EnhancedParticle | null => {
    if (particlePool.current.length > 0) {
      return particlePool.current.pop() || null;
    }
    return null;
  };

  const returnParticleToPool = (particle: EnhancedParticle): void => {
    // Reset particle to default state
    particle.lifecycle = 0;
    particle.fadeIn = 0;
    particle.fadeOut = 1;
    particle.energy = Math.random() * 0.5 + 0.5;
    particle.trail.length = 0;
    
    particlePool.current.push(particle);
  };

  const spawnParticleFromPool = (position: THREE.Vector3, isFromCursor: boolean = false): boolean => {
    if (activeParticleCount.current >= maxParticles) return false;
    
    let particle = getParticleFromPool();
    if (!particle) {
      particle = createParticle(position, isFromCursor);
    } else {
      // Reuse pooled particle
      particle.position.copy(position);
      particle.basePosition.copy(position);
      particle.velocity.set(
        (Math.random() - 0.5) * (isFromCursor ? 0.05 : 0.02),
        (Math.random() - 0.5) * (isFromCursor ? 0.05 : 0.02),
        (Math.random() - 0.5) * 0.01
      );
      particle.phase = Math.random() * Math.PI * 2;
      particle.size = (isFromCursor ? 0.025 : 0.02) + Math.random() * 0.03;
      particle.energy = isFromCursor ? 1.0 : Math.random() * 0.5 + 0.5;
      particle.maxLifetime = isFromCursor ? 5 + Math.random() * 8 : 8 + Math.random() * 12;
      particle.lifecycle = 0;
      particle.fadeIn = 0;
      particle.fadeOut = 1;
      
      // Update colors for reused particle
      const colorVariation = Math.random();
      const colorIntensity = Math.random();
      let color: THREE.Color;
      
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
      
      particle.color.copy(color);
      particle.baseColor.copy(color);
    }
    
    particlesRef.current.push(particle);
    activeParticleCount.current++;
    return true;
  };

  // Function to create a new particle at a specific position
  const createParticle = (position: THREE.Vector3, isFromCursor: boolean = false): EnhancedParticle => {
    const geometries = ['sphere', 'octahedron', 'icosahedron'] as const;
    const colorVariation = Math.random();
    const colorIntensity = Math.random();
    let color: THREE.Color;
    
    if (variant === 'lightweight') {
      // Enhanced color generation for cursor spawned particles
      if (isFromCursor) {
        // Cursor particles use warmer, more vibrant colors
        color = new THREE.Color().lerpColors(
          new THREE.Color('#B8860B'), // OYN orange-600
          new THREE.Color('#CD853F'), // OYN orange-700
          colorIntensity
        );
      } else {
        // Regular particle color generation
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
      // Professional Gallifrey brand colors
      if (isFromCursor) {
        color = new THREE.Color('#2D5A87'); // Pure teal for cursor particles
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

    // Generate target color for transitions
    const targetColor = color.clone();
    if (variant === 'lightweight') {
      const targetVariation = (colorVariation + 0.3) % 1.0;
      if (targetVariation < 0.5) {
        targetColor.setHex(0xB8860B);
      } else {
        targetColor.setHex(0xCD853F);
      }
    } else {
      const targetVariation = (colorVariation + 0.4) % 1.0;
      targetColor.lerpColors(
        new THREE.Color('#1B365D'),
        new THREE.Color('#2D5A87'),
        targetVariation
      );
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
    };
  };

  // Generate enhanced particles with sophisticated properties
  const particleData = useMemo(() => {
    const enhancedParticles: EnhancedParticle[] = [];
    
    for (let i = 0; i < count; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 10
      );
      
      enhancedParticles.push(createParticle(position, false));
    }
    particlesRef.current = enhancedParticles;
    activeParticleCount.current = enhancedParticles.length;
    return enhancedParticles;
  }, [count]);

  // Enhanced brand-accurate color schemes with aurora effects
  const colorScheme = useMemo(() => {
    if (variant === 'lightweight') {
      return {
        primary: new THREE.Color('#2D5A87'), // Gallifrey teal
        secondary: new THREE.Color('#1B365D'), // Gallifrey charcoal (darker)
        accent: new THREE.Color('#B8860B'), // OYN orange-600 (warm)
        accent2: new THREE.Color('#CD853F'), // OYN orange-700 (warmer)
        aurora: new THREE.Color('#234669'), // Gallifrey teal-dark
        glow: new THREE.Color('#2D5A87'), // Gallifrey teal glow
      };
    }
    return {
      primary: new THREE.Color('#2D5A87'), // Gallifrey teal
      secondary: new THREE.Color('#1B365D'), // Gallifrey charcoal
      accent: new THREE.Color('#234669'), // Gallifrey teal-dark
      accent2: new THREE.Color('#1F2937'), // Gallifrey charcoal (lighter)
      aurora: new THREE.Color('#2D5A87'), // Gallifrey teal
      glow: new THREE.Color('#234669'), // Gallifrey teal-dark
    };
  }, [variant]);

  // Create multiple geometries for morphing effects with adaptive quality
  const geometries = useMemo(() => ({
    sphere: new THREE.SphereGeometry(0.02, qualitySettings.geometryDetail.sphere, qualitySettings.geometryDetail.sphere / 2),
    octahedron: new THREE.OctahedronGeometry(0.025, qualitySettings.geometryDetail.octahedron),
    icosahedron: new THREE.IcosahedronGeometry(0.02, qualitySettings.geometryDetail.icosahedron),
  }), [qualitySettings]);

  // Enhanced emissive material with brand-accurate glow
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: colorScheme.primary,
    emissive: colorScheme.glow,
    emissiveIntensity: variant === 'lightweight' ? 0.4 : 0.3,
    transparent: true,
    opacity: variant === 'lightweight' ? 0.85 : 0.8,
    roughness: 0.1,
    metalness: 0.9,
  }), [colorScheme.primary, colorScheme.glow, variant]);

  // Glow material for outer aura with brand colors
  const glowMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: colorScheme.aurora,
    transparent: true,
    opacity: variant === 'lightweight' ? 0.25 : 0.2,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  }), [colorScheme.aurora, variant]);

  // Trail geometry and material with adaptive quality
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

  // Initialize matrix cache for instance management
  useMemo(() => {
    matrixCache.current = Array.from({ length: maxParticles }, () => new THREE.Matrix4());
  }, [maxParticles]);
  
  // Geometry pooling function
  const getPooledGeometry = useCallback((type: string, params: number[]) => {
    const key = `${type}_${params.join('_')}`;
    if (!geometryPool.current.has(key)) {
      let geometry: THREE.BufferGeometry;
      switch (type) {
        case 'sphere':
          geometry = new THREE.SphereGeometry(params[0], params[1], params[2]);
          break;
        case 'octahedron':
          geometry = new THREE.OctahedronGeometry(params[0], params[1]);
          break;
        case 'icosahedron':
          geometry = new THREE.IcosahedronGeometry(params[0], params[1]);
          break;
        default:
          geometry = new THREE.SphereGeometry(0.02, 8, 4);
      }
      geometryPool.current.set(key, geometry);
    }
    return geometryPool.current.get(key)!;
  }, []);
  
  // Material pooling function
  const getPooledMaterial = useCallback((type: string, options: Record<string, unknown>) => {
    const key = `${type}_${JSON.stringify(options)}`;
    if (!materialPool.current.has(key)) {
      let material: THREE.Material;
      switch (type) {
        case 'standard':
          material = new THREE.MeshStandardMaterial(options);
          break;
        case 'basic':
          material = new THREE.MeshBasicMaterial(options);
          break;
        case 'points':
          material = new THREE.PointsMaterial(options);
          break;
        default:
          material = new THREE.MeshStandardMaterial(options);
      }
      materialPool.current.set(key, material);
    }
    return materialPool.current.get(key)!;
  }, []);

  // Enhanced animation with sophisticated effects and lifecycle management
  useFrame((state, delta) => {
    if (!meshRef.current || !glowMeshRef.current || !trailMeshRef.current) return;

    // Performance adaptive frame skipping
    frameSkipCounter.current++;
    const shouldUpdate = frameSkipCounter.current % performanceAdaptiveSettings.current.updateFrequency === 0;
    if (!shouldUpdate && state.gl.info.render.frame % 60 !== 0) return; // Always update every 60th frame
    
    // Reuse objects to reduce garbage collection
    const dummy = tempMatrix.current;
    const glowDummy = new THREE.Object3D();
    const trailPositions = trailGeometry.attributes.position.array as Float32Array;
    const trailColors = trailGeometry.attributes.color.array as Float32Array;
    
    // Performance monitoring - adjust settings based on frame rate
    const currentFPS = 1000 / (delta * 1000 || 16.67);
    if (frameSkipCounter.current % 120 === 0) { // Check every 2 seconds
      if (currentFPS < 30) {
        performanceAdaptiveSettings.current.updateFrequency = 3;
        performanceAdaptiveSettings.current.trailEnabled = false;
        performanceAdaptiveSettings.current.glowEnabled = false;
        performanceAdaptiveSettings.current.flockingEnabled = false;
      } else if (currentFPS < 45) {
        performanceAdaptiveSettings.current.updateFrequency = 2;
        performanceAdaptiveSettings.current.trailEnabled = true;
        performanceAdaptiveSettings.current.glowEnabled = false;
        performanceAdaptiveSettings.current.flockingEnabled = false;
      } else {
        performanceAdaptiveSettings.current.updateFrequency = 1;
        performanceAdaptiveSettings.current.trailEnabled = true;
        performanceAdaptiveSettings.current.glowEnabled = true;
        performanceAdaptiveSettings.current.flockingEnabled = true;
      }
    }
    
    // Handle cursor-based particle spawning
    spawnCooldown.current = Math.max(0, spawnCooldown.current - delta);
    
    // Calculate cursor movement speed
    const currentMouse = new THREE.Vector3(mousePosition.x, mousePosition.y, mousePosition.z);
    const mouseDelta = currentMouse.distanceTo(new THREE.Vector3(
      lastMousePosition.current.x,
      lastMousePosition.current.y,
      lastMousePosition.current.z
    ));
    
    // Spawn particles when cursor moves fast enough and cooldown is ready
    if (mouseDelta > 0.1 && spawnCooldown.current <= 0 && activeParticleCount.current < maxParticles) {
      // Create 1-3 particles based on movement speed
      const spawnCount = Math.min(3, Math.floor(mouseDelta * 10) + 1);
      
      for (let i = 0; i < spawnCount; i++) {
        // Add some randomness to spawn position around cursor
        const spawnPos = currentMouse.clone().add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.2
        ));
        
        spawnParticleFromPool(spawnPos, true);
      }
      
      spawnCooldown.current = 0.1; // 100ms cooldown
    }
    
    lastMousePosition.current = currentMouse.clone();
    
    // Remove expired particles and return them to pool
    const expiredParticles: number[] = [];
    particlesRef.current.forEach((particle, index) => {
      if (particle.lifecycle >= particle.maxLifetime) {
        expiredParticles.push(index);
      }
    });
    
    // Remove expired particles in reverse order to maintain indices
    expiredParticles.reverse().forEach(index => {
      const expiredParticle = particlesRef.current[index];
      returnParticleToPool(expiredParticle);
      particlesRef.current.splice(index, 1);
      activeParticleCount.current--;
    });
    
    particlesRef.current.forEach((particle, i) => {
      // Update particle lifecycle
      particle.lifecycle = Math.min(particle.lifecycle + delta, particle.maxLifetime);
      const lifeProgress = particle.lifecycle / particle.maxLifetime;
      
      // Handle fade in/out based on lifecycle
      if (lifeProgress < 0.1) {
        // Fade in during first 10% of life
        particle.fadeIn = lifeProgress / 0.1;
        particle.fadeOut = 1;
      } else if (lifeProgress > 0.85) {
        // Fade out during last 15% of life
        particle.fadeIn = 1;
        particle.fadeOut = 1 - ((lifeProgress - 0.85) / 0.15);
      } else {
        // Full visibility in middle of life
        particle.fadeIn = 1;
        particle.fadeOut = 1;
      }
      
      // Dynamic color transitions
      const colorTransitionFactor = Math.sin(time * particle.colorTransitionSpeed + particle.phase) * 0.5 + 0.5;
      particle.color.lerpColors(particle.baseColor, particle.targetColor, colorTransitionFactor * 0.6);
      
      // Advanced float animation with multiple harmonics
      const floatY = Math.sin(time + particle.phase) * 0.5 + 
                    Math.sin(time * 1.5 + particle.phase * 2) * 0.2;
      const floatX = Math.cos(time * 0.7 + particle.phase) * 0.3;
      
      // Enhanced mouse interaction with multiple modes
      const mouseDistance = particle.position.distanceTo(mousePosition);
      const maxDistance = 4;
      
      if (mouseDistance < maxDistance) {
        const interactionStrength = 1 - (mouseDistance / maxDistance);
        const mode = interactionState?.mode || 'attract';
        
        let forceDirection = new THREE.Vector3();
        
        switch (mode) {
          case 'attract':
            // Pull particles toward cursor
            forceDirection = mousePosition.clone().sub(particle.position).normalize();
            forceDirection.multiplyScalar(interactionStrength * 0.008);
            break;
            
          case 'repel':
            // Push particles away from cursor
            forceDirection = particle.position.clone().sub(mousePosition).normalize();
            forceDirection.multiplyScalar(interactionStrength * 0.012);
            break;
            
          case 'vortex':
            // Create circular motion around cursor
            const angle = Math.atan2(
              particle.position.y - mousePosition.y,
              particle.position.x - mousePosition.x
            );
            const tangentialForce = new THREE.Vector3(
              -Math.sin(angle) * interactionStrength * 0.015,
              Math.cos(angle) * interactionStrength * 0.015,
              0
            );
            const radialForce = mousePosition.clone().sub(particle.position).normalize();
            radialForce.multiplyScalar(interactionStrength * 0.003);
            forceDirection = tangentialForce.add(radialForce);
            break;
            
          case 'explosion':
            // Charge up energy, then explode outward
            const chargeLevel = interactionState?.chargeLevel || 0;
            if (chargeLevel > 0.1) {
              // Explosion force
              forceDirection = particle.position.clone().sub(mousePosition).normalize();
              const explosionStrength = chargeLevel * interactionStrength * 0.025;
              forceDirection.multiplyScalar(explosionStrength);
              
              // Add some randomness to explosion
              forceDirection.add(new THREE.Vector3(
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.005
              ));
            } else if (interactionState?.isActive) {
              // Charging - pull particles closer
              forceDirection = mousePosition.clone().sub(particle.position).normalize();
              forceDirection.multiplyScalar(interactionStrength * 0.005);
            }
            break;
        }
        
        particle.velocity.add(forceDirection);
        particle.energy = Math.min(particle.energy + 0.015, 1.0);
        
        // Dynamic size based on interaction mode and proximity
        let sizeMultiplier = 1 + interactionStrength * 0.5;
        if (mode === 'explosion' && (interactionState?.chargeLevel || 0) > 0.1) {
          sizeMultiplier *= 1 + (interactionState?.chargeLevel || 0) * 2;
        }
        particle.size = (0.02 + Math.random() * 0.03) * sizeMultiplier;
      } else {
        particle.energy = Math.max(particle.energy - 0.005, 0.3);
        // Restore base size when away from cursor
        particle.size = Math.max(particle.size * 0.995, 0.02 + Math.random() * 0.03);
      }

      // Update trail with adaptive length and performance gating
      if (performanceAdaptiveSettings.current.trailEnabled) {
        const adaptiveTrailLength = currentFPS > 45 ? qualitySettings.trailLength : Math.floor(qualitySettings.trailLength * 0.5);
        particle.trail.unshift(particle.position.clone());
        if (particle.trail.length > adaptiveTrailLength) {
          particle.trail.pop();
        }
      } else {
        // Clear trail to save memory when disabled
        if (particle.trail.length > 0) {
          particle.trail.length = 0;
        }
      }

      // Update position with enhanced float
      particle.position.add(particle.velocity);
      particle.position.y += floatY * 0.001;
      particle.position.x += floatX * 0.0005;

      // Boundary constraints with soft bouncing
      const boundary = 10;
      if (Math.abs(particle.position.x) > boundary) {
        particle.velocity.x *= -0.7;
        particle.position.x = Math.sign(particle.position.x) * boundary;
      }
      if (Math.abs(particle.position.y) > boundary) {
        particle.velocity.y *= -0.7;
        particle.position.y = Math.sign(particle.position.y) * boundary;
      }

      // Optimized flocking behaviors with spatial partitioning and performance gating
      if (performanceAdaptiveSettings.current.flockingEnabled && (i + frameSkipCounter.current) % 3 === 0) {
        const clusterForce = new THREE.Vector3();
        const separationForce = new THREE.Vector3();
        const alignmentForce = new THREE.Vector3();
        let neighborCount = 0;
        const flockRadius = qualitySettings.flockingRadius;
        const separationRadius = qualitySettings.separationRadius;
        const maxNeighbors = currentFPS > 45 ? 8 : 4; // Adaptive neighbor limit
        
        // Optimized neighbor search with early termination
        let checked = 0;
        for (let j = Math.max(0, i - 10); j < Math.min(particlesRef.current.length, i + 10) && checked < maxNeighbors; j++) {
          if (i === j) continue;
          checked++;
          
          const otherParticle = particlesRef.current[j];
          const distanceSquared = particle.position.distanceToSquared(otherParticle.position);
          const flockRadiusSquared = flockRadius * flockRadius;
          
          if (distanceSquared < flockRadiusSquared && distanceSquared > 0) {
            neighborCount++;
            const distance = Math.sqrt(distanceSquared);
            
            // Cohesion - move toward center of nearby particles
            clusterForce.add(otherParticle.position);
            
            // Alignment - align velocity with nearby particles
            alignmentForce.add(otherParticle.velocity);
            
            // Separation - avoid crowding
            if (distanceSquared < separationRadius * separationRadius) {
              const separationDir = particle.position.clone().sub(otherParticle.position);
              separationDir.normalize().multiplyScalar(1 / distance);
              separationForce.add(separationDir);
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
      }

      // Gentle return force with energy consideration
      const returnForce = particle.basePosition.clone().sub(particle.position);
      returnForce.multiplyScalar(0.001 * (1 - particle.energy * 0.5));
      particle.velocity.add(returnForce);

      // Dynamic damping based on energy
      particle.velocity.multiplyScalar(0.99 - particle.energy * 0.01);

      // Optimized matrix updates with reduced calculations
      const pulseScale = 1 + Math.sin(time * 2 + particle.phase) * 0.3 * particle.energy;
      const energyScale = 0.7 + particle.energy * 0.6;
      const fadeScale = particle.fadeIn * particle.fadeOut;
      const finalScale = pulseScale * energyScale * fadeScale;
      
      // Use cached matrix for main particle
      const matrix = matrixCache.current[i];
      matrix.makeScale(finalScale, finalScale, finalScale);
      matrix.setPosition(particle.position);
      meshRef.current.setMatrixAt(i, matrix);

      // Glow effect with performance gating
      if (performanceAdaptiveSettings.current.glowEnabled) {
        glowDummy.position.copy(particle.position);
        glowDummy.scale.setScalar(finalScale * 2.5);
        glowDummy.updateMatrix();
        glowMeshRef.current.setMatrixAt(i, glowDummy.matrix);
      }

      // Optimized trail rendering with performance gating
      if (performanceAdaptiveSettings.current.trailEnabled && particle.trail.length > 0) {
        const trailLength = Math.min(particle.trail.length, qualitySettings.trailLength);
        particle.trail.forEach((trailPoint, trailIndex) => {
          if (trailIndex >= trailLength) return;
          
          const trailIdx = i * trailLength * 3 + trailIndex * 3;
          if (trailIdx + 2 < trailPositions.length) {
            trailPositions[trailIdx] = trailPoint.x;
            trailPositions[trailIdx + 1] = trailPoint.y;
            trailPositions[trailIdx + 2] = trailPoint.z;
            
            // Enhanced trail fade with lifecycle and energy
            const trailFade = (1 - trailIndex / trailLength);
            const alpha = trailFade * particle.energy * particle.fadeIn * particle.fadeOut;
            trailColors[trailIdx] = particle.color.r * alpha;
            trailColors[trailIdx + 1] = particle.color.g * alpha;
            trailColors[trailIdx + 2] = particle.color.b * alpha;
          }
        });
      }
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (performanceAdaptiveSettings.current.glowEnabled) {
      glowMeshRef.current.instanceMatrix.needsUpdate = true;
    }
    if (performanceAdaptiveSettings.current.trailEnabled) {
      trailGeometry.attributes.position.needsUpdate = true;
      trailGeometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Main particle system */}
      <instancedMesh
        ref={meshRef}
        args={[geometries.sphere, material, count]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />
      
      {/* Glow effect layer */}
      <instancedMesh
        ref={glowMeshRef}
        args={[geometries.sphere, glowMaterial, count]}
        frustumCulled={false}
        renderOrder={-1}
      />
      
      {/* Particle trails */}
      <points
        ref={trailMeshRef}
        geometry={trailGeometry}
        material={trailMaterial}
        frustumCulled={false}
      />
    </group>
  );
}