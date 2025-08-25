import React, { useEffect, useRef, useState } from 'react';
import { Shield, Lock, Network, Eye, Server, Zap } from 'lucide-react';

interface CursorFollowingElementsProps {
  className?: string;
}

interface FloatingElement {
  id: string;
  icon: React.ElementType;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  size: number;
  color: string;
  glow: boolean;
}

export function CursorFollowingElements({ className = '' }: CursorFollowingElementsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const elementsRef = useRef<FloatingElement[]>([]);

  // Security-themed icons that follow cursor at different speeds
  const securityIcons = useMemo(() => [
    { icon: Shield, speed: 0.05, size: 24, color: '#2D5A87' },
    { icon: Lock, speed: 0.03, size: 20, color: '#234669' },
    { icon: Network, speed: 0.08, size: 22, color: '#1F2937' },
    { icon: Eye, speed: 0.06, size: 18, color: '#6B7280' },
    { icon: Server, speed: 0.04, size: 26, color: '#2D5A87' },
    { icon: Zap, speed: 0.07, size: 20, color: '#F97316' },
  ], []);

  // Initialize floating elements
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Check for touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    // Initialize elements
    elementsRef.current = securityIcons.map((config, index) => ({
      id: `security-${index}`,
      icon: config.icon,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      targetX: Math.random() * window.innerWidth,
      targetY: Math.random() * window.innerHeight,
      speed: config.speed,
      size: config.size,
      color: config.color,
      glow: false,
    }));

    setIsVisible(true);
  }, [securityIcons]);

  // Mouse tracking
  useEffect(() => {
    if (!isVisible) return;

    let timeoutId: NodeJS.Timeout;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle mouse updates for performance
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
        
        // Update target positions for floating elements
        elementsRef.current.forEach((element) => {
          element.targetX = e.clientX + (Math.random() - 0.5) * 100;
          element.targetY = e.clientY + (Math.random() - 0.5) * 100;
          element.glow = true;
        });

        // Turn off glow after a delay
        setTimeout(() => {
          elementsRef.current.forEach((element) => {
            element.glow = false;
          });
        }, 200);
      }, 16); // ~60fps throttling
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, [isVisible]);

  // Animation loop
  useEffect(() => {
    if (!isVisible) return;

    const animate = () => {
      elementsRef.current.forEach((element) => {
        // Smooth movement towards target
        const dx = element.targetX - element.x;
        const dy = element.targetY - element.y;
        
        element.x += dx * element.speed;
        element.y += dy * element.speed;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* Security Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <svg
          width="100%"
          height="100%"
          className="security-grid"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(45, 90, 135, 0.1) 0%, transparent 50%)`
          }}
        >
          <defs>
            <pattern
              id="security-hexagon"
              x="0"
              y="0"
              width="60"
              height="52"
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points="30,0 50,15 50,37 30,52 10,37 10,15"
                fill="none"
                stroke="rgba(45, 90, 135, 0.3)"
                strokeWidth="1"
                className="security-node"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#security-hexagon)" />
        </svg>
      </div>

      {/* Floating Security Elements */}
      {elementsRef.current.map((element, index) => {
        const IconComponent = element.icon;
        return (
          <div
            key={element.id}
            className={`absolute transition-all duration-200 ${
              element.glow ? 'security-pulse' : ''
            }`}
            style={{
              left: element.x - element.size / 2,
              top: element.y - element.size / 2,
              transform: `scale(${element.glow ? 1.2 : 1})`,
              filter: element.glow ? `drop-shadow(0 0 8px ${element.color})` : 'none',
            }}
          >
            <IconComponent
              size={element.size}
              color={element.color}
              className="animate-float"
              style={{
                animationDelay: `${index * 0.5}s`,
                opacity: 0.7,
              }}
            />
          </div>
        );
      })}

      {/* Cursor Trail Effect */}
      <div
        className="absolute w-4 h-4 rounded-full bg-primary/20 cursor-glow pointer-events-none"
        style={{
          left: mousePos.x - 8,
          top: mousePos.y - 8,
          transition: 'left 0.1s ease-out, top 0.1s ease-out',
        }}
      />
    </div>
  );
}