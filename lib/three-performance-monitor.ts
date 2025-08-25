/**
 * Unified Three.js Performance Monitor
 * Provides comprehensive performance monitoring and adaptive quality management
 * for Three.js scenes with real-time optimization capabilities
 */

import * as THREE from 'three';

export interface ThreePerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  shaderMaterials: number;
  instances: number;
  renderTargets: number;
}

export interface QualitySettings {
  particleCount: number;
  geometryDetail: 'low' | 'medium' | 'high';
  shadowMapSize: number;
  enableTrails: boolean;
  enableGlow: boolean;
  enableFlocking: boolean;
  enableAurora: boolean;
  enableLightRays: boolean;
  updateFrequency: number;
  trailLength: number;
  maxNeighbors: number;
  performanceLevel: number; // 0.0 to 1.0
}

export interface PerformanceBudget {
  targetFPS: number;
  maxFrameTime: number;
  maxMemoryUsage: number;
  maxDrawCalls: number;
  maxTriangles: number;
}

export class ThreePerformanceMonitor {
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private frameCount = 0;
  private lastTime = performance.now();
  private frameHistory: number[] = [];
  private memoryHistory: number[] = [];
  private qualityHistory: number[] = [];
  private currentQuality: QualitySettings;
  private budget: PerformanceBudget;
  private adaptiveMode = true;
  private degradationSteps = 0;
  private lastAdaptation = 0;
  private stabilityCounter = 0;

  // Performance thresholds
  private readonly ADAPTATION_COOLDOWN = 2000; // 2 seconds
  private readonly STABILITY_THRESHOLD = 60; // 60 frames of stable performance
  private readonly HISTORY_SIZE = 120; // 2 seconds at 60fps

  constructor(budget: Partial<PerformanceBudget> = {}) {
    this.budget = {
      targetFPS: 60,
      maxFrameTime: 16.67,
      maxMemoryUsage: 512, // MB
      maxDrawCalls: 100,
      maxTriangles: 50000,
      ...budget
    };

    this.currentQuality = this.getHighQualitySettings();
  }

  /**
   * Initialize with Three.js renderer and scene
   */
  initialize(renderer: THREE.WebGLRenderer, scene: THREE.Scene): void {
    this.renderer = renderer;
    this.scene = scene;
  }

  /**
   * Update performance metrics - call this every frame
   */
  update(): ThreePerformanceMetrics {
    const now = performance.now();
    const frameTime = now - this.lastTime;
    this.lastTime = now;

    this.frameCount++;
    this.frameHistory.push(frameTime);
    if (this.frameHistory.length > this.HISTORY_SIZE) {
      this.frameHistory.shift();
    }

    const metrics = this.calculateMetrics();
    
    // Check memory usage
    if ('memory' in performance) {
      // performance.memory is non-standard but widely supported
      const memory = (performance as Performance & { memory: { usedJSHeapSize: number } }).memory;
      const memoryMB = memory.usedJSHeapSize / (1024 * 1024);
      this.memoryHistory.push(memoryMB);
      if (this.memoryHistory.length > this.HISTORY_SIZE) {
        this.memoryHistory.shift();
      }
      metrics.memoryUsage = memoryMB;
    }

    // Adaptive quality adjustment
    if (this.adaptiveMode && this.shouldAdapt(metrics)) {
      this.adaptQuality(metrics);
    }

    return metrics;
  }

