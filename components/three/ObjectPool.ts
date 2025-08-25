import * as THREE from 'three';

/**
 * Generic object pool for efficient memory management
 * Reduces garbage collection overhead by reusing objects
 */
export class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn?: (obj: T) => void;
  private maxSize: number;

  constructor(
    createFn: () => T,
    resetFn?: (obj: T) => void,
    initialSize: number = 10,
    maxSize: number = 1000
  ) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.maxSize = maxSize;

    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }

  public acquire(): T {
    let obj = this.pool.pop();
    if (!obj) {
      obj = this.createFn();
    }
    return obj;
  }

  public release(obj: T): void {
    if (this.pool.length < this.maxSize) {
      if (this.resetFn) {
        this.resetFn(obj);
      }
      this.pool.push(obj);
    }
  }

  public clear(): void {
    this.pool.length = 0;
  }

  public getPoolSize(): number {
    return this.pool.length;
  }
}

/**
 * Specialized pools for Three.js objects
 */
export class ThreeObjectPools {
  private static instance: ThreeObjectPools;
  
  public readonly vector3Pool: ObjectPool<THREE.Vector3>;
  public readonly matrix4Pool: ObjectPool<THREE.Matrix4>;
  public readonly quaternionPool: ObjectPool<THREE.Quaternion>;
  public readonly colorPool: ObjectPool<THREE.Color>;
  public readonly spherePool: ObjectPool<THREE.Sphere>;
  public readonly boxPool: ObjectPool<THREE.Box3>;
  public readonly rayPool: ObjectPool<THREE.Ray>;

  private constructor() {
    // Vector3 pool
    this.vector3Pool = new ObjectPool(
      () => new THREE.Vector3(),
      (v) => v.set(0, 0, 0),
      50,
      200
    );

    // Matrix4 pool
    this.matrix4Pool = new ObjectPool(
      () => new THREE.Matrix4(),
      (m) => m.identity(),
      20,
      100
    );

    // Quaternion pool
    this.quaternionPool = new ObjectPool(
      () => new THREE.Quaternion(),
      (q) => q.set(0, 0, 0, 1),
      20,
      100
    );

    // Color pool
    this.colorPool = new ObjectPool(
      () => new THREE.Color(),
      (c) => c.setHex(0xffffff),
      30,
      150
    );

    // Sphere pool for bounding volumes
    this.spherePool = new ObjectPool(
      () => new THREE.Sphere(),
      (s) => s.set(new THREE.Vector3(), 1),
      10,
      50
    );

    // Box3 pool for bounding boxes
    this.boxPool = new ObjectPool(
      () => new THREE.Box3(),
      (b) => b.makeEmpty(),
      10,
      50
    );

    // Ray pool for raycasting
    this.rayPool = new ObjectPool(
      () => new THREE.Ray(),
      (r) => r.set(new THREE.Vector3(), new THREE.Vector3(0, 0, 1)),
      5,
      25
    );
  }

  public static getInstance(): ThreeObjectPools {
    if (!ThreeObjectPools.instance) {
      ThreeObjectPools.instance = new ThreeObjectPools();
    }
    return ThreeObjectPools.instance;
  }

  public dispose(): void {
    this.vector3Pool.clear();
    this.matrix4Pool.clear();
    this.quaternionPool.clear();
    this.colorPool.clear();
    this.spherePool.clear();
    this.boxPool.clear();
    this.rayPool.clear();
  }
}

/**
 * Particle-specific object pool for efficient particle management
 */
export interface PooledParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  basePosition: THREE.Vector3;
  color: THREE.Color;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
  phase: number;
  active: boolean;
  id: number;
}

export class ParticlePool {
  private pool: PooledParticle[] = [];
  private activeParticles: PooledParticle[] = [];
  private maxParticles: number;
  private nextId = 0;

  constructor(maxParticles: number = 1000) {
    this.maxParticles = maxParticles;
    
    // Pre-allocate particles
    for (let i = 0; i < maxParticles; i++) {
      this.pool.push(this.createParticle());
    }
  }

  private createParticle(): PooledParticle {
    return {
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      acceleration: new THREE.Vector3(),
      basePosition: new THREE.Vector3(),
      color: new THREE.Color(),
      life: 0,
      maxLife: 100,
      size: 1,
      opacity: 1,
      phase: 0,
      active: false,
      id: this.nextId++
    };
  }

