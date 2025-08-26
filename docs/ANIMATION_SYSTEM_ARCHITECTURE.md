# Animation System Architecture

## Table of Contents

1. [System Overview](#system-overview)
2. [Component Hierarchy](#component-hierarchy)
3. [State Management](#state-management)
4. [Performance Monitoring](#performance-monitoring)
5. [Interaction Handling](#interaction-handling)
6. [Quality Management](#quality-management)
7. [Integration Points](#integration-points)
8. [API Reference](#api-reference)
9. [Performance Considerations](#performance-considerations)

## System Overview

The Gallifrey Landing Page animation system is a sophisticated, performance-optimized animation framework built on React Three Fiber. It provides a unified approach to handling complex interactive 3D animations while maintaining optimal performance across diverse device capabilities.

### Core Principles

- **Unified State Management**: Single source of truth for all animation interactions
- **Performance-First Design**: Automatic quality adjustment based on device capabilities
- **Multi-Modal Interaction**: Support for mouse, touch, and scroll interactions
- **Accessibility Compliance**: Respects user preferences like `prefers-reduced-motion`
- **Progressive Enhancement**: Graceful degradation on lower-end devices

### Architecture Components

```
┌─────────────────────────────────────────────────────────────┐
│                    HeroScene (Main Entry)                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────────────────────┐   │
│  │  Three.js Scene │  │    useUnifiedAnimation Hook    │   │
│  │  - ParticleSystem│  │  - State Aggregation           │   │
│  │  - AuroraEffect  │  │  - Performance Monitoring      │   │
│  │  - LightRays     │  │  - Quality Management          │   │
│  │  - Dynamic Lights│  │  - Interaction Coordination    │   │
│  └─────────────────┘  └─────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│           Interaction Layer (Hooks)                        │
│  ┌───────────────┐ ┌────────────────┐ ┌──────────────────┐ │
│  │ useCursor     │ │ useTouchInter  │ │ useScrollInter   │ │
│  │ Tracking      │ │ action         │ │ action           │ │
│  └───────────────┘ └────────────────┘ └──────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│           Performance Layer                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  AnimationPerformanceMonitor                          │ │
│  │  - Device Capability Detection                        │ │
│  │  - Real-time Performance Metrics                      │ │
│  │  - Quality Adjustment Recommendations                 │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

### HeroScene Component

The main entry point that orchestrates all animation elements:

```typescript
interface HeroSceneProps {
  particleCount: number;
  variant: 'original' | 'lightweight';
  mousePosition: { x: number; y: number };
  gesture?: GestureData;
  interactionState?: InteractionState;
  velocity?: { x: number; y: number };
  trail?: Array<{ x: number; y: number }>;
  clickIntensity?: number;
  scrollData?: ScrollData;
  touchData?: TouchData;
}
```

**Key Features:**
- **Dynamic Lighting System**: Cursor-following lights with intensity variations
- **Lazy Loading**: Performance-heavy components load on demand
- **Memoized Rendering**: Custom comparison function prevents unnecessary re-renders
- **Fog Effects**: Dynamic fog with variant-specific color tinting

### Three.js Sub-Components

#### ParticleSystem
- Main particle animation engine
- Handles mouse interactions and gesture responses
- Supports multiple rendering variants for performance scaling

#### AuroraEffect & LightRays
- Atmospheric background effects
- Respond to cursor position and time-based animations
- Automatically disabled on low-end devices

#### Dynamic Components (Lazy Loaded)
- **ConnectionLines**: Inter-particle connection visualization
- **ParticleCluster**: Secondary particle effects for enhanced visuals

## State Management

### Unified Animation State

The `useUnifiedAnimation` hook provides centralized state management:

```typescript
interface UnifiedAnimationState {
  cursor: CursorState;      // Mouse tracking and gestures
  scroll: ScrollState;      // Scroll position and velocity
  touch: TouchState;        // Touch interactions and gestures
  performance: PerformanceState; // Real-time metrics
  animation: AnimationState;     // Global animation config
}
```

### State Flow

```
User Interaction
       ↓
Specialized Hook (useCursorTracking, useTouchInteraction, etc.)
       ↓
useUnifiedAnimation (State Aggregation)
       ↓
Performance Monitoring & Quality Adjustment
       ↓
HeroScene Props Update
       ↓
Three.js Component Re-render
```

### Quality Tiers

The system automatically adjusts between four quality levels:

```typescript
const qualityTiers = {
  low: { particles: 50, effects: false },
  medium: { particles: 100, effects: true },
  high: { particles: 200, effects: true },
  ultra: { particles: 300, effects: true }
};
```

## Performance Monitoring

### AnimationPerformanceMonitor Class

A comprehensive performance tracking system that monitors:

- **Frame Rate**: Real-time FPS calculation with frame drop detection
- **Memory Usage**: JavaScript heap usage tracking
- **Device Capabilities**: Hardware concurrency, GPU info, screen resolution
- **Performance Budget**: Configurable thresholds for quality adjustment

### Device Tier Detection

```typescript
private calculateDeviceTier(capabilities: DeviceCapabilities): DeviceTier {
  let score = 0;
  
  // CPU cores: 8+ cores = +3, 4+ cores = +2, else +1
  // RAM: 8GB+ = +3, 4GB+ = +2, else +1  
  // Resolution: 4K+ = +3, 1080p+ = +2, else +1
  // WebGL2 support = +1
  // Mobile device = -2
  
  if (score >= 10) return 'ultra';
  if (score >= 7) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
}
```

### Performance Budget Enforcement

```typescript
const defaultBudget: PerformanceBudget = {
  targetFPS: 60,
  maxFrameTime: 16.67,     // 60fps = 16.67ms per frame
  maxMemoryUsage: 50,      // MB
  maxRenderTime: 10,       // ms
  maxInteractionLatency: 100 // ms
};
```

## Interaction Handling

### Mouse Interaction (useCursorTracking)

**Features:**
- **Position Tracking**: Throttled cursor position updates
- **Velocity Calculation**: Real-time velocity for interaction intensity
- **Gesture Detection**: Circular gestures, swipes, holds, and drags
- **Interaction Modes**: Attract, repel, vortex, and explosion effects
- **Trail System**: Visual cursor trail for enhanced feedback

**Gesture Detection Algorithm:**
```typescript
// Circular Gesture Detection
const detectCircularGesture = (history: CursorPosition[]) => {
  // Calculate center point from recent positions
  // Measure angular velocity and radius consistency
  // Return gesture data if circular motion detected
};

// Swipe Gesture Detection  
const detectSwipeGesture = (history: CursorPosition[], velocity: Vector2) => {
  // Check velocity threshold and distance
  // Calculate direction vector
  // Return swipe intensity and direction
};
```

### Touch Interaction (useTouchInteraction)

**Advanced Multi-Touch Support:**
- **Single Touch**: Tap, hold, swipe gestures
- **Two-Touch**: Pinch-to-zoom, rotation gestures
- **Multi-Touch**: Up to 4-finger interactions
- **Mode Switching**: Gesture-based animation mode changes

**Gesture-to-Mode Mapping:**
```typescript
const gestureToMode = {
  rotate: 'vortex',        // Finger rotation → vortex effect
  pinch_in: 'repel',       // Pinch inward → repel particles
  pinch_out: 'attract',    // Pinch outward → attract particles
  hold: 'explosion'        // Long press → explosion effect
};
```

### Scroll Interaction (useScrollInteraction)

**Features:**
- **Parallax Effects**: Scroll-based animation offsets
- **Velocity Tracking**: Scroll speed influences animation intensity
- **Direction Detection**: Up/down scroll direction awareness
- **Progress Calculation**: Document scroll percentage (0-1)

## Quality Management

### Automatic Quality Adjustment

The system continuously monitors performance and adjusts quality:

```typescript
const adjustQuality = (metrics: AnimationMetrics) => {
  if (frameRate < 30 || memoryUsage > maxMemoryUsage * 1.5) {
    setQuality('low');
  } else if (frameRate < 45 || memoryUsage > maxMemoryUsage) {
    setQuality('medium');
  } else if (frameRate >= targetFPS && memoryUsage < maxMemoryUsage * 0.7) {
    // Upgrade quality if performance allows
    setQuality(deviceTier === 'ultra' ? 'ultra' : 'high');
  }
};
```

### Quality Impact

| Quality Level | Particle Count | Effects | Render Distance | Update Frequency |
|--------------|----------------|---------|-----------------|------------------|
| Low          | 50 × 0.5       | ❌      | 15              | 30Hz             |
| Medium       | 100 × 1.0      | ✅      | 20              | 60Hz             |
| High         | 200 × 1.5      | ✅      | 25              | 120Hz            |
| Ultra        | 300 × 2.0      | ✅      | 25              | 120Hz            |

*Particle count is further multiplied by device tier multiplier*

## Integration Points

### Adding New Animation Components

1. **Create Component**: Extend from base Three.js component
2. **Accept Unified State**: Use standardized props interface
3. **Implement Performance Checks**: Respect quality settings
4. **Add to HeroScene**: Include with appropriate lazy loading

```typescript
// Example new component integration
const NewAnimationComponent = ({ 
  variant, 
  mousePosition, 
  time, 
  quality 
}: StandardAnimationProps) => {
  // Component implementation
  // Automatically receives unified state
};

// Add to HeroScene
{quality !== 'low' && (
  <Suspense fallback={null}>
    <NewAnimationComponent {...standardProps} />
  </Suspense>
)}
```

### Custom Interaction Hooks

```typescript
// Template for custom interaction hooks
export function useCustomInteraction(options: CustomOptions = {}) {
  const [state, setState] = useState(initialState);
  
  useEffect(() => {
    // Set up event listeners
    // Respect accessibility preferences
    // Handle cleanup
  }, []);

  return { state, handlers };
}
```

### Performance Integration

```typescript
// Performance monitoring integration
useEffect(() => {
  const handleQualityAdjust = (event: CustomEvent) => {
    // Respond to performance changes
    adjustComponentQuality(event.detail.metrics);
  };

  window.addEventListener('animation-quality-adjust', handleQualityAdjust);
  return () => window.removeEventListener('animation-quality-adjust', handleQualityAdjust);
}, []);
```

## API Reference

### useUnifiedAnimation

**Returns:**
```typescript
{
  state: UnifiedAnimationState,
  controls: {
    play: () => void,
    pause: () => void, 
    stop: () => void,
    setQuality: (quality: QualityLevel) => void,
    getPerformanceReport: () => PerformanceReport,
    resetPerformanceMetrics: () => void
  },
  scrollRef: RefObject<HTMLElement>,
  config: AnimationConfig
}
```

**Options:**
```typescript
interface UnifiedAnimationOptions {
  enablePerformanceMonitoring?: boolean;
  autoQualityAdjustment?: boolean;
  targetFPS?: number;
  maxMemoryUsage?: number;
  enableCursorTracking?: boolean;
  enableTouchInteraction?: boolean;
  enableScrollAnimation?: boolean;
  enableGestures?: boolean;
  baseParticleCount?: number;
  autoPlay?: boolean;
  enableEffects?: boolean;
  qualityTiers?: QualityTierConfig;
}
```

### useThreeAnimation

Optimized hook for Three.js components:

```typescript
const { threeState, controls } = useThreeAnimation(options);

// threeState includes pre-calculated 3D coordinates
const { mousePosition3D, time, quality, particleCount, effectsEnabled } = threeState;
```

### Performance Monitoring

```typescript
const { 
  metrics,           // Current performance metrics
  isMonitoring,      // Monitoring status
  startMonitoring,   // Start performance tracking
  stopMonitoring,    // Stop performance tracking
  getReport          // Get detailed performance report
} = useAnimationPerformance();
```

### Interaction Hooks

```typescript
// Cursor tracking
const { 
  position, isMoving, velocity, gesture, 
  interactionState, trail, clickIntensity 
} = useCursorTracking(options);

// Touch interaction
const { 
  touches, primaryTouch, gesture, interactionState, 
  trail, tapIntensity, isTouchDevice 
} = useTouchInteraction(options);

// Scroll interaction
const { 
  scrollY, scrollDirection, scrollVelocity, 
  scrollProgress, isScrolling, parallaxOffset 
} = useScrollInteraction(options);
```

## Performance Considerations

### Optimization Strategies

1. **Memoization**: All animation functions are memoized to prevent recreation
2. **Throttling**: Input events are throttled to 16ms (60fps) by default
3. **Lazy Loading**: Heavy components load on demand
4. **Quality Scaling**: Automatic reduction of complexity on low-end devices
5. **Frame Budget**: Maintains 16.67ms frame time budget for 60fps

### Memory Management

- **Trail Limiting**: Cursor/touch trails limited to 15-20 points
- **History Pruning**: Gesture history automatically pruned to last 30 positions
- **Metric Rotation**: Performance metrics limited to last 100 records
- **Cleanup**: All timeouts and event listeners properly cleaned up

### Accessibility Compliance

```typescript
// Reduced motion support
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  // Disable animations or use minimal alternatives
  return;
}
```

### Touch Device Optimization

- **Passive Events**: Uses passive event listeners where possible
- **Touch Prevention**: Prevents default touch behaviors to avoid conflicts
- **Device Detection**: Separate code paths for touch vs. mouse devices
- **Gesture Throttling**: Touch gestures are throttled for performance

### Best Practices

1. **Always check `typeof window !== 'undefined'`** before DOM operations
2. **Use passive event listeners** unless preventDefault is required
3. **Implement proper cleanup** in useEffect return functions
4. **Respect user preferences** for reduced motion and accessibility
5. **Monitor performance metrics** and adjust quality accordingly
6. **Test across device tiers** to ensure consistent experience

### Common Integration Patterns

```typescript
// Pattern 1: Component with unified state
const AnimatedComponent = () => {
  const { state } = useUnifiedAnimation();
  
  return (
    <Canvas>
      <HeroScene 
        mousePosition={state.cursor.position}
        gesture={state.cursor.gesture}
        scrollData={state.scroll}
        touchData={state.touch}
        particleCount={state.animation.particleCount}
        variant={state.performance.qualityLevel === 'minimal' ? 'lightweight' : 'original'}
      />
    </Canvas>
  );
};

// Pattern 2: Performance-aware component
const OptimizedComponent = () => {
  const { state, controls } = useUnifiedAnimation({
    autoQualityAdjustment: true,
    targetFPS: 60
  });
  
  useEffect(() => {
    if (state.performance.frameRate < 30) {
      // Take action for poor performance
      controls.setQuality('low');
    }
  }, [state.performance.frameRate]);
  
  return <AnimationComponent {...state} />;
};
```

This architecture provides a robust, scalable foundation for complex interactive animations while maintaining excellent performance across all device types.