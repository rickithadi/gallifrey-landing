const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

class DesignReviewer {
  constructor() {
    this.standards = require('./design-standards.json');
    this.results = {
      timestamp: new Date().toISOString(),
      issues: [],
      warnings: [],
      passed: [],
      screenshots: []
    };
  }

  async review(url = 'http://localhost:3000') {
    console.log('🎨 Starting automated design review...');
    
    const browser = await chromium.launch();
    const context = await browser.newContext();
    
    try {
      // Review main landing page
      await this.reviewPage(context, url, 'main-landing', 'gallifrey');
      
      // Review Own Your Narrative campaign page
      await this.reviewPage(context, `${url}/own-your-narrative`, 'campaign', 'ownYourNarrative');
      
      // Generate report
      await this.generateReport();
      
    } finally {
      await browser.close();
    }
    
    return this.results;
  }

  async reviewPage(context, url, pageName, brandContext) {
    console.log(`📄 Reviewing ${pageName} page...`);
    
    const page = await context.newPage();
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for visual reference
    const screenshotPath = `design-review-${pageName}-${Date.now()}.png`;
    await page.screenshot({ 
      path: `test-results/${screenshotPath}`, 
      fullPage: true 
    });
    this.results.screenshots.push(screenshotPath);
    
    // Run validation checks
    await this.checkBrandConsistency(page, brandContext, pageName);
    await this.checkTypography(page, pageName);
    await this.checkAccessibility(page, pageName);
    await this.checkResponsiveness(page, pageName);
    await this.checkSEO(page, pageName);
    
    await page.close();
  }

  async checkBrandConsistency(page, brandContext, pageName) {
    const brand = this.standards.brandStandards[brandContext];
    
    try {
      // Check for brand-specific color usage
      if (brandContext === 'gallifrey') {
        const gallfreyElements = await page.locator('[class*="gallifrey"]').count();
        if (gallfreyElements === 0) {
          this.addWarning(pageName, 'Brand Colors', 'No Gallifrey brand classes found');
        } else {
          this.addPassed(pageName, 'Brand Colors', `Found ${gallfreyElements} Gallifrey brand elements`);
        }
      } else if (brandContext === 'ownYourNarrative') {
        const campaignElements = await page.locator('[class*="oyn-"], [class*="gradient"]').count();
        if (campaignElements === 0) {
          this.addWarning(pageName, 'Campaign Colors', 'No campaign-specific styling found');
        } else {
          this.addPassed(pageName, 'Campaign Colors', `Found ${campaignElements} campaign elements`);
        }
      }
      
      // Check for conflicting brand elements
      if (brandContext === 'gallifrey') {
        const campaignLeakage = await page.locator('[class*="oyn-"]').count();
        if (campaignLeakage > 0) {
          this.addIssue(pageName, 'Brand Consistency', `Campaign styles found on main brand page: ${campaignLeakage} elements`);
        }
      }
      
    } catch (error) {
      this.addWarning(pageName, 'Brand Consistency', `Check failed: ${error.message}`);
    }
  }

  async checkTypography(page, pageName) {
    try {
      // Check heading hierarchy
      const h1Count = await page.locator('h1').count();
      if (h1Count !== 1) {
        this.addIssue(pageName, 'Typography', `Should have exactly 1 H1, found ${h1Count}`);
      } else {
        this.addPassed(pageName, 'Typography', 'Proper H1 usage');
      }
      
      // Check for font families
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').first();
      if (await headings.isVisible()) {
        const fontFamily = await headings.evaluate(el => getComputedStyle(el).fontFamily);
        if (!fontFamily.includes('Montserrat')) {
          this.addWarning(pageName, 'Typography', 'Headings may not be using Montserrat font');
        } else {
          this.addPassed(pageName, 'Typography', 'Heading font family correct');
        }
      }
      
    } catch (error) {
      this.addWarning(pageName, 'Typography', `Check failed: ${error.message}`);
    }
  }

  async checkAccessibility(page, pageName) {
    try {
      // Check images have alt text
      const images = await page.locator('img').all();
      let missingAlt = 0;
      
      for (const img of images) {
        const alt = await img.getAttribute('alt');
        if (!alt || alt.trim() === '') {
          missingAlt++;
        }
      }
      
      if (missingAlt > 0) {
        this.addIssue(pageName, 'Accessibility', `${missingAlt} images missing alt text`);
      } else if (images.length > 0) {
        this.addPassed(pageName, 'Accessibility', 'All images have alt text');
      }
      
      // Check form labels
      const inputs = await page.locator('input, textarea, select').all();
      let unlabeledInputs = 0;
      
      for (const input of inputs) {
        const ariaLabel = await input.getAttribute('aria-label');
        const id = await input.getAttribute('id');
        const hasLabel = id ? await page.locator(`label[for="${id}"]`).count() > 0 : false;
        
        if (!ariaLabel && !hasLabel) {
          unlabeledInputs++;
        }
      }
      
      if (unlabeledInputs > 0) {
        this.addIssue(pageName, 'Accessibility', `${unlabeledInputs} form inputs missing labels`);
      } else if (inputs.length > 0) {
        this.addPassed(pageName, 'Accessibility', 'All form inputs have labels');
      }
      
    } catch (error) {
      this.addWarning(pageName, 'Accessibility', `Check failed: ${error.message}`);
    }
  }

  async checkResponsiveness(page, pageName) {
    try {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(1000);
      
      // Check for horizontal scrollbars
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      
      if (hasHorizontalScroll) {
        this.addIssue(pageName, 'Responsive Design', 'Horizontal scroll detected on mobile');
      } else {
        this.addPassed(pageName, 'Responsive Design', 'No horizontal scroll on mobile');
      }
      
      // Reset viewport
      await page.setViewportSize({ width: 1024, height: 768 });
      
    } catch (error) {
      this.addWarning(pageName, 'Responsive Design', `Check failed: ${error.message}`);
    }
  }

