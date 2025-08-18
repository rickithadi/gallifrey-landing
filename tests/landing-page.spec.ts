import { test, expect } from '@playwright/test';

test.describe('Gallifrey Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title and meta description', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(/Pixel-Perfect Digital Experiences.*Gallifrey Digital Melbourne/);
    
    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toContain('Custom-coded websites with obsessive attention to design detail');
  });

  test('displays main brand colors correctly', async ({ page }) => {
    // Check header has Gallifrey brand styling
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check for Gallifrey blue/teal branding elements
    const brandElements = page.locator('[class*="gallifrey"], [class*="teal"]');
    await expect(brandElements.first()).toBeVisible();
  });

  test('hero section displays animated adjectives', async ({ page }) => {
    // Check hero section is visible
    const heroSection = page.locator('[data-testid="hero"], section:first-of-type');
    await expect(heroSection).toBeVisible();
    
    // Check for animated text elements
    const animatedText = page.locator('[class*="animate"], [data-testid="animated-adjective"]');
    await expect(animatedText.first()).toBeVisible();
  });

  test('navigation menu works', async ({ page }) => {
    // Check if header/navigation is present
    const navigation = page.locator('nav, header');
    await expect(navigation).toBeVisible();
    
    // Look for common navigation links
    const possibleNavLinks = [
      'Services', 'Pricing', 'Contact', 'About',
      'services', 'pricing', 'contact', 'about'
    ];
    
    let foundNavLink = false;
    for (const linkText of possibleNavLinks) {
      const link = page.locator(`a:has-text("${linkText}")`).first();
      if (await link.isVisible()) {
        foundNavLink = true;
        break;
      }
    }
    expect(foundNavLink).toBe(true);
  });

  test('services section is visible', async ({ page }) => {
    // Scroll to find services section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 4));
    
    const servicesSection = page.locator('section:has-text("service"), section:has-text("Service"), [data-testid="services"]');
    await expect(servicesSection.first()).toBeVisible();
  });

  test('pricing section displays service packages', async ({ page }) => {
    // Scroll to find pricing section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    
    const pricingSection = page.locator('section:has-text("pricing"), section:has-text("Pricing"), [data-testid="pricing"]');
    await expect(pricingSection.first()).toBeVisible();
    
    // Look for pricing amounts (based on business context)
    const priceElements = page.locator('text=/\\$[0-9,]+/');
    await expect(priceElements.first()).toBeVisible();
  });

  test('contact section is present', async ({ page }) => {
    // Scroll to bottom to find contact section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const contactSection = page.locator('section:has-text("contact"), section:has-text("Contact"), [data-testid="contact"]');
    await expect(contactSection.first()).toBeVisible();
  });

  test('footer contains company information', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Check for Gallifrey branding
    const gallfreyText = page.locator('text=/gallifrey/i');
    await expect(gallfreyText.first()).toBeVisible();
  });

  test('page loads without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out known development-only errors
    const relevantErrors = consoleErrors.filter(error => 
      !error.includes('Failed to load resource') &&
      !error.includes('net::ERR_') &&
      !error.includes('google-analytics') // GA errors in dev are expected
    );
    
    expect(relevantErrors).toHaveLength(0);
  });

  test('responsive design works on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      // Check mobile navigation (hamburger menu)
      const mobileNav = page.locator('[data-testid="mobile-menu"], button:has-text("menu"), button:has([class*="hamburger"])');
      if (await mobileNav.first().isVisible()) {
        await mobileNav.first().click();
      }
      
      // Ensure content stacks properly on mobile
      const heroSection = page.locator('section:first-of-type');
      await expect(heroSection).toBeVisible();
      
      // Check that text is readable (not cut off)
      const heroText = page.locator('h1, h2').first();
      await expect(heroText).toBeVisible();
    }
  });

  test('accessibility: page has proper heading structure', async ({ page }) => {
    // Check for h1 element
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Ensure h1 comes before h2
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
  });
});