import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCursorTracking } from './useCursorTracking';
import { useScrollAnimation } from './useScrollAnimation';
import { useAnimationPerformance } from './animation-performance';
import { useTouchInteraction } from './useTouchInteraction';
import { useScrollInteraction } from './useScrollInteraction';

/**
 * Unified Animation System
 * Centralizes all animation state management for hero components
 */

export interface UnifiedAnimationState {
  // Cursor interaction
  cursor: {
    position: { x: number; y: number };
    isMoving: boolean;
    velocity: { x: number; y: number };
    gesture: {
      type: 'none' | 'circular' | 'swipe' | 'hold' | 'drag';
      intensity: number;
      direction?: { x: number; y: number };
      center?: { x: number; y: number };
      radius?: number;
      velocity?: { x: number; y: number };
    };
    interactionState: {
      mode: 'attract' | 'repel' | 'vortex' | 'explosion';
      isActive: boolean;
      chargeLevel: number;
    };
    trail: Array<{ x: number; y: number }>;
    clickIntensity: number;
  };

  // Scroll interaction
  scroll: {
    scrollY: number;
    scrollDirection: 'up' | 'down' | 'none';
    scrollVelocity: number;
    scrollProgress: number;
    isScrolling: boolean;
    parallaxOffset: number;
    isVisible: boolean;
    hasAnimated: boolean;
  };

  // Touch interaction
  touch: {
    touches: Array<{
      id: number;
      x: number;
      y: number;
      startX: number;
      startY: number;
      startTime: number;
    }>;
    gesture: {
      type: 'none' | 'tap' | 'swipe' | 'pinch' | 'hold' | 'multi-touch';
      intensity: number;
      direction?: { x: number; y: number };
      center?: { x: number; y: number };
      scale?: number;
      rotation?: number;
      touchCount: number;
    };
    isActive: boolean;
  };

  // Performance metrics
  performance: {
    frameRate: number;
    memoryUsage: number;
    isMonitoring: boolean;
    deviceTier: 'low' | 'medium' | 'high' | 'ultra';
    qualityLevel: 'minimal' | 'reduced' | 'standard' | 'enhanced';
  };

  // Animation state
  animation: {
    globalTime: number;
    isPlaying: boolean;
    isPaused: boolean;
    quality: 'low' | 'medium' | 'high' | 'ultra';
    particleCount: number;
    effectsEnabled: boolean;
  };
}

export interface UnifiedAnimationOptions {
  // Performance options
  enablePerformanceMonitoring?: boolean;
  autoQualityAdjustment?: boolean;
  targetFPS?: number;
  maxMemoryUsage?: number;

  // Interaction options
  enableCursorTracking?: boolean;
  enableTouchInteraction?: boolean;
  enableScrollAnimation?: boolean;
  enableGestures?: boolean;

  // Animation options
  baseParticleCount?: number;
  autoPlay?: boolean;
  enableEffects?: boolean;
  qualityTiers?: {
    low: { particles: number; effects: boolean };
    medium: { particles: number; effects: boolean };
    high: { particles: number; effects: boolean };
    ultra: { particles: number; effects: boolean };
  };
}

