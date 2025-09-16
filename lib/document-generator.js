/**
 * Gallifrey Consulting Document Standardization System
 * 
 * This system converts Markdown documents to HTML using the exact
 * Gallifrey brand template with dharmic/spiritual elements intact.
 * 
 * Features:
 * - Complete brand CSS styling extraction and application
 * - Spiritual header integration (ॐ माता काली 🗡️)
 * - Professional letterhead and contact information
 * - Document classification support
 * - Dharmic blessing sections
 * - Responsive design with print optimization
 */

import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

// Document Classification Types
const DOCUMENT_CLASSIFICATIONS = {
  'business-confidential': 'Business Confidential',
  'sacred-business-dharma': 'Sacred Business Dharma',
  'internal-strategy': 'Internal Strategy Document',
  'client-deliverable': 'Client Deliverable',
  'public-manifesto': 'Public Manifesto',
  'technical-specification': 'Technical Specification'
};

// Spiritual Headers Collection
const SPIRITUAL_HEADERS = {
  'om-kali': 'ॐ माता काली 🗡️',
  'om-ganesha': 'ॐ गणपतये नमः 🐘',
  'om-shanti': 'ॐ शांति शांति शांति',
  'divine-intention': 'Generated with Divine Intention',
  'dharmic-blessing': 'धर्मिक आशीर्वाद'
};

class GallifreyDocumentGenerator {
  constructor() {
    this.brandColors = this.loadBrandColors();
    this.templateStructure = this.getTemplateStructure();
  }

  /**
   * Load Gallifrey brand colors from the CSS system
   */
  loadBrandColors() {
    return {
      // Main Gallifrey Brand Colors
      'gallifrey-white': 'rgb(255, 255, 255)',
      'gallifrey-off-white': 'rgb(249, 250, 251)',
      'gallifrey-light-gray': 'rgb(96, 103, 112)',
      'gallifrey-medium-gray': 'rgb(107, 114, 128)',
      'gallifrey-dark-gray': 'rgb(55, 65, 81)',
      'gallifrey-charcoal': 'rgb(31, 41, 55)',
      'gallifrey-teal': 'rgb(45, 90, 135)',
      'gallifrey-teal-dark': 'rgb(35, 70, 105)',
      'gallifrey-border': 'rgb(229, 231, 235)',
      
      // OYN Campaign Colors (for special documents)
      'oyn-stone-50': 'rgb(252, 252, 251)',
      'oyn-stone-100': 'rgb(247, 246, 244)',
      'oyn-stone-200': 'rgb(232, 230, 227)',
      'oyn-stone-700': 'rgb(71, 65, 60)',
      'oyn-stone-800': 'rgb(45, 41, 37)',
      'oyn-orange-500': 'rgb(197, 139, 85)',
      'oyn-orange-600': 'rgb(168, 113, 68)',
      'oyn-orange-700': 'rgb(139, 92, 56)'
    };
  }

  /**
   * Get the complete HTML template structure
   */
  getTemplateStructure() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}} | Gallifrey Consulting</title>
    <style>
        ${this.getCompleteCSS()}
    </style>
</head>
<body class="gallifrey-document">
    <!-- Letterhead -->
    <header class="document-header">
        <div class="header-content">
            <div class="logo-section">
                <h1 class="company-name">GALLIFREY CONSULTING</h1>
                <p class="tagline">Sacred Technology for Authentic Digital Liberation</p>
            </div>
            <div class="contact-section">
                <div class="contact-info">
                    <p>Melbourne, Australia</p>
                    <p>contact@gallifrey.consulting</p>
                    <p>Digital Dharma • Platform Independence • Authentic Presence</p>
                </div>
            </div>
        </div>
    </header>

    <!-- Spiritual Header -->
    <section class="spiritual-header">
        <div class="spiritual-content">
            <p class="spiritual-symbol">{{SPIRITUAL_HEADER}}</p>
            <p class="generation-date">{{GENERATION_DATE}}</p>
        </div>
    </section>

    <!-- Document Content -->
    <main class="document-content">
        {{CONTENT}}
    </main>

    <!-- Document Footer -->
    <footer class="document-footer">
        <div class="footer-content">
            <div class="classification-section">
                <p class="classification"><strong>Document Classification:</strong> {{CLASSIFICATION}}</p>
                <p class="generation-info"><strong>Generated:</strong> {{DATE}}</p>
                <p class="purpose"><strong>Purpose:</strong> {{PURPOSE}}</p>
                <p class="prepared-for"><strong>Prepared:</strong> {{PREPARED_FOR}}</p>
            </div>
            <div class="closing-blessing">
                <p class="closing-mantra">🕉️ {{CLOSING_MESSAGE}}</p>
            </div>
        </div>
    </footer>
