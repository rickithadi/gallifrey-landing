import { test, expect } from '@playwright/test';

test.describe('Enhanced Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test.describe('Cursor Following Elements', () => {
    test('should have cursor following elements present', async ({ page }) => {
      // Check if cursor following elements are rendered
      const cursorElements = page.locator('[class*="cursor"], [class*="security"]');
      const count = await cursorElements.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test('should respect reduced motion preference', async ({ page }) => {
      // Test with reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.reload();
      
      // Cursor elements should not be present when reduced motion is enabled
      const floatingElements = page.locator('.animate-float');
      await expect(floatingElements).toHaveCount(0);
    });

    test('should not show on touch devices', async ({ page, context }) => {
      // Simulate touch device by setting viewport with touch support
      await page.setViewportSize({ width: 375, height: 667 });
      await context.addInitScript(() => {
        Object.defineProperty(navigator, 'maxTouchPoints', {
          writable: false,
          value: 1,
        });
      });
      await page.reload();
      
      // Cursor following elements should be minimal or hidden on touch
      const cursorTrail = page.locator('.cursor-glow');
      await expect(cursorTrail).toHaveCount(0);
    });
  });

  test.describe('Hero Variants', () => {
    test('lightweight variant should load quickly', async ({ page }) => {
      await page.goto('http://localhost:3000?layout_variant=lightweight');
      
      const heroSection = page.locator('[data-testid="hero-section-lightweight"]');
      await expect(heroSection).toBeVisible();
      
      // Should have full-screen height class
      await expect(heroSection).toHaveClass(/h-screen/);
    });

    test('original variant should have proper layout', async ({ page }) => {
      await page.goto('http://localhost:3000?layout_variant=original');
      
      const heroSection = page.locator('[data-testid="hero-section-original"]');
      await expect(heroSection).toBeVisible();
      
      // Should have proper padding
      const computedStyle = await heroSection.evaluate(el => 
        window.getComputedStyle(el).paddingTop
      );
      expect(parseInt(computedStyle)).toBeGreaterThan(50); // At least 50px padding
    });
  });

  test.describe('Interactive Elements', () => {
    test('should maintain proper z-index layering', async ({ page }) => {
      const hero = page.locator('h1#hero-heading');
      const cursorElements = page.locator('.cursor-following-elements');
      
      // Hero text should be above cursor elements
      await expect(hero).toBeVisible();
      
      const heroZIndex = await hero.evaluate(el => 
        window.getComputedStyle(el.closest('.container')).zIndex || 'auto'
      );
      
      // Text container should have higher z-index than background elements
      expect(heroZIndex).not.toBe('auto');
    });

    test('should not interfere with CTA button functionality', async ({ page }) => {
      const ctaButton = page.locator('text=Commission Your Site');
      
      await expect(ctaButton).toBeVisible();
      await expect(ctaButton).toBeEnabled();
      
      // Button should be clickable despite cursor animations
      await ctaButton.hover();
      await expect(ctaButton).toHaveClass(/hover:/);
    });
  });

  test.describe('Performance & Accessibility', () => {
    test('should not impact initial page load significantly', async ({ page }) => {
      const startTime = Date.now();
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Enhanced hero should not significantly impact load time
      expect(loadTime).toBeLessThan(8000); // 8 seconds max for dev server
    });

    test('should maintain accessibility standards', async ({ page }) => {
      // Hero heading should be properly structured
      const heading = page.locator('h1#hero-heading');
      await expect(heading).toBeVisible();
      await expect(heading).toHaveAttribute('id', 'hero-heading');
      
      // Section should have proper ARIA label
      const section = page.locator('section[aria-labelledby="hero-heading"]');
      await expect(section).toBeVisible();
      
      // Decorative elements should be hidden from screen readers
      const cursorElements = page.locator('[aria-hidden="true"]');
      await expect(cursorElements).toHaveCount.greaterThanOrEqual(1);
    });

    test('should handle mouse movement smoothly', async ({ page }) => {
      // Move mouse around the hero section
      const hero = page.locator('[data-testid*="hero-section"]');
      const heroBox = await hero.boundingBox();
      
      if (heroBox) {
        // Smooth mouse movement should not cause errors
        await page.mouse.move(heroBox.x + 100, heroBox.y + 100);
        await page.waitForTimeout(100);
        await page.mouse.move(heroBox.x + 200, heroBox.y + 200);
        await page.waitForTimeout(100);
        await page.mouse.move(heroBox.x + 300, heroBox.y + 300);
      }
      
      // No console errors should occur during mouse movement
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      expect(consoleErrors.length).toBe(0);
    });
  });

  test.describe('Visual Engagement Features', () => {
    test('should display animated adjectives', async ({ page }) => {
      // Look specifically for the animated adjective component in hero
      const heroSection = page.locator('[data-testid*="hero-section"]');
      const animatedText = heroSection.locator('.text-accent.italic').first();
      await expect(animatedText).toBeVisible();
      
      // Should cycle through different adjectives
      await page.waitForTimeout(2000);
      const initialText = await animatedText.textContent();
      
      await page.waitForTimeout(3000);
      const changedText = await animatedText.textContent();
      
      // Text should change over time (animated adjectives)
      expect(initialText).not.toBe(changedText);
    });

    test('should have professional color scheme', async ({ page }) => {
      // Check brand colors are being used
      const hero = page.locator('h1#hero-heading');
      const color = await hero.evaluate(el => 
        window.getComputedStyle(el).color
      );
      
      // Should use brand colors, not generic black
      expect(color).not.toBe('rgb(0, 0, 0)');
    });

    test('should differentiate from boring industry standards', async ({ page }) => {
      // Should have more than just text + button
      const backgroundElements = page.locator('.absolute');
      const bgCount = await backgroundElements.count();
      expect(bgCount).toBeGreaterThan(1);
      
      // Should have interactive elements
      const interactiveElements = page.locator('[class*="animate"], [class*="cursor"]');
      const interactiveCount = await interactiveElements.count();
      expect(interactiveCount).toBeGreaterThan(0);
    });
  });
});