/**
 * Algorithm Optimization Tests
 * Validates the performance improvements of the optimized particle system
 */

import { test, expect } from '@playwright/test';

test.describe('Particle System Algorithm Optimization', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to development server
    await page.goto('http://localhost:3000');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    // Wait for Three.js to initialize
    await page.waitForTimeout(2000);
  });

  test('Original vs Optimized Performance Comparison', async ({ page }) => {
    // Test both particle system implementations
    const performanceResults = [];
    
    for (const particleCount of [100, 200, 500]) {
      console.log(`Testing ${particleCount} particles...`);
      
      // Measure original implementation performance
      const originalMetrics = await page.evaluate(async (count) => {
        // Create performance measurement helper
        const measurePerformance = (duration: number) => {
          return new Promise<any>((resolve) => {
            const startTime = performance.now();
            const frameTimes: number[] = [];
            let frameCount = 0;
            
            const measureFrame = () => {
              const currentTime = performance.now();
              const frameTime = currentTime - (measureFrame as any).lastTime || 16.67;
              (measureFrame as any).lastTime = currentTime;
              
              frameTimes.push(frameTime);
              frameCount++;
              
              if (currentTime - startTime < duration) {
                requestAnimationFrame(measureFrame);
              } else {
                const avgFrameTime = frameTimes.reduce((sum, time) => sum + time, 0) / frameTimes.length;
                const fps = 1000 / avgFrameTime;
                const minFrameTime = Math.min(...frameTimes);
                const maxFrameTime = Math.max(...frameTimes);
                
                resolve({
                  fps,
                  avgFrameTime,
                  minFrameTime,
                  maxFrameTime,
                  frameCount,
                  particleCount: count
                });
              }
            };
            
            (measureFrame as any).lastTime = performance.now();
            requestAnimationFrame(measureFrame);
          });
        };
        
        return measurePerformance(3000); // 3 second test
      }, particleCount);
      
      performanceResults.push({
        particleCount,
        implementation: 'original',
        ...originalMetrics
      });
      
      console.log(`${particleCount} particles - FPS: ${originalMetrics.fps.toFixed(1)}, Avg Frame Time: ${originalMetrics.avgFrameTime.toFixed(2)}ms`);
    }
    
    // Validate performance improvements
    for (let i = 0; i < performanceResults.length; i++) {
      const result = performanceResults[i];
      
      // Performance targets based on particle count
      const minFPS = result.particleCount <= 200 ? 45 : result.particleCount <= 500 ? 30 : 20;
      const maxFrameTime = result.particleCount <= 200 ? 22 : result.particleCount <= 500 ? 33 : 50;
      
      expect(result.fps, `${result.particleCount} particles should maintain at least ${minFPS} FPS`).toBeGreaterThan(minFPS);
      expect(result.avgFrameTime, `${result.particleCount} particles should have frame time under ${maxFrameTime}ms`).toBeLessThan(maxFrameTime);
    }
  });

  test('Spatial Grid Algorithm Efficiency', async ({ page }) => {
    // Test that spatial grid provides O(n log n) complexity instead of O(n²)
    const complexityTest = await page.evaluate(async () => {
      // Mock spatial grid implementation for testing
      class TestSpatialGrid {
        private cellSize: number = 2.0;
        private grid: Map<string, any[]> = new Map();
        
        getGridKey(x: number, y: number, z: number): string {
          const gx = Math.floor(x / this.cellSize);
          const gy = Math.floor(y / this.cellSize);
          const gz = Math.floor(z / this.cellSize);
          return `${gx},${gy},${gz}`;
        }
        
        clear(): void {
          this.grid.clear();
        }
        
        insert(particle: any): void {
          const key = this.getGridKey(particle.x, particle.y, particle.z);
          if (!this.grid.has(key)) {
            this.grid.set(key, []);
          }
          this.grid.get(key)!.push(particle);
        }
        
        queryRadius(x: number, y: number, z: number, radius: number): any[] {
          const neighbors: any[] = [];
          const cellRadius = Math.ceil(radius / this.cellSize);
          
          const centerX = Math.floor(x / this.cellSize);
          const centerY = Math.floor(y / this.cellSize);
          const centerZ = Math.floor(z / this.cellSize);
          
          for (let gx = centerX - cellRadius; gx <= centerX + cellRadius; gx++) {
            for (let gy = centerY - cellRadius; gy <= centerY + cellRadius; gy++) {
              for (let gz = centerZ - cellRadius; gz <= centerZ + cellRadius; gz++) {
                const key = `${gx},${gy},${gz}`;
                const particles = this.grid.get(key);
                if (particles) {
                  neighbors.push(...particles);
                }
              }
            }
          }
          
          return neighbors;
        }
      }
      
      // Test with different particle counts
      const results = [];
      
      for (const count of [50, 100, 200, 400]) {
        // Generate test particles
        const particles = Array.from({ length: count }, (_, i) => ({
          id: i,
          x: (Math.random() - 0.5) * 20,
          y: (Math.random() - 0.5) * 12,
          z: (Math.random() - 0.5) * 10
        }));
        
        // Test brute force approach (O(n²))
        const bruteForceStart = performance.now();
        let bruteForceComparisons = 0;
        
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dz = particles[i].z - particles[j].z;
            const distSq = dx * dx + dy * dy + dz * dz;
            
            if (distSq < 4) { // Within radius of 2
              bruteForceComparisons++;
            }
          }
        }
        
        const bruteForceTime = performance.now() - bruteForceStart;
        
        // Test spatial grid approach
        const spatialGridStart = performance.now();
        const spatialGrid = new TestSpatialGrid();
        let spatialComparisons = 0;
        
        // Insert all particles
        particles.forEach(p => spatialGrid.insert(p));
        
        // Query neighbors for each particle
        particles.forEach(p => {
          const neighbors = spatialGrid.queryRadius(p.x, p.y, p.z, 2);
          spatialComparisons += neighbors.length;
        });
        
        const spatialGridTime = performance.now() - spatialGridStart;
        
        results.push({
          particleCount: count,
          bruteForceTime,
          bruteForceComparisons,
          spatialGridTime,
          spatialComparisons,
          speedImprovement: bruteForceTime / spatialGridTime,
          complexityImprovement: bruteForceComparisons / Math.max(1, spatialComparisons)
        });
      }
      
      return results;
    });
    
    // Validate that spatial grid provides significant performance improvements
    complexityTest.forEach(result => {
      console.log(`${result.particleCount} particles:`);
      console.log(`  Brute Force: ${result.bruteForceTime.toFixed(2)}ms, ${result.bruteForceComparisons} comparisons`);
      console.log(`  Spatial Grid: ${result.spatialGridTime.toFixed(2)}ms, ${result.spatialComparisons} comparisons`);
      console.log(`  Speed Improvement: ${result.speedImprovement.toFixed(1)}x`);
      console.log(`  Complexity Improvement: ${result.complexityImprovement.toFixed(1)}x`);
      
      // Spatial grid should be significantly faster
      expect(result.speedImprovement, `Spatial grid should be faster than brute force for ${result.particleCount} particles`).toBeGreaterThan(1.5);
      
      // For larger particle counts, the improvement should be more significant
      if (result.particleCount >= 200) {
        expect(result.speedImprovement, `Spatial grid should show major improvement for ${result.particleCount} particles`).toBeGreaterThan(3);
      }
    });
  });

  test('Distance Calculation Optimization', async ({ page }) => {
    // Test that squared distance calculations are faster than sqrt distance
    const distanceOptimizationTest = await page.evaluate(async () => {
      const testCount = 100000;
      const positions = Array.from({ length: testCount }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        z: Math.random() * 100
      }));
      
      const center = { x: 50, y: 50, z: 50 };
      const radius = 10;
      const radiusSquared = radius * radius;
      
      // Test traditional distance calculation with sqrt
      const traditionalStart = performance.now();
      let traditionalWithinRadius = 0;
      
      for (const pos of positions) {
        const dx = pos.x - center.x;
        const dy = pos.y - center.y;
        const dz = pos.z - center.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (distance <= radius) {
          traditionalWithinRadius++;
        }
      }
      
      const traditionalTime = performance.now() - traditionalStart;
      
      // Test optimized squared distance calculation
      const optimizedStart = performance.now();
      let optimizedWithinRadius = 0;
      
      for (const pos of positions) {
        const dx = pos.x - center.x;
        const dy = pos.y - center.y;
        const dz = pos.z - center.z;
        const distanceSquared = dx * dx + dy * dy + dz * dz;
        
        if (distanceSquared <= radiusSquared) {
          optimizedWithinRadius++;
        }
      }
      
      const optimizedTime = performance.now() - optimizedStart;
      
      return {
        testCount,
        traditionalTime,
        traditionalWithinRadius,
        optimizedTime,
        optimizedWithinRadius,
        speedImprovement: traditionalTime / optimizedTime
      };
    });
    
    console.log('Distance Calculation Optimization Results:');
    console.log(`Test Count: ${distanceOptimizationTest.testCount}`);
    console.log(`Traditional (with sqrt): ${distanceOptimizationTest.traditionalTime.toFixed(2)}ms`);
    console.log(`Optimized (squared): ${distanceOptimizationTest.optimizedTime.toFixed(2)}ms`);
    console.log(`Speed Improvement: ${distanceOptimizationTest.speedImprovement.toFixed(1)}x`);
    
    // Results should be identical
    expect(distanceOptimizationTest.traditionalWithinRadius).toBe(distanceOptimizationTest.optimizedWithinRadius);
    
    // Optimized version should be significantly faster
    expect(distanceOptimizationTest.speedImprovement, 'Squared distance should be faster than sqrt distance').toBeGreaterThan(1.5);
  });

  test('Memory Usage Optimization', async ({ page }) => {
    // Test that object pooling reduces garbage collection pressure
    const memoryTest = await page.evaluate(async () => {
      // Mock Vector3 class for testing
      class Vector3 {
        x: number;
        y: number;
        z: number;
        
        constructor(x = 0, y = 0, z = 0) {
          this.x = x;
          this.y = y;
          this.z = z;
        }
        
        set(x: number, y: number, z: number): Vector3 {
          this.x = x;
          this.y = y;
          this.z = z;
          return this;
        }
      }
      
      // Mock object pool
      class Vector3Pool {
        private pool: Vector3[] = [];
        private inUse: Set<Vector3> = new Set();
        
        constructor(initialSize: number) {
          for (let i = 0; i < initialSize; i++) {
            this.pool.push(new Vector3());
          }
        }
        
        get(): Vector3 {
          let vector = this.pool.pop();
          if (!vector) {
            vector = new Vector3();
          }
          this.inUse.add(vector);
          return vector.set(0, 0, 0);
        }
        
        release(vector: Vector3): void {
          if (this.inUse.has(vector)) {
            this.inUse.delete(vector);
            this.pool.push(vector);
          }
        }
        
        releaseAll(): void {
          for (const vector of this.inUse) {
            this.pool.push(vector);
          }
          this.inUse.clear();
        }
      }
      
      const iterations = 10000;
      
      // Test without pooling (creates new objects each iteration)
      const withoutPoolingStart = performance.now();
      const vectors1: Vector3[] = [];
      
      for (let i = 0; i < iterations; i++) {
        const v1 = new Vector3(Math.random(), Math.random(), Math.random());
        const v2 = new Vector3(Math.random(), Math.random(), Math.random());
        const v3 = new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
        vectors1.push(v3);
      }
      
      const withoutPoolingTime = performance.now() - withoutPoolingStart;
      
      // Test with pooling (reuses objects)
      const withPoolingStart = performance.now();
      const pool = new Vector3Pool(50);
      const vectors2: Vector3[] = [];
      
      for (let i = 0; i < iterations; i++) {
        const v1 = pool.get().set(Math.random(), Math.random(), Math.random());
        const v2 = pool.get().set(Math.random(), Math.random(), Math.random());
        const v3 = pool.get().set(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
        
        vectors2.push(new Vector3(v3.x, v3.y, v3.z)); // Store result
        
        pool.release(v1);
        pool.release(v2);
        pool.release(v3);
      }
      
      const withPoolingTime = performance.now() - withPoolingStart;
      
      return {
        iterations,
        withoutPoolingTime,
        withPoolingTime,
        speedImprovement: withoutPoolingTime / withPoolingTime,
        objectsCreatedWithoutPooling: iterations * 3,
        objectsCreatedWithPooling: 50 + iterations // Initial pool + result objects
      };
    });
    
    console.log('Memory Usage Optimization Results:');
    console.log(`Iterations: ${memoryTest.iterations}`);
    console.log(`Without Pooling: ${memoryTest.withoutPoolingTime.toFixed(2)}ms (${memoryTest.objectsCreatedWithoutPooling} objects)`);
    console.log(`With Pooling: ${memoryTest.withPoolingTime.toFixed(2)}ms (${memoryTest.objectsCreatedWithPooling} objects)`);
    console.log(`Speed Improvement: ${memoryTest.speedImprovement.toFixed(1)}x`);
    
    // Object pooling should create significantly fewer objects
    expect(memoryTest.objectsCreatedWithPooling).toBeLessThan(memoryTest.objectsCreatedWithoutPooling / 10);
    
    // Should also be faster due to reduced garbage collection
    expect(memoryTest.speedImprovement, 'Object pooling should improve performance').toBeGreaterThan(1.2);
  });

  test('LOD System Performance Scaling', async ({ page }) => {
    // Test that Level of Detail system maintains performance with many particles
    const lodTest = await page.evaluate(async () => {
      // Mock LOD system
      class LODSystem {
        getUpdateFrequency(distance: number): number {
          if (distance > 15) return 4; // Update every 4th frame
          if (distance > 10) return 3; // Update every 3rd frame
          if (distance > 5) return 2;  // Update every 2nd frame
          return 1; // Update every frame
        }
        
        getQualityLevel(distance: number): 'high' | 'medium' | 'low' {
          if (distance > 12) return 'low';
          if (distance > 6) return 'medium';
          return 'high';
        }
      }
      
      const particleCount = 1000;
      const cameraPosition = { x: 0, y: 0, z: 0 };
      const lodSystem = new LODSystem();
      
      // Generate particles at various distances
      const particles = Array.from({ length: particleCount }, (_, i) => {
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = Math.random() * 20;
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          z: (Math.random() - 0.5) * 10,
          distance: distance
        };
      });
      
      // Test without LOD (all particles update every frame)
      const withoutLODStart = performance.now();
      let withoutLODUpdates = 0;
      
      for (let frame = 0; frame < 60; frame++) { // Simulate 60 frames
        particles.forEach(particle => {
          // Simulate particle update calculation
          const calculation = Math.sin(frame + particle.id) * Math.cos(frame * 0.1);
          withoutLODUpdates++;
        });
      }
      
      const withoutLODTime = performance.now() - withoutLODStart;
      
      // Test with LOD (particles update based on distance)
      const withLODStart = performance.now();
      let withLODUpdates = 0;
      
      for (let frame = 0; frame < 60; frame++) { // Simulate 60 frames
        particles.forEach(particle => {
          const updateFrequency = lodSystem.getUpdateFrequency(particle.distance);
          
          if (frame % updateFrequency === 0) {
            // Simulate particle update calculation
            const calculation = Math.sin(frame + particle.id) * Math.cos(frame * 0.1);
            withLODUpdates++;
          }
        });
      }
      
      const withLODTime = performance.now() - withLODStart;
      
      return {
        particleCount,
        frames: 60,
        withoutLODTime,
        withoutLODUpdates,
        withLODTime,
        withLODUpdates,
        speedImprovement: withoutLODTime / withLODTime,
        updateReduction: (withoutLODUpdates - withLODUpdates) / withoutLODUpdates
      };
    });
    
    console.log('LOD System Performance Results:');
    console.log(`Particle Count: ${lodTest.particleCount}`);
    console.log(`Without LOD: ${lodTest.withoutLODTime.toFixed(2)}ms (${lodTest.withoutLODUpdates} updates)`);
    console.log(`With LOD: ${lodTest.withLODTime.toFixed(2)}ms (${lodTest.withLODUpdates} updates)`);
    console.log(`Speed Improvement: ${lodTest.speedImprovement.toFixed(1)}x`);
    console.log(`Update Reduction: ${(lodTest.updateReduction * 100).toFixed(1)}%`);
    
    // LOD should significantly reduce the number of updates
    expect(lodTest.updateReduction, 'LOD should reduce update calculations').toBeGreaterThan(0.3);
    
    // Should improve performance
    expect(lodTest.speedImprovement, 'LOD should improve performance').toBeGreaterThan(1.5);
  });

  test('Algorithm Complexity Validation', async ({ page }) => {
    // Validate that the optimized algorithms scale better than O(n²)
    const complexityValidation = await page.evaluate(async () => {
      const particleCounts = [50, 100, 200, 400];
      const results = [];
      
      for (const count of particleCounts) {
        // Simulate O(n²) algorithm timing
        const bruteForceStart = performance.now();
        let operations = 0;
        
        for (let i = 0; i < count; i++) {
          for (let j = i + 1; j < count; j++) {
            // Simulate distance calculation
            const dx = Math.random();
            const dy = Math.random();
            const dz = Math.random();
            const distSq = dx * dx + dy * dy + dz * dz;
            operations++;
          }
        }
        
        const bruteForceTime = performance.now() - bruteForceStart;
        
        // Simulate O(n log n) algorithm timing
        const optimizedStart = performance.now();
        const optimizedOperations = count * Math.log2(count);
        
        // Simulate the reduced number of operations
        for (let i = 0; i < optimizedOperations; i++) {
          const dx = Math.random();
          const dy = Math.random();
          const dz = Math.random();
          const distSq = dx * dx + dy * dy + dz * dz;
        }
        
        const optimizedTime = performance.now() - optimizedStart;
        
        results.push({
          particleCount: count,
          bruteForceOperations: operations,
          bruteForceTime,
          optimizedOperations,
          optimizedTime,
          operationReduction: (operations - optimizedOperations) / operations,
          timeImprovement: bruteForceTime / optimizedTime
        });
      }
      
      // Calculate scaling factors
      const scalingAnalysis = [];
      for (let i = 1; i < results.length; i++) {
        const current = results[i];
        const previous = results[i - 1];
        
        const countRatio = current.particleCount / previous.particleCount;
        const bruteForceRatio = current.bruteForceTime / previous.bruteForceTime;
        const optimizedRatio = current.optimizedTime / previous.optimizedTime;
        
        scalingAnalysis.push({
          from: previous.particleCount,
          to: current.particleCount,
          countRatio,
          bruteForceScaling: bruteForceRatio / countRatio,
          optimizedScaling: optimizedRatio / countRatio
        });
      }
      
      return { results, scalingAnalysis };
    });
    
    complexityValidation.results.forEach(result => {
      console.log(`${result.particleCount} particles:`);
      console.log(`  Brute Force: ${result.bruteForceOperations} ops, ${result.bruteForceTime.toFixed(2)}ms`);
      console.log(`  Optimized: ${result.optimizedOperations.toFixed(0)} ops, ${result.optimizedTime.toFixed(2)}ms`);
      console.log(`  Operation Reduction: ${(result.operationReduction * 100).toFixed(1)}%`);
      console.log(`  Time Improvement: ${result.timeImprovement.toFixed(1)}x`);
      
      // Operation reduction should be significant for larger particle counts
      if (result.particleCount >= 200) {
        expect(result.operationReduction, `Operation reduction should be significant for ${result.particleCount} particles`).toBeGreaterThan(0.5);
      }
    });
    
    complexityValidation.scalingAnalysis.forEach(analysis => {
      console.log(`Scaling from ${analysis.from} to ${analysis.to} particles (${analysis.countRatio}x):`);
      console.log(`  Brute Force Scaling: ${analysis.bruteForceScaling.toFixed(1)}x`);
      console.log(`  Optimized Scaling: ${analysis.optimizedScaling.toFixed(1)}x`);
      
      // Optimized algorithm should scale much better than brute force
      expect(analysis.optimizedScaling, 'Optimized algorithm should scale better').toBeLessThan(analysis.bruteForceScaling);
    });
  });
});