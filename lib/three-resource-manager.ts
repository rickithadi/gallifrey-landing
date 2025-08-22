/**
 * Three.js Resource Manager
 * Handles memory leak prevention, resource disposal, and lifecycle management
 * for Three.js objects to ensure optimal memory usage
 */

import * as THREE from 'three';

export interface ResourceInfo {
  id: string;
  type: 'geometry' | 'material' | 'texture' | 'renderTarget' | 'mesh' | 'other';
  createdAt: number;
  lastUsed: number;
  size?: number;
  references: number;
}

export interface MemoryStats {
  totalGeometries: number;
  totalMaterials: number;
  totalTextures: number;
  totalMeshes: number;
  estimatedMemoryUsage: number; // in MB
  oldestUnusedResource: number; // age in ms
}

export class ThreeResourceManager {
  private geometries = new Map<string, THREE.BufferGeometry>();
  private materials = new Map<string, THREE.Material>();
  private textures = new Map<string, THREE.Texture>();
  private renderTargets = new Map<string, THREE.WebGLRenderTarget>();
  private meshes = new Set<THREE.Mesh | THREE.InstancedMesh>();
  private resourceInfo = new Map<string, ResourceInfo>();
  
  // Resource pools for reuse
  private geometryPool = new Map<string, THREE.BufferGeometry[]>();
  private materialPool = new Map<string, THREE.Material[]>();
  private meshPool = new Map<string, (THREE.Mesh | THREE.InstancedMesh)[]>();
  
  // Cleanup settings
  private maxUnusedAge = 30000; // 30 seconds
  private maxPoolSize = 10;
  private cleanupInterval = 5000; // 5 seconds
  private lastCleanup = 0;
  
  // Memory tracking
  private memoryUsageEstimate = 0;
  private disposed = false;

  constructor() {
    // Bind cleanup to prevent memory leaks
    this.startPeriodicCleanup();
  }

  /**
   * Register a geometry with the resource manager
   */
  registerGeometry(id: string, geometry: THREE.BufferGeometry): THREE.BufferGeometry {
    if (this.disposed) return geometry;

    this.geometries.set(id, geometry);
    this.trackResource(id, 'geometry', this.estimateGeometrySize(geometry));
    
    // Add disposal listener
    const originalDispose = geometry.dispose.bind(geometry);
    geometry.dispose = () => {
      this.unregisterGeometry(id);
      originalDispose();
    };

    return geometry;
  }

  /**
   * Register a material with the resource manager
   */
  registerMaterial(id: string, material: THREE.Material): THREE.Material {
    if (this.disposed) return material;

    this.materials.set(id, material);
    this.trackResource(id, 'material', this.estimateMaterialSize(material));
    
    // Add disposal listener
    const originalDispose = material.dispose.bind(material);
    material.dispose = () => {
      this.unregisterMaterial(id);
      originalDispose();
    };

    return material;
  }

  /**
   * Register a texture with the resource manager
   */
  registerTexture(id: string, texture: THREE.Texture): THREE.Texture {
    if (this.disposed) return texture;

    this.textures.set(id, texture);
    this.trackResource(id, 'texture', this.estimateTextureSize(texture));
    
    // Add disposal listener
    const originalDispose = texture.dispose.bind(texture);
    texture.dispose = () => {
      this.unregisterTexture(id);
      originalDispose();
    };

    return texture;
  }

  /**
   * Register a mesh with the resource manager
   */
  registerMesh(mesh: THREE.Mesh | THREE.InstancedMesh): void {
    if (this.disposed) return;

    this.meshes.add(mesh);
    const id = this.generateMeshId(mesh);
    this.trackResource(id, 'mesh', this.estimateMeshSize(mesh));
  }

  /**
   * Get or create a pooled geometry
   */
  getPooledGeometry(type: string, factory: () => THREE.BufferGeometry): THREE.BufferGeometry {
    if (this.disposed) return factory();

    const pool = this.geometryPool.get(type) || [];
    
    if (pool.length > 0) {
      const geometry = pool.pop()!;
      this.updateResourceUsage(this.generateResourceId('geometry', type));
      return geometry;
    }
    
    // Create new geometry if pool is empty
    const geometry = factory();
    const id = this.generateResourceId('geometry', type);
    return this.registerGeometry(id, geometry);
  }

  /**
   * Return a geometry to the pool
   */
  returnGeometryToPool(type: string, geometry: THREE.BufferGeometry): void {
    if (this.disposed) {
      geometry.dispose();
      return;
    }

    const pool = this.geometryPool.get(type) || [];
    
    if (pool.length < this.maxPoolSize) {
      pool.push(geometry);
      this.geometryPool.set(type, pool);
    } else {
      // Pool is full, dispose the geometry
      geometry.dispose();
    }
  }

