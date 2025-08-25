import { test, expect } from '@playwright/test';

test.describe('SEO Optimization', () => {
  test.describe('Title Optimization', () => {
    test.describe('Main Landing Page', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000');
      });

      test('should have title under 60 characters for optimal SERP display', async ({ page }) => {
        const title = await page.title();
        
        // WILL FAIL: Current title is very long (120+ characters)
        expect(title.length).toBeLessThanOrEqual(60);
        expect(title.length).toBeGreaterThanOrEqual(30); // Minimum for SEO effectiveness
      });

      test('should contain primary keywords in optimized title', async ({ page }) => {
        const title = await page.title();
        
        // Should contain essential keywords even when shortened
        const requiredKeywords = ['Melbourne', 'Web Development'];
        
        for (const keyword of requiredKeywords) {
          expect(title).toContain(keyword);
        }
        
        // Should contain at least one of these value keywords
        const valueKeywords = ['Custom', 'Security', 'Agency', 'Websites'];
        const hasValueKeyword = valueKeywords.some(keyword => 
          title.toLowerCase().includes(keyword.toLowerCase())
        );
        
        expect(hasValueKeyword).toBe(true);
      });

      test('should remove redundant words from title', async ({ page }) => {
        const title = await page.title();
        
        // These redundant phrases should be removed
        const redundantPhrases = [
          'SEO & Digital Marketing',
          'Custom Security-First Websites',
          'Gallifrey Consulting' // appears twice in current title
        ];
        
        // Should not have excessive repetition
        const wordCounts = new Map<string, number>();
        const words = title.toLowerCase().split(/\s+/);
        
        words.forEach(word => {
          const cleanWord = word.replace(/[^\w]/g, '');
          if (cleanWord.length > 2) {
            wordCounts.set(cleanWord, (wordCounts.get(cleanWord) || 0) + 1);
          }
        });
        
        // No word should appear more than twice
        for (const [word, count] of wordCounts) {
          expect(count).toBeLessThanOrEqual(2);
        }
      });

      test('should maintain brand name in optimized title', async ({ page }) => {
        const title = await page.title();
        
        // Should still contain brand name
        expect(title).toContain('Gallifrey');
      });
    });

    test.describe('Own Your Narrative Page', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/own-your-narrative');
      });

      test('should have campaign-specific title under 60 characters', async ({ page }) => {
        const title = await page.title();
        
        // WILL FAIL: Current OYN title is also long
        expect(title.length).toBeLessThanOrEqual(60);
        expect(title.length).toBeGreaterThanOrEqual(30);
      });

      test('should contain campaign-specific keywords', async ({ page }) => {
        const title = await page.title();
        
        // Should contain campaign keywords
        const campaignKeywords = ['Digital', 'Narrative', 'Independence'];
        const hasCampaignKeyword = campaignKeywords.some(keyword => 
          title.toLowerCase().includes(keyword.toLowerCase())
        );
        
        expect(hasCampaignKeyword).toBe(true);
      });
    });
  });

  test.describe('Meta Description Optimization', () => {
    test('should have meta description under 160 characters', async ({ page }) => {
      await page.goto('http://localhost:3000');
      
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      
      if (metaDescription) {
        // WILL FAIL: Current meta description is very long
        expect(metaDescription.length).toBeLessThanOrEqual(160);
        expect(metaDescription.length).toBeGreaterThanOrEqual(120); // Minimum for effective description
      }
    });

    test('should remove verbose language from meta description', async ({ page }) => {
      await page.goto('http://localhost:3000');
      
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      
      if (metaDescription) {
        // Should not contain overly verbose phrases
        const verbosePhrases = [
          'delivering measurable results',
          '340% SEO traffic growth',
          'complete digital narrative control',
          'hand-coded solutions',
          'enterprise-grade privacy protection'
        ];
        
        // WILL FAIL: Current description contains verbose marketing language
        for (const phrase of verbosePhrases) {
          expect(metaDescription.toLowerCase()).not.toContain(phrase.toLowerCase());
        }
      }
    });
  });

  test.describe('Performance Improvements', () => {
    test.describe('Logo Optimization', () => {
      test('should use WebP format for logo images', async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.waitForSelector('header', { timeout: 10000 });
        
        // Check for logo images
        const logoImages = page.locator('img[src*="logo"], img[alt*="logo"], img[alt*="Gallifrey"]');
        const logoCount = await logoImages.count();
        
        if (logoCount > 0) {
          for (let i = 0; i < logoCount; i++) {
            const logoSrc = await logoImages.nth(i).getAttribute('src');
            
            if (logoSrc) {
              // WILL FAIL: Current logo is PNG, should be WebP
              expect(logoSrc).toContain('.webp');
              expect(logoSrc).not.toContain('.png');
            }
          }
        }
      });

      test('should have proper logo dimensions and optimization', async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.waitForSelector('header', { timeout: 10000 });
        
        const logoImages = page.locator('img[src*="logo"], img[alt*="logo"]');
        const logoCount = await logoImages.count();
        
        if (logoCount > 0) {
          const logo = logoImages.first();
          
          // Should have proper alt text
          const altText = await logo.getAttribute('alt');
          expect(altText).toBeTruthy();
          expect(altText!.length).toBeGreaterThan(5);
          
          // Should have proper dimensions
          const boundingBox = await logo.boundingBox();
          expect(boundingBox).toBeTruthy();
          expect(boundingBox!.width).toBeGreaterThan(0);
          expect(boundingBox!.height).toBeGreaterThan(0);
        }
      });
    });

    test.describe('Font Loading Optimization', () => {
      test('should use font-display: swap for optimal font loading', async ({ page }) => {
        await page.goto('http://localhost:3000');
        
        // Check CSS for font-display optimization
        const cssContent = await page.evaluate(() => {
          const stylesheets = Array.from(document.styleSheets);
          let allCSS = '';
          
          try {
            for (const sheet of stylesheets) {
              if (sheet.href && sheet.href.includes('googleapis')) {
                // Check Google Fonts URL
                allCSS += sheet.href;
              }
            }
          } catch (e) {
            // Handle CORS issues
          }
          
          return allCSS;
        });
        
        // WILL FAIL: Current implementation uses font-display=fallback
        // Should use font-display=swap for better performance
        if (cssContent.includes('googleapis')) {
          expect(cssContent).toContain('font-display=swap');
          expect(cssContent).not.toContain('font-display=fallback');
        }
      });

      test('should load fonts efficiently', async ({ page }) => {
        const startTime = Date.now();
        
        await page.goto('http://localhost:3000');
        await page.waitForSelector('h1', { timeout: 10000 });
        
        // Check that fonts load within reasonable time
        const loadTime = Date.now() - startTime;
        expect(loadTime).toBeLessThan(3000);
        
        // Check that text is visible (not invisible during font load)
        const h1 = page.locator('h1#hero-heading');
        const opacity = await h1.evaluate(el => window.getComputedStyle(el).opacity);
        expect(parseFloat(opacity)).toBeGreaterThan(0);
      });
    });

    test.describe('Component Memoization', () => {
      test('should have optimized component rendering', async ({ page }) => {
        await page.goto('http://localhost:3000');
        
        // Test initial load time
        const startTime = Date.now();
        await page.waitForSelector('main', { timeout: 10000 });
        const initialLoadTime = Date.now() - startTime;
        
        expect(initialLoadTime).toBeLessThan(3000);
        
        // Test interaction responsiveness (suggesting good memoization)
        const navButton = page.locator('header button, header [role="button"]');
        
        if (await navButton.count() > 0) {
          const interactionStart = Date.now();
          await navButton.first().click();
          await page.waitForTimeout(100);
          const interactionTime = Date.now() - interactionStart;
          
          // Interactions should be fast with proper memoization
          expect(interactionTime).toBeLessThan(200);
        }
      });

      test('should minimize unnecessary re-renders', async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.waitForSelector('main', { timeout: 10000 });
        
        // Scroll to test if animations re-trigger unnecessarily
        await page.evaluate(() => window.scrollTo(0, 500));
        await page.waitForTimeout(100);
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(100);
        
        // Page should remain responsive after scroll interactions
        const heroSection = page.locator('section[aria-labelledby="hero-heading"]');
        await expect(heroSection).toBeVisible();
        
        const isStable = await page.evaluate(() => {
          return !document.body.classList.contains('rendering') && 
                 !document.documentElement.classList.contains('loading');
        });
        
        expect(isStable).toBe(true);
      });
    });
  });

  test.describe('Core Web Vitals Impact', () => {
    test('should maintain good Largest Contentful Paint (LCP)', async ({ page }) => {
      await page.goto('http://localhost:3000');
      
      const lcpTime = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.startTime);
          });
          
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
          
          // Fallback timeout
          setTimeout(() => resolve(0), 5000);
        });
      });
      
      if (lcpTime > 0) {
        // LCP should be under 2.5 seconds for good performance
        expect(lcpTime).toBeLessThan(2500);
      }
    });

    test('should have minimal Cumulative Layout Shift (CLS)', async ({ page }) => {
      await page.goto('http://localhost:3000');
      await page.waitForSelector('main', { timeout: 10000 });
      
      // Wait for page to settle
      await page.waitForTimeout(2000);
      
      const clsScore = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let cumulativeScore = 0;
          
          const observer = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if ((entry as any).hadRecentInput) continue;
              cumulativeScore += (entry as any).value;
            }
          });
          
          observer.observe({ entryTypes: ['layout-shift'] });
          
          setTimeout(() => {
            observer.disconnect();
            resolve(cumulativeScore);
          }, 3000);
        });
      });
      
      // CLS should be under 0.1 for good performance
      expect(clsScore).toBeLessThan(0.1);
    });

    test('should have fast First Input Delay capability', async ({ page }) => {
      await page.goto('http://localhost:3000');
      await page.waitForSelector('main', { timeout: 10000 });
      
      // Test interaction responsiveness
      const button = page.locator('button, a[href]').first();
      
      if (await button.count() > 0) {
        const startTime = Date.now();
        await button.click();
        const interactionTime = Date.now() - startTime;
        
        // Should respond quickly (under 100ms for good FID)
        expect(interactionTime).toBeLessThan(100);
      }
    });
  });

  test.describe('Technical SEO Validation', () => {
    test('should maintain proper structured data after optimizations', async ({ page }) => {
      await page.goto('http://localhost:3000');
      
      // Check for JSON-LD structured data
      const structuredData = await page.locator('script[type="application/ld+json"]').textContent();
      
      expect(structuredData).toBeTruthy();
      
      // Should be valid JSON
      const jsonData = JSON.parse(structuredData!);
      expect(jsonData['@context']).toBe('https://schema.org');
      expect(jsonData['@graph']).toBeTruthy();
      
      // Should contain Organization data
      const orgData = jsonData['@graph'].find((item: any) => item['@type'] === 'Organization');
      expect(orgData).toBeTruthy();
      expect(orgData.name).toBe('Gallifrey Consulting');
    });

    test('should have proper canonical URLs', async ({ page }) => {
      await page.goto('http://localhost:3000');
      
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      
      expect(canonical).toBe('https://gallifrey.consulting');
    });

    test('should maintain proper heading hierarchy', async ({ page }) => {
      await page.goto('http://localhost:3000');
      await page.waitForSelector('main', { timeout: 10000 });
      
      // Should have exactly one H1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
      
      // H1 should come before H2s
      const firstH1 = page.locator('h1').first();
      const firstH2 = page.locator('h2').first();
      
      if (await firstH2.count() > 0) {
        const h1Box = await firstH1.boundingBox();
        const h2Box = await firstH2.boundingBox();
        
        expect(h1Box!.y).toBeLessThan(h2Box!.y);
      }
    });

    test('should have optimized meta robots directive', async ({ page }) => {
      await page.goto('http://localhost:3000');
      
      const robotsMeta = await page.locator('meta[name="robots"]').getAttribute('content');
      
      // Should allow indexing and following
      if (robotsMeta) {
        expect(robotsMeta).toContain('index');
        expect(robotsMeta).toContain('follow');
      }
    });
  });

  test.describe('Mobile SEO Optimization', () => {
    test('should maintain mobile-friendly structure after optimizations', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('http://localhost:3000');
      
      // Check viewport meta tag
      const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
      expect(viewport).toContain('width=device-width');
      expect(viewport).toContain('initial-scale=1');
      
      // Text should be readable without zooming
      const h1 = page.locator('h1#hero-heading');
      const fontSize = await h1.evaluate(el => {
        return parseInt(window.getComputedStyle(el).fontSize);
      });
      
      expect(fontSize).toBeGreaterThanOrEqual(24); // Minimum mobile font size
    });

    test('should have mobile-optimized title length', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('http://localhost:3000');
      
      const title = await page.title();
      
      // Mobile SERPs show even less text, should be under 50 characters ideally
      expect(title.length).toBeLessThanOrEqual(50);
    });
  });
});