  async checkSEO(page, pageName) {
    try {
      // Check title length
      const title = await page.title();
      if (title.length > 60) {
        this.addWarning(pageName, 'SEO', `Title too long: ${title.length} characters (should be under 60)`);
      } else {
        this.addPassed(pageName, 'SEO', 'Title length appropriate');
      }
      
      // Check meta description
      const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
      if (metaDesc && metaDesc.length > 160) {
        this.addWarning(pageName, 'SEO', `Meta description too long: ${metaDesc.length} characters`);
      } else if (metaDesc) {
        this.addPassed(pageName, 'SEO', 'Meta description length appropriate');
      }
      
      // Check for structured data
      const structuredData = await page.locator('script[type="application/ld+json"]').count();
      if (structuredData === 0) {
        this.addWarning(pageName, 'SEO', 'No structured data found');
      } else {
        this.addPassed(pageName, 'SEO', `Structured data present: ${structuredData} scripts`);
      }
      
    } catch (error) {
      this.addWarning(pageName, 'SEO', `Check failed: ${error.message}`);
    }
  }

  addIssue(page, category, message) {
    this.results.issues.push({ page, category, message, severity: 'error' });
  }

  addWarning(page, category, message) {
    this.results.warnings.push({ page, category, message, severity: 'warning' });
  }

  addPassed(page, category, message) {
    this.results.passed.push({ page, category, message, severity: 'success' });
  }

  async generateReport() {
    const reportDir = 'design-review-reports';
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(reportDir, `design-review-${timestamp}.json`);
    
    // Generate summary
    this.results.summary = {
      totalChecks: this.results.issues.length + this.results.warnings.length + this.results.passed.length,
      issues: this.results.issues.length,
      warnings: this.results.warnings.length,
      passed: this.results.passed.length,
      score: this.calculateScore()
    };
    
    // Write JSON report
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    
    // Generate HTML report
    await this.generateHTMLReport(reportDir, timestamp);
    
    console.log(`📊 Design review complete!`);
    console.log(`   Issues: ${this.results.issues.length}`);
    console.log(`   Warnings: ${this.results.warnings.length}`);
    console.log(`   Passed: ${this.results.passed.length}`);
    console.log(`   Score: ${this.results.summary.score}%`);
    console.log(`   Report: ${reportPath}`);
    
    return reportPath;
  }

  calculateScore() {
    const total = this.results.issues.length + this.results.warnings.length + this.results.passed.length;
    if (total === 0) return 100;
    
    const weighted = (this.results.passed.length * 1) + (this.results.warnings.length * 0.5) + (this.results.issues.length * 0);
    return Math.round((weighted / total) * 100);
  }

  async generateHTMLReport(reportDir, timestamp) {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Design Review Report - ${timestamp}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: white; padding: 30px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .score { font-size: 3em; font-weight: bold; color: ${this.getScoreColor()}; }
        .section { background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .issue { padding: 10px; margin: 5px 0; border-radius: 6px; }
        .error { background: #fee2e2; border-left: 4px solid #ef4444; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; }
        .success { background: #dcfce7; border-left: 4px solid #22c55e; }
        .category { font-weight: 600; color: #374151; }
        .message { color: #6b7280; margin-top: 4px; }
        .screenshot { max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎨 Design Review Report</h1>
            <p><strong>Generated:</strong> ${this.results.timestamp}</p>
            <div class="score">${this.results.summary.score}%</div>
            <p><strong>Summary:</strong> ${this.results.summary.issues} issues, ${this.results.summary.warnings} warnings, ${this.results.summary.passed} passed</p>
        </div>

        ${this.results.issues.length > 0 ? `
        <div class="section">
            <h2>🚨 Issues (${this.results.issues.length})</h2>
            ${this.results.issues.map(item => `
                <div class="issue error">
                    <div class="category">${item.page} - ${item.category}</div>
                    <div class="message">${item.message}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${this.results.warnings.length > 0 ? `
        <div class="section">
            <h2>⚠️ Warnings (${this.results.warnings.length})</h2>
            ${this.results.warnings.map(item => `
                <div class="issue warning">
                    <div class="category">${item.page} - ${item.category}</div>
                    <div class="message">${item.message}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <div class="section">
            <h2>✅ Passed Checks (${this.results.passed.length})</h2>
            ${this.results.passed.map(item => `
                <div class="issue success">
                    <div class="category">${item.page} - ${item.category}</div>
                    <div class="message">${item.message}</div>
                </div>
            `).join('')}
        </div>

        ${this.results.screenshots.length > 0 ? `
        <div class="section">
            <h2>📸 Screenshots</h2>
            ${this.results.screenshots.map(screenshot => `
                <div>
                    <h3>${screenshot}</h3>
                    <img src="../test-results/${screenshot}" alt="Screenshot" class="screenshot">
                </div>
            `).join('')}
        </div>
        ` : ''}
    </div>
</body>
</html>`;

    const htmlPath = path.join(reportDir, `design-review-${timestamp}.html`);
    fs.writeFileSync(htmlPath, htmlContent);
    console.log(`   HTML Report: ${htmlPath}`);
  }

  getScoreColor() {
    const score = this.results.summary.score;
    if (score >= 90) return '#22c55e';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  }
}

// CLI usage
if (require.main === module) {
  const url = process.argv[2] || 'http://localhost:3000';
  const reviewer = new DesignReviewer();
  
  reviewer.review(url).then(results => {
    process.exit(results.issues.length > 0 ? 1 : 0);
  }).catch(error => {
    console.error('Design review failed:', error);
    process.exit(1);
  });
}

module.exports = DesignReviewer;