import { Page } from '@playwright/test';

export interface DetailedPerformanceMetrics {
  // Core performance metrics
  fps: number;
  frameTime: number;
  averageFPS: number;
  minFPS: number;
  maxFPS: number;
  fpsStability: number; // Standard deviation of FPS
  
  // Memory metrics
  memoryUsage: number;
  memoryTrend: 'stable' | 'increasing' | 'decreasing';
  gcEvents: number;
  heapSize: {
    used: number;
    total: number;
    limit: number;
  };
  
  // Timing metrics
  loadTime: number;
  initTime: number;
  firstPaintTime: number;
  firstContentfulPaintTime: number;
  timeToInteractive: number;
  
  // Interaction metrics
  inputDelay: number;
  clickDelay: number;
  scrollDelay: number;
  mouseMoveDelay: number;
  
  // Three.js specific metrics
  threeJS: {
    drawCalls: number;
    triangles: number;
    geometries: number;
    textures: number;
    shaderPrograms: number;
    renderCalls: number;
  };
  
  // WebGL metrics
  webGL: {
    vendor: string;
    renderer: string;
    version: string;
    maxTextureSize: number;
    maxVertexAttribs: number;
    extensions: string[];
    contextLostEvents: number;
  };
  
  // CPU and GPU approximations
  performance: {
    scriptTime: number;
    renderTime: number;
    paintTime: number;
    layoutTime: number;
    compositeTime: number;
  };
  
  // Stability metrics
  stability: {
    frameDrops: number;
    largeFrameTimes: number;
    inconsistentFraming: number;
    memorySpikes: number;
  };
}

export interface BenchmarkConfig {
  duration: number;
  warmupTime: number;
  measurementInterval: number;
  includeInteractions: boolean;
  trackMemoryLeaks: boolean;
  monitorWebGLLoss: boolean;
}

export class AdvancedPerformanceBenchmark {
  private page: Page;
  private config: BenchmarkConfig;
  private isMonitoring = false;
  private startTime = 0;
  
  constructor(page: Page, config: Partial<BenchmarkConfig> = {}) {
    this.page = page;
    this.config = {
      duration: 10000,
      warmupTime: 3000,
      measurementInterval: 100,
      includeInteractions: true,
      trackMemoryLeaks: true,
      monitorWebGLLoss: true,
      ...config
    };
  }

