import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { performanceMonitor } from './PerformanceMonitor';
import { OptimizedParticleSystem } from './OptimizedParticleSystem';
import { OptimizedConnectionLines } from './OptimizedConnectionLines';
import { progressiveLoader, ProgressiveParticleSpawner } from './ProgressiveLoader';

interface OptimizedHeroSceneProps {
  variant: 'original' | 'lightweight';
  mousePosition: { x: number; y: number };
}

export function OptimizedHeroScene({ variant, mousePosition }: OptimizedHeroSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const [particleSpawner] = useState(() => new ProgressiveParticleSpawner(100));
  const [currentParticleCount, setCurrentParticleCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get performance-based settings
  const quality = performanceMonitor.getCurrentQuality();
  const capabilities = performanceMonitor.getCapabilities();

  // Convert mouse position to 3D space with object pooling
  const mousePosition3D = useMemo(() => {
    if (typeof window === 'undefined') return new THREE.Vector3();
    
    const x = (mousePosition.x / window.innerWidth) * 2 - 1;
    const y = -(mousePosition.y / window.innerHeight) * 2 + 1;
    return new THREE.Vector3(x * 5, y * 3, 0);
  }, [mousePosition.x, mousePosition.y]);

  // Generate optimized particle data based on current count
  const particles = useMemo(() => {
    const particles = [];
    for (let i = 0; i < currentParticleCount; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8
      );
      
      particles.push({
        position,
        id: i
      });
    }
    return particles;
  }, [currentParticleCount]);

  // Initialize progressive loading
  useEffect(() => {
    const initializeScene = async () => {
      // Register loading stages based on device capabilities
      progressiveLoader.registerStage(
        'basic-particles',
        1,
        async () => {
          // Load basic particle system
          particleSpawner.updateTargetCount(Math.min(30, quality.particleCount));
          particleSpawner.startSpawning();
        },
        { minGPUTier: 'low', minFPS: 20 }
      );

      progressiveLoader.registerStage(
        'enhanced-particles',
        2,
        async () => {
          // Add more particles for capable devices
          if (capabilities?.gpuTier !== 'low') {
            particleSpawner.updateTargetCount(quality.particleCount);
          }
        },
        { minGPUTier: 'medium', minFPS: 30 }
      );

      progressiveLoader.registerStage(
        'connection-lines',
        3,
        async () => {
          // Enable connection lines for high-end devices
          performanceMonitor.setQuality({ connectionLines: true });
        },
        { minGPUTier: 'medium', minFPS: 40 }
      );

      progressiveLoader.registerStage(
        'advanced-effects',
        4,
        async () => {
          // Enable advanced visual effects
          performanceMonitor.setQuality({ 
            animationComplexity: 'high',
            particleSize: quality.particleSize * 1.2
          });
        },
        { minGPUTier: 'high', minFPS: 50 }
      );

      await progressiveLoader.startLoading();
      setIsInitialized(true);
    };

    initializeScene();
  }, [capabilities, quality, particleSpawner]);

  // Set up particle spawner callback
  useEffect(() => {
    particleSpawner.spawnCallback = (count: number) => {
      setCurrentParticleCount(count);
    };
  }, [particleSpawner]);

  // Main animation loop with performance monitoring
  useFrame((state, delta) => {
    timeRef.current += delta;
    
    // Update performance monitoring
    performanceMonitor.updateMetrics();
    
    if (!groupRef.current) return;

    // Adaptive animation complexity based on performance
    const metrics = performanceMonitor.updateMetrics();
    const performanceMultiplier = Math.max(0.3, Math.min(1.0, metrics.averageFPS / 60));

    // Subtle group rotation based on mouse position and performance
    const rotationIntensity = variant === 'lightweight' ? 0.02 : 0.05;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mousePosition3D.x * rotationIntensity * performanceMultiplier,
      0.1
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mousePosition3D.y * (rotationIntensity * 0.6) * performanceMultiplier,
      0.1
    );

    // Performance-based quality adjustment
    if (metrics.averageFPS < 25 && quality.particleCount > 20) {
      // Emergency performance mode
      const newCount = Math.max(20, Math.floor(quality.particleCount * 0.7));
      performanceMonitor.setQuality({ particleCount: newCount });
      particleSpawner.updateTargetCount(newCount);
    }
  });

  // Adaptive lighting based on performance
  const lightingIntensity = useMemo(() => {
    return capabilities?.gpuTier === 'low' ? 0.3 : 0.5;
  }, [capabilities]);

  // Don't render until initialized
  if (!isInitialized) {
    return (
      <group>
        <ambientLight intensity={0.1} />
        {/* Minimal loading state */}
        <mesh>
          <planeGeometry args={[0.1, 0.1]} />
          <meshBasicMaterial color="#2D5A87" transparent opacity={0.3} />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      {/* Adaptive lighting system */}
      <ambientLight 
        intensity={lightingIntensity} 
        color={variant === 'lightweight' ? '#f0f8ff' : '#ffffff'} 
      />
      
      {/* Mouse-following point light with performance scaling */}
      <pointLight 
        position={[mousePosition3D.x, mousePosition3D.y, 5]}
        intensity={lightingIntensity * 1.5}
        color={variant === 'lightweight' ? '#2D5A87' : '#4A90E2'}
        distance={capabilities?.gpuTier === 'low' ? 8 : 12}
        decay={2}
      />

      {/* Optimized particle system */}
      {currentParticleCount > 0 && (
        <OptimizedParticleSystem
          mousePosition={mousePosition3D}
          time={timeRef.current}
          variant={variant}
        />
      )}

      {/* Connection lines (only for capable devices) */}
      {quality.connectionLines && particles.length > 1 && (
        <OptimizedConnectionLines
          particles={particles}
          mousePosition={mousePosition3D}
          time={timeRef.current}
          variant={variant}
        />
      )}

      {/* Performance-adaptive fog */}
      {capabilities?.gpuTier !== 'low' && (
        <fog 
          attach="fog" 
          args={[
            variant === 'lightweight' ? '#f8fafc' : '#ffffff', 
            capabilities.gpuTier === 'ultra' ? 10 : 8, 
            capabilities.gpuTier === 'ultra' ? 25 : 20
          ]} 
        />
      )}
    </group>
  );
}

// Export performance hook for external monitoring
export function useThreePerformance() {
  const [metrics, setMetrics] = useState(performanceMonitor.updateMetrics());
  const [quality, setQuality] = useState(performanceMonitor.getCurrentQuality());

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(performanceMonitor.updateMetrics());
      setQuality(performanceMonitor.getCurrentQuality());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    fps: Math.round(metrics.fps),
    averageFPS: Math.round(metrics.averageFPS),
    particleCount: quality.particleCount,
    connectionLines: quality.connectionLines,
    performanceScore: performanceMonitor.getPerformanceScore(),
    gpuTier: performanceMonitor.getCapabilities()?.gpuTier || 'unknown'
  };
}