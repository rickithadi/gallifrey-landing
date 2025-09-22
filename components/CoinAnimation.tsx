import { useState, useEffect, useRef } from 'react';
import { Eye, Shield, Search, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useScrollAnimation } from '@/lib/useScrollAnimation';

interface CoinAnimationProps {
  className?: string;
  autoFlip?: boolean;
  flipInterval?: number;
  scrollTrigger?: boolean;
  size?: 'normal' | 'large';
}

export function CoinAnimation({ 
  className = '', 
  autoFlip = true, 
  flipInterval = 5000,
  scrollTrigger = true,
  size = 'large'
}: CoinAnimationProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const particlesRef = useRef<HTMLDivElement>(null);
  const scrollAnimation = useScrollAnimation<HTMLDivElement>({ 
    threshold: 0.3, 
    triggerOnce: false 
  });

  const coinSize = size === 'large' ? 'security-coin-large' : 'security-coin';

  // Auto-flip interval effect
  useEffect(() => {
    if (!autoFlip) return;

    const interval = setInterval(() => {
      setIsFlipped(prev => !prev);
    }, flipInterval);

    return () => clearInterval(interval);
  }, [autoFlip, flipInterval]);

  // Scroll-triggered flip effect
  useEffect(() => {
    if (!scrollTrigger) return;

    if (scrollAnimation.isVisible) {
      setIsFlipped(true);
    } else {
      setIsFlipped(false);
    }
  }, [scrollAnimation.isVisible, scrollTrigger]);

  // Particle effect on flip
  useEffect(() => {
    if (!particlesRef.current) return;
    
    // Create particles on flip
    const particles = particlesRef.current;
    particles.innerHTML = '';
    
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'security-particle';
      particle.style.setProperty('--delay', `${i * 0.1}s`);
      particle.style.setProperty('--angle', `${i * 45}deg`);
      particles.appendChild(particle);
    }
  }, [isFlipped]);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div ref={scrollAnimation.ref} className={`security-coin-container ${className}`}>
      {/* Scanning ring effect */}
      <div className="security-scan-ring" />
      
      {/* Particle system */}
      <div ref={particlesRef} className="security-particles" />
      
      <div 
        className={`${coinSize} ${isFlipped ? 'flipped' : ''} ${isHovered ? 'hovered' : ''}`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Surveillance Side */}
        <div className="security-coin-face security-coin-front">
          <div className="security-coin-content">
            <div className="security-icon-group">
              <Eye className="w-10 h-10 text-white" />
              <Search className="w-4 h-4 text-blue-300 absolute -top-1 -right-1" />
            </div>
            <span className="text-sm font-bold text-white mt-3 tracking-wide">
              SURVEILLANCE
            </span>
            <div className="security-indicators">
              <div className="security-dot active" />
              <div className="security-dot active" />
              <div className="security-dot active" />
            </div>
          </div>
          {/* Surveillance overlay effects */}
          <div className="security-overlay surveillance-overlay" />
        </div>
        
        {/* Defense Side */}
        <div className="security-coin-face security-coin-back">
          <div className="security-coin-content">
            <div className="security-icon-group">
              <Shield className="w-10 h-10 text-white" />
              <Lock className="w-4 h-4 text-green-300 absolute -top-1 -right-1" />
            </div>
            <span className="text-sm font-bold text-white mt-3 tracking-wide">
              DEFENSE
            </span>
            <div className="security-indicators">
              <div className="security-dot active" />
              <div className="security-dot active" />
              <div className="security-dot" />
            </div>
          </div>
          {/* Defense overlay effects */}
          <div className="security-overlay defense-overlay" />
        </div>
      </div>
      
      {/* Status indicator */}
      <div className="security-status">
        <div className="flex items-center gap-2 text-xs">
          {isFlipped ? (
            <>
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span className="text-gallifrey-charcoal/60">Defense Active</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              <span className="text-gallifrey-charcoal/60">Monitoring</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}