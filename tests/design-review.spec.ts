import { test, expect } from '@playwright/test';
const DesignReviewer = require('../scripts/design-review/design-reviewer.js');

test.describe('Automated Design Review Integration', () => {
  test('runs comprehensive design review', async ({ page }) => {
    const reviewer = new DesignReviewer();
    
    // Override the browser creation to use the current page
    const originalReview = reviewer.review;
    reviewer.review = async function(url) {
      console.log('🎨 Starting automated design review...');
      
      try {
        // Review main landing page
        await this.reviewPageWithExistingContext(page, '/', 'main-landing', 'gallifrey');
        
        // Review Own Your Narrative campaign page  
        await this.reviewPageWithExistingContext(page, '/own-your-narrative', 'campaign', 'ownYourNarrative');
        
        // Generate report
        await this.generateReport();
        
      } catch (error) {
        console.error('Design review error:', error);
        throw error;
      }
      
      return this.results;
    };
    
    // Add method to use existing page context
    reviewer.reviewPageWithExistingContext = async function(page, url, pageName, brandContext) {
      console.log(`📄 Reviewing ${pageName} page...`);
      
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      // Take screenshot for visual reference
      const screenshotPath = `design-review-${pageName}-${Date.now()}.png`;
      await page.screenshot({ 
        path: `test-results/${screenshotPath}`, 
        fullPage: true 
      });
      this.results.screenshots.push(screenshotPath);
      
      // Run validation checks
      await this.checkBrandConsistency(page, brandContext, pageName);
      await this.checkTypography(page, pageName);
      await this.checkAccessibility(page, pageName);
      await this.checkResponsiveness(page, pageName);
      await this.checkSEO(page, pageName);
    };
    
    // Run the design review
    const results = await reviewer.review('http://localhost:3000');
    
    // Assert review results
    expect(results).toBeDefined();
    expect(results.summary).toBeDefined();
    
    // Check that we have a reasonable score
    expect(results.summary.score).toBeGreaterThanOrEqual(70);
    
    // Ensure no critical issues
    const criticalIssues = results.issues.filter(issue => 
      issue.category === 'Accessibility' || 
      issue.category === 'Brand Consistency'
    );
    expect(criticalIssues.length).toBe(0);
    
    // Log results for visibility
    console.log(`Design Review Score: ${results.summary.score}%`);
    console.log(`Issues: ${results.issues.length}, Warnings: ${results.warnings.length}, Passed: ${results.passed.length}`);
    
    if (results.issues.length > 0) {
      console.log('Critical Issues Found:');
      results.issues.forEach(issue => {
        console.log(`  - ${issue.page}: ${issue.category} - ${issue.message}`);
      });
    }
  });

  test('validates Gallifrey brand consistency', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for Gallifrey brand elements
    const gallfreyElements = page.locator('[class*="gallifrey"]');
    await expect(gallfreyElements.first()).toBeVisible();
    
    // Ensure no campaign styles leak into main brand
    const campaignElements = page.locator('[class*="oyn-"]');
    const campaignCount = await campaignElements.count();
    expect(campaignCount).toBe(0);
    
    // Check primary brand color usage
    const brandColorElements = page.locator('[class*="teal"], [style*="#1B365D"], [style*="#2EC4B6"]');
    await expect(brandColorElements.first()).toBeVisible();
  });

  test('validates Own Your Narrative campaign consistency', async ({ page }) => {
    await page.goto('/own-your-narrative');
    await page.waitForLoadState('networkidle');
    
    // Check for campaign-specific elements
    const campaignElements = page.locator('[class*="oyn-"], [class*="gradient"], [class*="stone"], [class*="orange"]');
    await expect(campaignElements.first()).toBeVisible();
    
    // Check for campaign messaging
    const campaignText = page.locator('text=/Own Your Narrative|platform independence|digital sovereignty/i');
    await expect(campaignText.first()).toBeVisible();
    
    // Verify gradient implementation
    const gradientElements = page.locator('[style*="gradient"], [class*="gradient"]');
    await expect(gradientElements.first()).toBeVisible();
  });

  test('validates typography hierarchy across both brands', async ({ page }) => {
    // Test main brand typography
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    
    const h1FontFamily = await h1.evaluate(el => getComputedStyle(el).fontFamily);
    expect(h1FontFamily).toContain('Montserrat');
    
    // Test campaign typography
    await page.goto('/own-your-narrative');
    await page.waitForLoadState('networkidle');
    
    const campaignH1 = page.locator('h1');
    await expect(campaignH1).toHaveCount(1);
    
    // Check for heavier font weights in campaign
    const heavyText = page.locator('[class*="font-bold"], [class*="font-black"], [class*="font-800"]');
    await expect(heavyText.first()).toBeVisible();
  });

  test('validates accessibility compliance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check all images have alt text
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt!.trim()).not.toBe('');
    }
    
    // Check form accessibility
    const formInputs = await page.locator('input, textarea, select').all();
    for (const input of formInputs) {
      const ariaLabel = await input.getAttribute('aria-label');
      const id = await input.getAttribute('id');
      
      if (id) {
        const associatedLabel = page.locator(`label[for="${id}"]`);
        const hasLabel = await associatedLabel.count() > 0;
        expect(ariaLabel || hasLabel).toBeTruthy();
      }
    }
    
    // Check heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
    
    // First heading should be h1
    const firstHeading = headings[0];
    const tagName = await firstHeading.evaluate(el => el.tagName.toLowerCase());
    expect(tagName).toBe('h1');
  });

  test('validates responsive design patterns', async ({ page }) => {
    const viewports = [
      { width: 375, height: 812, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1024, height: 768, name: 'desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Check for horizontal scrollbar
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      
      expect(hasHorizontalScroll).toBe(false);
      
      // Ensure content is visible
      const mainContent = page.locator('main, section:first-of-type');
      await expect(mainContent).toBeVisible();
    }
  });

  test('validates SEO implementation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check title length
    const title = await page.title();
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toContain('Gallifrey');
    
    // Check meta description
    const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDesc).toBeTruthy();
    expect(metaDesc!.length).toBeLessThanOrEqual(160);
    
    // Check for structured data
    const structuredData = await page.locator('script[type="application/ld+json"]').count();
    expect(structuredData).toBeGreaterThan(0);
    
    // Check canonical URL
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe('https://gallifrey.consulting');
    
    // Check Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    
    expect(ogTitle).toBeTruthy();
    expect(ogDescription).toBeTruthy();
    expect(ogImage).toContain('og-image.jpg');
  });

  test('validates performance optimization', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    // Check for lazy loading on images
    const images = await page.locator('img').all();
    let hasLazyLoading = false;
    
    for (const img of images) {
      const loading = await img.getAttribute('loading');
      if (loading === 'lazy') {
        hasLazyLoading = true;
        break;
      }
    }
    
    // At least some images should use lazy loading
    if (images.length > 2) {
      expect(hasLazyLoading).toBe(true);
    }
  });
});