  /**
   * Calculate comprehensive performance metrics
   */
  private calculateMetrics(): ThreePerformanceMetrics {
    const avgFrameTime = this.frameHistory.reduce((a, b) => a + b, 0) / this.frameHistory.length;
    const fps = 1000 / avgFrameTime;

    const metrics: ThreePerformanceMetrics = {
      fps,
      frameTime: avgFrameTime,
      memoryUsage: this.getAverageMemoryUsage(),
      drawCalls: 0,
      triangles: 0,
      geometries: 0,
      textures: 0,
      shaderMaterials: 0,
      instances: 0,
      renderTargets: 0,
    };

    // Get WebGL renderer info if available
    if (this.renderer) {
      const info = this.renderer.info;
      metrics.drawCalls = info.render.calls;
      metrics.triangles = info.render.triangles;
      metrics.geometries = info.memory.geometries;
      metrics.textures = info.memory.textures;
    }

    // Count scene objects
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object instanceof THREE.InstancedMesh) {
          metrics.instances += object.count;
        }
        const mesh = object as THREE.Mesh;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(mat => {
              if (mat instanceof THREE.ShaderMaterial) {
                metrics.shaderMaterials++;
              }
            });
          } else if (mesh.material instanceof THREE.ShaderMaterial) {
            metrics.shaderMaterials++;
          }
        }
      });
    }

    return metrics;
  }

  /**
   * Determine if quality adaptation is needed
   */
  private shouldAdapt(metrics: ThreePerformanceMetrics): boolean {
    const now = performance.now();
    
    // Cooldown period to prevent rapid changes
    if (now - this.lastAdaptation < this.ADAPTATION_COOLDOWN) {
      return false;
    }

    // Check if performance is outside acceptable range
    const isUnderPerforming = metrics.fps < this.budget.targetFPS * 0.8 ||
                              metrics.frameTime > this.budget.maxFrameTime * 1.2 ||
                              metrics.memoryUsage > this.budget.maxMemoryUsage ||
                              metrics.drawCalls > this.budget.maxDrawCalls;

    const isOverPerforming = metrics.fps > this.budget.targetFPS * 1.1 &&
                             metrics.frameTime < this.budget.maxFrameTime * 0.8 &&
                             this.degradationSteps > 0;

    if (isUnderPerforming || isOverPerforming) {
      this.stabilityCounter = 0;
      return true;
    }

    // Check for stability to potentially improve quality
    this.stabilityCounter++;
    return this.stabilityCounter > this.STABILITY_THRESHOLD && this.degradationSteps > 0;
  }

  /**
   * Adapt quality settings based on performance
   */
  private adaptQuality(metrics: ThreePerformanceMetrics): void {
    const now = performance.now();
    this.lastAdaptation = now;

    if (metrics.fps < this.budget.targetFPS * 0.7) {
      // Emergency performance mode
      this.degradeQuality(2);
    } else if (metrics.fps < this.budget.targetFPS * 0.8) {
      // Gradual degradation
      this.degradeQuality(1);
    } else if (metrics.fps > this.budget.targetFPS * 1.1 && this.degradationSteps > 0) {
      // Improve quality if performance allows
      this.improveQuality();
    }

    this.qualityHistory.push(this.currentQuality.performanceLevel);
    if (this.qualityHistory.length > this.HISTORY_SIZE) {
      this.qualityHistory.shift();
    }
  }

  /**
   * Reduce quality settings to improve performance
   */
  private degradeQuality(steps: number = 1): void {
    for (let i = 0; i < steps; i++) {
      this.degradationSteps++;
      
      if (this.degradationSteps === 1) {
        // First step: Reduce particle effects
        this.currentQuality.enableTrails = false;
        this.currentQuality.enableGlow = false;
        this.currentQuality.updateFrequency = 2;
      } else if (this.degradationSteps === 2) {
        // Second step: Reduce particle count and effects
        this.currentQuality.particleCount = Math.floor(this.currentQuality.particleCount * 0.7);
        this.currentQuality.enableLightRays = false;
        this.currentQuality.enableFlocking = false;
      } else if (this.degradationSteps === 3) {
        // Third step: Reduce geometry detail
        this.currentQuality.geometryDetail = 'medium';
        this.currentQuality.shadowMapSize = 512;
        this.currentQuality.trailLength = Math.floor(this.currentQuality.trailLength * 0.5);
      } else if (this.degradationSteps === 4) {
        // Fourth step: Minimum quality
        this.currentQuality.particleCount = Math.floor(this.currentQuality.particleCount * 0.5);
        this.currentQuality.geometryDetail = 'low';
        this.currentQuality.enableAurora = false;
        this.currentQuality.updateFrequency = 3;
      }
      
      if (this.degradationSteps >= 4) break;
    }

    this.updatePerformanceLevel();
  }

  /**
   * Improve quality settings when performance allows
   */
  private improveQuality(): void {
    if (this.degradationSteps <= 0) return;

    this.degradationSteps--;

    if (this.degradationSteps === 3) {
      // Restore from minimum quality
      this.currentQuality.enableAurora = true;
      this.currentQuality.updateFrequency = 2;
      this.currentQuality.particleCount = Math.floor(this.currentQuality.particleCount * 1.4);
    } else if (this.degradationSteps === 2) {
      // Improve geometry
      this.currentQuality.geometryDetail = 'medium';
      this.currentQuality.shadowMapSize = 1024;
      this.currentQuality.trailLength = Math.floor(this.currentQuality.trailLength * 1.5);
    } else if (this.degradationSteps === 1) {
      // Re-enable effects
      this.currentQuality.enableLightRays = true;
      this.currentQuality.enableFlocking = true;
      this.currentQuality.particleCount = Math.floor(this.currentQuality.particleCount * 1.3);
    } else if (this.degradationSteps === 0) {
      // Full quality
      this.currentQuality = this.getHighQualitySettings();
    }

    this.updatePerformanceLevel();
  }

  /**
   * Update performance level based on current quality
   */
  private updatePerformanceLevel(): void {
    // Calculate performance level based on active features
    let level = 1.0;
    
    if (!this.currentQuality.enableTrails) level -= 0.1;
    if (!this.currentQuality.enableGlow) level -= 0.1;
    if (!this.currentQuality.enableLightRays) level -= 0.15;
    if (!this.currentQuality.enableAurora) level -= 0.2;
    if (!this.currentQuality.enableFlocking) level -= 0.1;
    if (this.currentQuality.geometryDetail === 'medium') level -= 0.15;
    if (this.currentQuality.geometryDetail === 'low') level -= 0.3;
    if (this.currentQuality.updateFrequency > 1) level -= 0.1 * (this.currentQuality.updateFrequency - 1);

    this.currentQuality.performanceLevel = Math.max(0.1, level);
  }

  /**
   * Get high quality settings baseline
   */
  private getHighQualitySettings(): QualitySettings {
    return {
      particleCount: 200,
      geometryDetail: 'high',
      shadowMapSize: 2048,
      enableTrails: true,
      enableGlow: true,
      enableFlocking: true,
      enableAurora: true,
      enableLightRays: true,
      updateFrequency: 1,
      trailLength: 20,
      maxNeighbors: 12,
      performanceLevel: 1.0,
    };
  }

  /**
   * Get average memory usage from history
   */
  private getAverageMemoryUsage(): number {
    if (this.memoryHistory.length === 0) return 0;
    return this.memoryHistory.reduce((a, b) => a + b, 0) / this.memoryHistory.length;
  }

  /**
   * Get current quality settings
   */
  getCurrentQuality(): QualitySettings {
    return { ...this.currentQuality };
  }

  /**
   * Set quality settings manually
   */
  setQuality(quality: Partial<QualitySettings>): void {
    this.currentQuality = { ...this.currentQuality, ...quality };
    this.updatePerformanceLevel();
  }

  /**
   * Enable or disable adaptive mode
   */
  setAdaptiveMode(enabled: boolean): void {
    this.adaptiveMode = enabled;
  }

  /**
   * Get performance score (0-100)
   */
  getPerformanceScore(): number {
    if (this.frameHistory.length === 0) return 100;
    
    const avgFPS = 1000 / (this.frameHistory.reduce((a, b) => a + b, 0) / this.frameHistory.length);
    const fpsScore = Math.min(100, (avgFPS / this.budget.targetFPS) * 100);
    
    const memoryScore = this.budget.maxMemoryUsage > 0 ? 
      Math.max(0, 100 - (this.getAverageMemoryUsage() / this.budget.maxMemoryUsage) * 100) : 100;
    
    return Math.round((fpsScore * 0.7 + memoryScore * 0.3));
  }

  /**
   * Get optimization suggestions
   */
  getOptimizationSuggestions(): string[] {
    const suggestions: string[] = [];
    const metrics = this.calculateMetrics();
    
    if (metrics.fps < this.budget.targetFPS * 0.8) {
      suggestions.push('Consider reducing particle count');
      suggestions.push('Disable expensive effects like trails and glow');
    }
    
    if (metrics.memoryUsage > this.budget.maxMemoryUsage * 0.8) {
      suggestions.push('Implement more aggressive object pooling');
      suggestions.push('Reduce texture sizes and geometry detail');
    }
    
    if (metrics.drawCalls > this.budget.maxDrawCalls * 0.8) {
      suggestions.push('Use more instanced rendering');
      suggestions.push('Batch similar materials together');
    }
    
    if (this.degradationSteps > 2) {
      suggestions.push('Consider upgrading hardware or reducing quality expectations');
    }
    
    return suggestions;
  }

  /**
   * Get debug information
   */
  getDebugInfo(): Record<string, unknown> {
    return {
      frameHistory: this.frameHistory.slice(-10),
      qualityHistory: this.qualityHistory.slice(-10),
      degradationSteps: this.degradationSteps,
      stabilityCounter: this.stabilityCounter,
      adaptiveMode: this.adaptiveMode,
      lastAdaptation: Date.now() - this.lastAdaptation,
    };
  }

  /**
   * Reset monitoring state
   */
  reset(): void {
    this.frameHistory = [];
    this.memoryHistory = [];
    this.qualityHistory = [];
    this.degradationSteps = 0;
    this.stabilityCounter = 0;
    this.currentQuality = this.getHighQualitySettings();
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    this.frameHistory = [];
    this.memoryHistory = [];
    this.qualityHistory = [];
    this.renderer = null;
    this.scene = null;
  }
}

// Singleton instance for global use
export const threePerformanceMonitor = new ThreePerformanceMonitor();

// React hook for performance monitoring
export function useThreePerformanceMonitor() {
  return threePerformanceMonitor;
}