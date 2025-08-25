import { test, expect, Page, Browser } from '@playwright/test';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  renderTime: number;
  scriptTime: number;
  paintTime: number;
  layoutTime: number;
  totalTime: number;
  loadTime: number;
  initTime: number;
  interactionDelay: number;
  drawCalls?: number;
  triangles?: number;
  cpuUsage?: number;
}

interface BenchmarkResult {
  variant: 'lightweight' | 'original';
  particleCount: number;
  metrics: PerformanceMetrics;
  timestamp: number;
  testName: string;
  deviceInfo: {
    userAgent: string;
    viewport: { width: number; height: number };
    deviceScaleFactor: number;
  };
}

// Utility class for performance monitoring
class PerformanceMonitor {
  private page: Page;
  private metricsHistory: PerformanceMetrics[] = [];
  
  constructor(page: Page) {
    this.page = page;
  }

  async startMonitoring() {
    // Inject performance monitoring script
    await this.page.addInitScript(() => {
      (window as any).performanceData = {
        frameCount: 0,
        lastTime: performance.now(),
        fpsHistory: [],
        memoryHistory: [],
        renderTimes: [],
        interactionDelays: [],
        drawCalls: 0,
        isMonitoring: false
      };

      // FPS monitoring
      const measureFPS = () => {
        const data = (window as any).performanceData;
        const now = performance.now();
        const delta = now - data.lastTime;
        
        if (delta >= 1000) {
          const fps = Math.round((data.frameCount * 1000) / delta);
          data.fpsHistory.push(fps);
          data.frameCount = 0;
          data.lastTime = now;
          
          // Keep only last 10 measurements
          if (data.fpsHistory.length > 10) {
            data.fpsHistory.shift();
          }
        }
        
        data.frameCount++;
        if (data.isMonitoring) {
          requestAnimationFrame(measureFPS);
        }
      };

      // Memory monitoring
      const measureMemory = () => {
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          const usage = {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit,
            percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
          };
          (window as any).performanceData.memoryHistory.push(usage);
        }
      };

      // Interaction delay monitoring
      const measureInteractionDelay = () => {
        let mouseDownTime: number;
        
        document.addEventListener('mousedown', () => {
          mouseDownTime = performance.now();
        });
        
        document.addEventListener('mouseup', () => {
          if (mouseDownTime) {
            const delay = performance.now() - mouseDownTime;
            (window as any).performanceData.interactionDelays.push(delay);
          }
        });
      };

      // Start monitoring
      (window as any).startPerformanceMonitoring = () => {
        (window as any).performanceData.isMonitoring = true;
        requestAnimationFrame(measureFPS);
        setInterval(measureMemory, 1000);
        measureInteractionDelay();
      };

      // Stop monitoring
      (window as any).stopPerformanceMonitoring = () => {
        (window as any).performanceData.isMonitoring = false;
      };

      // Get metrics
      (window as any).getPerformanceMetrics = () => {
        const data = (window as any).performanceData;
        const avgFPS = data.fpsHistory.length > 0 
          ? data.fpsHistory.reduce((a: number, b: number) => a + b, 0) / data.fpsHistory.length 
          : 0;
        
        const latestMemory = data.memoryHistory[data.memoryHistory.length - 1];
        const avgInteractionDelay = data.interactionDelays.length > 0
          ? data.interactionDelays.reduce((a: number, b: number) => a + b, 0) / data.interactionDelays.length
          : 0;

        return {
          fps: avgFPS,
          frameTime: avgFPS > 0 ? 1000 / avgFPS : 0,
          memoryUsage: latestMemory ? latestMemory.percentage : 0,
          interactionDelay: avgInteractionDelay,
          frameCount: data.frameCount,
          memoryDetails: latestMemory,
          rawData: data
        };
      };

      // Clear metrics
      (window as any).clearPerformanceMetrics = () => {
        (window as any).performanceData = {
          frameCount: 0,
          lastTime: performance.now(),
          fpsHistory: [],
          memoryHistory: [],
          renderTimes: [],
          interactionDelays: [],
          drawCalls: 0,
          isMonitoring: false
        };
      };
    });
  }

  async startMeasurement() {
    await this.page.evaluate(() => {
      (window as any).startPerformanceMonitoring();
    });
  }

  async stopMeasurement() {
    await this.page.evaluate(() => {
      (window as any).stopPerformanceMonitoring();
    });
  }

  async getMetrics(): Promise<PerformanceMetrics> {
    // Get performance metrics from browser
    const performanceData = await this.page.evaluate(() => {
      return (window as any).getPerformanceMetrics();
    });

    // Get browser performance entries
    const paintMetrics = await this.page.evaluate(() => {
      const paintEntries = performance.getEntriesByType('paint');
      const navigationEntries = performance.getEntriesByType('navigation');
      
      return {
        firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
        loadComplete: (navigationEntries[0] as any)?.loadEventEnd || 0,
        domContentLoaded: (navigationEntries[0] as any)?.domContentLoadedEventEnd || 0
      };
    });

    // Get Three.js specific metrics if available
    const threeMetrics = await this.page.evaluate(() => {
      // Try to access Three.js renderer info
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
        if (gl) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          return {
            renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown',
            vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown',
            maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
            maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS)
          };
        }
      }
      return null;
    });

    return {
      fps: performanceData.fps,
      frameTime: performanceData.frameTime,
      memoryUsage: performanceData.memoryUsage,
      renderTime: paintMetrics.firstContentfulPaint,
      scriptTime: 0, // Will be calculated from performance timeline
      paintTime: paintMetrics.firstPaint,
      layoutTime: 0,
      totalTime: paintMetrics.loadComplete,
      loadTime: paintMetrics.domContentLoaded,
      initTime: paintMetrics.firstContentfulPaint,
      interactionDelay: performanceData.interactionDelay,
      drawCalls: threeMetrics ? 0 : undefined, // Will be enhanced with WebGL queries
      triangles: threeMetrics ? 0 : undefined,
      cpuUsage: undefined // Browser limitation
    };
  }

  async clearMetrics() {
    await this.page.evaluate(() => {
      (window as any).clearPerformanceMetrics();
    });
  }

  getMetricsHistory(): PerformanceMetrics[] {
    return this.metricsHistory;
  }

  addMetrics(metrics: PerformanceMetrics) {
    this.metricsHistory.push(metrics);
  }
}

