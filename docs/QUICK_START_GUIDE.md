# Gallifrey Document System - Quick Start Guide

*Get up and running with Gallifrey's professional document generation system in 5 minutes*

## Installation

```bash
# Install dependencies
npm install marked commander

# Make CLI executable  
chmod +x bin/gallifrey-docs.js
```

## Basic Usage

### 1. Convert Your First Document

```bash
# Convert any Markdown file to branded HTML
node bin/gallifrey-docs.js convert your-document.md

# With custom options
node bin/gallifrey-docs.js convert your-document.md output.html \
  --classification sacred-business-dharma \
  --spiritual om-kali \
  --purpose "Your document purpose"
```

### 2. Extract Brand Assets

```bash
# Get complete brand system
node bin/gallifrey-docs.js extract-brand ./brand-assets
```

### 3. Validate Brand Compliance

```bash
# Check if document meets Gallifrey standards
node bin/gallifrey-docs.js validate your-document.html
```

## Document Types Available

| Type | Usage |
|---|---|
| `sacred-business-dharma` | Manifestos, spiritual business docs |
| `client-deliverable` | Client proposals and reports |
| `business-confidential` | Internal strategic documents |
| `technical-specification` | API docs, technical guides |

## Spiritual Headers Available

| Header | Symbol | Usage |
|---|---|---|
| `om-kali` | ॐ माता काली 🗡️ | Transformation, protection |
| `om-ganesha` | ॐ गणपतये नमः 🐘 | New beginnings, success |
| `om-shanti` | ॐ शांति शांति शांति | Peace, completion |

## Example: Convert the Manifesto

```bash
# Convert the included Digital Savasthya Dharma Manifesto
node bin/gallifrey-docs.js convert docs/digital-savasthya-dharma-manifesto.md \
  --classification sacred-business-dharma \
  --spiritual om-kali \
  --purpose "Foundation document for Digital Savasthya practice"
```

## Generated Document Features

✅ **Professional Letterhead**: Company branding and contact info  
✅ **Spiritual Headers**: Sanskrit mantras and dharmic elements  
✅ **Brand Typography**: Montserrat, Source Sans Pro, Playfair Display  
✅ **Responsive Design**: Mobile-friendly with print optimization  
✅ **Document Classification**: Professional footer with metadata  
✅ **Brand Compliance**: Consistent colors and styling throughout  

## File Structure

```
your-project/
├── lib/
│   ├── document-generator.js    # Main conversion engine
│   └── brand-style-extractor.js # Brand asset management
├── bin/
│   └── gallifrey-docs.js        # CLI interface
├── docs/
│   ├── GALLIFREY_DOCUMENT_SYSTEM.md  # Complete documentation
│   └── digital-savasthya-dharma-manifesto.md  # Example source
└── output/
    ├── your-document.html       # Generated documents
    └── brand-assets/            # Extracted brand system
```

## Need Help?

```bash
# List all available commands
node bin/gallifrey-docs.js --help

# See available document types and spiritual headers
node bin/gallifrey-docs.js list-options

# Generate complete example with all features
node bin/gallifrey-docs.js generate-example
```

---

*Ready to create authentic, professionally branded documents with dharmic integrity? Start with `node bin/gallifrey-docs.js convert your-first-document.md`*