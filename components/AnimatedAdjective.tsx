import React, { useEffect, useState } from 'react';

interface AnimatedAdjectiveProps {
  className?: string;
}

export function AnimatedAdjective({ className = "" }: AnimatedAdjectiveProps) {
  const adjectives = [
    'secure',
    'pixel-perfect',
    'trustworthy',
    'beautiful',
    'reliable',
    'thoughtful',
    'modern'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === adjectives.length - 1 ? 0 : prevIndex + 1
        );
        setIsVisible(true);
      }, 300); // Half of fade duration

    }, 3000); // Change word every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`inline-block transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      style={{
        minWidth: '200px', // Prevents layout shift
        textAlign: 'left'
      }}
    >
      {adjectives[currentIndex]}
    </span>
  );
}
