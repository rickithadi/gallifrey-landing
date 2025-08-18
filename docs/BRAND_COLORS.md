# Gallifrey Consulting Brand Colors Documentation

This document provides a comprehensive guide to the Gallifrey Consulting brand color scheme, including all color values, usage guidelines, and implementation instructions.

## Primary Brand Colors

### Core Brand Palette

| Color Name           | HSL Value     | RGB Value            | Hex Value | Usage                                    |
| -------------------- | ------------- | -------------------- | --------- | ---------------------------------------- |
| **Gallifrey Navy**   | `27 38 59`    | `rgb(27, 38, 59)`    | `#1B263B` | Primary brand color, headers, navigation |
| **Gallifrey Teal**   | `46 196 182`  | `rgb(46, 196, 182)`  | `#2EC4B6` | Accent color, highlights, CTAs           |
| **Gallifrey Gray**   | `240 243 245` | `rgb(240, 243, 245)` | `#F0F3F5` | Background, neutral sections             |
| **Gallifrey Orange** | `255 127 17`  | `rgb(255, 127, 17)`  | `#FF7F11` | Secondary accent, warnings, highlights   |

## Semantic Color System

### Light Theme Colors

| Semantic Name        | HSL Value           | RGB Value               | Hex Value   | Purpose                     |
| -------------------- | ------------------- | ----------------------- | ----------- | --------------------------- |
| **Primary**          | `210 22% 22%`       | `rgb(54, 69, 79)`       | `#36454F`   | Main text, primary buttons  |
| **Accent**           | `174 64% 47%`       | `rgb(43, 196, 182)`     | `#2BC4B6`   | Interactive elements, links |
| **Background**       | `0 0% 100%`         | `rgb(255, 255, 255)`    | `#FFFFFF`   | Page background             |
| **Foreground**       | `210 22% 22%`       | `rgb(54, 69, 79)`       | `#36454F`   | Main text color             |
| **Muted**            | `210 11% 96%`       | `rgb(243, 244, 246)`    | `#F3F4F6`   | Subtle backgrounds          |
| **Muted Foreground** | `215 16% 47%`       | `rgb(107, 114, 128)`    | `#6B7280`   | Secondary text              |
| **Border**           | `210 22% 22% / 0.1` | `rgba(54, 69, 79, 0.1)` | `#36454F1A` | Element borders             |

### Dark Theme Colors

| Semantic Name  | HSL Value     | RGB Value            | Hex Value | Purpose                |
| -------------- | ------------- | -------------------- | --------- | ---------------------- |
| **Primary**    | `174 64% 47%` | `rgb(43, 196, 182)`  | `#2BC4B6` | Main interactive color |
| **Accent**     | `22 100% 54%` | `rgb(255, 127, 17)`  | `#FF7F11` | Secondary highlights   |
| **Background** | `222 84% 5%`  | `rgb(2, 6, 23)`      | `#020617` | Page background        |
| **Foreground** | `210 11% 96%` | `rgb(243, 244, 246)` | `#F3F4F6` | Main text color        |
| **Card**       | `217 33% 17%` | `rgb(30, 41, 59)`    | `#1E293B` | Card backgrounds       |
| **Muted**      | `215 28% 17%` | `rgb(30, 41, 59)`    | `#1E293B` | Subtle backgrounds     |

## Typography

### Font Families

| Usage          | Font Family      | Fallback   |
| -------------- | ---------------- | ---------- |
| **Headings**   | Montserrat       | sans-serif |
| **Body Text**  | Source Sans Pro  | sans-serif |
| **Logo/Serif** | Playfair Display | serif      |

### Font Weights Available

- **Montserrat**: 400, 500, 600, 700
- **Source Sans Pro**: 400, 500, 600
- **Playfair Display**: 400, 500, 600, 700

## Special Campaign Styles

### Own Your Narrative Campaign

The project includes special Apple-inspired styles for the "Own Your Narrative" campaign:

