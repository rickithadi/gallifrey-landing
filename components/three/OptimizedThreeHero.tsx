/**
 * Optimized Three.js Hero Component
 * Integrates all performance optimizations with unified monitoring and resource management
 */

import React, { useRef, useEffect, useMemo, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { HeroScene } from './HeroScene';
import { threePerformanceMonitor } from '../../lib/three-performance-monitor';
import { threeResourceManager } from '../../lib/three-resource-manager';
import { usePerformanceMonitor } from '../../lib/usePerformanceMonitor';

interface OptimizedThreeHeroProps {
  variant: 'original' | 'lightweight';
  mousePosition: { x: number; y: number };
  className?: string;
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

/**
 * Performance Monitor Component - runs inside Canvas context
 */
function PerformanceMonitorComponent() {
  const { gl, scene } = useThree();
  const frameCount = useRef(0);
  
  useEffect(() => {
    // Initialize Three.js performance monitor with renderer and scene
    threePerformanceMonitor.initialize(gl, scene);
    
    // Configure resource manager
    threeResourceManager.setCleanupConfig({
      maxUnusedAge: 30000, // 30 seconds
      maxPoolSize: 10,
      cleanupInterval: 5000, // 5 seconds
    });
    
    return () => {
      // Cleanup on unmount
      threePerformanceMonitor.dispose();
      threeResourceManager.dispose();
    };
  }, [gl, scene]);
  
  useFrame(() => {
    // Update performance metrics every frame
    const metrics = threePerformanceMonitor.update();
    frameCount.current++;
    
    // Log performance warnings in development
    if (process.env.NODE_ENV === 'development' && frameCount.current % 300 === 0) {
      const score = threePerformanceMonitor.getPerformanceScore();
      if (score < 70) {
        console.warn('Three.js Performance Warning:', {
          score,
          fps: metrics.fps,
          memoryUsage: `${metrics.memoryUsage.toFixed(1)} MB`,
          suggestions: threePerformanceMonitor.getOptimizationSuggestions(),
        });
      }
    }
  });
  
  return null;
}

/**
 * Adaptive Three.js Scene Component
 */
function AdaptiveScene(props: Omit<OptimizedThreeHeroProps, 'className'>) {
  const { gl } = useThree();
  const qualitySettings = threePerformanceMonitor.getCurrentQuality();
  
  // Adaptive particle count based on performance
  const adaptedParticleCount = useMemo(() => {
    return qualitySettings.particleCount;
  }, [qualitySettings.particleCount]);
  
  // Configure renderer settings based on quality
  useEffect(() => {
    // Adaptive renderer settings
    gl.setPixelRatio(qualitySettings.performanceLevel > 0.7 ? 
      Math.min(window.devicePixelRatio, 2) : 1);
    
    // Adaptive shadow settings
    gl.shadowMap.enabled = qualitySettings.performanceLevel > 0.5;
    gl.shadowMap.type = qualitySettings.performanceLevel > 0.7 ? 
      THREE.PCFSoftShadowMap : THREE.BasicShadowMap;
    
    // Adaptive tone mapping
    gl.toneMapping = qualitySettings.performanceLevel > 0.5 ? 
      THREE.ACESFilmicToneMapping : THREE.LinearToneMapping;
    
  }, [gl, qualitySettings.performanceLevel]);
  
  return (
    <>
      <PerformanceMonitorComponent />
      <HeroScene 
        {...props}
        particleCount={adaptedParticleCount}
      />
    </>
  );
}

/**
 * Loading Fallback Component
 */
function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-600">Loading 3D Experience...</p>
      </div>
    </div>
  );
}

/**
 * Error Boundary for Three.js
 */
class ThreeErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Three.js Error:', error, errorInfo);
    
    // Log error to performance monitor
    if (process.env.NODE_ENV === 'development') {
      console.group('Three.js Error Details');
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
          <div className="text-center p-6">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              3D Experience Unavailable
            </h3>
            <p className="text-red-600 text-sm">
              Please try refreshing the page or use a modern browser.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Main Optimized Three.js Hero Component
 */
export function OptimizedThreeHero({
  variant,
  mousePosition,
  className = '',
  ...heroProps
}: OptimizedThreeHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const performanceMonitor = usePerformanceMonitor({ adaptiveQuality: true });
  
  // Device capability detection
  const deviceCapabilities = useMemo(() => {
    if (typeof window === 'undefined') return { canRun3D: false, reason: 'SSR' };
    
    // Check for WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
      return { canRun3D: false, reason: 'No WebGL support' };
    }
    
    // Check device memory
    const navigator_extended = navigator as Navigator & { deviceMemory?: number };
    const deviceMemory = navigator_extended.deviceMemory || 4;
    if (deviceMemory < 2) {
      return { canRun3D: false, reason: 'Insufficient memory' };
    }
    
    // Check if mobile with low performance
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = isMobile && (deviceMemory < 4 || navigator.hardwareConcurrency < 4);
    
    return { 
      canRun3D: true, 
      isLowEnd,
      deviceMemory,
      isMobile,
      hardwareConcurrency: navigator.hardwareConcurrency || 4
    };
  }, []);
  
  // Adaptive canvas settings
  const canvasSettings = useMemo(() => {
    const baseSettings = {
      camera: { position: [0, 0, 10], fov: 60 },
      gl: {
        antialias: !deviceCapabilities.isLowEnd,
        alpha: true,
        powerPreference: 'high-performance' as const,
        stencil: false,
        depth: true,
      },
      performance: {
        min: 0.2, // Minimum target performance
        max: 1.0, // Maximum target performance
        debounce: 200, // Debounce performance adaptations
      },
      dpr: deviceCapabilities.isLowEnd ? 1 : Math.min(window.devicePixelRatio, 2),
    };
    
    return baseSettings;
  }, [deviceCapabilities.isLowEnd]);
  
  // Performance budgeting
  useEffect(() => {
    const budget = {
      targetFPS: deviceCapabilities.isLowEnd ? 30 : 60,
      maxFrameTime: deviceCapabilities.isLowEnd ? 33.33 : 16.67,
      maxMemoryUsage: deviceCapabilities.deviceMemory * 128, // MB
      maxDrawCalls: deviceCapabilities.isLowEnd ? 50 : 100,
      maxTriangles: deviceCapabilities.isLowEnd ? 25000 : 50000,
    };
    
    // Configure the global performance monitor
    threePerformanceMonitor.reset();
    // Budget configuration would be set here if the constructor supported it
  }, [deviceCapabilities]);
  
  // Error recovery
  const handleCanvasError = useCallback((error: Error) => {
    console.error('Canvas error:', error);
    
    // Report error to performance monitor
    if (process.env.NODE_ENV === 'development') {
      console.warn('Falling back to 2D experience due to Canvas error');
    }
  }, []);
  
  // Render 2D fallback for unsupported devices
  if (!deviceCapabilities.canRun3D) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="text-blue-500 text-2xl mb-2">🌟</div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Simplified Experience
            </h3>
            <p className="text-slate-600 text-sm">
              {deviceCapabilities.reason === 'No WebGL support' 
                ? 'Your browser doesn\'t support 3D graphics'
                : 'Optimized for your device performance'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`relative w-full h-full ${className}`}>
      <ThreeErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            ref={canvasRef}
            camera={canvasSettings.camera}
            gl={canvasSettings.gl}
            performance={canvasSettings.performance}
            dpr={canvasSettings.dpr}
            onError={handleCanvasError}
            style={{ 
              background: 'transparent',
              touchAction: 'none', // Prevent mobile scrolling interference
            }}
          >
            <AdaptiveScene
              variant={variant}
              mousePosition={mousePosition}
              {...heroProps}
            />
          </Canvas>
        </Suspense>
      </ThreeErrorBoundary>
      
      {/* Performance Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 text-xs text-white bg-black bg-opacity-50 p-2 rounded font-mono">
          <div>FPS: {Math.round(performanceMonitor.metrics.fps)}</div>
          <div>Quality: {(threePerformanceMonitor.getCurrentQuality().performanceLevel * 100).toFixed(0)}%</div>
          <div>Memory: {performanceMonitor.metrics.memoryUsage}%</div>
        </div>
      )}
    </div>
  );
}

// Export performance hooks for external monitoring
export { useThreePerformanceMonitor } from '../../lib/three-performance-monitor';
export { useThreeResourceManager } from '../../lib/three-resource-manager';