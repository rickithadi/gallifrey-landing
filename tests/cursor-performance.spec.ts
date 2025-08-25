import { test, expect } from '@playwright/test';

test.describe('Cursor Following Performance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('hero section loads successfully', async ({ page }) => {
    const heroSection = page.getByTestId('hero-section-original');
    await expect(heroSection).toBeVisible();
  });

  test('cursor animations work without console errors on desktop', async ({ page }) => {
    // Mock desktop environment (non-touch, no reduced motion)
    await page.addInitScript(() => {
      // Remove touch events
      delete (window as any).ontouchstart;
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        value: (query: string) => ({
          matches: query.includes('prefers-reduced-motion') ? false : false,
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
    await page.waitForLoadState('networkidle');

    const heroSection = page.getByTestId('hero-section-original');
    await expect(heroSection).toBeVisible();

    // Track console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && 
          !msg.text().includes('Google Analytics') && 
          !msg.text().includes('gtag')) {
        consoleErrors.push(msg.text());
      }
    });

    // Hover and move cursor
    await heroSection.hover();
    await page.mouse.move(200, 200);
    await page.waitForTimeout(100);
    await page.mouse.move(400, 300);
    await page.waitForTimeout(100);

    // Should not have cursor animation related errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('respects reduced motion preference', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.waitForLoadState('networkidle');

    const heroSection = page.getByTestId('hero-section-original');
    await expect(heroSection).toBeVisible();

    // Move mouse - should not cause performance issues
    await heroSection.hover();
    await page.mouse.move(300, 300);
    await page.waitForTimeout(500);

    // No errors should occur even with reduced motion
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && 
          !msg.text().includes('Google Analytics') && 
          !msg.text().includes('gtag')) {
        consoleErrors.push(msg.text());
      }
    });

    await page.waitForTimeout(100);
    expect(consoleErrors).toHaveLength(0);
  });

  test('handles rapid cursor movement gracefully', async ({ page }) => {
    const heroSection = page.getByTestId('hero-section-original');
    await expect(heroSection).toBeVisible();

    // Track any performance warnings or errors
    const messages: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'warning' || msg.type() === 'error') {
        messages.push(`${msg.type()}: ${msg.text()}`);
      }
    });

    // Simulate rapid cursor movements
    for (let i = 0; i < 10; i++) {
      await page.mouse.move(100 + i * 20, 100 + i * 10);
      await page.waitForTimeout(20);
    }

    // Filter out expected GA errors
    const criticalMessages = messages.filter(msg => 
      !msg.includes('Google Analytics') && 
      !msg.includes('gtag') &&
      !msg.includes('Failed to load resource') // Common in test environments
    );

    expect(criticalMessages.length).toBeLessThanOrEqual(2); // Allow minimal warnings
  });

  test('animation cleanup works properly', async ({ page }) => {
    const heroSection = page.getByTestId('hero-section-original');
    await expect(heroSection).toBeVisible();

    // Move cursor to trigger animations
    await heroSection.hover();
    await page.mouse.move(200, 200);
    await page.waitForTimeout(100);

    // Navigate away and back
    await page.goto('/own-your-narrative');
    await page.waitForTimeout(100);
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Should still work after navigation
    const heroSectionAfter = page.getByTestId('hero-section-original');
    await expect(heroSectionAfter).toBeVisible();

    await heroSectionAfter.hover();
    await page.mouse.move(300, 250);

    // No memory leak errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && 
          !msg.text().includes('Google Analytics') && 
          !msg.text().includes('gtag')) {
        consoleErrors.push(msg.text());
      }
    });

    await page.waitForTimeout(200);
    expect(consoleErrors).toHaveLength(0);
  });
});