  async initialize(): Promise<void> {
    await this.page.addInitScript(() => {
      // Enhanced performance monitoring script
      (window as any).advancedPerformanceMonitor = {
        metrics: {
          frames: [],
          memorySnapshots: [],
          interactionEvents: [],
          renderEvents: [],
          webglEvents: [],
          performanceEntries: [],
          gcEvents: [],
          threeJSStats: {
            drawCalls: 0,
            triangles: 0,
            geometries: 0,
            textures: 0,
            shaderPrograms: 0,
            renderCalls: 0
          }
        },
        
        config: {
          isMonitoring: false,
          startTime: 0
        },
        
        // FPS monitoring with detailed frame timing
        startFrameMonitoring() {
          let lastFrameTime = performance.now();
          let frameCount = 0;
          
          const measureFrame = (currentTime: number) => {
            if (this.config.isMonitoring) {
              const frameTime = currentTime - lastFrameTime;
              this.metrics.frames.push({
                timestamp: currentTime,
                frameTime: frameTime,
                fps: 1000 / frameTime
              });
              
              lastFrameTime = currentTime;
              frameCount++;
              
              requestAnimationFrame(measureFrame);
            }
          };
          
          requestAnimationFrame(measureFrame);
        },
        
        // Memory monitoring with leak detection
        startMemoryMonitoring() {
          const measureMemory = () => {
            if (this.config.isMonitoring && 'memory' in performance) {
              const memory = (performance as any).memory;
              this.metrics.memorySnapshots.push({
                timestamp: performance.now(),
                used: memory.usedJSHeapSize,
                total: memory.totalJSHeapSize,
                limit: memory.jsHeapSizeLimit
              });
            }
          };
          
          setInterval(measureMemory, 500);
        },
        
        // Interaction delay monitoring
        startInteractionMonitoring() {
          const events = ['mousedown', 'mouseup', 'mousemove', 'click', 'scroll', 'touchstart', 'touchend'];
          
          events.forEach(eventType => {
            document.addEventListener(eventType, (event) => {
              if (this.config.isMonitoring) {
                const timestamp = performance.now();
                this.metrics.interactionEvents.push({
                  type: eventType,
                  timestamp: timestamp,
                  x: (event as MouseEvent).clientX || 0,
                  y: (event as MouseEvent).clientY || 0
                });
              }
            }, { passive: true });
          });
        },
        
        // WebGL context monitoring
        startWebGLMonitoring() {
          const canvas = document.querySelector('canvas');
          if (canvas) {
            const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
            if (gl) {
              // Monitor context loss
              canvas.addEventListener('webglcontextlost', (event) => {
                this.metrics.webglEvents.push({
                  type: 'contextlost',
                  timestamp: performance.now()
                });
              });
              
              canvas.addEventListener('webglcontextrestored', (event) => {
                this.metrics.webglEvents.push({
                  type: 'contextrestored',
                  timestamp: performance.now()
                });
              });
              
              // Capture WebGL info
              const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
              this.webglInfo = {
                vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown',
                renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown',
                version: gl.getParameter(gl.VERSION),
                maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
                maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
                extensions: gl.getSupportedExtensions() || []
              };
            }
          }
        },
        
        // Three.js stats monitoring
        startThreeJSMonitoring() {
          const monitorThreeJS = () => {
            if (this.config.isMonitoring) {
              // Try to access Three.js renderer stats
              const threeRenderer = (window as any).threeRenderer;
              if (threeRenderer && threeRenderer.info) {
                this.metrics.threeJSStats = {
                  drawCalls: threeRenderer.info.render.calls || 0,
                  triangles: threeRenderer.info.render.triangles || 0,
                  geometries: threeRenderer.info.memory.geometries || 0,
                  textures: threeRenderer.info.memory.textures || 0,
                  shaderPrograms: threeRenderer.info.programs?.length || 0,
                  renderCalls: threeRenderer.info.render.frame || 0
                };
              }
            }
          };
          
          setInterval(monitorThreeJS, 1000);
        },
        
        // Performance observer for detailed timing
        startPerformanceObserver() {
          if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
              if (this.config.isMonitoring) {
                list.getEntries().forEach(entry => {
                  this.metrics.performanceEntries.push({
                    name: entry.name,
                    type: entry.entryType,
                    startTime: entry.startTime,
                    duration: entry.duration,
                    timestamp: performance.now()
                  });
                });
              }
            });
            
            try {
              observer.observe({ entryTypes: ['measure', 'navigation', 'paint', 'layout-shift'] });
            } catch (e) {
              console.warn('Some performance entry types not supported');
            }
          }
        },
        
        // GC monitoring (when available)
        startGCMonitoring() {
          if ('PerformanceObserver' in window) {
            try {
              const gcObserver = new PerformanceObserver((list) => {
                if (this.config.isMonitoring) {
                  list.getEntries().forEach(entry => {
                    this.metrics.gcEvents.push({
                      timestamp: performance.now(),
                      duration: entry.duration,
                      type: entry.name
                    });
                  });
                }
              });
              
              gcObserver.observe({ entryTypes: ['gc'] });
            } catch (e) {
              // GC monitoring not available
            }
          }
        },
        
        // Start all monitoring
        startMonitoring() {
          this.config.isMonitoring = true;
          this.config.startTime = performance.now();
          
          this.startFrameMonitoring();
          this.startMemoryMonitoring();
          this.startInteractionMonitoring();
          this.startWebGLMonitoring();
          this.startThreeJSMonitoring();
          this.startPerformanceObserver();
          this.startGCMonitoring();
        },
        
        // Stop monitoring
        stopMonitoring() {
          this.config.isMonitoring = false;
        },
        
        // Get comprehensive metrics
        getMetrics() {
          const frames = this.metrics.frames;
          const memories = this.metrics.memorySnapshots;
          const interactions = this.metrics.interactionEvents;
          
          // Calculate FPS statistics
          const fpsList = frames.map(f => f.fps).filter(fps => fps < 200); // Filter out invalid FPS values
          const averageFPS = fpsList.length > 0 ? fpsList.reduce((a, b) => a + b, 0) / fpsList.length : 0;
          const minFPS = fpsList.length > 0 ? Math.min(...fpsList) : 0;
          const maxFPS = fpsList.length > 0 ? Math.max(...fpsList) : 0;
          
          // Calculate FPS stability (standard deviation)
          const fpsVariance = fpsList.length > 0 
            ? fpsList.reduce((acc, fps) => acc + Math.pow(fps - averageFPS, 2), 0) / fpsList.length
            : 0;
          const fpsStability = Math.sqrt(fpsVariance);
          
          // Calculate frame time statistics
          const frameTimes = frames.map(f => f.frameTime);
          const averageFrameTime = frameTimes.length > 0 ? frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length : 0;
          
          // Memory trend analysis
          let memoryTrend: 'stable' | 'increasing' | 'decreasing' = 'stable';
          if (memories.length > 1) {
            const first = memories[0].used;
            const last = memories[memories.length - 1].used;
            const change = (last - first) / first;
            if (change > 0.1) memoryTrend = 'increasing';
            else if (change < -0.1) memoryTrend = 'decreasing';
          }
          
          // Stability metrics
          const frameDrops = frameTimes.filter(time => time > 33).length; // Frames longer than ~30fps
          const largeFrameTimes = frameTimes.filter(time => time > 50).length; // Frames longer than ~20fps
          const memorySpikes = memories.filter((mem, i) => {
            if (i === 0) return false;
            const prevMem = memories[i - 1];
            return (mem.used - prevMem.used) / prevMem.used > 0.2; // 20% memory spike
          }).length;
          
          // Latest memory info
          const latestMemory = memories[memories.length - 1];
          
          return {
            fps: averageFPS,
            frameTime: averageFrameTime,
            averageFPS,
            minFPS,
            maxFPS,
            fpsStability,
            
            memoryUsage: latestMemory ? (latestMemory.used / latestMemory.limit) * 100 : 0,
            memoryTrend,
            gcEvents: this.metrics.gcEvents.length,
            heapSize: latestMemory ? {
              used: latestMemory.used,
              total: latestMemory.total,
              limit: latestMemory.limit
            } : { used: 0, total: 0, limit: 0 },
            
            threeJS: this.metrics.threeJSStats,
            webGL: this.webglInfo || {},
            
            stability: {
              frameDrops,
              largeFrameTimes,
              inconsistentFraming: fpsStability,
              memorySpikes
            },
            
            rawData: {
              frames: this.metrics.frames,
              memories: this.metrics.memorySnapshots,
              interactions: this.metrics.interactionEvents,
              webglEvents: this.metrics.webglEvents,
              performanceEntries: this.metrics.performanceEntries,
              gcEvents: this.metrics.gcEvents
            }
          };
        },
        
        // Clear all metrics
        clearMetrics() {
          this.metrics = {
            frames: [],
            memorySnapshots: [],
            interactionEvents: [],
            renderEvents: [],
            webglEvents: [],
            performanceEntries: [],
            gcEvents: [],
            threeJSStats: {
              drawCalls: 0,
              triangles: 0,
              geometries: 0,
              textures: 0,
              shaderPrograms: 0,
              renderCalls: 0
            }
          };
        }
      };
    });
  }

  async startBenchmark(): Promise<void> {
    this.isMonitoring = true;
    this.startTime = Date.now();
    
    await this.page.evaluate(() => {
      (window as any).advancedPerformanceMonitor.clearMetrics();
      (window as any).advancedPerformanceMonitor.startMonitoring();
    });
  }

  async stopBenchmark(): Promise<DetailedPerformanceMetrics> {
    this.isMonitoring = false;
    
    await this.page.evaluate(() => {
      (window as any).advancedPerformanceMonitor.stopMonitoring();
    });
    
    const rawMetrics = await this.page.evaluate(() => {
      return (window as any).advancedPerformanceMonitor.getMetrics();
    });
    
    // Get additional timing metrics from browser APIs
    const timingMetrics = await this.page.evaluate(() => {
      const paintEntries = performance.getEntriesByType('paint');
      const navigationEntries = performance.getEntriesByType('navigation');
      
      return {
        firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
        loadComplete: navigationEntries[0]?.loadEventEnd || 0,
        domContentLoaded: navigationEntries[0]?.domContentLoadedEventEnd || 0,
        timeToInteractive: 0 // Would need more complex calculation
      };
    });
    
    // Combine all metrics
    const detailedMetrics: DetailedPerformanceMetrics = {
      ...rawMetrics,
      loadTime: Date.now() - this.startTime,
      initTime: timingMetrics.domContentLoaded,
      firstPaintTime: timingMetrics.firstPaint,
      firstContentfulPaintTime: timingMetrics.firstContentfulPaint,
      timeToInteractive: timingMetrics.timeToInteractive,
      
      // Calculate interaction delays from raw data
      inputDelay: this.calculateAverageInteractionDelay(rawMetrics.rawData.interactions, 'input'),
      clickDelay: this.calculateAverageInteractionDelay(rawMetrics.rawData.interactions, 'click'),
      scrollDelay: this.calculateAverageInteractionDelay(rawMetrics.rawData.interactions, 'scroll'),
      mouseMoveDelay: this.calculateAverageInteractionDelay(rawMetrics.rawData.interactions, 'mousemove'),
      
      performance: {
        scriptTime: 0, // Would need performance timeline analysis
        renderTime: rawMetrics.frameTime,
        paintTime: timingMetrics.firstPaint,
        layoutTime: 0,
        compositeTime: 0
      }
    };
    
    return detailedMetrics;
  }

  private calculateAverageInteractionDelay(interactions: any[], eventType: string): number {
    const relevantEvents = interactions.filter(event => event.type.includes(eventType));
    if (relevantEvents.length < 2) return 0;
    
    const delays: number[] = [];
    for (let i = 1; i < relevantEvents.length; i++) {
      const delay = relevantEvents[i].timestamp - relevantEvents[i - 1].timestamp;
      if (delay > 0 && delay < 1000) { // Filter out unrealistic delays
        delays.push(delay);
      }
    }
    
    return delays.length > 0 ? delays.reduce((a, b) => a + b, 0) / delays.length : 0;
  }

  async runInteractionTest(duration: number = 5000): Promise<number[]> {
    const delays: number[] = [];
    const heroSection = this.page.locator('[data-testid^="hero-section"]');
    const boundingBox = await heroSection.boundingBox();
    
    if (!boundingBox) return delays;
    
    const startTime = Date.now();
    while (Date.now() - startTime < duration) {
      const interactionStart = Date.now();
      
      await this.page.mouse.move(
        boundingBox.x + Math.random() * boundingBox.width,
        boundingBox.y + Math.random() * boundingBox.height
      );
      
      // Wait for next frame
      await this.page.waitForTimeout(16);
      
      const interactionEnd = Date.now();
      delays.push(interactionEnd - interactionStart);
      
      await this.page.waitForTimeout(50); // Small delay between interactions
    }
    
    return delays;
  }

  async measureMemoryUsageOverTime(duration: number = 30000): Promise<Array<{ timestamp: number; usage: number }>> {
    const measurements: Array<{ timestamp: number; usage: number }> = [];
    const startTime = Date.now();
    
    while (Date.now() - startTime < duration) {
      const memory = await this.page.evaluate(() => {
        if ('memory' in performance) {
          const mem = (performance as any).memory;
          return {
            timestamp: performance.now(),
            usage: (mem.usedJSHeapSize / mem.jsHeapSizeLimit) * 100
          };
        }
        return { timestamp: performance.now(), usage: 0 };
      });
      
      measurements.push(memory);
      await this.page.waitForTimeout(1000); // Measure every second
    }
    
    return measurements;
  }
}

