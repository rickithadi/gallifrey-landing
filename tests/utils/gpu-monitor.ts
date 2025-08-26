/**
 * GPU Performance Monitor for WebGL/Three.js applications
 */
export interface WebGLContextInfo {
  vendor: string;
  renderer: string;
  version: string;
  shadingLanguageVersion: string;
  maxTextureSize: number;
  maxVertexAttribs: number;
  maxVertexUniformVectors: number;
  maxFragmentUniformVectors: number;
  maxRenderBufferSize: number;
  maxViewportDims: [number, number];
  extensions: string[];
}

export interface DrawCallInfo {
  timestamp: number;
  calls: number;
  triangles: number;
  lines: number;
  points: number;
}

export interface GPUMemoryInfo {
  timestamp: number;
  totalAvailable?: number;
  currentAvailable?: number;
  used?: number;
  percentage?: number;
}

export interface WebGLPerformanceMetrics {
  contextInfo: WebGLContextInfo;
  drawCalls: DrawCallInfo[];
  frameInfo: Array<{
    timestamp: number;
    drawCalls: number;
    triangles: number;
    shaderSwitches: number;
    textureBindings: number;
  }>;
  memoryInfo: GPUMemoryInfo[];
  errors: Array<{
    timestamp: number;
    error: string;
    description: string;
  }>;
  contextLostEvents: number;
  averageDrawCalls: number;
  peakDrawCalls: number;
  efficiency: number;
}

export class GPUMonitor {
  private gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  private isMonitoring = false;
  private contextInfo: WebGLContextInfo | null = null;
  private drawCallHistory: DrawCallInfo[] = [];
  private frameHistory: Array<{
    timestamp: number;
    drawCalls: number;
    triangles: number;
    shaderSwitches: number;
    textureBindings: number;
  }> = [];
  private memoryHistory: GPUMemoryInfo[] = [];
  private errorHistory: Array<{
    timestamp: number;
    error: string;
    description: string;
  }> = [];
  private contextLostEvents = 0;
  
  private readonly maxHistoryLength = 300; // 5 minutes at 1Hz
  private monitoringInterval?: number;
  private callbacks: Array<(metrics: Partial<WebGLPerformanceMetrics>) => void> = [];
  
  // Draw call tracking
  private currentFrameDrawCalls = 0;
  private currentFrameTriangles = 0;
  private currentFrameShaderSwitches = 0;
  private currentFrameTextureBindings = 0;
  
  // WebGL method proxies for tracking
  private originalDrawArrays?: typeof WebGLRenderingContext.prototype.drawArrays;
  private originalDrawElements?: typeof WebGLRenderingContext.prototype.drawElements;
  private originalUseProgram?: typeof WebGLRenderingContext.prototype.useProgram;
  private originalBindTexture?: typeof WebGLRenderingContext.prototype.bindTexture;
  
  constructor() {
    this.bindToWindow();
  }
  
  /**
   * Bind GPU monitor to window for global access
   */
  private bindToWindow(): void {
    if (typeof window !== 'undefined') {
      (window as any).gpuMonitor = this;
    }
  }
  
  /**
   * Initialize monitoring with a WebGL context
   */
  initialize(canvas?: HTMLCanvasElement): boolean {
    if (!canvas) {
      canvas = document.querySelector('canvas') as HTMLCanvasElement;
    }
    
    if (!canvas) {
      console.warn('No canvas element found for GPU monitoring');
      return false;
    }
    
    // Get WebGL context
    this.gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!this.gl) {
      console.warn('WebGL not supported');
      return false;
    }
    
    // Gather context information
    this.gatherContextInfo();
    
    // Set up context lost/restored listeners
    this.setupContextListeners(canvas);
    
    // Patch WebGL methods for tracking
    this.patchWebGLMethods();
    