  public spawnParticle(config?: Partial<PooledParticle>): PooledParticle | null {
    if (this.pool.length === 0) {
      return null; // Pool exhausted
    }

    const particle = this.pool.pop()!;
    
    // Reset particle
    particle.position.set(0, 0, 0);
    particle.velocity.set(0, 0, 0);
    particle.acceleration.set(0, 0, 0);
    particle.basePosition.set(0, 0, 0);
    particle.color.setHex(0xffffff);
    particle.life = 0;
    particle.maxLife = 100;
    particle.size = 1;
    particle.opacity = 1;
    particle.phase = Math.random() * Math.PI * 2;
    particle.active = true;

    // Apply configuration
    if (config) {
      Object.assign(particle, config);
    }

    this.activeParticles.push(particle);
    return particle;
  }

  public releaseParticle(particle: PooledParticle): void {
    const index = this.activeParticles.indexOf(particle);
    if (index !== -1) {
      this.activeParticles.splice(index, 1);
      particle.active = false;
      this.pool.push(particle);
    }
  }

  public updateParticles(deltaTime: number): void {
    for (let i = this.activeParticles.length - 1; i >= 0; i--) {
      const particle = this.activeParticles[i];
      
      // Update particle life
      particle.life += deltaTime;
      
      // Check if particle should be released
      if (particle.life >= particle.maxLife) {
        this.releaseParticle(particle);
        continue;
      }
      
      // Update physics
      particle.velocity.add(particle.acceleration);
      particle.position.add(particle.velocity);
      
      // Apply damping
      particle.velocity.multiplyScalar(0.99);
    }
  }

  public getActiveParticles(): PooledParticle[] {
    return this.activeParticles;
  }

  public getActiveCount(): number {
    return this.activeParticles.length;
  }

  public getPoolSize(): number {
    return this.pool.length;
  }

  public dispose(): void {
    this.activeParticles.length = 0;
    this.pool.length = 0;
  }
}

/**
 * Geometry pool for reusing buffer geometries
 */
export class GeometryPool {
  private geometryPools: Map<string, ObjectPool<THREE.BufferGeometry>> = new Map();

  public getGeometry(type: string, createFn: () => THREE.BufferGeometry): THREE.BufferGeometry {
    let pool = this.geometryPools.get(type);
    
    if (!pool) {
      pool = new ObjectPool(
        createFn,
        (geometry) => {
          // Clear existing attributes
          const attributes = geometry.attributes;
          for (const key in attributes) {
            geometry.deleteAttribute(key);
          }
          geometry.setIndex(null);
        },
        5,
        20
      );
      this.geometryPools.set(type, pool);
    }

    return pool.acquire();
  }

  public releaseGeometry(type: string, geometry: THREE.BufferGeometry): void {
    const pool = this.geometryPools.get(type);
    if (pool) {
      pool.release(geometry);
    } else {
      geometry.dispose();
    }
  }

  public dispose(): void {
    this.geometryPools.forEach(pool => pool.clear());
    this.geometryPools.clear();
  }
}

/**
 * Material pool for reusing shader materials
 */
export class MaterialPool {
  private materialPools: Map<string, ObjectPool<THREE.Material>> = new Map();

  public getMaterial(type: string, createFn: () => THREE.Material): THREE.Material {
    let pool = this.materialPools.get(type);
    
    if (!pool) {
      pool = new ObjectPool(
        createFn,
        (material) => {
          // Reset material properties to defaults
          if (material instanceof THREE.ShaderMaterial) {
            // Reset shader uniforms to default values
            const uniforms = material.uniforms;
            for (const key in uniforms) {
              if (uniforms[key].value instanceof THREE.Vector3) {
                uniforms[key].value.set(0, 0, 0);
              } else if (uniforms[key].value instanceof THREE.Color) {
                uniforms[key].value.setHex(0xffffff);
              } else if (typeof uniforms[key].value === 'number') {
                uniforms[key].value = 0;
              }
            }
          }
          material.needsUpdate = true;
        },
        3,
        15
      );
      this.materialPools.set(type, pool);
    }

    return pool.acquire();
  }

  public releaseMaterial(type: string, material: THREE.Material): void {
    const pool = this.materialPools.get(type);
    if (pool) {
      pool.release(material);
    } else {
      material.dispose();
    }
  }

  public dispose(): void {
    this.materialPools.forEach(pool => {
      pool.clear();
    });
    this.materialPools.clear();
  }
}

// Export singleton instances
export const threeObjectPools = ThreeObjectPools.getInstance();
export const particlePool = new ParticlePool(500);
export const geometryPool = new GeometryPool();
export const materialPool = new MaterialPool();