import { test, expect } from '@playwright/test';

test.describe('Formspree Integration Validation', () => {
  // Skip actual network tests in CI, just validate integration setup
  test('Formspree integrations are properly configured', async () => {
    // This test validates the integration setup without needing a running server
    
    // Check that the correct Formspree IDs are used
    const fs = require('fs');
    const path = require('path');
    
    const contactContent = fs.readFileSync(path.join(process.cwd(), 'components/Contact.tsx'), 'utf8');
    const ownYourNarrativeContent = fs.readFileSync(path.join(process.cwd(), 'components/OwnYourNarrative.tsx'), 'utf8');
    const consultativeContent = fs.readFileSync(path.join(process.cwd(), 'components/ConsultativeContact.tsx'), 'utf8');
    
    // Verify correct Formspree IDs
    expect(contactContent).toContain('mgvzdpqo');
    expect(ownYourNarrativeContent).toContain('mzzprpkq');
    expect(consultativeContent).toContain('mgvzdpqo');
    
    // Verify useForm import
    expect(contactContent).toContain('useForm');
    expect(ownYourNarrativeContent).toContain('useForm');
    expect(consultativeContent).toContain('useForm');
  });

  test('Calendly integrations use correct URLs', async () => {
    const fs = require('fs');
    const glob = require('glob');
    
    // Find all .tsx files
    const files = glob.sync('**/*.tsx', { cwd: process.cwd(), ignore: ['node_modules/**', '.next/**'] });
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      
      // If file contains Calendly URL, verify it's the correct one
      if (content.includes('calendly.com')) {
        expect(content).toContain('calendly.com/rickithadi/30min');
        expect(content).not.toContain('strategic-discovery'); // Should not contain broken URL
      }
    }
  });

  test('Forms have proper Formspree integration structure', async () => {
    const fs = require('fs');
    
    // Check Contact form structure
    const contactContent = fs.readFileSync('components/Contact.tsx', 'utf8');
    expect(contactContent).toContain('@formspree/react');
    expect(contactContent).toContain('handleSubmit');
    expect(contactContent).toContain('name="name"');
    expect(contactContent).toContain('name="email"');
    expect(contactContent).toContain('name="message"');
    expect(contactContent).toContain('Input');
    expect(contactContent).toContain('Textarea');
    
    // Check OYN form structure  
    const oynContent = fs.readFileSync('components/OwnYourNarrative.tsx', 'utf8');
    expect(oynContent).toContain('@formspree/react');
    expect(oynContent).toContain('handleFormspreeSubmit');
    expect(oynContent).toContain('FormData');
    expect(oynContent).toContain('form_type');
  });

  test('Package.json includes Formspree dependency', async () => {
    const fs = require('fs');
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    expect(packageJson.dependencies['@formspree/react']).toBeDefined();
    expect(packageJson.dependencies['@formspree/react']).toMatch(/^\^?\d+\.\d+\.\d+$/);
  });

  test('Formspree form submissions include proper metadata', async () => {
    const fs = require('fs');
    
    // Check that OYN form includes campaign metadata
    const oynContent = fs.readFileSync('components/OwnYourNarrative.tsx', 'utf8');
    expect(oynContent).toContain('Own Your Narrative Campaign');
    expect(oynContent).toContain('form_type');
    expect(oynContent).toContain('_subject');
    
    // Check that consultative form includes proper labeling
    const consultativeContent = fs.readFileSync('components/ConsultativeContact.tsx', 'utf8');
    expect(consultativeContent).toContain('FormData');
    expect(consultativeContent).toContain('append');
  });

  test('Forms handle Formspree states properly', async () => {
    const fs = require('fs');
    
    const contactContent = fs.readFileSync('components/Contact.tsx', 'utf8');
    const oynContent = fs.readFileSync('components/OwnYourNarrative.tsx', 'utf8');
    
    // Should handle submission states
    expect(contactContent).toContain('state.succeeded');
    expect(contactContent).toContain('state.submitting');
    expect(oynContent).toContain('state.succeeded');
    expect(oynContent).toContain('state.submitting');
  });

  test('Error handling is implemented', async () => {
    const fs = require('fs');
    
    const consultativeContent = fs.readFileSync('components/ConsultativeContact.tsx', 'utf8');
    
    // Should have error handling
    expect(consultativeContent).toContain('try {');
    expect(consultativeContent).toContain('catch');
    expect(consultativeContent).toContain('console.error');
  });
});