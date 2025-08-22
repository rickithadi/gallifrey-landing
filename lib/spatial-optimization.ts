/**
 * Spatial optimization utilities for particle system performance
 * Implements spatial hash grid and octree for O(n log n) neighbor queries
 */

import * as THREE from 'three';

export interface SpatialParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  index: number;
}

/**
 * Spatial Hash Grid - Simple and fast spatial partitioning
 * Divides 3D space into uniform grid cells for efficient neighbor queries
 */
export class SpatialHashGrid {
  private cellSize: number;
  private grid: Map<string, SpatialParticle[]>;
  private bounds: THREE.Box3;

  constructor(cellSize: number = 2.0, bounds?: THREE.Box3) {
    this.cellSize = cellSize;
    this.grid = new Map();
    this.bounds = bounds || new THREE.Box3(
      new THREE.Vector3(-20, -12, -10),
      new THREE.Vector3(20, 12, 10)
    );
  }

  /**
   * Convert world position to grid cell coordinates
   */
  private getGridKey(position: THREE.Vector3): string {
    const x = Math.floor(position.x / this.cellSize);
    const y = Math.floor(position.y / this.cellSize);
    const z = Math.floor(position.z / this.cellSize);
    return `${x},${y},${z}`;
  }

  /**
   * Get all grid keys within a radius (for neighbor queries)
   */
  private getNeighborKeys(position: THREE.Vector3, radius: number): string[] {
    const keys: string[] = [];
    const cellRadius = Math.ceil(radius / this.cellSize);
    
    const centerX = Math.floor(position.x / this.cellSize);
    const centerY = Math.floor(position.y / this.cellSize);
    const centerZ = Math.floor(position.z / this.cellSize);

    for (let x = centerX - cellRadius; x <= centerX + cellRadius; x++) {
      for (let y = centerY - cellRadius; y <= centerY + cellRadius; y++) {
        for (let z = centerZ - cellRadius; z <= centerZ + cellRadius; z++) {
          keys.push(`${x},${y},${z}`);
        }
      }
    }

    return keys;
  }

  /**
   * Clear all particles from the grid
   */
  clear(): void {
    this.grid.clear();
  }

  /**
   * Insert a particle into the spatial grid
   */
  insert(particle: SpatialParticle): void {
    const key = this.getGridKey(particle.position);
    
    if (!this.grid.has(key)) {
      this.grid.set(key, []);
    }
    
    this.grid.get(key)!.push(particle);
  }

  /**
   * Query particles within a radius of a position
   * Returns only particles that are actually within the radius (not just grid cells)
   */
  queryRadius(position: THREE.Vector3, radius: number): SpatialParticle[] {
    const radiusSquared = radius * radius;
    const neighbors: SpatialParticle[] = [];
    const neighborKeys = this.getNeighborKeys(position, radius);

    for (const key of neighborKeys) {
      const particles = this.grid.get(key);
      if (!particles) continue;

      for (const particle of particles) {
        const distanceSquared = position.distanceToSquared(particle.position);
        if (distanceSquared <= radiusSquared && distanceSquared > 0) {
          neighbors.push(particle);
        }
      }
    }

    return neighbors;
  }

  /**
   * Get statistics about the spatial grid
   */
  getStats(): { totalCells: number; totalParticles: number; averageParticlesPerCell: number } {
    let totalParticles = 0;
    for (const particles of this.grid.values()) {
      totalParticles += particles.length;
    }

    return {
      totalCells: this.grid.size,
      totalParticles,
      averageParticlesPerCell: this.grid.size > 0 ? totalParticles / this.grid.size : 0
    };
  }
}

/**
 * Optimized distance calculation utilities
 */
export class DistanceUtils {
  /**
   * Fast squared distance without sqrt calculation
   */
  static distanceSquared(a: THREE.Vector3, b: THREE.Vector3): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return dx * dx + dy * dy + dz * dz;
  }

  /**
   * Fast 2D distance for mouse interactions (ignoring Z)
   */
  static distance2DSquared(a: THREE.Vector3, b: THREE.Vector3): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  /**
   * Check if point is within sphere without sqrt
   */
  static isWithinRadius(point: THREE.Vector3, center: THREE.Vector3, radius: number): boolean {
    return this.distanceSquared(point, center) <= radius * radius;
  }
}

/**
 * Object pool for temporary Vector3 calculations
 * Reduces garbage collection pressure in hot paths
 */
export class Vector3Pool {
  private pool: THREE.Vector3[] = [];
  private inUse: Set<THREE.Vector3> = new Set();

  constructor(initialSize: number = 50) {
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(new THREE.Vector3());
    }
  }

  /**
   * Get a Vector3 from the pool
   */
  get(): THREE.Vector3 {
    let vector = this.pool.pop();
    
    if (!vector) {
      vector = new THREE.Vector3();
    }
    
    this.inUse.add(vector);
    return vector.set(0, 0, 0); // Reset to zero
  }

  /**
   * Return a Vector3 to the pool
   */
  release(vector: THREE.Vector3): void {
    if (this.inUse.has(vector)) {
      this.inUse.delete(vector);
      this.pool.push(vector);
    }
  }

  /**
   * Release all vectors back to pool (call at end of frame)
   */
  releaseAll(): void {
    for (const vector of this.inUse) {
      this.pool.push(vector);
    }
    this.inUse.clear();
  }

  /**
   * Get pool statistics
   */
  getStats(): { available: number; inUse: number; total: number } {
    return {
      available: this.pool.length,
      inUse: this.inUse.size,
      total: this.pool.length + this.inUse.size
    };
  }
}

