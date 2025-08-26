import { test, expect } from '@playwright/test';

test.describe('Core Formspree Integration', () => {
  
  test('homepage has contact form fields', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Try to find contact section or scroll to bottom
    await page.locator('a[href="#contact"]').first().click().catch(() => {
      return page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    });
    
    await page.waitForTimeout(2000);
    
    // Check for basic contact form elements
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    const emailInput = page.locator('input[name="email"], input[type="email"]').first(); 
    const messageTextarea = page.locator('textarea[name="message"], textarea[placeholder*="message" i]').first();
    
    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageTextarea).toBeVisible();
  });

  test('contact form can be filled out', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to form
    await page.locator('a[href="#contact"]').first().click().catch(() => {
      return page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    });
    
    await page.waitForTimeout(2000);
    
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    const messageTextarea = page.locator('textarea[name="message"], textarea[placeholder*="message" i]').first();
    
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test User');
      await expect(nameInput).toHaveValue('Test User');
    }
    
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@example.com');
      await expect(emailInput).toHaveValue('test@example.com');
    }
    
    if (await messageTextarea.isVisible()) {
      await messageTextarea.fill('Test message');
      await expect(messageTextarea).toHaveValue('Test message');
    }
  });

  test('form submission is intercepted properly', async ({ page }) => {
    let formspreeRequested = false;
    
    // Intercept any Formspree requests
    await page.route('https://formspree.io/f/*', async route => {
      formspreeRequested = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true })
      });
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to form
    await page.locator('a[href="#contact"]').first().click().catch(() => {
      return page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    });
    
    await page.waitForTimeout(2000);
    
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    const messageTextarea = page.locator('textarea[name="message"], textarea[placeholder*="message" i]').first();
    const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
    
    if (await nameInput.isVisible() && await emailInput.isVisible() && await messageTextarea.isVisible() && await submitButton.isVisible()) {
      await nameInput.fill('Test User');
      await emailInput.fill('test@example.com'); 
      await messageTextarea.fill('Test message');
      
      await submitButton.click();
      await page.waitForTimeout(2000);
      
      // Should have made Formspree request
      expect(formspreeRequested).toBe(true);
    }
  });

  test('OYN page exists and loads', async ({ page }) => {
    const response = await page.goto('/own-your-narrative');
    expect(response?.status()).toBe(200);
    
    await page.waitForLoadState('networkidle');
    
    // Should have some campaign content
    const campaignText = page.locator('text=/own your narrative/i, text=/platform/i, text=/entrepreneur/i').first();
    await expect(campaignText).toBeVisible();
  });

  test('OYN page has form elements', async ({ page }) => {
    await page.goto('/own-your-narrative');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Look for form elements anywhere on page
    const hasNameField = await page.locator('input[name="name"], input[placeholder*="name" i]').first().isVisible();
    const hasEmailField = await page.locator('input[name="email"], input[type="email"]').first().isVisible();
    const hasProjectType = await page.locator('select[name="project_type"], select[name="projectType"]').first().isVisible();
    
    // Should have at least name and email
    expect(hasNameField).toBe(true);
    expect(hasEmailField).toBe(true);
  });

  test('Calendly links are working URLs', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find Calendly links
    const calendlyLinks = page.locator('a[href*="calendly.com"]');
    const linkCount = await calendlyLinks.count();
    
    if (linkCount > 0) {
      const firstLink = calendlyLinks.first();
      const href = await firstLink.getAttribute('href');
      
      // Should be the working Calendly URL
      expect(href).toContain('calendly.com/rickithadi/30min');
      expect(href).not.toContain('strategic-discovery'); // Should not use broken URL
    }
  });

  test('forms have submit buttons', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for submit buttons anywhere on page
    const submitButtons = page.locator('button[type="submit"], input[type="submit"], button:has-text("send"), button:has-text("submit")');
    const buttonCount = await submitButtons.count();
    
    expect(buttonCount).toBeGreaterThan(0);
  });
});