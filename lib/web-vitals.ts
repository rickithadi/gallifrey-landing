import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { trackCoreWebVitals, trackPerformanceMetric } from './analytics';

// Core Web Vitals thresholds
const THRESHOLDS = {
  LCP: { good: 2500, needs_improvement: 4000 },
  INP: { good: 200, needs_improvement: 500 },
  CLS: { good: 0.1, needs_improvement: 0.25 },
  FCP: { good: 1800, needs_improvement: 3000 },
  TTFB: { good: 800, needs_improvement: 1800 },
};

// Performance rating function
function getPerformanceRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metric as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needs_improvement) return 'needs-improvement';
  return 'poor';
}

// Enhanced metric handler
function handleMetric(metric: Metric) {
  const rating = getPerformanceRating(metric.name, metric.value);
  
  // Track the metric with analytics
  trackCoreWebVitals(metric.name, metric.value, metric.id);
  
  // Log performance issues in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`${metric.name}: ${metric.value.toFixed(2)}ms (${rating})`);
    
    if (rating === 'poor') {
      console.warn(`⚠️ Poor ${metric.name} performance detected:`, {
        value: metric.value,
        threshold: THRESHOLDS[metric.name as keyof typeof THRESHOLDS],
        rating,
        id: metric.id,
        delta: metric.delta,
      });
    }
  }
  
  // Track additional context for enterprise reporting
  trackPerformanceMetric(`${metric.name.toLowerCase()}_rating`, rating === 'good' ? 1 : rating === 'needs-improvement' ? 0.5 : 0);
}

// Initialize Core Web Vitals monitoring
export function initWebVitalsMonitoring() {
  // Only run in browser environment
  if (typeof window === 'undefined') return;
  
  try {
    // Core Web Vitals
    onCLS(handleMetric);
    onINP(handleMetric);
    onLCP(handleMetric);
    
    // Additional performance metrics
    onFCP(handleMetric);
    onTTFB(handleMetric);
    
    // Track when monitoring starts
    trackPerformanceMetric('web_vitals_monitoring', 1, 'initialized');
    
  } catch (error) {
    console.warn('Failed to initialize Web Vitals monitoring:', error);
    trackPerformanceMetric('web_vitals_monitoring', 0, 'error');
  }
}

// Custom performance observer for additional metrics
export function initCustomPerformanceMonitoring() {
  if (typeof window === 'undefined' || !window.PerformanceObserver) return;
  
  try {
    // Monitor resource loading performance
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming;
          
          // Track slow resources
          if (resource.duration > 1000) {
            trackPerformanceMetric('slow_resource', resource.duration, resource.initiatorType);
          }
          
          // Track Three.js specific resources
          if (resource.name.includes('three') || resource.name.includes('fiber')) {
            trackPerformanceMetric('threejs_resource_load', resource.duration, 'library');
          }
        }
      }
    });
    
    resourceObserver.observe({ entryTypes: ['resource'] });
    
    // Monitor long tasks that block the main thread
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'longtask') {
          trackPerformanceMetric('long_task', entry.duration, 'main_thread');
          
          if (process.env.NODE_ENV === 'development') {
            console.warn('Long task detected:', {
              duration: entry.duration,
              startTime: entry.startTime,
            });
          }
        }
      }
    });
    
    if (PerformanceObserver.supportedEntryTypes?.includes('longtask')) {
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    }
    
  } catch (error) {
    console.warn('Failed to initialize custom performance monitoring:', error);
  }
}

// Enterprise performance reporting
export function generatePerformanceReport() {
  if (typeof window === 'undefined' || !window.performance) return null;
  
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (!navigation) return null;
  
  const report = {
    timestamp: new Date().toISOString(),
    page_load: {
      dns_lookup: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp_connection: navigation.connectEnd - navigation.connectStart,
      request_response: navigation.responseEnd - navigation.requestStart,
      dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.startTime,
      load_complete: navigation.loadEventEnd - navigation.startTime,
    },
    memory: 'memory' in performance ? {
      used_js_heap: (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0,
      total_js_heap: (performance as Performance & { memory?: { totalJSHeapSize: number } }).memory?.totalJSHeapSize || 0,
      js_heap_limit: (performance as Performance & { memory?: { jsHeapSizeLimit: number } }).memory?.jsHeapSizeLimit || 0,
    } : null,
    connection: 'connection' in navigator ? {
      effective_type: (navigator as Navigator & { connection?: { effectiveType?: string } }).connection?.effectiveType || 'unknown',
      downlink: (navigator as Navigator & { connection?: { downlink?: number } }).connection?.downlink || 0,
      rtt: (navigator as Navigator & { connection?: { rtt?: number } }).connection?.rtt || 0,
    } : null,
  };
  
  // Track the comprehensive report
  trackPerformanceMetric('page_load_complete', report.page_load.load_complete);
  trackPerformanceMetric('dom_content_loaded', report.page_load.dom_content_loaded);
  
  return report;
}

// Export for use in _app.tsx or layout components
export { handleMetric as webVitalsHandler };