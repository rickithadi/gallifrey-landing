import { event } from './analytics';

export type LayoutVariant = 'original' | 'lightweight';

// Get layout variant from URL parameter or random assignment
export function getLayoutVariant(): LayoutVariant {
  if (typeof window === 'undefined') {
    return 'lightweight'; // Default for SSR
  }

  // Check URL parameter first (for manual testing)
  const urlParams = new URLSearchParams(window.location.search);
  const urlVariant = urlParams.get('layout_variant') as LayoutVariant;
  if (urlVariant && ['original', 'lightweight'].includes(urlVariant)) {
    return urlVariant;
  }

  // Check localStorage for existing assignment
  const stored = localStorage.getItem('layout-variant') as LayoutVariant;
  if (stored && ['original', 'lightweight'].includes(stored)) {
    return stored;
  }

  // Default to lightweight variant
  const randomVariant: LayoutVariant = 'lightweight';

  // Store assignment
  localStorage.setItem('layout-variant', randomVariant);

  return randomVariant;
}

// Track variant exposure for analytics
export function trackLayoutVariantExposure(variant: LayoutVariant) {
  event({
    action: 'variant_exposure',
    category: 'layout_ab_test',
    label: `layout_variant_${variant}`,
  });
}

// Track conversion events with variant data
export function trackLayoutVariantConversion(variant: LayoutVariant, action: string) {
  event({
    action: 'conversion',
    category: 'layout_ab_test',
    label: `${variant}_${action}`,
  });
}
