import * as THREE from 'three';
import { performanceMonitor } from './PerformanceMonitor';

/**
 * Progressive loading system for Three.js components
 * Loads resources in stages based on device capabilities and performance
 */
export class ProgressiveLoader {
  private static instance: ProgressiveLoader;
  private loadingStages: Map<string, LoadingStage> = new Map();
  private completedStages: Set<string> = new Set();
  private loadingQueue: LoadingTask[] = [];
  private isLoading = false;
  private frameTimeBudget = 16; // milliseconds per frame
  private maxLoadTime = 100; // maximum time per loading session

  public static getInstance(): ProgressiveLoader {
    if (!ProgressiveLoader.instance) {
      ProgressiveLoader.instance = new ProgressiveLoader();
    }
    return ProgressiveLoader.instance;
  }

  /**
   * Register a loading stage with priority and resource requirements
   */
  public registerStage(
    name: string,
    priority: number,
    loadFn: () => Promise<void>,
    requirements?: {
      minGPUTier?: 'low' | 'medium' | 'high' | 'ultra';
      minFPS?: number;
      maxMemoryUsage?: number; // MB
    }
  ): void {
    this.loadingStages.set(name, {
      name,
      priority,
      loadFn,
      requirements: requirements || {},
      loaded: false
    });
  }

  /**
   * Start progressive loading based on device capabilities
   */
  public async startLoading(): Promise<void> {
    if (this.isLoading) return;
    
    this.isLoading = true;
    const capabilities = performanceMonitor.getCapabilities();
    
    // Sort stages by priority
    const sortedStages = Array.from(this.loadingStages.values())
      .sort((a, b) => a.priority - b.priority);
    
    for (const stage of sortedStages) {
      // Check if stage should be loaded based on device capabilities
      if (!this.shouldLoadStage(stage, capabilities)) {
        console.log(`Skipping stage ${stage.name} - device capabilities insufficient`);
        continue;
      }
      
      try {
        const startTime = performance.now();
        await this.loadStageWithTimeLimit(stage);
        const loadTime = performance.now() - startTime;
        
        console.log(`Loaded stage ${stage.name} in ${loadTime.toFixed(2)}ms`);
        this.completedStages.add(stage.name);
        
        // Check performance after each stage
        const metrics = performanceMonitor.updateMetrics();
        if (metrics.averageFPS < 30) {
          console.log('Performance degraded, pausing progressive loading');
          break;
        }
        
        // Yield to browser for a frame
        await new Promise(resolve => requestAnimationFrame(resolve));
        
      } catch (error) {
        console.error(`Failed to load stage ${stage.name}:`, error);
      }
    }
    
    this.isLoading = false;
  }

  private shouldLoadStage(
    stage: LoadingStage,
    capabilities: unknown
  ): boolean {
    const req = stage.requirements;
    
    if (req.minGPUTier && capabilities) {
      const tierOrder = { low: 0, medium: 1, high: 2, ultra: 3 };
      if (tierOrder[capabilities.gpuTier] < tierOrder[req.minGPUTier]) {
        return false;
      }
    }
    
    if (req.minFPS) {
      const metrics = performanceMonitor.updateMetrics();
      if (metrics.averageFPS < req.minFPS) {
        return false;
      }
    }
    
    if (req.maxMemoryUsage) {
      const metrics = performanceMonitor.updateMetrics();
      if (metrics.memoryUsage > req.maxMemoryUsage) {
        return false;
      }
    }
    
    return true;
  }

