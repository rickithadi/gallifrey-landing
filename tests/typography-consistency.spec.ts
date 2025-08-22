import { test, expect } from '@playwright/test';

test.describe('Typography Consistency Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Load the MCP Chrome test scenarios
    await page.addScriptTag({
      path: './public/mcp-chrome-scenarios.js'
    });
    
    // Wait for fonts to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Additional wait for Google Fonts
  });

  test('should load Montserrat font for headings', async ({ page }) => {
    // Test typography validation using MCP Chrome scenarios
    const typographyResults = await page.evaluate(async () => {
      return await window.mcpChromeTestSuite.runDesignSystemTests();
    });

    console.log('Typography Test Results:', typographyResults.typography);
    
    // Check that Montserrat is loading
    expect(typographyResults.typography.fontLoadingSuccess).toBe(true);
    expect(typographyResults.typography.montserratUsage).toBeGreaterThan(0);
  });

  test('should use font-heading for main headings, not font-serif', async ({ page }) => {
    // Check Hero component h1 - should use font-heading not font-serif
    const heroH1Style = await page.evaluate(() => {
      const heroH1 = document.querySelector('#hero-heading');
      if (!heroH1) return null;
      
      const computedStyle = window.getComputedStyle(heroH1);
      const classList = Array.from(heroH1.classList);
      
      return {
        fontFamily: computedStyle.fontFamily,
        classList,
        hasFontSerif: classList.includes('font-serif'),
        hasFontHeading: classList.includes('font-heading'),
        actualFontFamily: computedStyle.fontFamily
      };
    });

    console.log('Hero H1 Style Analysis:', heroH1Style);
    
    // This should pass after TDD fix - Hero should use font-heading
    if (heroH1Style) {
      expect(heroH1Style.hasFontSerif).toBe(false); // Should not use font-serif
      expect(heroH1Style.hasFontHeading).toBe(true); // Should use font-heading
      expect(heroH1Style.actualFontFamily).toContain('Montserrat'); // Should be Montserrat
    }
  });

  test('should use font-heading for Services component headings', async ({ page }) => {
    const servicesHeadings = await page.evaluate(() => {
      const servicesH2 = document.querySelector('#services-heading');
      const serviceH3s = document.querySelectorAll('#services h3');
      const results = [];
      
      if (servicesH2) {
        const computedStyle = window.getComputedStyle(servicesH2);
        const classList = Array.from(servicesH2.classList);
        results.push({
          type: 'main-heading',
          tagName: servicesH2.tagName,
          classList,
          hasFontSerif: classList.includes('font-serif'),
          hasFontHeading: classList.includes('font-heading'),
          actualFontFamily: computedStyle.fontFamily
        });
      }
      
      serviceH3s.forEach((h3, index) => {
        const computedStyle = window.getComputedStyle(h3);
        const classList = Array.from(h3.classList);
        results.push({
          type: 'service-title',
          index,
          tagName: h3.tagName,
          classList,
          hasFontSerif: classList.includes('font-serif'),
          hasFontHeading: classList.includes('font-heading'),
          actualFontFamily: computedStyle.fontFamily
        });
      });
      
      return results;
    });

    console.log('Services Headings Analysis:', servicesHeadings);
    
    // All headings should use font-heading, not font-serif
    servicesHeadings.forEach(heading => {
      expect(heading.hasFontSerif).toBe(false); // Should not use font-serif
      expect(heading.hasFontHeading).toBe(true); // Should use font-heading
      expect(heading.actualFontFamily).toContain('Montserrat'); // Should be Montserrat
    });
  });

  test('should use font-heading for Pricing component headings', async ({ page }) => {
    const pricingHeadings = await page.evaluate(() => {
      const headings = document.querySelectorAll('#pricing-heading, #pricing h3, #pricing h4');
      const results = [];
      
      headings.forEach((heading, index) => {
        const computedStyle = window.getComputedStyle(heading);
        const classList = Array.from(heading.classList);
        
        results.push({
          index,
          tagName: heading.tagName,
          fontFamily: computedStyle.fontFamily,
          classList,
          hasFontSerif: classList.includes('font-serif'),
          hasFontHeading: classList.includes('font-heading'),
          actualFontFamily: computedStyle.fontFamily
        });
      });
      
      return results;
    });

    console.log('Pricing Headings Analysis:', pricingHeadings);
    
    // All headings should use font-heading, not font-serif
    const mainHeadings = pricingHeadings.filter(h => h.tagName === 'H2' || h.tagName === 'H3' || h.tagName === 'H4');
    if (mainHeadings.length > 0) {
      mainHeadings.forEach(heading => {
        expect(heading.hasFontSerif).toBe(false); // Should not use font-serif
        expect(heading.hasFontHeading).toBe(true); // Should use font-heading
        expect(heading.actualFontFamily).toContain('Montserrat'); // Should be Montserrat
      });
    }
  });

  test('should validate font loading performance', async ({ page }) => {
    const fontLoadingMetrics = await page.evaluate(async () => {
      // Check if fonts are actually loaded
      const testElement = document.createElement('div');
      testElement.style.fontFamily = 'Montserrat, sans-serif';
      testElement.style.fontSize = '16px';
      testElement.textContent = 'Test';
      testElement.style.position = 'absolute';
      testElement.style.left = '-9999px';
      document.body.appendChild(testElement);
      
      const computedStyle = window.getComputedStyle(testElement);
      const fontFamily = computedStyle.fontFamily;
      
      document.body.removeChild(testElement);
      
      // Use document.fonts API if available
      let fontsLoaded = 0;
      let totalFonts = 0;
      
      if (document.fonts) {
        totalFonts = document.fonts.size;
        document.fonts.forEach(font => {
          if (font.status === 'loaded') {
            fontsLoaded++;
          }
        });
      }
      
      return {
        fontFamily,
        montserratDetected: fontFamily.includes('Montserrat'),
        fontsLoaded,
        totalFonts,
        fontLoadingRatio: totalFonts > 0 ? fontsLoaded / totalFonts : 0
      };
    });

    console.log('Font Loading Metrics:', fontLoadingMetrics);
    
    expect(fontLoadingMetrics.montserratDetected).toBe(true);
    expect(fontLoadingMetrics.fontLoadingRatio).toBeGreaterThan(0.5);
  });

  test('should run comprehensive typography validation via MCP Chrome', async ({ page }) => {
    const results = await page.evaluate(async () => {
      return await window.mcpChromeTestSuite.runCompleteTestSuite();
    });

    console.log('Complete MCP Chrome Test Results:', results);
    
    // Check overall typography score
    expect(results.designSystem.typography.totalHeadings).toBeGreaterThan(0);
    expect(results.designSystem.typography.fontLoadingSuccess).toBe(true);
    
    // Log recommendations for fixing typography issues
    console.log('Typography Hierarchy Score:', results.designSystem.typography.hierarchyScore);
    console.log('Overall Design System Score:', results.designSystem.overallScore);
  });
});