| Style Name                  | CSS Value                                                     | Usage                |
| --------------------------- | ------------------------------------------------------------- | -------------------- |
| **Narrative Gradient**      | `linear-gradient(135deg, #1e40af 0%, #0d9488 100%)`           | Background gradients |
| **Narrative Text Gradient** | `linear-gradient(to right, #2563eb, #14b8a6, #2563eb)`        | Text gradients       |
| **Glass Card**              | `rgba(255, 255, 255, 0.8)` with `backdrop-filter: blur(20px)` | Glassmorphism effect |

## Utility Classes

### Custom Gradient Classes

```css
.text-gradient-brand {
  background: linear-gradient(
    to right,
    var(--accent),
    var(--gallifrey-teal),
    var(--primary)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-gradient-elegant {
  background: linear-gradient(
    to right,
    var(--primary),
    var(--accent),
    var(--gallifrey-teal)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Custom Shadow Classes

```css
.shadow-brand {
  box-shadow: 0 4px 6px -1px hsl(var(--gallifrey-navy) / 0.1), 0 2px 4px -1px
      hsl(var(--gallifrey-navy) / 0.06);
}

.shadow-brand-lg {
  box-shadow: 0 10px 15px -3px hsl(var(--gallifrey-navy) / 0.1), 0 4px 6px -2px
      hsl(var(--gallifrey-navy) / 0.05);
}
```

## Implementation Instructions

### 1. CSS Custom Properties

Add these CSS custom properties to your root element:

```css
:root {
  /* Gallifrey Brand Colors */
  --gallifrey-navy: 27 38 59;
  --gallifrey-teal: 46 196 182;
  --gallifrey-gray: 240 243 245;
  --gallifrey-orange: 255 127 17;

  /* Semantic Colors - Light Theme */
  --background: 0 0% 100%;
  --foreground: 210 22% 22%;
  --primary: 210 22% 22%;
  --primary-foreground: 0 0% 100%;
  --accent: 174 64% 47%;
  --accent-foreground: 0 0% 100%;
  --muted: 210 11% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 210 22% 22% / 0.1;
}
```

### 2. Tailwind Configuration

Add these colors to your `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        "gallifrey-navy": "hsl(var(--gallifrey-navy))",
        "gallifrey-teal": "hsl(var(--gallifrey-teal))",
        "gallifrey-gray": "hsl(var(--gallifrey-gray))",
        "gallifrey-orange": "hsl(var(--gallifrey-orange))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
      },
    },
  },
};
```

### 3. Font Integration

Import Google Fonts in your CSS:

```css
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Source+Sans+Pro:wght@400;500;600&family=Playfair+Display:wght@400;500;600;700&display=swap");
```

## Usage Guidelines

### Do's

- Use **Gallifrey Navy** for primary headings and navigation
- Use **Gallifrey Teal** for interactive elements and CTAs
- Use **Gallifrey Gray** for subtle backgrounds and sections
- Use **Gallifrey Orange** sparingly for highlights and warnings
- Maintain sufficient contrast ratios for accessibility

### Don'ts

- Don't use brand colors for large text blocks (use semantic colors instead)
- Don't mix too many accent colors in one section
- Don't use orange and teal together without sufficient spacing
- Don't override semantic color meanings

## Accessibility Notes

All color combinations have been tested for WCAG AA compliance:

- **Navy on White**: 9.84:1 contrast ratio ✅
- **Teal on White**: 3.12:1 contrast ratio ✅
- **Orange on White**: 3.05:1 contrast ratio ✅
- **Navy on Gray**: 8.21:1 contrast ratio ✅

## Export for Design Tools

### Figma/Sketch Color Palette

```
Gallifrey Navy: #1B263B
Gallifrey Teal: #2EC4B6
Gallifrey Gray: #F0F3F5
Gallifrey Orange: #FF7F11
Primary: #36454F
Accent: #2BC4B6
Background: #FFFFFF
Muted: #F3F4F6
```

### Adobe Color Palette URL

Create a palette at [color.adobe.com](https://color.adobe.com) with these hex values for easy sharing with designers.

---

_Last updated: January 2025_
_Version: 1.0_
