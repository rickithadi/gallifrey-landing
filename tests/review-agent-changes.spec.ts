import { test, expect } from '@playwright/test';

test.describe('Review Agent Changes', () => {
  test.describe('Own Your Narrative Section', () => {
    test('should have a consistent color palette', async ({ page }) => {
      await page.goto('/own-your-narrative');
      const ownershipSection = page.locator('text=What Ownership Looks Like').locator('..').locator('..');
      await expect(ownershipSection).toHaveScreenshot('own-your-narrative-ownership-section.png');
    });
  });

  test.describe('Lightweight Hero', () => {
    test('should be responsive', async ({ page }) => {
      await page.goto('/?layout_variant=lightweight');
      const heroSection = page.locator('[data-testid="hero-section-lightweight"]');

      // Test on mobile
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(heroSection).toHaveScreenshot('lightweight-hero-mobile.png');

      // Test on tablet
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(heroSection).toHaveScreenshot('lightweight-hero-tablet.png');

      // Test on desktop
      await page.setViewportSize({ width: 1280, height: 720 });
      await expect(heroSection).toHaveScreenshot('lightweight-hero-desktop.png');
    });
  });
});