export function useUnifiedAnimation(options: UnifiedAnimationOptions = {}) {
  const {
    enablePerformanceMonitoring = true,
    autoQualityAdjustment = true,
    targetFPS = 60,
    maxMemoryUsage = 50,
    enableCursorTracking = true,
    enableTouchInteraction = true,
    enableScrollAnimation = true,
    enableGestures = true,
    autoPlay = true,
    enableEffects = true,
    qualityTiers = {
      low: { particles: 50, effects: false },
      medium: { particles: 100, effects: true },
      high: { particles: 200, effects: true },
      ultra: { particles: 300, effects: true }
    }
  } = options;

  // Animation timing
  const globalTimeRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isPaused, setIsPaused] = useState(false);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('medium');

  // Interaction hooks
  const cursor = useCursorTracking({
    disabled: !enableCursorTracking,
    enableGestures,
    enableInteractions: true
  });

  const { ref: scrollRef, isVisible, hasAnimated } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: false
  });

  const scroll = useScrollInteraction({
    disabled: !enableScrollAnimation
  });

  const touch = useTouchInteraction({
    disabled: !enableTouchInteraction
  });

  // Performance monitoring
  const performance = useAnimationPerformance();

  // Quality management based on performance
  const adjustQuality = useCallback((metrics: { deviceCapabilities?: { tier?: string }; frameRate?: number; memoryUsage?: number }) => {
    if (!autoQualityAdjustment) return;

    const deviceTier = metrics?.deviceCapabilities?.tier || 'medium';
    const frameRate = metrics?.frameRate || 60;
    const memoryUsage = metrics?.memoryUsage || 0;

    let newQuality: 'low' | 'medium' | 'high' | 'ultra' = quality;

    // Downgrade quality if performance is poor
    if (frameRate < 30 || memoryUsage > maxMemoryUsage * 1.5) {
      newQuality = 'low';
    } else if (frameRate < 45 || memoryUsage > maxMemoryUsage) {
      newQuality = 'medium';
    } else if (frameRate >= targetFPS && memoryUsage < maxMemoryUsage * 0.7) {
      // Upgrade quality if performance is good
      if (deviceTier === 'ultra') newQuality = 'ultra';
      else if (deviceTier === 'high') newQuality = 'high';
      else newQuality = 'medium';
    }

    if (newQuality !== quality) {
      setQuality(newQuality);
    }
  }, [autoQualityAdjustment, quality, targetFPS, maxMemoryUsage]);

  // Listen for performance changes
  useEffect(() => {
    const handleQualityAdjust = (event: CustomEvent) => {
      adjustQuality(event.detail.metrics);
    };

    window.addEventListener('animation-quality-adjust', handleQualityAdjust as EventListener);
    return () => {
      window.removeEventListener('animation-quality-adjust', handleQualityAdjust as EventListener);
    };
  }, [adjustQuality]);

  // Start performance monitoring
  useEffect(() => {
    if (enablePerformanceMonitoring && isPlaying && !isPaused) {
      performance.startMonitoring();
    } else {
      performance.stopMonitoring();
    }

    return () => {
      performance.stopMonitoring();
    };
  }, [enablePerformanceMonitoring, isPlaying, isPaused, performance]);

  // Animation loop for global time
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    let animationId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      globalTimeRef.current += deltaTime;
      lastTime = currentTime;

      if (isPlaying && !isPaused) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPlaying, isPaused]);

  // Calculate dynamic values based on quality
  const animationConfig = useMemo(() => {
    const tierConfig = qualityTiers[quality];
    const deviceTier = performance.metrics?.deviceCapabilities?.tier || 'medium';
    
    // Adjust particle count based on device capabilities
    let particleMultiplier = 1;
    if (deviceTier === 'low') particleMultiplier = 0.5;
    else if (deviceTier === 'high') particleMultiplier = 1.5;
    else if (deviceTier === 'ultra') particleMultiplier = 2;

    return {
      particleCount: Math.floor(tierConfig.particles * particleMultiplier),
      effectsEnabled: tierConfig.effects && enableEffects,
      renderDistance: quality === 'low' ? 15 : quality === 'medium' ? 20 : 25,
      updateFrequency: quality === 'low' ? 30 : quality === 'medium' ? 60 : 120
    };
  }, [quality, qualityTiers, enableEffects, performance.metrics?.deviceCapabilities?.tier]);

  // Unified state object
  const state: UnifiedAnimationState = useMemo(() => ({
    cursor: {
      position: cursor.position,
      isMoving: cursor.isMoving,
      velocity: cursor.velocity,
      gesture: cursor.gesture,
      interactionState: cursor.interactionState,
      trail: cursor.trail,
      clickIntensity: cursor.clickIntensity
    },
    scroll: {
      scrollY: scroll.scrollY,
      scrollDirection: scroll.scrollDirection,
      scrollVelocity: scroll.scrollVelocity,
      scrollProgress: scroll.scrollProgress,
      isScrolling: scroll.isScrolling,
      parallaxOffset: scroll.parallaxOffset,
      isVisible,
      hasAnimated
    },
    touch: {
      touches: touch.touches,
      gesture: touch.gesture,
      isActive: touch.isActive
    },
    performance: {
      frameRate: performance.metrics?.frameRate || 0,
      memoryUsage: performance.metrics?.memoryUsage || 0,
      isMonitoring: performance.isMonitoring,
      deviceTier: performance.metrics?.deviceCapabilities?.tier || 'medium',
      qualityLevel: quality === 'low' ? 'minimal' : 
                   quality === 'medium' ? 'standard' : 
                   quality === 'high' ? 'enhanced' : 'enhanced'
    },
    animation: {
      globalTime: globalTimeRef.current,
      isPlaying,
      isPaused,
      quality,
      particleCount: animationConfig.particleCount,
      effectsEnabled: animationConfig.effectsEnabled
    }
  }), [
    cursor, scroll, touch, performance, isPlaying, isPaused, quality, 
    isVisible, hasAnimated, animationConfig
  ]);

  // Control functions
  const controls = useMemo(() => ({
    play: () => {
      setIsPlaying(true);
      setIsPaused(false);
    },
    pause: () => setIsPaused(true),
    stop: () => {
      setIsPlaying(false);
      setIsPaused(false);
      globalTimeRef.current = 0;
    },
    setQuality: (newQuality: 'low' | 'medium' | 'high' | 'ultra') => {
      setQuality(newQuality);
    },
    getPerformanceReport: performance.getReport,
    resetPerformanceMetrics: () => {
      performance.stopMonitoring();
      if (enablePerformanceMonitoring && isPlaying) {
        performance.startMonitoring();
      }
    }
  }), [performance, enablePerformanceMonitoring, isPlaying]);

  return {
    state,
    controls,
    scrollRef,
    config: animationConfig
  };
}

// Utility hook for components that only need specific parts of the animation state
export function useAnimationSlice<T extends keyof UnifiedAnimationState>(
  slice: T,
  options: UnifiedAnimationOptions = {}
): UnifiedAnimationState[T] {
  const { state } = useUnifiedAnimation(options);
  return state[slice];
}

// Performance-optimized hook for Three.js components
export function useThreeAnimation(options: UnifiedAnimationOptions = {}) {
  const animation = useUnifiedAnimation(options);
  
  // Memoize values that Three.js components care about
  const threeState = useMemo(() => ({
    mousePosition3D: {
      x: (animation.state.cursor.position.x / (typeof window !== 'undefined' ? window.innerWidth : 1920)) * 2 - 1,
      y: -(animation.state.cursor.position.y / (typeof window !== 'undefined' ? window.innerHeight : 1080)) * 2 + 1,
      z: 0
    },
    time: animation.state.animation.globalTime,
    quality: animation.state.animation.quality,
    particleCount: animation.state.animation.particleCount,
    effectsEnabled: animation.state.animation.effectsEnabled,
    isVisible: animation.state.scroll.isVisible
  }), [animation.state]);

  return {
    ...animation,
    threeState
  };
}