    return true;
  }
  
  /**
   * Gather WebGL context information
   */
  private gatherContextInfo(): void {
    if (!this.gl) return;
    
    const debugInfo = this.gl.getExtension('WEBGL_debug_renderer_info');
    
    this.contextInfo = {
      vendor: debugInfo ? this.gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown',
      renderer: debugInfo ? this.gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown',
      version: this.gl.getParameter(this.gl.VERSION),
      shadingLanguageVersion: this.gl.getParameter(this.gl.SHADING_LANGUAGE_VERSION),
      maxTextureSize: this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE),
      maxVertexAttribs: this.gl.getParameter(this.gl.MAX_VERTEX_ATTRIBS),
      maxVertexUniformVectors: this.gl.getParameter(this.gl.MAX_VERTEX_UNIFORM_VECTORS),
      maxFragmentUniformVectors: this.gl.getParameter(this.gl.MAX_FRAGMENT_UNIFORM_VECTORS),
      maxRenderBufferSize: this.gl.getParameter(this.gl.MAX_RENDERBUFFER_SIZE),
      maxViewportDims: this.gl.getParameter(this.gl.MAX_VIEWPORT_DIMS),
      extensions: this.gl.getSupportedExtensions() || []
    };
  }
  
  /**
   * Set up WebGL context lost/restored event listeners
   */
  private setupContextListeners(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('webglcontextlost', (event) => {
      this.contextLostEvents++;
      this.errorHistory.push({
        timestamp: performance.now(),
        error: 'CONTEXT_LOST',
        description: 'WebGL context was lost'
      });
    });
    
    canvas.addEventListener('webglcontextrestored', (event) => {
      this.errorHistory.push({
        timestamp: performance.now(),
        error: 'CONTEXT_RESTORED',
        description: 'WebGL context was restored'
      });
      
      // Re-gather context info after restoration
      setTimeout(() => this.gatherContextInfo(), 100);
    });
  }
  
  /**
   * Patch WebGL methods to track draw calls and state changes
   */
  private patchWebGLMethods(): void {
    if (!this.gl) return;
    
    const gl = this.gl;
    
    // Track drawArrays calls
    this.originalDrawArrays = gl.drawArrays;
    gl.drawArrays = (mode: number, first: number, count: number) => {
      this.currentFrameDrawCalls++;
      this.currentFrameTriangles += this.calculateTriangleCount(mode, count);
      return this.originalDrawArrays!.call(gl, mode, first, count);
    };
    
    // Track drawElements calls
    this.originalDrawElements = gl.drawElements;
    gl.drawElements = (mode: number, count: number, type: number, offset: number) => {
      this.currentFrameDrawCalls++;
      this.currentFrameTriangles += this.calculateTriangleCount(mode, count);
      return this.originalDrawElements!.call(gl, mode, count, type, offset);
    };
    
    // Track shader program changes
    this.originalUseProgram = gl.useProgram;
    gl.useProgram = (program: WebGLProgram | null) => {
      this.currentFrameShaderSwitches++;
      return this.originalUseProgram!.call(gl, program);
    };
    
    // Track texture binding
    this.originalBindTexture = gl.bindTexture;
    gl.bindTexture = (target: number, texture: WebGLTexture | null) => {
      this.currentFrameTextureBindings++;
      return this.originalBindTexture!.call(gl, target, texture);
    };
  }
  
  /**
   * Calculate triangle count based on primitive mode and vertex count
   */
  private calculateTriangleCount(mode: number, count: number): number {
    if (!this.gl) return 0;
    
    switch (mode) {
      case this.gl.TRIANGLES:
        return Math.floor(count / 3);
      case this.gl.TRIANGLE_STRIP:
      case this.gl.TRIANGLE_FAN:
        return Math.max(0, count - 2);
      default:
        return 0;
    }
  }
  
  /**
   * Start GPU performance monitoring
   */
  start(): void {
    if (this.isMonitoring) return;
    
    if (!this.gl) {
      const initialized = this.initialize();
      if (!initialized) {
        console.warn('Failed to initialize GPU monitoring');
        return;
      }
    }
    
    this.isMonitoring = true;
    this.resetFrameCounters();
    
    // Start periodic monitoring
    this.monitoringInterval = window.setInterval(() => {
      this.recordFrameMetrics();
      this.checkForErrors();
      this.measureGPUMemory();
    }, 1000);
    
    // Use requestAnimationFrame to track per-frame metrics
    this.trackFrameMetrics();
  }
  
  /**
   * Stop GPU performance monitoring
   */
  stop(): void {
    this.isMonitoring = false;
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
    
    this.restoreWebGLMethods();
  }
  
  /**
   * Add callback for GPU metrics updates
   */
  onUpdate(callback: (metrics: Partial<WebGLPerformanceMetrics>) => void): void {
    this.callbacks.push(callback);
  }
  
  /**
   * Remove callback
   */
  removeCallback(callback: (metrics: Partial<WebGLPerformanceMetrics>) => void): void {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }
  
  /**
   * Track frame-by-frame metrics
   */
  private trackFrameMetrics(): void {
    if (!this.isMonitoring) return;
    
    // Record current frame metrics
    this.frameHistory.push({
      timestamp: performance.now(),
      drawCalls: this.currentFrameDrawCalls,
      triangles: this.currentFrameTriangles,
      shaderSwitches: this.currentFrameShaderSwitches,
      textureBindings: this.currentFrameTextureBindings
    });
    
    // Maintain history length
    if (this.frameHistory.length > this.maxHistoryLength) {
      this.frameHistory.shift();
    }
    
    // Reset frame counters
    this.resetFrameCounters();
    
    // Continue tracking
    requestAnimationFrame(() => this.trackFrameMetrics());
  }
  
  /**
   * Reset per-frame counters
   */
  private resetFrameCounters(): void {
    this.currentFrameDrawCalls = 0;
    this.currentFrameTriangles = 0;
    this.currentFrameShaderSwitches = 0;
    this.currentFrameTextureBindings = 0;
  }
  
  /**
   * Record frame metrics for analysis
   */
  private recordFrameMetrics(): void {
    const recent = this.frameHistory.slice(-60); // Last 60 frames (1 second at 60fps)
    
    if (recent.length === 0) return;
    
    const totalDrawCalls = recent.reduce((sum, frame) => sum + frame.drawCalls, 0);
    const totalTriangles = recent.reduce((sum, frame) => sum + frame.triangles, 0);
    const avgDrawCalls = totalDrawCalls / recent.length;
    const avgTriangles = totalTriangles / recent.length;
    
    this.drawCallHistory.push({
      timestamp: performance.now(),
      calls: avgDrawCalls,
      triangles: avgTriangles,
      lines: 0, // Not tracked separately
      points: 0  // Not tracked separately
    });
    
    // Maintain history length
    if (this.drawCallHistory.length > this.maxHistoryLength) {
      this.drawCallHistory.shift();
    }
    
    // Notify callbacks
    this.callbacks.forEach(callback => {
      callback({
        drawCalls: this.drawCallHistory,
        frameInfo: this.frameHistory.slice(-10), // Last 10 frames
        averageDrawCalls: avgDrawCalls,
        peakDrawCalls: Math.max(...recent.map(f => f.drawCalls))
      });
    });
  }
  
  /**
   * Check for WebGL errors
   */
  private checkForErrors(): void {
    if (!this.gl) return;
    
    const error = this.gl.getError();
    if (error !== this.gl.NO_ERROR) {
      let description = 'Unknown WebGL error';
      
      switch (error) {
        case this.gl.INVALID_ENUM:
          description = 'Invalid enum parameter';
          break;
        case this.gl.INVALID_VALUE:
          description = 'Invalid value parameter';
          break;
        case this.gl.INVALID_OPERATION:
          description = 'Invalid operation';
          break;
        case this.gl.OUT_OF_MEMORY:
          description = 'Out of memory';
          break;
        case this.gl.CONTEXT_LOST_WEBGL:
          description = 'WebGL context lost';
          break;
      }
      
      this.errorHistory.push({
        timestamp: performance.now(),
        error: `GL_ERROR_${error}`,
        description
      });
    }
  }
  
  /**
   * Measure GPU memory usage (if extension is available)
   */
  private measureGPUMemory(): void {
    if (!this.gl) return;
    
    // Try to get memory info from WebGL extensions
    const memoryExt = this.gl.getExtension('WEBGL_debug_renderer_info');
    
    // Most browsers don't expose actual GPU memory usage for security reasons
    // We can only estimate based on WebGL resource usage
    const memoryInfo: GPUMemoryInfo = {
      timestamp: performance.now(),
      // These would be populated if the extension provided the info
      totalAvailable: undefined,
      currentAvailable: undefined,
      used: undefined,
      percentage: undefined
    };
    
    this.memoryHistory.push(memoryInfo);
    
    // Maintain history length
    if (this.memoryHistory.length > this.maxHistoryLength) {
      this.memoryHistory.shift();
    }
  }
  
  /**
   * Restore original WebGL methods
   */
  private restoreWebGLMethods(): void {
    if (!this.gl) return;
    
    if (this.originalDrawArrays) {
      this.gl.drawArrays = this.originalDrawArrays;
    }
    
    if (this.originalDrawElements) {
      this.gl.drawElements = this.originalDrawElements;
    }
    
    if (this.originalUseProgram) {
      this.gl.useProgram = this.originalUseProgram;
    }
    
    if (this.originalBindTexture) {
      this.gl.bindTexture = this.originalBindTexture;
    }
  }
  
  /**
   * Get comprehensive GPU performance metrics
   */
  getMetrics(): WebGLPerformanceMetrics {
    const recentDrawCalls = this.drawCallHistory.slice(-60); // Last minute
    const averageDrawCalls = recentDrawCalls.length > 0 
      ? recentDrawCalls.reduce((sum, dc) => sum + dc.calls, 0) / recentDrawCalls.length 
      : 0;
    const peakDrawCalls = recentDrawCalls.length > 0 
      ? Math.max(...recentDrawCalls.map(dc => dc.calls)) 
      : 0;
    
    // Calculate efficiency score (0-100)
    let efficiency = 100;
    
    // Penalize high draw calls
    if (averageDrawCalls > 1000) efficiency -= 40;
    else if (averageDrawCalls > 500) efficiency -= 20;
    else if (averageDrawCalls > 200) efficiency -= 10;
    
    // Penalize errors
    if (this.errorHistory.length > 0) efficiency -= 20;
    
    // Penalize context lost events
    if (this.contextLostEvents > 0) efficiency -= 30;
    
    return {
      contextInfo: this.contextInfo || {} as WebGLContextInfo,
      drawCalls: [...this.drawCallHistory],
      frameInfo: [...this.frameHistory],
      memoryInfo: [...this.memoryHistory],
      errors: [...this.errorHistory],
      contextLostEvents: this.contextLostEvents,
      averageDrawCalls,
      peakDrawCalls,
      efficiency: Math.max(0, efficiency)
    };
  }
  
  /**
   * Get current frame statistics
   */
  getCurrentFrameStats(): {
    drawCalls: number;
    triangles: number;
    shaderSwitches: number;
    textureBindings: number;
  } {
    return {
      drawCalls: this.currentFrameDrawCalls,
      triangles: this.currentFrameTriangles,
      shaderSwitches: this.currentFrameShaderSwitches,
      textureBindings: this.currentFrameTextureBindings
    };
  }
  
  /**
   * Get WebGL capabilities and limits
   */
  getCapabilities(): WebGLContextInfo | null {
    return this.contextInfo;
  }
  
  /**
   * Check if GPU monitoring is supported
   */
  isSupported(): boolean {
    return typeof window !== 'undefined' && 
           'WebGLRenderingContext' in window;
  }
  
  /**
   * Reset all monitoring data
   */
  reset(): void {
    this.drawCallHistory = [];
    this.frameHistory = [];
    this.memoryHistory = [];
    this.errorHistory = [];
    this.contextLostEvents = 0;
    this.resetFrameCounters();
  }
  
  /**
   * Export monitoring data
   */
  exportData(): {
    timestamp: string;
    duration: number;
    metrics: WebGLPerformanceMetrics;
    summary: {
      averageDrawCalls: number;
      peakDrawCalls: number;
      totalErrors: number;
      efficiency: number;
    };
  } {
    const metrics = this.getMetrics();
    const duration = this.drawCallHistory.length > 1 
      ? this.drawCallHistory[this.drawCallHistory.length - 1].timestamp - this.drawCallHistory[0].timestamp
      : 0;
    
    return {
      timestamp: new Date().toISOString(),
      duration,
      metrics,
      summary: {
        averageDrawCalls: metrics.averageDrawCalls,
        peakDrawCalls: metrics.peakDrawCalls,
        totalErrors: metrics.errors.length,
        efficiency: metrics.efficiency
      }
    };
  }
}

/**
 * Factory function to create and auto-start GPU monitor
 */
export function createGPUMonitor(autoStart = true): GPUMonitor {
  const monitor = new GPUMonitor();
  if (autoStart) {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => monitor.start());
    } else {
      monitor.start();
    }
  }
  return monitor;
}

/**
 * Global GPU monitor instance for easy access
 */
export const globalGPUMonitor = new GPUMonitor();