// Utility function to generate performance report
async function generatePerformanceReport(results: BenchmarkResult[]): Promise<string> {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: results.length,
      averageFPS: results.reduce((sum, r) => sum + r.metrics.fps, 0) / results.length,
      averageMemoryUsage: results.reduce((sum, r) => sum + r.metrics.memoryUsage, 0) / results.length,
      averageLoadTime: results.reduce((sum, r) => sum + r.metrics.loadTime, 0) / results.length,
    },
    recommendations: [] as string[],
    results: results
  };

  // Generate recommendations based on results
  const poorPerformanceTests = results.filter(r => r.metrics.fps < 30);
  const highMemoryTests = results.filter(r => r.metrics.memoryUsage > 70);
  const slowLoadTests = results.filter(r => r.metrics.loadTime > 3000);

  if (poorPerformanceTests.length > 0) {
    report.recommendations.push('Consider reducing particle count for low-end devices');
    report.recommendations.push('Implement adaptive quality based on device performance');
  }

  if (highMemoryTests.length > 0) {
    report.recommendations.push('Optimize memory usage with better object pooling');
    report.recommendations.push('Consider using instanced rendering for particles');
  }

  if (slowLoadTests.length > 0) {
    report.recommendations.push('Implement progressive loading for Three.js components');
    report.recommendations.push('Consider lazy loading for non-critical visual effects');
  }

  return JSON.stringify(report, null, 2);
}

// Test configuration
const PARTICLE_COUNTS = [50, 100, 200, 300, 500];
const VARIANTS = ['lightweight', 'original'] as const;
const MEASUREMENT_DURATION = 15000; // 15 seconds for more accurate measurements
const WARM_UP_DURATION = 5000; // 5 seconds warm-up
const INTERACTION_TEST_DURATION = 5000; // 5 seconds for interaction tests
const MEMORY_LEAK_CYCLES = 5; // Number of navigation cycles for memory leak test

