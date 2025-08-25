import { test, expect } from '@playwright/test';

test.describe('Hero Section Optimization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test.describe('Hero Copy Reduction', () => {
    test('should display simplified hero headline with maximum 11 words', async ({ page }) => {
      // Wait for hero section to load
      await page.waitForSelector('[data-testid="hero-section"]', { timeout: 10000 });
      
      // Get the main hero headline
      const heroHeadline = page.locator('h1#hero-heading');
      await expect(heroHeadline).toBeVisible();
      
      const headlineText = await heroHeadline.textContent();
      expect(headlineText).toBeTruthy();
      
      // Remove animated adjective from word count by looking for the text without animation
      const staticText = headlineText!.replace(/\b(secure|authentic|pixel-perfect|trustworthy|exquisite|beautiful|reliable|thoughtful|innovative|modern)\b/gi, '[animated]');
      const words = staticText.trim().split(/\s+/).filter(word => word.length > 0);
      
      // Target: "We build [animated] websites you actually own" = 7 words + 1 animated = 8 total visual words
      expect(words.length).toBeLessThanOrEqual(11);
      expect(words.length).toBeGreaterThanOrEqual(6); // minimum for core message
    });

    test('should implement AnimatedAdjective component in headline', async ({ page }) => {
      await page.waitForSelector('[data-testid="hero-section"]', { timeout: 10000 });
      
      const heroHeadline = page.locator('h1#hero-heading');
      await expect(heroHeadline).toBeVisible();
      
      // Should contain the AnimatedAdjective component or one of its adjectives
      const adjectives = ['secure', 'authentic', 'pixel-perfect', 'trustworthy', 'exquisite', 'beautiful', 'reliable', 'thoughtful', 'innovative', 'modern'];
      const headlineText = await heroHeadline.textContent();
      
      const hasAnimatedAdjective = adjectives.some(adj => 
        headlineText!.toLowerCase().includes(adj.toLowerCase())
      );
      
      expect(hasAnimatedAdjective).toBe(true);
      
      // Should contain core message structure: "We build [adjective] websites you actually own"
      expect(headlineText!.toLowerCase()).toContain('we build');
      expect(headlineText!.toLowerCase()).toContain('websites');
      expect(headlineText!.toLowerCase()).toContain('you actually own');
    });

    test('should focus on core value proposition', async ({ page }) => {
      await page.waitForSelector('[data-testid="hero-section"]', { timeout: 10000 });
      
      const heroHeadline = page.locator('h1#hero-heading');
      const headlineText = await heroHeadline.textContent();
      
      // Should contain key value proposition words (at least one)
      const valueWords = [
        'security', 'custom', 'bespoke', 'precision', 'craft', 'websites',
        'digital', 'solutions', 'ownership', 'enterprise'
      ];
      
      const hasValueWord = valueWords.some(word => 
        headlineText!.toLowerCase().includes(word.toLowerCase())
      );
      
      expect(hasValueWord).toBe(true);
    });

    test('should remove verbose technical jargon', async ({ page }) => {
      await page.waitForSelector('[data-testid="hero-section"]', { timeout: 10000 });
      
      const heroContent = page.locator('section[aria-labelledby="hero-heading"]');
      const fullContent = await heroContent.textContent();
      
      // These verbose phrases should be removed or simplified
      const verbosePhrases = [
        'mathematical precision',
        'obsessive attention to detail',
        'every line of code written from scratch',
        'every pixel positioned with mathematical precision',
        'enterprise security architecture',
        'comprehensive digital narrative control',
        'artisanal web development'
      ];
      
      // WILL FAIL: Current implementation contains these verbose phrases
      for (const phrase of verbosePhrases) {
        expect(fullContent!.toLowerCase()).not.toContain(phrase.toLowerCase());
      }
    });
  });

  test.describe('Hero Content Structure', () => {
    test('should maintain clear hierarchy with h1', async ({ page }) => {
      await page.waitForSelector('[data-testid="hero-section"]', { timeout: 10000 });
      
      // Should have exactly one h1
      const h1Elements = page.locator('h1');
      await expect(h1Elements).toHaveCount(1);
      
      // h1 should have proper ID
      const mainHeading = page.locator('h1#hero-heading');
      await expect(mainHeading).toBeVisible();
      
      // Should be concise without verbose subtext (no paragraph needed)
      const heroSection = page.locator('[data-testid="hero-section"]');
      const paragraphs = heroSection.locator('p');
      await expect(paragraphs).toHaveCount(0);
    });

    test('should have single CTA button only', async ({ page }) => {
      await page.waitForSelector('[data-testid="hero-section"]', { timeout: 10000 });
      
      // Should have exactly one CTA button in the hero section
      const ctaButtons = page.locator('[data-testid="hero-section"] a');
      await expect(ctaButtons).toHaveCount(1);
      
      // Primary CTA should be present and contain expected text
      const primaryCTA = page.locator('[data-testid="hero-section"] a[href="#contact"]');
      await expect(primaryCTA).toBeVisible();
      await expect(primaryCTA).toContainText(/commission.*site/i);
      
      // Secondary CTA should NOT be present in hero section (removed for simplification)
      const secondaryCTA = page.locator('[data-testid="hero-section"] a[href*="calendly"]');
      await expect(secondaryCTA).toHaveCount(0);
    });

    test('should maintain semantic HTML structure', async ({ page }) => {
      await page.waitForSelector('[data-testid="hero-section"]', { timeout: 10000 });
      
      const heroSection = page.locator('section[aria-labelledby="hero-heading"]');
      await expect(heroSection).toBeVisible();
      
      // Should have proper aria-labelledby
      const ariaLabelledBy = await heroSection.getAttribute('aria-labelledby');
      expect(ariaLabelledBy).toBe('hero-heading');
      
      // Should have header element
      const headerElement = page.locator('section[aria-labelledby="hero-heading"] header');
      await expect(headerElement).toBeVisible();
    });
  });

  test.describe('Hero Performance Impact', () => {
    test('should load quickly with reduced content', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('http://localhost:3000');
      await page.waitForSelector('h1#hero-heading', { timeout: 10000 });
      
      const loadTime = Date.now() - startTime;
      
      // Should load hero content within 2 seconds
      expect(loadTime).toBeLessThan(2000);
    });

    test('should maintain responsive design with shorter content', async ({ page }) => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('http://localhost:3000');
      
      const heroHeadline = page.locator('h1#hero-heading');
      await expect(heroHeadline).toBeVisible();
      
      // Text should not overflow on mobile
      const boundingBox = await heroHeadline.boundingBox();
      expect(boundingBox).toBeTruthy();
      expect(boundingBox!.width).toBeLessThanOrEqual(375);
      
      // Test tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(heroHeadline).toBeVisible();
      
      // Test desktop viewport
      await page.setViewportSize({ width: 1024, height: 768 });
      await expect(heroHeadline).toBeVisible();
    });
  });

  test.describe('SEO Impact of Hero Changes', () => {
    test('should maintain SEO-friendly headline structure', async ({ page }) => {
      await page.goto('http://localhost:3000');
      
      const h1 = page.locator('h1#hero-heading');
      await expect(h1).toBeVisible();
      
      const h1Text = await h1.textContent();
      
      // Should contain primary keywords even when shortened
      const primaryKeywords = ['web', 'websites', 'development', 'custom', 'security'];
      const hasKeywords = primaryKeywords.some(keyword => 
        h1Text!.toLowerCase().includes(keyword.toLowerCase())
      );
      
      expect(hasKeywords).toBe(true);
    });

    test('should preserve meta title optimization alignment', async ({ page }) => {
      await page.goto('http://localhost:3000');
      
      const title = await page.title();
      const h1Text = await page.locator('h1#hero-heading').textContent();
      
      // Meta title and H1 should be aligned but not identical
      expect(title.length).toBeGreaterThan(0);
      expect(h1Text!.length).toBeGreaterThan(0);
      
      // Should share common themes
      const commonWords = ['web', 'development', 'melbourne', 'custom', 'security'];
      const titleLower = title.toLowerCase();
      const h1Lower = h1Text!.toLowerCase();
      
      const sharedThemes = commonWords.filter(word => 
        titleLower.includes(word) && h1Lower.includes(word)
      );
      
      expect(sharedThemes.length).toBeGreaterThanOrEqual(1);
    });
  });
});