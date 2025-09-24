const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class EnhancedGallifreyDesignReview {
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
      recommendations: [],
      pageLoad: {}
    };
    this.outputDir = './enhanced-design-review-output';
  }

  async initialize() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    this.browser = await chromium.launch({ 
      headless: false,
      slowMo: 1000 // Slow down for better content loading
    });
    this.page = await this.browser.newPage();
    
    // Set viewport for desktop testing
    await this.page.setViewportSize({ width: 1440, height: 900 });
    
    // Set longer timeout for page loads
    this.page.setDefaultTimeout(30000);
  }

  async navigateToSite() {
    console.log('🚀 Navigating to Gallifrey Consulting site...');
    
    try {
      await this.page.goto('http://localhost:3000', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      // Wait for content to load
      await this.page.waitForTimeout(5000);
      
      // Check if we're on an error page
      const hasError = await this.page.locator('text=Runtime TypeError').count() > 0;
      if (hasError) {
        console.log('⚠️ Error detected on page, taking error screenshot');
        await this.page.screenshot({ 
          path: `${this.outputDir}/error-page.png`, 
          fullPage: true 
        });
        this.results.pageLoad.hasError = true;
        this.results.pageLoad.errorType = 'Runtime TypeError';
      } else {
        this.results.pageLoad.hasError = false;
        console.log('✅ Page loaded successfully');
      }
      
      // Wait for any animations or dynamic content
      await this.page.waitForFunction(() => {
        return document.readyState === 'complete';
      });
      
    } catch (error) {
      console.error('❌ Failed to navigate to site:', error.message);
      this.results.pageLoad.error = error.message;
      throw error;
    }
  }

  async captureScreenshots() {
    console.log('📸 Capturing comprehensive screenshots...');
    
    try {
      // Full page screenshot
      await this.page.screenshot({ 
        path: `${this.outputDir}/desktop-full-page.png`, 
        fullPage: true 
      });
      this.results.screenshots.push('desktop-full-page.png');

      // Above the fold screenshot
      await this.page.screenshot({ 
        path: `${this.outputDir}/above-the-fold.png` 
      });
      this.results.screenshots.push('above-the-fold.png');

      // Try to capture specific sections if they exist
      const sections = [
        { selector: 'header', name: 'header' },
        { selector: 'main', name: 'main-content' },
        { selector: 'nav', name: 'navigation' },
        { selector: 'section:first-of-type', name: 'hero-section' },
        { selector: 'footer', name: 'footer' }
      ];

      for (const section of sections) {
        try {
          const element = await this.page.locator(section.selector).first();
          if (await element.count() > 0) {
            await element.screenshot({ 
              path: `${this.outputDir}/${section.name}.png` 
            });
            this.results.screenshots.push(`${section.name}.png`);
            console.log(`   ✓ Captured ${section.name}`);
          }
        } catch (error) {
          console.log(`   ⚠️ Could not capture ${section.name}: ${error.message}`);
        }
      }
    } catch (error) {
      console.error('❌ Screenshot capture failed:', error.message);
    }
  }

  async testResponsiveDesign() {
    console.log('📱 Testing responsive design comprehensively...');
    
    const breakpoints = [
      { name: 'mobile-portrait', width: 375, height: 667 },
      { name: 'mobile-landscape', width: 667, height: 375 },
      { name: 'tablet-portrait', width: 768, height: 1024 },
      { name: 'tablet-landscape', width: 1024, height: 768 },
      { name: 'desktop', width: 1280, height: 720 },
      { name: 'large-desktop', width: 1920, height: 1080 }
    ];

    for (const breakpoint of breakpoints) {
      console.log(`   Testing ${breakpoint.name} (${breakpoint.width}x${breakpoint.height})`);
      
      try {
        await this.page.setViewportSize({ 
          width: breakpoint.width, 
          height: breakpoint.height 
        });
        
        // Allow layout to adjust
        await this.page.waitForTimeout(2000);
        
        // Take screenshot
        await this.page.screenshot({ 
          path: `${this.outputDir}/${breakpoint.name}-view.png`,
          fullPage: true
        });
        this.results.screenshots.push(`${breakpoint.name}-view.png`);

        // Analyze layout at this breakpoint
        const layoutAnalysis = await this.analyzeLayoutDetailed(breakpoint.name);
        this.results.responsiveDesign[breakpoint.name] = layoutAnalysis;
        
        console.log(`   ✓ ${breakpoint.name}: ${layoutAnalysis.score}/100`);
        
      } catch (error) {
        console.error(`   ❌ Failed to test ${breakpoint.name}:`, error.message);
      }
    }
  }

  async analyzeLayoutDetailed(breakpointName) {
    return await this.page.evaluate((breakpoint) => {
      const analysis = {
        breakpoint: breakpoint,
        score: 0,
        issues: [],
        positives: [],
        measurements: {},
        elements: {},
        typography: {},
        colors: {},
        spacing: {}
      };

      try {
        // Check for horizontal scroll
        const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;
        analysis.measurements.hasHorizontalScroll = hasHorizontalScroll;
        if (!hasHorizontalScroll) {
          analysis.score += 20;
          analysis.positives.push('No horizontal scrollbar');
        } else {
          analysis.issues.push('Horizontal scrollbar detected');
        }

        // Check viewport meta tag
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        analysis.measurements.hasViewportMeta = !!viewportMeta;
        if (viewportMeta) {
          analysis.score += 10;
          analysis.positives.push('Viewport meta tag present');
          analysis.measurements.viewportContent = viewportMeta.content;
        } else {
          analysis.issues.push('Missing viewport meta tag');
        }

        // Analyze touch targets for mobile
        if (breakpoint.includes('mobile')) {
          const touchTargets = document.querySelectorAll('button, a, input, [onclick]');
          let adequateTargets = 0;
          touchTargets.forEach(target => {
            const rect = target.getBoundingClientRect();
            if (rect.width >= 44 && rect.height >= 44) {
              adequateTargets++;
            }
          });
          
          analysis.measurements.touchTargets = {
            total: touchTargets.length,
            adequate: adequateTargets,
            percentage: touchTargets.length > 0 ? (adequateTargets / touchTargets.length) * 100 : 0
          };
          
          if (analysis.measurements.touchTargets.percentage > 80) {
            analysis.score += 15;
            analysis.positives.push('Good touch target sizing');
          } else {
            analysis.issues.push('Small touch targets detected');
          }
        }

        // Analyze typography
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading, index) => {
          const styles = window.getComputedStyle(heading);
          const key = heading.tagName.toLowerCase() + '_' + index;
          analysis.typography[key] = {
            fontSize: styles.fontSize,
            fontFamily: styles.fontFamily,
            fontWeight: styles.fontWeight,
            lineHeight: styles.lineHeight,
            color: styles.color,
            isVisible: heading.offsetParent !== null
          };
        });

        // Check readability
        const textElements = document.querySelectorAll('p, span, div, li');
        let readableCount = 0;
        textElements.forEach(element => {
          const styles = window.getComputedStyle(element);
          const fontSize = parseFloat(styles.fontSize);
          if (fontSize >= 16 || (breakpoint.includes('desktop') && fontSize >= 14)) {
            readableCount++;
          }
        });
        
        analysis.measurements.readability = {
          total: textElements.length,
          readable: readableCount,
          percentage: textElements.length > 0 ? (readableCount / textElements.length) * 100 : 0
        };

        if (analysis.measurements.readability.percentage > 80) {
          analysis.score += 10;
          analysis.positives.push('Good text readability');
        } else {
          analysis.issues.push('Small text detected');
        }

        // Analyze layout structure
        const sections = document.querySelectorAll('section, main, header, footer, nav');
        analysis.elements.sections = sections.length;
        if (sections.length > 3) {
          analysis.score += 5;
          analysis.positives.push('Good content structure');
        }

        // Check for responsive images
        const images = document.querySelectorAll('img');
        let responsiveImages = 0;
        images.forEach(img => {
          if (img.hasAttribute('srcset') || img.style.maxWidth === '100%') {
            responsiveImages++;
          }
        });
        
        analysis.measurements.images = {
          total: images.length,
          responsive: responsiveImages,
          percentage: images.length > 0 ? (responsiveImages / images.length) * 100 : 0
        };

        if (analysis.measurements.images.percentage > 50) {
          analysis.score += 10;
          analysis.positives.push('Responsive images detected');
        }

        // Color contrast basic check
        const coloredElements = document.querySelectorAll('*');
        const colors = new Set();
        coloredElements.forEach(el => {
          const styles = window.getComputedStyle(el);
          if (styles.color && styles.backgroundColor) {
            colors.add(`${styles.color}|${styles.backgroundColor}`);
          }
        });
        
        analysis.colors.uniqueCombinations = colors.size;
        if (colors.size < 20) {
          analysis.score += 5;
          analysis.positives.push('Consistent color usage');
        }

        // Performance indicators
        analysis.measurements.performance = {
          domElements: document.querySelectorAll('*').length,
          scripts: document.querySelectorAll('script').length,
          stylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
          images: document.querySelectorAll('img').length
        };

        // Ensure score doesn't exceed 100
        analysis.score = Math.min(analysis.score, 100);

      } catch (error) {
        analysis.error = error.message;
        analysis.score = 0;
      }

      return analysis;
    }, breakpointName);
  }

  async analyzeAccessibilityComprehensive() {
    console.log('♿ Analyzing accessibility comprehensively...');
    
    const accessibility = await this.page.evaluate(() => {
      const results = {
        score: 0,
        issues: [],
        positives: [],
        headingStructure: [],
        images: [],
        forms: [],
        links: [],
        focusable: [],
        landmarks: [],
        colorContrast: []
      };

      try {
        // Analyze heading structure
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let previousLevel = 0;
        headings.forEach((heading, index) => {
          const level = parseInt(heading.tagName.charAt(1));
          const info = {
            level: level,
            text: heading.textContent?.trim() || '',
            id: heading.id || null,
            hasProperNesting: level <= previousLevel + 1
          };
          
          results.headingStructure.push(info);
          
          if (!info.hasProperNesting && index > 0) {
            results.issues.push(`Heading level skip detected: H${previousLevel} to H${level}`);
          }
          
          previousLevel = level;
        });

        if (results.headingStructure.length > 0) {
          results.score += 10;
          results.positives.push(`${results.headingStructure.length} headings provide structure`);
        }

        // Check images for alt text
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
          const info = {
            src: img.src,
            alt: img.alt || '',
            hasAlt: !!img.alt,
            isEmpty: img.alt === '',
            isDecorative: img.alt === '' && img.hasAttribute('alt')
          };
          
          results.images.push(info);
          
          if (!info.hasAlt && !info.isDecorative) {
            results.issues.push(`Image missing alt text: ${img.src.substring(0, 50)}...`);
          }
        });

        const imagesWithAlt = results.images.filter(img => img.hasAlt || img.isDecorative).length;
        if (images.length > 0) {
          const altPercentage = (imagesWithAlt / images.length) * 100;
          if (altPercentage > 90) {
            results.score += 15;
            results.positives.push('Excellent image accessibility');
          } else if (altPercentage > 70) {
            results.score += 10;
            results.positives.push('Good image accessibility');
          }
        }

        // Analyze links
        const links = document.querySelectorAll('a');
        links.forEach(link => {
          const info = {
            href: link.href || '',
            text: link.textContent?.trim() || '',
            hasText: !!link.textContent?.trim(),
            hasAriaLabel: !!link.getAttribute('aria-label'),
            hasTitle: !!link.title,
            isExternal: link.href && !link.href.includes(window.location.hostname)
          };
          
          results.links.push(info);
          
          if (!info.hasText && !info.hasAriaLabel && !info.hasTitle) {
            results.issues.push('Link without accessible text found');
          }
        });

        if (results.links.length > 0) {
          const accessibleLinks = results.links.filter(link => 
            link.hasText || link.hasAriaLabel || link.hasTitle
          ).length;
          const linkPercentage = (accessibleLinks / results.links.length) * 100;
          
          if (linkPercentage > 95) {
            results.score += 10;
            results.positives.push('Excellent link accessibility');
          }
        }

        // Check form elements
        const formElements = document.querySelectorAll('input, textarea, select');
        formElements.forEach(element => {
          const label = document.querySelector(`label[for="${element.id}"]`) || 
                       element.closest('label');
          
          const info = {
            type: element.type || element.tagName.toLowerCase(),
            hasLabel: !!label,
            hasAriaLabel: !!element.getAttribute('aria-label'),
            hasPlaceholder: !!element.placeholder,
            hasAriaDescribedBy: !!element.getAttribute('aria-describedby')
          };
          
          results.forms.push(info);
          
          if (!info.hasLabel && !info.hasAriaLabel) {
            results.issues.push(`Form element without label: ${info.type}`);
          }
        });

        if (results.forms.length > 0) {
          const labeledForms = results.forms.filter(form => 
            form.hasLabel || form.hasAriaLabel
          ).length;
          const formPercentage = (labeledForms / results.forms.length) * 100;
          
          if (formPercentage > 90) {
            results.score += 15;
            results.positives.push('Excellent form accessibility');
          }
        }

        // Check for landmarks
        const landmarks = document.querySelectorAll('main, nav, header, footer, aside, section[aria-label], section[aria-labelledby]');
        results.landmarks = Array.from(landmarks).map(landmark => ({
          tagName: landmark.tagName.toLowerCase(),
          role: landmark.getAttribute('role'),
          ariaLabel: landmark.getAttribute('aria-label'),
          ariaLabelledBy: landmark.getAttribute('aria-labelledby')
        }));

        if (results.landmarks.length >= 3) {
          results.score += 10;
          results.positives.push('Good landmark structure');
        }

        // Check focusable elements
        const focusableElements = document.querySelectorAll(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        results.focusable = Array.from(focusableElements).map(el => ({
          tagName: el.tagName.toLowerCase(),
          type: el.type || null,
          tabIndex: el.tabIndex,
          hasVisibleFocus: true // Would need actual focus testing
        }));

        if (results.focusable.length > 0) {
          results.score += 5;
          results.positives.push('Focusable elements present');
        }

        // Basic color contrast check
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, li');
        textElements.forEach(el => {
          const styles = window.getComputedStyle(el);
          results.colorContrast.push({
            color: styles.color,
            backgroundColor: styles.backgroundColor,
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight
          });
        });

        results.score = Math.min(results.score, 100);

      } catch (error) {
        results.error = error.message;
      }

      return results;
    });

    this.results.accessibility = accessibility;
    console.log(`   ✓ Accessibility score: ${accessibility.score}/100`);
  }

  async analyzeBrandConsistencyDetailed() {
    console.log('🎨 Analyzing brand consistency in detail...');
    
    const brandAnalysis = await this.page.evaluate(() => {
      const analysis = {
        score: 0,
        colors: {},
        typography: {},
        layout: {},
        branding: {},
        issues: [],
        positives: []
      };

      try {
        // Expected brand colors
        const gallifreyColors = {
          white: '#ffffff',
          teal: '#14b8a6',
          charcoal: '#1B365D'
        };

        const narrativeColors = {
          stone: '#8B7355',
          orange: '#D2691E'
        };

        // Extract all colors used
        const allElements = document.querySelectorAll('*');
        const colorsFound = new Set();
        const backgroundColors = new Set();
        
        allElements.forEach(el => {
          const styles = window.getComputedStyle(el);
          if (styles.color && styles.color !== 'rgba(0, 0, 0, 0)') {
            colorsFound.add(styles.color);
          }
          if (styles.backgroundColor && styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            backgroundColors.add(styles.backgroundColor);
          }
        });

        analysis.colors = {
          textColors: Array.from(colorsFound),
          backgroundColors: Array.from(backgroundColors),
          totalUniqueColors: colorsFound.size + backgroundColors.size
        };

        // Analyze typography consistency
        const typographyElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, a, button');
        const fontsUsed = new Set();
        const fontSizes = new Set();
        const fontWeights = new Set();
        
        typographyElements.forEach(el => {
          const styles = window.getComputedStyle(el);
          fontsUsed.add(styles.fontFamily);
          fontSizes.add(styles.fontSize);
          fontWeights.add(styles.fontWeight);
        });

        analysis.typography = {
          fontFamilies: Array.from(fontsUsed),
          fontSizes: Array.from(fontSizes),
          fontWeights: Array.from(fontWeights),
          hasMontserrat: Array.from(fontsUsed).some(font => font.includes('Montserrat')),
          hasSourceSans: Array.from(fontsUsed).some(font => font.includes('Source Sans')),
          hasPlayfair: Array.from(fontsUsed).some(font => font.includes('Playfair'))
        };

        // Check for brand-specific elements
        analysis.branding = {
          logoSerifClass: !!document.querySelector('.logo-serif'),
          elegantCapsClass: !!document.querySelector('.elegant-caps'),
          gallifreyClasses: document.querySelectorAll('[class*="gallifrey"]').length,
          oynClasses: document.querySelectorAll('[class*="oyn"]').length,
          hasLogo: !!document.querySelector('img[alt*="logo"], .logo, [class*="logo"]'),
          hasNavigation: !!document.querySelector('nav, [role="navigation"]')
        };

        // Score brand consistency
        if (analysis.typography.hasMontserrat) {
          analysis.score += 15;
          analysis.positives.push('Montserrat font family detected');
        }
        
        if (analysis.typography.hasSourceSans) {
          analysis.score += 15;
          analysis.positives.push('Source Sans Pro font family detected');
        }

        if (analysis.branding.hasLogo) {
          analysis.score += 10;
          analysis.positives.push('Logo element present');
        }

        if (analysis.branding.hasNavigation) {
          analysis.score += 10;
          analysis.positives.push('Navigation structure present');
        }

        if (analysis.colors.totalUniqueColors < 15) {
          analysis.score += 10;
          analysis.positives.push('Consistent color palette');
        } else {
          analysis.issues.push('Too many colors may indicate inconsistency');
        }

        if (analysis.typography.fontFamilies.length <= 3) {
          analysis.score += 10;
          analysis.positives.push('Consistent typography system');
        } else {
          analysis.issues.push('Multiple font families may indicate inconsistency');
        }

        // Layout consistency
        const containers = document.querySelectorAll('.container, [class*="container"], .max-w, [class*="max-w"]');
        analysis.layout.hasConsistentContainers = containers.length > 0;
        
        if (analysis.layout.hasConsistentContainers) {
          analysis.score += 10;
          analysis.positives.push('Consistent layout containers');
        }

        analysis.score = Math.min(analysis.score, 100);

      } catch (error) {
        analysis.error = error.message;
      }

      return analysis;
    });

    this.results.brandConsistency = brandAnalysis;
    console.log(`   ✓ Brand consistency score: ${brandAnalysis.score}/100`);
  }

  async analyzeUserExperienceDetailed() {
    console.log('👤 Analyzing user experience comprehensively...');
    
    const uxAnalysis = await this.page.evaluate(() => {
      const analysis = {
        score: 0,
        navigation: {},
        content: {},
        interactions: {},
        performance: {},
        issues: [],
        positives: []
      };

      try {
        // Navigation analysis
        const nav = document.querySelector('nav, [role="navigation"], header nav');
        if (nav) {
          const navLinks = nav.querySelectorAll('a');
          analysis.navigation = {
            exists: true,
            linkCount: navLinks.length,
            hasLogo: !!nav.querySelector('img, .logo, [class*="logo"]'),
            isSticky: ['fixed', 'sticky'].includes(window.getComputedStyle(nav).position),
            links: Array.from(navLinks).map(link => ({
              text: link.textContent?.trim() || '',
              href: link.href || '',
              isExternal: link.href && !link.href.includes(window.location.hostname)
            }))
          };

          if (analysis.navigation.linkCount >= 3) {
            analysis.score += 15;
            analysis.positives.push('Good navigation structure');
          }

          if (analysis.navigation.hasLogo) {
            analysis.score += 10;
            analysis.positives.push('Logo in navigation');
          }
        } else {
          analysis.issues.push('No navigation found');
        }

        // Content structure analysis
        const sections = document.querySelectorAll('section, main > div, .section');
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        analysis.content = {
          sectionCount: sections.length,
          headingCount: headings.length,
          hasHero: !!document.querySelector('[class*="hero"], .hero, section:first-child'),
          hasFooter: !!document.querySelector('footer'),
          wordCount: document.body.textContent?.split(/\s+/).length || 0,
          sections: Array.from(sections).map((section, index) => ({
            index: index,
            hasHeading: !!section.querySelector('h1, h2, h3, h4, h5, h6'),
            wordCount: section.textContent?.split(/\s+/).length || 0,
            classes: section.className || ''
          }))
        };

        if (analysis.content.hasHero) {
          analysis.score += 15;
          analysis.positives.push('Hero section present');
        }

        if (analysis.content.sectionCount >= 4) {
          analysis.score += 10;
          analysis.positives.push('Good content structure');
        }

        if (analysis.content.hasFooter) {
          analysis.score += 5;
          analysis.positives.push('Footer present');
        }

        // Interactive elements analysis
        const buttons = document.querySelectorAll('button, .btn, [class*="button"]');
        const links = document.querySelectorAll('a[href]');
        const forms = document.querySelectorAll('form, input, textarea');

        analysis.interactions = {
          buttonCount: buttons.length,
          linkCount: links.length,
          formCount: forms.length,
          ctas: Array.from(buttons).map(btn => {
            const rect = btn.getBoundingClientRect();
            const styles = window.getComputedStyle(btn);
            return {
              text: btn.textContent?.trim() || '',
              isVisible: rect.width > 0 && rect.height > 0 && styles.opacity !== '0',
              size: { width: rect.width, height: rect.height },
              backgroundColor: styles.backgroundColor,
              color: styles.color
            };
          })
        };

        if (analysis.interactions.buttonCount >= 2) {
          analysis.score += 10;
          analysis.positives.push('Multiple call-to-action elements');
        }

        // Performance indicators
        const images = document.querySelectorAll('img');
        const scripts = document.querySelectorAll('script');
        
        analysis.performance = {
          imageCount: images.length,
          scriptCount: scripts.length,
          domElementCount: document.querySelectorAll('*').length,
          hasLazyLoading: Array.from(images).some(img => img.loading === 'lazy'),
          largeImages: Array.from(images).filter(img => {
            const rect = img.getBoundingClientRect();
            return rect.width > 500 || rect.height > 500;
          }).length
        };

        if (analysis.performance.hasLazyLoading) {
          analysis.score += 5;
          analysis.positives.push('Lazy loading implemented');
        }

        if (analysis.performance.domElementCount < 500) {
          analysis.score += 5;
          analysis.positives.push('Lean DOM structure');
        }

        // Conversion optimization
        const contactForms = document.querySelectorAll('form[action*="contact"], form[action*="submit"], #contact form');
        const phoneNumbers = document.querySelectorAll('a[href^="tel:"]');
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        
        analysis.conversion = {
          hasContactForm: contactForms.length > 0,
          hasPhoneNumber: phoneNumbers.length > 0,
          hasEmail: emailLinks.length > 0,
          contactMethods: contactForms.length + phoneNumbers.length + emailLinks.length
        };

        if (analysis.conversion.contactMethods >= 2) {
          analysis.score += 10;
          analysis.positives.push('Multiple contact methods available');
        }

        analysis.score = Math.min(analysis.score, 100);

      } catch (error) {
        analysis.error = error.message;
      }

      return analysis;
    });

    this.results.uxAnalysis = uxAnalysis;
    console.log(`   ✓ User experience score: ${uxAnalysis.score}/100`);
  }

  calculateOverallScore() {
    console.log('📊 Calculating comprehensive design score...');
    
    const scores = {
      responsive: 0,
      accessibility: 0,
      brand: 0,
      ux: 0
    };

    // Calculate responsive design score (25%)
    const responsiveScores = Object.values(this.results.responsiveDesign).map(r => r.score || 0);
    scores.responsive = responsiveScores.length > 0 ? 
      responsiveScores.reduce((a, b) => a + b, 0) / responsiveScores.length : 0;

    // Accessibility score (25%)
    scores.accessibility = this.results.accessibility.score || 0;

    // Brand consistency score (25%)
    scores.brand = this.results.brandConsistency.score || 0;

    // User experience score (25%)
    scores.ux = this.results.uxAnalysis.score || 0;

    // Calculate weighted average
    this.results.overallScore = Math.round(
      (scores.responsive * 0.25) +
      (scores.accessibility * 0.25) +
      (scores.brand * 0.25) +
      (scores.ux * 0.25)
    );

    this.results.scoreBreakdown = scores;
    
    console.log(`   Responsive: ${scores.responsive.toFixed(1)}/100`);
    console.log(`   Accessibility: ${scores.accessibility}/100`);
    console.log(`   Brand: ${scores.brand}/100`);
    console.log(`   UX: ${scores.ux}/100`);
    console.log(`   Overall: ${this.results.overallScore}/100`);
  }

  generateComprehensiveRecommendations() {
    console.log('💡 Generating comprehensive recommendations...');
    
    const recommendations = [];

    // Accessibility recommendations
    if (this.results.accessibility.issues) {
      this.results.accessibility.issues.forEach(issue => {
        recommendations.push({
          priority: 'High',
          category: 'Accessibility',
          issue: issue,
          solution: this.getAccessibilitySolution(issue)
        });
      });
    }

    // Responsive design recommendations
    Object.entries(this.results.responsiveDesign).forEach(([breakpoint, data]) => {
      if (data.issues) {
        data.issues.forEach(issue => {
          recommendations.push({
            priority: 'Medium',
            category: 'Responsive Design',
            issue: `${breakpoint}: ${issue}`,
            solution: this.getResponsiveSolution(issue)
          });
        });
      }
    });

    // Brand consistency recommendations
    if (this.results.brandConsistency.issues) {
      this.results.brandConsistency.issues.forEach(issue => {
        recommendations.push({
          priority: 'Medium',
          category: 'Brand Consistency',
          issue: issue,
          solution: this.getBrandSolution(issue)
        });
      });
    }

    // UX recommendations
    if (this.results.uxAnalysis.issues) {
      this.results.uxAnalysis.issues.forEach(issue => {
        recommendations.push({
          priority: 'Medium',
          category: 'User Experience',
          issue: issue,
          solution: this.getUXSolution(issue)
        });
      });
    }

    // Performance recommendations
    if (this.results.uxAnalysis.performance?.domElementCount > 1000) {
      recommendations.push({
        priority: 'Low',
        category: 'Performance',
        issue: 'Large number of DOM elements detected',
        solution: 'Consider optimizing component structure and reducing DOM complexity'
      });
    }

    this.results.recommendations = recommendations;
  }

  getAccessibilitySolution(issue) {
    if (issue.includes('alt text')) return 'Add descriptive alt text to images for screen reader users';
    if (issue.includes('heading')) return 'Ensure proper heading hierarchy (h1→h2→h3) for navigation';
    if (issue.includes('label')) return 'Associate form inputs with descriptive labels';
    if (issue.includes('contrast')) return 'Increase color contrast to meet WCAG AA standards';
    return 'Review accessibility guidelines and implement fixes';
  }

  getResponsiveSolution(issue) {
    if (issue.includes('scroll')) return 'Adjust layout width and padding to fit viewport';
    if (issue.includes('touch')) return 'Increase touch target size to minimum 44x44 pixels';
    if (issue.includes('text')) return 'Use responsive typography with appropriate minimum sizes';
    return 'Review responsive design patterns and adjust layout';
  }

  getBrandSolution(issue) {
    if (issue.includes('color')) return 'Consolidate color palette and establish design system';
    if (issue.includes('font')) return 'Limit font families and establish typography hierarchy';
    if (issue.includes('logo')) return 'Ensure consistent logo placement and sizing';
    return 'Develop comprehensive brand guidelines and design system';
  }

  getUXSolution(issue) {
    if (issue.includes('navigation')) return 'Add clear navigation structure with logical hierarchy';
    if (issue.includes('contact')) return 'Provide multiple contact methods and clear contact forms';
    if (issue.includes('CTA')) return 'Add prominent call-to-action buttons throughout the page';
    return 'Review user journey and optimize conversion paths';
  }

  async generateComprehensiveReport() {
    console.log('📋 Generating comprehensive design report...');
    
    this.calculateOverallScore();
    this.generateComprehensiveRecommendations();

    const report = {
      ...this.results,
      summary: {
        overallScore: this.results.overallScore,
        scoreBreakdown: this.results.scoreBreakdown,
        totalScreenshots: this.results.screenshots.length,
        totalRecommendations: this.results.recommendations.length,
        criticalIssues: this.results.recommendations.filter(r => r.priority === 'High').length,
        hasPageLoadError: this.results.pageLoad.hasError
      }
    };

    // Save JSON report
    fs.writeFileSync(
      `${this.outputDir}/comprehensive-design-report.json`, 
      JSON.stringify(report, null, 2)
    );

    // Generate enhanced HTML report
    const htmlReport = this.generateEnhancedHTMLReport(report);
    fs.writeFileSync(`${this.outputDir}/comprehensive-design-report.html`, htmlReport);

    console.log('\n🎉 Comprehensive design review completed!');
    console.log(`📊 Overall Score: ${report.summary.overallScore}/100`);
    console.log(`📸 Screenshots captured: ${report.summary.totalScreenshots}`);
    console.log(`⚠️  Critical issues: ${report.summary.criticalIssues}`);
    console.log(`💡 Total recommendations: ${report.summary.totalRecommendations}`);
    console.log(`📁 Reports saved to: ${this.outputDir}`);
    
    if (report.summary.hasPageLoadError) {
      console.log(`🚨 Page load error detected: ${this.results.pageLoad.errorType}`);
    }

    return report;
  }

  generateEnhancedHTMLReport(report) {
    const getScoreColor = (score) => {
      if (score >= 80) return '#10b981';
      if (score >= 60) return '#f59e0b';
      return '#ef4444';
    };

    const formatScore = (score) => typeof score === 'number' ? score.toFixed(1) : '0.0';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gallifrey Consulting - Comprehensive UI/UX Design Review</title>
    <style>
        * { box-sizing: border-box; }
        body { font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f8fafc; line-height: 1.6; }
        .container { max-width: 1400px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #1B365D 0%, #14b8a6 100%); color: white; padding: 40px; text-align: center; }
        .score { font-size: 4em; font-weight: 900; margin: 20px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        .score-breakdown { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .score-item { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; text-align: center; }
        .score-item h3 { margin: 0 0 10px 0; font-size: 1.2em; }
        .score-item .score-value { font-size: 2em; font-weight: bold; }
        .content { padding: 40px; }
        .section { margin: 40px 0; }
        .section h2 { color: #1B365D; border-bottom: 3px solid #14b8a6; padding-bottom: 15px; margin-bottom: 30px; font-size: 1.8em; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 25px; }
        .card { background: #f8fafc; padding: 25px; border-radius: 10px; border-left: 5px solid #14b8a6; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .priority-high { border-left-color: #ef4444; background: #fef2f2; }
        .priority-medium { border-left-color: #f59e0b; background: #fffbeb; }
        .priority-low { border-left-color: #10b981; background: #f0fdf4; }
        .screenshot-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
        .screenshot { text-align: center; }
        .screenshot img { max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.3s ease; }
        .screenshot img:hover { transform: scale(1.05); }
        .screenshot h3 { margin: 15px 0 5px 0; color: #1B365D; }
        .metric { display: inline-block; margin: 8px 12px 8px 0; padding: 10px 15px; background: #e0f2fe; border-radius: 6px; font-weight: 500; }
        .positive { color: #10b981; font-weight: 600; }
        .negative { color: #ef4444; font-weight: 600; }
        .breakpoint-analysis { margin: 20px 0; }
        .breakpoint-card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 15px 0; }
        .breakpoint-title { font-weight: bold; color: #1B365D; margin-bottom: 15px; }
        .issue-list, .positive-list { margin: 10px 0; }
        .issue-list li { color: #ef4444; margin: 5px 0; }
        .positive-list li { color: #10b981; margin: 5px 0; }
        pre { background: #f1f5f9; padding: 20px; border-radius: 8px; overflow-x: auto; font-size: 0.9em; }
        .status-indicator { display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 8px; }
        .status-success { background: #10b981; }
        .status-warning { background: #f59e0b; }
        .status-error { background: #ef4444; }
        .summary-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
        .stat-card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; text-align: center; }
        .stat-number { font-size: 2em; font-weight: bold; color: #1B365D; }
        .stat-label { color: #6b7280; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Gallifrey Consulting</h1>
            <h2>Comprehensive UI/UX Design Review</h2>
            <div class="score" style="color: ${getScoreColor(report.summary.overallScore)}">${report.summary.overallScore}/100</div>
            <p>Automated design analysis completed on ${new Date(report.timestamp).toLocaleString()}</p>
            ${report.summary.hasPageLoadError ? '<div style="background: rgba(239, 68, 68, 0.2); padding: 15px; border-radius: 8px; margin: 20px 0;"><strong>⚠️ Page Load Error Detected:</strong> ' + (report.pageLoad.errorType || 'Unknown error') + '</div>' : ''}
            
            <div class="score-breakdown">
                <div class="score-item">
                    <h3>Responsive Design</h3>
                    <div class="score-value" style="color: ${getScoreColor(report.scoreBreakdown?.responsive || 0)}">${formatScore(report.scoreBreakdown?.responsive || 0)}</div>
                </div>
                <div class="score-item">
                    <h3>Accessibility</h3>
                    <div class="score-value" style="color: ${getScoreColor(report.scoreBreakdown?.accessibility || 0)}">${formatScore(report.scoreBreakdown?.accessibility || 0)}</div>
                </div>
                <div class="score-item">
                    <h3>Brand Consistency</h3>
                    <div class="score-value" style="color: ${getScoreColor(report.scoreBreakdown?.brand || 0)}">${formatScore(report.scoreBreakdown?.brand || 0)}</div>
                </div>
                <div class="score-item">
                    <h3>User Experience</h3>
                    <div class="score-value" style="color: ${getScoreColor(report.scoreBreakdown?.ux || 0)}">${formatScore(report.scoreBreakdown?.ux || 0)}</div>
                </div>
            </div>
        </div>

        <div class="content">
            <div class="section">
                <h2>Executive Summary</h2>
                <div class="summary-stats">
                    <div class="stat-card">
                        <div class="stat-number">${report.summary.totalScreenshots}</div>
                        <div class="stat-label">Screenshots</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${report.summary.totalRecommendations}</div>
                        <div class="stat-label">Recommendations</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${report.summary.criticalIssues}</div>
                        <div class="stat-label">Critical Issues</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${Object.keys(report.responsiveDesign || {}).length}</div>
                        <div class="stat-label">Breakpoints Tested</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>Priority Recommendations</h2>
                <div class="grid">
                    ${report.recommendations.map(rec => `
                        <div class="card priority-${rec.priority.toLowerCase()}">
                            <div class="status-indicator status-${rec.priority === 'High' ? 'error' : rec.priority === 'Medium' ? 'warning' : 'success'}"></div>
                            <h3>${rec.category} - ${rec.priority} Priority</h3>
                            <p><strong>Issue:</strong> ${rec.issue}</p>
                            <p><strong>Solution:</strong> ${rec.solution}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="section">
                <h2>Responsive Design Analysis</h2>
                <div class="breakpoint-analysis">
                    ${Object.entries(report.responsiveDesign || {}).map(([breakpoint, data]) => `
                        <div class="breakpoint-card">
                            <div class="breakpoint-title">${breakpoint.toUpperCase()} (Score: ${data.score || 0}/100)</div>
                            ${data.positives && data.positives.length > 0 ? `
                                <div class="positive-list">
                                    <strong>Strengths:</strong>
                                    <ul>${data.positives.map(positive => `<li>${positive}</li>`).join('')}</ul>
                                </div>
                            ` : ''}
                            ${data.issues && data.issues.length > 0 ? `
                                <div class="issue-list">
                                    <strong>Issues:</strong>
                                    <ul>${data.issues.map(issue => `<li>${issue}</li>`).join('')}</ul>
                                </div>
                            ` : ''}
                            ${data.measurements ? `
                                <div class="metric">Horizontal Scroll: ${data.measurements.hasHorizontalScroll ? 'Yes' : 'No'}</div>
                                ${data.measurements.readability ? `<div class="metric">Text Readability: ${data.measurements.readability.percentage.toFixed(1)}%</div>` : ''}
                                ${data.measurements.touchTargets ? `<div class="metric">Adequate Touch Targets: ${data.measurements.touchTargets.percentage.toFixed(1)}%</div>` : ''}
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="section">
                <h2>Accessibility Analysis</h2>
                <div class="card">
                    <h3>Score: ${report.accessibility.score || 0}/100</h3>
                    ${report.accessibility.positives && report.accessibility.positives.length > 0 ? `
                        <div class="positive-list">
                            <strong>Accessibility Strengths:</strong>
                            <ul>${report.accessibility.positives.map(positive => `<li>${positive}</li>`).join('')}</ul>
                        </div>
                    ` : ''}
                    ${report.accessibility.issues && report.accessibility.issues.length > 0 ? `
                        <div class="issue-list">
                            <strong>Accessibility Issues:</strong>
                            <ul>${report.accessibility.issues.map(issue => `<li>${issue}</li>`).join('')}</ul>
                        </div>
                    ` : ''}
                    <div class="grid" style="margin-top: 20px;">
                        <div class="metric">Headings Found: ${report.accessibility.headingStructure?.length || 0}</div>
                        <div class="metric">Images Analyzed: ${report.accessibility.images?.length || 0}</div>
                        <div class="metric">Links Found: ${report.accessibility.links?.length || 0}</div>
                        <div class="metric">Form Elements: ${report.accessibility.forms?.length || 0}</div>
                        <div class="metric">Focusable Elements: ${report.accessibility.focusable?.length || 0}</div>
                        <div class="metric">Landmarks: ${report.accessibility.landmarks?.length || 0}</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>Brand Consistency Analysis</h2>
                <div class="card">
                    <h3>Score: ${report.brandConsistency.score || 0}/100</h3>
                    ${report.brandConsistency.positives && report.brandConsistency.positives.length > 0 ? `
                        <div class="positive-list">
                            <strong>Brand Strengths:</strong>
                            <ul>${report.brandConsistency.positives.map(positive => `<li>${positive}</li>`).join('')}</ul>
                        </div>
                    ` : ''}
                    ${report.brandConsistency.issues && report.brandConsistency.issues.length > 0 ? `
                        <div class="issue-list">
                            <strong>Brand Issues:</strong>
                            <ul>${report.brandConsistency.issues.map(issue => `<li>${issue}</li>`).join('')}</ul>
                        </div>
                    ` : ''}
                    <div class="grid" style="margin-top: 20px;">
                        <div class="metric">Font Families: ${report.brandConsistency.typography?.fontFamilies?.length || 0}</div>
                        <div class="metric">Unique Colors: ${report.brandConsistency.colors?.totalUniqueColors || 0}</div>
                        <div class="metric">Montserrat Detected: ${report.brandConsistency.typography?.hasMontserrat ? 'Yes' : 'No'}</div>
                        <div class="metric">Source Sans Detected: ${report.brandConsistency.typography?.hasSourceSans ? 'Yes' : 'No'}</div>
                        <div class="metric">Logo Present: ${report.brandConsistency.branding?.hasLogo ? 'Yes' : 'No'}</div>
                        <div class="metric">Navigation Present: ${report.brandConsistency.branding?.hasNavigation ? 'Yes' : 'No'}</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>User Experience Analysis</h2>
                <div class="card">
                    <h3>Score: ${report.uxAnalysis.score || 0}/100</h3>
                    ${report.uxAnalysis.positives && report.uxAnalysis.positives.length > 0 ? `
                        <div class="positive-list">
                            <strong>UX Strengths:</strong>
                            <ul>${report.uxAnalysis.positives.map(positive => `<li>${positive}</li>`).join('')}</ul>
                        </div>
                    ` : ''}
                    ${report.uxAnalysis.issues && report.uxAnalysis.issues.length > 0 ? `
                        <div class="issue-list">
                            <strong>UX Issues:</strong>
                            <ul>${report.uxAnalysis.issues.map(issue => `<li>${issue}</li>`).join('')}</ul>
                        </div>
                    ` : ''}
                    <div class="grid" style="margin-top: 20px;">
                        <div class="metric">Navigation Links: ${report.uxAnalysis.navigation?.linkCount || 0}</div>
                        <div class="metric">Interactive Elements: ${report.uxAnalysis.interactions?.buttonCount || 0}</div>
                        <div class="metric">Content Sections: ${report.uxAnalysis.content?.sectionCount || 0}</div>
                        <div class="metric">Hero Section: ${report.uxAnalysis.content?.hasHero ? 'Yes' : 'No'}</div>
                        <div class="metric">Footer: ${report.uxAnalysis.content?.hasFooter ? 'Yes' : 'No'}</div>
                        <div class="metric">Contact Methods: ${report.uxAnalysis.conversion?.contactMethods || 0}</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>Screenshots</h2>
                <div class="screenshot-grid">
                    ${report.screenshots.map(screenshot => `
                        <div class="screenshot">
                            <h3>${screenshot.replace('.png', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                            <img src="${screenshot}" alt="${screenshot}" loading="lazy">
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="section">
                <h2>Technical Details</h2>
                <pre>${JSON.stringify(report, null, 2)}</pre>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  async runComprehensiveReview() {
    try {
      await this.initialize();
      await this.navigateToSite();
      
      // Only continue if page loaded successfully
      if (!this.results.pageLoad.hasError) {
        await this.captureScreenshots();
        await this.testResponsiveDesign();
        await this.analyzeAccessibilityComprehensive();
        await this.analyzeBrandConsistencyDetailed();
        await this.analyzeUserExperienceDetailed();
      }
      
      const report = await this.generateComprehensiveReport();
      return report;
    } catch (error) {
      console.error('❌ Enhanced design review failed:', error);
      throw error;
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Run the enhanced design review
(async () => {
  const review = new EnhancedGallifreyDesignReview();
  try {
    const report = await review.runComprehensiveReview();
    process.exit(0);
  } catch (error) {
    console.error('Failed to complete enhanced design review:', error);
    process.exit(1);
  }
})();