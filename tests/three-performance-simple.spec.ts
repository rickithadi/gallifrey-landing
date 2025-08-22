import { test, expect, Page } from '@playwright/test';

interface SimplePerformanceMetrics {
  fps: number;
  loadTime: number;
  memoryUsage: number;
  firstPaintTime: number;
  canvasReadyTime: number;
  interactionDelay: number;
}

interface BenchmarkResult {
  variant: 'lightweight' | 'original';
  particleCount: number;
  metrics: SimplePerformanceMetrics;
  timestamp: number;
  testName: string;
}

const PARTICLE_COUNTS = [50, 100, 200, 300, 500];
const VARIANTS = ['lightweight', 'original'] as const;

// Simple performance monitoring that works reliably
class SimplePerformanceMonitor {
  private page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }

  async initializeMonitoring() {
    await this.page.addInitScript(() => {
      (window as any).simplePerformanceMonitor = {
        startTime: 0,
        frameCount: 0,
        lastFrameTime: 0,
        fpsData: [],
        
        start() {
          this.startTime = performance.now();
          this.frameCount = 0;
          this.fpsData = [];
          this.measureFPS();
        },
        
        measureFPS() {
          const now = performance.now();
          this.frameCount++;
          
          if (now - this.lastFrameTime >= 1000) {
            const fps = Math.round((this.frameCount * 1000) / (now - this.lastFrameTime));
            this.fpsData.push(fps);
            this.frameCount = 0;
            this.lastFrameTime = now;
            
            // Keep only last 10 readings
            if (this.fpsData.length > 10) {
              this.fpsData.shift();
            }
          }
          
          requestAnimationFrame(() => this.measureFPS());
        },
        
        getMetrics() {
          const avgFPS = this.fpsData.length > 0 
            ? this.fpsData.reduce((a, b) => a + b, 0) / this.fpsData.length 
            : 0;
          
          const memory = 'memory' in performance 
            ? (performance as any).memory
            : null;
          
          const memoryUsage = memory 
            ? (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
            : 0;
          
          return {
            fps: avgFPS,
            memoryUsage: memoryUsage,
            frameCount: this.frameCount,
            rawFPS: this.fpsData
          };
        }
      };
    });
  }

  async startMonitoring() {
    await this.page.evaluate(() => {
      (window as any).simplePerformanceMonitor.start();
    });
  }

  async getMetrics(): Promise<{
    fps: number;
    memoryUsage: number;
    frameCount: number;
    rawFPS: number[];
  }> {
    return await this.page.evaluate(() => {
      return (window as any).simplePerformanceMonitor.getMetrics();
    });
  }

  async measureLoadTime(url: string): Promise<number> {
    const startTime = Date.now();
    await this.page.goto(url);
    await this.page.waitForSelector('canvas', { timeout: 15000 });
    return Date.now() - startTime;
  }

  async measureFirstPaint(): Promise<number> {
    return await this.page.evaluate(() => {
      const paintEntries = performance.getEntriesByType('paint');
      const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
      return firstPaint ? firstPaint.startTime : 0;
    });
  }

  async measureCanvasReady(): Promise<number> {
    return await this.page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const startTime = performance.now();
        const checkCanvas = () => {
          const canvas = document.querySelector('canvas');
          if (canvas && canvas.width > 0 && canvas.height > 0) {
            resolve(performance.now() - startTime);
          } else {
            setTimeout(checkCanvas, 16);
          }
        };
        checkCanvas();
      });
    });
  }

  async measureInteractionDelay(): Promise<number> {
    const delays: number[] = [];
    const heroSection = this.page.locator('[data-testid^="hero-section"]');
    
    try {
      const boundingBox = await heroSection.boundingBox();
      if (!boundingBox) return 0;

      for (let i = 0; i < 5; i++) {
        const startTime = Date.now();
        
        await this.page.mouse.move(
          boundingBox.x + Math.random() * boundingBox.width,
          boundingBox.y + Math.random() * boundingBox.height
        );
        
        await this.page.waitForTimeout(16); // One frame
        const delay = Date.now() - startTime;
        delays.push(delay);
        
        await this.page.waitForTimeout(100);
      }
    } catch (error) {
      console.warn('Could not measure interaction delay:', error);
    }

    return delays.length > 0 ? delays.reduce((a, b) => a + b, 0) / delays.length : 0;
  }
}