/**
 * LOD (Level of Detail) system for adaptive quality
 */
export class LODSystem {
  private camera: THREE.Camera;
  private viewport: THREE.Vector4;

  constructor(camera: THREE.Camera) {
    this.camera = camera;
    this.viewport = new THREE.Vector4();
  }

  /**
   * Get update frequency based on distance from camera
   */
  getUpdateFrequency(position: THREE.Vector3): number {
    const distance = position.distanceTo(this.camera.position);
    
    if (distance > 15) return 4; // Update every 4th frame
    if (distance > 10) return 3; // Update every 3rd frame
    if (distance > 5) return 2;  // Update every 2nd frame
    return 1; // Update every frame
  }

  /**
   * Get quality level based on distance and screen size
   */
  getQualityLevel(position: THREE.Vector3): 'high' | 'medium' | 'low' {
    const distance = position.distanceTo(this.camera.position);
    
    if (distance > 12) return 'low';
    if (distance > 6) return 'medium';
    return 'high';
  }

  /**
   * Check if particle is within camera frustum
   */
  isInFrustum(position: THREE.Vector3, radius: number = 0.1): boolean {
    // Simple frustum culling using camera matrix
    const frustum = new THREE.Frustum();
    const matrix = new THREE.Matrix4().multiplyMatrices(
      this.camera.projectionMatrix,
      this.camera.matrixWorldInverse
    );
    frustum.setFromProjectionMatrix(matrix);
    
    const sphere = new THREE.Sphere(position, radius);
    return frustum.intersectsSphere(sphere);
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private frameCount: number = 0;
  private lastTime: number = 0;
  private fps: number = 0;
  private frameTimes: number[] = [];
  private maxFrameTimeHistory: number = 60;

  constructor() {
    this.lastTime = performance.now();
  }

  /**
   * Update performance metrics
   */
  update(): void {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    this.frameTimes.push(deltaTime);
    if (this.frameTimes.length > this.maxFrameTimeHistory) {
      this.frameTimes.shift();
    }
    
    this.frameCount++;
    if (this.frameCount % 60 === 0) {
      this.fps = 1000 / (this.getAverageFrameTime());
    }
    
    this.lastTime = currentTime;
  }

  /**
   * Get current FPS
   */
  getFPS(): number {
    return this.fps;
  }

  /**
   * Get average frame time over recent frames
   */
  getAverageFrameTime(): number {
    if (this.frameTimes.length === 0) return 16.67; // 60fps fallback
    
    const sum = this.frameTimes.reduce((a, b) => a + b, 0);
    return sum / this.frameTimes.length;
  }

  /**
   * Check if performance is dropping
   */
  isPerformancePoor(targetFPS: number = 60): boolean {
    return this.fps < targetFPS * 0.8; // 80% of target FPS
  }

  /**
   * Get performance statistics
   */
  getStats(): { fps: number; avgFrameTime: number; minFrameTime: number; maxFrameTime: number } {
    return {
      fps: this.fps,
      avgFrameTime: this.getAverageFrameTime(),
      minFrameTime: Math.min(...this.frameTimes),
      maxFrameTime: Math.max(...this.frameTimes)
    };
  }
}

/**
 * Cache system for expensive calculations
 */
export class CalculationCache {
  private trigCache: Map<string, number> = new Map();
  private forceCache: Map<string, THREE.Vector3> = new Map();
  private maxCacheSize: number = 1000;

  /**
   * Get cached sine value
   */
  sin(angle: number, precision: number = 100): number {
    const key = Math.round(angle * precision).toString();
    
    if (!this.trigCache.has(key)) {
      if (this.trigCache.size >= this.maxCacheSize) {
        this.trigCache.clear(); // Simple cache eviction
      }
      this.trigCache.set(key, Math.sin(angle));
    }
    
    return this.trigCache.get(key)!;
  }

  /**
   * Get cached cosine value
   */
  cos(angle: number, precision: number = 100): number {
    const key = Math.round(angle * precision).toString();
    
    if (!this.trigCache.has(`cos_${key}`)) {
      if (this.trigCache.size >= this.maxCacheSize) {
        this.trigCache.clear();
      }
      this.trigCache.set(`cos_${key}`, Math.cos(angle));
    }
    
    return this.trigCache.get(`cos_${key}`)!;
  }

  /**
   * Clear all caches
   */
  clear(): void {
    this.trigCache.clear();
    this.forceCache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): { trigCacheSize: number; forceCacheSize: number } {
    return {
      trigCacheSize: this.trigCache.size,
      forceCacheSize: this.forceCache.size
    };
  }
}