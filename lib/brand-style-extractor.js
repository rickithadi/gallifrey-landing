/**
 * Gallifrey Consulting Brand Style Extractor
 * 
 * This utility extracts and standardizes Gallifrey brand styles
 * for consistent application across all documents and templates.
 */

import fs from 'fs';
import path from 'path';

class BrandStyleExtractor {
  constructor() {
    this.brandConfig = this.loadBrandConfiguration();
  }

  /**
   * Load brand configuration from existing CSS and documentation
   */
  loadBrandConfiguration() {
    return {
      // Color Palette
      colors: {
        primary: {
          'gallifrey-white': { rgb: [255, 255, 255], hex: '#FFFFFF' },
          'gallifrey-off-white': { rgb: [249, 250, 251], hex: '#F9FAFB' },
          'gallifrey-light-gray': { rgb: [96, 103, 112], hex: '#606770' },
          'gallifrey-medium-gray': { rgb: [107, 114, 128], hex: '#6B7280' },
          'gallifrey-dark-gray': { rgb: [55, 65, 81], hex: '#374151' },
          'gallifrey-charcoal': { rgb: [31, 41, 55], hex: '#1F2937' },
          'gallifrey-teal': { rgb: [45, 90, 135], hex: '#2D5A87' },
          'gallifrey-teal-dark': { rgb: [35, 70, 105], hex: '#234669' },
          'gallifrey-border': { rgb: [229, 231, 235], hex: '#E5E7EB' }
        },
        campaign: {
          'oyn-stone-50': { rgb: [252, 252, 251], hex: '#FCFCFB' },
          'oyn-stone-100': { rgb: [247, 246, 244], hex: '#F7F6F4' },
          'oyn-stone-200': { rgb: [232, 230, 227], hex: '#E8E6E3' },
          'oyn-stone-700': { rgb: [71, 65, 60], hex: '#47413C' },
          'oyn-stone-800': { rgb: [45, 41, 37], hex: '#2D2925' },
          'oyn-orange-500': { rgb: [197, 139, 85], hex: '#C58B55' },
          'oyn-orange-600': { rgb: [168, 113, 68], hex: '#A87144' },
          'oyn-orange-700': { rgb: [139, 92, 56], hex: '#8B5C38' }
        }
      },

      // Typography System
      typography: {
        fonts: {
          heading: {
            family: 'Montserrat',
            fallback: 'sans-serif',
            weights: [400, 500, 600, 700],
            googleUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700'
          },
          body: {
            family: 'Source Sans Pro',
            fallback: 'sans-serif',
            weights: [400, 500, 600],
            googleUrl: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;500;600'
          },
          serif: {
            family: 'Playfair Display',
            fallback: 'serif',
            weights: [400, 500, 600, 700],
            googleUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700'
          }
        },
        scale: {
          'xs': '0.75rem',
          'sm': '0.875rem',
          'base': '1rem',
          'lg': '1.125rem',
          'xl': '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem',
          '5xl': '3rem'
        },
        lineHeight: {
          tight: '1.25',
          normal: '1.5',
          relaxed: '1.625',
          loose: '2'
        }
      },

      // Spacing System
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem'
      },

      // Border Radius
      borderRadius: {
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem'
      },

      // Shadows
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      },