  /**
   * Get or create a pooled material
   */
  getPooledMaterial(type: string, factory: () => THREE.Material): THREE.Material {
    if (this.disposed) return factory();

    const pool = this.materialPool.get(type) || [];
    
    if (pool.length > 0) {
      const material = pool.pop()!;
      this.updateResourceUsage(this.generateResourceId('material', type));
      return material;
    }
    
    // Create new material if pool is empty
    const material = factory();
    const id = this.generateResourceId('material', type);
    return this.registerMaterial(id, material);
  }

  /**
   * Return a material to the pool
   */
  returnMaterialToPool(type: string, material: THREE.Material): void {
    if (this.disposed) {
      material.dispose();
      return;
    }

    const pool = this.materialPool.get(type) || [];
    
    if (pool.length < this.maxPoolSize) {
      pool.push(material);
      this.materialPool.set(type, pool);
    } else {
      // Pool is full, dispose the material
      material.dispose();
    }
  }

  /**
   * Update resource usage timestamp
   */
  updateResourceUsage(id: string): void {
    const info = this.resourceInfo.get(id);
    if (info) {
      info.lastUsed = Date.now();
    }
  }

  /**
   * Cleanup unused resources
   */
  cleanup(): void {
    if (this.disposed) return;

    const now = Date.now();
    const resourcesToCleanup: string[] = [];

    // Find resources that haven't been used recently
    for (const [id, info] of this.resourceInfo.entries()) {
      if (now - info.lastUsed > this.maxUnusedAge && info.references === 0) {
        resourcesToCleanup.push(id);
      }
    }

    // Dispose unused resources
    for (const id of resourcesToCleanup) {
      this.disposeResource(id);
    }

    // Clean up empty pools
    this.cleanupPools();

    this.lastCleanup = now;
  }

  /**
   * Force cleanup of all resources
   */
  forceCleanup(): void {
    // Dispose all geometries
    for (const [id, geometry] of this.geometries.entries()) {
      geometry.dispose();
      this.resourceInfo.delete(id);
    }
    this.geometries.clear();

    // Dispose all materials
    for (const [id, material] of this.materials.entries()) {
      material.dispose();
      this.resourceInfo.delete(id);
    }
    this.materials.clear();

    // Dispose all textures
    for (const [id, texture] of this.textures.entries()) {
      texture.dispose();
      this.resourceInfo.delete(id);
    }
    this.textures.clear();

    // Dispose all render targets
    for (const [id, renderTarget] of this.renderTargets.entries()) {
      renderTarget.dispose();
      this.resourceInfo.delete(id);
    }
    this.renderTargets.clear();

    // Clear meshes
    this.meshes.clear();

    // Clear pools
    this.clearAllPools();

    this.memoryUsageEstimate = 0;
  }

  /**
   * Get memory statistics
   */
  getMemoryStats(): MemoryStats {
    let oldestUnused = 0;
    const now = Date.now();

    for (const info of this.resourceInfo.values()) {
      if (info.references === 0) {
        const age = now - info.lastUsed;
        oldestUnused = Math.max(oldestUnused, age);
      }
    }

    return {
      totalGeometries: this.geometries.size,
      totalMaterials: this.materials.size,
      totalTextures: this.textures.size,
      totalMeshes: this.meshes.size,
      estimatedMemoryUsage: this.memoryUsageEstimate / (1024 * 1024), // Convert to MB
      oldestUnusedResource: oldestUnused,
    };
  }

  /**
   * Get detailed resource information
   */
  getResourceInfo(): ResourceInfo[] {
    return Array.from(this.resourceInfo.values());
  }

  /**
   * Set cleanup configuration
   */
  setCleanupConfig(config: {
    maxUnusedAge?: number;
    maxPoolSize?: number;
    cleanupInterval?: number;
  }): void {
    if (config.maxUnusedAge !== undefined) {
      this.maxUnusedAge = config.maxUnusedAge;
    }
    if (config.maxPoolSize !== undefined) {
      this.maxPoolSize = config.maxPoolSize;
    }
    if (config.cleanupInterval !== undefined) {
      this.cleanupInterval = config.cleanupInterval;
    }
  }

  /**
   * Dispose the resource manager
   */
  dispose(): void {
    this.disposed = true;
    this.forceCleanup();
  }

  // Private methods

  private trackResource(id: string, type: ResourceInfo['type'], size = 0): void {
    const now = Date.now();
    this.resourceInfo.set(id, {
      id,
      type,
      createdAt: now,
      lastUsed: now,
      size,
      references: 1,
    });
    this.memoryUsageEstimate += size;
  }

