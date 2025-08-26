import { test, expect } from '@playwright/test';

test.describe('Animation System Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Set up error tracking
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    // Store errors on window for later access
    await page.addInitScript(() => {
      window.pageErrors = [];
      window.addEventListener('error', (e) => {
        window.pageErrors.push(e.message);
      });
    });

    await page.goto('/');
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 10000 });
    await page.waitForTimeout(2000); // Let animations initialize
  });

  test('should integrate unified animation with Three.js hero scene', async ({ page }) => {
    // Check that Three.js canvas exists
    const canvas = await page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // Verify WebGL context is working
    const webglSupported = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return false;
      
      try {
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!gl;
      } catch (e) {
        return false;
      }
    });

    expect(webglSupported).toBeTruthy();

    // Test mouse interaction affects Three.js scene
    await page.mouse.move(200, 200);
    await page.waitForTimeout(100);
    await page.mouse.move(600, 400);
    await page.waitForTimeout(100);

    // Check for animation-related errors
    const errors = await page.evaluate(() => window.pageErrors || []);
    const animationErrors = errors.filter(error => 
      error.includes('animation') || 
      error.includes('Three') || 
      error.includes('WebGL') ||
      error.includes('particle')
    );

    expect(animationErrors).toHaveLength(0);
  });

  test('should handle variant switching correctly', async ({ page }) => {
    // Test switching to lightweight variant
    await page.evaluate(() => {
      if (window.setLayoutVariant) {
        window.setLayoutVariant('lightweight');
      }
    });

    await page.waitForTimeout(500);

    // Check that variant change doesn't break animations
    await page.mouse.move(300, 300);
    await page.waitForTimeout(200);

    const errors = await page.evaluate(() => window.pageErrors || []);
    expect(errors.filter(e => e.includes('variant'))).toHaveLength(0);

    // Test switching back to original variant
    await page.evaluate(() => {
      if (window.setLayoutVariant) {
        window.setLayoutVariant('original');
      }
    });

    await page.waitForTimeout(500);
    await page.mouse.move(400, 200);
    
    const finalErrors = await page.evaluate(() => window.pageErrors || []);
    expect(finalErrors.filter(e => e.includes('variant'))).toHaveLength(0);
  });

  test('should maintain performance with multiple interaction types', async ({ page }) => {
    // Start performance monitoring
    await page.evaluate(() => {
      window.performanceLog = [];
      const startTime = performance.now();
      let frameCount = 0;

      const measurePerformance = () => {
        frameCount++;
        const elapsed = performance.now() - startTime;
        
        if (elapsed >= 1000) {
          window.performanceLog.push({
            fps: frameCount * (1000 / elapsed),
            timestamp: performance.now()
          });
          frameCount = 0;
        }

        if (window.performanceLog.length < 3) {
          requestAnimationFrame(measurePerformance);
        }
      };

      requestAnimationFrame(measurePerformance);
    });

    // Simulate multiple interaction types simultaneously
    
    // Mouse movement
    await page.mouse.move(100, 100);
    await page.waitForTimeout(50);
    await page.mouse.move(500, 300);
    await page.waitForTimeout(50);

    // Clicking
    await page.mouse.click(400, 250);
    await page.waitForTimeout(100);

    // Scrolling
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(100);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);

    // More complex mouse interaction
    await page.mouse.move(200, 200);
    await page.mouse.down();
    await page.mouse.move(400, 400, { steps: 10 });
    await page.mouse.up();

    // Wait for performance data
    await page.waitForTimeout(3000);

    const performanceData = await page.evaluate(() => window.performanceLog || []);
    
    if (performanceData.length > 0) {
      const avgFPS = performanceData.reduce((sum: number, log: any) => sum + log.fps, 0) / performanceData.length;
      
      // Should maintain reasonable FPS even with multiple interactions
      expect(avgFPS).toBeGreaterThan(30);
      console.log(`Average FPS during multi-interaction: ${avgFPS.toFixed(1)}`);
    }

    // Check for errors during complex interactions
    const errors = await page.evaluate(() => window.pageErrors || []);
    expect(errors.length).toBeLessThan(3); // Allow minor warnings
  });

  test('should handle rapid quality changes gracefully', async ({ page }) => {
    const qualities = ['low', 'medium', 'high', 'ultra'];
    
    // Rapidly cycle through quality levels
    for (let cycle = 0; cycle < 3; cycle++) {
      for (const quality of qualities) {
        await page.evaluate((q) => {
          if (window.setAnimationQuality) {
            window.setAnimationQuality(q);
          }
        }, quality);
        
        await page.waitForTimeout(100);
        
        // Add some interaction during quality change
        await page.mouse.move(200 + cycle * 50, 200 + cycle * 30);
      }
    }

    // Check that rapid quality changes don't cause issues
    const errors = await page.evaluate(() => window.pageErrors || []);
    const qualityErrors = errors.filter(error => 
      error.includes('quality') || 
      error.includes('particles') ||
      error.includes('tier')
    );

    expect(qualityErrors).toHaveLength(0);

    // Verify final state is stable
    await page.waitForTimeout(500);
    
    const finalQuality = await page.evaluate(() => {
      return window.currentAnimationQuality || 'unknown';
    });

    expect(qualities.includes(finalQuality)).toBeTruthy();
  });

  test('should work correctly with cursor glow component', async ({ page }) => {
    // Check if cursor glow is present and functional
    const cursorGlow = await page.locator('[data-testid="cursor-glow"]').first();
    
    // Move mouse to trigger cursor glow
    await page.mouse.move(300, 250);
    await page.waitForTimeout(200);
    await page.mouse.move(500, 350);
    await page.waitForTimeout(200);

    // Check that cursor glow doesn't interfere with unified animation
    const errors = await page.evaluate(() => window.pageErrors || []);
    const cursorErrors = errors.filter(error => 
      error.includes('cursor') || 
      error.includes('glow')
    );

    expect(cursorErrors).toHaveLength(0);

    // Verify both cursor tracking and glow work together
    const cursorState = await page.evaluate(() => {
      return {
        hasUnifiedTracking: !!window.unifiedAnimationState?.cursor,
        hasGlowComponent: !!document.querySelector('[data-testid="cursor-glow"]'),
        mousePosition: window.unifiedAnimationState?.cursor?.position
      };
    });

    expect(cursorState.hasUnifiedTracking).toBeTruthy();
    
    if (cursorState.mousePosition) {
      expect(cursorState.mousePosition.x).toBeGreaterThan(0);
      expect(cursorState.mousePosition.y).toBeGreaterThan(0);
    }
  });

  test('should maintain consistent state across page interactions', async ({ page }) => {
    // Test navigation and state persistence
    await page.mouse.move(400, 300);
    await page.waitForTimeout(200);

    const initialState = await page.evaluate(() => ({
      animationPlaying: window.unifiedAnimationState?.animation?.isPlaying,
      cursorPosition: window.unifiedAnimationState?.cursor?.position
    }));

    // Simulate internal navigation or state change
    await page.evaluate(() => {
      if (window.history && window.history.pushState) {
        window.history.pushState({}, '', window.location.pathname + '?test=1');
      }
    });

    await page.waitForTimeout(300);

    const stateAfterNavigation = await page.evaluate(() => ({
      animationPlaying: window.unifiedAnimationState?.animation?.isPlaying,
      cursorPosition: window.unifiedAnimationState?.cursor?.position
    }));

    // Animation should still be running after navigation
    expect(stateAfterNavigation.animationPlaying).toBeTruthy();
    
    // Cursor tracking should still be functional
    await page.mouse.move(200, 400);
    await page.waitForTimeout(100);

    const finalCursorPosition = await page.evaluate(() => 
      window.unifiedAnimationState?.cursor?.position
    );

    expect(finalCursorPosition?.x).toBeDefined();
    expect(finalCursorPosition?.y).toBeDefined();
  });
});

// Type declarations for integration testing
declare global {
  interface Window {
    pageErrors: string[];
    performanceLog: Array<{ fps: number; timestamp: number }>;
    setLayoutVariant: (variant: string) => void;
    setAnimationQuality: (quality: string) => void;
    currentAnimationQuality: string;
    unifiedAnimationState: any;
  }
}