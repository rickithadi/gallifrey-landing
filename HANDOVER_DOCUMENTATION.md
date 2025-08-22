# Handover Documentation - Three.js Hero Performance Optimization
## Multi-Agent Parallel Optimization Strategy

## Session Summary
**Date**: 2025-08-22
**Primary Focus**: Three.js hero section enhancement and performance optimization for Gallifrey Consulting website
**Current Status**: Three.js particle system implemented with advanced interactions, needs performance optimization
**Methodology**: USING MULTIPLE SUB-AGENTS FOR PARALLEL OPTIMIZATION

## Critical Instruction: USE MULTIPLE SUB-AGENTS
⚠️ **IMPORTANT**: The user specifically requested using multiple sub-agents to delegate work in parallel. This is the preferred approach for completing the optimization tasks efficiently.

## Completed Work

### 1. Three.js Hero Background Implementation ✅
- Created sophisticated particle system with brand-accurate colors
- Implemented ThreeHeroBackground, HeroScene, ParticleSystem, and ConnectionLines components
- Added dynamic particle spawning from cursor movement
- Integrated with A/B testing system (lightweight vs original variants)

### 2. Advanced Mouse Interactions ✅
- **Four Interaction Modes Implemented**:
  - `attract`: Particles drawn to cursor (default)
  - `repel`: Particles pushed away from cursor
  - `vortex`: Circular swirling motion around cursor
  - `explosion`: Hold to charge, release for burst effect
- Click to cycle through modes
- Visual feedback via CursorGlow component with mode-specific colors

### 3. Brand Color Integration ✅
- **Gallifrey Brand Colors**:
  - Primary: `#2D5A87` (teal)
  - Secondary: `#1B365D` (charcoal)
- **OYN Campaign Colors**:
  - Accent: `#B8860B` (orange-600)
  - Accent2: `#CD853F` (orange-700)
- Colors properly integrated into particle system with smooth transitions

### 4. Performance Features Implemented ✅
- Particle pooling system for memory management
- Adaptive quality based on device capabilities (low/medium/high)
- GPU-optimized instanced mesh rendering
- Spatial hashing for efficient neighbor queries

## Current Issues Requiring Attention

### Performance Problems 🔴
1. **Slow Compilation**: Takes 100+ seconds to compile
2. **High Response Times**: 2-3 second load times for pages
3. **Frame Rate Issues**: Not consistently hitting 60fps
4. **Memory Usage**: Potential memory leaks in particle system

## MULTI-AGENT DELEGATION STRATEGY

### Deploy These Agents in Parallel Using Task Tool:

#### Agent 1: Performance Testing & Benchmarking
```typescript
// Deploy with: Task tool, subagent_type: "general-purpose"
// Description: "Performance testing agent"
// Mission:
- Create comprehensive performance test suite at /tests/three-performance.spec.ts
- Benchmark FPS with particle counts: 50, 100, 200, 300, 500
- Monitor memory usage over 5-minute sessions
- Test both layout variants (lightweight & original)
- Generate performance reports with specific bottlenecks
- Use Chrome DevTools Performance API
- Create FPS counter, memory tracker, draw call counter
```

#### Agent 2: Shader & GPU Optimization
```typescript
// Deploy with: Task tool, subagent_type: "general-purpose"  
// Description: "Shader optimization agent"
// Mission:
- Convert particle animations to WebGL shaders
- Create vertex and fragment shaders for particle effects
- Implement GPU-based particle physics
- Optimize texture atlases for particles
- Reduce draw calls through instancing improvements
- Files to create:
  - /components/three/shaders/OptimizedParticleShaders.ts
  - /components/three/GPUParticleSystem.tsx
```

#### Agent 3: Memory & Bundle Optimization
```typescript
// Deploy with: Task tool, subagent_type: "general-purpose"
// Description: "Memory optimization agent"
// Mission:
- Fix memory leaks in particle trail system
- Implement aggressive object pooling
- Optimize Three.js object disposal
- Reduce bundle size through code splitting
- Implement progressive loading for Three.js
- Clean up event listeners and refs
- Target: <200KB for Three.js components
```

#### Agent 4: Algorithm & Calculation Optimization
```typescript
// Deploy with: Task tool, subagent_type: "general-purpose"
// Description: "Algorithm optimization agent"
// Mission:
- Simplify flocking algorithm (O(n²) to O(n log n))
- Implement octree spatial partitioning
- Optimize particle neighbor queries
- Reduce calculation frequency for distant particles
- Implement LOD (Level of Detail) system
- Cache expensive calculations
- Use Web Workers for physics calculations
```

#### Agent 5: React & Next.js Optimization
```typescript
// Deploy with: Task tool, subagent_type: "general-purpose"
// Description: "React optimization agent"
// Mission:
- Implement React.memo for all Three.js components
- Add useMemo/useCallback where appropriate
- Optimize re-renders with React DevTools Profiler
- Implement code splitting with dynamic imports
- Add Suspense boundaries for Three.js loading
- Optimize Next.js build configuration
- Reduce initial bundle size
```

