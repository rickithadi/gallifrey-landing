import { test, expect } from '@playwright/test';

test.describe('Hero Design Review', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Hero section has engaging visual elements', async ({ page }) => {
    // Check animated adjectives
    const animatedElement = page.locator('[class*="text-accent"][class*="italic"]').first();
    await expect(animatedElement).toBeVisible();

    // Check for visual background elements
    const backgroundElements = page.locator('.absolute');
    const count = await backgroundElements.count();
    expect(count).toBeGreaterThan(0);

    // Check hero has proper styling
    const heroSection = page.locator('[data-testid*="hero-section"]');
    await expect(heroSection).toBeVisible();
    await expect(heroSection).toHaveClass(/relative/);
  });

  test('Hero differentiates from boring industry standards', async ({ page }) => {
    // Should have interactive elements beyond just text + button
    const interactiveElements = page.locator('[class*="animate"], [class*="transition"], [class*="hover"]');
    const interactiveCount = await interactiveElements.count();
    expect(interactiveCount).toBeGreaterThan(2);

    // Should have multiple visual layers
    const visualLayers = page.locator('.absolute, .relative');
    const layerCount = await visualLayers.count();
    expect(layerCount).toBeGreaterThan(3);

    // Check for brand colors (not generic black/white)
    const heroHeading = page.locator('h1#hero-heading');
    const headingColor = await heroHeading.evaluate(el => 
      window.getComputedStyle(el).color
    );
    expect(headingColor).not.toBe('rgb(0, 0, 0)'); // Not pure black
    expect(headingColor).not.toBe('rgb(255, 255, 255)'); // Not pure white
  });

  test('Hero maintains professional credibility', async ({ page }) => {
    // Should have proper heading structure
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveAttribute('id', 'hero-heading');

    // Should have clear CTA
    const ctaButton = page.locator('text=Commission Your Site');
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toBeEnabled();

    // Should not have distracting animations (subtle only)
    const strongAnimations = page.locator('[class*="animate-bounce"], [class*="animate-spin"], [class*="animate-pulse"]');
    const strongAnimCount = await strongAnimations.count();
    expect(strongAnimCount).toBeLessThan(3); // Minimal strong animations
  });

  test('Both hero variants work properly', async ({ page }) => {
    // Test lightweight variant
    await page.goto('http://localhost:3000?layout_variant=lightweight');
    const lightweightHero = page.locator('[data-testid="hero-section-lightweight"]');
    await expect(lightweightHero).toBeVisible();
    await expect(lightweightHero).toHaveClass(/h-screen/);

    // Test original variant
    await page.goto('http://localhost:3000?layout_variant=original');
    const originalHero = page.locator('[data-testid="hero-section-original"]');
    await expect(originalHero).toBeVisible();
    await expect(originalHero).toHaveClass(/py-24/);
  });

  test('Hero performance is acceptable', async ({ page }) => {
    const startTime = Date.now();
    
    // Navigate and wait for hero to be interactive
    await page.goto('http://localhost:3000');
    await page.waitForSelector('h1#hero-heading');
    await page.waitForSelector('text=Commission Your Site');
    
    const loadTime = Date.now() - startTime;
    
    // Hero should load within reasonable time
    expect(loadTime).toBeLessThan(5000);
  });
});