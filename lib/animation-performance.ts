/**
 * Animation Performance Monitoring & Optimization
 * Comprehensive performance tracking for hero animations
 */

import React from 'react';

interface NavigatorDeviceMemory extends Navigator {
  deviceMemory?: number;
}

export interface AnimationMetrics {
  frameRate: number;
  averageFrameTime: number;
  frameDrops: number;
  memoryUsage: number;
  renderTime: number;
  interactionLatency: number;
  animationComplexity: number;
  deviceCapabilities: DeviceCapabilities;
  timestamp: number;
}

export interface DeviceCapabilities {
  tier: 'low' | 'medium' | 'high' | 'ultra';
  hardwareConcurrency: number;
  deviceMemory: number;
  screenResolution: { width: number; height: number };
  devicePixelRatio: number;
  gpu: string;
  isMobile: boolean;
  supportsWebGL2: boolean;
  maxTextureSize: number;
}

export interface PerformanceBudget {
  targetFPS: number;
  maxFrameTime: number;
  maxMemoryUsage: number;
  maxRenderTime: number;
  maxInteractionLatency: number;
}

export class AnimationPerformanceMonitor {
  private metrics: AnimationMetrics[] = [];
  private frameTimestamps: number[] = [];
  private lastFrameTime = performance.now();
  private frameCount = 0;
  private isMonitoring = false;
  private animationFrameId: number | null = null;

  private budget: PerformanceBudget = {
    targetFPS: 60,
    maxFrameTime: 16.67, // 60fps = 16.67ms per frame
    maxMemoryUsage: 50, // MB
    maxRenderTime: 10, // ms
    maxInteractionLatency: 100, // ms
  };

  constructor() {
    this.detectDeviceCapabilities();
  }

  private detectDeviceCapabilities(): DeviceCapabilities {
    if (typeof window === 'undefined') {
      return {
        tier: 'medium',
        hardwareConcurrency: 4,
        deviceMemory: 4,
        screenResolution: { width: 1920, height: 1080 },
        devicePixelRatio: 1,
        gpu: 'unknown',
        isMobile: false,
        supportsWebGL2: false,
        maxTextureSize: 2048,
      };
    }

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    const capabilities: DeviceCapabilities = {
      tier: 'medium',
      hardwareConcurrency: navigator.hardwareConcurrency || 4,
      deviceMemory: (navigator as NavigatorDeviceMemory).deviceMemory || 4,
      screenResolution: {
        width: window.screen.width,
        height: window.screen.height,
      },
      devicePixelRatio: window.devicePixelRatio || 1,
      gpu: this.getGPUInfo(gl),
      isMobile: window.innerWidth < 768,
      supportsWebGL2: !!canvas.getContext('webgl2'),
      maxTextureSize: gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 2048,
    };

    // Calculate device tier based on capabilities
    capabilities.tier = this.calculateDeviceTier(capabilities);

    return capabilities;
  }

  private getGPUInfo(gl: WebGLRenderingContext | WebGL2RenderingContext | null): string {
    if (!gl) return 'unknown';
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'unknown';
    }
    
