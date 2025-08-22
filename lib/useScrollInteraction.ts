import { useEffect, useState, useRef, useCallback } from 'react';

interface UseScrollInteractionOptions {
  disabled?: boolean;
  throttle?: number;
}

export function useScrollInteraction(options: UseScrollInteractionOptions = {}) {
  const { disabled = false, throttle = 16 } = options;
  
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | 'none'>('none');
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  
  const lastScrollRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const throttleRef = useRef<NodeJS.Timeout>();
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const updateScrollMetrics = useCallback(() => {
    const currentScroll = window.scrollY;
    const currentTime = Date.now();
    const timeDelta = currentTime - lastTimeRef.current;
    
    // Calculate velocity
    if (timeDelta > 0) {
      const velocity = Math.abs(currentScroll - lastScrollRef.current) / timeDelta;
      setScrollVelocity(velocity);
    }

    // Update basic scroll data
    setScrollY(currentScroll);
    
    // Determine direction
    if (currentScroll === lastScrollRef.current) {
      setScrollDirection('none');
    } else {
      setScrollDirection(currentScroll > lastScrollRef.current ? 'down' : 'up');
    }
    
    // Calculate scroll progress (0-1 based on document height)
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = documentHeight > 0 ? Math.min(currentScroll / documentHeight, 1) : 0;
    setScrollProgress(progress);
    
    // Calculate parallax offset for animations
    setParallaxOffset(currentScroll * 0.5);
    
    lastScrollRef.current = currentScroll;
    lastTimeRef.current = currentTime;
  }, []);

  useEffect(() => {
    if (disabled || typeof window === 'undefined') return;

    const handleScroll = () => {
      setIsScrolling(true);
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Clear existing throttle
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }

      // Throttle the scroll updates
      throttleRef.current = setTimeout(updateScrollMetrics, throttle);

      // Set not scrolling after a delay
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        setScrollDirection('none');
        setScrollVelocity(0);
      }, 150);
    };

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Still track basic scroll position but disable velocity/parallax
      const simpleHandleScroll = () => {
        setScrollY(window.scrollY);
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = documentHeight > 0 ? Math.min(window.scrollY / documentHeight, 1) : 0;
        setScrollProgress(progress);
      };
      
      window.addEventListener('scroll', simpleHandleScroll, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', simpleHandleScroll);
      };
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleRef.current) clearTimeout(throttleRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [disabled, throttle, updateScrollMetrics]);

  return {
    scrollY,
    scrollDirection,
    scrollVelocity,
    scrollProgress,
    isScrolling,
    parallaxOffset
  };
}