      // Document Elements
      elements: {
        letterhead: {
          companyName: 'GALLIFREY CONSULTING',
          tagline: 'Sacred Technology for Authentic Digital Liberation',
          location: 'Melbourne, Australia',
          contact: 'contact@gallifrey.consulting',
          services: 'Digital Dharma • Platform Independence • Authentic Presence'
        },
        spiritual: {
          headers: {
            'om-kali': 'ॐ माता काली 🗡️',
            'om-ganesha': 'ॐ गणपतये नमः 🐘',
            'om-shanti': 'ॐ शांति शांति शांति',
            'divine-intention': 'Generated with Divine Intention'
          },
          blessings: {
            general: '🕉️ This document serves dharmic implementation of authentic digital liberation',
            manifesto: '🕉️ This manifesto serves as both spiritual foundation and business framework',
            technical: '🕉️ Sacred technology in service of authentic digital presence'
          }
        },
        classifications: {
          'business-confidential': 'Business Confidential',
          'sacred-business-dharma': 'Sacred Business Dharma',
          'internal-strategy': 'Internal Strategy Document',
          'client-deliverable': 'Client Deliverable',
          'public-manifesto': 'Public Manifesto',
          'technical-specification': 'Technical Specification'
        }
      }
    };
  }

  /**
   * Generate CSS custom properties from brand colors
   */
  generateCSSVariables() {
    const variables = [];
    
    // Add color variables
    Object.entries(this.brandConfig.colors.primary).forEach(([name, color]) => {
      variables.push(`  --${name}: ${color.rgb.join(', ')};`);
    });

    Object.entries(this.brandConfig.colors.campaign).forEach(([name, color]) => {
      variables.push(`  --${name}: ${color.rgb.join(', ')};`);
    });

    // Add typography variables
    variables.push(`  --font-heading: '${this.brandConfig.typography.fonts.heading.family}', ${this.brandConfig.typography.fonts.heading.fallback};`);
    variables.push(`  --font-body: '${this.brandConfig.typography.fonts.body.family}', ${this.brandConfig.typography.fonts.body.fallback};`);
    variables.push(`  --font-serif: '${this.brandConfig.typography.fonts.serif.family}', ${this.brandConfig.typography.fonts.serif.fallback};`);

    return `:root {\n${variables.join('\n')}\n}`;
  }

  /**
   * Generate Google Fonts import statement
   */
  generateFontsImport() {
    const fonts = Object.values(this.brandConfig.typography.fonts);
    const fontFamilies = fonts.map(font => {
      const weights = font.weights.join(';');
      return `family=${font.family.replace(/\s+/g, '+')}:wght@${weights}`;
    });

    return `@import url('https://fonts.googleapis.com/css2?${fontFamilies.join('&')}&display=swap');`;
  }

  /**
   * Extract color palette for design tools
   */
  exportColorPalette(format = 'hex') {
    const palette = {};
    
    ['primary', 'campaign'].forEach(category => {
      palette[category] = {};
      Object.entries(this.brandConfig.colors[category]).forEach(([name, color]) => {
        palette[category][name] = format === 'hex' ? color.hex : `rgb(${color.rgb.join(', ')})`;
      });
    });

    return palette;
  }

  /**
   * Generate Figma/Adobe color swatches
   */
  generateDesignSwatches() {
    const swatches = [];
    
    Object.entries(this.brandConfig.colors.primary).forEach(([name, color]) => {
      swatches.push({
        name: name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' '),
        hex: color.hex,
        rgb: color.rgb
      });
    });

    return swatches;
  }

  /**
   * Generate brand style guide documentation
   */
  generateStyleGuide() {
    const guide = {
      title: 'Gallifrey Consulting Brand Style Guide',
      version: '2.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      
      colors: {
        primary: this.brandConfig.colors.primary,
        campaign: this.brandConfig.colors.campaign
      },
      
      typography: this.brandConfig.typography,
      
      usage: {
        docsAndContracts: {
          primaryColor: 'gallifrey-charcoal',
          accentColor: 'gallifrey-teal',
          backgroundColor: 'gallifrey-white',
          headingFont: 'Montserrat',
          bodyFont: 'Source Sans Pro'
        },
        manifestoAndSpiritual: {
          primaryColor: 'oyn-stone-800',
          accentColor: 'oyn-orange-600',
          backgroundColor: 'oyn-stone-50',
          headingFont: 'Montserrat',
          bodyFont: 'Source Sans Pro',
          serifFont: 'Playfair Display'
        }
      },

      elements: this.brandConfig.elements
    };

    return guide;
  }

  /**
   * Generate CSS utility classes
   */
  generateUtilityClasses() {
    const utilities = [];

    // Text color utilities
    Object.keys(this.brandConfig.colors.primary).forEach(color => {
      utilities.push(`.text-${color} { color: rgb(var(--${color})); }`);
    });

    // Background color utilities  
    Object.keys(this.brandConfig.colors.primary).forEach(color => {
      utilities.push(`.bg-${color} { background-color: rgb(var(--${color})); }`);
    });

    // Typography utilities
    utilities.push(`.font-heading { font-family: var(--font-heading); }`);
    utilities.push(`.font-body { font-family: var(--font-body); }`);
    utilities.push(`.font-serif { font-family: var(--font-serif); }`);

    // Special brand utilities
    utilities.push(`.logo-serif {
  font-family: var(--font-serif);
  font-weight: 600;
  letter-spacing: 0.02em;
}`);

    utilities.push(`.elegant-caps {
  font-variant: small-caps;
  letter-spacing: 0.15em;
  font-weight: 500;
}`);

    utilities.push(`.text-gradient-gallifrey {
  background: linear-gradient(135deg, rgb(var(--gallifrey-charcoal)), rgb(var(--gallifrey-teal)));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}`);

    return utilities.join('\n\n');
  }

  /**
   * Validate brand compliance
   */
  validateBrandCompliance(cssContent) {
    const issues = [];
    
    // Check for required fonts
    const requiredFonts = ['Montserrat', 'Source Sans Pro', 'Playfair Display'];
    requiredFonts.forEach(font => {
      if (!cssContent.includes(font)) {
        issues.push(`Missing required font: ${font}`);
      }
    });

    // Check for brand colors
    const brandColors = Object.keys(this.brandConfig.colors.primary);
    const missingColors = brandColors.filter(color => !cssContent.includes(`--${color}`));
    if (missingColors.length > 0) {
      issues.push(`Missing brand colors: ${missingColors.join(', ')}`);
    }

    return {
      isCompliant: issues.length === 0,
      issues
    };
  }

  /**
   * Generate complete brand CSS file
   */
  generateCompleteBrandCSS() {
    const css = [
      '/* Gallifrey Consulting Brand Styles */',
      '/* Generated by Brand Style Extractor */',
      '',
      this.generateFontsImport(),
      '',
      this.generateCSSVariables(),
      '',
      '/* Base Styles */',
      'body {',
      '  font-family: var(--font-body);',
      '  color: rgb(var(--gallifrey-charcoal));',
      '  background-color: rgb(var(--gallifrey-white));',
      '}',
      '',
      'h1, h2, h3, h4, h5, h6 {',
      '  font-family: var(--font-heading);',
      '}',
      '',
      '/* Utility Classes */',
      this.generateUtilityClasses()
    ];

    return css.join('\n');
  }

  /**
   * Save brand assets to files
   */
  saveBrandAssets(outputDir) {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save CSS file
    const css = this.generateCompleteBrandCSS();
    fs.writeFileSync(path.join(outputDir, 'gallifrey-brand.css'), css);

    // Save style guide JSON
    const styleGuide = this.generateStyleGuide();
    fs.writeFileSync(path.join(outputDir, 'brand-style-guide.json'), JSON.stringify(styleGuide, null, 2));

    // Save color palette
    const colorPalette = this.exportColorPalette();
    fs.writeFileSync(path.join(outputDir, 'color-palette.json'), JSON.stringify(colorPalette, null, 2));

    // Save design swatches
    const swatches = this.generateDesignSwatches();
    fs.writeFileSync(path.join(outputDir, 'design-swatches.json'), JSON.stringify(swatches, null, 2));

    return {
      css: path.join(outputDir, 'gallifrey-brand.css'),
      styleGuide: path.join(outputDir, 'brand-style-guide.json'),
      colorPalette: path.join(outputDir, 'color-palette.json'),
      swatches: path.join(outputDir, 'design-swatches.json')
    };
  }
}

export { BrandStyleExtractor };

// CLI usage
if (require.main === module) {
  const extractor = new BrandStyleExtractor();
  const outputDir = process.argv[2] || './output/brand-assets';
  
  try {
    const files = extractor.saveBrandAssets(outputDir);
    console.log('✅ Brand assets generated successfully:');
    Object.entries(files).forEach(([type, file]) => {
      console.log(`   ${type}: ${file}`);
    });
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}