export class PerformanceComparison {
  private results: Map<string, DetailedPerformanceMetrics> = new Map();
  
  addResult(name: string, metrics: DetailedPerformanceMetrics): void {
    this.results.set(name, metrics);
  }
  
  compare(): {
    best: { name: string; metrics: DetailedPerformanceMetrics };
    worst: { name: string; metrics: DetailedPerformanceMetrics };
    summary: Array<{ name: string; score: number; metrics: DetailedPerformanceMetrics }>;
  } {
    const scored = Array.from(this.results.entries()).map(([name, metrics]) => {
      // Calculate composite performance score (0-100)
      const fpsScore = Math.min(metrics.fps / 60 * 100, 100);
      const memoryScore = Math.max(0, 100 - metrics.memoryUsage);
      const stabilityScore = Math.max(0, 100 - metrics.fpsStability);
      const interactionScore = Math.max(0, 100 - metrics.inputDelay / 10);
      
      const score = (fpsScore * 0.4 + memoryScore * 0.3 + stabilityScore * 0.2 + interactionScore * 0.1);
      
      return { name, score, metrics };
    });
    
    scored.sort((a, b) => b.score - a.score);
    
    return {
      best: scored[0],
      worst: scored[scored.length - 1],
      summary: scored
    };
  }
  
  generateReport(): string {
    const comparison = this.compare();
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: this.results.size,
        bestPerformer: comparison.best.name,
        worstPerformer: comparison.worst.name,
        averageScore: comparison.summary.reduce((sum, item) => sum + item.score, 0) / comparison.summary.length
      },
      detailedResults: comparison.summary,
      recommendations: this.generateRecommendations(comparison)
    };
    
    return JSON.stringify(report, null, 2);
  }
  
  private generateRecommendations(comparison: any): string[] {
    const recommendations: string[] = [];
    const worst = comparison.worst.metrics;
    
    if (worst.fps < 30) {
      recommendations.push('Critical: FPS is below 30. Consider reducing particle count and disabling expensive effects.');
    }
    
    if (worst.memoryUsage > 80) {
      recommendations.push('High memory usage detected. Implement object pooling and texture optimization.');
    }
    
    if (worst.fpsStability > 10) {
      recommendations.push('Frame rate is unstable. Investigate frame time spikes and optimize render loop.');
    }
    
    if (worst.stability.frameDrops > 10) {
      recommendations.push('Frequent frame drops detected. Consider adaptive quality settings.');
    }
    
    return recommendations;
  }
}