    return 'unknown';
  }

  private calculateDeviceTier(capabilities: DeviceCapabilities): 'low' | 'medium' | 'high' | 'ultra' {
    let score = 0;
    
    // CPU score
    if (capabilities.hardwareConcurrency >= 8) score += 3;
    else if (capabilities.hardwareConcurrency >= 4) score += 2;
    else score += 1;
    
    // Memory score
    if (capabilities.deviceMemory >= 8) score += 3;
    else if (capabilities.deviceMemory >= 4) score += 2;
    else score += 1;
    
    // Screen resolution score
    const pixelCount = capabilities.screenResolution.width * capabilities.screenResolution.height;
    if (pixelCount >= 3840 * 2160) score += 3; // 4K+
    else if (pixelCount >= 1920 * 1080) score += 2; // 1080p+
    else score += 1;
    
    // WebGL2 support
    if (capabilities.supportsWebGL2) score += 1;
    
    // Mobile penalty
    if (capabilities.isMobile) score -= 2;
    
    if (score >= 10) return 'ultra';
    if (score >= 7) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  }

  public startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.frameCount = 0;
    this.frameTimestamps = [];
    this.lastFrameTime = performance.now();
    
    this.monitorFrame();
  }

  public stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private monitorFrame = (): void => {
    if (!this.isMonitoring) return;

    const now = performance.now();
    
    this.frameTimestamps.push(now);
    this.frameCount++;
    this.lastFrameTime = now;
    
    // Keep only last 60 frames for FPS calculation
    if (this.frameTimestamps.length > 60) {
      this.frameTimestamps.shift();
    }
    
    // Calculate metrics every 60 frames
    if (this.frameCount % 60 === 0) {
      this.recordMetrics();
    }
    
    this.animationFrameId = requestAnimationFrame(this.monitorFrame);
  };

  private recordMetrics(): void {
    const now = performance.now();
    const frameCount = this.frameTimestamps.length;
    
    if (frameCount < 2) return;
    
    const timeSpan = this.frameTimestamps[frameCount - 1] - this.frameTimestamps[0];
    const fps = (frameCount - 1) * 1000 / timeSpan;
    
    const frameTimes = [];
    for (let i = 1; i < this.frameTimestamps.length; i++) {
      frameTimes.push(this.frameTimestamps[i] - this.frameTimestamps[i - 1]);
    }
    
    const averageFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    const frameDrops = frameTimes.filter(time => time > this.budget.maxFrameTime).length;
    
    const metrics: AnimationMetrics = {
      frameRate: Math.round(fps),
      averageFrameTime: Math.round(averageFrameTime * 100) / 100,
      frameDrops,
      memoryUsage: this.getMemoryUsage(),
      renderTime: this.getRenderTime(),
      interactionLatency: this.getInteractionLatency(),
      animationComplexity: this.getAnimationComplexity(),
      deviceCapabilities: this.detectDeviceCapabilities(),
      timestamp: now,
    };
    
    this.metrics.push(metrics);
    
    // Keep only last 100 metric records
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }
    
    // Check for performance budget violations
    this.checkPerformanceBudget(metrics);
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      // performance.memory is non-standard but widely supported
      const memory = (performance as Performance & { memory: { usedJSHeapSize: number } }).memory;
      return Math.round(memory.usedJSHeapSize / (1024 * 1024)); // MB
    }
    return 0;
  }

  private getRenderTime(): number {
    // This would need to be integrated with Three.js renderer
    // For now, return estimated value based on frame time
    const lastMetrics = this.metrics[this.metrics.length - 1];
    return lastMetrics ? lastMetrics.averageFrameTime * 0.7 : 0;
  }

  private getInteractionLatency(): number {
    // This would need to be measured from actual interactions
    // For now, return estimated value
    return 50; // Placeholder
  }

  private getAnimationComplexity(): number {
    // Calculate based on active animations, particle count, etc.
    // This would be integrated with the animation system
    return 0.5; // Placeholder (0-1 scale)
  }

  private checkPerformanceBudget(metrics: AnimationMetrics): void {
    const violations = [];
    
    if (metrics.frameRate < this.budget.targetFPS) {
      violations.push(`FPS below target: ${metrics.frameRate} < ${this.budget.targetFPS}`);
    }
    
    if (metrics.averageFrameTime > this.budget.maxFrameTime) {
      violations.push(`Frame time exceeded: ${metrics.averageFrameTime}ms > ${this.budget.maxFrameTime}ms`);
    }
    
    if (metrics.memoryUsage > this.budget.maxMemoryUsage) {
      violations.push(`Memory usage exceeded: ${metrics.memoryUsage}MB > ${this.budget.maxMemoryUsage}MB`);
    }
    
    if (violations.length > 0) {
      console.warn('Performance budget violations:', violations);
      this.adjustAnimationQuality(metrics);
    }
  }

  private adjustAnimationQuality(metrics: AnimationMetrics): void {
    // Emit event for animation quality adjustment
    window.dispatchEvent(new CustomEvent('animation-quality-adjust', {
      detail: {
        metrics,
        recommendation: this.getQualityRecommendation(metrics),
      },
    }));
  }

  private getQualityRecommendation(metrics: AnimationMetrics): string {
    if (metrics.frameRate < 30) return 'reduce-particles';
    if (metrics.memoryUsage > 40) return 'reduce-effects';
    if (metrics.frameDrops > 10) return 'reduce-complexity';
    return 'maintain';
  }

  public getLatestMetrics(): AnimationMetrics | null {
    return this.metrics[this.metrics.length - 1] || null;
  }

  public getPerformanceReport(): {
    average: Partial<AnimationMetrics>;
    peak: Partial<AnimationMetrics>;
    violations: string[];
    recommendations: string[];
  } {
    if (this.metrics.length === 0) {
      return {
        average: {},
        peak: {},
        violations: [],
        recommendations: [],
      };
    }

    const average = {
      frameRate: Math.round(this.metrics.reduce((sum, m) => sum + m.frameRate, 0) / this.metrics.length),
      averageFrameTime: Math.round(this.metrics.reduce((sum, m) => sum + m.averageFrameTime, 0) / this.metrics.length * 100) / 100,
      memoryUsage: Math.round(this.metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / this.metrics.length),
    };

    const peak = {
      frameRate: Math.max(...this.metrics.map(m => m.frameRate)),
      averageFrameTime: Math.max(...this.metrics.map(m => m.averageFrameTime)),
      memoryUsage: Math.max(...this.metrics.map(m => m.memoryUsage)),
    };

    return {
      average,
      peak,
      violations: [], // Would be populated based on budget checks
      recommendations: [], // Would be populated based on analysis
    };
  }

  public setBudget(budget: Partial<PerformanceBudget>): void {
    this.budget = { ...this.budget, ...budget };
  }
}

// Singleton instance
export const animationPerformanceMonitor = new AnimationPerformanceMonitor();

// React hook for using performance monitoring
export function useAnimationPerformance() {
  const [metrics, setMetrics] = React.useState<AnimationMetrics | null>(null);
  const [isMonitoring, setIsMonitoring] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const latestMetrics = animationPerformanceMonitor.getLatestMetrics();
      if (latestMetrics) {
        setMetrics(latestMetrics);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startMonitoring = React.useCallback(() => {
    animationPerformanceMonitor.startMonitoring();
    setIsMonitoring(true);
  }, []);

  const stopMonitoring = React.useCallback(() => {
    animationPerformanceMonitor.stopMonitoring();
    setIsMonitoring(false);
  }, []);

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    getReport: animationPerformanceMonitor.getPerformanceReport.bind(animationPerformanceMonitor),
  };
}