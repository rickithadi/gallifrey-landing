# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build for production (includes linting)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with auto-fix
- `npm run lint:check` - Check linting without fixing

### Important Notes
- The build command automatically runs linting before building
- **CRITICAL**: All lint errors must be fixed before builds can succeed
- Always run `npm run lint` after making changes to ensure code quality
- Use `npm run lint:check` to verify code without making changes
- **Pre-commit requirement**: No code should be committed with lint errors

## Business Context & Brand Strategy

### Company Overview
Gallifrey Consulting operates a dual-brand strategy (Nike-inspired model):

**Main Brand: Gallifrey Consulting**
- Target: B2B enterprise, established businesses
- Positioning: Security-first web development, compliance-ready infrastructure
- Visual Identity: Corporate blue/gray (#1B365D), clean professional lines
- Services: Enterprise security, GDPR/CCPA compliance, performance optimization

**Sub-Brand: "Own Your Narrative" Campaign**
- Target: Small businesses, individual creators, privacy-conscious families
- Positioning: Platform independence, digital empowerment, anti-Big Tech
- Key Message: "Stop building someone else's empire. Own your digital narrative"
- Mission: Breaking free from Big Tech dependency through platform-independent solutions

### Service Packages ("Own Your Narrative")
- **Family Protection Starter** ($500): Platform-proof family memories
- **Creator Liberation** ($1,200): Escape platform prison
- **Professional Authority** ($2,500): Business continuity guarantee
- **Enterprise Digital Sovereignty** ($5,000+): Complete platform independence

### Core Messaging Framework
- **Problem**: De-platforming risk, algorithm manipulation, data exploitation
- **Solution**: Platform independence, professional security, data protection
- **Philosophy**: "Sophisticated minimalism that humanizes expertise"

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15 with Pages Router
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Custom components + shadcn/ui foundation
- **TypeScript**: Strict configuration with path mapping (@/*)
- **Analytics**: Google Analytics 4 via @next/third-parties
- **SEO**: next-seo with comprehensive structured data

### Key Directories
- `pages/` - Next.js pages (main site + Own Your Narrative campaign)
- `components/` - React components organized by feature
- `components/ui/` - shadcn/ui components (many excluded from TypeScript)
- `lib/` - Utilities (analytics, animations)
- `styles/` - Global CSS with brand color system
- `types/` - TypeScript definitions
- `public/` - Static assets and SEO files

### Design System & Branding

#### Color Schemes
The project supports two distinct brand identities:

**Gallifrey Brand (Main Site)**
- `gallifrey-white`, `gallifrey-teal`, `gallifrey-charcoal`
- Professional web development agency aesthetic
- Used in main landing page components

**Own Your Narrative Campaign**
- `oyn-stone-*`, `oyn-orange-*` color scales
- Warm espresso palette for digital sovereignty messaging
- Used in `/own-your-narrative` page

#### Typography
- **Headings**: Montserrat font family
- **Body**: Source Sans Pro
- **Logo/Serif**: Playfair Display
- Custom utilities: `.logo-serif`, `.elegant-caps`

### Component Architecture

#### Page Components
- `Hero` - Landing page hero with animated adjectives
- `Services` - Service offerings with pricing
- `Features` - Key differentiators
- `PrivacySecurity` - Security-focused messaging
- `Pricing` - Service packages
- `Contact` - Contact form with Formspree integration

#### Layout Components
- `Header` - Navigation with responsive design
- `Footer` - Site footer with links
- `AnimatedAdjective` - Cycling text animation

### Configuration Files

#### Next.js Configuration
- Image optimization for Unsplash images
- Security headers (CSP, X-Frame-Options, etc.)
- Performance optimizations (compression, CSS optimization)
- Production console removal

#### TypeScript Configuration
- Strict mode enabled
- Path mapping for clean imports (@/*)
- Many shadcn/ui components excluded from compilation

#### Tailwind Configuration
- Custom color variables using CSS custom properties
- Extended font families for brand typography
- Brand-specific utility classes

### SEO & Analytics

#### SEO Implementation
- Comprehensive structured data (Organization, LocalBusiness, Service schemas)
- Melbourne-focused local SEO optimization
- Open Graph and Twitter Card metadata
- robots.txt and sitemap.xml for search engines

#### Google Analytics
- GA4 integration via @next/third-parties
- Custom event tracking utilities in lib/analytics.ts
- Production-only loading with privacy considerations
- Environment variable: NEXT_PUBLIC_GA_MEASUREMENT_ID

### Security Considerations
- Content Security Policy headers configured
- Image optimization with security restrictions
- No sensitive data in frontend code
- GDPR-compliant analytics setup

### Campaign-Specific Features

#### Own Your Narrative
- Separate page at `/own-your-narrative`
- Distinct visual identity with warm color palette
- Digital sovereignty and creator economy messaging
- Temporarily hidden CTAs in main landing page

### Development Guidelines

#### Code Style & Quality Requirements
- Follow existing component patterns
- Use custom Tailwind utilities for brand consistency
- Maintain TypeScript strict mode compliance
- Component-based architecture with clear separation of concerns
- **MANDATORY**: Fix all ESLint errors before committing code
- **MANDATORY**: Run `npm run lint` to auto-fix issues before builds
- **Build will fail** if any lint errors remain unfixed

#### Environment Setup
- Node.js with npm package manager
- Environment variables in .env.local (not committed)
- Production builds require all linting to pass

## Testing & Quality Assurance

### Playwright Test Suite
The project includes comprehensive end-to-end testing with Playwright:

**Test Scripts:**
- `npm test` - Run all Playwright tests
- `npm run test:ui` - Run tests with Playwright UI mode
- `npm run test:headed` - Run tests in headed mode (visible browser)
- `npm run test:debug` - Debug tests step by step
- `npm run test:report` - Show HTML test report
- `npm run test:codegen` - Generate test code interactively

**Test Categories:**
- **Landing Page Tests** (`tests/landing-page.spec.ts`): Core functionality, navigation, responsive design
- **Campaign Page Tests** (`tests/own-your-narrative.spec.ts`): Campaign-specific branding, messaging, service packages
- **Contact Form Tests** (`tests/contact-form.spec.ts`): Form validation, accessibility, submission feedback
- **Visual Regression Tests** (`tests/visual-regression.spec.ts`): Dual-brand design consistency, mobile responsiveness
- **SEO Tests** (`tests/seo-structured-data.spec.ts`): Meta tags, structured data, performance, accessibility

**Test Configuration:**
- Tests run against local development server (localhost:3000)
- Cross-browser testing: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- Visual regression testing with screenshot comparison
- Accessibility testing integrated into test suites

### Design Quality Workflows
Inspired by claude-code-workflows best practices:

**Automated Design Review:**
- Visual regression tests catch design inconsistencies
- Dual-brand design validation for both Gallifrey and OYN campaigns
- Mobile responsiveness verification
- Typography and color consistency checks

**Quality Gates:**
- All tests must pass before code can be merged
- Visual regression tests prevent design drift
- SEO tests ensure search optimization remains intact
- Accessibility tests maintain WCAG compliance

## Automated Design Review System

### Design Review Sub-Agent
The project implements an automated design review system inspired by claude-code-workflows:

**Design Review Scripts:**
- `npm run design-review:local` - Run design review against local development server
- `npm run design-review` - Run design review against production URL

**Automated Checks:**
- **Brand Consistency**: Validates Gallifrey vs OYN campaign styling
- **Typography Hierarchy**: Ensures proper heading structure and font usage
- **Accessibility Compliance**: Checks WCAG standards, alt text, form labels
- **Responsive Design**: Tests mobile, tablet, desktop viewports
- **SEO Optimization**: Validates meta tags, structured data, performance
- **Visual Regression**: Screenshot comparison for design drift detection

**Design Standards File:** `scripts/design-review/design-standards.json`
- Defines color palettes for both brands
- Typography specifications (Montserrat, Source Sans Pro, Playfair Display)
- Component standards and spacing rules
- Accessibility requirements and validation checks

**Generated Reports:**
- JSON report with detailed findings and scores
- HTML report with visual summaries and screenshots
- Integrated into GitHub Actions for PR reviews

### GitHub Actions Integration
The design review workflow runs automatically on:
- Pull requests touching UI components, pages, or styles
- Pushes to main branch
- Manual workflow dispatch

**Workflow Components:**
1. **Design Review Job**: Core design validation and scoring
2. **Visual Regression Job**: Screenshot comparison tests
3. **Accessibility Audit Job**: Lighthouse and axe-core audits

**PR Integration:**
- Automatic comments with design review scores
- Artifact uploads for detailed reports
- Pass/fail indicators based on critical issues

### Development Workflow
1. **Code Changes**: Make development changes
2. **Design Review**: `npm run design-review:local` for immediate feedback
3. **Lint Check**: `npm run lint` to fix code issues
4. **Test Suite**: `npm test` to run full test suite
5. **Visual Review**: Check test report for any visual regressions
6. **Build Verification**: `npm run build` to ensure production build works
7. **PR Submission**: Automated design review runs on GitHub

### Known Exclusions
- Many shadcn/ui components are excluded from TypeScript compilation in tsconfig.json
- Some components may show TypeScript errors but are intentionally excluded
- Console.log statements are removed in production builds
- Google Analytics errors in development environment are expected and filtered out in tests