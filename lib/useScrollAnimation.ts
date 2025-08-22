import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollAnimation<T extends HTMLElement = HTMLElement>(
  options: UseScrollAnimationOptions = {}
) {
  const { threshold = 0.2, rootMargin = "0px", triggerOnce = true } = options;

  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion and reduced data preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const prefersReducedData = window.matchMedia(
      "(prefers-reduced-data: reduce)"
    ).matches;
    
    if (prefersReducedMotion || prefersReducedData) {
      setIsVisible(true);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            setHasAnimated(true);
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible, hasAnimated };
}

// Hook for staggered animations
export function useStaggeredAnimation<T extends HTMLElement = HTMLElement>(
  itemCount: number,
  options: UseScrollAnimationOptions = {}
) {
  const { ref, isVisible } = useScrollAnimation<T>(options);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(itemCount).fill(false)
  );

  useEffect(() => {
    if (isVisible) {
      const timeouts: NodeJS.Timeout[] = [];

      for (let i = 0; i < itemCount; i++) {
        const timeout = setTimeout(() => {
          setVisibleItems((prev) => {
            const newState = [...prev];
            newState[i] = true;
            return newState;
          });
        }, i * 100); // 100ms stagger between items

        timeouts.push(timeout);
      }

      return () => {
        timeouts.forEach(clearTimeout);
      };
    }
  }, [isVisible, itemCount]);

  return { ref, visibleItems };
}
