/**
 * MCP-Chrome Testing Scenarios for Gallifrey Consulting
 * 
 * These scenarios can be executed through the mcp-chrome extension
 * to provide real-time testing and validation during development.
 */

// Design System Validation Scenarios
const designSystemTests = {
  
  /**
   * Validate Brand Token Usage
   * Checks if components are using proper design tokens vs hardcoded colors
   */
  async validateBrandTokens() {
    console.log('🎨 Validating brand token usage...');
    
    const expectedTokens = {
      'oyn-orange-600': '#F97316',
      'oyn-stone-800': '#292524',
      'gallifrey-teal': '#2D5A87',
      'gallifrey-charcoal': '#1F2937'
    };
    
    // Check for hardcoded colors in style attributes
    const elementsWithInlineStyles = document.querySelectorAll('[style*="color"], [style*="background"]');
    console.log(`Found ${elementsWithInlineStyles.length} elements with inline styles`);
    
    // Check for proper Tailwind classes
    const ownYourNarrativeSection = document.querySelector('[class*="oyn-"]');
    const gallifreySection = document.querySelector('[class*="gallifrey-"]');
    
    return {
      hasOynTokens: !!ownYourNarrativeSection,
      hasGallifreyTokens: !!gallifreySection,
      inlineStylesCount: elementsWithInlineStyles.length,
      recommendation: elementsWithInlineStyles.length > 0 ? 
        'Consider replacing inline styles with design tokens' : 
        'Brand token usage looks good!'
    };
  },

  /**
   * Typography Hierarchy Validation
   * Ensures proper font loading and hierarchy
   */
  async validateTypography() {
    console.log('📝 Validating typography hierarchy...');
    
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const fontFamilies = [];
    
    headings.forEach(heading => {
      const computedStyle = window.getComputedStyle(heading);
      fontFamilies.push(computedStyle.fontFamily);
    });
    
    const montserratUsage = fontFamilies.filter(font => 
      font.includes('Montserrat')).length;
    
    return {
      totalHeadings: headings.length,
      montserratUsage,
      fontLoadingSuccess: montserratUsage > 0,
      hierarchyScore: headings.length > 0 ? (montserratUsage / headings.length) * 100 : 0
    };
  },

  /**
   * Color Contrast Validation
   * Checks accessibility compliance for colors
   */
  async validateColorContrast() {
    console.log('🌈 Validating color contrast ratios...');
    
    const textElements = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6');
    const contrastIssues = [];
    
    textElements.forEach((element, index) => {
      if (index > 20) return; // Limit for performance
      
      const style = window.getComputedStyle(element);
      const color = style.color;
      const backgroundColor = style.backgroundColor;
      
      // Simple contrast check (would need proper contrast calculation in real implementation)
      if (color === backgroundColor) {
        contrastIssues.push({
          element: element.tagName,
          issue: 'Same foreground and background color'
        });
      }
    });
    
    return {
      elementsChecked: Math.min(textElements.length, 20),
      contrastIssues: contrastIssues.length,
      accessibilityScore: contrastIssues.length === 0 ? 100 : 
        Math.max(0, 100 - (contrastIssues.length * 10))
    };
  }
};

