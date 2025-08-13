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
    'cutting-edge',
    'modern'
  ], []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [containerWidth, setContainerWidth] = useState('auto');
  const measureRef = useRef<HTMLSpanElement>(null);
  const hiddenRef = useRef<HTMLDivElement>(null);

  // Measure the width of all adjectives to find the maximum
  useEffect(() => {
    if (!hiddenRef.current || !measureRef.current) return;

    // Create a hidden div to measure all adjectives
    const hiddenDiv = hiddenRef.current;
    const computedStyle = window.getComputedStyle(measureRef.current);

    // Apply the same styles to the hidden div
    hiddenDiv.style.font = computedStyle.font;
    hiddenDiv.style.fontSize = computedStyle.fontSize;
    hiddenDiv.style.fontWeight = computedStyle.fontWeight;
    hiddenDiv.style.fontStyle = computedStyle.fontStyle;
    hiddenDiv.style.fontFamily = computedStyle.fontFamily;
    hiddenDiv.style.letterSpacing = computedStyle.letterSpacing;
    hiddenDiv.style.position = 'absolute';
    hiddenDiv.style.visibility = 'hidden';
    hiddenDiv.style.whiteSpace = 'nowrap';
    hiddenDiv.style.top = '-9999px';
    hiddenDiv.style.left = '-9999px';

    // Find the maximum width among all adjectives
    let maxWidth = 0;
    adjectives.forEach(adj => {
      hiddenDiv.textContent = adj;
      const width = hiddenDiv.offsetWidth;
      if (width > maxWidth) {
        maxWidth = width;
      }
    });

    // Add some padding to ensure no clipping
    const finalWidth = maxWidth + 20;

    // Set the width based on screen size
    const isMobile = window.innerWidth < 640;
    if (isMobile) {
      // On mobile, use a minimum width to prevent too much shifting
      setContainerWidth(`${Math.max(finalWidth, 180)}px`);
    } else {
      setContainerWidth(`${finalWidth}px`);
    }

    // Clean up
    hiddenDiv.textContent = '';
  }, [adjectives]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!hiddenRef.current || !measureRef.current) return;

      const hiddenDiv = hiddenRef.current;
      const computedStyle = window.getComputedStyle(measureRef.current);

      hiddenDiv.style.font = computedStyle.font;
      hiddenDiv.style.fontSize = computedStyle.fontSize;
      hiddenDiv.style.fontWeight = computedStyle.fontWeight;
      hiddenDiv.style.fontStyle = computedStyle.fontStyle;
      hiddenDiv.style.fontFamily = computedStyle.fontFamily;

      let maxWidth = 0;
      adjectives.forEach(adj => {
        hiddenDiv.textContent = adj;
        const width = hiddenDiv.offsetWidth;
        if (width > maxWidth) {
          maxWidth = width;
        }
      });

      const finalWidth = maxWidth + 20;
      const isMobile = window.innerWidth < 640;
      setContainerWidth(isMobile ? `${Math.max(finalWidth, 180)}px` : `${finalWidth}px`);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [adjectives]);

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
  }, [adjectives.length]);

  return (
    <>
      <div ref={hiddenRef} aria-hidden="true" />
      <span
        ref={measureRef}
        className={`inline-block transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'
          } ${className}`}
        style={{
          width: containerWidth,
          display: 'inline-block',
          textAlign: 'left'
        }}
      >
        {adjectives[currentIndex]}
      </span>
    </>
  );
}
