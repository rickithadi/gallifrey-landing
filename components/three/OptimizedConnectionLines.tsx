import React, { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { performanceMonitor } from './PerformanceMonitor';
import { threeObjectPools } from './ObjectPool';
import {
  connectionVertexShader,
  connectionFragmentShader
} from './shaders/ParticleShaders';

interface OptimizedConnectionLinesProps {
  particles: Array<{ position: THREE.Vector3; id: number }>;
  mousePosition: THREE.Vector3;
  time: number;
  variant: 'original' | 'lightweight';
}

interface Connection {
  particleA: number;
  particleB: number;
  distance: number;
  strength: number;
  id: number;
}

interface SpatialCell {
  particles: number[];
  bounds: THREE.Box3;
}

/**
 * Spatial hash grid for efficient nearest neighbor queries
 */
class SpatialHashGrid {
  private cellSize: number;
  private grid: Map<string, SpatialCell> = new Map();
  private bounds: THREE.Box3;
  
  constructor(cellSize: number = 2.0) {
    this.cellSize = cellSize;
    this.bounds = new THREE.Box3();
  }
  
  private getKey(x: number, y: number, z: number): string {
    const gx = Math.floor(x / this.cellSize);
    const gy = Math.floor(y / this.cellSize);
    const gz = Math.floor(z / this.cellSize);
    return `${gx},${gy},${gz}`;
  }
  
  public clear(): void {
    this.grid.clear();
  }
  
  public insert(particleIndex: number, position: THREE.Vector3): void {
    const key = this.getKey(position.x, position.y, position.z);
    
    if (!this.grid.has(key)) {
      const bounds = new THREE.Box3(
        new THREE.Vector3(
          Math.floor(position.x / this.cellSize) * this.cellSize,
          Math.floor(position.y / this.cellSize) * this.cellSize,
          Math.floor(position.z / this.cellSize) * this.cellSize
        ),
        new THREE.Vector3(
          (Math.floor(position.x / this.cellSize) + 1) * this.cellSize,
          (Math.floor(position.y / this.cellSize) + 1) * this.cellSize,
          (Math.floor(position.z / this.cellSize) + 1) * this.cellSize
        )
      );
      
      this.grid.set(key, {
        particles: [],
        bounds
      });
    }
    
    this.grid.get(key)!.particles.push(particleIndex);
  }
  
  public getNearby(position: THREE.Vector3, radius: number): number[] {
    const nearby: number[] = [];
    const cellRadius = Math.ceil(radius / this.cellSize);
    
    const centerX = Math.floor(position.x / this.cellSize);
    const centerY = Math.floor(position.y / this.cellSize);
    const centerZ = Math.floor(position.z / this.cellSize);
    
    for (let dx = -cellRadius; dx <= cellRadius; dx++) {
      for (let dy = -cellRadius; dy <= cellRadius; dy++) {
        for (let dz = -cellRadius; dz <= cellRadius; dz++) {
          const key = `${centerX + dx},${centerY + dy},${centerZ + dz}`;
          const cell = this.grid.get(key);
          
          if (cell) {
            nearby.push(...cell.particles);
          }
        }
      }
    }
    
    return nearby;
  }
}

export function OptimizedConnectionLines({
  particles,
  mousePosition,
  time,
  variant
}: OptimizedConnectionLinesProps) {
  const connectionSystemRef = useRef<THREE.LineSegments>(null);
  const spatialGrid = useRef<SpatialHashGrid>(new SpatialHashGrid(3.0));
  const connectionsRef = useRef<Connection[]>([]);
  const uniformsRef = useRef<Record<string, THREE.IUniform>>();
  
  // Performance settings
  const quality = performanceMonitor.getCurrentQuality();
  const maxConnectionDistance = variant === 'lightweight' ? 2.0 : 2.5;
  const maxConnections = Math.min(quality.maxConnections, particles.length * 2);
  
  // Optimized geometry and material
  const { geometry, material } = useMemo(() => {
    // Create connection geometry
    const geometry = new THREE.BufferGeometry();
    
    // Pre-allocate maximum possible connections
    const maxPossibleConnections = maxConnections;
    const positions = new Float32Array(maxPossibleConnections * 6); // 2 vertices per line, 3 coords per vertex
    const strengths = new Float32Array(maxPossibleConnections * 2); // 2 vertices per line
    const connectionIds = new Float32Array(maxPossibleConnections * 2);
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('connectionStrength', new THREE.BufferAttribute(strengths, 1));
    geometry.setAttribute('connectionId', new THREE.BufferAttribute(connectionIds, 1));
    
    // Set initial draw range to 0
    geometry.setDrawRange(0, 0);
    
    // Shader uniforms
    const uniforms = {
      time: { value: 0 },
      opacity: { value: variant === 'lightweight' ? 0.3 : 0.4 },
      maxDistance: { value: maxConnectionDistance },
      fadeDistance: { value: maxConnectionDistance * 0.8 }
    };
    
    uniformsRef.current = uniforms;
    
    // Optimized shader material
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: connectionVertexShader,
      fragmentShader: connectionFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: false
    });
    
    return { geometry, material };
  }, [maxConnections, maxConnectionDistance, variant]);
  
  // Efficient connection calculation using spatial partitioning
  const updateConnections = useCallback(() => {
    if (!quality.connectionLines || particles.length < 2) {
      return [];
    }
    
    // Clear and rebuild spatial grid
    spatialGrid.current.clear();
    
    // Insert all particles into spatial grid
    particles.forEach((particle, index) => {
      spatialGrid.current.insert(index, particle.position);
    });
    
    const connections: Connection[] = [];
    const processedPairs = new Set<string>();
    
    // Find connections using spatial partitioning
    for (let i = 0; i < particles.length && connections.length < maxConnections; i++) {
      const particleA = particles[i];
      
      // Get nearby particles using spatial grid
      const nearbyIndices = spatialGrid.current.getNearby(
        particleA.position,
        maxConnectionDistance
      );
      
      for (const j of nearbyIndices) {
        if (i >= j || connections.length >= maxConnections) continue;
        
        const pairKey = `${Math.min(i, j)}-${Math.max(i, j)}`;
        if (processedPairs.has(pairKey)) continue;
        processedPairs.add(pairKey);
        
        const particleB = particles[j];
        const distance = particleA.position.distanceTo(particleB.position);
        
        if (distance <= maxConnectionDistance) {
          // Calculate connection strength based on distance and mouse proximity
          const normalizedDistance = distance / maxConnectionDistance;
          const baseStrength = 1.0 - normalizedDistance;
          
          // Mouse influence on connection strength
          const midPoint = threeObjectPools.vector3Pool.acquire();
          midPoint.lerpVectors(particleA.position, particleB.position, 0.5);
          const mouseDistance = midPoint.distanceTo(mousePosition);
          const mouseInfluence = Math.max(0, 1.0 - mouseDistance / 5.0);
          
          const finalStrength = baseStrength * (0.7 + 0.3 * mouseInfluence);
          
          connections.push({
            particleA: i,
            particleB: j,
            distance,
            strength: finalStrength,
            id: connections.length
          });
          
          threeObjectPools.vector3Pool.release(midPoint);
        }
      }
    }
    
    return connections;
  }, [particles, mousePosition, maxConnectionDistance, maxConnections, quality.connectionLines]);
  
  // Animation frame update
  useFrame(() => {
    if (!connectionSystemRef.current || !uniformsRef.current) return;
    
    // Skip connection updates if performance is low
    const metrics = performanceMonitor.updateMetrics();
    if (metrics.averageFPS < 30) {
      return;
    }
    
    // Update uniforms
    uniformsRef.current.time.value = time;
    
    // Update connections (throttled for performance)
    if (Math.random() < 0.3) { // Update 30% of frames
      const connections = updateConnections();
      connectionsRef.current = connections;
      
      // Update geometry buffers
      const positions = geometry.attributes.position.array as Float32Array;
      const strengths = geometry.attributes.connectionStrength.array as Float32Array;
      const connectionIds = geometry.attributes.connectionId.array as Float32Array;
      
      let bufferIndex = 0;
      
      connections.forEach((connection) => {
        if (bufferIndex >= positions.length - 6) return; // Prevent buffer overflow
        
        const particleA = particles[connection.particleA];
        const particleB = particles[connection.particleB];
        
        // First vertex (particle A)
        positions[bufferIndex] = particleA.position.x;
        positions[bufferIndex + 1] = particleA.position.y;
        positions[bufferIndex + 2] = particleA.position.z;
        strengths[bufferIndex / 3] = connection.strength;
        connectionIds[bufferIndex / 3] = connection.id;
        
        // Second vertex (particle B)
        positions[bufferIndex + 3] = particleB.position.x;
        positions[bufferIndex + 4] = particleB.position.y;
        positions[bufferIndex + 5] = particleB.position.z;
        strengths[(bufferIndex + 3) / 3] = connection.strength;
        connectionIds[(bufferIndex + 3) / 3] = connection.id;
        
        bufferIndex += 6;
      });
      
      // Clear unused buffer space
      for (let i = bufferIndex; i < positions.length; i += 6) {
        positions[i] = 0;
        positions[i + 1] = 0;
        positions[i + 2] = 0;
        positions[i + 3] = 0;
        positions[i + 4] = 0;
        positions[i + 5] = 0;
        
        if (i / 3 < strengths.length) {
          strengths[i / 3] = 0;
          connectionIds[i / 3] = 0;
        }
        if ((i + 3) / 3 < strengths.length) {
          strengths[(i + 3) / 3] = 0;
          connectionIds[(i + 3) / 3] = 0;
        }
      }
      
      // Update buffer attributes
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.connectionStrength.needsUpdate = true;
      geometry.attributes.connectionId.needsUpdate = true;
      
      // Set draw range to only render valid connections
      geometry.setDrawRange(0, connections.length * 2);
    }
  });
  
  // Don't render if connections are disabled
  if (!quality.connectionLines) {
    return null;
  }
  
  return (
    <lineSegments
      ref={connectionSystemRef}
      geometry={geometry}
      material={material}
      frustumCulled={true}
    />
  );
}