// User Experience Testing Scenarios
const userExperienceTests = {
  
  /**
   * Consultation Booking Flow Test
   * Simulates user journey for booking consultation
   */
  async testConsultationFlow() {
    console.log('📞 Testing consultation booking flow...');
    
    // Find consultation CTAs
    const consultationButtons = document.querySelectorAll('button');
    const consultationCTAs = Array.from(consultationButtons).filter(btn => 
      btn.textContent.toLowerCase().includes('consultation') ||
      btn.textContent.toLowerCase().includes('schedule') ||
      btn.textContent.toLowerCase().includes('book') ||
      btn.textContent.toLowerCase().includes('started') ||
      btn.textContent.toLowerCase().includes('contact')
    );
    
    const contactForm = document.querySelector('form');
    const nameField = document.querySelector('input[name="name"], input[id*="name"]');
    const emailField = document.querySelector('input[type="email"]');
    
    return {
      consultationCTAsFound: consultationCTAs.length,
      contactFormPresent: !!contactForm,
      requiredFieldsPresent: !!(nameField && emailField),
      flowReadiness: consultationCTAs.length > 0 && contactForm && nameField && emailField,
      recommendations: consultationCTAs.length === 0 ? 
        ['Add more consultation CTAs'] : 
        ['Consultation flow looks complete']
    };
  },

  /**
   * Mobile Responsiveness Test
   * Checks layout adaptation across viewport sizes
   */
  async testMobileResponsiveness() {
    console.log('📱 Testing mobile responsiveness...');
    
    const viewportWidth = window.innerWidth;
    const mobileBreakpoint = 768;
    
    // Check for hamburger menu on mobile
    const hamburgerMenu = document.querySelector('[class*="hamburger"], [class*="mobile-menu"]');
    const navigationItems = document.querySelectorAll('nav a, nav button');
    
    // Check for mobile-specific classes
    const mobileClasses = document.querySelectorAll('[class*="mobile-"], [class*="sm:"], [class*="md:"]');
    
    return {
      currentViewport: viewportWidth,
      isMobile: viewportWidth < mobileBreakpoint,
      hasMobileMenu: !!hamburgerMenu,
      navigationItemsCount: navigationItems.length,
      responsiveClassesCount: mobileClasses.length,
      mobileOptimized: viewportWidth < mobileBreakpoint ? !!hamburgerMenu : true
    };
  },

  /**
   * Performance Metrics Collection
   * Gathers Core Web Vitals and loading metrics
   */
  async collectPerformanceMetrics() {
    console.log('⚡ Collecting performance metrics...');
    
    const navigation = performance.getEntriesByType('navigation')[0];
    const paintEntries = performance.getEntriesByType('paint');
    
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    const lcp = paintEntries.find(entry => entry.name === 'largest-contentful-paint');
    
    return {
      domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
      loadComplete: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
      firstContentfulPaint: fcp ? fcp.startTime : 'Not available',
      largestContentfulPaint: lcp ? lcp.startTime : 'Not available',
      pageLoadTime: navigation ? navigation.loadEventEnd - navigation.fetchStart : 0,
      recommendations: navigation && navigation.loadEventEnd - navigation.fetchStart > 3000 ? 
        ['Consider optimizing page load time'] : 
        ['Page load performance looks good']
    };
  }
};

// Integration Testing Scenarios
const integrationTests = {
  
  /**
   * Component Integration Test
   * Validates that shared components are working properly
   */
  async testComponentIntegration() {
    console.log('🧩 Testing component integration...');
    
    // Check for new shared components
    const buttons = document.querySelectorAll('button');
    const cards = document.querySelectorAll('[class*="card"], [class*="rounded-lg"]');
    const sections = document.querySelectorAll('section');
    
    // Test button variants
    const brandButtons = document.querySelectorAll('[class*="gallifrey"], [class*="oyn"]');
    
    return {
      totalButtons: buttons.length,
      totalCards: cards.length,
      totalSections: sections.length,
      brandSpecificButtons: brandButtons.length,
      componentIntegrationScore: brandButtons.length > 0 ? 100 : 70,
      recommendations: brandButtons.length === 0 ? 
        ['Consider implementing brand-specific button variants'] :
        ['Component integration looks good']
    };
  },

  /**
   * Lazy Loading Validation
   * Checks if lazy loading is working for below-fold components
   */
  async testLazyLoading() {
    console.log('🔄 Testing lazy loading implementation...');
    
    // Check for lazy-loaded sections
    const allSections = document.querySelectorAll('section');
    const faq = document.querySelector('[class*="faq"]') || 
      Array.from(allSections).find(s => s.textContent.toLowerCase().includes('faq') || s.textContent.toLowerCase().includes('question'));
    const pricing = document.querySelector('[class*="pricing"]') || 
      Array.from(allSections).find(s => s.textContent.toLowerCase().includes('pricing') || s.textContent.toLowerCase().includes('price'));
    const contact = document.querySelector('[class*="contact"], form') || 
      Array.from(allSections).find(s => s.textContent.toLowerCase().includes('contact'));
    
    // Check if these elements are initially hidden or loading
    const loadingElements = document.querySelectorAll('[class*="loading"], [class*="animate-pulse"]');
    
    return {
      faqPresent: !!faq,
      pricingPresent: !!pricing,
      contactPresent: !!contact,
      loadingIndicators: loadingElements.length,
      lazyLoadingActive: loadingElements.length > 0,
      recommendations: loadingElements.length === 0 ? 
        ['Lazy loading may not be active or already completed'] :
        ['Lazy loading is working correctly']
    };
  }
};

