import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests - Dual Brand Design', () => {
  test.describe('Main Brand - Gallifrey Consulting', () => {
    test('homepage visual consistency', async ({ page }) => {
      await page.goto('/');
      
      // Wait for animations and content to load
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Take full page screenshot
      await expect(page).toHaveScreenshot('homepage-full.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('hero section brand consistency', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Screenshot hero section
      const heroSection = page.locator('section:first-of-type, [data-testid="hero"]');
      await expect(heroSection).toHaveScreenshot('hero-section.png', {
        animations: 'disabled'
      });
    });

    test('services section visual consistency', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Scroll to services section
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 4));
      await page.waitForTimeout(1000);
      
      const servicesSection = page.locator('section:has-text("service"), section:has-text("Service"), [data-testid="services"]');
      if (await servicesSection.first().isVisible()) {
        await expect(servicesSection.first()).toHaveScreenshot('services-section.png', {
          animations: 'disabled'
        });
      }
    });

    test('pricing section visual consistency', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Scroll to pricing section
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await page.waitForTimeout(1000);
      
      const pricingSection = page.locator('section:has-text("pricing"), section:has-text("Pricing"), [data-testid="pricing"]');
      if (await pricingSection.first().isVisible()) {
        await expect(pricingSection.first()).toHaveScreenshot('pricing-section.png', {
          animations: 'disabled'
        });
      }
    });

    test('header navigation visual consistency', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const header = page.locator('header, nav');
      await expect(header.first()).toHaveScreenshot('header-navigation.png', {
        animations: 'disabled'
      });
    });

    test('footer visual consistency', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);
      
      const footer = page.locator('footer');
      await expect(footer).toHaveScreenshot('footer-section.png', {
        animations: 'disabled'
      });
    });
  });

  test.describe('Campaign Brand - Own Your Narrative', () => {
    test('campaign page full visual consistency', async ({ page }) => {
      await page.goto('/own-your-narrative');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Take full page screenshot
      await expect(page).toHaveScreenshot('campaign-page-full.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('campaign hero section with warm colors', async ({ page }) => {
      await page.goto('/own-your-narrative');
      await page.waitForLoadState('networkidle');
      
      const heroSection = page.locator('section:first-of-type, [data-testid="hero"]');
      await expect(heroSection).toHaveScreenshot('campaign-hero.png', {
        animations: 'disabled'
      });
    });

    test('campaign service packages visual consistency', async ({ page }) => {
      await page.goto('/own-your-narrative');
      await page.waitForLoadState('networkidle');
      
      // Find service packages section
      const packagesSection = page.locator('section:has-text("Family Protection"), section:has-text("Creator Liberation"), section:has-text("package")');
      if (await packagesSection.first().isVisible()) {
        await expect(packagesSection.first()).toHaveScreenshot('campaign-packages.png', {
          animations: 'disabled'
        });
      }
    });

    test('campaign gradient implementation', async ({ page }) => {
      await page.goto('/own-your-narrative');
      await page.waitForLoadState('networkidle');
      
      // Find elements with campaign gradients
      const gradientElements = page.locator('[class*="gradient"], [style*="gradient"]');
      if (await gradientElements.first().isVisible()) {
        await expect(gradientElements.first()).toHaveScreenshot('campaign-gradient.png', {
          animations: 'disabled'
        });
      }
    });
  });

  test.describe('Responsive Design - Mobile', () => {
    test.use({ viewport: { width: 375, height: 812 } }); // iPhone X dimensions

    test('mobile homepage visual consistency', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      await expect(page).toHaveScreenshot('mobile-homepage.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('mobile campaign page visual consistency', async ({ page }) => {
      await page.goto('/own-your-narrative');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      await expect(page).toHaveScreenshot('mobile-campaign.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('mobile navigation menu', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Try to open mobile menu
      const mobileMenuTrigger = page.locator('[data-testid="mobile-menu"], button:has-text("menu"), button:has([class*="hamburger"])');
      if (await mobileMenuTrigger.first().isVisible()) {
        await mobileMenuTrigger.first().click();
        await page.waitForTimeout(500);
        
        await expect(page).toHaveScreenshot('mobile-menu-open.png', {
          animations: 'disabled'
        });
      }
    });
  });

  test.describe('Brand Color Consistency', () => {
    test('gallifrey blue color verification', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Find elements with Gallifrey blue (#1B365D)
      const blueElements = page.locator('[class*="gallifrey-charcoal"], [class*="blue"], [style*="#1B365D"]');
      if (await blueElements.first().isVisible()) {
        await expect(blueElements.first()).toHaveScreenshot('gallifrey-blue-elements.png');
      }
    });

    test('campaign warm colors verification', async ({ page }) => {
      await page.goto('/own-your-narrative');
      await page.waitForLoadState('networkidle');
      
      // Find elements with campaign warm colors
      const warmElements = page.locator('[class*="oyn-orange"], [class*="oyn-stone"], [class*="warm"]');
      if (await warmElements.first().isVisible()) {
        await expect(warmElements.first()).toHaveScreenshot('campaign-warm-colors.png');
      }
    });
  });

  test.describe('Typography Consistency', () => {
    test('main brand typography hierarchy', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Screenshot different heading levels
      const h1 = page.locator('h1').first();
      if (await h1.isVisible()) {
        await expect(h1).toHaveScreenshot('h1-typography.png');
      }
      
      const h2 = page.locator('h2').first();
      if (await h2.isVisible()) {
        await expect(h2).toHaveScreenshot('h2-typography.png');
      }
    });

    test('campaign heavy typography weights', async ({ page }) => {
      await page.goto('/own-your-narrative');
      await page.waitForLoadState('networkidle');
      
      // Find heavy weight typography
      const heavyText = page.locator('[class*="font-bold"], [class*="font-black"], [class*="font-800"]');
      if (await heavyText.first().isVisible()) {
        await expect(heavyText.first()).toHaveScreenshot('campaign-heavy-typography.png');
      }
    });
  });

  test.describe('Animation States', () => {
    test('animated adjectives in hero section', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Wait for animations to settle
      await page.waitForTimeout(3000);
      
      const animatedText = page.locator('[class*="animate"], [data-testid="animated-adjective"]');
      if (await animatedText.first().isVisible()) {
        await expect(animatedText.first()).toHaveScreenshot('animated-adjectives.png', {
          animations: 'disabled'
        });
      }
    });
  });
});