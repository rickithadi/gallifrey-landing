import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { HeroScene } from './HeroScene';

interface ThreeHeroBackgroundProps {
  className?: string;
  variant?: 'original' | 'lightweight';
  mousePosition?: { x: number; y: number };
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

export const ThreeHeroBackground = React.memo<ThreeHeroBackgroundProps>(function ThreeHeroBackground({ 
  className = '', 
  variant = 'original',
  mousePosition = { x: 0, y: 0 },
  gesture,
  interactionState,
  velocity,
  trail,
  clickIntensity,
  scrollData,
  touchData
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Performance optimization: reduce particle count on mobile
  const particleCount = useMemo(() => {
    if (typeof window === 'undefined') return 100;
    return window.innerWidth < 768 ? 50 : 100;
  }, []);

  // Memoize camera settings to prevent unnecessary re-renders
  const cameraSettings = useMemo(() => ({
    position: [0, 0, 10] as [number, number, number],
    fov: 75,
    near: 0.1,
    far: 1000,
  }), []);

  // Fallback component for loading or errors
  const fallbackBackground = useMemo(() => (
    <div className={`absolute inset-0 bg-gradient-to-br from-primary/4 via-background to-accent/3 ${className}`} />
  ), [className]);

  // Don't render Three.js on server side
  if (typeof window === 'undefined') {
    return fallbackBackground;
  }

  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        ref={canvasRef}
        camera={cameraSettings}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        shadows
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      >
        <Suspense fallback={null}>
          <HeroScene 
            particleCount={particleCount}
            variant={variant}
            mousePosition={mousePosition}
            gesture={gesture}
            interactionState={interactionState}
            velocity={velocity}
            trail={trail}
            clickIntensity={clickIntensity}
            scrollData={scrollData}
            touchData={touchData}
          />
          
          {/* Post-processing effects for enhanced visuals */}
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              intensity={variant === 'lightweight' ? 1.2 : 0.8}
              width={300}
              height={300}
              kernelSize={3}
              blendFunction={BlendFunction.SCREEN}
            />
            
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={[0.0005, 0.0012]}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
      {/* Fallback gradient overlay for loading states */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-accent/2 pointer-events-none" />
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for performance optimization
  return (
    prevProps.variant === nextProps.variant &&
    prevProps.className === nextProps.className &&
    Math.abs(prevProps.mousePosition.x - nextProps.mousePosition.x) < 1 &&
    Math.abs(prevProps.mousePosition.y - nextProps.mousePosition.y) < 1 &&
    prevProps.interactionState?.mode === nextProps.interactionState?.mode &&
    prevProps.interactionState?.isActive === nextProps.interactionState?.isActive &&
    Math.abs((prevProps.clickIntensity || 0) - (nextProps.clickIntensity || 0)) < 0.01
  );
});