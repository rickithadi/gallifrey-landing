// Google Analytics utility functions
declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js" | "set",
      targetId: string | Date,
      config?: Record<string, string | number | boolean | undefined>
    ) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID!, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Predefined event functions for common actions
export const trackContactFormSubmit = () => {
  event({
    action: "submit",
    category: "contact",
    label: "contact_form",
  });
};

export const trackPricingClick = (plan: string) => {
  event({
    action: "click",
    category: "pricing",
    label: plan,
  });
};

export const trackCTAClick = (location: string) => {
  event({
    action: "click",
    category: "cta",
    label: location,
  });
};

export const trackNavigation = (destination: string) => {
  event({
    action: "navigate",
    category: "navigation",
    label: destination,
  });
};

export const trackScrollDepth = (percentage: number) => {
  event({
    action: "scroll",
    category: "engagement",
    label: "scroll_depth",
    value: percentage,
  });
};

// Core Web Vitals tracking
export const trackCoreWebVitals = (name: string, value: number, id?: string) => {
  event({
    action: "core_web_vital",
    category: "performance",
    label: name,
    value: Math.round(value),
  });
  
  // Also track with specific event name for detailed analysis
  event({
    action: name.toLowerCase().replace(/\s+/g, '_'),
    category: "web_vitals",
    label: id || "unknown",
    value: Math.round(value),
  });
};

// Performance metrics tracking
export const trackPerformanceMetric = (metric: string, value: number, context?: string) => {
  event({
    action: "performance_metric",
    category: "performance",
    label: `${metric}${context ? `_${context}` : ''}`,
    value: Math.round(value),
  });
};

// Three.js performance tracking
export const trackThreeJSMetrics = (fps: number, renderTime: number, mobile: boolean) => {
  event({
    action: "threejs_performance",
    category: "performance",
    label: mobile ? "mobile" : "desktop",
    value: Math.round(fps),
  });
  
  trackPerformanceMetric("threejs_render_time", renderTime, mobile ? "mobile" : "desktop");
};
