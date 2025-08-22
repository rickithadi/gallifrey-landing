import React, { Suspense, useMemo, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { OptimizedHeroScene, useThreePerformance } from './OptimizedHeroScene';
import { performanceMonitor } from './PerformanceMonitor';
import { threeObjectPools, geometryPool, materialPool } from './ObjectPool';

interface OptimizedThreeHeroBackgroundProps {
  className?: string;
  variant?: 'original' | 'lightweight';
  mousePosition?: { x: number; y: number };
}

// Performance debug overlay component (development only)
function PerformanceDebugOverlay() {
  const performance = useThreePerformance();
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="absolute top-4 right-4 bg-black/80 text-white text-xs p-2 rounded font-mono z-50">
      <div>FPS: {performance.fps} (avg: {performance.averageFPS})</div>
      <div>Particles: {performance.particleCount}</div>
      <div>Connections: {performance.connectionLines ? 'ON' : 'OFF'}</div>
      <div>GPU Tier: {performance.gpuTier}</div>
      <div>Score: {Math.round(performance.performanceScore)}%</div>
    </div>
  );
}

export function OptimizedThreeHeroBackground({ 
  className = '', 
  variant = 'original',
  mousePosition = { x: 0, y: 0 }
}: OptimizedThreeHeroBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState<boolean | null>(null);
  const [renderScale, setRenderScale] = useState(1);

  // Initialize performance monitoring and WebGL detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check WebGL support
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      setIsWebGLSupported(!!gl);
      
      if (gl) {
        // Set up performance monitoring
        performanceMonitor.enableAdaptiveQuality(true);
        
        // Set initial render scale based on device capabilities
        const capabilities = performanceMonitor.getCapabilities();
        if (capabilities) {
          switch (capabilities.gpuTier) {
            case 'ultra':
              setRenderScale(Math.min(2, window.devicePixelRatio || 1));
              break;
            case 'high':
              setRenderScale(Math.min(1.5, window.devicePixelRatio || 1));
              break;
            case 'medium':
              setRenderScale(1);
              break;
            case 'low':
              setRenderScale(0.8);
              break;
          }
        }
      }
    }
    
    // Cleanup on unmount
    return () => {
      threeObjectPools.dispose();
      geometryPool.dispose();
      materialPool.dispose();
      performanceMonitor.dispose();
    };
  }, []);

  // Memoize camera settings with performance optimizations
  const cameraSettings = useMemo(() => {
    const capabilities = performanceMonitor.getCapabilities();
    
    return {
      position: [0, 0, 10] as [number, number, number],
      fov: 75,
      near: 0.1,
      far: capabilities?.gpuTier === 'low' ? 100 : 1000,
    };
  }, []);

  // Optimized GL settings based on device capabilities
  const glSettings = useMemo(() => {
    const capabilities = performanceMonitor.getCapabilities();
    
    return {
      antialias: capabilities?.gpuTier !== 'low',
      alpha: true,
      powerPreference: 'high-performance' as const,
      preserveDrawingBuffer: false,
      failIfMajorPerformanceCaveat: false,
      stencil: false,
      depth: true,
      logarithmicDepthBuffer: capabilities?.gpuTier === 'ultra'
    };
  }, []);

  // Performance settings
  const performanceSettings = useMemo(() => ({
    min: 0.5,
    max: 1,
    debounce: 200
  }), []);

  // Canvas creation callback with optimizations
  const onCanvasCreated = useMemo(() => 
    ({ gl, camera }: { gl: THREE.WebGLRenderer; camera: THREE.Camera }) => {
      // Set up renderer optimizations
      performanceMonitor.setRenderer(gl);
      
      // Optimize renderer settings
      gl.setPixelRatio(renderScale);
      gl.outputColorSpace = THREE.SRGBColorSpace;
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.0;
      
      // Performance optimizations
      gl.shadowMap.enabled = false; // Disable shadows for performance
      gl.info.autoReset = false;
      
      // Advanced optimizations for high-end devices
      const capabilities = performanceMonitor.getCapabilities();
      if (capabilities?.gpuTier === 'ultra') {
        gl.capabilities.isWebGL2 = true;
        gl.extensions.get('EXT_color_buffer_float');
        gl.extensions.get('OES_texture_float_linear');
      }
      
      // Camera optimizations
      if (camera.layers) {
        camera.layers.enableAll();
      }
    }, [renderScale]
  );

  // Fallback component for loading, errors, or unsupported devices
  const fallbackBackground = useMemo(() => (
    <div className={`absolute inset-0 bg-gradient-to-br from-primary/4 via-background to-accent/3 ${className}`} />
  ), [className]);

  // Show fallback for unsupported browsers
  if (isWebGLSupported === false) {
    return (
      <div className={`absolute inset-0 ${className}`}>
        {fallbackBackground}
        <div className="absolute inset-0 flex items-center justify-center text-primary/60 text-sm">
          Enhanced visuals require WebGL support
        </div>
      </div>
    );
  }

  // Show fallback during detection
  if (isWebGLSupported === null) {
    return fallbackBackground;
  }

  // Don't render Three.js on server side
  if (typeof window === 'undefined') {
    return fallbackBackground;
  }

  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        ref={canvasRef}
        camera={cameraSettings}
        gl={glSettings}
        dpr={renderScale}
        performance={performanceSettings}
        onCreated={onCanvasCreated}
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
          <OptimizedHeroScene 
            variant={variant}
            mousePosition={mousePosition}
          />
        </Suspense>
      </Canvas>
      
      {/* Fallback gradient overlay for loading states */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-accent/2 pointer-events-none" />
      
      {/* Performance debug overlay (development only) */}
      <PerformanceDebugOverlay />
    </div>
  );
}

// Export both optimized and original versions for A/B testing
export { ThreeHeroBackground } from './ThreeHeroBackground';

// Export performance monitoring hook
export { useThreePerformance } from './OptimizedHeroScene';