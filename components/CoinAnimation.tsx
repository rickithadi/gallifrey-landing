import { useState, useEffect, useRef } from 'react';
import { Eye, Shield, Unlock, Search, Lock, CheckCircle } from 'lucide-react';
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
  flipInterval = 4000,
  scrollTrigger = true,
  size = 'large'
}: CoinAnimationProps) {
  const [currentFace, setCurrentFace] = useState(0); // 0: SECURITY, 1: DEFENSE, 2: FREEDOM
  const [isHovered, setIsHovered] = useState(false);
  const particlesRef = useRef<HTMLDivElement>(null);
  const scrollAnimation = useScrollAnimation<HTMLDivElement>({ 
    threshold: 0.3, 
    triggerOnce: false 
  });

  const coinSize = size === 'large' ? 'security-coin-large' : 'security-coin';
  
  // Define the three faces with their content and colors
  const faces = [
    { 
      id: 'security',
      label: 'SECURITY',
      icon: Eye,
      bgColor: 'from-blue-600 to-blue-800',
      secondaryIcon: Search
    },
    { 
      id: 'defense',
      label: 'DEFENSE', 
      icon: Shield,
      bgColor: 'from-green-600 to-green-800',
      secondaryIcon: Lock
    },
    { 
      id: 'freedom',
      label: 'FREEDOM',
      icon: Unlock,
      bgColor: 'from-blue-500 via-teal-500 to-green-500',
      secondaryIcon: CheckCircle
    }
  ];

  // Auto-rotation through three faces
  useEffect(() => {
    if (!autoFlip) return;

    const interval = setInterval(() => {
      setCurrentFace(prev => (prev + 1) % 3); // Cycle through 0, 1, 2
    }, flipInterval);

    return () => clearInterval(interval);
  }, [autoFlip, flipInterval]);

  // Scroll-triggered animation
  useEffect(() => {
    if (!scrollTrigger) return;

    if (scrollAnimation.isVisible) {
      // Start the animation when visible
      setCurrentFace(1); // Start with DEFENSE
    } else {
      setCurrentFace(0); // Reset to SECURITY
    }
  }, [scrollAnimation.isVisible, scrollTrigger]);

  // Particle effect on face change
  useEffect(() => {
    if (!particlesRef.current) return;
    
    // Create particles on face change
    const particles = particlesRef.current;
    particles.innerHTML = '';
    
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'security-particle';
      particle.style.setProperty('--delay', `${i * 0.1}s`);
      particle.style.setProperty('--angle', `${i * 45}deg`);
      particles.appendChild(particle);
    }
  }, [currentFace]);

  const handleClick = () => {
    setCurrentFace(prev => (prev + 1) % 3); // Cycle to next face on click
  };

  return (
    <div ref={scrollAnimation.ref} className={`security-coin-container ${className}`}>
      {/* Scanning ring effect */}
      <div className="security-scan-ring" aria-hidden="true" />
      
      {/* Particle system */}
      <div ref={particlesRef} className="security-particles" aria-hidden="true" />
      
      <div 
        className={`${coinSize} face-${currentFace} ${isHovered ? 'hovered' : ''}`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        tabIndex={0}
        aria-label={`Security animation showing ${faces[currentFace].label}. Click to cycle through security concepts.`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {faces.map((face, index) => {
          const Icon = face.icon;
          const SecondaryIcon = face.secondaryIcon;
          
          return (
            <div 
              key={face.id}
              className={`security-coin-face security-face-${index}`}
            >
              <div className={`security-coin-content bg-gradient-to-br ${face.bgColor}`}>
                <div className="security-icon-group">
                  <Icon className="w-10 h-10 text-white" />
                  <SecondaryIcon className="w-4 h-4 text-white/80 absolute -top-1 -right-1" />
                </div>
                <span className="text-sm font-bold text-white mt-3 tracking-wider">
                  {face.label}
                </span>
                <div className="security-indicators">
                  <div className={`security-dot ${currentFace === index ? 'active' : ''}`} />
                  <div className={`security-dot ${currentFace === index ? 'active' : ''}`} />
                  <div className={`security-dot ${currentFace === index ? 'active' : ''}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Status indicator */}
      <div className="security-status">
        <div className="flex items-center gap-2 text-xs">
          {currentFace === 0 && (
            <>
              <Eye className="w-3 h-3 text-blue-500" />
              <span className="text-gallifrey-charcoal/60">Security Active</span>
            </>
          )}
          {currentFace === 1 && (
            <>
              <Shield className="w-3 h-3 text-green-500" />
              <span className="text-gallifrey-charcoal/60">Defense Active</span>
            </>
          )}
          {currentFace === 2 && (
            <>
              <Unlock className="w-3 h-3 text-teal-500" />
              <span className="text-gallifrey-charcoal/60">Freedom Active</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}