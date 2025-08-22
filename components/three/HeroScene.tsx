import React, { useRef, useMemo, useCallback, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { ParticleSystem } from './ParticleSystem';
import { AuroraEffect } from './AuroraEffect';
import { LightRays } from './LightRays';
// import { GPUParticles } from './GPUParticles'; // Temporarily disabled
import * as THREE from 'three';
import dynamic from 'next/dynamic';
import { usePerformanceMonitor } from '../../lib/usePerformanceMonitor';

// Dynamic imports for performance-heavy components
const LazyConnectionLines = dynamic(() => import('./ConnectionLines').then(mod => ({ default: mod.ConnectionLines })), {
  ssr: false
});

const LazyParticleCluster = dynamic(() => import('./ParticleCluster').then(mod => ({ default: mod.ParticleCluster })), {
  ssr: false
});

interface HeroSceneProps {
  particleCount: number;
  variant: 'original' | 'lightweight';
  mousePosition: { x: number; y: number };
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
  scrollData?: {
    scrollY: number;
    scrollDirection: 'up' | 'down' | 'none';
    scrollVelocity: number;
    scrollProgress: number;
    isScrolling: boolean;
    parallaxOffset: number;
  };
  touchData?: {
    touches: Array<{
      id: number;
      x: number;
      y: number;
      startX: number;
      startY: number;
      startTime: number;
    }>;
    gesture: {
      type: 'none' | 'tap' | 'swipe' | 'pinch' | 'hold' | 'multi-touch';
      intensity: number;
      direction?: { x: number; y: number };
      center?: { x: number; y: number };
      scale?: number;
      rotation?: number;
      touchCount: number;
    };
    isActive: boolean;
  };
}

export const HeroScene = React.memo<HeroSceneProps>(function HeroScene({ 
  particleCount, 
  variant, 
  mousePosition,
  gesture,
  interactionState,
  velocity,
  trail,
  clickIntensity
}) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const performanceMonitor = usePerformanceMonitor({ adaptiveQuality: true });
  
  // Performance-based rendering decisions
  const shouldRenderEffects = useMemo(() => {
    return performanceMonitor.metrics.fps > 45;
  }, [performanceMonitor.metrics.fps]);
  
  const adaptedParticleCount = useMemo(() => {
    const quality = performanceMonitor.qualitySettings;
    return Math.min(particleCount, quality.particleCount);
  }, [particleCount, performanceMonitor.qualitySettings.particleCount]);

  // Convert mouse position to 3D space
  const mousePosition3D = useMemo(() => {
    if (typeof window === 'undefined') return new THREE.Vector3(0, 0, 0);
    const x = (mousePosition.x / window.innerWidth) * 2 - 1;
    const y = -(mousePosition.y / window.innerHeight) * 2 + 1;
    return new THREE.Vector3(x * 5, y * 3, 0);
  }, [mousePosition.x, mousePosition.y]);

  // Animate the entire scene - memoized to prevent re-creation on every render
  const animateScene = useCallback((state: unknown, delta: number) => {
    timeRef.current += delta;
    
    if (groupRef.current) {
      // Performance-adaptive rotation intensity
      const rotationIntensity = performanceMonitor.metrics.fps > 50 ? 1.0 : 0.5;
      
      // Use lerp for smoother animation and better performance
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mousePosition3D.x * 0.05 * rotationIntensity,
        delta * 2
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mousePosition3D.y * 0.03 * rotationIntensity,
        delta * 2
      );
    }
  }, [mousePosition3D.x, mousePosition3D.y, performanceMonitor.metrics.fps]);

  useFrame(animateScene);

  return (
    <group ref={groupRef}>
      {/* Enhanced lighting setup with performance scaling */}
      <ambientLight 
        intensity={shouldRenderEffects ? 0.15 : 0.2} 
        color="#f8fafc" 
      />
      
      {/* Primary point light that follows mouse cursor */}
      <pointLight 
        position={[mousePosition3D.x, mousePosition3D.y, 5]}
        intensity={shouldRenderEffects ? 0.8 : 0.6}
        color={variant === 'lightweight' ? "#2D5A87" : "#3B82F6"}
        distance={shouldRenderEffects ? 12 : 8}
        decay={1.5}
        castShadow={shouldRenderEffects}
        shadow-mapSize={shouldRenderEffects ? [1024, 1024] : [512, 512]}
      />
      
      {/* Secondary accent light for depth - only render if performance allows */}
      {shouldRenderEffects && (
        <pointLight 
          position={[-mousePosition3D.x * 0.5, -mousePosition3D.y * 0.5, 3]}
          intensity={0.3}
          color={variant === 'lightweight' ? "#F97316" : "#8B5CF6"}
          distance={8}
          decay={2}
        />
      )}
      
      {/* Directional light for overall illumination - reduced quality on low performance */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.2}
        color="#ffffff"
        castShadow={shouldRenderEffects}
        shadow-mapSize={shouldRenderEffects ? [2048, 2048] : [1024, 1024]}
      />

      {/* Aurora background effect - only render if performance allows */}
      {shouldRenderEffects && (
        <AuroraEffect
          variant={variant}
          mousePosition={mousePosition3D}
          time={timeRef.current}
        />
      )}
      
      {/* Light rays emanating from cursor - only render if performance allows */}
      {shouldRenderEffects && (
        <LightRays
          variant={variant}
          mousePosition={mousePosition3D}
          time={timeRef.current}
        />
      )}

      {/* Enhanced particle system with adaptive count */}
      <ParticleSystem 
        count={Math.floor(adaptedParticleCount * 0.7)}
        variant={variant}
        mousePosition={mousePosition3D}
        time={timeRef.current}
        gesture={gesture}
        interactionState={interactionState}
        velocity={velocity}
        trail={trail}
        clickIntensity={clickIntensity}
      />
      
      {/* Dynamic particle clusters - lazy loaded */}
      <Suspense fallback={null}>
        <LazyParticleCluster
          variant={variant}
          mousePosition={mousePosition3D}
          time={timeRef.current}
        />
      </Suspense>
      
{/* GPU particles temporarily disabled due to shader parsing issues 
      <GPUParticles
        variant={variant}
        mousePosition={mousePosition3D}
        time={timeRef.current}
      />
      */}

      {/* Connection lines between particles - lazy loaded and performance gated */}
      {shouldRenderEffects && performanceMonitor.qualitySettings.enableFlocking && (
        <Suspense fallback={null}>
          <LazyConnectionLines
            particleCount={adaptedParticleCount}
            variant={variant}
            mousePosition={mousePosition3D}
            time={timeRef.current}
          />
        </Suspense>
      )}

      {/* Dynamic fog with subtle color tinting - adaptive distance based on performance */}
      <fog 
        attach="fog" 
        args={[
          variant === 'lightweight' ? '#f1f5f9' : '#f8fafc', 
          shouldRenderEffects ? 6 : 4, 
          shouldRenderEffects ? 25 : 18
        ]} 
      />
    </group>
  );
}, (prevProps, nextProps) => {
  // Enhanced comparison function for performance optimization
  return (
    prevProps.particleCount === nextProps.particleCount &&
    prevProps.variant === nextProps.variant &&
    Math.abs(prevProps.mousePosition.x - nextProps.mousePosition.x) < 2 &&
    Math.abs(prevProps.mousePosition.y - nextProps.mousePosition.y) < 2 &&
    prevProps.interactionState?.mode === nextProps.interactionState?.mode &&
    prevProps.interactionState?.isActive === nextProps.interactionState?.isActive &&
    Math.abs((prevProps.clickIntensity || 0) - (nextProps.clickIntensity || 0)) < 0.02 &&
    // Skip re-render if gesture type hasn't changed significantly
    prevProps.gesture?.type === nextProps.gesture?.type &&
    Math.abs((prevProps.gesture?.intensity || 0) - (nextProps.gesture?.intensity || 0)) < 0.1
  );
});