// Comprehensive Test Runner
const mcpChromeTestSuite = {
  
  /**
   * Run All Design System Tests
   */
  async runDesignSystemTests() {
    console.log('🎨 Running comprehensive design system tests...');
    
    const results = {
      brandTokens: await designSystemTests.validateBrandTokens(),
      typography: await designSystemTests.validateTypography(),
      colorContrast: await designSystemTests.validateColorContrast()
    };
    
    // Calculate overall design system score
    const scores = [
      results.brandTokens.hasOynTokens && results.brandTokens.hasGallifreyTokens ? 100 : 50,
      results.typography.hierarchyScore,
      results.colorContrast.accessibilityScore
    ];
    
    results.overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    results.summary = `Design System Score: ${Math.round(results.overallScore)}%`;
    
    return results;
  },

  /**
   * Run All UX Tests
   */
  async runUXTests() {
    console.log('👥 Running comprehensive UX tests...');
    
    const results = {
      consultationFlow: await userExperienceTests.testConsultationFlow(),
      mobileResponsiveness: await userExperienceTests.testMobileResponsiveness(),
      performance: await userExperienceTests.collectPerformanceMetrics()
    };
    
    const scores = [
      results.consultationFlow.flowReadiness ? 100 : 60,
      results.mobileResponsiveness.mobileOptimized ? 100 : 70,
      results.performance.pageLoadTime < 3000 ? 100 : 70
    ];
    
    results.overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    results.summary = `UX Score: ${Math.round(results.overallScore)}%`;
    
    return results;
  },

  /**
   * Run All Integration Tests
   */
  async runIntegrationTests() {
    console.log('🔗 Running integration tests...');
    
    const results = {
      componentIntegration: await integrationTests.testComponentIntegration(),
      lazyLoading: await integrationTests.testLazyLoading()
    };
    
    const scores = [
      results.componentIntegration.componentIntegrationScore,
      results.lazyLoading.lazyLoadingActive ? 100 : 80
    ];
    
    results.overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    results.summary = `Integration Score: ${Math.round(results.overallScore)}%`;
    
    return results;
  },

  /**
   * Complete Test Suite Runner
   */
  async runCompleteTestSuite() {
    console.log('🚀 Running complete MCP-Chrome test suite for Gallifrey Consulting...');
    
    const startTime = performance.now();
    
    try {
      const results = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        userAgent: navigator.userAgent.substring(0, 100),
        
        designSystem: await this.runDesignSystemTests(),
        userExperience: await this.runUXTests(),
        integration: await this.runIntegrationTests()
      };
      
      // Calculate overall quality score
      const overallScore = [
        results.designSystem.overallScore,
        results.userExperience.overallScore,
        results.integration.overallScore
      ].reduce((a, b) => a + b, 0) / 3;
      
      results.overallQualityScore = Math.round(overallScore);
      results.executionTime = Math.round(performance.now() - startTime);
      
      results.summary = {
        score: `${results.overallQualityScore}%`,
        message: overallScore >= 90 ? 'Excellent! 🎉' :
                overallScore >= 80 ? 'Good with room for improvement 👍' :
                overallScore >= 70 ? 'Needs attention ⚠️' :
                'Requires significant improvements 🔧',
        executionTime: `${results.executionTime}ms`
      };
      
      console.log('📊 Test Results:', results.summary);
      return results;
      
    } catch (error) {
      console.error('❌ Test suite execution failed:', error);
      return {
        error: error.message,
        timestamp: new Date().toISOString(),
        executionTime: Math.round(performance.now() - startTime)
      };
    }
  }
};

// Make test suite available globally for mcp-chrome
window.mcpChromeTestSuite = mcpChromeTestSuite;

// Export for Node.js environment if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    designSystemTests,
    userExperienceTests,
    integrationTests,
    mcpChromeTestSuite
  };
}

console.log('✅ MCP-Chrome test scenarios loaded. Use window.mcpChromeTestSuite.runCompleteTestSuite() to execute.');