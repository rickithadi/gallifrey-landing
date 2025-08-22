import { useEffect, useState, useRef, useCallback } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

interface GestureData {
  type: 'none' | 'circular' | 'swipe' | 'hold' | 'drag';
  intensity: number;
  direction?: { x: number; y: number };
  center?: { x: number; y: number };
  radius?: number;
  velocity?: { x: number; y: number };
}

interface InteractionState {
  mode: 'attract' | 'repel' | 'vortex' | 'explosion';
  isActive: boolean;
  chargeLevel: number;
}

interface UseCursorTrackingOptions {
  throttle?: number;
  disabled?: boolean;
  enableGestures?: boolean;
  enableInteractions?: boolean;
}

export function useCursorTracking(options: UseCursorTrackingOptions = {}) {
  const { throttle = 16, disabled = false, enableGestures = true, enableInteractions = true } = options;
  
  // Basic cursor state
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [velocity, setVelocity] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Advanced interaction state
  const [gesture, setGesture] = useState<GestureData>({ type: 'none', intensity: 0 });
  const [interactionState, setInteractionState] = useState<InteractionState>({
    mode: 'attract',
    isActive: false,
    chargeLevel: 0
  });
  const [trail, setTrail] = useState<CursorPosition[]>([]);
  const [clickIntensity, setClickIntensity] = useState(0);
  
  // Refs for tracking
  const throttleRef = useRef<NodeJS.Timeout>();
  const movingTimeoutRef = useRef<NodeJS.Timeout>();
  const lastPosition = useRef<CursorPosition>({ x: 0, y: 0 });
  const lastUpdate = useRef<number>(Date.now());
  const gestureHistory = useRef<CursorPosition[]>([]);
  const holdStartTime = useRef<number | null>(null);
  const chargeTimeout = useRef<NodeJS.Timeout>();

  // Mouse interaction handlers - memoized for performance
  const handleMouseDown = useCallback(() => {
    if (!enableInteractions) return;
    
    holdStartTime.current = Date.now();
    setInteractionState(prev => ({ ...prev, isActive: true }));
    
    // Start charging effect
    const startCharging = () => {
      const elapsed = Date.now() - (holdStartTime.current || Date.now());
      const chargeLevel = Math.min(elapsed / 1000, 1); // Max charge in 1 second
      
      setInteractionState(prev => ({ ...prev, chargeLevel }));
      
      if (chargeLevel < 1 && holdStartTime.current) {
        chargeTimeout.current = setTimeout(startCharging, 16);
      }
    };
    
    chargeTimeout.current = setTimeout(startCharging, 16);
  }, [enableInteractions]);

  const handleMouseUp = useCallback(() => {
    if (!enableInteractions) return;
    
    const chargeLevel = interactionState.chargeLevel;
    
    // Trigger explosion effect based on charge
    if (chargeLevel > 0.1) {
      setClickIntensity(chargeLevel);
      setTimeout(() => setClickIntensity(0), 300);
    }
    
    // Reset interaction state
    setInteractionState(prev => ({ ...prev, isActive: false, chargeLevel: 0 }));
    holdStartTime.current = null;
    
    if (chargeTimeout.current) {
      clearTimeout(chargeTimeout.current);
    }
  }, [enableInteractions, interactionState.chargeLevel]);

  const handleClick = useCallback((_event: MouseEvent) => {
    if (!enableInteractions) return;
    
    // Cycle through interaction modes on click
    setInteractionState(prev => {
      const modes: InteractionState['mode'][] = ['attract', 'repel', 'vortex', 'explosion'];
      const currentIndex = modes.indexOf(prev.mode);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      return { ...prev, mode: nextMode };
    });
  }, [enableInteractions]);
  
  const handleDoubleClick = useCallback(() => {
    if (!enableInteractions) return;
    
    // Double-click creates a burst effect
    setClickIntensity(1.5);
    setTimeout(() => setClickIntensity(0), 500);
  }, [enableInteractions]);

  // Gesture detection functions - memoized for performance
  const detectCircularGesture = useCallback((history: CursorPosition[]) => {
    if (history.length < 10) return null;
    
    const recent = history.slice(-10);
    const center = {
      x: recent.reduce((sum, p) => sum + p.x, 0) / recent.length,
      y: recent.reduce((sum, p) => sum + p.y, 0) / recent.length
    };
    
    let totalAngle = 0;
    for (let i = 1; i < recent.length - 1; i++) {
      const v1 = { x: recent[i].x - center.x, y: recent[i].y - center.y };
      const v2 = { x: recent[i+1].x - center.x, y: recent[i+1].y - center.y };
      const angle = Math.atan2(v1.x * v2.y - v1.y * v2.x, v1.x * v2.x + v1.y * v2.y);
      totalAngle += angle;
    }
    
    const avgRadius = recent.reduce((sum, p) => {
      return sum + Math.sqrt((p.x - center.x) ** 2 + (p.y - center.y) ** 2);
    }, 0) / recent.length;
    
    if (Math.abs(totalAngle) > Math.PI) {
      return {
        type: 'circular' as const,
        intensity: Math.min(Math.abs(totalAngle) / (Math.PI * 2), 1),
        center,
        radius: avgRadius,
        direction: { x: totalAngle > 0 ? 1 : -1, y: 0 }
      };
    }
    
    return null;
  }, []);
  
  const detectSwipeGesture = useCallback((history: CursorPosition[], velocity: { x: number; y: number }) => {
    const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
    if (speed > 3 && history.length >= 5) {
      const direction = {
        x: velocity.x / speed,
        y: velocity.y / speed
      };
      return {
        type: 'swipe' as const,
        intensity: Math.min(speed / 10, 1),
        direction,
        velocity
      };
    }
    return null;
  }, []);

  // Mouse move handler - memoized for performance
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const now = Date.now();
    const currentPos = { x: event.clientX, y: event.clientY };
    const deltaTime = now - lastUpdate.current;
    
    // Calculate velocity
    const newVelocity = {
      x: (currentPos.x - lastPosition.current.x) / deltaTime * 16,
      y: (currentPos.y - lastPosition.current.y) / deltaTime * 16
    };
    
    // Clear existing throttle
    if (throttleRef.current) {
      clearTimeout(throttleRef.current);
    }

    // Set moving state
    setIsMoving(true);
    
    // Clear existing moving timeout
    if (movingTimeoutRef.current) {
      clearTimeout(movingTimeoutRef.current);
    }

    // Throttle position updates
    throttleRef.current = setTimeout(() => {
      setPosition(currentPos);
      setVelocity(newVelocity);
      
      // Update trail
      setTrail(prev => {
        const newTrail = [...prev, currentPos].slice(-20);
        return newTrail;
      });
      
      // Update gesture history
      if (enableGestures) {
        gestureHistory.current = [...gestureHistory.current, currentPos].slice(-30);
        
        // Detect gestures
        const circular = detectCircularGesture(gestureHistory.current);
        const swipe = detectSwipeGesture(gestureHistory.current, newVelocity);
        
        if (circular) {
          setGesture(circular);
        } else if (swipe) {
          setGesture(swipe);
        } else {
          setGesture({ type: 'none', intensity: 0 });
        }
      }
    }, throttle);

    lastPosition.current = currentPos;
    lastUpdate.current = now;

    // Set not moving after a delay
    movingTimeoutRef.current = setTimeout(() => {
      setIsMoving(false);
      gestureHistory.current = [];
      setGesture({ type: 'none', intensity: 0 });
    }, 150);
  }, [detectCircularGesture, detectSwipeGesture, enableGestures, throttle]);

  useEffect(() => {
    if (disabled || typeof window === 'undefined') return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Check for touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });
    window.addEventListener('dblclick', handleDoubleClick, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('dblclick', handleDoubleClick);
      
      if (throttleRef.current) clearTimeout(throttleRef.current);
      if (movingTimeoutRef.current) clearTimeout(movingTimeoutRef.current);
      if (chargeTimeout.current) clearTimeout(chargeTimeout.current);
    };
  }, [disabled, handleMouseMove, handleMouseDown, handleMouseUp, handleClick, handleDoubleClick]);

  return { 
    position, 
    isMoving, 
    velocity,
    gesture,
    interactionState,
    trail,
    clickIntensity
  };
}