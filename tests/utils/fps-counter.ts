/**
 * Advanced FPS Counter with frame analysis capabilities
 */
export class FPSCounter {
  private frameCount = 0;
  private lastTime = performance.now();
  private fpsHistory: number[] = [];
  private frameTimeHistory: number[] = [];
  private isRunning = false;
  private animationFrame?: number;
  private callbacks: Array<(fps: number, frameTime: number) => void> = [];
  
  // Configuration
  private readonly maxHistoryLength = 60; // Keep 60 samples
  private readonly updateInterval = 1000; // Update every second
  
  // Frame analysis
  private frameDropThreshold = 33.33; // 30 FPS = 33.33ms per frame
  private severeFrameDropThreshold = 50; // 20 FPS = 50ms per frame
  
  constructor() {
    this.bindToWindow();
  }
  
  /**
   * Bind FPS counter to window for global access
   */
  private bindToWindow(): void {
    if (typeof window !== 'undefined') {
      (window as any).fpsCounter = this;
    }
  }
  
  /**
   * Start measuring FPS
   */
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.measure();
  }
  
  /**
   * Stop measuring FPS
   */
  stop(): void {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
  
  /**
   * Add callback for FPS updates
   */
  onUpdate(callback: (fps: number, frameTime: number) => void): void {
    this.callbacks.push(callback);
  }
  
  /**
   * Remove callback
   */
  removeCallback(callback: (fps: number, frameTime: number) => void): void {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }
  
  /**
   * Core measurement loop
   */
  private measure(): void {
    if (!this.isRunning) return;
    
    const now = performance.now();
    const frameTime = now - this.lastTime;
    
    this.frameTimeHistory.push(frameTime);
    if (this.frameTimeHistory.length > this.maxHistoryLength) {
      this.frameTimeHistory.shift();
    }
    
    this.frameCount++;
    
    // Update FPS every second
    const elapsed = now - this.getLastUpdateTime();
    if (elapsed >= this.updateInterval) {
      const fps = Math.round((this.frameCount * 1000) / elapsed);
      
      this.fpsHistory.push(fps);
      if (this.fpsHistory.length > this.maxHistoryLength) {
        this.fpsHistory.shift();
      }
      
      // Notify callbacks
      this.callbacks.forEach(callback => {
        callback(fps, this.getAverageFrameTime());
      });
      
      this.frameCount = 0;
      this.lastTime = now;
    }
    
    this.animationFrame = requestAnimationFrame(() => this.measure());
  }
  
  private getLastUpdateTime(): number {
    return this.lastTime;
  }
  
  /**
   * Get current FPS
   */
  getCurrentFPS(): number {
    return this.fpsHistory.length > 0 ? this.fpsHistory[this.fpsHistory.length - 1] : 0;
  }
  
  /**
   * Get average FPS over the history
   */
  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 0;
    return this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length;
  }
  
  /**
   * Get minimum FPS recorded
   */
  getMinFPS(): number {
    return this.fpsHistory.length > 0 ? Math.min(...this.fpsHistory) : 0;
  }
  
  /**
   * Get maximum FPS recorded
   */
  getMaxFPS(): number {
    return this.fpsHistory.length > 0 ? Math.max(...this.fpsHistory) : 0;
  }
  
  /**
   * Get FPS stability (standard deviation)
   */
  getFPSStability(): number {
    if (this.fpsHistory.length < 2) return 0;
    
    const average = this.getAverageFPS();
    const variance = this.fpsHistory.reduce((sum, fps) => {
      return sum + Math.pow(fps - average, 2);
    }, 0) / this.fpsHistory.length;
    
    return Math.sqrt(variance);
  }
  
  /**
   * Get average frame time
   */
  getAverageFrameTime(): number {
    if (this.frameTimeHistory.length === 0) return 0;
    return this.frameTimeHistory.reduce((sum, time) => sum + time, 0) / this.frameTimeHistory.length;
  }
  
  /**
   * Get frame drop analysis
   */
  getFrameDropAnalysis(): {
    frameDrops: number;
    severeFrameDrops: number;
    frameDropPercentage: number;
    severeFrameDropPercentage: number;
    longestFrameTime: number;
  } {
    const frameDrops = this.frameTimeHistory.filter(time => time > this.frameDropThreshold).length;
    const severeFrameDrops = this.frameTimeHistory.filter(time => time > this.severeFrameDropThreshold).length;
    const totalFrames = this.frameTimeHistory.length;
    
    return {
      frameDrops,
      severeFrameDrops,
      frameDropPercentage: totalFrames > 0 ? (frameDrops / totalFrames) * 100 : 0,
      severeFrameDropPercentage: totalFrames > 0 ? (severeFrameDrops / totalFrames) * 100 : 0,
      longestFrameTime: this.frameTimeHistory.length > 0 ? Math.max(...this.frameTimeHistory) : 0
    };
  }
  
  /**
   * Get performance grade based on FPS and stability
   */
  getPerformanceGrade(): {
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    score: number;
    description: string;
  } {
    const avgFPS = this.getAverageFPS();
    const stability = this.getFPSStability();
    const frameDropAnalysis = this.getFrameDropAnalysis();
    
    // Calculate score (0-100)
    let score = 0;
    
    // FPS component (60%)
    if (avgFPS >= 55) score += 60;
    else if (avgFPS >= 45) score += 45;
    else if (avgFPS >= 30) score += 30;
    else if (avgFPS >= 20) score += 15;
    
    // Stability component (25%)
    if (stability <= 2) score += 25;
    else if (stability <= 5) score += 20;
    else if (stability <= 10) score += 15;
    else if (stability <= 15) score += 10;
    else if (stability <= 20) score += 5;
    
    // Frame drops component (15%)
    if (frameDropAnalysis.frameDropPercentage <= 1) score += 15;
    else if (frameDropAnalysis.frameDropPercentage <= 5) score += 12;
    else if (frameDropAnalysis.frameDropPercentage <= 10) score += 8;
    else if (frameDropAnalysis.frameDropPercentage <= 20) score += 4;
    
    // Determine grade
    let grade: 'A' | 'B' | 'C' | 'D' | 'F';
    let description: string;
    
    if (score >= 90) {
      grade = 'A';
      description = 'Excellent performance - smooth and stable';
    } else if (score >= 80) {
      grade = 'B';
      description = 'Good performance - minor occasional stutters';
    } else if (score >= 70) {
      grade = 'C';
      description = 'Acceptable performance - noticeable but manageable issues';
    } else if (score >= 60) {
      grade = 'D';
      description = 'Poor performance - significant stuttering and frame drops';
    } else {
      grade = 'F';
      description = 'Unacceptable performance - major performance issues';
    }
    
    return { grade, score, description };
  }
  
  /**
   * Get comprehensive metrics
   */
  getMetrics(): {
    fps: {
      current: number;
      average: number;
      min: number;
      max: number;
      stability: number;
    };
    frameTime: {
      average: number;
      history: number[];
    };
    frameDrops: {
      frameDrops: number;
      severeFrameDrops: number;
      frameDropPercentage: number;
      severeFrameDropPercentage: number;
      longestFrameTime: number;
    };
    performance: {
      grade: 'A' | 'B' | 'C' | 'D' | 'F';
      score: number;
      description: string;
    };
    history: {
      fps: number[];
      frameTimes: number[];
    };
  } {
    return {
      fps: {
        current: this.getCurrentFPS(),
        average: this.getAverageFPS(),
        min: this.getMinFPS(),
        max: this.getMaxFPS(),
        stability: this.getFPSStability()
      },
      frameTime: {
        average: this.getAverageFrameTime(),
        history: [...this.frameTimeHistory]
      },
      frameDrops: this.getFrameDropAnalysis(),
      performance: this.getPerformanceGrade(),
      history: {
        fps: [...this.fpsHistory],
        frameTimes: [...this.frameTimeHistory]
      }
    };
  }
  
  /**
   * Clear all history and reset counters
   */
  reset(): void {
    this.frameCount = 0;
    this.fpsHistory = [];
    this.frameTimeHistory = [];
    this.lastTime = performance.now();
  }
  
  /**
   * Export data for analysis
   */
  exportData(): {
    timestamp: string;
    duration: number;
    fpsHistory: number[];
    frameTimeHistory: number[];
    metrics: ReturnType<FPSCounter['getMetrics']>;
  } {
    return {
      timestamp: new Date().toISOString(),
      duration: this.fpsHistory.length * this.updateInterval,
      fpsHistory: [...this.fpsHistory],
      frameTimeHistory: [...this.frameTimeHistory],
      metrics: this.getMetrics()
    };
  }
}

/**
 * Factory function to create and auto-start FPS counter
 */
export function createFPSCounter(autoStart = true): FPSCounter {
  const counter = new FPSCounter();
  if (autoStart) {
    counter.start();
  }
  return counter;
}

/**
 * Global FPS counter instance for easy access
 */
export const globalFPSCounter = new FPSCounter();