  private unregisterGeometry(id: string): void {
    this.geometries.delete(id);
    this.removeResourceInfo(id);
  }

  private unregisterMaterial(id: string): void {
    this.materials.delete(id);
    this.removeResourceInfo(id);
  }

  private unregisterTexture(id: string): void {
    this.textures.delete(id);
    this.removeResourceInfo(id);
  }

  private removeResourceInfo(id: string): void {
    const info = this.resourceInfo.get(id);
    if (info) {
      this.memoryUsageEstimate -= info.size || 0;
      this.resourceInfo.delete(id);
    }
  }

  private disposeResource(id: string): void {
    const geometry = this.geometries.get(id);
    if (geometry) {
      geometry.dispose();
      this.unregisterGeometry(id);
      return;
    }

    const material = this.materials.get(id);
    if (material) {
      material.dispose();
      this.unregisterMaterial(id);
      return;
    }

    const texture = this.textures.get(id);
    if (texture) {
      texture.dispose();
      this.unregisterTexture(id);
      return;
    }

    const renderTarget = this.renderTargets.get(id);
    if (renderTarget) {
      renderTarget.dispose();
      this.renderTargets.delete(id);
      this.removeResourceInfo(id);
    }
  }

  private cleanupPools(): void {
    // Clean up geometry pools
    for (const [type, pool] of this.geometryPool.entries()) {
      if (pool.length === 0) {
        this.geometryPool.delete(type);
      }
    }

    // Clean up material pools
    for (const [type, pool] of this.materialPool.entries()) {
      if (pool.length === 0) {
        this.materialPool.delete(type);
      }
    }

    // Clean up mesh pools
    for (const [type, pool] of this.meshPool.entries()) {
      if (pool.length === 0) {
        this.meshPool.delete(type);
      }
    }
  }

  private clearAllPools(): void {
    // Dispose all pooled geometries
    for (const pool of this.geometryPool.values()) {
      for (const geometry of pool) {
        geometry.dispose();
      }
    }
    this.geometryPool.clear();

    // Dispose all pooled materials
    for (const pool of this.materialPool.values()) {
      for (const material of pool) {
        material.dispose();
      }
    }
    this.materialPool.clear();

    // Clear mesh pools
    this.meshPool.clear();
  }

  private startPeriodicCleanup(): void {
    const cleanupLoop = () => {
      if (this.disposed) return;

      const now = Date.now();
      if (now - this.lastCleanup > this.cleanupInterval) {
        this.cleanup();
      }

      setTimeout(cleanupLoop, 1000);
    };

    setTimeout(cleanupLoop, 1000);
  }

  private estimateGeometrySize(geometry: THREE.BufferGeometry): number {
    let size = 0;
    
    for (const attribute of Object.values(geometry.attributes)) {
      if (attribute instanceof THREE.BufferAttribute) {
        size += attribute.array.byteLength;
      }
    }
    
    if (geometry.index) {
      size += geometry.index.array.byteLength;
    }
    
    return size;
  }

  private estimateMaterialSize(material: THREE.Material): number {
    let size = 1024; // Base material size estimate
    
    // Estimate texture sizes
    material.traverse((child) => {
      if (child instanceof THREE.Texture) {
        size += this.estimateTextureSize(child);
      }
    });
    
    return size;
  }

  private estimateTextureSize(texture: THREE.Texture): number {
    if (texture.image) {
      const width = texture.image.width || 256;
      const height = texture.image.height || 256;
      const bytesPerPixel = 4; // RGBA
      return width * height * bytesPerPixel;
    }
    return 256 * 256 * 4; // Default estimate
  }

  private estimateMeshSize(mesh: THREE.Mesh | THREE.InstancedMesh): number {
    let size = 0;
    
    if (mesh.geometry) {
      size += this.estimateGeometrySize(mesh.geometry);
    }
    
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        for (const mat of mesh.material) {
          size += this.estimateMaterialSize(mat);
        }
      } else {
        size += this.estimateMaterialSize(mesh.material);
      }
    }
    
    if (mesh instanceof THREE.InstancedMesh) {
      size += mesh.count * 64; // Estimated instance matrix size
    }
    
    return size;
  }

  private generateResourceId(type: string, name: string): string {
    return `${type}_${name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMeshId(mesh: THREE.Mesh | THREE.InstancedMesh): string {
    return `mesh_${mesh.id}_${Date.now()}`;
  }
}

// Singleton instance for global use
export const threeResourceManager = new ThreeResourceManager();

// Hook for React components
export function useThreeResourceManager() {
  return threeResourceManager;
}