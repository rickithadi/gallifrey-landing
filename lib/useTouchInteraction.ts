import { useEffect, useState, useRef, useCallback } from 'react';

interface TouchPosition {
  x: number;
  y: number;
  id: number;
}

interface TouchGestureData {
  type: 'none' | 'tap' | 'hold' | 'swipe' | 'pinch' | 'rotate' | 'multi-tap';
  intensity: number;
  direction?: { x: number; y: number };
  center?: { x: number; y: number };
  scale?: number;
  rotation?: number;
  touchCount: number;
  velocity?: { x: number; y: number };
}

interface TouchInteractionState {
  mode: 'attract' | 'repel' | 'vortex' | 'explosion';
  isActive: boolean;
  chargeLevel: number;
  modeTransition: number;
  lastModeChange: number;
}

interface UseTouchInteractionOptions {
  disabled?: boolean;
  enableGestures?: boolean;
  enableInteractions?: boolean;
  sensitivity?: number;
}

export function useTouchInteraction(options: UseTouchInteractionOptions = {}) {
  const { 
    disabled = false, 
    enableGestures = true, 
    enableInteractions = true,
    sensitivity = 1.0
  } = options;
  
  // Touch state
  const [touches, setTouches] = useState<TouchPosition[]>([]);
  const [gesture, setGesture] = useState<TouchGestureData>({ 
    type: 'none', 
    intensity: 0, 
    touchCount: 0 
  });
  const [interactionState, setInteractionState] = useState<TouchInteractionState>({
    mode: 'attract',
    isActive: false,
    chargeLevel: 0,
    modeTransition: 1,
    lastModeChange: 0
  });
  const [primaryTouch, setPrimaryTouch] = useState<TouchPosition | null>(null);
  const [trail, setTrail] = useState<TouchPosition[]>([]);
  const [tapIntensity, setTapIntensity] = useState(0);

  // Refs for tracking
  const touchHistory = useRef<TouchPosition[][]>([]);
  const gestureStartTime = useRef<number>(0);
  const holdTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const chargeTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const initialDistance = useRef<number>(0);
  const initialAngle = useRef<number>(0);
  const tapCount = useRef<number>(0);
  const lastTapTime = useRef<number>(0);
  const transitionTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  // Utility functions
  const getTouchDistance = useCallback((touch1: TouchPosition, touch2: TouchPosition): number => {
    return Math.sqrt(
      (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2
    );
  }, []);

  const getTouchAngle = useCallback((touch1: TouchPosition, touch2: TouchPosition): number => {
    return Math.atan2(touch2.y - touch1.y, touch2.x - touch1.x);
  }, []);

  const getTouchCenter = useCallback((touches: TouchPosition[]): TouchPosition => {
    const center = touches.reduce(
      (acc, touch) => ({ x: acc.x + touch.x, y: acc.y + touch.y, id: -1 }),
      { x: 0, y: 0, id: -1 }
    );
    return {
      x: center.x / touches.length,
      y: center.y / touches.length,
      id: -1
    };
  }, []);

  // Enhanced gesture detection
  const detectGesture = useCallback((currentTouches: TouchPosition[], history: TouchPosition[][]) => {
    const touchCount = currentTouches.length;
    const now = Date.now();

    // No touches
    if (touchCount === 0) {
      return { type: 'none' as const, intensity: 0, touchCount: 0 };
    }

    // Single touch gestures
    if (touchCount === 1) {
      const touch = currentTouches[0];
      const holdDuration = now - gestureStartTime.current;

      // Hold gesture detection
      if (holdDuration > 500) {
        const chargeLevel = Math.min((holdDuration - 500) / 1500, 1); // Max charge in 2 seconds
        return {
          type: 'hold' as const,
          intensity: chargeLevel,
          center: touch,
          touchCount
        };
      }

      // Swipe gesture detection
      if (history.length >= 3) {
        const recent = history.slice(-3);
        const startTouch = recent[0]?.[0];
        const endTouch = recent[recent.length - 1]?.[0];

        if (startTouch && endTouch) {
          const distance = getTouchDistance(startTouch, endTouch);
          const timeDelta = (recent.length - 1) * 16; // Assuming 16ms intervals
          const velocity = {
            x: (endTouch.x - startTouch.x) / timeDelta * 1000,
            y: (endTouch.y - startTouch.y) / timeDelta * 1000
          };
          const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);

          if (distance > 50 * sensitivity && speed > 200 * sensitivity) {
            const direction = {
              x: (endTouch.x - startTouch.x) / distance,
              y: (endTouch.y - startTouch.y) / distance
            };
            return {
              type: 'swipe' as const,
              intensity: Math.min(speed / 1000, 1),
              direction,
              velocity,
              center: touch,
              touchCount
            };
          }
        }
      }

      // Simple tap (when touch just started)
      if (holdDuration < 100) {
        return {
          type: 'tap' as const,
          intensity: 1,
          center: touch,
          touchCount
        };
      }
    }

    // Multi-touch gestures
    if (touchCount === 2) {
      const [touch1, touch2] = currentTouches;
      const currentDistance = getTouchDistance(touch1, touch2);
      const currentAngle = getTouchAngle(touch1, touch2);
      const center = getTouchCenter(currentTouches);

      // Initialize reference values if just started
      if (gestureStartTime.current === now || !initialDistance.current) {
        initialDistance.current = currentDistance;
        initialAngle.current = currentAngle;
      }

      const scaleChange = currentDistance / (initialDistance.current || 1);
      const rotationChange = currentAngle - (initialAngle.current || 0);

      // Pinch gesture
      if (Math.abs(scaleChange - 1) > 0.1) {
        return {
          type: 'pinch' as const,
          intensity: Math.abs(scaleChange - 1),
          scale: scaleChange,
          center,
          touchCount
        };
      }

      // Rotation gesture
      if (Math.abs(rotationChange) > Math.PI / 12) { // 15 degrees threshold
        return {
          type: 'rotate' as const,
          intensity: Math.abs(rotationChange) / Math.PI,
          rotation: rotationChange,
          center,
          touchCount
        };
      }
    }

    // Multi-tap detection
    if (touchCount >= 2 && touchCount <= 4) {
      const center = getTouchCenter(currentTouches);
      return {
        type: 'multi-tap' as const,
        intensity: touchCount / 4,
        center,
        touchCount
      };
    }

    return { type: 'none' as const, intensity: 0, touchCount };
  }, [getTouchDistance, getTouchAngle, getTouchCenter, sensitivity]);

  // Handle mode transitions
  const updateModeTransition = useCallback(() => {
    setInteractionState(prev => {
      if (prev.modeTransition < 1) {
        const newTransition = Math.min(prev.modeTransition + 0.05, 1);
        return { ...prev, modeTransition: newTransition };
      }
      return prev;
    });
  }, []);

  // Handle gesture-based mode switching
  const handleGestureMode = useCallback((gesture: TouchGestureData) => {
    const now = Date.now();
    
    // Auto-switch modes based on gesture patterns
    if (gesture.type === 'rotate' && gesture.intensity > 0.3) {
      setInteractionState(prev => ({
        ...prev,
        mode: 'vortex',
        modeTransition: 0,
        lastModeChange: now
      }));
    } else if (gesture.type === 'pinch' && gesture.scale && gesture.scale < 0.8) {
      setInteractionState(prev => ({
        ...prev,
        mode: 'repel',
        modeTransition: 0,
        lastModeChange: now
      }));
    } else if (gesture.type === 'pinch' && gesture.scale && gesture.scale > 1.2) {
      setInteractionState(prev => ({
        ...prev,
        mode: 'attract',
        modeTransition: 0,
        lastModeChange: now
      }));
    } else if (gesture.type === 'hold' && gesture.intensity > 0.5) {
      setInteractionState(prev => ({
        ...prev,
        mode: 'explosion',
        modeTransition: 0,
        lastModeChange: now
      }));
    }
  }, []);

  useEffect(() => {
    if (disabled || typeof window === 'undefined') return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Check if device supports touch
    if (!('ontouchstart' in window) && navigator.maxTouchPoints === 0) return;

    // Capture timeout refs at the start of the effect for cleanup
    const holdTimeoutRef = holdTimeout;
    const chargeTimeoutRef = chargeTimeout;
    const transitionTimeoutRef = transitionTimeout;

    const handleTouchStart = (event: TouchEvent) => {
      event.preventDefault(); // Prevent scrolling/zooming
      
      const now = Date.now();
      gestureStartTime.current = now;
      
      const newTouches: TouchPosition[] = Array.from(event.touches).map(touch => ({
        x: touch.clientX,
        y: touch.clientY,
        id: touch.identifier
      }));

      setTouches(newTouches);
      setPrimaryTouch(newTouches[0] || null);
      
      // Handle tap counting for multi-tap detection
      if (now - lastTapTime.current < 300) {
        tapCount.current += 1;
      } else {
        tapCount.current = 1;
      }
      lastTapTime.current = now;

      // Start tracking for hold gesture
      if (newTouches.length === 1) {
        setInteractionState(prev => ({ ...prev, isActive: true }));
        
        // Start charging for explosion mode
        if (interactionState.mode === 'explosion') {
          const startCharging = () => {
            const elapsed = Date.now() - gestureStartTime.current;
            const chargeLevel = Math.min(elapsed / 2000, 1); // 2 second charge time
            
            setInteractionState(prev => ({ ...prev, chargeLevel }));
            
            if (chargeLevel < 1 && gestureStartTime.current) {
              chargeTimeout.current = setTimeout(startCharging, 16);
            }
          };
          
          chargeTimeout.current = setTimeout(startCharging, 100);
        }
      }

      // Reset initial values for multi-touch gestures
      if (newTouches.length === 2) {
        initialDistance.current = getTouchDistance(newTouches[0], newTouches[1]);
        initialAngle.current = getTouchAngle(newTouches[0], newTouches[1]);
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      
      const currentTouches: TouchPosition[] = Array.from(event.touches).map(touch => ({
        x: touch.clientX,
        y: touch.clientY,
        id: touch.identifier
      }));

      setTouches(currentTouches);
      if (currentTouches.length > 0) {
        setPrimaryTouch(currentTouches[0]);
        
        // Update trail for primary touch
        setTrail(prev => {
          const newTrail = [...prev, currentTouches[0]].slice(-15);
          return newTrail;
        });
      }

      // Update touch history
      touchHistory.current.push(currentTouches);
      if (touchHistory.current.length > 20) {
        touchHistory.current.shift();
      }

      // Detect gestures
      if (enableGestures) {
        const detectedGesture = detectGesture(currentTouches, touchHistory.current);
        setGesture(detectedGesture);
        
        // Handle mode switching based on gestures
        if (enableInteractions && detectedGesture.type !== 'none') {
          handleGestureMode(detectedGesture);
        }
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const now = Date.now();
      const holdDuration = now - gestureStartTime.current;
      const chargeLevel = interactionState.chargeLevel;
      
      // Handle explosion release
      if (chargeLevel > 0.1) {
        setTapIntensity(chargeLevel);
        setTimeout(() => setTapIntensity(0), Math.min(300 + chargeLevel * 700, 1000));
      }

      // Handle tap mode cycling
      if (holdDuration < 200 && tapCount.current === 1) {
        // Single tap cycles modes
        setInteractionState(prev => {
          const modes: TouchInteractionState['mode'][] = ['attract', 'repel', 'vortex', 'explosion'];
          const currentIndex = modes.indexOf(prev.mode);
          const nextMode = modes[(currentIndex + 1) % modes.length];
          return {
            ...prev,
            mode: nextMode,
            modeTransition: 0,
            lastModeChange: now
          };
        });
      } else if (tapCount.current >= 2) {
        // Multi-tap resets to attract mode
        setInteractionState(prev => ({
          ...prev,
          mode: 'attract',
          modeTransition: 0,
          lastModeChange: now
        }));
      }

      // Reset states
      const remainingTouches: TouchPosition[] = Array.from(event.touches).map(touch => ({
        x: touch.clientX,
        y: touch.clientY,
        id: touch.identifier
      }));

      setTouches(remainingTouches);
      
      if (remainingTouches.length === 0) {
        setPrimaryTouch(null);
        setInteractionState(prev => ({ ...prev, isActive: false, chargeLevel: 0 }));
        touchHistory.current = [];
        setGesture({ type: 'none', intensity: 0, touchCount: 0 });
        
        // Clear trail after a delay
        setTimeout(() => setTrail([]), 1000);
      } else {
        setPrimaryTouch(remainingTouches[0]);
      }

      if (chargeTimeout.current) {
        clearTimeout(chargeTimeout.current);
      }
    };

    // Add event listeners with passive: false to allow preventDefault
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
      
      const holdTimeoutValue = holdTimeoutRef.current;
      const chargeTimeoutValue = chargeTimeoutRef.current;
      const transitionTimeoutValue = transitionTimeoutRef.current;
      
      if (holdTimeoutValue) clearTimeout(holdTimeoutValue);
      if (chargeTimeoutValue) clearTimeout(chargeTimeoutValue);
      if (transitionTimeoutValue) clearTimeout(transitionTimeoutValue);
    };
  }, [
    disabled, 
    enableGestures, 
    enableInteractions, 
    detectGesture, 
    handleGestureMode,
    getTouchDistance,
    getTouchAngle,
    interactionState.mode,
    interactionState.chargeLevel,
    sensitivity
  ]);

  // Handle mode transition animation
  useEffect(() => {
    if (interactionState.modeTransition < 1) {
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current);
      }
      transitionTimeout.current = setTimeout(updateModeTransition, 16);
    }
  }, [interactionState.modeTransition, updateModeTransition]);

  return {
    touches,
    primaryTouch,
    gesture,
    interactionState,
    trail,
    tapIntensity,
    isTouchDevice: typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  };
}