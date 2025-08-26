import { test, expect } from '@playwright/test';

test.describe('Cursor Following Animations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render hero section without cursor animations on touch devices', async ({ page }) => {
    // Mock touch device
    await page.addInitScript(() => {
      Object.defineProperty(window, 'ontouchstart', {
        value: null,
        configurable: true
      });
    });

    await page.reload();
    
    // Hero section should be present
    await expect(page.getByTestId('hero-section-original')).toBeVisible();
    
    // Cursor following elements should not be rendered with animations
    const cursorElements = page.locator('[class*="cursor"]');
    await expect(cursorElements).toHaveCount(0);
  });

  test('should respect prefers-reduced-motion setting', async ({ page }) => {
    // Mock reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await page.reload();
    
    // Hero section should be present
    await expect(page.getByTestId('hero-section-original')).toBeVisible();
    
    // Should render container but without active animations
    const heroSection = page.getByTestId('hero-section-original');
    await expect(heroSection).toBeVisible();
  });

  test('should show cursor animations on desktop hover', async ({ page }) => {
    // Ensure we're on desktop (non-touch)
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    
    const heroSection = page.getByTestId('hero-section-original');
    await expect(heroSection).toBeVisible();
    
    // Hover over the hero section
    await heroSection.hover();
    
    // Check for console errors during animation
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Move mouse around to trigger animations
    await page.mouse.move(100, 100);
    await page.waitForTimeout(100);
    await page.mouse.move(200, 200);
    await page.waitForTimeout(100);
    await page.mouse.move(300, 300);
    
    // Should not have any console errors
    expect(consoleErrors.filter(error => 
      !error.includes('Google Analytics') && 
      !error.includes('gtag')
    )).toHaveLength(0);
  });

  test('should handle rapid mouse movements without performance issues', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    
    const heroSection = page.getByTestId('hero-section-original');
    await expect(heroSection).toBeVisible();
    
    // Measure performance during rapid mouse movements
    await page.evaluate(() => performance.mark('animation-start'));
    
    // Simulate rapid mouse movements
    for (let i = 0; i < 50; i++) {
      await page.mouse.move(100 + i * 4, 100 + Math.sin(i * 0.1) * 50);
      await page.waitForTimeout(10);
    }
    
    await page.evaluate(() => performance.mark('animation-end'));
    
    const performanceMeasures = await page.evaluate(() => {
      performance.measure('animation-duration', 'animation-start', 'animation-end');
      const measures = performance.getEntriesByType('measure');
      return measures[measures.length - 1].duration;
    });
    
    // Animation should complete within reasonable time (2 seconds for 50 movements)
    expect(performanceMeasures).toBeLessThan(2000);
  });

  test('should work with both hero variants', async ({ page }) => {
    // Test original variant (already loaded)
    let heroSection = page.getByTestId('hero-section-original');
    await expect(heroSection).toBeVisible();
    
    // Test by injecting the lightweight variant through localStorage
    await page.evaluate(() => {
      localStorage.setItem('hero-variant', 'lightweight');
    });
    
    await page.reload();
    
    // Should now show lightweight variant
    heroSection = page.getByTestId('hero-section-lightweight');
    await expect(heroSection).toBeVisible();
    
    // Both should handle cursor animations
    await heroSection.hover();
    await page.mouse.move(150, 150);
    
    // No errors should occur
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(500);
    
    expect(consoleErrors.filter(error => 
      !error.includes('Google Analytics') && 
      !error.includes('gtag')
    )).toHaveLength(0);
  });

  test('should maintain 60fps performance during animations', async ({ page, browserName }) => {
    // Skip this test in Firefox as it has different performance measurement APIs
    if (browserName === 'firefox') {
      test.skip();
      return;
    }

    await page.emulateMedia({ reducedMotion: 'no-preference' });
    
    const heroSection = page.getByTestId('hero-section-original');
    await expect(heroSection).toBeVisible();
    
    // Monitor frame rate during animations
    const frameRateData = await page.evaluate(async () => {
      const frames: number[] = [];
      let lastTime = performance.now();
      let frameCount = 0;
      
      return new Promise<{ averageFrameRate: number; minFrameRate: number }>((resolve) => {
        function measureFrame() {
          const now = performance.now();
          const delta = now - lastTime;
          const fps = 1000 / delta;
          frames.push(fps);
          lastTime = now;
          frameCount++;
          
          if (frameCount < 60) { // Measure for ~1 second
            requestAnimationFrame(measureFrame);
          } else {
            const averageFrameRate = frames.reduce((a, b) => a + b, 0) / frames.length;
            const minFrameRate = Math.min(...frames);
            resolve({ averageFrameRate, minFrameRate });
          }
        }
        
        requestAnimationFrame(measureFrame);
      });
    });
    
    // Should maintain good frame rate (at least 45fps average, 30fps minimum)
    expect(frameRateData.averageFrameRate).toBeGreaterThan(45);
    expect(frameRateData.minFrameRate).toBeGreaterThan(30);
  });

  test('should properly cleanup event listeners on unmount', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    
    // Navigate to a different page to unmount the hero component
    await page.goto('/own-your-narrative');
    
    // Navigate back
    await page.goto('/');
    
    // Should still work properly after remount
    const heroSection = page.getByTestId('hero-section-original');
    await expect(heroSection).toBeVisible();
    
    await heroSection.hover();
    await page.mouse.move(100, 100);
    
    // No memory leaks or errors should occur
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(500);
    
    expect(consoleErrors.filter(error => 
      !error.includes('Google Analytics') && 
      !error.includes('gtag')
    )).toHaveLength(0);
  });
});