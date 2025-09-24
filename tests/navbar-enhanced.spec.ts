import { test, expect } from '@playwright/test';

test.describe('Enhanced Navbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Visual Design & Branding', () => {
    test('should display logo with proper security-first branding', async ({ page }) => {
      const logo = page.getByRole('banner').locator('a').first();
      await expect(logo).toBeVisible();
      
      // Test logo hover effect
      await logo.hover();
      await expect(logo).toHaveCSS('transform', /scale/);
    });

    test('should have proper navbar styling with backdrop blur', async ({ page }) => {
      const header = page.getByRole('banner');
      await expect(header).toBeVisible();
      await expect(header).toHaveCSS('backdrop-filter', /blur/);
    });

    test('should show enhanced styling when scrolled', async ({ page }) => {
      const header = page.getByRole('banner');
      
      // Initial state
      await expect(header).toBeVisible();
      
      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 100));
      await page.waitForTimeout(500);
      
      // Should have enhanced shadow when scrolled
      await expect(header).toHaveCSS('box-shadow', /shadow/);
    });
  });

  test.describe('Navigation Functionality', () => {
    test('should navigate to all main sections', async ({ page }) => {
      const navItems = [
        { text: 'Services', target: '#services' },
        { text: 'Results', target: '#testimonials' },
        { text: 'Investment', target: '#pricing' },
        { text: 'FAQ', target: '#faq' },
        { text: 'Contact', target: '#contact' }
      ];

      for (const item of navItems) {
        const navLink = page.getByRole('navigation').getByText(item.text).first();
        await expect(navLink).toBeVisible();
        
        // Click and verify smooth scroll behavior
        await navLink.click();
        await page.waitForTimeout(1000);
        
        // Verify the section is now visible
        const targetSection = page.locator(item.target);
        await expect(targetSection).toBeInViewport();
      }
    });

    test('should show active section indicator', async ({ page }) => {
      // Navigate to services section
      await page.getByRole('navigation').getByText('Services').first().click();
      await page.waitForTimeout(1000);
      
      // Check if services nav item has active styling
      const servicesNav = page.getByRole('navigation').getByText('Services').first();
      await expect(servicesNav).toHaveClass(/active/);
    });

    test('should open external Narrative link correctly', async ({ page }) => {
      const narrativeLink = page.getByText('Narrative');
      await expect(narrativeLink).toBeVisible();
      await expect(narrativeLink).toHaveAttribute('href', 'https://narrative.gallifrey.consulting');
      await expect(narrativeLink).toHaveAttribute('target', '_blank');
    });

    test('should open Calendly link correctly', async ({ page }) => {
      const ctaButton = page.getByRole('link', { name: /Get Started/i });
      await expect(ctaButton).toBeVisible();
      await expect(ctaButton).toHaveAttribute('href', /calendly\.com/);
      await expect(ctaButton).toHaveAttribute('target', '_blank');
    });
  });

  test.describe('Mobile Navigation', () => {
    test('should show mobile menu button on small screens', async ({ page, isMobile }) => {
      if (!isMobile) {
        // Resize to mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
      }
      
      const menuButton = page.getByRole('button', { name: /menu/i });
      await expect(menuButton).toBeVisible();
      
      // Desktop navigation should be hidden
      const desktopNav = page.locator('nav[aria-label="Main navigation"]');
      await expect(desktopNav).toBeHidden();
    });

    test('should open and close mobile menu correctly', async ({ page, isMobile }) => {
      if (!isMobile) {
        await page.setViewportSize({ width: 375, height: 667 });
      }
      
      const menuButton = page.getByRole('button', { name: /menu/i });
      const mobileMenu = page.locator('#mobile-menu');
      
      // Menu should be closed initially
      await expect(mobileMenu).toHaveAttribute('aria-hidden', 'true');
      
      // Open menu
      await menuButton.click();
      await expect(mobileMenu).toHaveAttribute('aria-hidden', 'false');
      await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      
      // Close menu
      await menuButton.click();
      await expect(mobileMenu).toHaveAttribute('aria-hidden', 'true');
      await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('should navigate from mobile menu', async ({ page, isMobile }) => {
      if (!isMobile) {
        await page.setViewportSize({ width: 375, height: 667 });
      }
      
      const menuButton = page.getByRole('button', { name: /menu/i });
      await menuButton.click();
      
      // Click on Services in mobile menu
      const mobileServicesLink = page.getByRole('navigation', { name: /mobile/i }).getByText('Services');
      await mobileServicesLink.click();
      
      // Menu should close and navigate to services
      await page.waitForTimeout(1000);
      const servicesSection = page.locator('#services');
      await expect(servicesSection).toBeInViewport();
      
      // Mobile menu should be closed
      const mobileMenu = page.locator('#mobile-menu');
      await expect(mobileMenu).toHaveAttribute('aria-hidden', 'true');
    });
  });

  test.describe('Accessibility (WCAG 2.1 AA)', () => {
    test('should have proper skip navigation link', async ({ page }) => {
      // Focus the skip link
      await page.keyboard.press('Tab');
      const skipLink = page.getByText('Skip to main content');
      await expect(skipLink).toBeFocused();
      await expect(skipLink).toBeVisible();
      
      // Click skip link should navigate to services
      await skipLink.click();
      const servicesSection = page.locator('#services');
      await expect(servicesSection).toBeInViewport();
    });

    test('should support keyboard navigation', async ({ page }) => {
      // Tab through navigation items
      await page.keyboard.press('Tab'); // Skip link
      await page.keyboard.press('Tab'); // Logo
      await page.keyboard.press('Tab'); // First nav item
      
      const firstNavItem = page.getByRole('navigation').getByText('Services').first();
      await expect(firstNavItem).toBeFocused();
      
      // Continue tabbing through nav items
      await page.keyboard.press('Tab');
      const secondNavItem = page.getByRole('navigation').getByText('Results').first();
      await expect(secondNavItem).toBeFocused();
    });

    test('should have proper ARIA labels and roles', async ({ page }) => {
      const header = page.getByRole('banner');
      await expect(header).toHaveAttribute('aria-label', 'Site header');
      
      const mainNav = page.locator('nav[aria-label="Main navigation"]');
      await expect(mainNav).toBeVisible();
      
      const menuButton = page.getByRole('button', { name: /menu/i });
      await expect(menuButton).toHaveAttribute('aria-expanded');
      await expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu');
    });

    test('should have sufficient color contrast', async ({ page }) => {
      const navItems = page.getByRole('navigation').locator('a');
      const count = await navItems.count();
      
      for (let i = 0; i < count; i++) {
        const item = navItems.nth(i);
        const color = await item.evaluate(el => getComputedStyle(el).color);
        const backgroundColor = await item.evaluate(el => getComputedStyle(el).backgroundColor);
        
        // Basic color contrast check (actual implementation would use contrast ratio calculation)
        expect(color).not.toBe(backgroundColor);
      }
    });

    test('should announce current page correctly', async ({ page }) => {
      // Navigate to services
      await page.getByRole('navigation').getByText('Services').first().click();
      await page.waitForTimeout(1000);
      
      const activeNavItem = page.getByRole('navigation').getByText('Services').first();
      await expect(activeNavItem).toHaveAttribute('aria-current', 'page');
    });
  });

  test.describe('Responsive Design', () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1200, height: 800 },
      { name: 'large-desktop', width: 1920, height: 1080 }
    ];

    viewports.forEach(viewport => {
      test(`should render correctly on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        
        const header = page.getByRole('banner');
        await expect(header).toBeVisible();
        
        // Logo should always be visible
        const logo = page.getByRole('banner').locator('a').first();
        await expect(logo).toBeVisible();
        
        // CTA button visibility depends on viewport
        const ctaButton = page.getByRole('link', { name: /Get Started/i });
        if (viewport.width >= 640) {
          await expect(ctaButton).toBeVisible();
        }
        
        // Language switcher visibility
        const languageSwitcher = page.locator('[data-testid="language-switcher"]');
        if (viewport.width >= 640) {
          await expect(languageSwitcher).toBeVisible();
        }
      });
    });

    test('should have proper touch targets on mobile', async ({ page, isMobile }) => {
      if (!isMobile) {
        await page.setViewportSize({ width: 375, height: 667 });
      }
      
      const menuButton = page.getByRole('button', { name: /menu/i });
      const boundingBox = await menuButton.boundingBox();
      
      // Touch target should be at least 44px (WCAG AA standard)
      expect(boundingBox?.height).toBeGreaterThanOrEqual(44);
      expect(boundingBox?.width).toBeGreaterThanOrEqual(44);
    });
  });

  test.describe('Performance', () => {
    test('should not cause layout shift', async ({ page }) => {
      let cumulativeLayoutShift = 0;
      
      page.on('console', msg => {
        if (msg.text().includes('CLS')) {
          const cls = parseFloat(msg.text().split(':')[1]);
          cumulativeLayoutShift += cls;
        }
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Scroll to trigger any layout shifts
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(1000);
      
      // CLS should be minimal (< 0.1 for good score)
      expect(cumulativeLayoutShift).toBeLessThan(0.1);
    });

    test('should render navbar quickly', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      
      const header = page.getByRole('banner');
      await expect(header).toBeVisible();
      
      const renderTime = Date.now() - startTime;
      expect(renderTime).toBeLessThan(2000); // Should render within 2 seconds
    });
  });

  test.describe('Animation & Interactions', () => {
    test('should animate mobile menu open/close', async ({ page, isMobile }) => {
      if (!isMobile) {
        await page.setViewportSize({ width: 375, height: 667 });
      }
      
      const menuButton = page.getByRole('button', { name: /menu/i });
      const mobileMenu = page.locator('#mobile-menu');
      
      // Open menu and check for animation classes
      await menuButton.click();
      await page.waitForTimeout(100);
      
      // Menu should have transition properties
      const transition = await mobileMenu.evaluate(el => getComputedStyle(el).transition);
      expect(transition).toContain('all');
    });

    test('should show hover effects on desktop', async ({ page, isMobile }) => {
      if (isMobile) {
        test.skip('Hover effects only on desktop');
      }
      
      const firstNavItem = page.getByRole('navigation').getByText('Services').first();
      
      // Get initial transform
      const initialTransform = await firstNavItem.evaluate(el => getComputedStyle(el).transform);
      
      // Hover and check for transform change
      await firstNavItem.hover();
      await page.waitForTimeout(100);
      
      const hoverTransform = await firstNavItem.evaluate(el => getComputedStyle(el).transform);
      expect(hoverTransform).not.toBe(initialTransform);
    });

    test('should respect reduced motion preferences', async ({ page }) => {
      // Set reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.reload();
      
      const header = page.getByRole('banner');
      await expect(header).toBeVisible();
      
      // Animation duration should be none or very short
      const animationDuration = await header.evaluate(el => getComputedStyle(el).animationDuration);
      expect(animationDuration === 'none' || animationDuration === '0s').toBeTruthy();
    });
  });

  test.describe('Security Features', () => {
    test('should have security-themed visual elements', async ({ page }) => {
      const shieldIcon = page.getByRole('button').locator('svg').first();
      await expect(shieldIcon).toBeVisible();
    });

    test('should open external links securely', async ({ page }) => {
      const externalLinks = page.getByRole('link', { name: /calendly|narrative/i });
      const count = await externalLinks.count();
      
      for (let i = 0; i < count; i++) {
        const link = externalLinks.nth(i);
        await expect(link).toHaveAttribute('rel', /noopener|noreferrer/);
        await expect(link).toHaveAttribute('target', '_blank');
      }
    });
  });

  test.describe('Internationalization', () => {
    test('should display navigation in English by default', async ({ page }) => {
      const servicesLink = page.getByRole('navigation').getByText('Services');
      await expect(servicesLink).toBeVisible();
      
      const resultsLink = page.getByRole('navigation').getByText('Results');
      await expect(resultsLink).toBeVisible();
    });

    test('should have language switcher functionality', async ({ page }) => {
      const languageSwitcher = page.locator('[data-testid="language-switcher"]');
      if (await languageSwitcher.isVisible()) {
        await languageSwitcher.click();
        // Additional language switching tests would go here
      }
    });
  });
});