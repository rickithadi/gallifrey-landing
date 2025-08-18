import React, { useEffect, useMemo, useRef, useState } from 'react';

interface AnimatedAdjectiveProps {
  className?: string;
}

export function AnimatedAdjective({ className = "" }: AnimatedAdjectiveProps) {
  const adjectives = useMemo(() => [
    'secure',
    'authentic',
    'pixel-perfect',
    'trustworthy',
    'exquisite',
    'beautiful',
    'reliable',
    'thoughtful',
    'innovative',
    'modern'
  ], []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const measureRef = useRef<HTMLSpanElement>(null);
  
  // Find the longest word to reserve space
  const longestWord = useMemo(() => {
    return adjectives.reduce((longest, current) => 
      current.length > longest.length ? current : longest
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
        {longestWord}
      </span>
      
      {/* Actual animated text */}
      <span
        ref={measureRef}
        className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'} ${className}`}
      >
        {adjectives[currentIndex]}
      </span>
    </span>
  );
}
