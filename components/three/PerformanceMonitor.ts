import * as THREE from 'three';

export interface DeviceCapabilities {
  isHighPerformance: boolean;
  isMobile: boolean;
  hasWebGL2: boolean;
  maxTextureSize: number;
  maxFragmentUniforms: number;
  maxVertexUniforms: number;
  maxRenderBufferSize: number;
  gpuTier: 'low' | 'medium' | 'high' | 'ultra';
  estimatedVRAM: number; // in MB
}

export interface PerformanceMetrics {
  fps: number;
  averageFPS: number;
  frameTime: number;
  memoryUsage: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
}

export interface QualitySettings {
  particleCount: number;
  connectionLines: boolean;
  animationComplexity: 'low' | 'medium' | 'high';
  renderScale: number;
  shadowsEnabled: boolean;
  antialiasing: boolean;
  particleSize: number;
  maxConnections: number;
}

export class PerformanceMonitor {
  private renderer: THREE.WebGLRenderer | null = null;
  private frameCount = 0;
  private lastTime = performance.now();
  private fpsHistory: number[] = [];
  private maxHistoryLength = 60; // 60 samples for 1-second average at 60fps
  private capabilities: DeviceCapabilities | null = null;
  private currentQuality: QualitySettings;
  private targetFPS = 60;
  private minFPS = 30;
  private adaptiveQualityEnabled = true;
  private lastQualityCheck = 0;
  private qualityCheckInterval = 1000; // Check every second

  constructor() {
    this.currentQuality = this.getDefaultQuality();
    this.detectCapabilities();
  }

  public setRenderer(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.detectCapabilities();
  }

  private detectCapabilities(): void {
    if (typeof window === 'undefined') return;

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) {
      this.capabilities = {
        isHighPerformance: false,
        isMobile: true,
        hasWebGL2: false,
        maxTextureSize: 1024,
        maxFragmentUniforms: 16,
        maxVertexUniforms: 128,
        maxRenderBufferSize: 1024,
        gpuTier: 'low',
        estimatedVRAM: 128
      };
      return;
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                    window.innerWidth < 768;

    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const maxFragmentUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
    const maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
    const maxRenderBufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);

    // Estimate GPU tier based on capabilities
    let gpuTier: 'low' | 'medium' | 'high' | 'ultra' = 'low';
    let estimatedVRAM = 128;

    if (maxTextureSize >= 16384 && !isMobile) {
      gpuTier = 'ultra';
      estimatedVRAM = 8192;
    } else if (maxTextureSize >= 8192 && !isMobile) {
      gpuTier = 'high';
      estimatedVRAM = 4096;
    } else if (maxTextureSize >= 4096) {
      gpuTier = 'medium';
      estimatedVRAM = 1024;
    } else {
      gpuTier = 'low';
      estimatedVRAM = 256;
    }

    // Additional mobile adjustments
    if (isMobile) {
      gpuTier = gpuTier === 'ultra' ? 'high' : gpuTier === 'high' ? 'medium' : 'low';
      estimatedVRAM = Math.min(estimatedVRAM, 2048);
    }

    this.capabilities = {
      isHighPerformance: !isMobile && gpuTier !== 'low',
      isMobile,
      hasWebGL2: !!canvas.getContext('webgl2'),
      maxTextureSize,
      maxFragmentUniforms,
      maxVertexUniforms,
      maxRenderBufferSize,
      gpuTier,
      estimatedVRAM
    };

