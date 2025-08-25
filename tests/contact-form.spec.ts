import { test, expect } from '@playwright/test';

test.describe('Contact Form Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('contact form is visible and contains required fields', async ({ page }) => {
    // Scroll to contact section first
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    // Find the contact form
    const form = page.locator('form, [data-testid="contact-form"]');
    await expect(form).toBeVisible();
    
    // Check for essential form fields
    const nameField = page.locator('input[name="name"], input[id*="name"], input[placeholder*="name"]');
    const emailField = page.locator('input[name="email"], input[id*="email"], input[type="email"]');
    const messageField = page.locator('textarea[name="message"], textarea[id*="message"], textarea[placeholder*="message"]');
    
    await expect(nameField.first()).toBeVisible();
    await expect(emailField.first()).toBeVisible();
    await expect(messageField.first()).toBeVisible();
  });

  test('form validation works for required fields', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("send"), button:has-text("submit")');
    
    if (await submitButton.first().isVisible()) {
      // Try to submit empty form
      await submitButton.first().click();
      
      // Check if validation messages appear or form doesn't submit
      const validationMessages = page.locator('[role="alert"], .error, [class*="error"], [aria-invalid="true"]');
      
      // Either validation messages should appear, or the page shouldn't navigate
      const currentUrl = page.url();
      await page.waitForTimeout(1000); // Wait for potential validation
      
      const hasValidation = await validationMessages.first().isVisible();
      const stayedOnPage = page.url() === currentUrl;
      
      expect(hasValidation || stayedOnPage).toBe(true);
    }
  });

  test('email field validates email format', async ({ page }) => {
    const emailField = page.locator('input[name="email"], input[id*="email"], input[type="email"]').first();
    
    if (await emailField.isVisible()) {
      // Enter invalid email
      await emailField.fill('invalid-email');
      await emailField.blur();
      
      // Check for validation
      const isInvalid = await emailField.getAttribute('aria-invalid');
      const hasErrorClass = await emailField.getAttribute('class');
      
      expect(isInvalid === 'true' || hasErrorClass?.includes('error')).toBe(true);
    }
  });

  test('form can be filled out completely', async ({ page }) => {
    // Fill out the form with valid data
    const nameField = page.locator('input[name="name"], input[id*="name"], input[placeholder*="name"]').first();
    const emailField = page.locator('input[name="email"], input[id*="email"], input[type="email"]').first();
    const messageField = page.locator('textarea[name="message"], textarea[id*="message"], textarea[placeholder*="message"]').first();
    
    if (await nameField.isVisible()) {
      await nameField.fill('Test User');
    }
    
    if (await emailField.isVisible()) {
      await emailField.fill('test@example.com');
    }
    
    if (await messageField.isVisible()) {
      await messageField.fill('This is a test message for the contact form.');
    }
    
    // Verify fields were filled
    if (await nameField.isVisible()) {
      await expect(nameField).toHaveValue('Test User');
    }
    if (await emailField.isVisible()) {
      await expect(emailField).toHaveValue('test@example.com');
    }
    if (await messageField.isVisible()) {
      await expect(messageField).toHaveValue('This is a test message for the contact form.');
    }
  });

  test('form has proper accessibility attributes', async ({ page }) => {
    const form = page.locator('form, [data-testid="contact-form"]').first();
    
    if (await form.isVisible()) {
      // Check for labels
      const labels = page.locator('label');
      await expect(labels.first()).toBeVisible();
      
      // Check that form fields have proper associations
      const requiredFields = page.locator('input[required], textarea[required]');
      const fieldCount = await requiredFields.count();
      
      if (fieldCount > 0) {
        // Each required field should have a label or aria-label
        for (let i = 0; i < fieldCount; i++) {
          const field = requiredFields.nth(i);
          const hasLabel = await field.getAttribute('aria-label');
          const hasAriaLabelledBy = await field.getAttribute('aria-labelledby');
          const fieldId = await field.getAttribute('id');
          
          if (fieldId) {
            const associatedLabel = page.locator(`label[for="${fieldId}"]`);
            const hasAssociatedLabel = await associatedLabel.isVisible();
            
            expect(hasLabel || hasAriaLabelledBy || hasAssociatedLabel).toBe(true);
          }
        }
      }
    }
  });

  test('form submission provides feedback', async ({ page }) => {
    // Fill out form with valid data
    const nameField = page.locator('input[name="name"], input[id*="name"], input[placeholder*="name"]').first();
    const emailField = page.locator('input[name="email"], input[id*="email"], input[type="email"]').first();
    const messageField = page.locator('textarea[name="message"], textarea[id*="message"], textarea[placeholder*="message"]').first();
    const submitButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("send"), button:has-text("submit"]').first();
    
    if (await nameField.isVisible() && await emailField.isVisible() && await messageField.isVisible() && await submitButton.isVisible()) {
      await nameField.fill('Test User');
      await emailField.fill('test@example.com');
      await messageField.fill('Test message');
      
      // Submit form
      await submitButton.click();
      
      // Wait for response (success message, redirect, or error)
      await page.waitForTimeout(3000);
      
      // Check for feedback
      const successMessage = page.locator('text=/success|thank|sent|received/i, [class*="success"], [role="status"]');
      const errorMessage = page.locator('text=/error|failed|try again/i, [class*="error"], [role="alert"]');
      const loadingIndicator = page.locator('[class*="loading"], [class*="spinner"], text=/sending|loading/i');
      
      const hasSuccessMessage = await successMessage.first().isVisible();
      const hasErrorMessage = await errorMessage.first().isVisible();
      const hasLoadingIndicator = await loadingIndicator.first().isVisible();
      
      // Should have some kind of feedback
      expect(hasSuccessMessage || hasErrorMessage || hasLoadingIndicator).toBe(true);
    }
  });

  test('contact information is displayed', async ({ page }) => {
    // Look for contact information
    const emailInfo = page.locator('text=/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/');
    const phoneInfo = page.locator('text=/\+?[\d\s\-\(\)]{10,}/');
    const locationInfo = page.locator('text=/melbourne|australia|victoria/i');
    
    // At least one form of contact info should be visible
    const hasEmail = await emailInfo.first().isVisible();
    const hasPhone = await phoneInfo.first().isVisible();
    const hasLocation = await locationInfo.first().isVisible();
    
    expect(hasEmail || hasPhone || hasLocation).toBe(true);
  });

  test('consultation booking option is available', async ({ page }) => {
    // Look for consultation-related CTAs with more flexible matching
    const consultationCTA = page.locator('text=/consultation|book|schedule|discovery.*call|30.*minute/i');
    const calendarLinks = page.locator('[href*="calendar"], [href*="booking"], [href*="calendly"], [href*="cal.com"]');
    const consultationButtons = page.locator('button:has-text("consultation"), button:has-text("schedule"), button:has-text("book"), button:has-text("discovery")');
    
    const hasConsultationText = await consultationCTA.first().isVisible();
    const hasCalendarLink = await calendarLinks.first().isVisible();
    const hasConsultationButton = await consultationButtons.first().isVisible();
    
    expect(hasConsultationText || hasCalendarLink || hasConsultationButton).toBe(true);
  });

  test('30-minute consultation guarantee is mentioned', async ({ page }) => {
    // Based on business context - 30-minute free consultation
    const consultationMention = page.locator('text=/30.*minute|30-minute|free consultation/i');
    
    const hasConsultationGuarantee = await consultationMention.first().isVisible();
    expect(hasConsultationGuarantee).toBe(true);
  });

  test('same-day response guarantee is mentioned', async ({ page }) => {
    // Based on business context - same-day response guarantee
    const responseMention = page.locator('text=/same.?day|24.?hour|quick response|fast response/i');
    
    const hasResponseGuarantee = await responseMention.first().isVisible();
    expect(hasResponseGuarantee).toBe(true);
  });
});