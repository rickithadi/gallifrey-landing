import React, { useEffect, useMemo, useRef, useState, useLayoutEffect } from 'react';

interface AnimatedAdjectiveProps {
  className?: string;
}

export const AnimatedAdjective = React.memo(function AnimatedAdjective({ className = "" }: AnimatedAdjectiveProps) {
  const adjectives = useMemo(() => [
    { word: 'refined', style: 'tracking-wide' },
    { word: 'precise', style: 'tracking-normal' },
    { word: 'elegant', style: 'tracking-wide' },
    { word: 'focused', style: 'tracking-normal' },
    { word: 'polished', style: 'tracking-normal' },
    { word: 'strategic', style: 'tracking-tight' },
    { word: 'crafted', style: 'tracking-normal' },
    { word: 'premium', style: 'tracking-wide' },
    { word: 'tailored', style: 'tracking-normal' },
    { word: 'artful', style: 'tracking-wide' }
  ], []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [calculatedWidth, setCalculatedWidth] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const measureRef = useRef<HTMLSpanElement>(null);
  const hiddenMeasureRef = useRef<HTMLSpanElement>(null);
  
  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Calculate width for current word (only on client)
  useLayoutEffect(() => {
    if (isMounted && hiddenMeasureRef.current) {
      const width = hiddenMeasureRef.current.getBoundingClientRect().width;
      setCalculatedWidth(width);
    }
  }, [currentIndex, className, adjectives, isMounted]);



  useEffect(() => {
    if (!isMounted) return;
    
    const interval = setInterval(() => {
      // Start fade out
      setIsVisible(false);

      setTimeout(() => {
        // Change to next word
        setCurrentIndex((prevIndex) =>
          prevIndex === adjectives.length - 1 ? 0 : prevIndex + 1
        );
        
        setTimeout(() => {
          setIsVisible(true);
        }, 100); // Small delay to ensure width is calculated
      }, 250); // Quick transition

    }, 4000); // Clean 4-second intervals

    return () => clearInterval(interval);
  }, [adjectives.length, isMounted]);

  // Render static version during SSR, animated version after mount
  if (!isMounted) {
    return (
      <span className={`${adjectives[0]?.style || ''} ${className}`}>
        {adjectives[0]?.word || 'refined'}
      </span>
    );
  }

  return (
    <span className="relative inline-block">
      {/* Hidden measurement element */}
      <span 
        ref={hiddenMeasureRef}
        className={`absolute opacity-0 pointer-events-none whitespace-nowrap ${className}`}
        aria-hidden="true"
        style={{ top: '-9999px' }}
      >
        {adjectives[currentIndex]?.word || ''}
      </span>
      
      {/* Space reservation container with proper baseline alignment */}
      <span 
        className="inline-block transition-all duration-150 ease-out relative align-baseline"
        style={{ 
          width: calculatedWidth && calculatedWidth > 0 ? `${Math.ceil(calculatedWidth)}px` : 'auto',
          minWidth: calculatedWidth && calculatedWidth > 0 ? `${Math.ceil(calculatedWidth)}px` : 'auto',
          // Remove fixed height to allow natural text flow and baseline alignment
          verticalAlign: 'baseline' // Ensure proper vertical alignment with surrounding text
        }}
      >
        {/* Actual animated text with proper baseline positioning */}
        <span
          ref={measureRef}
          className={`absolute left-0 whitespace-nowrap transition-all duration-400 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-95'} ${adjectives[currentIndex]?.style || ''} ${className}`}
          style={{
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            textShadow: isVisible ? '0 1px 3px rgba(45, 90, 135, 0.12)' : 'none',
            letterSpacing: isVisible ? '0.01em' : '0em',
            fontWeight: isVisible ? '500' : '400',
            // Use baseline alignment instead of top positioning
            bottom: '0', // Align to baseline instead of top
            transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(0.125em) scale(0.95)', // Reduce transform on desktop
            // Ensure text scales properly with parent font size
            fontSize: 'inherit',
            lineHeight: 'inherit'
          }}
        >
          {adjectives[currentIndex]?.word || ''}
        </span>
      </span>
    </span>
  );
});
