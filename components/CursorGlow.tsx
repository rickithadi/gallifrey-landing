import React, { useMemo, useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

interface CursorGlowProps {
  position: { x: number; y: number };
  mode?: 'attract' | 'repel' | 'vortex' | 'explosion';
  isActive?: boolean;
  chargeLevel?: number;
  modeTransition?: number;
  previousMode?: 'attract' | 'repel' | 'vortex' | 'explosion';
  swipeDirection?: { x: number; y: number } | null;
  dragDistance?: number;
  clickIntensity?: number;
  className?: string;
}

const CursorGlowClient = React.memo<CursorGlowProps>(function CursorGlowClient({ 
  position, 
  mode = 'attract',
  isActive = false,
  chargeLevel = 0,
  modeTransition = 1,
  previousMode,
  swipeDirection,
  dragDistance = 0,
  clickIntensity = 0,
  className = '' 
}) {
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const [rippleEffect, setRippleEffect] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    // Start animation loop for time-based effects
    let frameId: number;
    const updateTime = () => {
      setAnimationTime(Date.now());
      frameId = requestAnimationFrame(updateTime);
    };
    frameId = requestAnimationFrame(updateTime);
    
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  // Brand-accurate colors for each mode
  const modeStyles = useMemo(() => ({
    attract: {
      primary: 'rgba(45, 90, 135, 0.4)', // Gallifrey teal
      secondary: 'rgba(45, 90, 135, 0.2)',
      accent: 'rgba(35, 70, 105, 0.6)',
      shadow: '0 0 20px rgba(45, 90, 135, 0.3)'
    },
    repel: {
      primary: 'rgba(239, 68, 68, 0.4)', // Red with transparency
      secondary: 'rgba(239, 68, 68, 0.15)',
      accent: 'rgba(220, 38, 38, 0.6)',
      shadow: '0 0 25px rgba(239, 68, 68, 0.4)'
    },
    vortex: {
      primary: 'rgba(147, 51, 234, 0.4)', // Purple
      secondary: 'rgba(147, 51, 234, 0.15)',
      accent: 'rgba(126, 34, 206, 0.6)',
      shadow: '0 0 30px rgba(147, 51, 234, 0.4)'
    },
    explosion: {
      primary: 'rgba(184, 134, 11, 0.5)', // OYN orange-600
      secondary: 'rgba(184, 134, 11, 0.2)',
      accent: 'rgba(205, 133, 63, 0.7)', // OYN orange-700
      shadow: '0 0 35px rgba(184, 134, 11, 0.5)'
    }
  }), []);

  const currentStyle = modeStyles[mode];
  const previousStyle = previousMode ? modeStyles[previousMode] : currentStyle;

  // Smooth color transitions during mode changes
  const interpolatedStyle = useMemo(() => {
    if (modeTransition >= 1 || !previousMode) {
      return currentStyle;
    }

    // Linear interpolation between previous and current colors
    const lerp = (a: string, b: string, t: number) => {
      // Simple color interpolation (would need more sophisticated parsing for production)
      return t < 0.5 ? a : b;
    };

    return {
      primary: lerp(previousStyle.primary, currentStyle.primary, modeTransition),
      secondary: lerp(previousStyle.secondary, currentStyle.secondary, modeTransition),
      accent: lerp(previousStyle.accent, currentStyle.accent, modeTransition),
      shadow: lerp(previousStyle.shadow, currentStyle.shadow, modeTransition)
    };
  }, [currentStyle, previousStyle, modeTransition, previousMode]);

  // Trigger pulse animation on mode change - memoized callback
  const triggerPulseAnimation = useCallback(() => {
    setPulseAnimation(true);
    const timer = setTimeout(() => setPulseAnimation(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Trigger ripple effect on high click intensity - memoized callback
  const triggerRippleEffect = useCallback(() => {
    setRippleEffect(true);
    const timer = setTimeout(() => setRippleEffect(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (modeTransition < 1) {
      return triggerPulseAnimation();
    }
  }, [modeTransition, triggerPulseAnimation]);

  useEffect(() => {
    if (clickIntensity > 0.5) {
      return triggerRippleEffect();
    }
  }, [clickIntensity, triggerRippleEffect]);

  // Memoize dynamic sizing and styling calculations for performance
  const sizeAndStyle = useMemo(() => {
    const baseSize = 32;
    const chargeMultiplier = mode === 'explosion' ? 1 + chargeLevel * 2 : 1;
    const activeMultiplier = isActive ? 1.2 : 1;
    const clickMultiplier = 1 + clickIntensity * 1.5;
    const dragMultiplier = dragDistance > 0 ? 1 + Math.min(dragDistance / 100, 0.8) : 1;
    
    const finalSize = baseSize * chargeMultiplier * activeMultiplier * clickMultiplier * dragMultiplier;

    // Rotation based on swipe direction
    const rotation = swipeDirection ? 
      Math.atan2(swipeDirection.y, swipeDirection.x) * (180 / Math.PI) : 0;

    // Dynamic opacity based on charge level and activity
    const baseOpacity = 0.6;
    const chargeOpacity = mode === 'explosion' ? chargeLevel * 0.4 : 0;
    const activeOpacity = isActive ? 0.2 : 0;
    const finalOpacity = Math.min(baseOpacity + chargeOpacity + activeOpacity, 1);

    return { finalSize, rotation, finalOpacity };
  }, [mode, chargeLevel, isActive, clickIntensity, dragDistance, swipeDirection]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <>
      {/* Main cursor glow */}
      <div
        className={`fixed pointer-events-none z-0 rounded-full transition-all duration-300 ease-out ${className}`}
        style={{
          left: position.x - sizeAndStyle.finalSize / 2,
          top: position.y - sizeAndStyle.finalSize / 2,
          width: sizeAndStyle.finalSize,
          height: sizeAndStyle.finalSize,
          backgroundColor: interpolatedStyle.primary,
          boxShadow: interpolatedStyle.shadow,
          opacity: sizeAndStyle.finalOpacity,
          transform: `rotate(${sizeAndStyle.rotation}deg) ${pulseAnimation ? 'scale(1.4)' : 'scale(1)'} ${isActive ? 'scale(1.1)' : ''}`,
          transition: pulseAnimation ? 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'transform 0.3s ease-out'
        }}
        aria-hidden="true"
      />

      {/* Secondary glow ring for enhanced depth */}
      <div
        className="fixed pointer-events-none z-0 rounded-full"
        style={{
          left: position.x - (sizeAndStyle.finalSize * 1.8) / 2,
          top: position.y - (sizeAndStyle.finalSize * 1.8) / 2,
          width: sizeAndStyle.finalSize * 1.8,
          height: sizeAndStyle.finalSize * 1.8,
          backgroundColor: interpolatedStyle.secondary,
          opacity: sizeAndStyle.finalOpacity * 0.5,
          transform: `scale(${isActive ? 1.2 : 1})`,
          transition: 'all 0.4s ease-out'
        }}
        aria-hidden="true"
      />

      {/* Charge indicator for explosion mode */}
      {mode === 'explosion' && chargeLevel > 0 && (
        <div
          className="fixed pointer-events-none z-0 rounded-full border-2"
          style={{
            left: position.x - (sizeAndStyle.finalSize * 2.5) / 2,
            top: position.y - (sizeAndStyle.finalSize * 2.5) / 2,
            width: sizeAndStyle.finalSize * 2.5,
            height: sizeAndStyle.finalSize * 2.5,
            borderColor: interpolatedStyle.accent,
            opacity: chargeLevel * 0.8,
            transform: `scale(${1 + chargeLevel * 0.5}) rotate(${animationTime / 50}deg)`,
            transition: 'all 0.1s ease-out',
            background: `conic-gradient(from 0deg, transparent, ${interpolatedStyle.accent} ${chargeLevel * 360}deg, transparent)`
          }}
          aria-hidden="true"
        />
      )}

      {/* Vortex spiral effect */}
      {mode === 'vortex' && isActive && (
        <div
          className="fixed pointer-events-none z-0 rounded-full"
          style={{
            left: position.x - (sizeAndStyle.finalSize * 3) / 2,
            top: position.y - (sizeAndStyle.finalSize * 3) / 2,
            width: sizeAndStyle.finalSize * 3,
            height: sizeAndStyle.finalSize * 3,
            background: `conic-gradient(from 0deg, transparent, ${interpolatedStyle.accent} 60deg, transparent 120deg, ${interpolatedStyle.accent} 180deg, transparent 240deg, ${interpolatedStyle.accent} 300deg, transparent)`,
            opacity: 0.4,
            transform: `rotate(${animationTime / 20}deg)`,
            animation: 'spin 2s linear infinite'
          }}
          aria-hidden="true"
        />
      )}

      {/* Ripple effect for high-intensity interactions */}
      {rippleEffect && (
        <div
          className="fixed pointer-events-none z-0 rounded-full border-2"
          style={{
            left: position.x - (sizeAndStyle.finalSize * 4) / 2,
            top: position.y - (sizeAndStyle.finalSize * 4) / 2,
            width: sizeAndStyle.finalSize * 4,
            height: sizeAndStyle.finalSize * 4,
            borderColor: interpolatedStyle.accent,
            opacity: 0.6,
            transform: 'scale(1)',
            animation: 'ripple 0.8s ease-out forwards'
          }}
          aria-hidden="true"
        />
      )}

      {/* Directional indicator for swipes */}
      {swipeDirection && (
        <div
          className="fixed pointer-events-none z-0"
          style={{
            left: position.x - 2,
            top: position.y - 20,
            width: 4,
            height: 40,
            backgroundColor: interpolatedStyle.accent,
            opacity: 0.8,
            transform: `rotate(${sizeAndStyle.rotation}deg)`,
            borderRadius: '2px',
            transition: 'all 0.3s ease-out'
          }}
          aria-hidden="true"
        />
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
});

// Export as dynamic component to prevent SSR issues
export const CursorGlow = dynamic(() => Promise.resolve(CursorGlowClient), { 
  ssr: false 
});