import { test, expect } from '@playwright/test';

test.describe('SEO and Structured Data Tests', () => {
  test.describe('Main Landing Page SEO', () => {
    test('has comprehensive meta tags', async ({ page }) => {
      await page.goto('/');
      
      // Check title
      const title = await page.title();
      expect(title).toMatch(/Pixel-Perfect Digital Experiences.*Gallifrey/);
      expect(title.length).toBeLessThan(60); // SEO best practice
      
      // Check meta description
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      expect(metaDescription).toBeTruthy();
      expect(metaDescription!.length).toBeLessThan(160); // SEO best practice
      expect(metaDescription).toContain('Custom-coded websites');
      
      // Check canonical URL
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBe('https://gallifrey.consulting');
    });

    test('has Melbourne local SEO optimization', async ({ page }) => {
      await page.goto('/');
      
      // Check for Melbourne-specific meta tags
      const geoRegion = await page.locator('meta[name="geo.region"]').getAttribute('content');
      expect(geoRegion).toBe('AU-VIC');
      
      const geoPlacename = await page.locator('meta[name="geo.placename"]').getAttribute('content');
      expect(geoPlacename).toBe('Melbourne');
      
      const geoPosition = await page.locator('meta[name="geo.position"]').getAttribute('content');
      expect(geoPosition).toBe('-37.8136;144.9631');
      
      // Check ICBM coordinates
      const icbm = await page.locator('meta[name="ICBM"]').getAttribute('content');
      expect(icbm).toBe('-37.8136, 144.9631');
    });

    test('has proper Open Graph tags', async ({ page }) => {
      await page.goto('/');
      
      // Check OG tags
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      expect(ogTitle).toContain('Gallifrey');
      
      const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
      expect(ogDescription).toBeTruthy();
      
      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
      expect(ogUrl).toBe('https://gallifrey.consulting');
      
      const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
      expect(ogType).toBe('website');
      
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(ogImage).toContain('og-image.jpg');
      expect(ogImage).toContain('https://gallifrey.consulting');
    });

    test('has Twitter Card meta tags', async ({ page }) => {
      await page.goto('/');
      
      const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
      expect(twitterCard).toBe('summary_large_image');
      
      const twitterSite = await page.locator('meta[name="twitter:site"]').getAttribute('content');
      expect(twitterSite).toBe('@gallifreyconsulting');
    });

    test('has valid structured data (Organization)', async ({ page }) => {
      await page.goto('/');
      
      // Get structured data JSON-LD
      const structuredData = await page.locator('script[type="application/ld+json"]').textContent();
      expect(structuredData).toBeTruthy();
      
      const data = JSON.parse(structuredData!);
      expect(data['@context']).toBe('https://schema.org');
      expect(data['@graph']).toBeTruthy();
      
      // Find Organization schema
      const orgSchema = data['@graph'].find((item: any) => item['@type'] === 'Organization');
      expect(orgSchema).toBeTruthy();
      expect(orgSchema.name).toBe('Gallifrey Consulting');
      expect(orgSchema.url).toBe('https://gallifrey.consulting');
      expect(orgSchema.logo).toBeTruthy();
    });

    test('has valid structured data (LocalBusiness)', async ({ page }) => {
      await page.goto('/');
      
      const structuredData = await page.locator('script[type="application/ld+json"]').textContent();
      const data = JSON.parse(structuredData!);
      
      // Find LocalBusiness schema
      const businessSchema = data['@graph'].find((item: any) => item['@type'] === 'LocalBusiness');
      expect(businessSchema).toBeTruthy();
      expect(businessSchema.name).toBe('Gallifrey Consulting');
      expect(businessSchema.address.addressLocality).toBe('Melbourne');
      expect(businessSchema.address.addressRegion).toBe('Victoria');
      expect(businessSchema.address.addressCountry).toBe('Australia');
      expect(businessSchema.geo.latitude).toBe(-37.8136);
      expect(businessSchema.geo.longitude).toBe(144.9631);
    });

    test('has valid structured data (Service)', async ({ page }) => {
      await page.goto('/');
      
      const structuredData = await page.locator('script[type="application/ld+json"]').textContent();
      const data = JSON.parse(structuredData!);
      
      // Find Service schema
      const serviceSchema = data['@graph'].find((item: any) => item['@type'] === 'Service');
      expect(serviceSchema).toBeTruthy();
      expect(serviceSchema.name).toContain('Web Development');
      expect(serviceSchema.hasOfferCatalog).toBeTruthy();
    });

    test('has valid structured data (FAQPage)', async ({ page }) => {
      await page.goto('/');
      
      const structuredData = await page.locator('script[type="application/ld+json"]').textContent();
      const data = JSON.parse(structuredData!);
      
      // Find FAQPage schema
      const faqSchema = data['@graph'].find((item: any) => item['@type'] === 'FAQPage');
      expect(faqSchema).toBeTruthy();
      expect(faqSchema.mainEntity).toBeTruthy();
      expect(Array.isArray(faqSchema.mainEntity)).toBe(true);
      expect(faqSchema.mainEntity.length).toBeGreaterThan(0);
    });

    test('has robots meta tag', async ({ page }) => {
      await page.goto('/');
      
      const robots = await page.locator('meta[name="robots"]').getAttribute('content');
      expect(robots).toContain('index');
      expect(robots).toContain('follow');
    });

    test('has proper viewport meta tag', async ({ page }) => {
      await page.goto('/');
      
      const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
      expect(viewport).toBe('width=device-width, initial-scale=1');
    });

    test('has theme color meta tag', async ({ page }) => {
      await page.goto('/');
      
      const themeColor = await page.locator('meta[name="theme-color"]').getAttribute('content');
      expect(themeColor).toBe('#1B365D'); // Gallifrey blue
    });
  });

  test.describe('Own Your Narrative Page SEO', () => {
    test('has campaign-specific meta tags', async ({ page }) => {
      await page.goto('/own-your-narrative');
      
      const title = await page.title();
      expect(title).toMatch(/Own Your Narrative|Digital Independence|Platform Independence/i);
      
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      expect(metaDescription).toMatch(/platform|independence|narrative|digital sovereignty/i);
    });

    test('has campaign-specific keywords', async ({ page }) => {
      await page.goto('/own-your-narrative');
      
      const keywords = await page.locator('meta[name="keywords"]').getAttribute('content');
      if (keywords) {
        expect(keywords).toMatch(/platform independence|digital sovereignty|creator|family protection/i);
      }
    });
  });

  test.describe('Technical SEO', () => {
    test('page loads within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000); // 5 seconds max
    });

    test('has no broken links in navigation', async ({ page }) => {
      await page.goto('/');
      
      const links = page.locator('a[href]');
      const linkCount = await links.count();
      
      for (let i = 0; i < Math.min(linkCount, 10); i++) { // Test first 10 links
        const link = links.nth(i);
        const href = await link.getAttribute('href');
        
        if (href && href.startsWith('/')) {
          // Test internal links
          const response = await page.request.get(href);
          expect(response.status()).toBeLessThan(400);
        }
      }
    });

    test('images have alt attributes', async ({ page }) => {
      await page.goto('/');
      
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    });

    test('headings follow proper hierarchy', async ({ page }) => {
      await page.goto('/');
      
      // Should have exactly one H1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
      
      // H1 should come before other headings
      const allHeadings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      expect(allHeadings.length).toBeGreaterThan(1);
      
      const firstHeading = allHeadings[0];
      const tagName = await firstHeading.evaluate(el => el.tagName.toLowerCase());
      expect(tagName).toBe('h1');
    });

    test('has valid language attribute', async ({ page }) => {
      await page.goto('/');
      
      const lang = await page.locator('html').getAttribute('lang');
      expect(lang).toBe('en');
    });

    test('external links have proper attributes', async ({ page }) => {
      await page.goto('/');
      
      const externalLinks = page.locator('a[href^="http"]:not([href*="gallifrey.consulting"])');
      const linkCount = await externalLinks.count();
      
      for (let i = 0; i < linkCount; i++) {
        const link = externalLinks.nth(i);
        const rel = await link.getAttribute('rel');
        const target = await link.getAttribute('target');
        
        // External links should have rel="noopener" and target="_blank"
        if (target === '_blank') {
          expect(rel).toContain('noopener');
        }
      }
    });
  });

  test.describe('Performance SEO Factors', () => {
    test('has appropriate caching headers', async ({ page }) => {
      const response = await page.goto('/');
      const headers = response!.headers();
      
      // Should have some form of caching
      expect(headers['cache-control'] || headers['expires'] || headers['last-modified']).toBeTruthy();
    });

    test('uses HTTPS', async ({ page }) => {
      await page.goto('/');
      const url = page.url();
      expect(url).toMatch(/^https:/);
    });

    test('has security headers', async ({ page }) => {
      const response = await page.goto('/');
      const headers = response!.headers();
      
      // Check for security headers
      expect(headers['x-frame-options']).toBe('DENY');
      expect(headers['x-content-type-options']).toBe('nosniff');
      expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    });
  });
});