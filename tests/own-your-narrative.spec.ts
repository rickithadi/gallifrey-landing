import { test, expect } from '@playwright/test';

test.describe('Own Your Narrative Campaign Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/own-your-narrative');
  });

  test('has campaign-specific title and meta', async ({ page }) => {
    // Check title includes campaign messaging
    await expect(page).toHaveTitle(/Own Your Narrative|Digital Independence|Platform Independence/);
    
    // Check meta description mentions campaign themes
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toMatch(/platform|independence|narrative|digital sovereignty/i);
  });

  test('displays campaign brand colors correctly', async ({ page }) => {
    // Check for OYN color scheme elements
    const campaignElements = page.locator('[class*="oyn-"], [class*="stone-"], [class*="orange-"]');
    await expect(campaignElements.first()).toBeVisible();
    
    // Check for gradient backgrounds specific to campaign
    const gradientElements = page.locator('[class*="gradient"], [style*="gradient"]');
    await expect(gradientElements.first()).toBeVisible();
  });

  test('campaign messaging is present', async ({ page }) => {
    // Check for key campaign phrases
    const campaignPhrases = [
      'Own Your Narrative',
      'platform independence',
      'digital sovereignty',
      'Stop building someone else\'s empire',
      'digital independence'
    ];
    
    let foundPhrase = false;
    for (const phrase of campaignPhrases) {
      const element = page.locator(`text=/.*${phrase}.*/i`);
      if (await element.first().isVisible()) {
        foundPhrase = true;
        break;
      }
    }
    expect(foundPhrase).toBe(true);
  });

  test('service packages are displayed with pricing', async ({ page }) => {
    // Look for campaign-specific service packages
    const servicePackages = [
      'Family Protection Starter',
      'Creator Liberation',
      'Professional Authority',
      'Enterprise Digital Sovereignty'
    ];
    
    let foundPackage = false;
    for (const packageName of servicePackages) {
      const element = page.locator(`text=/.*${packageName}.*/i`);
      if (await element.first().isVisible()) {
        foundPackage = true;
        break;
      }
    }
    expect(foundPackage).toBe(true);
    
    // Check for pricing
    const priceElements = page.locator('text=/\\$[0-9,]+/');
    await expect(priceElements.first()).toBeVisible();
  });

  test('anti-Big Tech messaging is present', async ({ page }) => {
    // Check for messaging about platform risks
    const antiTechMessages = [
      'algorithm',
      'de-platform',
      'Big Tech',
      'platform prison',
      'account suspend',
      'data exploitation'
    ];
    
    let foundMessage = false;
    for (const message of antiTechMessages) {
      const element = page.locator(`text=/.*${message}.*/i`);
      if (await element.first().isVisible()) {
        foundMessage = true;
        break;
      }
    }
    expect(foundMessage).toBe(true);
  });

  test('creator economy targeting is evident', async ({ page }) => {
    // Check for creator-focused messaging
    const creatorTerms = [
      'creator',
      'content creator',
      'influencer',
      'personal brand',
      'audience',
      'followers'
    ];
    
    let foundCreatorTerm = false;
    for (const term of creatorTerms) {
      const element = page.locator(`text=/.*${term}.*/i`);
      if (await element.first().isVisible()) {
        foundCreatorTerm = true;
        break;
      }
    }
    expect(foundCreatorTerm).toBe(true);
  });

  test('family protection messaging appears', async ({ page }) => {
    // Check for family-focused content
    const familyTerms = [
      'family',
      'children',
      'kids',
      'parents',
      'memories',
      'photos',
      'privacy protection'
    ];
    
    let foundFamilyTerm = false;
    for (const term of familyTerms) {
      const element = page.locator(`text=/.*${term}.*/i`);
      if (await element.first().isVisible()) {
        foundFamilyTerm = true;
        break;
      }
    }
    expect(foundFamilyTerm).toBe(true);
  });

  test('warm color palette is implemented', async ({ page }) => {
    // Check for warm campaign colors in computed styles
    const warmElements = page.locator('[class*="orange"], [class*="stone"], [class*="warm"]');
    await expect(warmElements.first()).toBeVisible();
    
    // Verify gradient implementation
    const gradientElement = page.locator('[style*="linear-gradient"], [class*="gradient"]').first();
    if (await gradientElement.isVisible()) {
      const styles = await gradientElement.getAttribute('style');
      expect(styles).toMatch(/#1B365D|#00796B|#FFB74D/);
    }
  });

  test('heavier typography weights are used', async ({ page }) => {
    // Check for bold/heavy font weights in campaign
    const heavyText = page.locator('[class*="font-bold"], [class*="font-black"], [class*="font-800"], [class*="font-700"]');
    await expect(heavyText.first()).toBeVisible();
  });

  test('contact form or CTA is present', async ({ page }) => {
    // Look for consultation booking or contact forms
    const ctaElements = page.locator('button:has-text("consultation"), button:has-text("contact"), button:has-text("start"), a:has-text("book")');
    await expect(ctaElements.first()).toBeVisible();
  });

  test('page maintains accessibility standards', async ({ page }) => {
    // Check heading structure
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Check for alt text on images
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('responsive design works on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      // Ensure campaign elements stack properly on mobile
      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent).toBeVisible();
      
      // Check that pricing cards/packages are readable on mobile
      const priceElements = page.locator('text=/\\$[0-9,]+/');
      await expect(priceElements.first()).toBeVisible();
    }
  });
});