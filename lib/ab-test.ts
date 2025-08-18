// A/B Test utility for color variants
import { event } from './analytics';

export type ColorVariant = 'corporate-teal' | 'steel-blue-teal';

interface ColorConfig {
  name: string;
  description: string;
  teal: string;
  tealDark: string;
}

export const COLOR_VARIANTS: Record<ColorVariant, ColorConfig> = {
  'corporate-teal': {
    name: 'Deep Corporate Teal',
    description: 'Sophisticated, premium consulting feel',
    teal: '27 94 90', // #1B5E5A
    tealDark: '20 70 67', // #144643
  },
  'steel-blue-teal': {
    name: 'Steel Blue-Teal',
    description: 'Security-focused, technical competence',
    teal: '45 90 135', // #2D5A87
    tealDark: '35 70 105', // #234669
  },
};

// Get variant from URL parameter or random assignment
export function getColorVariant(): ColorVariant {
  if (typeof window === 'undefined') {
    return 'steel-blue-teal'; // Default for SSR
  }

  // Check URL parameter first (for manual testing)
  const urlParams = new URLSearchParams(window.location.search);
  const urlVariant = urlParams.get('variant') as ColorVariant;
  if (urlVariant && COLOR_VARIANTS[urlVariant]) {
    return urlVariant;
  }

  // Check localStorage for existing assignment
  const stored = localStorage.getItem('color-variant') as ColorVariant;
  if (stored && COLOR_VARIANTS[stored]) {
    return stored;
  }

  // Random assignment (50/50 split)
  const variants: ColorVariant[] = ['corporate-teal', 'steel-blue-teal'];
  const randomVariant = variants[Math.floor(Math.random() * variants.length)];
  
  // Store assignment
  localStorage.setItem('color-variant', randomVariant);
  
  return randomVariant;
}

// Apply color variant to CSS variables
export function applyColorVariant(variant: ColorVariant) {
  if (typeof document === 'undefined') return;

  const config = COLOR_VARIANTS[variant];
  const root = document.documentElement;

  root.style.setProperty('--gallifrey-teal', config.teal);
  root.style.setProperty('--gallifrey-teal-dark', config.tealDark);
}

// Track variant exposure for analytics
export function trackVariantExposure(variant: ColorVariant) {
  event({
    action: 'variant_exposure',
    category: 'ab_test',
    label: `color_variant_${variant}`,
  });
}

// Track conversion events with variant data
export function trackVariantConversion(variant: ColorVariant, action: string) {
  event({
    action: 'conversion',
    category: 'ab_test',
    label: `${variant}_${action}`,
  });
}

// Manual variant switching (for testing)
export function switchVariant(variant: ColorVariant) {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('color-variant', variant);
  applyColorVariant(variant);
  
  event({
    action: 'variant_switch',
    category: 'ab_test', 
    label: variant,
  });
}

// Get current variant info
export function getVariantInfo(variant: ColorVariant) {
  return COLOR_VARIANTS[variant];
}