import React, { useEffect, useMemo, useRef, useState, useLayoutEffect } from 'react';

interface AnimatedAdjectiveProps {
  className?: string;
}

export const AnimatedAdjective = React.memo(function AnimatedAdjective({ className = "" }: AnimatedAdjectiveProps) {
  const adjectives = useMemo(() => [
    { word: 'sophisticated', style: 'tracking-wide' },
    { word: 'thoughtful', style: 'tracking-normal' },
    { word: 'purposeful', style: 'tracking-wide' },
    { word: 'refined', style: 'tracking-wide' },
    { word: 'meticulous', style: 'tracking-normal' },
    { word: 'distinguished', style: 'tracking-tight' },
    { word: 'considered', style: 'tracking-normal' },
    { word: 'exceptional', style: 'tracking-normal' },
    { word: 'deliberate', style: 'tracking-normal' },
    { word: 'artful', style: 'tracking-wide' }
  ], []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [calculatedWidth, setCalculatedWidth] = useState<number | null>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const hiddenMeasureRef = useRef<HTMLSpanElement>(null);
  
  // Find the longest word to reserve space
  const longestWord = useMemo(() => {
    return adjectives.reduce((longest, current) => 
      current.word.length > longest.word.length ? current : longest
    );
  }, [adjectives]);

  // Calculate the actual rendered width of the longest word
  useLayoutEffect(() => {
    if (hiddenMeasureRef.current) {
      const width = hiddenMeasureRef.current.getBoundingClientRect().width;
      setCalculatedWidth(width);
    }
  }, [longestWord, className]);



  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === adjectives.length - 1 ? 0 : prevIndex + 1
        );
        setIsVisible(true);
      }, 600); // Executive pause for readability and authority building

    }, 6000); // Executive-paced 6 seconds for thoughtful scanning

    return () => clearInterval(interval);
  }, [adjectives.length]);

  return (
    <span className="relative inline-block">
      {/* Hidden measurement element */}
      <span 
        ref={hiddenMeasureRef}
        className={`absolute opacity-0 pointer-events-none whitespace-nowrap ${className}`}
        aria-hidden="true"
        style={{ top: '-9999px' }}
      >
        {longestWord.word}
      </span>
      
      {/* Space reservation container */}
      <span 
        className="inline-block"
        style={{ 
          width: calculatedWidth ? `${calculatedWidth}px` : 'auto',
          minWidth: calculatedWidth ? `${calculatedWidth}px` : '12ch' // Fallback
        }}
      >
        {/* Actual animated text */}
        <span
          ref={measureRef}
          className={`absolute left-0 top-0 whitespace-nowrap transition-all duration-900 ease-out ${isVisible ? 'opacity-100 translate-y-0 font-medium' : 'opacity-0 translate-y-1 font-normal'} ${adjectives[currentIndex]?.style || ''} ${className}`}
          style={{
            transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
            textShadow: isVisible ? '0 1px 2px rgba(45, 90, 135, 0.1)' : 'none',
            letterSpacing: isVisible ? '0.02em' : '-0.01em'
          }}
        >
          {adjectives[currentIndex]?.word || ''}
        </span>
      </span>
    </span>
  );
});
