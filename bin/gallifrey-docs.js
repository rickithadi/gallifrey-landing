#!/usr/bin/env node

/**
 * Gallifrey Consulting Document CLI
 * 
 * Command-line interface for generating branded documents
 * from Markdown files using the Gallifrey template system.
 * 
 * Usage:
 *   npx gallifrey-docs convert input.md output.html
 *   npx gallifrey-docs extract-brand ./output/brand
 *   npx gallifrey-docs validate document.html
 */

const { program } = require('commander');
const path = require('path');
const fs = require('fs');
const { GallifreyDocumentGenerator, DOCUMENT_CLASSIFICATIONS, SPIRITUAL_HEADERS } = require('../lib/document-generator');
const { BrandStyleExtractor } = require('../lib/brand-style-extractor');

// Package information
const packageJson = require('../package.json');

program
  .name('gallifrey-docs')
  .description('Gallifrey Consulting Document Generation CLI')
  .version(packageJson.version || '1.0.0');

// Convert command
program
  .command('convert <input> [output]')
  .description('Convert Markdown to branded HTML document')
  .option('-c, --classification <type>', 'Document classification', 'sacred-business-dharma')
  .option('-s, --spiritual <header>', 'Spiritual header type', 'om-kali')
  .option('-p, --purpose <text>', 'Document purpose')
  .option('-f, --prepared-for <text>', 'Prepared for field')
  .option('--closing <message>', 'Closing message')
  .action((input, output, options) => {
    try {
      // Validate input file
      if (!fs.existsSync(input)) {
        console.error(`❌ Input file not found: ${input}`);
        process.exit(1);
      }

      // Generate output filename if not provided
      if (!output) {
        const basename = path.basename(input, path.extname(input));
        output = `${basename}.html`;
      }

      // Validate classification
      if (!DOCUMENT_CLASSIFICATIONS[options.classification]) {
        console.error(`❌ Invalid classification: ${options.classification}`);
        console.error('Available classifications:', Object.keys(DOCUMENT_CLASSIFICATIONS).join(', '));
        process.exit(1);
      }

      // Validate spiritual header
      if (!SPIRITUAL_HEADERS[options.spiritual]) {
        console.error(`❌ Invalid spiritual header: ${options.spiritual}`);
        console.error('Available headers:', Object.keys(SPIRITUAL_HEADERS).join(', '));
        process.exit(1);
      }

      // Create generator and process document
      const generator = new GallifreyDocumentGenerator();
      
      const conversionOptions = {
        classification: options.classification,
        spiritualHeader: options.spiritual,
        purpose: options.purpose || 'Dharmic document generated with sacred intention',
        preparedFor: options.preparedFor || 'authentic digital liberation implementation',
        closingMessage: options.closing || 'This document serves dharmic implementation of authentic digital wellness'
      };

      const outputPath = generator.processDocument(input, output, conversionOptions);
      
      console.log('✅ Document converted successfully!');
      console.log(`📄 Input:  ${path.resolve(input)}`);
      console.log(`📄 Output: ${path.resolve(outputPath)}`);
      console.log(`📋 Classification: ${DOCUMENT_CLASSIFICATIONS[options.classification]}`);
      console.log(`🕉️ Spiritual Header: ${SPIRITUAL_HEADERS[options.spiritual]}`);

    } catch (error) {
      console.error(`❌ Conversion failed: ${error.message}`);
      process.exit(1);
    }
  });

// Extract brand assets command
program
  .command('extract-brand [output-dir]')
  .description('Extract Gallifrey brand assets (CSS, colors, fonts)')
  .action((outputDir) => {
    try {
      const extractor = new BrandStyleExtractor();
      const dir = outputDir || './gallifrey-brand-assets';
      
      const files = extractor.saveBrandAssets(dir);
      
      console.log('✅ Brand assets extracted successfully!');
      console.log(`📁 Output directory: ${path.resolve(dir)}`);
      console.log('\n📄 Generated files:');
      Object.entries(files).forEach(([type, file]) => {
        console.log(`   • ${type}: ${path.basename(file)}`);
      });

      console.log('\n🎨 Use these files to:');
      console.log('   • Import CSS into your projects');
      console.log('   • Reference color palette in design tools');
      console.log('   • Maintain brand consistency across documents');

    } catch (error) {
      console.error(`❌ Brand extraction failed: ${error.message}`);
      process.exit(1);
    }
  });

// Validate command
program
  .command('validate <file>')
  .description('Validate HTML document for brand compliance')
  .action((file) => {
    try {
      if (!fs.existsSync(file)) {
        console.error(`❌ File not found: ${file}`);
        process.exit(1);
      }

      const content = fs.readFileSync(file, 'utf8');
      const extractor = new BrandStyleExtractor();
      const validation = extractor.validateBrandCompliance(content);

      if (validation.isCompliant) {
        console.log('✅ Document is brand compliant!');
        console.log(`📄 File: ${path.resolve(file)}`);
      } else {
        console.log('⚠️  Brand compliance issues found:');
        validation.issues.forEach((issue, index) => {
          console.log(`   ${index + 1}. ${issue}`);
        });
        console.log(`📄 File: ${path.resolve(file)}`);
      }

    } catch (error) {
      console.error(`❌ Validation failed: ${error.message}`);
      process.exit(1);
    }
  });

