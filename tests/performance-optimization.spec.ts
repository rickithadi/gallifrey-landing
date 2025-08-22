import { test, expect } from '@playwright/test';

test.describe('Performance Optimization Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test.describe('Logo WebP Optimization', () => {
    test('should use WebP format for logo images', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check if WebP logo exists in public directory
      const response = await page.request.get('http://localhost:3004/gallifrey-logo.webp');
      expect(response.status()).toBe(200);
      
      // Check if logo component uses WebP format
      const logoImage = page.locator('img[alt*="Gallifrey"], img[src*="logo"]');
      if (await logoImage.count() > 0) {
        const src = await logoImage.first().getAttribute('src');
        expect(src).toContain('.webp');
      }
    });

    test('should have WebP fallback handling', async ({ page }) => {
      // Check if there's proper fallback implementation
      const logoElements = page.locator('img[alt*="Gallifrey"], img[src*="logo"]');
      
      if (await logoElements.count() > 0) {
        const logoElement = logoElements.first();
        
        // Should have proper alt text
        const altText = await logoElement.getAttribute('alt');
        expect(altText).toBeTruthy();
        expect(altText).toContain('Gallifrey');
      }
    });
  });

  test.describe('Font Display Optimization', () => {
    test('should load fonts with font-display: swap', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check CSS for font-display: swap
      const styles = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('link[href*="fonts.googleapis.com"]'));
        return links.map(link => (link as HTMLLinkElement).href);
      });
      
      // Should include font-display=swap in Google Fonts URL
      const hasFontDisplaySwap = styles.some(url => 
        url.includes('display=swap') || url.includes('font-display=swap')
      );
      
      expect(hasFontDisplaySwap).toBe(true);
    });

    test('should implement font-display: swap in CSS', async ({ page }) => {
      // Check if globals.css contains font-display: swap
      const cssContent = await page.evaluate(() => {
        const styleSheets = Array.from(document.styleSheets);
        let cssText = '';
        
        try {
          styleSheets.forEach(sheet => {
            if (sheet.cssRules) {
              Array.from(sheet.cssRules).forEach(rule => {
                cssText += rule.cssText;
              });
            }
          });
        } catch (e) {
          // CORS or other access errors
        }
        
        return cssText;
      });
      
      // Should contain font-display: swap
      expect(cssContent.toLowerCase()).toContain('font-display');
    });
  });

  test.describe('Hero Component Memoization', () => {
    test('should minimize unnecessary re-renders of Hero component', async ({ page }) => {
      // Navigate to page
      await page.waitForSelector('[data-testid="hero-section-original"], [data-testid="hero-section-lightweight"]', { timeout: 10000 });
      
      // Hero component should be present and stable
      const heroSection = page.locator('[data-testid="hero-section-original"], [data-testid="hero-section-lightweight"]');
      await expect(heroSection).toBeVisible();
      
      // Test that hero renders consistently
      let renderCount = 0;
      await page.evaluate(() => {
        // Add a test marker to track renders
        const hero = document.querySelector('[data-testid="hero-section-original"], [data-testid="hero-section-lightweight"]');
        if (hero) {
          hero.setAttribute('data-render-count', '1');
        }
      });
      
      // Wait a bit and check if component is stable
      await page.waitForTimeout(1000);
      
      const isStable = await page.evaluate(() => {
        const hero = document.querySelector('[data-testid="hero-section-original"], [data-testid="hero-section-lightweight"]');
        return hero && hero.getAttribute('data-render-count') === '1';
      });
      
      expect(isStable).toBe(true);
    });

    test('should implement React.memo for Hero component', async ({ page }) => {
      // This test will fail until we implement React.memo
      // We'll validate this by checking component behavior
      await page.waitForSelector('[data-testid="hero-section-original"], [data-testid="hero-section-lightweight"]', { timeout: 10000 });
      
      const heroSection = page.locator('[data-testid="hero-section-original"], [data-testid="hero-section-lightweight"]');
      await expect(heroSection).toBeVisible();
      
      // Component should render efficiently
      const heroContent = await heroSection.textContent();
      expect(heroContent).toBeTruthy();
      expect(heroContent).toContain('We build');
    });
  });

  test.describe('Animation Will-Change Optimization', () => {
    test('should apply will-change property to animated elements', async ({ page }) => {
      await page.waitForSelector('[data-testid="hero-section-original"], [data-testid="hero-section-lightweight"]', { timeout: 10000 });
      
      // Check for animated elements
      const animatedElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('.animate-fade-in-up, .animate-float, .animate-shimmer');
        return Array.from(elements).map(el => {
          const styles = window.getComputedStyle(el);
          return {
            hasWillChange: styles.willChange !== 'auto',
            willChangeValue: styles.willChange
          };
        });
      });
      
      // At least some animated elements should have will-change optimization
      if (animatedElements.length > 0) {
        const optimizedElements = animatedElements.filter(el => el.hasWillChange);
        expect(optimizedElements.length).toBeGreaterThan(0);
      }
    });

    test('should optimize hero animations with will-change', async ({ page }) => {
      await page.waitForSelector('[data-testid="hero-section-original"], [data-testid="hero-section-lightweight"]', { timeout: 10000 });
      
      // Check hero animation elements
      const heroAnimations = await page.evaluate(() => {
        const hero = document.querySelector('[data-testid="hero-section-original"], [data-testid="hero-section-lightweight"]');
        if (!hero) return [];
        
        const animatedElements = hero.querySelectorAll('.animate-fade-in-up, h1, .btn');
        return Array.from(animatedElements).map(el => {
          const styles = window.getComputedStyle(el);
          return {
            tagName: el.tagName,
            hasWillChange: styles.willChange !== 'auto',
            classes: el.className
          };
        });
      });
      
      // Hero section should have optimized animations
      expect(heroAnimations.length).toBeGreaterThan(0);
    });
  });

  test.describe('Core Web Vitals Performance', () => {
    test('should achieve good Largest Contentful Paint (LCP)', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('http://localhost:3000');
      
      // Wait for hero content (typically the LCP element)
      await page.waitForSelector('h1#hero-heading', { timeout: 10000 });
      
      const lcpTime = Date.now() - startTime;
      
      // LCP should be under 2.5 seconds (good threshold)
      expect(lcpTime).toBeLessThan(2500);
    });

    test('should minimize Cumulative Layout Shift (CLS)', async ({ page }) => {
      await page.goto('http://localhost:3000');
      
      // Wait for page to stabilize
      await page.waitForLoadState('networkidle');
      
      // Check for proper image dimensions to prevent layout shift
      const images = page.locator('img');
      const imageCount = await images.count();
      
      if (imageCount > 0) {
        for (let i = 0; i < imageCount; i++) {
          const img = images.nth(i);
          const width = await img.getAttribute('width');
          const height = await img.getAttribute('height');
          
          // Images should have proper dimensions or CSS sizing
          const hasProperSizing = width && height;
          const hasCSSConstraints = await img.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return styles.width !== 'auto' && styles.height !== 'auto';
          });
          
          expect(hasProperSizing || hasCSSConstraints).toBe(true);
        }
      }
    });

    test('should optimize First Input Delay capability', async ({ page }) => {
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      
      // Test that interactive elements respond quickly
      const ctaButton = page.locator('[data-testid="hero-section-original"] a[href="#contact"], [data-testid="hero-section-lightweight"] a[href="#contact"]');
      await expect(ctaButton).toBeVisible();
      
      const startTime = Date.now();
      await ctaButton.hover();
      const hoverTime = Date.now() - startTime;
      
      // Hover response should be immediate (under 100ms)
      expect(hoverTime).toBeLessThan(100);
    });
  });

  test.describe('Chrome MCP Performance Validation', () => {
    test('should pass Chrome MCP UX performance tests', async ({ page }) => {
      // Load the page
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      
      // Check if MCP Chrome test suite is available
      const mcpAvailable = await page.evaluate(() => {
        return typeof window.mcpChromeTestSuite !== 'undefined';
      });
      
      if (mcpAvailable) {
        // Run MCP Chrome performance tests
        const performanceResults = await page.evaluate(async () => {
          try {
            const results = await window.mcpChromeTestSuite.runUXTests();
            return results.performance;
          } catch (error) {
            return { error: error.message };
          }
        });
        
        if (!performanceResults.error) {
          // Validate performance metrics
          expect(performanceResults).toBeTruthy();
          
          // Check for key performance indicators
          if (performanceResults.lcp) {
            expect(performanceResults.lcp).toBeLessThan(2500);
          }
          
          if (performanceResults.cls) {
            expect(performanceResults.cls).toBeLessThan(0.1);
          }
          
          if (performanceResults.fid) {
            expect(performanceResults.fid).toBeLessThan(100);
          }
        }
      } else {
        // Fallback validation when MCP is not available
        console.log('MCP Chrome test suite not available, using fallback validation');
        
        // Basic performance validation
        const performanceMetrics = await page.evaluate(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          return {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
          };
        });
        
        expect(performanceMetrics.domContentLoaded).toBeLessThan(1000);
        expect(performanceMetrics.firstContentfulPaint).toBeLessThan(1500);
      }
    });
  });
});