## Key Files to Review
```
/components/three/ParticleSystem.tsx         # Main particle system (691 lines, needs optimization)
/components/three/ThreeHeroBackground.tsx    # Wrapper component
/components/three/HeroScene.tsx              # Scene management
/components/three/OptimizedParticleSystem.tsx # Existing optimization attempt
/components/three/PerformanceMonitor.ts      # Performance monitoring utility
/lib/useCursorTracking.ts                    # Mouse interaction tracking
/lib/usePerformanceMonitor.ts                # Performance hook
/components/Hero.tsx                         # Hero component integration
/components/CursorGlow.tsx                   # Visual feedback component
```

## Commands to Deploy Multi-Agent Team

```bash
# Step 1: Deploy all agents simultaneously using Task tool
# Each agent works on their specialized area in parallel

# Step 2: Monitor agent progress
# Check the collaboration files they create:
ls -la collaboration/

# Step 3: Run performance tests continuously
npm test -- --grep "performance"

# Step 4: Monitor dev server performance
# bash_2 is already running npm run dev
# Check compilation times and response times

# Step 5: Profile with Chrome DevTools
# Open localhost:3000 in Chrome
# Open Performance tab and record
```

## Testing URLs & Scenarios
- **Development Server**: `http://localhost:3000`
- **Lightweight Variant**: `http://localhost:3000?layout_variant=lightweight`
- **Original Variant**: `http://localhost:3000?layout_variant=original`

### Test Scenarios for Agents:
1. **Initial Load Performance**: Measure time to first meaningful paint
2. **Interaction Performance**: Test all 4 mouse modes
3. **Sustained Performance**: Run for 5 minutes, check for degradation
4. **Memory Stability**: Monitor heap size over time
5. **Mobile Performance**: Test with Chrome mobile emulation

## Success Criteria for Optimization

### Target Metrics:
- **Initial Load**: < 1 second
- **Consistent FPS**: 60fps on modern devices, 30fps minimum on older
- **Memory Usage**: Stable, no leaks over 5 minutes
- **Bundle Size**: < 200KB for Three.js components
- **Compilation Time**: < 10 seconds
- **Lighthouse Score**: > 90 for performance

### Performance Budget:
```javascript
{
  "FCP": "< 1.8s",
  "LCP": "< 2.5s", 
  "FID": "< 100ms",
  "CLS": "< 0.1",
  "TTI": "< 3.8s",
  "TBT": "< 300ms"
}
```

## Current Todo List Status
```
[in_progress] Optimize Three.js performance
[pending] Deploy performance testing agent
[pending] Deploy shader optimization agent
[pending] Deploy memory optimization agent
[pending] Run comprehensive performance tests
[pending] Implement performance improvements
```

## Environment Details
- **Framework**: Next.js 15.4.6
- **Three.js**: @react-three/fiber
- **Testing**: Playwright
- **Platform**: macOS Darwin 24.6.0
- **Node**: Using npm package manager
- **TypeScript**: Strict mode enabled
- **Dev Server**: Running on bash_2 process

## Git Status
- **Branch**: `develop`
- **Status**: Uncommitted changes in multiple files
- **Key Modified Files**:
  - /components/three/ParticleSystem.tsx
  - /components/Hero.tsx
  - /lib/useCursorTracking.ts
  - /components/CursorGlow.tsx

## Critical Next Steps for Next Claude Instance

### 1. IMMEDIATELY Deploy Multi-Agent Team
```javascript
// Use Task tool to deploy all 5 agents in parallel
// Each agent has specific optimization responsibilities
// Agents should create test files and optimized components
// Monitor their progress through collaboration files
```

### 2. Continuous Performance Testing
```bash
# Run performance tests every 5 minutes
while true; do
  npm test -- --grep "performance"
  sleep 300
done
```

### 3. Iterate Based on Agent Findings
- Agents will identify specific bottlenecks
- Implement their recommended optimizations
- Test after each optimization
- Keep iterating until performance targets are met

## Important Notes
- **User Preference**: Use multiple sub-agents for parallel work
- **No Commits**: User prefers explicit commit requests
- **Test Everything**: Run tests continuously during optimization
- **Preserve Features**: Don't break existing functionality
- **Performance First**: Focus on speed over perfect code

## Success Validation
Once all agents complete their tasks:
1. Run full performance test suite
2. Verify all interaction modes still work
3. Check memory usage is stable
4. Confirm 60fps achievement
5. Validate bundle size < 200KB
6. Test on multiple devices/browsers

---
**CRITICAL REMINDER**: USE MULTIPLE SUB-AGENTS TO DELEGATE WORK IN PARALLEL
This is the user's explicit instruction and preferred working method.

*Last updated: 2025-08-22 00:30:00 UTC*
*Session focus: Three.js performance optimization using multi-agent approach*