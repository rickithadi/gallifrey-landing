import { test, expect } from '@playwright/test';

test.describe('Brand Color Consistency Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/own-your-narrative');
    await page.waitForLoadState('networkidle');
  });

  test('should validate OYN header uses orange colors, not purple', async ({ page }) => {
    // Check for purple colors in header elements (these should fail initially)
    const headerLinks = page.locator('header a').filter({ hasText: /Back to Gallifrey|Services|Process|Contact/ });
    
    for (let i = 0; i < await headerLinks.count(); i++) {
      const link = headerLinks.nth(i);
      await expect(link).not.toHaveClass(/purple-/);
      
      // Hover to check hover states
      await link.hover();
      const styles = await link.evaluate(el => getComputedStyle(el));
      // Should not contain purple hover colors
      expect(styles.color).not.toMatch(/rgb\(147,\s*51,\s*234\)/); // purple-600
    }

    // Check Get Started button should not use purple
    const getStartedButton = page.locator('header').getByRole('button', { name: 'Get Started' });
    await expect(getStartedButton).not.toHaveClass(/bg-purple-/);
    await expect(getStartedButton).not.toHaveClass(/hover:bg-purple-/);
    
    // Should use oyn-orange instead
    await expect(getStartedButton).toHaveClass(/bg-oyn-orange-/);
  });

  test('should validate OYN page uses orange colors, not green', async ({ page }) => {
    // Check ownership benefits section - should not have green colors
    const ownershipSection = page.locator('[class*="bg-green-50"]');
    await expect(ownershipSection).toHaveCount(0);

    // Check for green-600 borders and text (these should not exist)
    const greenBorders = page.locator('[class*="border-green-600"]');
    await expect(greenBorders).toHaveCount(0);

    const greenText = page.locator('[class*="text-green-600"]');
    await expect(greenText).toHaveCount(0);

    // Personal Website service card should not use green
    const personalWebsiteCard = page.locator('text=Personal Website').locator('..');
    const greenIcons = personalWebsiteCard.locator('[class*="text-green-600"]');
    await expect(greenIcons).toHaveCount(0);

    // Should use oyn-orange colors instead
    const orangeElements = page.locator('[class*="oyn-orange-"]');
    await expect(orangeElements.first()).toBeVisible();
  });

  test('should validate brand token usage compliance', async ({ page }) => {
    // Load the MCP testing scenarios
    await page.addScriptTag({ path: './public/mcp-chrome-scenarios.js' });
    
    // Run design system tests
    const results = await page.evaluate(async () => {
      return await window.mcpChromeTestSuite.runDesignSystemTests();
    });

    // Validate brand token usage
    expect(results.brandTokens.hasOynTokens).toBe(true);
    expect(results.brandTokens.hasGallifreyTokens).toBe(true);
    
    // Should have minimal inline styles (prefer CSS classes)
    expect(results.brandTokens.inlineStylesCount).toBeLessThan(5);
    
    // Overall design system score should be high
    expect(results.overallScore).toBeGreaterThan(85);
  });

  test('should validate color contrast and accessibility', async ({ page }) => {
    // Load the MCP testing scenarios
    await page.addScriptTag({ path: './public/mcp-chrome-scenarios.js' });
    
    // Run color contrast validation
    const results = await page.evaluate(async () => {
      return await window.mcpChromeTestSuite.runDesignSystemTests();
    });

    // Should have good accessibility scores
    expect(results.colorContrast.accessibilityScore).toBeGreaterThan(80);
    expect(results.colorContrast.contrastIssues).toBeLessThan(3);
  });

  test('should validate typography hierarchy uses brand fonts', async ({ page }) => {
    // Load the MCP testing scenarios
    await page.addScriptTag({ path: './public/mcp-chrome-scenarios.js' });
    
    // Run typography validation
    const results = await page.evaluate(async () => {
      return await window.mcpChromeTestSuite.runDesignSystemTests();
    });

    // Should have good typography hierarchy
    expect(results.typography.fontLoadingSuccess).toBe(true);
    expect(results.typography.hierarchyScore).toBeGreaterThan(70);
    expect(results.typography.montserratUsage).toBeGreaterThan(0);
  });

  test('should detect inconsistent color usage patterns', async ({ page }) => {
    // Check for mixed color schemes that indicate inconsistency
    const purpleElements = await page.locator('[class*="purple-"]').count();
    const greenElements = await page.locator('[class*="green-"]').count();
    const oynOrangeElements = await page.locator('[class*="oyn-orange-"]').count();

    // In OYN campaign page, should primarily use oyn-orange
    expect(oynOrangeElements).toBeGreaterThan(10);
    
    // Should minimize use of purple and green (non-brand colors)
    expect(purpleElements).toBeLessThan(3);
    expect(greenElements).toBeLessThan(3);
  });
});

test.describe('Real-time Chrome MCP Validation', () => {
  test('should run complete MCP test suite for brand validation', async ({ page }) => {
    await page.goto('http://localhost:3000/own-your-narrative');
    await page.waitForLoadState('networkidle');
    
    // Load the MCP testing scenarios
    await page.addScriptTag({ path: './public/mcp-chrome-scenarios.js' });
    
    // Run complete test suite
    const results = await page.evaluate(async () => {
      return await window.mcpChromeTestSuite.runCompleteTestSuite();
    });

    // Log results for debugging
    console.log('MCP Test Results:', JSON.stringify(results, null, 2));

    // Validate overall quality score
    expect(results.overallQualityScore).toBeGreaterThan(75);
    
    // Validate specific design system compliance
    expect(results.designSystem.overallScore).toBeGreaterThan(80);
    
    // Validate brand token usage
    expect(results.designSystem.brandTokens.hasOynTokens).toBe(true);
    
    // Should have proper typography
    expect(results.designSystem.typography.fontLoadingSuccess).toBe(true);
  });
});