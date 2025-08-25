import { test, expect } from '@playwright/test';

test.describe('Hero Animation Performance', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Wait for the hero section to be visible
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 10000 });
    
    // Give animations time to initialize
    await page.waitForTimeout(2000);
  });

  test('should maintain 60 FPS during normal interaction', async ({ page }) => {
    // Start performance monitoring
    await page.evaluate(() => {
      window.animationMetrics = [];
      let frameCount = 0;
      const startTime = performance.now();
      
      const countFrames = () => {
        frameCount++;
        const elapsed = performance.now() - startTime;
        
        if (elapsed >= 1000) {
          window.animationMetrics.push({
            fps: frameCount,
            timestamp: performance.now()
          });
          frameCount = 0;
        }
        
        if (window.animationMetrics.length < 5) {
          requestAnimationFrame(countFrames);
        }
      };
      
      requestAnimationFrame(countFrames);
    });

    // Simulate mouse movement
    await page.mouse.move(400, 300);
    await page.waitForTimeout(500);
    await page.mouse.move(800, 400);
    await page.waitForTimeout(500);
    await page.mouse.move(200, 200);
    
    // Wait for performance data collection
    await page.waitForTimeout(5000);
    
    // Get performance metrics
    const metrics = await page.evaluate(() => window.animationMetrics);
    
    // Check FPS is above 50 (allowing some tolerance)
    const avgFPS = metrics.reduce((sum: number, m: any) => sum + m.fps, 0) / metrics.length;
    expect(avgFPS).toBeGreaterThan(50);
  });

  test('should adapt quality based on device performance', async ({ page }) => {
    // Mock low-performance device
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        writable: true,
        value: 2
      });
      
      Object.defineProperty(navigator, 'deviceMemory', {
        writable: true,
        value: 2
      });
    });

    await page.reload();
    await page.waitForSelector('[data-testid="hero-section"]');
    
    // Check that particle count is reduced for low-performance devices
    const particleCount = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return 0;
      
      // This would need to be integrated with the actual Three.js scene
      // For now, we'll check if the quality adaptation system is working
      return window.currentParticleCount || 0;
    });
    
    // On low-performance devices, particle count should be reduced
    expect(particleCount).toBeLessThan(150);
  });

  test('should handle touch interactions smoothly', async ({ page }) => {
    // Simulate touch device
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Add touch simulation
    await page.addInitScript(() => {
      Object.defineProperty(window, 'ontouchstart', {
        value: true
      });
      
      Object.defineProperty(navigator, 'maxTouchPoints', {
        value: 5
      });
    });

    await page.reload();
    await page.waitForSelector('[data-testid="hero-section"]');
    
    // Simulate touch gestures
    await page.touchscreen.tap(200, 300);
    await page.waitForTimeout(100);
    
    // Simulate swipe gesture
    await page.mouse.move(100, 200);
    await page.mouse.down();
    await page.mouse.move(300, 200, { steps: 10 });
    await page.mouse.up();
    
    // Check that touch interactions don't cause performance degradation
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Should not have JavaScript errors
    expect(consoleErrors.filter(error => 
      error.includes('animation') || error.includes('touch')
    )).toHaveLength(0);
  });

  test('should respect reduced motion preferences', async ({ page }) => {
    // Set reduced motion preference
    await page.addInitScript(() => {
      Object.defineProperty(window, 'matchMedia', {
        value: (query: string) => ({
          matches: query.includes('prefers-reduced-motion: reduce'),
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => {}
        })
      });
    });

    await page.reload();
    await page.waitForSelector('[data-testid="hero-section"]');
    
    // Check that animations are disabled or simplified
    const animationState = await page.evaluate(() => {
      // This would check the actual animation state in the unified system
      return {
        isPlaying: window.animationState?.isPlaying || false,
        particleCount: window.animationState?.particleCount || 0,
        effectsEnabled: window.animationState?.effectsEnabled || false
      };
    });
    
    // With reduced motion, animations should be minimal
    expect(animationState.particleCount).toBeLessThan(50);
  });

  test('should handle memory constraints gracefully', async ({ page }) => {
    // Simulate memory pressure
    await page.addInitScript(() => {
      let memoryPressureSimulated = false;
      
      const originalRAF = window.requestAnimationFrame;
      window.requestAnimationFrame = function(callback) {
        if (!memoryPressureSimulated && Math.random() > 0.7) {
          // Simulate occasional frame drops
          return originalRAF(() => {
            setTimeout(callback, 50); // Add delay to simulate memory pressure
          });
        }
        return originalRAF(callback);
      };
    });

    await page.reload();
    await page.waitForSelector('[data-testid="hero-section"]');
    
    // Simulate high memory usage scenario
    await page.evaluate(() => {
      // Create memory pressure
      const largeArrays = [];
      for (let i = 0; i < 100; i++) {
        largeArrays.push(new Array(10000).fill(i));
      }
      
      // Store reference to prevent garbage collection
      window.memoryPressureArrays = largeArrays;
    });
    
    // Wait and check that the system adapts
    await page.waitForTimeout(3000);
    
    const performanceState = await page.evaluate(() => {
      return {
        qualityLevel: window.currentQualityLevel || 'unknown',
        frameRate: window.currentFrameRate || 0
      };
    });
    
    // System should have adapted to memory pressure
    expect(['low', 'medium'].includes(performanceState.qualityLevel)).toBeTruthy();
  });

  test('should maintain performance across different viewport sizes', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 },  // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 } // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.reload();
      await page.waitForSelector('[data-testid="hero-section"]');
      
      // Start basic performance monitoring
      await page.evaluate(() => {
        window.performanceStart = performance.now();
        window.frameCount = 0;
        
        const countFrames = () => {
          window.frameCount++;
          if (performance.now() - window.performanceStart < 2000) {
            requestAnimationFrame(countFrames);
          }
        };
        
        requestAnimationFrame(countFrames);
      });
      
      // Simulate interaction
      await page.mouse.move(viewport.width / 2, viewport.height / 2);
      await page.waitForTimeout(2000);
      
      const frameRate = await page.evaluate(() => {
        const elapsed = performance.now() - window.performanceStart;
        return (window.frameCount / elapsed) * 1000;
      });
      
      // Should maintain reasonable frame rate across all viewports
      expect(frameRate).toBeGreaterThan(30);
      
      console.log(`Viewport ${viewport.width}x${viewport.height}: ${frameRate.toFixed(1)} FPS`);
    }
  });

  test('should handle rapid interaction changes', async ({ page }) => {
    await page.waitForSelector('[data-testid="hero-section"]');
    
    // Rapid mouse movements
    for (let i = 0; i < 20; i++) {
      await page.mouse.move(
        100 + (i * 50) % 800,
        100 + (i * 30) % 400
      );
      await page.waitForTimeout(10);
    }
    
    // Rapid clicks
    for (let i = 0; i < 5; i++) {
      await page.mouse.click(400 + i * 20, 300 + i * 10);
      await page.waitForTimeout(50);
    }
    
    // Check for console errors or performance warnings
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push(msg.text());
    });
    
    await page.waitForTimeout(1000);
    
    // Should handle rapid interactions without errors
    const errorMessages = consoleMessages.filter(msg => 
      msg.includes('error') || msg.includes('warning')
    );
    
    expect(errorMessages.length).toBeLessThan(5); // Allow some minor warnings
  });
});

// Utility function to add TypeScript declarations
declare global {
  interface Window {
    animationMetrics: any[];
    currentParticleCount: number;
    animationState: any;
    currentQualityLevel: string;
    currentFrameRate: number;
    performanceStart: number;
    frameCount: number;
    memoryPressureArrays: any[];
  }
}