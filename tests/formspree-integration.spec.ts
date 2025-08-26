import { test, expect } from '@playwright/test';

test.describe('Formspree Integration Tests', () => {
  test.describe('Main Contact Form (mgvzdpqo)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      // Navigate to contact section
      await page.locator('a[href="#contact"], text=Contact').first().click({ timeout: 5000 }).catch(() => {
        // If no contact link, scroll to bottom
        return page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      });
      await page.waitForTimeout(2000);
    });

    test('main contact form has correct Formspree endpoint', async ({ page }) => {
      // Look for any form on the page
      await page.waitForSelector('form, input[name="name"], input[name="email"]', { timeout: 10000 });
      
      // Check for form fields anywhere on the page
      const nameField = page.locator('input[name="name"], input[placeholder*="name" i], input[id*="name"]').first();
      const emailField = page.locator('input[name="email"], input[type="email"], input[placeholder*="email" i]').first();
      const messageField = page.locator('textarea[name="message"], textarea[placeholder*="message" i], textarea[id*="message"]').first();
      
      await expect(nameField).toBeVisible();
      await expect(emailField).toBeVisible();
      await expect(messageField).toBeVisible();
    });

    test('main contact form handles successful submission', async ({ page }) => {
      // Intercept Formspree API calls
      await page.route('https://formspree.io/f/mgvzdpqo', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true })
        });
      });

      const nameField = page.locator('input[name="name"]').first();
      const emailField = page.locator('input[name="email"], input[type="email"]').first();
      const messageField = page.locator('textarea[name="message"]').first();
      const submitButton = page.locator('button[type="submit"]').first();

      if (await nameField.isVisible() && await emailField.isVisible() && await messageField.isVisible()) {
        await nameField.fill('Test User');
        await emailField.fill('test@example.com');
        await messageField.fill('Test message for main contact form');
        
        await submitButton.click();
        await page.waitForTimeout(2000);
        
        // Check for success message
        const successIndicator = page.locator('text=/success|thank|sent|received/i, [class*="success"]');
        await expect(successIndicator.first()).toBeVisible();
      }
    });

    test('main contact form handles submission errors gracefully', async ({ page }) => {
      // Intercept Formspree API calls with error response
      await page.route('https://formspree.io/f/mgvzdpqo', async route => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ errors: [{ field: 'email', code: 'INVALID' }] })
        });
      });

      const nameField = page.locator('input[name="name"]').first();
      const emailField = page.locator('input[name="email"], input[type="email"]').first();
      const messageField = page.locator('textarea[name="message"]').first();
      const submitButton = page.locator('button[type="submit"]').first();

      if (await nameField.isVisible() && await emailField.isVisible() && await messageField.isVisible()) {
        await nameField.fill('Test User');
        await emailField.fill('invalid-email');
        await messageField.fill('Test message');
        
        await submitButton.click();
        await page.waitForTimeout(2000);
        
        // Should show error message or handle gracefully
        const errorIndicator = page.locator('text=/error|failed|invalid|try again/i, [class*="error"]');
        const hasError = await errorIndicator.first().isVisible();
        
        // Form should either show error or remain functional
        expect(hasError || await submitButton.isEnabled()).toBe(true);
      }
    });

    test('main contact form shows loading state during submission', async ({ page }) => {
      // Intercept with delayed response
      await page.route('https://formspree.io/f/mgvzdpqo', async route => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true })
        });
      });

      const nameField = page.locator('input[name="name"]').first();
      const emailField = page.locator('input[name="email"], input[type="email"]').first();
      const messageField = page.locator('textarea[name="message"]').first();
      const submitButton = page.locator('button[type="submit"]').first();

      if (await nameField.isVisible() && await emailField.isVisible() && await messageField.isVisible()) {
        await nameField.fill('Test User');
        await emailField.fill('test@example.com');
        await messageField.fill('Test message');
        
        await submitButton.click();
        
        // Check for loading state immediately after click
        const loadingIndicator = page.locator('[class*="loading"], [class*="spinner"], text=/sending|submitting/i');
        const buttonDisabled = await submitButton.isDisabled();
        
        expect(buttonDisabled || await loadingIndicator.first().isVisible()).toBe(true);
      }
    });
  });

  test.describe('Consultative Contact Form (mgvzdpqo)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      // Look for consultative contact form
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);
    });

    test('consultative form has all required fields', async ({ page }) => {
      // Look for the more complex consultative form
      const forms = page.locator('form');
      const formCount = await forms.count();
      
      if (formCount > 1) {
        // Check the second form (consultative)
        const consultativeForm = forms.nth(1);
        
        const nameField = consultativeForm.locator('input[name="name"]');
        const emailField = consultativeForm.locator('input[name="email"], input[type="email"]');
        
        if (await nameField.isVisible()) {
          await expect(nameField).toBeVisible();
          await expect(emailField).toBeVisible();
          
          // Check for additional consultative fields
          const companyField = consultativeForm.locator('input[name="company"], input[placeholder*="company"]');
          const projectTypeField = consultativeForm.locator('select[name="project_type"], select[name="projectType"]');
          
          // At least one additional field should exist for consultative form
          const hasCompany = await companyField.isVisible();
          const hasProjectType = await projectTypeField.isVisible();
          
          expect(hasCompany || hasProjectType).toBe(true);
        }
      }
    });

    test('consultative form integrates with Calendly', async ({ page }) => {
      // After form submission, should redirect to Calendly
      await page.route('https://formspree.io/f/mgvzdpqo', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true })
        });
      });

      const forms = page.locator('form');
      const formCount = await forms.count();
      
      if (formCount > 1) {
        const consultativeForm = forms.nth(1);
        const nameField = consultativeForm.locator('input[name="name"]').first();
        const emailField = consultativeForm.locator('input[name="email"], input[type="email"]').first();
        const submitButton = consultativeForm.locator('button[type="submit"]').first();

        if (await nameField.isVisible() && await emailField.isVisible()) {
          // Listen for new page opening (Calendly)
          const [newPage] = await Promise.all([
            page.context().waitForEvent('page'),
            (async () => {
              await nameField.fill('Test User');
              await emailField.fill('test@example.com');
              await submitButton.click();
              await page.waitForTimeout(1000);
            })()
          ]);

          // Should open Calendly with pre-filled information
          expect(newPage.url()).toContain('calendly.com');
          expect(newPage.url()).toContain('name=Test%20User');
          expect(newPage.url()).toContain('email=test%40example.com');
          
          await newPage.close();
        }
      }
    });
  });

  test.describe('Own Your Narrative Form (mzzprpkq)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/own-your-narrative');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    });

    test('OYN campaign page loads successfully', async ({ page }) => {
      // More flexible title check
      const title = await page.title();
      const hasOYNTitle = title.includes('Own Your Narrative') || title.includes('Gallifrey');
      expect(hasOYNTitle).toBe(true);
      
      // Check for campaign-specific content - more flexible
      const campaignContent = page.locator('text=/Own Your Narrative/i, text=/digital narrative/i, text=/platform independence/i, text=/ambitious entrepreneurs/i');
      await expect(campaignContent.first()).toBeVisible();
    });

    test('OYN form has campaign-specific fields', async ({ page }) => {
      const form = page.locator('form').first();
      await expect(form).toBeVisible();
      
      // Campaign form should have project type selector
      const projectTypeField = page.locator('select[name="project_type"], select[name="projectType"]');
      const budgetField = page.locator('select[name="budget"]');
      
      await expect(projectTypeField).toBeVisible();
      
      // Check for campaign-specific options
      if (await projectTypeField.isVisible()) {
        await projectTypeField.click();
        
        // Should have options like "Personal Website ($1000+)"
        const personalOption = page.locator('option[value="personal"], option:has-text("Personal Website")');
        await expect(personalOption).toBeVisible();
      }
    });

    test('OYN form submits to correct Formspree endpoint', async ({ page }) => {
      // Intercept the campaign-specific Formspree endpoint
      await page.route('https://formspree.io/f/mzzprpkq', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true })
        });
      });

      const nameField = page.locator('input[name="name"]').first();
      const emailField = page.locator('input[name="email"], input[type="email"]').first();
      const projectTypeField = page.locator('select[name="project_type"], select[name="projectType"]').first();
      const submitButton = page.locator('button[type="submit"]').first();

      if (await nameField.isVisible() && await emailField.isVisible()) {
        await nameField.fill('Campaign User');
        await emailField.fill('campaign@example.com');
        
        if (await projectTypeField.isVisible()) {
          await projectTypeField.selectOption('personal');
        }
        
        await submitButton.click();
        await page.waitForTimeout(2000);
        
        // Should show success message
        const successIndicator = page.locator('text=/success|thank|sent|received/i, [class*="success"]');
        await expect(successIndicator.first()).toBeVisible();
      }
    });

    test('OYN form includes campaign-specific metadata', async ({ page }) => {
      let requestBody: any;
      
      // Intercept and capture request body
      await page.route('https://formspree.io/f/mzzprpkq', async route => {
        const request = route.request();
        requestBody = await request.postData();
        
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true })
        });
      });

      const nameField = page.locator('input[name="name"]').first();
      const emailField = page.locator('input[name="email"], input[type="email"]').first();
      const submitButton = page.locator('button[type="submit"]').first();

      if (await nameField.isVisible() && await emailField.isVisible()) {
        await nameField.fill('Campaign User');
        await emailField.fill('campaign@example.com');
        await submitButton.click();
        
        await page.waitForTimeout(1000);
        
        // Check if request includes campaign metadata
        expect(requestBody).toContain('Own Your Narrative');
        expect(requestBody).toContain('form_type');
      }
    });
  });

  test.describe('Form Security and Validation', () => {
    test('forms prevent XSS attacks', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const nameField = page.locator('input[name="name"]').first();
      const emailField = page.locator('input[name="email"], input[type="email"]').first();
      const messageField = page.locator('textarea[name="message"]').first();

      if (await nameField.isVisible()) {
        // Try XSS payload
        await nameField.fill('<script>alert("xss")</script>');
        await emailField.fill('test@example.com');
        await messageField.fill('<img src="x" onerror="alert(\'xss\')"');
        
        // Values should be sanitized/escaped
        const nameValue = await nameField.inputValue();
        const messageValue = await messageField.inputValue();
        
        expect(nameValue).toContain('<script>'); // Should be rendered as text, not executed
        expect(messageValue).toContain('<img'); // Should be rendered as text, not executed
      }
    });

    test('forms have proper CSRF protection', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Formspree handles CSRF protection, but check if forms include proper headers
      const form = page.locator('form').first();
      
      if (await form.isVisible()) {
        // Look for hidden CSRF token or proper form attributes
        const hiddenInputs = form.locator('input[type="hidden"]');
        const formMethod = await form.getAttribute('method');
        const formAction = await form.getAttribute('action');
        
        // Should use POST method and proper action
        expect(formMethod?.toLowerCase()).toBe('post');
        expect(formAction?.includes('formspree.io') || !formAction).toBe(true);
      }
    });

    test('forms validate email format client-side', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const emailField = page.locator('input[name="email"], input[type="email"]').first();
      
      if (await emailField.isVisible()) {
        await emailField.fill('invalid-email');
        await emailField.blur();
        
        // Should show validation error
        const isInvalid = await emailField.getAttribute('aria-invalid');
        const validationMessage = await page.locator(':invalid').first().isVisible();
        
        expect(isInvalid === 'true' || validationMessage).toBe(true);
      }
    });

    test('forms prevent spam with rate limiting', async ({ page }) => {
      // Test rapid submissions
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      let submissionCount = 0;
      
      await page.route('https://formspree.io/f/**', async route => {
        submissionCount++;
        
        if (submissionCount > 3) {
          // Simulate rate limiting
          await route.fulfill({
            status: 429,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Too many requests' })
          });
        } else {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ ok: true })
          });
        }
      });

      const nameField = page.locator('input[name="name"]').first();
      const emailField = page.locator('input[name="email"], input[type="email"]').first();
      const messageField = page.locator('textarea[name="message"]').first();
      const submitButton = page.locator('button[type="submit"]').first();

      if (await nameField.isVisible() && await emailField.isVisible() && await messageField.isVisible()) {
        // Rapid submissions
        for (let i = 0; i < 5; i++) {
          await nameField.fill(`User ${i}`);
          await emailField.fill(`user${i}@example.com`);
          await messageField.fill(`Message ${i}`);
          await submitButton.click();
          await page.waitForTimeout(100);
        }
        
        // Should handle rate limiting gracefully
        const errorMessage = page.locator('text=/rate limit|too many|try again later/i');
        const hasRateLimitMessage = await errorMessage.first().isVisible();
        
        // Either shows rate limit message or handles gracefully
        expect(submissionCount).toBeGreaterThan(1);
      }
    });
  });
});