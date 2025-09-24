const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class GallifreyDesignReview {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      timestamp: new Date().toISOString(),
      overallScore: 0,
      brandConsistency: {},
      responsiveDesign: {},
      accessibility: {},
      uxAnalysis: {},
      componentDesign: {},
      screenshots: [],
      recommendations: []
    };
    this.outputDir = './design-review-output';
  }

  async initialize() {
    // Create output directory
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    this.browser = await chromium.launch({ headless: false });
    this.page = await this.browser.newPage();
    
    // Set viewport for desktop testing
    await this.page.setViewportSize({ width: 1440, height: 900 });
  }

  async navigateToSite() {
    console.log('🚀 Navigating to Gallifrey Consulting site...');
    await this.page.goto('http://localhost:3000');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000); // Allow animations to settle
  }

  async captureScreenshots() {
    console.log('📸 Capturing desktop screenshots...');
    
    // Full page screenshot
    await this.page.screenshot({ 
      path: `${this.outputDir}/desktop-full-page.png`, 
      fullPage: true 
    });
    this.results.screenshots.push('desktop-full-page.png');

    // Hero section
    const heroSection = await this.page.locator('section').first();
    if (await heroSection.count() > 0) {
      await heroSection.screenshot({ path: `${this.outputDir}/hero-section.png` });
      this.results.screenshots.push('hero-section.png');
    }

    // Services section
    const servicesSection = await this.page.locator('text=Services').first();
    if (await servicesSection.count() > 0) {
      await servicesSection.screenshot({ path: `${this.outputDir}/services-section.png` });
      this.results.screenshots.push('services-section.png');
    }
  }

  async testResponsiveDesign() {
    console.log('📱 Testing responsive design...');
    
    const breakpoints = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1024, height: 768 },
      { name: 'large-desktop', width: 1440, height: 900 }
    ];

    for (const breakpoint of breakpoints) {
      console.log(`Testing ${breakpoint.name} (${breakpoint.width}x${breakpoint.height})`);
      
      await this.page.setViewportSize({ 
        width: breakpoint.width, 
        height: breakpoint.height 
      });
      
      await this.page.waitForTimeout(1000); // Allow layout to adjust
      
      // Take screenshot
      await this.page.screenshot({ 
        path: `${this.outputDir}/${breakpoint.name}-view.png`,
        fullPage: true
      });
      this.results.screenshots.push(`${breakpoint.name}-view.png`);

      // Analyze layout at this breakpoint
      const layoutData = await this.analyzeLayout(breakpoint.name);
      this.results.responsiveDesign[breakpoint.name] = layoutData;
    }
  }

  async analyzeLayout(breakpointName) {
    console.log(`🔍 Analyzing layout for ${breakpointName}...`);
    
    return await this.page.evaluate(() => {
      const analysis = {
        hasHorizontalScroll: document.documentElement.scrollWidth > window.innerWidth,
        visibleElements: [],
        typography: {},
        colorAnalysis: {},
        interactiveElements: []
      };

      // Check for horizontal scroll
      analysis.hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;

      // Analyze typography
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(heading => {
        const styles = window.getComputedStyle(heading);
        analysis.typography[heading.tagName.toLowerCase()] = {
          fontSize: styles.fontSize,
          fontFamily: styles.fontFamily,
          fontWeight: styles.fontWeight,
          lineHeight: styles.lineHeight,
          color: styles.color
        };
      });

      // Analyze interactive elements
      const buttons = document.querySelectorAll('button, a[href], input[type="submit"]');
      buttons.forEach((btn, index) => {
        const rect = btn.getBoundingClientRect();
        const styles = window.getComputedStyle(btn);
        analysis.interactiveElements.push({
          type: btn.tagName.toLowerCase(),
          text: btn.textContent?.trim() || '',
          size: { width: rect.width, height: rect.height },
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          isVisible: rect.width > 0 && rect.height > 0
        });
      });

      return analysis;
    });
  }

  async analyzeAccessibility() {
    console.log('♿ Analyzing accessibility features...');
    
    const accessibility = await this.page.evaluate(() => {
      const results = {
        missingAltText: [],
        headingStructure: [],
        focusableElements: [],
        ariaLabels: [],
        colorContrast: [],
        formLabels: []
      };

      // Check images for alt text
      const images = document.querySelectorAll('img');
      images.forEach((img, index) => {
        if (!img.alt || img.alt.trim() === '') {
          results.missingAltText.push({
            src: img.src,
            index: index
          });
        }
      });

      // Analyze heading structure
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(heading => {
        results.headingStructure.push({
          level: heading.tagName,
          text: heading.textContent?.trim() || '',
          id: heading.id || null
        });
      });

      // Check focusable elements
      const focusable = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
      results.focusableElements = Array.from(focusable).map(el => ({
        tagName: el.tagName.toLowerCase(),
        type: el.type || null,
        hasTabIndex: el.hasAttribute('tabindex'),
        tabIndex: el.tabIndex,
        ariaLabel: el.getAttribute('aria-label') || null
      }));

      // Check form labels
      const inputs = document.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        const label = document.querySelector(`label[for="${input.id}"]`) || 
                     input.closest('label');
        results.formLabels.push({
          inputType: input.type || input.tagName.toLowerCase(),
          hasLabel: !!label,
          labelText: label?.textContent?.trim() || '',
          placeholder: input.placeholder || ''
        });
      });

      return results;
    });

    this.results.accessibility = accessibility;
  }

  async analyzeBrandConsistency() {
    console.log('🎨 Analyzing brand consistency...');
    
    const brandAnalysis = await this.page.evaluate(() => {
      const gallifreyColors = {
        'gallifrey-white': '#ffffff',
        'gallifrey-teal': '#14b8a6',
        'gallifrey-charcoal': '#1B365D'
      };

      const narrativeColors = {
        'oyn-stone': '#8B7355',
        'oyn-orange': '#D2691E'
      };

      const analysis = {
        colorsUsed: [],
        typography: {},
        brandElementsFound: {},
        designConsistency: {}
      };

      // Extract all unique colors used
      const allElements = document.querySelectorAll('*');
      const colorsFound = new Set();
      
      allElements.forEach(el => {
        const styles = window.getComputedStyle(el);
        if (styles.backgroundColor && styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          colorsFound.add(styles.backgroundColor);
        }
        if (styles.color) {
          colorsFound.add(styles.color);
        }
      });

      analysis.colorsUsed = Array.from(colorsFound);

      // Analyze typography usage
      const typographyElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div');
      const fontsUsed = new Set();
      
      typographyElements.forEach(el => {
        const styles = window.getComputedStyle(el);
        fontsUsed.add(styles.fontFamily);
      });

      analysis.typography.fontsUsed = Array.from(fontsUsed);

      // Check for brand-specific classes
      analysis.brandElementsFound.logoSerifClass = !!document.querySelector('.logo-serif');
      analysis.brandElementsFound.elegantCapsClass = !!document.querySelector('.elegant-caps');
      analysis.brandElementsFound.gallifreyElements = document.querySelectorAll('[class*="gallifrey"]').length;
      analysis.brandElementsFound.oynElements = document.querySelectorAll('[class*="oyn"]').length;

      return analysis;
    });

    this.results.brandConsistency = brandAnalysis;
  }

  async analyzeUserExperience() {
    console.log('👤 Analyzing user experience...');
    
    const uxAnalysis = await this.page.evaluate(() => {
      const analysis = {
        navigation: {},
        callToActions: [],
        contentFlow: {},
        interactivity: {}
      };

      // Analyze navigation
      const nav = document.querySelector('nav') || document.querySelector('header nav') || 
                  document.querySelector('[role="navigation"]');
      if (nav) {
        const navLinks = nav.querySelectorAll('a');
        analysis.navigation = {
          linkCount: navLinks.length,
          hasLogo: !!nav.querySelector('img, [class*="logo"]'),
          isSticky: window.getComputedStyle(nav).position === 'fixed' || 
                   window.getComputedStyle(nav).position === 'sticky',
          links: Array.from(navLinks).map(link => ({
            text: link.textContent?.trim() || '',
            href: link.href || ''
          }))
        };
      }

      // Find call-to-action elements
      const ctas = document.querySelectorAll('button, .btn, [class*="cta"], a[class*="button"]');
      analysis.callToActions = Array.from(ctas).map(cta => {
        const rect = cta.getBoundingClientRect();
        const styles = window.getComputedStyle(cta);
        return {
          text: cta.textContent?.trim() || '',
          type: cta.tagName.toLowerCase(),
          size: { width: rect.width, height: rect.height },
          position: { top: rect.top, left: rect.left },
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          isVisible: rect.width > 0 && rect.height > 0 && styles.opacity !== '0'
        };
      });

      // Analyze content sections
      const sections = document.querySelectorAll('section, main > div, .section');
      analysis.contentFlow = {
        sectionCount: sections.length,
        hasHero: !!document.querySelector('[class*="hero"], .hero, section:first-child'),
        hasFooter: !!document.querySelector('footer'),
        sectionsIdentified: Array.from(sections).map((section, index) => ({
          index: index,
          hasHeading: !!section.querySelector('h1, h2, h3'),
          wordCount: section.textContent?.split(/\s+/).length || 0,
          classes: section.className || ''
        }))
      };

      return analysis;
    });

    this.results.uxAnalysis = uxAnalysis;
  }

  async measurePerformance() {
    console.log('⚡ Measuring performance metrics...');
    
    const metrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
        domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    });

    this.results.performance = metrics;
  }

  calculateOverallScore() {
    console.log('📊 Calculating overall design score...');
    
    let totalScore = 0;
    let maxScore = 0;

    // Responsive design score (25 points)
    const responsiveScore = Object.keys(this.results.responsiveDesign).length * 5;
    totalScore += Math.min(responsiveScore, 25);
    maxScore += 25;

    // Accessibility score (25 points)
    const accessibilityScore = 25 - (
      this.results.accessibility.missingAltText?.length * 2 +
      Math.max(0, 6 - this.results.accessibility.focusableElements?.length) * 2
    );
    totalScore += Math.max(0, accessibilityScore);
    maxScore += 25;

    // Brand consistency score (25 points)
    const brandScore = 15 + 
      (this.results.brandConsistency.brandElementsFound?.logoSerifClass ? 5 : 0) +
      (this.results.brandConsistency.brandElementsFound?.elegantCapsClass ? 5 : 0);
    totalScore += brandScore;
    maxScore += 25;

    // UX score (25 points)
    const uxScore = 10 +
      (this.results.uxAnalysis.navigation?.linkCount > 0 ? 5 : 0) +
      (this.results.uxAnalysis.callToActions?.length > 0 ? 5 : 0) +
      (this.results.uxAnalysis.contentFlow?.hasHero ? 5 : 0);
    totalScore += uxScore;
    maxScore += 25;

    this.results.overallScore = Math.round((totalScore / maxScore) * 100);
  }

  generateRecommendations() {
    console.log('💡 Generating design recommendations...');
    
    const recommendations = [];

    // Accessibility recommendations
    if (this.results.accessibility.missingAltText?.length > 0) {
      recommendations.push({
        priority: 'High',
        category: 'Accessibility',
        issue: `${this.results.accessibility.missingAltText.length} images missing alt text`,
        solution: 'Add descriptive alt text to all images for screen reader accessibility'
      });
    }

    // Responsive design recommendations
    const hasHorizontalScroll = Object.values(this.results.responsiveDesign)
      .some(breakpoint => breakpoint.hasHorizontalScroll);
    if (hasHorizontalScroll) {
      recommendations.push({
        priority: 'Medium',
        category: 'Responsive Design',
        issue: 'Horizontal scroll detected on some breakpoints',
        solution: 'Review content width and ensure all elements fit within viewport'
      });
    }

    // UX recommendations
    if (this.results.uxAnalysis.callToActions?.length < 3) {
      recommendations.push({
        priority: 'Medium',
        category: 'User Experience',
        issue: 'Limited call-to-action elements found',
        solution: 'Add more prominent CTAs to guide user actions and improve conversions'
      });
    }

    // Brand consistency recommendations
    if (!this.results.brandConsistency.brandElementsFound?.logoSerifClass) {
      recommendations.push({
        priority: 'Low',
        category: 'Brand Consistency',
        issue: 'Brand-specific typography classes not detected',
        solution: 'Ensure .logo-serif and .elegant-caps classes are properly implemented'
      });
    }

    this.results.recommendations = recommendations;
  }

  async generateReport() {
    console.log('📋 Generating comprehensive design report...');
    
    this.calculateOverallScore();
    this.generateRecommendations();

    const report = {
      ...this.results,
      summary: {
        overallScore: this.results.overallScore,
        totalScreenshots: this.results.screenshots.length,
        totalRecommendations: this.results.recommendations.length,
        criticalIssues: this.results.recommendations.filter(r => r.priority === 'High').length
      }
    };

    // Save JSON report
    fs.writeFileSync(
      `${this.outputDir}/design-review-report.json`, 
      JSON.stringify(report, null, 2)
    );

    // Generate HTML report
    const htmlReport = this.generateHTMLReport(report);
    fs.writeFileSync(`${this.outputDir}/design-review-report.html`, htmlReport);

    console.log('\n🎉 Design review completed!');
    console.log(`📊 Overall Score: ${report.summary.overallScore}/100`);
    console.log(`📸 Screenshots captured: ${report.summary.totalScreenshots}`);
    console.log(`⚠️  Critical issues: ${report.summary.criticalIssues}`);
    console.log(`💡 Total recommendations: ${report.summary.totalRecommendations}`);
    console.log(`📁 Reports saved to: ${this.outputDir}`);

    return report;
  }

  generateHTMLReport(report) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gallifrey Consulting - UI/UX Design Review</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 40px; }
        .score { font-size: 3em; font-weight: bold; color: ${report.summary.overallScore >= 80 ? '#10b981' : report.summary.overallScore >= 60 ? '#f59e0b' : '#ef4444'}; }
        .section { margin: 30px 0; }
        .section h2 { color: #1B365D; border-bottom: 2px solid #14b8a6; padding-bottom: 10px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .card { background: #f8fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #14b8a6; }
        .priority-high { border-left-color: #ef4444; }
        .priority-medium { border-left-color: #f59e0b; }
        .priority-low { border-left-color: #10b981; }
        .screenshot { margin: 10px 0; }
        .screenshot img { max-width: 100%; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metric { display: inline-block; margin: 10px 15px 10px 0; padding: 8px 12px; background: #e0f2fe; border-radius: 4px; }
        pre { background: #f1f5f9; padding: 15px; border-radius: 4px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Gallifrey Consulting - UI/UX Design Review</h1>
            <div class="score">${report.summary.overallScore}/100</div>
            <p>Comprehensive automated design analysis - ${new Date(report.timestamp).toLocaleString()}</p>
        </div>

        <div class="section">
            <h2>Executive Summary</h2>
            <div class="grid">
                <div class="metric">Screenshots: ${report.summary.totalScreenshots}</div>
                <div class="metric">Recommendations: ${report.summary.totalRecommendations}</div>
                <div class="metric">Critical Issues: ${report.summary.criticalIssues}</div>
                <div class="metric">Breakpoints Tested: ${Object.keys(report.responsiveDesign || {}).length}</div>
            </div>
        </div>

        <div class="section">
            <h2>Recommendations</h2>
            <div class="grid">
                ${report.recommendations.map(rec => `
                    <div class="card priority-${rec.priority.toLowerCase()}">
                        <h3>${rec.category} - ${rec.priority} Priority</h3>
                        <p><strong>Issue:</strong> ${rec.issue}</p>
                        <p><strong>Solution:</strong> ${rec.solution}</p>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="section">
            <h2>Accessibility Analysis</h2>
            <div class="card">
                <p><strong>Missing Alt Text:</strong> ${report.accessibility.missingAltText?.length || 0} images</p>
                <p><strong>Focusable Elements:</strong> ${report.accessibility.focusableElements?.length || 0} found</p>
                <p><strong>Heading Structure:</strong> ${report.accessibility.headingStructure?.length || 0} headings</p>
                <p><strong>Form Labels:</strong> ${report.accessibility.formLabels?.length || 0} form elements</p>
            </div>
        </div>

        <div class="section">
            <h2>Brand Consistency</h2>
            <div class="card">
                <p><strong>Colors Used:</strong> ${report.brandConsistency.colorsUsed?.length || 0} unique colors</p>
                <p><strong>Fonts Used:</strong> ${report.brandConsistency.typography?.fontsUsed?.length || 0} font families</p>
                <p><strong>Gallifrey Elements:</strong> ${report.brandConsistency.brandElementsFound?.gallifreyElements || 0}</p>
                <p><strong>OYN Elements:</strong> ${report.brandConsistency.brandElementsFound?.oynElements || 0}</p>
                <p><strong>Logo Serif Class:</strong> ${report.brandConsistency.brandElementsFound?.logoSerifClass ? 'Found' : 'Not found'}</p>
            </div>
        </div>

        <div class="section">
            <h2>User Experience Analysis</h2>
            <div class="card">
                <p><strong>Navigation Links:</strong> ${report.uxAnalysis.navigation?.linkCount || 0}</p>
                <p><strong>Call-to-Action Elements:</strong> ${report.uxAnalysis.callToActions?.length || 0}</p>
                <p><strong>Content Sections:</strong> ${report.uxAnalysis.contentFlow?.sectionCount || 0}</p>
                <p><strong>Has Hero Section:</strong> ${report.uxAnalysis.contentFlow?.hasHero ? 'Yes' : 'No'}</p>
                <p><strong>Has Footer:</strong> ${report.uxAnalysis.contentFlow?.hasFooter ? 'Yes' : 'No'}</p>
            </div>
        </div>

        <div class="section">
            <h2>Screenshots</h2>
            ${report.screenshots.map(screenshot => `
                <div class="screenshot">
                    <h3>${screenshot.replace('.png', '').replace(/-/g, ' ').toUpperCase()}</h3>
                    <img src="${screenshot}" alt="${screenshot}" loading="lazy">
                </div>
            `).join('')}
        </div>

        <div class="section">
            <h2>Raw Data</h2>
            <pre>${JSON.stringify(report, null, 2)}</pre>
        </div>
    </div>
</body>
</html>`;
  }

  async runFullReview() {
    try {
      await this.initialize();
      await this.navigateToSite();
      await this.captureScreenshots();
      await this.testResponsiveDesign();
      await this.analyzeAccessibility();
      await this.analyzeBrandConsistency();
      await this.analyzeUserExperience();
      await this.measurePerformance();
      
      const report = await this.generateReport();
      return report;
    } catch (error) {
      console.error('❌ Design review failed:', error);
      throw error;
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Run the design review
(async () => {
  const review = new GallifreyDesignReview();
  try {
    const report = await review.runFullReview();
    process.exit(0);
  } catch (error) {
    console.error('Failed to complete design review:', error);
    process.exit(1);
  }
})();