// List available options command
program
  .command('list-options')
  .description('List available document classifications and spiritual headers')
  .action(() => {
    console.log('📋 Document Classifications:');
    Object.entries(DOCUMENT_CLASSIFICATIONS).forEach(([key, name]) => {
      console.log(`   • ${key}: ${name}`);
    });

    console.log('\n🕉️ Spiritual Headers:');
    Object.entries(SPIRITUAL_HEADERS).forEach(([key, symbol]) => {
      console.log(`   • ${key}: ${symbol}`);
    });

    console.log('\n🎨 Usage Examples:');
    console.log('   gallifrey-docs convert manifesto.md --classification sacred-business-dharma --spiritual om-kali');
    console.log('   gallifrey-docs convert report.md --classification client-deliverable --spiritual om-ganesha');
    console.log('   gallifrey-docs extract-brand ./my-brand-assets');
  });

// Example generation command
program
  .command('generate-example')
  .description('Generate example documents to demonstrate the system')
  .option('-d, --output-dir <dir>', 'Output directory for examples', './gallifrey-examples')
  .action((options) => {
    try {
      const outputDir = options.outputDir;
      
      // Create output directory
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Generate example markdown
      const exampleMarkdown = `# Digital Dharma Implementation Guide
## Sacred Technology Principles

*ॐ माता काली* 🗡️  
*Generated with Divine Intention - ${new Date().toLocaleDateString()}*

---

## Executive Summary

This document outlines the implementation of **Digital Savasthya Dharma** principles for authentic digital presence and platform independence.

### Core Principles

1. **Svarūpa** - Authentic Digital Presence
2. **Rakṣaṇa** - Divine Digital Protection
3. **Viveka** - Discriminating Digital Wisdom
4. **Sākṣin** - Conscious Digital Visibility
5. **Mokṣa** - Digital Liberation

## Service Offerings

### Individual Liberation ($1,000/month)
**The Personal Practitioner Path**:
- Monthly digital wellness assessments
- Real-time reputation monitoring
- Crisis response protocols
- Platform independence consulting

### Professional Authority ($2,500/month)
**The Professional Authority Path**:
- Executive digital protection services
- Industry authority content strategy
- Professional network reputation management
- Competitive narrative positioning

### Enterprise Protection ($10,000+/month)
**The Organizational Liberation Path**:
- Multi-stakeholder reputation monitoring
- HIPAA/SOC2 compliant infrastructure
- Executive team digital protection
- Legal compliance and regulatory support

## Implementation Phases

### Phase 1: Assessment
- Platform independence evaluation
- Digital dharma alignment analysis
- Reputation monitoring setup

### Phase 2: Strategy
- Comprehensive platform audit
- Crisis response protocol development
- Authentic narrative planning

### Phase 3: Execution
- Platform-independent infrastructure
- Content strategy implementation
- Ongoing monitoring and optimization

---

**Document Classification**: Client Deliverable  
**Generated**: ${new Date().toLocaleDateString()}  
**Purpose**: Implementation guide for Digital Savasthya services  
**Prepared**: For client onboarding and strategy development

*🕉️ This guide serves as the foundation for authentic digital liberation implementation.*`;

      // Save example markdown
      const exampleMdPath = path.join(outputDir, 'example-digital-dharma-guide.md');
      fs.writeFileSync(exampleMdPath, exampleMarkdown);

      // Convert to HTML
      const generator = new GallifreyDocumentGenerator();
      const exampleHtmlPath = path.join(outputDir, 'example-digital-dharma-guide.html');
      
      generator.processDocument(exampleMdPath, exampleHtmlPath, {
        classification: 'client-deliverable',
        spiritualHeader: 'om-kali',
        purpose: 'Implementation guide for Digital Savasthya services',
        preparedFor: 'client onboarding and strategy development',
        closingMessage: 'This guide serves as the foundation for authentic digital liberation implementation'
      });

      // Extract brand assets
      const extractor = new BrandStyleExtractor();
      const brandAssetsDir = path.join(outputDir, 'brand-assets');
      extractor.saveBrandAssets(brandAssetsDir);

      console.log('✅ Example documents generated successfully!');
      console.log(`📁 Output directory: ${path.resolve(outputDir)}`);
      console.log('\n📄 Generated files:');
      console.log('   • example-digital-dharma-guide.md (source)');
      console.log('   • example-digital-dharma-guide.html (formatted document)');
      console.log('   • brand-assets/ (complete brand system)');
      console.log('\n🎯 Next steps:');
      console.log('   1. Open the HTML file in your browser');
      console.log('   2. Review the brand assets in the brand-assets folder');
      console.log('   3. Use as template for your own documents');

    } catch (error) {
      console.error(`❌ Example generation failed: ${error.message}`);
      process.exit(1);
    }
  });

// Help command enhancement
program.on('--help', () => {
  console.log('');
  console.log('🕉️ Gallifrey Consulting Document System');
  console.log('');
  console.log('Examples:');
  console.log('  $ gallifrey-docs convert manifesto.md');
  console.log('  $ gallifrey-docs convert report.md output.html --classification client-deliverable');
  console.log('  $ gallifrey-docs extract-brand ./brand-assets');
  console.log('  $ gallifrey-docs validate document.html');
  console.log('  $ gallifrey-docs generate-example');
  console.log('');
  console.log('🎨 Document Classifications:');
  console.log('  sacred-business-dharma, client-deliverable, business-confidential,');
  console.log('  internal-strategy, public-manifesto, technical-specification');
  console.log('');
  console.log('🕉️ Spiritual Headers:');
  console.log('  om-kali, om-ganesha, om-shanti, divine-intention');
});

// Parse command line arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}