</body>
</html>`;
  }

  /**
   * Generate complete CSS with Gallifrey branding
   */
  getCompleteCSS() {
    return `
      /* Google Fonts */
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Source+Sans+Pro:wght@400;500;600&family=Playfair+Display:wght@400;500;600;700&display=swap');

      /* CSS Variables */
      :root {
        /* Gallifrey Brand Colors */
        --gallifrey-white: 255, 255, 255;
        --gallifrey-off-white: 249, 250, 251;
        --gallifrey-light-gray: 96, 103, 112;
        --gallifrey-medium-gray: 107, 114, 128;
        --gallifrey-dark-gray: 55, 65, 81;
        --gallifrey-charcoal: 31, 41, 55;
        --gallifrey-teal: 45, 90, 135;
        --gallifrey-teal-dark: 35, 70, 105;
        --gallifrey-border: 229, 231, 235;
        
        /* OYN Campaign Colors */
        --oyn-stone-50: 252, 252, 251;
        --oyn-stone-100: 247, 246, 244;
        --oyn-stone-700: 71, 65, 60;
        --oyn-stone-800: 45, 41, 37;
        --oyn-orange-500: 197, 139, 85;
        --oyn-orange-600: 168, 113, 68;

        /* Typography */
        --font-heading: 'Montserrat', sans-serif;
        --font-body: 'Source Sans Pro', sans-serif;
        --font-serif: 'Playfair Display', serif;
      }

      /* Base Styles */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: var(--font-body);
        line-height: 1.6;
        color: rgb(var(--gallifrey-charcoal));
        background-color: rgb(var(--gallifrey-white));
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      /* Document Header */
      .document-header {
        border-bottom: 3px solid rgb(var(--gallifrey-teal));
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .company-name {
        font-family: var(--font-serif);
        font-size: 2.5rem;
        font-weight: 700;
        color: rgb(var(--gallifrey-charcoal));
        letter-spacing: 0.02em;
        margin-bottom: 0.5rem;
      }

      .tagline {
        font-size: 1.1rem;
        color: rgb(var(--gallifrey-teal));
        font-weight: 500;
        font-style: italic;
      }

      .contact-section {
        text-align: right;
      }

      .contact-info p {
        font-size: 0.95rem;
        color: rgb(var(--gallifrey-medium-gray));
        margin-bottom: 0.25rem;
      }

      .contact-info p:last-child {
        font-weight: 600;
        color: rgb(var(--gallifrey-teal));
        font-size: 0.9rem;
        letter-spacing: 0.05em;
      }

      /* Spiritual Header */
      .spiritual-header {
        text-align: center;
        margin: 2rem 0;
        padding: 1.5rem;
        background: linear-gradient(135deg, rgb(var(--gallifrey-off-white)), rgba(var(--gallifrey-teal), 0.05));
        border-radius: 8px;
        border: 1px solid rgb(var(--gallifrey-border));
      }

      .spiritual-symbol {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: rgb(var(--gallifrey-teal));
      }

      .generation-date {
        font-size: 0.95rem;
        color: rgb(var(--gallifrey-medium-gray));
        font-style: italic;
      }

      /* Document Content */
      .document-content {
        margin: 2rem 0;
        line-height: 1.7;
      }

      /* Typography */
      h1 {
        font-family: var(--font-heading);
        font-size: 2.25rem;
        font-weight: 600;
        color: rgb(var(--gallifrey-charcoal));
        margin: 2rem 0 1rem 0;
        letter-spacing: -0.02em;
        border-bottom: 2px solid rgb(var(--gallifrey-teal));
        padding-bottom: 0.5rem;
      }

      h2 {
        font-family: var(--font-heading);
        font-size: 1.8rem;
        font-weight: 600;
        color: rgb(var(--gallifrey-teal));
        margin: 1.8rem 0 1rem 0;
        letter-spacing: -0.01em;
      }

      h3 {
        font-family: var(--font-heading);
        font-size: 1.4rem;
        font-weight: 600;
        color: rgb(var(--gallifrey-charcoal));
        margin: 1.5rem 0 0.8rem 0;
      }

      h4 {
        font-family: var(--font-heading);
        font-size: 1.2rem;
        font-weight: 500;
        color: rgb(var(--gallifrey-dark-gray));
        margin: 1.2rem 0 0.6rem 0;
      }

      p {
        margin-bottom: 1rem;
        font-size: 1.05rem;
      }

      strong {
        color: rgb(var(--gallifrey-charcoal));
        font-weight: 600;
      }

      em {
        color: rgb(var(--gallifrey-teal));
        font-style: italic;
      }

      /* Lists */
      ul, ol {
        margin: 1rem 0;
        padding-left: 2rem;
      }

      li {
        margin-bottom: 0.5rem;
        font-size: 1.05rem;
      }

      /* Blockquotes */
      blockquote {
        border-left: 4px solid rgb(var(--gallifrey-teal));
        padding-left: 1.5rem;
        margin: 1.5rem 0;
        font-style: italic;
        color: rgb(var(--gallifrey-dark-gray));
        background: rgba(var(--gallifrey-teal), 0.03);
        padding: 1rem 1.5rem;
        border-radius: 0 8px 8px 0;
      }

      /* Special Sections */
      .dharmic-principle, .sacred-section {
        background: linear-gradient(135deg, rgb(var(--oyn-stone-50)), rgba(var(--oyn-orange-500), 0.05));
        border: 1px solid rgba(var(--oyn-orange-500), 0.2);
        border-radius: 8px;
        padding: 1.5rem;
        margin: 1.5rem 0;
      }

      .dharmic-principle h4, .sacred-section h4 {
        color: rgb(var(--oyn-orange-600));
        margin-top: 0;
      }

      /* Pricing Sections */
      .pricing-section {
        background: rgb(var(--gallifrey-off-white));
        border: 1px solid rgb(var(--gallifrey-border));
        border-radius: 8px;
        padding: 1.5rem;
        margin: 1rem 0;
      }

      .pricing-section h3 {
        color: rgb(var(--gallifrey-teal));
        margin-top: 0;
      }

      .price {
        font-size: 1.3rem;
        font-weight: 700;
        color: rgb(var(--gallifrey-charcoal));
        margin: 0.5rem 0;
      }

      /* Document Footer */
      .document-footer {
        margin-top: 3rem;
        border-top: 2px solid rgb(var(--gallifrey-border));
        padding-top: 1.5rem;
        font-size: 0.95rem;
        color: rgb(var(--gallifrey-medium-gray));
      }

      .footer-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .classification-section p {
        margin-bottom: 0.5rem;
      }

      .closing-blessing {
        text-align: right;
      }

      .closing-mantra {
        font-size: 1.1rem;
        color: rgb(var(--gallifrey-teal));
        font-style: italic;
        font-weight: 500;
      }

      /* Horizontal Rules */
      hr {
        border: none;
        height: 2px;
        background: linear-gradient(to right, transparent, rgb(var(--gallifrey-teal)), transparent);
        margin: 2rem 0;
      }

      /* Print Styles */
      @media print {
        body {
          max-width: none;
          padding: 0;
          font-size: 12pt;
          line-height: 1.5;
        }

        .document-header {
          break-after: avoid;
        }

        .spiritual-header {
          break-inside: avoid;
        }

        h1, h2, h3 {
          break-after: avoid;
        }

        .dharmic-principle, .sacred-section, .pricing-section {
          break-inside: avoid;
        }

        .document-footer {
          break-before: avoid;
        }

        /* Ensure consistent margins */
        @page {
          margin: 1in;
        }
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        body {
          padding: 1rem;
        }

        .header-content {
          flex-direction: column;
          text-align: center;
        }

        .contact-section {
          text-align: center;
        }

        .company-name {
          font-size: 2rem;
        }

        .footer-content {
          flex-direction: column;
          text-align: center;
        }

        .closing-blessing {
          text-align: center;
        }
      }

      /* Special Classes */
      .logo-serif {
        font-family: var(--font-serif);
        font-weight: 600;
        letter-spacing: 0.02em;
      }

      .elegant-caps {
        font-variant: small-caps;
        letter-spacing: 0.15em;
        font-weight: 500;
      }

      .text-gradient-gallifrey {
        background: linear-gradient(135deg, rgb(var(--gallifrey-charcoal)), rgb(var(--gallifrey-teal)));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    `;
  }

  /**
   * Convert Markdown content to HTML
   */
  convertMarkdownToHTML(markdown) {
    // Configure marked for better HTML output
    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: true,
      headerPrefix: 'section-'
    });

    let html = marked.parse(markdown);

    // Post-process HTML for Gallifrey-specific styling
    html = this.enhanceHTMLStyling(html);

    return html;
  }

  /**
   * Enhance HTML with Gallifrey-specific classes and structure
   */
  enhanceHTMLStyling(html) {
    // Add special classes to pricing sections
    html = html.replace(
      /(\$[\d,]+[\/\w\s]*)/g, 
      '<span class="price">$1</span>'
    );

    // Style dharmic principles
    html = html.replace(
      /<h4>([^<]*dharma[^<]*)<\/h4>/gi,
      '<h4 class="dharmic-heading">$1</h4>'
    );

    // Wrap pricing sections
    html = html.replace(
      /(### For [\s\S]*?)(?=### |$)/g,
      '<div class="pricing-section">$1</div>'
    );

    // Style mantras and spiritual quotes
    html = html.replace(
      /"([^"]*(?:dharma|Om|ॐ|mantra)[^"]*)".*?/gi,
      '<blockquote class="spiritual-quote">"$1"</blockquote>'
    );

    // Enhance sacred sections
    html = html.replace(
      /(### [\d]+\.\s*[^<]*(?:dharma|sacred|divine)[^<]*<\/h3>[\s\S]*?)(?=### |<h2|$)/gi,
      '<div class="sacred-section">$1</div>'
    );

    return html;
  }

  /**
   * Generate complete document from markdown file
   */
  generateDocument(markdownPath, options = {}) {
    // Default options
    const defaultOptions = {
      classification: 'sacred-business-dharma',
      spiritualHeader: 'om-kali',
      purpose: 'Foundation document for Digital Savasthya practice',
      preparedFor: 'dharmic implementation of authentic digital wellness services',
      closingMessage: 'This document serves as both spiritual foundation and business framework'
    };

    const opts = { ...defaultOptions, ...options };

    // Read markdown file
    const markdown = fs.readFileSync(markdownPath, 'utf8');
    
    // Extract title from first heading or filename
    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : path.basename(markdownPath, '.md');

    // Convert markdown to HTML
    const content = this.convertMarkdownToHTML(markdown);

    // Generate current date
    const now = new Date();
    const generationDate = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Replace template variables
    let html = this.templateStructure
      .replace('{{TITLE}}', title)
      .replace('{{SPIRITUAL_HEADER}}', SPIRITUAL_HEADERS[opts.spiritualHeader])
      .replace('{{GENERATION_DATE}}', `${SPIRITUAL_HEADERS['divine-intention']} - ${generationDate}`)
      .replace('{{CONTENT}}', content)
      .replace('{{CLASSIFICATION}}', DOCUMENT_CLASSIFICATIONS[opts.classification])
      .replace('{{DATE}}', generationDate)
      .replace('{{PURPOSE}}', opts.purpose)
      .replace('{{PREPARED_FOR}}', opts.preparedFor)
      .replace('{{CLOSING_MESSAGE}}', opts.closingMessage);

    return html;
  }

  /**
   * Save generated document to file
   */
  saveDocument(html, outputPath) {
    // Ensure output directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write HTML file
    fs.writeFileSync(outputPath, html, 'utf8');
    
    return outputPath;
  }

  /**
   * Generate document from markdown file and save to output
   */
  processDocument(inputPath, outputPath, options = {}) {
    try {
      const html = this.generateDocument(inputPath, options);
      return this.saveDocument(html, outputPath);
    } catch (error) {
      throw new Error(`Failed to process document: ${error.message}`);
    }
  }
}

// Export for use in other modules
export {
  GallifreyDocumentGenerator,
  DOCUMENT_CLASSIFICATIONS,
  SPIRITUAL_HEADERS
};

// CLI usage example
if (require.main === module) {
  const generator = new GallifreyDocumentGenerator();
  
  // Example usage
  const inputFile = process.argv[2] || './docs/digital-savasthya-dharma-manifesto.md';
  const outputFile = process.argv[3] || './output/digital-savasthya-dharma-manifesto.html';
  
  try {
    const result = generator.processDocument(inputFile, outputFile);
    console.log(`✅ Document generated successfully: ${result}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}