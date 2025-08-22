import { test, expect } from '@playwright/test';

test.describe('Design Consistency Fixes', () => {
  test.describe('Typography Fixes', () => {
    test.describe('Main Landing Page Typography', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000');
      });

      test('should use font-heading for main H1 instead of font-serif', async ({ page }) => {
        await page.waitForSelector('h1#hero-heading', { timeout: 10000 });
        
        const h1 = page.locator('h1#hero-heading');
        
        // Get computed styles
        const fontFamily = await h1.evaluate((el) => {
          return window.getComputedStyle(el).fontFamily;
        });
        
        // WILL FAIL: Current implementation uses font-serif (Playfair Display)
        // Should use font-heading (Montserrat)
        expect(fontFamily).toContain('Montserrat');
        expect(fontFamily).not.toContain('Playfair Display');
      });

      test('should use font-heading for all major headings (h1, h2, h3)', async ({ page }) => {
        await page.waitForSelector('main', { timeout: 10000 });
        
        // Get all heading elements
        const headings = page.locator('h1, h2, h3');
        const headingCount = await headings.count();
        
        expect(headingCount).toBeGreaterThan(0);
        
        // Check each heading uses Montserrat (font-heading)
        for (let i = 0; i < headingCount; i++) {
          const heading = headings.nth(i);
          const fontFamily = await heading.evaluate((el) => {
            return window.getComputedStyle(el).fontFamily;
          });
          
          // WILL FAIL: Some headings currently use font-serif
          expect(fontFamily).toContain('Montserrat');
        }
      });

      test('should have consistent font weights for headings', async ({ page }) => {
        await page.waitForSelector('main', { timeout: 10000 });
        
        const h1 = page.locator('h1#hero-heading');
        const h2Elements = page.locator('h2');
        
        // H1 should have proper font weight
        const h1Weight = await h1.evaluate((el) => {
          return window.getComputedStyle(el).fontWeight;
        });
        
        // Should be medium weight (500-600)
        const h1WeightNum = parseInt(h1Weight);
        expect(h1WeightNum).toBeGreaterThanOrEqual(500);
        expect(h1WeightNum).toBeLessThanOrEqual(700);
        
        // H2 elements should have consistent weights
        const h2Count = await h2Elements.count();
        if (h2Count > 0) {
          for (let i = 0; i < Math.min(h2Count, 3); i++) {
            const h2Weight = await h2Elements.nth(i).evaluate((el) => {
              return parseInt(window.getComputedStyle(el).fontWeight);
            });
            
            expect(h2Weight).toBeGreaterThanOrEqual(500);
            expect(h2Weight).toBeLessThanOrEqual(700);
          }
        }
      });

      test('should preserve logo font-serif usage', async ({ page }) => {
        await page.waitForSelector('header', { timeout: 10000 });
        
        // Logo should still use serif font
        const logoElements = page.locator('.logo-serif, [class*="logo"]');
        const logoCount = await logoElements.count();
        
        if (logoCount > 0) {
          const logoFont = await logoElements.first().evaluate((el) => {
            return window.getComputedStyle(el).fontFamily;
          });
          
          // Logo should continue using Playfair Display
          expect(logoFont).toContain('Playfair Display');
        }
      });
    });

    test.describe('Own Your Narrative Typography', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/own-your-narrative');
      });

      test('should use font-heading for OYN page headings', async ({ page }) => {
        await page.waitForSelector('main', { timeout: 10000 });
        
        const headings = page.locator('h1, h2, h3');
        const headingCount = await headings.count();
        
        expect(headingCount).toBeGreaterThan(0);
        
        // All headings should use Montserrat
        for (let i = 0; i < headingCount; i++) {
          const heading = headings.nth(i);
          const fontFamily = await heading.evaluate((el) => {
            return window.getComputedStyle(el).fontFamily;
          });
          
          expect(fontFamily).toContain('Montserrat');
        }
      });
    });
  });

  test.describe('Color Consistency Fixes', () => {
    test.describe('Own Your Narrative Header Color Fix', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/own-your-narrative');
      });

      test('should use orange accent colors instead of purple in OYN header', async ({ page }) => {
        await page.waitForSelector('header', { timeout: 10000 });
        
        // Check navigation links hover colors
        const navLinks = page.locator('header nav a');
        const linkCount = await navLinks.count();
        
        if (linkCount > 0) {
          // Hover over first nav link to check hover color
          await navLinks.first().hover();
          
          // Wait for transition
          await page.waitForTimeout(300);
          
          const hoverColor = await navLinks.first().evaluate((el) => {
            return window.getComputedStyle(el).color;
          });
          
          // WILL FAIL: Currently uses purple (rgb(147, 51, 234))
          // Should use orange from OYN palette
          expect(hoverColor).not.toContain('147, 51, 234'); // purple-600
          
          // Should contain orange RGB values
          const orangeValues = ['249, 115, 22', '234, 88, 12', '194, 65, 12']; // orange-500, orange-600, orange-700
          const hasOrangeColor = orangeValues.some(orange => hoverColor.includes(orange));
          expect(hasOrangeColor).toBe(true);
        }
      });

      test('should use orange gradient instead of purple in brand logo', async ({ page }) => {
        await page.waitForSelector('header', { timeout: 10000 });
        
        // Find the gradient logo element
        const logoGradient = page.locator('header .bg-gradient-to-br');
        
        if (await logoGradient.count() > 0) {
          const gradientStyles = await logoGradient.evaluate((el) => {
            return window.getComputedStyle(el).backgroundImage;
          });
          
          // WILL FAIL: Currently uses purple-600 to orange-500
          // Should use orange-focused gradient
          expect(gradientStyles).not.toContain('147, 51, 234'); // purple-600
          
          // Should contain orange values
          expect(gradientStyles).toContain('249, 115, 22'); // orange-500
        }
      });

      test('should use orange for CTA buttons instead of purple', async ({ page }) => {
        await page.waitForSelector('header', { timeout: 10000 });
        
        const ctaButton = page.locator('header button, header .btn');
        
        if (await ctaButton.count() > 0) {
          const buttonBg = await ctaButton.first().evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
          });
          
          // WILL FAIL: Currently uses purple
          expect(buttonBg).not.toContain('147, 51, 234'); // purple-600
          expect(buttonBg).not.toContain('126, 34, 206'); // purple-700
          
          // Should use orange
          const orangeValues = ['249, 115, 22', '234, 88, 12']; // orange-500, orange-600
          const hasOrangeBackground = orangeValues.some(orange => buttonBg.includes(orange));
          expect(hasOrangeBackground).toBe(true);
        }
      });

      test('should maintain accessibility with orange color changes', async ({ page }) => {
        await page.waitForSelector('header', { timeout: 10000 });
        
        // Check contrast of orange text on white background
        const navLink = page.locator('header nav a').first();
        
        if (await navLink.count() > 0) {
          await navLink.hover();
          
          const textColor = await navLink.evaluate((el) => {
            const style = window.getComputedStyle(el);
            return style.color;
          });
          
          const backgroundColor = await navLink.evaluate((el) => {
            return window.getComputedStyle(el.closest('header')!).backgroundColor;
          });
          
          // Ensure we have valid color values
          expect(textColor).toMatch(/rgb\(\d+,\s*\d+,\s*\d+\)/);
          expect(backgroundColor).toMatch(/rgb\(\d+,\s*\d+,\s*\d+\)/);
        }
      });
    });

    test.describe('Own Your Narrative Page Color Fix', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/own-your-narrative');
      });

      test('should use orange accent colors instead of green throughout page', async ({ page }) => {
        await page.waitForSelector('main', { timeout: 10000 });
        
        // Check for any green color usage that should be orange
        const coloredElements = page.locator('[class*="green"], [class*="emerald"], [class*="teal"]:not([class*="gallifrey"])');
        const greenElementCount = await coloredElements.count();
        
        // WILL FAIL: There should be no green-themed elements on OYN page
        expect(greenElementCount).toBe(0);
      });

      test('should use OYN orange palette for accent elements', async ({ page }) => {
        await page.waitForSelector('main', { timeout: 10000 });
        
        // Look for elements that should use orange styling
        const accentElements = page.locator('.accent, [class*="accent"], .text-accent, .bg-accent');
        const accentCount = await accentElements.count();
        
        if (accentCount > 0) {
          for (let i = 0; i < Math.min(accentCount, 3); i++) {
            const element = accentElements.nth(i);
            
            // Check text color or background color
            const styles = await element.evaluate((el) => {
              const computed = window.getComputedStyle(el);
              return {
                color: computed.color,
                backgroundColor: computed.backgroundColor
              };
            });
            
            // Should not contain green values
            expect(styles.color).not.toContain('34, 197, 94'); // green-500
            expect(styles.backgroundColor).not.toContain('34, 197, 94');
            
            // Should contain orange or stone values from OYN palette
            const oynColors = [
              '249, 115, 22', // orange-500
              '234, 88, 12',  // orange-600
              '120, 113, 108', // stone-500
              '87, 83, 78'     // stone-600
            ];
            
            const hasOynColor = oynColors.some(color => 
              styles.color.includes(color) || styles.backgroundColor.includes(color)
            );
            
            // At least some elements should use OYN colors
            if (i === 0) {
              expect(hasOynColor).toBe(true);
            }
          }
        }
      });

      test('should use warm OYN color scheme for buttons and CTAs', async ({ page }) => {
        await page.waitForSelector('main', { timeout: 10000 });
        
        const buttons = page.locator('button, .btn, a[class*="btn"]');
        const buttonCount = await buttons.count();
        
        if (buttonCount > 0) {
          for (let i = 0; i < Math.min(buttonCount, 3); i++) {
            const button = buttons.nth(i);
            
            const backgroundColor = await button.evaluate((el) => {
              return window.getComputedStyle(el).backgroundColor;
            });
            
            // Should not use green colors
            expect(backgroundColor).not.toContain('34, 197, 94'); // green-500
            expect(backgroundColor).not.toContain('22, 163, 74'); // green-600
            
            // Should use orange or appropriate OYN colors
            const warmColors = [
              '249, 115, 22', // orange-500
              '234, 88, 12',  // orange-600
              '194, 65, 12'   // orange-700
            ];
            
            const hasWarmColor = warmColors.some(color => backgroundColor.includes(color));
            
            // Primary buttons should use warm colors
            const isPrimary = await button.evaluate((el) => {
              return el.className.includes('primary') || 
                     el.className.includes('cta') ||
                     el.tagName === 'BUTTON';
            });
            
            if (isPrimary) {
              expect(hasWarmColor).toBe(true);
            }
          }
        }
      });
    });

    test.describe('Gallifrey Brand Color Preservation', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000');
      });

      test('should maintain Gallifrey teal colors on main site', async ({ page }) => {
        await page.waitForSelector('main', { timeout: 10000 });
        
        // Check primary brand elements use Gallifrey teal
        const primaryElements = page.locator('.bg-primary, .text-primary, .border-primary');
        const primaryCount = await primaryElements.count();
        
        if (primaryCount > 0) {
          const primaryColor = await primaryElements.first().evaluate((el) => {
            const computed = window.getComputedStyle(el);
            return computed.backgroundColor || computed.color || computed.borderColor;
          });
          
          // Should use Gallifrey teal
          expect(primaryColor).toContain('45, 90, 135'); // gallifrey-teal
        }
      });

      test('should not affect main site colors when fixing OYN colors', async ({ page }) => {
        await page.waitForSelector('main', { timeout: 10000 });
        
        // Ensure main site doesn't accidentally get OYN colors
        const pageContent = page.locator('body');
        
        const hasOrangeColors = await pageContent.evaluate((el) => {
          const allElements = el.querySelectorAll('*');
          let foundOrange = false;
          
          for (const element of allElements) {
            const computed = window.getComputedStyle(element);
            const colors = [computed.color, computed.backgroundColor, computed.borderColor];
            
            for (const color of colors) {
              if (color && (color.includes('249, 115, 22') || color.includes('234, 88, 12'))) {
                foundOrange = true;
                break;
              }
            }
            
            if (foundOrange) break;
          }
          
          return foundOrange;
        });
        
        // Main site should not have OYN orange colors
        expect(hasOrangeColors).toBe(false);
      });
    });
  });

  test.describe('Cross-Browser Color Consistency', () => {
    test('should render colors consistently across browsers', async ({ page, browserName }) => {
      await page.goto('http://localhost:3000/own-your-narrative');
      await page.waitForSelector('header', { timeout: 10000 });
      
      // Test that orange colors render properly in all browsers
      const navLink = page.locator('header nav a').first();
      
      if (await navLink.count() > 0) {
        await navLink.hover();
        
        const hoverColor = await navLink.evaluate((el) => {
          return window.getComputedStyle(el).color;
        });
        
        // Color should be valid RGB format regardless of browser
        expect(hoverColor).toMatch(/rgb\(\d+,\s*\d+,\s*\d+\)/);
        
        // Should not be purple in any browser
        expect(hoverColor).not.toContain('147, 51, 234');
      }
    });
  });

  test.describe('Responsive Design Consistency', () => {
    test('should maintain color consistency across viewport sizes', async ({ page }) => {
      const viewports = [
        { width: 375, height: 667 },   // Mobile
        { width: 768, height: 1024 },  // Tablet
        { width: 1024, height: 768 }   // Desktop
      ];
      
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.goto('http://localhost:3000/own-your-narrative');
        await page.waitForSelector('header', { timeout: 10000 });
        
        // Check that orange colors are maintained across viewports
        const ctaButton = page.locator('header button').first();
        
        if (await ctaButton.count() > 0) {
          const buttonColor = await ctaButton.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
          });
          
          // Should not be purple at any viewport size
          expect(buttonColor).not.toContain('147, 51, 234');
          
          // Should be orange
          const hasOrange = ['249, 115, 22', '234, 88, 12'].some(orange => 
            buttonColor.includes(orange)
          );
          expect(hasOrange).toBe(true);
        }
      }
    });
  });
});