test.describe('Simple Three.js Performance Tests', () => {
  let benchmarkResults: BenchmarkResult[] = [];

  test.afterAll(async () => {
    // Generate performance report
    console.log('\n=== PERFORMANCE BENCHMARK RESULTS ===');
    
    if (benchmarkResults.length === 0) {
      console.log('No benchmark results collected');
      return;
    }

    // Group by variant
    const lightweightResults = benchmarkResults.filter(r => r.variant === 'lightweight');
    const originalResults = benchmarkResults.filter(r => r.variant === 'original');

    console.log('\nLightweight Variant Results:');
    lightweightResults.forEach(result => {
      console.log(`  ${result.particleCount} particles: FPS=${result.metrics.fps.toFixed(1)}, Load=${result.metrics.loadTime}ms, Memory=${result.metrics.memoryUsage.toFixed(1)}%`);
    });

    console.log('\nOriginal Variant Results:');
    originalResults.forEach(result => {
      console.log(`  ${result.particleCount} particles: FPS=${result.metrics.fps.toFixed(1)}, Load=${result.metrics.loadTime}ms, Memory=${result.metrics.memoryUsage.toFixed(1)}%`);
    });

    // Performance comparison
    if (lightweightResults.length > 0 && originalResults.length > 0) {
      const lightweightAvgFPS = lightweightResults.reduce((sum, r) => sum + r.metrics.fps, 0) / lightweightResults.length;
      const originalAvgFPS = originalResults.reduce((sum, r) => sum + r.metrics.fps, 0) / originalResults.length;
      
      console.log(`\nPerformance Comparison:`);
      console.log(`  Lightweight variant average FPS: ${lightweightAvgFPS.toFixed(1)}`);
      console.log(`  Original variant average FPS: ${originalAvgFPS.toFixed(1)}`);
      console.log(`  Performance improvement: ${((lightweightAvgFPS - originalAvgFPS) / originalAvgFPS * 100).toFixed(1)}%`);
    }

    // Performance recommendations
    console.log('\nPerformance Recommendations:');
    const poorPerformanceTests = benchmarkResults.filter(r => r.metrics.fps < 30);
    const slowLoadTests = benchmarkResults.filter(r => r.metrics.loadTime > 3000);
    const highMemoryTests = benchmarkResults.filter(r => r.metrics.memoryUsage > 70);

    if (poorPerformanceTests.length > 0) {
      console.log('  - Consider reducing particle count for devices with FPS < 30');
    }
    if (slowLoadTests.length > 0) {
      console.log('  - Optimize loading time (currently > 3s for some tests)');
    }
    if (highMemoryTests.length > 0) {
      console.log('  - Monitor memory usage (> 70% for some tests)');
    }
    if (poorPerformanceTests.length === 0 && slowLoadTests.length === 0 && highMemoryTests.length === 0) {
      console.log('  - Overall performance looks good!');
    }
  });

  // Test different particle counts for both variants
  for (const variant of VARIANTS) {
    for (const particleCount of PARTICLE_COUNTS) {
      test(`Performance baseline - ${variant} variant with ${particleCount} particles`, async ({ page }) => {
        const monitor = new SimplePerformanceMonitor(page);
        await monitor.initializeMonitoring();

        console.log(`\nTesting ${variant} variant with ${particleCount} particles...`);

        // Build URL with parameters
        const url = `http://localhost:3000?layout_variant=${variant}&particle_count=${particleCount}`;
        
        // Measure load time
        const loadTime = await monitor.measureLoadTime(url);
        console.log(`  Load time: ${loadTime}ms`);

        // Wait for Three.js to stabilize
        await page.waitForTimeout(2000);

        // Start FPS monitoring
        await monitor.startMonitoring();

        // Let it run for measurement period
        await page.waitForTimeout(5000);

        // Measure various metrics
        const fpsMetrics = await monitor.getMetrics();
        const firstPaintTime = await monitor.measureFirstPaint();
        const canvasReadyTime = await monitor.measureCanvasReady();
        const interactionDelay = await monitor.measureInteractionDelay();

        const metrics: SimplePerformanceMetrics = {
          fps: fpsMetrics.fps,
          loadTime,
          memoryUsage: fpsMetrics.memoryUsage,
          firstPaintTime,
          canvasReadyTime,
          interactionDelay
        };

        // Store results
        const result: BenchmarkResult = {
          variant,
          particleCount,
          metrics,
          timestamp: Date.now(),
          testName: `${variant}-${particleCount}`
        };
        benchmarkResults.push(result);

        console.log(`  Results: FPS=${metrics.fps.toFixed(1)}, Memory=${metrics.memoryUsage.toFixed(1)}%, Interaction=${metrics.interactionDelay.toFixed(1)}ms`);

        // Basic performance assertions
        expect(metrics.fps).toBeGreaterThan(15); // Minimum playable FPS
        expect(metrics.loadTime).toBeLessThan(10000); // Should load within 10 seconds
        expect(metrics.memoryUsage).toBeLessThan(95); // Should not exhaust memory
      });
    }
  }

  test('Mobile performance test', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const monitor = new SimplePerformanceMonitor(page);
    await monitor.initializeMonitoring();

    console.log('\nTesting mobile performance...');

    const loadTime = await monitor.measureLoadTime('http://localhost:3000?layout_variant=lightweight');
    await page.waitForTimeout(2000);
    
    await monitor.startMonitoring();
    await page.waitForTimeout(5000);
    
    const fpsMetrics = await monitor.getMetrics();
    const interactionDelay = await monitor.measureInteractionDelay();

    console.log(`  Mobile results: FPS=${fpsMetrics.fps.toFixed(1)}, Load=${loadTime}ms, Memory=${fpsMetrics.memoryUsage.toFixed(1)}%`);

    // Mobile should have acceptable performance
    expect(fpsMetrics.fps).toBeGreaterThan(20);
    expect(loadTime).toBeLessThan(8000);
    expect(interactionDelay).toBeLessThan(100);
  });

  test('Load time comparison', async ({ page }) => {
    const monitor = new SimplePerformanceMonitor(page);
    
    console.log('\nTesting load time comparison...');

    // Test lightweight variant
    const lightweightLoadTime = await monitor.measureLoadTime('http://localhost:3000?layout_variant=lightweight');
    await page.waitForTimeout(1000);

    // Test original variant  
    const originalLoadTime = await monitor.measureLoadTime('http://localhost:3000?layout_variant=original');

    console.log(`  Lightweight load time: ${lightweightLoadTime}ms`);
    console.log(`  Original load time: ${originalLoadTime}ms`);
    console.log(`  Difference: ${originalLoadTime - lightweightLoadTime}ms`);

    // Both should load within reasonable time
    expect(lightweightLoadTime).toBeLessThan(8000);
    expect(originalLoadTime).toBeLessThan(10000);
    
    // Lightweight should be faster or similar
    expect(lightweightLoadTime).toBeLessThanOrEqual(originalLoadTime + 1000);
  });

  test('Memory usage stability', async ({ page }) => {
    const monitor = new SimplePerformanceMonitor(page);
    await monitor.initializeMonitoring();

    console.log('\nTesting memory stability over time...');

    await monitor.measureLoadTime('http://localhost:3000?layout_variant=original');
    await page.waitForTimeout(2000);

    const memoryReadings: number[] = [];
    
    // Take memory readings every 2 seconds for 10 seconds
    for (let i = 0; i < 5; i++) {
      await monitor.startMonitoring();
      await page.waitForTimeout(2000);
      
      const metrics = await monitor.getMetrics();
      memoryReadings.push(metrics.memoryUsage);
      console.log(`  Memory reading ${i + 1}: ${metrics.memoryUsage.toFixed(1)}%`);
    }

    // Check memory growth
    const initialMemory = memoryReadings[0];
    const finalMemory = memoryReadings[memoryReadings.length - 1];
    const memoryGrowth = finalMemory - initialMemory;

    console.log(`  Memory growth: ${memoryGrowth.toFixed(1)}%`);

    // Memory should remain stable (not grow more than 20%)
    expect(memoryGrowth).toBeLessThan(20);
    expect(finalMemory).toBeLessThan(90);
  });
});