    // Set initial quality based on capabilities
    this.currentQuality = this.getQualityForTier(gpuTier);
  }

  public getCapabilities(): DeviceCapabilities | null {
    return this.capabilities;
  }

  public updateMetrics(): PerformanceMetrics {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    if (deltaTime >= 16.67) { // ~60fps threshold
      this.frameCount++;
      const fps = 1000 / deltaTime;
      
      this.fpsHistory.push(fps);
      if (this.fpsHistory.length > this.maxHistoryLength) {
        this.fpsHistory.shift();
      }
      
      this.lastTime = currentTime;

      // Adaptive quality adjustment
      if (this.adaptiveQualityEnabled && currentTime - this.lastQualityCheck > this.qualityCheckInterval) {
        this.adjustQuality();
        this.lastQualityCheck = currentTime;
      }
    }

    const averageFPS = this.fpsHistory.length > 0 
      ? this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length
      : 60;

    const metrics: PerformanceMetrics = {
      fps: this.fpsHistory.length > 0 ? this.fpsHistory[this.fpsHistory.length - 1] : 60,
      averageFPS,
      frameTime: deltaTime,
      memoryUsage: this.getMemoryUsage(),
      drawCalls: this.renderer?.info.render.calls || 0,
      triangles: this.renderer?.info.render.triangles || 0,
      geometries: this.renderer?.info.memory.geometries || 0,
      textures: this.renderer?.info.memory.textures || 0,
    };

    return metrics;
  }

  private getMemoryUsage(): number {
    // @ts-expect-error - performance.memory is non-standard but widely supported
    if ('memory' in performance) {
      // @ts-expect-error - performance.memory API is non-standard but widely supported
      return performance.memory.usedJSHeapSize / (1024 * 1024); // MB
    }
    return 0;
  }

  private adjustQuality(): void {
    if (!this.capabilities) return;

    const averageFPS = this.fpsHistory.length > 0 
      ? this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length
      : 60;

    if (averageFPS < this.minFPS) {
      // Reduce quality
      this.reduceQuality();
    } else if (averageFPS > this.targetFPS && this.canIncreaseQuality()) {
      // Increase quality if we have headroom
      this.increaseQuality();
    }
  }

  private reduceQuality(): void {
    const current = this.currentQuality;
    
    // Progressive quality reduction
    if (current.connectionLines) {
      current.connectionLines = false;
    } else if (current.particleCount > 20) {
      current.particleCount = Math.max(20, Math.floor(current.particleCount * 0.75));
    } else if (current.renderScale > 0.5) {
      current.renderScale = Math.max(0.5, current.renderScale - 0.1);
    } else if (current.animationComplexity !== 'low') {
      current.animationComplexity = current.animationComplexity === 'high' ? 'medium' : 'low';
    }
  }

  private increaseQuality(): void {
    if (!this.capabilities) return;
    
    const current = this.currentQuality;
    const maxQuality = this.getQualityForTier(this.capabilities.gpuTier);
    
    // Progressive quality increase
    if (current.animationComplexity !== maxQuality.animationComplexity) {
      current.animationComplexity = current.animationComplexity === 'low' ? 'medium' : 'high';
    } else if (current.renderScale < maxQuality.renderScale) {
      current.renderScale = Math.min(maxQuality.renderScale, current.renderScale + 0.1);
    } else if (current.particleCount < maxQuality.particleCount) {
      current.particleCount = Math.min(maxQuality.particleCount, Math.floor(current.particleCount * 1.25));
    } else if (!current.connectionLines && maxQuality.connectionLines) {
      current.connectionLines = true;
    }
  }

  private canIncreaseQuality(): boolean {
    if (!this.capabilities) return false;
    
    const current = this.currentQuality;
    const maxQuality = this.getQualityForTier(this.capabilities.gpuTier);
    
    return (
      current.particleCount < maxQuality.particleCount ||
      current.renderScale < maxQuality.renderScale ||
      current.animationComplexity !== maxQuality.animationComplexity ||
      (!current.connectionLines && maxQuality.connectionLines)
    );
  }

  private getDefaultQuality(): QualitySettings {
    return {
      particleCount: 50,
      connectionLines: false,
      animationComplexity: 'medium',
      renderScale: 1.0,
      shadowsEnabled: false,
      antialiasing: true,
      particleSize: 0.02,
      maxConnections: 100
    };
  }

  private getQualityForTier(tier: 'low' | 'medium' | 'high' | 'ultra'): QualitySettings {
    switch (tier) {
      case 'ultra':
        return {
          particleCount: 300,
          connectionLines: true,
          animationComplexity: 'high',
          renderScale: 1.0,
          shadowsEnabled: true,
          antialiasing: true,
          particleSize: 0.03,
          maxConnections: 500
        };
      case 'high':
        return {
          particleCount: 200,
          connectionLines: true,
          animationComplexity: 'high',
          renderScale: 1.0,
          shadowsEnabled: false,
          antialiasing: true,
          particleSize: 0.025,
          maxConnections: 300
        };
      case 'medium':
        return {
          particleCount: 100,
          connectionLines: true,
          animationComplexity: 'medium',
          renderScale: 1.0,
          shadowsEnabled: false,
          antialiasing: true,
          particleSize: 0.02,
          maxConnections: 200
        };
      case 'low':
      default:
        return {
          particleCount: 30,
          connectionLines: false,
          animationComplexity: 'low',
          renderScale: 0.8,
          shadowsEnabled: false,
          antialiasing: false,
          particleSize: 0.015,
          maxConnections: 50
        };
    }
  }

  public getCurrentQuality(): QualitySettings {
    return { ...this.currentQuality };
  }

  public setQuality(quality: Partial<QualitySettings>): void {
    this.currentQuality = { ...this.currentQuality, ...quality };
  }

  public enableAdaptiveQuality(enabled: boolean = true): void {
    this.adaptiveQualityEnabled = enabled;
  }

  public getPerformanceScore(): number {
    const averageFPS = this.fpsHistory.length > 0 
      ? this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length
      : 60;
    
    // Score from 0-100 based on FPS performance
    return Math.min(100, Math.max(0, (averageFPS / this.targetFPS) * 100));
  }

  public dispose(): void {
    this.fpsHistory = [];
    this.renderer = null;
  }
}

// Singleton instance for global access
export const performanceMonitor = new PerformanceMonitor();