test.describe('Three.js Hero Section Performance Tests', () => {
  let performanceMonitor: PerformanceMonitor;
  let benchmarkResults: BenchmarkResult[] = [];

  test.beforeEach(async ({ page }) => {
    performanceMonitor = new PerformanceMonitor(page);
    await performanceMonitor.startMonitoring();
  });

  test.afterAll(async () => {
    // Generate and save performance report
    const report = await generatePerformanceReport(benchmarkResults);
    console.log('Performance Report:', report);
    
    // Save to file (in real scenario, you'd save this to a file)
    // await fs.writeFile(`performance-report-${Date.now()}.json`, report);
  });

  // Test baseline performance with different particle counts
  PARTICLE_COUNTS.forEach(particleCount => {
    VARIANTS.forEach(variant => {
      test(`Performance test - ${variant} variant with ${particleCount} particles`, async ({ page }) => {
        // Navigate to page with specific variant and particle count
        const url = `http://localhost:3000?layout_variant=${variant}&particle_count=${particleCount}`;
        
        console.log(`Testing ${variant} variant with ${particleCount} particles`);
        
        // Start performance measurement
        await performanceMonitor.clearMetrics();
        
        const startTime = Date.now();
        await page.goto(url);
        
        // Wait for Three.js to initialize
        await page.waitForSelector('canvas', { timeout: 10000 });
        
        // Allow warm-up period
        await page.waitForTimeout(WARM_UP_DURATION);
        
        // Start active measurement
        await performanceMonitor.startMeasurement();
        
        // Simulate user interactions during measurement
        const heroSection = page.locator('[data-testid^="hero-section"]');
        await expect(heroSection).toBeVisible();
        
        // Simulate mouse movements
        const boundingBox = await heroSection.boundingBox();
        if (boundingBox) {
          for (let i = 0; i < 5; i++) {
            await page.mouse.move(
              boundingBox.x + Math.random() * boundingBox.width,
              boundingBox.y + Math.random() * boundingBox.height
            );
            await page.waitForTimeout(500);
          }
        }
        
        // Wait for measurement period
        await page.waitForTimeout(MEASUREMENT_DURATION);
        
        // Stop measurement and collect metrics
        await performanceMonitor.stopMeasurement();
        const metrics = await performanceMonitor.getMetrics();
        
        const loadTime = Date.now() - startTime;
        
        // Create benchmark result
        const result: BenchmarkResult = {
          variant,
          particleCount,
          metrics: {
            ...metrics,
            loadTime
          },
          timestamp: Date.now(),
          testName: `${variant}-${particleCount}-particles`,
          deviceInfo: {
            userAgent: await page.evaluate(() => navigator.userAgent),
            viewport: page.viewportSize() || { width: 1280, height: 720 },
            deviceScaleFactor: await page.evaluate(() => window.devicePixelRatio)
          }
        };
        
        benchmarkResults.push(result);
        
        // Performance assertions with adaptive thresholds
        const minFPS = variant === 'lightweight' ? 30 : 25; // Higher expectations for lightweight
        const maxMemory = variant === 'lightweight' ? 70 : 85; // Lower memory usage for lightweight
        const maxLoadTime = variant === 'lightweight' ? 3000 : 5000; // Faster load for lightweight
        
        expect(metrics.fps).toBeGreaterThan(minFPS);
        expect(metrics.memoryUsage).toBeLessThan(maxMemory);
        expect(loadTime).toBeLessThan(maxLoadTime);
        
        // Additional performance checks
        expect(metrics.frameTime).toBeLessThan(50); // Frame time should be under 50ms (20fps minimum)
        expect(metrics.interactionDelay).toBeLessThan(100); // Interaction delay under 100ms
        
        console.log(`Results for ${variant} with ${particleCount} particles:`, {
          fps: metrics.fps.toFixed(1),
          memory: metrics.memoryUsage.toFixed(1) + '%',
          loadTime: loadTime + 'ms',
          frameTime: metrics.frameTime.toFixed(2) + 'ms'
        });
      });
    });
  });

  test('Responsive performance - Mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await performanceMonitor.clearMetrics();
    
    const startTime = Date.now();
    await page.goto('http://localhost:3000?layout_variant=lightweight');
    
    await page.waitForSelector('canvas', { timeout: 10000 });
    await page.waitForTimeout(WARM_UP_DURATION);
    
    await performanceMonitor.startMeasurement();
    
    // Simulate touch interactions
    const heroSection = page.locator('[data-testid^="hero-section"]');
    const boundingBox = await heroSection.boundingBox();
    
    if (boundingBox) {
      // Simulate swipe gestures
      await page.touchscreen.tap(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
      await page.waitForTimeout(1000);
      
      // Simulate scroll
      await page.mouse.wheel(0, 100);
      await page.waitForTimeout(1000);
    }
    
    await page.waitForTimeout(MEASUREMENT_DURATION);
    
    await performanceMonitor.stopMeasurement();
    const metrics = await performanceMonitor.getMetrics();
    
    // Mobile performance should be even better optimized
    expect(metrics.fps).toBeGreaterThan(25);
    expect(metrics.memoryUsage).toBeLessThan(80);
    expect(metrics.interactionDelay).toBeLessThan(100);
    
    console.log('Mobile performance results:', metrics);
  });

  test('Performance degradation test - Extended usage', async ({ page }) => {
    await page.goto('http://localhost:3000?layout_variant=original');
    await page.waitForSelector('canvas', { timeout: 10000 });
    
    const measurements: PerformanceMetrics[] = [];
    
    // Take measurements every 15 seconds for 90 seconds (6 measurements)
    for (let i = 0; i < 6; i++) {
      await performanceMonitor.clearMetrics();
      await performanceMonitor.startMeasurement();
      
      // Simulate continuous interaction
      const heroSection = page.locator('[data-testid^="hero-section"]');
      const boundingBox = await heroSection.boundingBox();
      
      if (boundingBox) {
        for (let j = 0; j < 10; j++) {
          await page.mouse.move(
            boundingBox.x + Math.random() * boundingBox.width,
            boundingBox.y + Math.random() * boundingBox.height
          );
          await page.waitForTimeout(200);
        }
      }
      
      await page.waitForTimeout(15000); // 15 seconds between measurements
      
      await performanceMonitor.stopMeasurement();
      const metrics = await performanceMonitor.getMetrics();
      measurements.push(metrics);
      
      console.log(`Measurement ${i + 1}:`, {
        fps: metrics.fps.toFixed(1),
        memory: metrics.memoryUsage.toFixed(1) + '%'
      });
    }
    
    // Check for performance degradation
    const firstFPS = measurements[0].fps;
    const lastFPS = measurements[measurements.length - 1].fps;
    const fpsDecrease = ((firstFPS - lastFPS) / firstFPS) * 100;
    
    const firstMemory = measurements[0].memoryUsage;
    const lastMemory = measurements[measurements.length - 1].memoryUsage;
    
    // FPS should not decrease by more than 20%
    expect(fpsDecrease).toBeLessThan(20);
    
    // Memory usage should not increase by more than 30%
    expect(lastMemory - firstMemory).toBeLessThan(30);
    
    console.log('Performance degradation results:', {
      fpsDecrease: fpsDecrease.toFixed(1) + '%',
      memoryIncrease: (lastMemory - firstMemory).toFixed(1) + '%'
    });
  });

  test('Component initialization performance', async ({ page }) => {
    await page.goto('http://localhost:3000?layout_variant=original');
    
    // Measure time to first render
    const firstPaintTime = await page.evaluate(() => {
      const paintEntries = performance.getEntriesByType('paint');
      return paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0;
    });
    
    // Measure time to Three.js canvas ready
    const canvasReadyTime = await page.evaluate(() => {
      return new Promise((resolve) => {
        const startTime = performance.now();
        const checkCanvas = () => {
          const canvas = document.querySelector('canvas');
          if (canvas && canvas.width > 0 && canvas.height > 0) {
            resolve(performance.now() - startTime);
          } else {
            requestAnimationFrame(checkCanvas);
          }
        };
        checkCanvas();
      });
    });
    
    expect(firstPaintTime).toBeLessThan(2000); // First paint within 2s
    expect(canvasReadyTime).toBeLessThan(3000); // Canvas ready within 3s
    
    console.log('Initialization performance:', {
      firstPaint: firstPaintTime + 'ms',
      canvasReady: canvasReadyTime + 'ms'
    });
  });

  test('Memory leak detection', async ({ page }) => {
    await page.goto('http://localhost:3000?layout_variant=original');
    await page.waitForSelector('canvas', { timeout: 10000 });
    
    // Take initial memory reading
    const initialMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        return memory.usedJSHeapSize;
      }
      return 0;
    });
    
    // Perform multiple navigation cycles
    for (let i = 0; i < 3; i++) {
      await page.goto('http://localhost:3000?layout_variant=lightweight');
      await page.waitForSelector('canvas', { timeout: 10000 });
      await page.waitForTimeout(2000);
      
      await page.goto('http://localhost:3000?layout_variant=original');
      await page.waitForSelector('canvas', { timeout: 10000 });
      await page.waitForTimeout(2000);
    }
    
    // Force garbage collection if possible
    await page.evaluate(() => {
      if ((window as any).gc) {
        (window as any).gc();
      }
    });
    
    await page.waitForTimeout(5000);
    
    // Take final memory reading
    const finalMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        return memory.usedJSHeapSize;
      }
      return 0;
    });
    
    const memoryIncrease = finalMemory - initialMemory;
    const memoryIncreasePercent = (memoryIncrease / initialMemory) * 100;
    
    // Memory should not increase by more than 50% after navigation cycles
    expect(memoryIncreasePercent).toBeLessThan(50);
    
    console.log('Memory leak test results:', {
      initialMemory: (initialMemory / 1024 / 1024).toFixed(2) + ' MB',
      finalMemory: (finalMemory / 1024 / 1024).toFixed(2) + ' MB',
      increase: memoryIncreasePercent.toFixed(1) + '%'
    });
  });

  test('Interaction responsiveness benchmark', async ({ page }) => {
    await page.goto('http://localhost:3000?layout_variant=original');
    await page.waitForSelector('canvas', { timeout: 10000 });
    await page.waitForTimeout(3000); // Warm up
    
    const interactionDelays: number[] = [];
    const heroSection = page.locator('[data-testid^="hero-section"]');
    const boundingBox = await heroSection.boundingBox();
    
    if (boundingBox) {
      // Test multiple interaction types
      for (let i = 0; i < 10; i++) {
        const startTime = Date.now();
        
        // Simulate mouse move
        await page.mouse.move(
          boundingBox.x + Math.random() * boundingBox.width,
          boundingBox.y + Math.random() * boundingBox.height
        );
        
        // Wait for visual update (next frame)
        await page.waitForTimeout(16); // ~1 frame at 60fps
        
        const endTime = Date.now();
        interactionDelays.push(endTime - startTime);
        
        await page.waitForTimeout(100);
      }
    }
    
    const averageDelay = interactionDelays.reduce((a, b) => a + b, 0) / interactionDelays.length;
    const maxDelay = Math.max(...interactionDelays);
    
    // Interaction delay should be minimal
    expect(averageDelay).toBeLessThan(50); // Average under 50ms
    expect(maxDelay).toBeLessThan(100); // Max under 100ms
    
    console.log('Interaction responsiveness results:', {
      averageDelay: averageDelay.toFixed(1) + 'ms',
      maxDelay: maxDelay + 'ms',
      allDelays: interactionDelays
    });
  });
});

