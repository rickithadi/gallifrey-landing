import { useState, useEffect } from 'react';
import { ArrowRight, X } from 'lucide-react';

export function StickyCallToAction() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past 50% of viewport height
      const scrolled = window.scrollY;
      const threshold = window.innerHeight * 0.5;
      
      if (scrolled > threshold && !isDismissed) {
        setIsVisible(true);
      } else if (scrolled <= threshold) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-slide-in-bottom">
      <div className="bg-white border border-oyn-stone-200 rounded-xl shadow-oyn-lg p-4 backdrop-blur-sm bg-white/95">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-oyn-stone-400 hover:text-oyn-stone-600 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="pr-6">
          <p className="text-sm font-semibold text-oyn-stone-800 mb-2">
            Ready to dominate search results?
          </p>
          <p className="text-xs text-oyn-stone-600 mb-3">
            Professional websites rank first and win customers
          </p>
          <a
            href="#services"
            className="inline-flex items-center gap-2 bg-oyn-orange-600 hover:bg-oyn-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 touch-target-optimized w-full justify-center md:w-auto md:justify-start"
            onClick={() => {
              // Track CTA click
              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'click', {
                  event_category: 'CTA',
                  event_label: 'sticky_cta',
                });
              }
            }}
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 flex-shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
}