  private async loadStageWithTimeLimit(stage: LoadingStage): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Stage ${stage.name} loading timeout`));
      }, this.maxLoadTime);
      
      stage.loadFn()
        .then(() => {
          clearTimeout(timeout);
          stage.loaded = true;
          resolve();
        })
        .catch((error) => {
          clearTimeout(timeout);
          reject(error);
        });
    });
  }

  public isStageLoaded(stageName: string): boolean {
    return this.completedStages.has(stageName);
  }

  public getLoadingProgress(): number {
    const totalStages = this.loadingStages.size;
    const loadedStages = this.completedStages.size;
    return totalStages > 0 ? loadedStages / totalStages : 1;
  }
}

interface LoadingStage {
  name: string;
  priority: number;
  loadFn: () => Promise<void>;
  requirements: {
    minGPUTier?: 'low' | 'medium' | 'high' | 'ultra';
    minFPS?: number;
    maxMemoryUsage?: number;
  };
  loaded: boolean;
}

interface LoadingTask {
  name: string;
  execute: () => Promise<void>;
  priority: number;
}

/**
 * Progressive particle spawning system
 */
export class ProgressiveParticleSpawner {
  private targetCount: number = 100;
  private currentCount: number = 0;
  private spawnRate: number = 5; // particles per frame
  private spawnCallback?: (count: number) => void;
  private isSpawning = false;
  private spawnStartTime = 0;

  constructor(
    targetCount: number,
    spawnCallback?: (count: number) => void
  ) {
    this.targetCount = targetCount;
    this.spawnCallback = spawnCallback;
  }

  public startSpawning(): void {
    if (this.isSpawning) return;
    
    this.isSpawning = true;
    this.spawnStartTime = performance.now();
    this.currentCount = 0;
    
    // Adapt spawn rate based on device capabilities
    const capabilities = performanceMonitor.getCapabilities();
    if (capabilities) {
      switch (capabilities.gpuTier) {
        case 'ultra':
          this.spawnRate = 10;
          break;
        case 'high':
          this.spawnRate = 7;
          break;
        case 'medium':
          this.spawnRate = 5;
          break;
        case 'low':
          this.spawnRate = 2;
          break;
      }
    }
    
    this.spawnParticlesBatch();
  }

  private spawnParticlesBatch(): void {
    if (!this.isSpawning || this.currentCount >= this.targetCount) {
      this.isSpawning = false;
      return;
    }
    
    // Check performance before spawning more
    const metrics = performanceMonitor.updateMetrics();
    if (metrics.averageFPS < 30) {
      // Reduce spawn rate if performance is poor
      this.spawnRate = Math.max(1, Math.floor(this.spawnRate * 0.5));
    }
    
    // Spawn particles in batches
    const batchSize = Math.min(this.spawnRate, this.targetCount - this.currentCount);
    this.currentCount += batchSize;
    
    if (this.spawnCallback) {
      this.spawnCallback(this.currentCount);
    }
    
    // Schedule next batch
    requestAnimationFrame(() => this.spawnParticlesBatch());
  }

  public updateTargetCount(newTarget: number): void {
    this.targetCount = newTarget;
    
    if (newTarget > this.currentCount && !this.isSpawning) {
      this.startSpawning();
    }
  }

  public getCurrentCount(): number {
    return this.currentCount;
  }

  public isComplete(): boolean {
    return this.currentCount >= this.targetCount;
  }

  public getProgress(): number {
    return this.targetCount > 0 ? this.currentCount / this.targetCount : 1;
  }
}

/**
 * Resource preloader for Three.js assets
 */
export class ThreeResourcePreloader {
  private textureLoader = new THREE.TextureLoader();
  private loadingManager = new THREE.LoadingManager();
  private preloadedTextures: Map<string, THREE.Texture> = new Map();
  private preloadedGeometries: Map<string, THREE.BufferGeometry> = new Map();

  constructor() {
    this.loadingManager.onLoad = () => {
      console.log('All Three.js resources loaded');
    };
    
    this.loadingManager.onError = (error) => {
      console.error('Error loading Three.js resources:', error);
    };
  }

  public async preloadTexture(name: string, url: string): Promise<THREE.Texture> {
    if (this.preloadedTextures.has(name)) {
      return this.preloadedTextures.get(name)!;
    }

    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        url,
        (texture) => {
          // Optimize texture settings
          texture.generateMipmaps = true;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          
          this.preloadedTextures.set(name, texture);
          resolve(texture);
        },
        undefined,
        (error) => {
          console.error(`Failed to load texture ${name}:`, error);
          reject(error);
        }
      );
    });
  }

  public preloadGeometry(name: string, geometry: THREE.BufferGeometry): void {
    // Optimize geometry for rendering
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    
    this.preloadedGeometries.set(name, geometry);
  }

  public getTexture(name: string): THREE.Texture | undefined {
    return this.preloadedTextures.get(name);
  }

  public getGeometry(name: string): THREE.BufferGeometry | undefined {
    return this.preloadedGeometries.get(name);
  }

  public dispose(): void {
    this.preloadedTextures.forEach(texture => texture.dispose());
    this.preloadedTextures.clear();
    
    this.preloadedGeometries.forEach(geometry => geometry.dispose());
    this.preloadedGeometries.clear();
  }
}

// Export singleton instances
export const progressiveLoader = ProgressiveLoader.getInstance();
export const resourcePreloader = new ThreeResourcePreloader();