// Additional utility test for WebGL capabilities
test.describe('WebGL Performance Capabilities', () => {
  test('WebGL context and capabilities test', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const webglInfo = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
      
      if (!gl) {
        return { supported: false };
      }
      
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      const maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
      const maxRenderBufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
      const maxVertexUniformVectors = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
      const maxFragmentUniformVectors = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
      const maxVaryingVectors = gl.getParameter(gl.MAX_VARYING_VECTORS);
      const maxTextureImageUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
      
      // Check for key extensions
      const extensions = gl.getSupportedExtensions() || [];
      const hasInstancedArrays = extensions.includes('ANGLE_instanced_arrays');
      const hasVertexArrayObject = extensions.includes('OES_vertex_array_object');
      const hasFloatTextures = extensions.includes('OES_texture_float');
      
      return {
        supported: true,
        version: gl.getParameter(gl.VERSION),
        vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown',
        renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown',
        maxTextureSize,
        maxVertexAttribs,
        maxRenderBufferSize,
        maxVertexUniformVectors,
        maxFragmentUniformVectors,
        maxVaryingVectors,
        maxTextureImageUnits,
        extensions,
        hasInstancedArrays,
        hasVertexArrayObject,
        hasFloatTextures,
        isWebGL2: gl instanceof WebGL2RenderingContext
      };
    });
    
    expect(webglInfo.supported).toBeTruthy();
    expect(webglInfo.maxTextureSize).toBeGreaterThan(1024);
    expect(webglInfo.maxVertexAttribs).toBeGreaterThan(8);
    
    // Check for performance-critical extensions
    if (webglInfo.hasInstancedArrays) {
      console.log('✓ Instanced rendering supported - better particle performance expected');
    } else {
      console.warn('⚠ Instanced rendering not supported - may impact particle performance');
    }
    
    console.log('WebGL Capabilities:', webglInfo);
  });

  test('Three.js renderer performance analysis', async ({ page }) => {
    await page.goto('http://localhost:3000?layout_variant=original');
    await page.waitForSelector('canvas', { timeout: 10000 });
    await page.waitForTimeout(3000); // Warm up
    
    // Inject Three.js monitoring
    const threeJSMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 50;
        
        const checkThreeJS = () => {
          attempts++;
          
          // Try to access Three.js renderer through various means
          const canvas = document.querySelector('canvas');
          let rendererInfo = null;
          
          if (canvas) {
            const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
            if (gl) {
              // Get basic WebGL statistics
              const info = gl.getExtension('WEBGL_debug_renderer_info');
              
              // Try to access Three.js global or renderer instance
              const threeRenderer = (window as any).THREE || 
                                  (window as any).threeRenderer ||
                                  (window as any).__THREE_RENDERER__;
              
              rendererInfo = {
                canvasSize: { width: canvas.width, height: canvas.height },
                devicePixelRatio: window.devicePixelRatio,
                webglVersion: gl instanceof WebGL2RenderingContext ? 'WebGL2' : 'WebGL1',
                vendor: info ? gl.getParameter(info.UNMASKED_VENDOR_WEBGL) : 'Unknown',
                renderer: info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : 'Unknown',
                // Try to get Three.js stats if available
                threeStats: threeRenderer && threeRenderer.info ? {
                  calls: threeRenderer.info.render.calls || 0,
                  triangles: threeRenderer.info.render.triangles || 0,
                  points: threeRenderer.info.render.points || 0,
                  lines: threeRenderer.info.render.lines || 0,
                  frame: threeRenderer.info.render.frame || 0,
                  geometries: threeRenderer.info.memory.geometries || 0,
                  textures: threeRenderer.info.memory.textures || 0
                } : null,
                contextValid: !gl.isContextLost(),
                maxDrawBuffers: (gl as WebGL2RenderingContext).getParameter ? (gl as WebGL2RenderingContext).getParameter((gl as WebGL2RenderingContext).MAX_DRAW_BUFFERS) : 'N/A',
                timestamp: performance.now()
              };
              
              resolve(rendererInfo);
            }
          }
          
          if (attempts < maxAttempts) {
            setTimeout(checkThreeJS, 100);
          } else {
            resolve({ error: 'Three.js renderer not found or not accessible' });
          }
        };
        
        checkThreeJS();
      });
    });
    
    expect(threeJSMetrics).toBeDefined();
    console.log('Three.js Renderer Analysis:', threeJSMetrics);
    
    if ((threeJSMetrics as any).error) {
      console.warn('Could not access Three.js renderer details:', (threeJSMetrics as any).error);
    } else {
      expect((threeJSMetrics as any).contextValid).toBeTruthy();
      expect((threeJSMetrics as any).canvasSize.width).toBeGreaterThan(0);
      expect((threeJSMetrics as any).canvasSize.height).toBeGreaterThan(0);
    }
  });

  test('Particle system stress test', async ({ page }) => {
    console.log('Running stress test with maximum particle count...');
    
    // Test with the highest particle count on both variants
    for (const variant of VARIANTS) {
      await page.goto(`http://localhost:3000?layout_variant=${variant}&particle_count=500`);
      await page.waitForSelector('canvas', { timeout: 10000 });
      
      await performanceMonitor.clearMetrics();
      await page.waitForTimeout(WARM_UP_DURATION);
      
      await performanceMonitor.startMeasurement();
      
      // Intensive interaction simulation
      const heroSection = page.locator('[data-testid^="hero-section"]');
      const boundingBox = await heroSection.boundingBox();
      
      if (boundingBox) {
        // Rapid mouse movements to stress the particle system
        for (let i = 0; i < 20; i++) {
          await page.mouse.move(
            boundingBox.x + Math.random() * boundingBox.width,
            boundingBox.y + Math.random() * boundingBox.height
          );
          await page.waitForTimeout(50); // Quick movements
        }
        
        // Add some clicks to trigger interaction effects
        for (let i = 0; i < 5; i++) {
          await page.mouse.click(
            boundingBox.x + Math.random() * boundingBox.width,
            boundingBox.y + Math.random() * boundingBox.height
          );
          await page.waitForTimeout(200);
        }
      }
      
      await page.waitForTimeout(MEASUREMENT_DURATION);
      await performanceMonitor.stopMeasurement();
      
      const metrics = await performanceMonitor.getMetrics();
      
      // Stress test assertions - lower thresholds
      expect(metrics.fps).toBeGreaterThan(15); // Minimum viable FPS under stress
      expect(metrics.memoryUsage).toBeLessThan(95); // Memory should not be critical
      
      console.log(`Stress test results for ${variant} variant:`, {
        fps: metrics.fps.toFixed(1),
        memory: metrics.memoryUsage.toFixed(1) + '%',
        frameTime: metrics.frameTime.toFixed(2) + 'ms'
      });
    }
  });

  test('Device performance classification', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const deviceClassification = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
      
      if (!gl) return { tier: 'unsupported', score: 0 };
      
      let score = 0;
      
      // Screen and device factors
      const isMobile = window.innerWidth < 768;
      const isHighDPI = window.devicePixelRatio > 1.5;
      const screenArea = window.screen.width * window.screen.height;
      
      if (!isMobile) score += 3;
      if (screenArea > 1920 * 1080) score += 2;
      if (isHighDPI) score += 1;
      
      // Hardware concurrency
      const cores = navigator.hardwareConcurrency || 2;
      if (cores >= 8) score += 3;
      else if (cores >= 4) score += 2;
      else if (cores >= 2) score += 1;
      
      // Memory (if available)
      const deviceMemory = (navigator as any).deviceMemory;
      if (deviceMemory) {
        if (deviceMemory >= 8) score += 3;
        else if (deviceMemory >= 4) score += 2;
        else if (deviceMemory >= 2) score += 1;
      }
      
      // WebGL capabilities
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      const maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
      const extensions = gl.getSupportedExtensions() || [];
      
      if (maxTextureSize >= 4096) score += 2;
      if (maxVertexAttribs >= 16) score += 1;
      if (extensions.includes('ANGLE_instanced_arrays')) score += 2;
      if (extensions.includes('OES_texture_float')) score += 1;
      
      // WebGL2 support
      if (gl instanceof WebGL2RenderingContext) score += 2;
      
      // Connection speed (rough estimate)
      const connection = (navigator as any).connection;
      if (connection) {
        if (connection.effectiveType === '4g') score += 1;
        else if (connection.effectiveType === '3g') score -= 1;
        else if (connection.effectiveType === '2g') score -= 2;
      }
      
      // Classify device tier
      let tier: string;
      let recommendedParticles: number;
      let recommendedQuality: string;
      
      if (score >= 15) {
        tier = 'high-end';
        recommendedParticles = 500;
        recommendedQuality = 'ultra';
      } else if (score >= 10) {
        tier = 'mid-range';
        recommendedParticles = 300;
        recommendedQuality = 'high';
      } else if (score >= 6) {
        tier = 'low-mid';
        recommendedParticles = 200;
        recommendedQuality = 'medium';
      } else if (score >= 3) {
        tier = 'low-end';
        recommendedParticles = 100;
        recommendedQuality = 'low';
      } else {
        tier = 'very-low-end';
        recommendedParticles = 50;
        recommendedQuality = 'minimal';
      }
      
      return {
        tier,
        score,
        recommendedParticles,
        recommendedQuality,
        details: {
          isMobile,
          isHighDPI,
          cores,
          deviceMemory,
          maxTextureSize,
          webglVersion: gl instanceof WebGL2RenderingContext ? 'WebGL2' : 'WebGL1',
          extensionCount: extensions.length
        }
      };
    });
    
    console.log('Device Performance Classification:', deviceClassification);
    
    expect(deviceClassification.tier).toBeDefined();
    expect(deviceClassification.score).toBeGreaterThan(0);
    expect(deviceClassification.recommendedParticles).toBeGreaterThan(0);
    
    // Verify recommendations make sense
    if (deviceClassification.tier === 'high-end') {
      expect(deviceClassification.recommendedParticles).toBeGreaterThanOrEqual(300);
    } else if (deviceClassification.tier === 'low-end') {
      expect(deviceClassification.recommendedParticles).toBeLessThanOrEqual(150);
    }
  });

  test('Comprehensive performance report generation', async ({ page }) => {
    console.log('Generating comprehensive performance report...');
    
    const reportData: any = {
      timestamp: new Date().toISOString(),
      testSuite: 'Three.js Hero Section Performance',
      environment: {
        userAgent: await page.evaluate(() => navigator.userAgent),
        viewport: page.viewportSize(),
        devicePixelRatio: await page.evaluate(() => window.devicePixelRatio)
      },
      results: []
    };
    
    // Test a subset of configurations for the report
    const reportConfigs = [
      { variant: 'lightweight', particles: 100 },
      { variant: 'lightweight', particles: 300 },
      { variant: 'original', particles: 100 },
      { variant: 'original', particles: 300 }
    ];
    
    for (const config of reportConfigs) {
      const url = `http://localhost:3000?layout_variant=${config.variant}&particle_count=${config.particles}`;
      await page.goto(url);
      await page.waitForSelector('canvas', { timeout: 10000 });
      
      await performanceMonitor.clearMetrics();
      await page.waitForTimeout(3000); // Shorter warm-up for report
      
      await performanceMonitor.startMeasurement();
      
      // Brief interaction test
      const heroSection = page.locator('[data-testid^="hero-section"]');
      const boundingBox = await heroSection.boundingBox();
      
      if (boundingBox) {
        await page.mouse.move(
          boundingBox.x + boundingBox.width / 2,
          boundingBox.y + boundingBox.height / 2
        );
        await page.waitForTimeout(500);
      }
      
      await page.waitForTimeout(5000); // 5-second measurement
      await performanceMonitor.stopMeasurement();
      
      const metrics = await performanceMonitor.getMetrics();
      
      reportData.results.push({
        configuration: config,
        metrics: {
          fps: Number(metrics.fps.toFixed(1)),
          frameTime: Number(metrics.frameTime.toFixed(2)),
          memoryUsage: Number(metrics.memoryUsage.toFixed(1)),
          interactionDelay: Number(metrics.interactionDelay.toFixed(1))
        },
        score: calculatePerformanceScore(metrics, config.variant),
        recommendation: generateRecommendation(metrics, config)
      });
    }
    
    // Add device classification to report
    const deviceInfo = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
      
      return {
        webglSupported: !!gl,
        webglVersion: gl instanceof WebGL2RenderingContext ? 'WebGL2' : 'WebGL1',
        maxTextureSize: gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 0,
        cores: navigator.hardwareConcurrency || 'Unknown',
        memory: (navigator as any).deviceMemory || 'Unknown',
        platform: navigator.platform,
        isMobile: window.innerWidth < 768
      };
    });
    
    reportData.deviceInfo = deviceInfo;
    
    // Generate summary and recommendations
    reportData.summary = {
      averageFPS: reportData.results.reduce((sum: number, r: any) => sum + r.metrics.fps, 0) / reportData.results.length,
      averageMemoryUsage: reportData.results.reduce((sum: number, r: any) => sum + r.metrics.memoryUsage, 0) / reportData.results.length,
      bestConfiguration: reportData.results.reduce((best: any, current: any) => 
        current.score > (best?.score || 0) ? current : best, null),
      overallScore: reportData.results.reduce((sum: number, r: any) => sum + r.score, 0) / reportData.results.length
    };
    
    // Log the report for now (in real implementation, would save to file)
    console.log('Performance Report Generated:', JSON.stringify(reportData, null, 2));
    
    // Basic validation
    expect(reportData.results.length).toBe(reportConfigs.length);
    expect(reportData.summary.averageFPS).toBeGreaterThan(0);
    expect(reportData.summary.overallScore).toBeGreaterThan(0);
  });
});

