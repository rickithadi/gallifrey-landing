# Brand Colors Implementation Guide

This guide provides step-by-step instructions for implementing the Gallifrey Consulting brand colors on the Campaign/OYN branch.

## Quick Implementation Steps

### 1. Switch to Campaign/OYN Branch

```bash
git checkout Campaign/OYN
# or
git checkout campaign/oyn
```

### 2. Copy Brand Color Files

You have three options to get the brand colors into your Campaign/OYN branch:

#### Option A: Cherry-pick the documentation commit (Recommended)

```bash
# First, find the commit hash that added the brand documentation
git log --oneline | grep -i "brand\|color"

# Cherry-pick the commit (replace COMMIT_HASH with actual hash)
git cherry-pick COMMIT_HASH
```

#### Option B: Copy files manually

1. Copy the contents of `docs/BRAND_COLORS.md` from this branch
2. Copy the contents of `docs/brand-colors-implementation.css` from this branch
3. Copy the contents of `docs/tailwind-config-implementation.js` from this branch

#### Option C: Merge specific files

```bash
# Checkout specific files from the main branch
git checkout main -- docs/BRAND_COLORS.md
git checkout main -- docs/brand-colors-implementation.css
git checkout main -- docs/tailwind-config-implementation.js
```

### 3. Update Your CSS File

Replace the contents of your `styles/globals.css` file with the contents from `docs/brand-colors-implementation.css`, or merge the CSS custom properties and utility classes.

**Key sections to add/update:**

- `:root` CSS custom properties
- `.dark` theme variables
- `@layer utilities` with brand-specific classes

### 4. Update Tailwind Configuration

Replace your `tailwind.config.js` with the contents from `docs/tailwind-config-implementation.js`.

**Key sections to update:**

- `colors` object in `theme.extend`
- `fontFamily` definitions
- `borderRadius` custom properties

### 5. Verify Implementation

After implementing the changes, verify that the following classes work:

```html
<!-- Brand colors -->
<div class="bg-gallifrey-navy text-white">Navy background</div>
<div class="bg-gallifrey-teal text-white">Teal background</div>
<div class="bg-gallifrey-gray text-gallifrey-navy">Gray background</div>
<div class="bg-gallifrey-orange text-white">Orange background</div>

<!-- Semantic colors -->
<div class="bg-primary text-primary-foreground">Primary button</div>
<div class="bg-accent text-accent-foreground">Accent button</div>
<div class="bg-muted text-muted-foreground">Muted section</div>

<!-- Typography -->
<h1 class="font-heading">Heading with Montserrat</h1>
<p class="font-body">Body text with Source Sans Pro</p>
<div class="font-serif logo-serif">Logo with Playfair Display</div>

<!-- Utility classes -->
<div class="text-gradient-brand">Brand gradient text</div>
<div class="shadow-brand">Brand shadow</div>
```

## Color Reference Quick Guide

### Primary Brand Colors

- `gallifrey-navy`: #1B263B (Primary brand color)
- `gallifrey-teal`: #2EC4B6 (Accent color)
- `gallifrey-gray`: #F0F3F5 (Background/neutral)
- `gallifrey-orange`: #FF7F11 (Secondary accent)

### Semantic Colors (Light Theme)

- `primary`: #36454F (Main text, buttons)
- `accent`: #2BC4B6 (Interactive elements)
- `background`: #FFFFFF (Page background)
- `muted`: #F3F4F6 (Subtle backgrounds)

### Typography Classes

- `font-heading`: Montserrat (for headings)
- `font-body`: Source Sans Pro (for body text)
- `font-serif`: Playfair Display (for logo/elegant text)

## Testing Your Implementation

### 1. Build Test

```bash
npm run build
# or
yarn build
```

### 2. Development Server

```bash
npm run dev
# or
yarn dev
```

### 3. Visual Verification

Check that:

- [ ] Brand colors are applied correctly
- [ ] Typography fonts are loading
- [ ] Dark mode colors work (if applicable)
- [ ] Gradient text classes work
- [ ] Shadow utilities work
- [ ] All semantic colors are consistent

## Troubleshooting

### Common Issues

#### Colors not showing up

- Ensure CSS custom properties are defined in `:root`
- Check that Tailwind is processing the new color classes
- Verify the CSS file is being imported correctly

#### Fonts not loading

- Check that Google Fonts import is in your CSS
- Verify font family names match exactly
- Clear browser cache if fonts appear incorrect

#### Build errors

- Ensure all CSS syntax is valid
- Check that Tailwind config syntax is correct
- Verify all required dependencies are installed

### CSS Custom Properties Not Working

If HSL values aren't working, you can use hex values instead:

```css
:root {
  --gallifrey-navy: #1b263b;
  --gallifrey-teal: #2ec4b6;
  --gallifrey-gray: #f0f3f5;
  --gallifrey-orange: #ff7f11;
}
```

Then update Tailwind config:

```javascript
colors: {
  "gallifrey-navy": "var(--gallifrey-navy)",
  "gallifrey-teal": "var(--gallifrey-teal)",
  // ... etc
}
```

## Git Commands Summary

```bash
# Switch to Campaign/OYN branch
git checkout Campaign/OYN

# Option 1: Cherry-pick brand documentation
git cherry-pick <commit-hash>

# Option 2: Copy specific files from main branch
git checkout main -- docs/BRAND_COLORS.md
git checkout main -- docs/brand-colors-implementation.css
git checkout main -- docs/tailwind-config-implementation.js

# Commit your changes
git add .
git commit -m "Add Gallifrey brand colors implementation"

# Push to remote
git push origin Campaign/OYN
```

## Support

If you encounter any issues:

1. Check the `docs/BRAND_COLORS.md` file for complete color specifications
2. Refer to the exact CSS in `docs/brand-colors-implementation.css`
3. Use the Tailwind config from `docs/tailwind-config-implementation.js`
4. Verify all files are in the correct locations
5. Check browser developer tools for CSS loading issues

---

_Last updated: January 2025_
_For questions about implementation, refer to the complete documentation in BRAND_COLORS.md_
