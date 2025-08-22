import { useEffect, useRef, useState, useCallback } from 'react';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  particleCount: number;
  drawCalls: number;
  qualityLevel: 'low' | 'medium' | 'high' | 'ultra-low';
}

interface PerformanceOptions {
  targetFPS?: number;
  adaptiveQuality?: boolean;
  measureInterval?: number;
}

export function usePerformanceMonitor(options: PerformanceOptions = {}) {
  const { 
    targetFPS = 60, 
    adaptiveQuality = true,
    measureInterval = 1000 
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    particleCount: 0,
    drawCalls: 0,
    qualityLevel: 'medium'
  });

  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fpsHistory = useRef<number[]>([]);

  // Calculate FPS
  const measureFPS = useCallback(() => {
    const now = performance.now();
    const delta = now - lastTime.current;
    
    if (delta >= measureInterval) {
      const fps = Math.round((frameCount.current * 1000) / delta);
      frameCount.current = 0;
      lastTime.current = now;
      
      // Keep FPS history for averaging
      fpsHistory.current.push(fps);
      if (fpsHistory.current.length > 5) {
        fpsHistory.current.shift();
      }
      
      const avgFPS = fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length;
      
      // Determine quality level based on performance
      let qualityLevel: PerformanceMetrics['qualityLevel'] = 'medium';
      
      if (avgFPS < 20) {
        qualityLevel = 'ultra-low';
      } else if (avgFPS < 30) {
        qualityLevel = 'low';
      } else if (avgFPS < 45) {
        qualityLevel = 'medium';
      } else {
        qualityLevel = 'high';
      }
      
      // Check memory usage if available
      let memoryUsage = 0;
      if ('memory' in performance) {
        // @ts-expect-error - performance.memory is non-standard but widely supported
        const memory = performance.memory;
        memoryUsage = Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100);
      }
      
      setMetrics(prev => ({
        ...prev,
        fps: avgFPS,
        frameTime: 1000 / avgFPS,
        memoryUsage,
        qualityLevel: adaptiveQuality ? qualityLevel : prev.qualityLevel
      }));
    }
    
    frameCount.current++;
  }, [measureInterval, adaptiveQuality]);

  // Performance optimization suggestions
  const getOptimizationSuggestions = useCallback(() => {
    const suggestions: string[] = [];
    
    if (metrics.fps < 30) {
      suggestions.push('Reduce particle count');
      suggestions.push('Disable particle trails');
      suggestions.push('Reduce geometry complexity');
    } else if (metrics.fps < 45) {
      suggestions.push('Reduce flocking calculations');
      suggestions.push('Decrease trail length');
    }
    
    if (metrics.memoryUsage > 80) {
      suggestions.push('Implement more aggressive particle pooling');
      suggestions.push('Reduce texture sizes');
    }
    
    return suggestions;
  }, [metrics]);

  // Adaptive quality settings based on performance
  const getQualitySettings = useCallback(() => {
    switch (metrics.qualityLevel) {
      case 'ultra-low':
        return {
          particleCount: 50,
          trailLength: 0,
          geometryDetail: 4,
          enableFlocking: false,
          enableTrails: false,
          enableGlow: false,
          updateInterval: 3,
          maxDistance: 2,
        };
      case 'low':
        return {
          particleCount: 100,
          trailLength: 5,
          geometryDetail: 6,
          enableFlocking: false,
          enableTrails: true,
          enableGlow: false,
          updateInterval: 2,
          maxDistance: 3,
        };
      case 'medium':
        return {
          particleCount: 200,
          trailLength: 10,
          geometryDetail: 8,
          enableFlocking: true,
          enableTrails: true,
          enableGlow: true,
          updateInterval: 1,
          maxDistance: 4,
        };
      case 'high':
        return {
          particleCount: 300,
          trailLength: 20,
          geometryDetail: 12,
          enableFlocking: true,
          enableTrails: true,
          enableGlow: true,
          updateInterval: 1,
          maxDistance: 5,
        };
      default:
        return {
          particleCount: 200,
          trailLength: 10,
          geometryDetail: 8,
          enableFlocking: true,
          enableTrails: true,
          enableGlow: true,
          updateInterval: 1,
          maxDistance: 4,
        };
    }
  }, [metrics.qualityLevel]);

  // Start monitoring
  useEffect(() => {
    let animationFrame: number;
    
    const monitor = () => {
      measureFPS();
      animationFrame = requestAnimationFrame(monitor);
    };
    
    animationFrame = requestAnimationFrame(monitor);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [measureFPS]);

  return {
    metrics,
    qualitySettings: getQualitySettings(),
    suggestions: getOptimizationSuggestions(),
    isPerformant: metrics.fps >= targetFPS * 0.9,
  };
}