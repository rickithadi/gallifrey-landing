import React, { useEffect, useState } from 'react';

interface SecurityBackgroundProps {
  className?: string;
}

export function SecurityBackground({ className = "" }: SecurityBackgroundProps) {
  const [scanLine, setScanLine] = useState(0);
  const [motionAllowed, setMotionAllowed] = useState(true);

  useEffect(() => {
    // Respect user's motion preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMotionAllowed(!mediaQuery.matches);
    
    const handleChange = () => setMotionAllowed(!mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!motionAllowed) return;

    const interval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 100);

    return () => clearInterval(interval);
  }, [motionAllowed]);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} style={{ zIndex: 0 }}>
      {/* Grid pattern background */}
      <div className="security-grid-pattern" />
      
      {/* Hexagon shield patterns */}
      <div className="security-hexagon-field">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="security-hexagon"
            style={{
              left: `${(i * 15) % 100}%`,
              top: `${20 + (i * 7) % 60}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Scanning line effect */}
      {motionAllowed && (
        <div 
          className="security-scan-line"
          style={{ 
            transform: `translateY(${scanLine * 10}px)`,
            opacity: Math.sin(scanLine * 0.1) * 0.3 + 0.2
          }}
        />
      )}
      
      {/* Floating defensive particles */}
      <div className="security-particle-field">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="security-floating-particle"
            style={{
              left: `${10 + (i * 12) % 80}%`,
              top: `${15 + (i * 9) % 70}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + (i % 3)}s`,
            }}
          />
        ))}
      </div>
      
      {/* Binary code rain effect (very subtle) */}
      {motionAllowed && (
        <div className="security-binary-rain">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="security-binary-column"
              style={{
                left: `${15 + i * 15}%`,
                animationDelay: `${i * 2}s`,
              }}
            >
              <span>1</span>
              <span>0</span>
              <span>1</span>
              <span>1</span>
              <span>0</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Defensive perimeter indicator */}
      <div className="security-perimeter">
        <div className="security-corner security-corner-tl" />
        <div className="security-corner security-corner-tr" />
        <div className="security-corner security-corner-bl" />
        <div className="security-corner security-corner-br" />
      </div>
      
      {/* Gradient overlay for depth */}
      <div className="security-gradient-overlay" />
    </div>
  );
}