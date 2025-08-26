import { test, expect } from '@playwright/test';

test.describe('Simple Formspree Validation', () => {
  
  test('main page loads successfully', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('page has Formspree form indicators', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check if page has form elements that would use Formspree
    const hasInputs = await page.locator('input[name="name"], input[name="email"], textarea[name="message"]').count() > 0;
    const hasForms = await page.locator('form').count() > 0;
    const hasSubmitButtons = await page.locator('button[type="submit"], input[type="submit"]').count() > 0;
    
    // At least one of these should be true
    expect(hasInputs || hasForms || hasSubmitButtons).toBe(true);
  });

  test('OYN page loads without errors', async ({ page }) => {
    const response = await page.goto('/own-your-narrative');
    expect(response?.status()).toBe(200);
    
    // Wait for any content to load
    await page.waitForTimeout(1000);
    
    // Check if page has basic HTML structure
    const hasBody = await page.locator('body').count() > 0;
    expect(hasBody).toBe(true);
  });

  test('Calendly URLs are correct format', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check if any Calendly links exist and use correct URL
    const calendlyLinks = await page.locator('a[href*="calendly.com"]').all();
    
    for (const link of calendlyLinks) {
      const href = await link.getAttribute('href');
      if (href) {
        expect(href).toContain('calendly.com/rickithadi/30min');
        expect(href).not.toContain('strategic-discovery');
      }
    }
  });

  test('forms use expected method and attributes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const forms = await page.locator('form').all();
    
    for (const form of forms) {
      const method = await form.getAttribute('method');
      const action = await form.getAttribute('action');
      
      // Forms should either have no action (handled by JS) or point to Formspree
      if (action) {
        expect(action.includes('formspree.io') || action.startsWith('#') || action === '').toBe(true);
      }
      
      // Method should be POST or not specified
      if (method) {
        expect(method.toLowerCase()).toBe('post');
      }
    }
  });
});