import { test, expect } from '@playwright/test';

test.describe('Unified Animation System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 10000 });
    
    // Inject testing utilities
    await page.addInitScript(() => {
      window.animationTestingUtils = {
        getUnifiedState: () => window.unifiedAnimationState,
        getPerformanceMetrics: () => window.animationPerformanceMetrics,
        setQuality: (quality) => {
          if (window.setAnimationQuality) {
            window.setAnimationQuality(quality);
          }
        }
      };
    });
    
    await page.waitForTimeout(1000);
  });

  test('should initialize unified animation state correctly', async ({ page }) => {
    const initialState = await page.evaluate(() => {
      return window.animationTestingUtils?.getUnifiedState?.() || {};
    });

    // Check that all required state properties exist
    expect(initialState).toHaveProperty('cursor');
    expect(initialState).toHaveProperty('scroll');
    expect(initialState).toHaveProperty('touch');
    expect(initialState).toHaveProperty('performance');
    expect(initialState).toHaveProperty('animation');

    // Check cursor state structure
    if (initialState.cursor) {
      expect(initialState.cursor).toHaveProperty('position');
      expect(initialState.cursor).toHaveProperty('velocity');
      expect(initialState.cursor).toHaveProperty('gesture');
      expect(initialState.cursor).toHaveProperty('interactionState');
    }

    // Check animation state structure
    if (initialState.animation) {
      expect(initialState.animation).toHaveProperty('isPlaying');
      expect(initialState.animation).toHaveProperty('quality');
      expect(initialState.animation).toHaveProperty('particleCount');
      expect(initialState.animation).toHaveProperty('effectsEnabled');
    }
  });

  test('should update cursor state on mouse movement', async ({ page }) => {
    // Move mouse to a specific position
    await page.mouse.move(400, 300);
    await page.waitForTimeout(100);

    const cursorState = await page.evaluate(() => {
      const state = window.animationTestingUtils?.getUnifiedState?.();
      return state?.cursor || {};
    });

    // Check cursor position is updated
    expect(cursorState.position?.x).toBeDefined();
    expect(cursorState.position?.y).toBeDefined();
    expect(cursorState.position?.x).toBeCloseTo(400, 50);
    expect(cursorState.position?.y).toBeCloseTo(300, 50);
  });

  test('should track scroll state correctly', async ({ page }) => {
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(200);

    const scrollState = await page.evaluate(() => {
      const state = window.animationTestingUtils?.getUnifiedState?.();
      return state?.scroll || {};
    });

    // Check scroll state
    expect(scrollState.scrollY).toBeGreaterThan(400);
    expect(scrollState.scrollDirection).toBe('down');
    expect(scrollState.isScrolling).toBeDefined();
  });

  test('should handle touch interactions on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Mock touch support
    await page.addInitScript(() => {
      Object.defineProperty(window, 'ontouchstart', { value: true });
      Object.defineProperty(navigator, 'maxTouchPoints', { value: 5 });
    });

    await page.reload();
    await page.waitForSelector('[data-testid="hero-section"]');

    // Simulate touch interaction
    await page.touchscreen.tap(200, 300);
    await page.waitForTimeout(100);

    const touchState = await page.evaluate(() => {
      const state = window.animationTestingUtils?.getUnifiedState?.();
      return state?.touch || {};
    });

    // Check touch state is tracking
    expect(touchState).toHaveProperty('touches');
    expect(touchState).toHaveProperty('gesture');
    expect(touchState).toHaveProperty('isActive');
  });

  test('should adapt quality based on performance metrics', async ({ page }) => {
    // Set initial quality to high
    await page.evaluate(() => {
      window.animationTestingUtils?.setQuality?.('high');
    });

    await page.waitForTimeout(500);

    let initialState = await page.evaluate(() => {
      const state = window.animationTestingUtils?.getUnifiedState?.();
      return state?.animation || {};
    });

    expect(initialState.quality).toBe('high');

    // Simulate performance degradation
    await page.evaluate(() => {
      // Mock poor performance metrics
      if (window.mockPerformanceMetrics) {
        window.mockPerformanceMetrics({
          frameRate: 25,
          memoryUsage: 80,
          deviceCapabilities: { tier: 'low' }
        });
      }
    });

    await page.waitForTimeout(1000);

    const updatedState = await page.evaluate(() => {
      const state = window.animationTestingUtils?.getUnifiedState?.();
      return state?.animation || {};
    });

    // Quality should have been reduced
    expect(['low', 'medium'].includes(updatedState.quality)).toBeTruthy();
  });

  test('should maintain consistent particle count across quality levels', async ({ page }) => {
    const qualities = ['low', 'medium', 'high', 'ultra'];
    const particleCounts = {};

    for (const quality of qualities) {
      await page.evaluate((q) => {
        window.animationTestingUtils?.setQuality?.(q);
      }, quality);

      await page.waitForTimeout(300);

      const state = await page.evaluate(() => {
        const state = window.animationTestingUtils?.getUnifiedState?.();
        return state?.animation || {};
      });

      particleCounts[quality] = state.particleCount;
    }

    // Particle counts should increase with quality
    expect(particleCounts['low']).toBeLessThan(particleCounts['medium']);
    expect(particleCounts['medium']).toBeLessThanOrEqual(particleCounts['high']);
    expect(particleCounts['high']).toBeLessThanOrEqual(particleCounts['ultra']);

    // All counts should be reasonable numbers
    Object.values(particleCounts).forEach(count => {
      expect(count).toBeGreaterThan(0);
      expect(count).toBeLessThan(1000);
    });
  });

  test('should handle gesture detection correctly', async ({ page }) => {
    // Simulate circular gesture
    const center = { x: 400, y: 300 };
    const radius = 100;
    const steps = 20;

    await page.mouse.move(center.x + radius, center.y);
    await page.mouse.down();

    for (let i = 1; i <= steps; i++) {
      const angle = (i / steps) * 2 * Math.PI;
      const x = center.x + radius * Math.cos(angle);
      const y = center.y + radius * Math.sin(angle);
      await page.mouse.move(x, y);
      await page.waitForTimeout(20);
    }

    await page.mouse.up();
    await page.waitForTimeout(200);

    const gestureState = await page.evaluate(() => {
      const state = window.animationTestingUtils?.getUnifiedState?.();
      return state?.cursor?.gesture || {};
    });

    // Should detect circular or swipe gesture
    expect(['circular', 'swipe', 'drag'].includes(gestureState.type)).toBeTruthy();
    expect(gestureState.intensity).toBeGreaterThan(0);
  });

  test('should handle performance monitoring lifecycle', async ({ page }) => {
    // Check initial monitoring state
    const initialPerformance = await page.evaluate(() => {
      const state = window.animationTestingUtils?.getUnifiedState?.();
      return state?.performance || {};
    });

    expect(initialPerformance).toHaveProperty('isMonitoring');
    expect(initialPerformance).toHaveProperty('deviceTier');
    expect(initialPerformance).toHaveProperty('frameRate');

    // Trigger animation activity
    await page.mouse.move(200, 200);
    await page.mouse.move(600, 400);
    await page.waitForTimeout(1000);

    const activePerformance = await page.evaluate(() => {
      const state = window.animationTestingUtils?.getUnifiedState?.();
      return state?.performance || {};
    });

    // Performance metrics should be updated
    expect(activePerformance.frameRate).toBeGreaterThan(0);
    expect(['low', 'medium', 'high', 'ultra'].includes(activePerformance.deviceTier)).toBeTruthy();
  });

  test('should synchronize global animation time', async ({ page }) => {
    const timeReadings = [];

    // Take multiple time readings
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(200);
      
      const currentTime = await page.evaluate(() => {
        const state = window.animationTestingUtils?.getUnifiedState?.();
        return state?.animation?.globalTime || 0;
      });
      
      timeReadings.push(currentTime);
    }

    // Time should be progressing
    for (let i = 1; i < timeReadings.length; i++) {
      expect(timeReadings[i]).toBeGreaterThan(timeReadings[i - 1]);
    }

    // Time increments should be reasonable (not jumping too much)
    for (let i = 1; i < timeReadings.length; i++) {
      const increment = timeReadings[i] - timeReadings[i - 1];
      expect(increment).toBeGreaterThan(0.1); // At least 100ms
      expect(increment).toBeLessThan(1.0);    // At most 1 second
    }
  });

  test('should handle animation play/pause controls', async ({ page }) => {
    // Test pause functionality
    await page.evaluate(() => {
      if (window.animationControls?.pause) {
        window.animationControls.pause();
      }
    });

    await page.waitForTimeout(300);

    const pausedState = await page.evaluate(() => {
      const state = window.animationTestingUtils?.getUnifiedState?.();
      return state?.animation || {};
    });

    expect(pausedState.isPaused).toBeTruthy();

    // Test resume functionality
    await page.evaluate(() => {
      if (window.animationControls?.play) {
        window.animationControls.play();
      }
    });

    await page.waitForTimeout(300);

    const playingState = await page.evaluate(() => {
      const state = window.animationTestingUtils?.getUnifiedState?.();
      return state?.animation || {};
    });

    expect(playingState.isPlaying).toBeTruthy();
    expect(playingState.isPaused).toBeFalsy();
  });
});

// Global type declarations for testing utilities
declare global {
  interface Window {
    animationTestingUtils: {
      getUnifiedState: () => any;
      getPerformanceMetrics: () => any;
      setQuality: (quality: string) => void;
    };
    unifiedAnimationState: any;
    animationPerformanceMetrics: any;
    setAnimationQuality: (quality: string) => void;
    mockPerformanceMetrics: (metrics: any) => void;
    animationControls: {
      play: () => void;
      pause: () => void;
      stop: () => void;
    };
  }
}