# Gallifrey Consulting - Landing Page

A Next.js landing page implementing a dual-brand strategy for Gallifrey Consulting's main brand and "Own Your Narrative" campaign.

## 🎨 Design System

### Dual-Brand Architecture
- **Main Brand (Gallifrey)**: Professional B2B web development agency
- **Campaign Brand (Own Your Narrative)**: Digital independence for creators and families

### Brand Colors
- **Gallifrey**: #1B365D (primary), #2EC4B6 (teal accent)
- **Campaign**: Warm gradients, stone and orange color scales

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build && npm start
```

## 🧪 Testing & Quality Assurance

### Test Commands
```bash
# Run all tests
npm test

# Interactive test UI
npm run test:ui

# Visual browser testing
npm run test:headed

# Debug tests step-by-step
npm run test:debug

# Generate test reports
npm run test:report
```

### Design Review System
```bash
# Run automated design review locally
npm run design-review:local

# Run design review against production
npm run design-review
```

**Automated Checks:**
- ✅ Brand consistency validation
- ✅ Typography hierarchy
- ✅ Accessibility compliance (WCAG)
- ✅ Responsive design patterns
- ✅ SEO optimization
- ✅ Visual regression detection

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15 (Pages Router)
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Custom components + shadcn/ui foundation
- **Testing**: Playwright for E2E and visual regression
- **Analytics**: Google Analytics 4
- **SEO**: next-seo with comprehensive structured data

### Project Structure
```
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   └── figma/           # Design system components
├── pages/               # Next.js pages
├── styles/              # Global CSS and design tokens
├── lib/                 # Utilities (analytics, animations)
├── tests/               # Playwright test suites
├── scripts/             # Design review automation
└── .github/workflows/   # CI/CD and design review automation
```

## 🎯 Key Features

### SEO Optimization
- Comprehensive structured data (Organization, LocalBusiness, Service)
- Melbourne-focused local SEO
- Open Graph and Twitter Card metadata
- Performance optimization with Next.js

### Security & Performance
- Content Security Policy headers
- Image optimization (WebP/AVIF)
- Compression and caching
- Security headers (X-Frame-Options, etc.)

### Accessibility
- WCAG 2.1 AA compliance
- Proper heading hierarchy
- Form accessibility
- Screen reader optimization

## 🔄 Development Workflow

1. **Make Changes**: Edit components, pages, or styles
2. **Design Review**: `npm run design-review:local`
3. **Lint & Fix**: `npm run lint`
4. **Test Suite**: `npm test`
5. **Build Check**: `npm run build`
6. **Submit PR**: Automated design review runs

### Quality Gates
- ✅ All ESLint errors must be fixed
- ✅ Design review score ≥ 70%
- ✅ All accessibility checks pass
- ✅ No visual regressions detected
- ✅ Build succeeds

## 🤖 Automated Design Review

### GitHub Actions Integration
- Runs on PRs touching UI components
- Generates detailed HTML/JSON reports
- Posts review scores as PR comments
- Uploads artifacts for detailed analysis

### Design Standards
- Brand consistency validation
- Typography and spacing rules
- Component pattern enforcement
- Accessibility requirement checks

## 📊 Monitoring

### Analytics
- Google Analytics 4 integration
- Custom event tracking for CTAs
- Form submission tracking
- Scroll depth monitoring

### Performance
- Core Web Vitals optimization
- Lighthouse scoring
- Bundle size monitoring
- Image optimization tracking

## 🔧 Configuration

### Environment Variables
Create `.env.local`:
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id_here
```

### Design Review Configuration
See `scripts/design-review/design-standards.json` for:
- Brand color definitions
- Typography rules
- Component standards
- Validation checks

## 📝 Contributing

1. Follow the dual-brand design system
2. Run design review before submitting PRs
3. Ensure all tests pass
4. Maintain accessibility standards
5. Follow the established code style

## 🔗 Resources

- [CLAUDE.md](./CLAUDE.md) - Comprehensive development guide
- [Design Standards](./scripts/design-review/design-standards.json) - Brand specifications
- [SEO Report](./SEO_OPTIMIZATION_REPORT.md) - SEO implementation details
- [Google Analytics Guide](./docs/GOOGLE_ANALYTICS.md) - Analytics setup

---

*Powered by Next.js, Playwright, and automated design review workflows*