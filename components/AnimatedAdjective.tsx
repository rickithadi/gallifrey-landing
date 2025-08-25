import React, { useEffect, useMemo, useRef, useState } from 'react';

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
  const measureRef = useRef<HTMLSpanElement>(null);
  
  // Find the longest word to reserve space
  const longestWord = useMemo(() => {
    return adjectives.reduce((longest, current) => 
      current.word.length > longest.word.length ? current : longest
    );
  }, [adjectives]);



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
      {/* Invisible placeholder to reserve space */}
      <span 
        className={`invisible ${className}`}
        aria-hidden="true"
      >
        {longestWord.word}
      </span>
      
      {/* Actual animated text */}
      <span
        ref={measureRef}
        className={`absolute inset-0 flex items-center justify-start transition-all duration-900 ease-out ${isVisible ? 'opacity-100 translate-y-0 font-medium' : 'opacity-0 translate-y-1 font-normal'} ${adjectives[currentIndex]?.style || ''} ${className}`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)', // Executive confidence curve
          textShadow: isVisible ? '0 1px 2px rgba(45, 90, 135, 0.1)' : 'none', // Subtle authority shadow
          letterSpacing: isVisible ? '0.02em' : '-0.01em' // Authority spacing
        }}
      >
        {adjectives[currentIndex]?.word || ''}
      </span>
    </span>
  );
});
