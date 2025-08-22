import React, { useEffect, useMemo, useRef, useState } from 'react';

interface AnimatedAdjectiveProps {
  className?: string;
}

export const AnimatedAdjective = React.memo(function AnimatedAdjective({ className = "" }: AnimatedAdjectiveProps) {
  const adjectives = useMemo(() => [
    { word: 'secure', style: 'tracking-wide' },
    { word: 'authentic', style: 'tracking-wider' },
    { word: 'pixel-perfect', style: 'tracking-tight' },
    { word: 'trustworthy', style: 'tracking-normal' },
    { word: 'exquisite', style: 'tracking-wide' },
    { word: 'beautiful', style: 'tracking-wider' },
    { word: 'reliable', style: 'tracking-normal' },
    { word: 'thoughtful', style: 'tracking-wide' },
    { word: 'innovative', style: 'tracking-tight' },
    { word: 'modern', style: 'tracking-wider' }
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
      }, 400); // Slightly longer pause for elegance

    }, 4000); // Change word every 4 seconds - more sophisticated pacing

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
        className={`absolute inset-0 flex items-center justify-start transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'} ${adjectives[currentIndex]?.style || ''} ${className}`}
      >
        {adjectives[currentIndex]?.word || ''}
      </span>
    </span>
  );
});