// Helper functions for performance calculation
function calculatePerformanceScore(metrics: PerformanceMetrics, variant: string): number {
  const fpsWeight = 0.4;
  const memoryWeight = 0.3;
  const interactionWeight = 0.2;
  const stabilityWeight = 0.1;
  
  // Normalize scores to 0-100
  const fpsScore = Math.min((metrics.fps / 60) * 100, 100);
  const memoryScore = Math.max(0, 100 - metrics.memoryUsage);
  const interactionScore = Math.max(0, 100 - (metrics.interactionDelay / 10));
  const stabilityScore = metrics.frameTime > 0 ? Math.max(0, 100 - (metrics.frameTime - 16.67) * 2) : 50;
  
  return (
    fpsScore * fpsWeight +
    memoryScore * memoryWeight +
    interactionScore * interactionWeight +
    stabilityScore * stabilityWeight
  );
}

function generateRecommendation(metrics: PerformanceMetrics, config: any): string[] {
  const recommendations: string[] = [];
  
  if (metrics.fps < 30) {
    recommendations.push('Consider reducing particle count or switching to lightweight variant');
  }
  
  if (metrics.memoryUsage > 80) {
    recommendations.push('High memory usage detected - implement object pooling');
  }
  
  if (metrics.interactionDelay > 50) {
    recommendations.push('Interaction delay is high - optimize event handling');
  }
  
  if (metrics.frameTime > 33) {
    recommendations.push('Frame time inconsistent - investigate render loop optimization');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Performance is optimal for this configuration');
  }
  
  return recommendations;
}