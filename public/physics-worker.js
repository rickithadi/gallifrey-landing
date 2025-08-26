/**
 * Physics Worker for Particle System
 * Handles intensive calculations off the main thread
 * Implements optimized flocking algorithms and spatial partitioning
 */

// Simple 3D vector math utilities for the worker
class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  copy(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  multiply(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  divide(scalar) {
    this.x /= scalar;
    this.y /= scalar;
    this.z /= scalar;
    return this;
  }

  distanceToSquared(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
  }

  normalize() {
    const length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    if (length > 0) {
      this.x /= length;
      this.y /= length;
      this.z /= length;
    }
    return this;
  }

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }
}

// Spatial Hash Grid implementation for the worker
class WorkerSpatialGrid {
  constructor(cellSize = 2.5) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }

  getGridKey(position) {
    const x = Math.floor(position.x / this.cellSize);
    const y = Math.floor(position.y / this.cellSize);
    const z = Math.floor(position.z / this.cellSize);
    return `${x},${y},${z}`;
  }

  getNeighborKeys(position, radius) {
    const keys = [];
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

  clear() {
    this.grid.clear();
  }

  insert(particle) {
    const key = this.getGridKey(particle.position);
    
    if (!this.grid.has(key)) {
      this.grid.set(key, []);
    }
    
    this.grid.get(key).push(particle);
  }

  queryRadius(position, radius) {
    const radiusSquared = radius * radius;
    const neighbors = [];
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
}

// Cache for expensive trigonometric calculations
class WorkerCalculationCache {
  constructor() {
    this.trigCache = new Map();
    this.maxCacheSize = 1000;
  }

  sin(angle, precision = 100) {
    const key = Math.round(angle * precision).toString();
    
    if (!this.trigCache.has(key)) {
      if (this.trigCache.size >= this.maxCacheSize) {
        this.trigCache.clear();
      }
      this.trigCache.set(key, Math.sin(angle));
    }
    
    return this.trigCache.get(key);
  }

  cos(angle, precision = 100) {
    const key = `cos_${Math.round(angle * precision)}`;
    
    if (!this.trigCache.has(key)) {
      if (this.trigCache.size >= this.maxCacheSize) {
        this.trigCache.clear();
      }
      this.trigCache.set(key, Math.cos(angle));
    }
    
    return this.trigCache.get(key);
  }

  clear() {
    this.trigCache.clear();
  }
}

// Initialize worker state
const spatialGrid = new WorkerSpatialGrid();
const calculationCache = new WorkerCalculationCache();

// Optimized flocking calculation
function calculateFlockingForces(particle, neighbors, settings) {
  const clusterForce = new Vector3();
  const separationForce = new Vector3();
  const alignmentForce = new Vector3();
  
  let neighborCount = 0;
  const maxNeighbors = settings.maxFlockingNeighbors || 8;
  const flockRadius = settings.flockingRadius || 2.0;
  const separationRadius = settings.separationRadius || 0.8;
  const flockRadiusSquared = flockRadius * flockRadius;
  const separationRadiusSquared = separationRadius * separationRadius;
  
  // Process only nearby neighbors (limited for performance)
  for (let j = 0; j < Math.min(neighbors.length, maxNeighbors); j++) {
    const otherParticle = neighbors[j];
    if (otherParticle.index === particle.index) continue;
    
    const distanceSquared = particle.position.distanceToSquared(otherParticle.position);
    
    if (distanceSquared < flockRadiusSquared && distanceSquared > 0) {
      neighborCount++;
      
      // Cohesion - move toward center of nearby particles
      clusterForce.add(otherParticle.position);
      
      // Alignment - align velocity with nearby particles
      alignmentForce.add(otherParticle.velocity);
      
      // Separation - avoid crowding
      if (distanceSquared < separationRadiusSquared) {
        const separationDir = new Vector3()
          .copy(particle.position)
          .sub(otherParticle.position)
          .normalize()
          .multiply(1 / Math.sqrt(distanceSquared));
        separationForce.add(separationDir);
      }
    }
  }
  
  if (neighborCount > 0) {
    // Apply cohesion
    clusterForce.divide(neighborCount).sub(particle.position);
    clusterForce.multiply(0.001);
    
    // Apply alignment
    alignmentForce.divide(neighborCount).sub(particle.velocity);
    alignmentForce.multiply(0.002);
    
    // Apply separation
    separationForce.multiply(0.003);
    
    // Add flocking forces to velocity
    particle.velocity.add(clusterForce).add(alignmentForce).add(separationForce);
  }
}

// Optimized mouse interaction calculation
function calculateMouseInteraction(particle, mouseData, interactionState) {
  const distanceSquared = particle.position.distanceToSquared(mouseData.position);
  
  if (distanceSquared < mouseData.radiusSquared) {
    const distance = Math.sqrt(distanceSquared);
    const interactionStrength = 1 - (distance / mouseData.radius);
    const mode = interactionState.mode || 'attract';
    
    const forceDirection = new Vector3();
    
    switch (mode) {
      case 'attract':
        forceDirection.copy(mouseData.position).sub(particle.position).normalize();
        forceDirection.multiply(interactionStrength * 0.008);
        break;
        
      case 'repel':
        forceDirection.copy(particle.position).sub(mouseData.position).normalize();
        forceDirection.multiply(interactionStrength * 0.012);
        break;
        
      case 'vortex':
        const angle = Math.atan2(
          particle.position.y - mouseData.position.y,
          particle.position.x - mouseData.position.x
        );
        const sinAngle = calculationCache.sin(angle);
        const cosAngle = calculationCache.cos(angle);
        
        forceDirection.set(
          -sinAngle * interactionStrength * 0.015,
          cosAngle * interactionStrength * 0.015,
          0
        );
        
        const radialForce = new Vector3()
          .copy(mouseData.position)
          .sub(particle.position)
          .normalize()
          .multiply(interactionStrength * 0.003);
        forceDirection.add(radialForce);
        break;
        
      case 'explosion':
        const chargeLevel = interactionState.chargeLevel || 0;
        if (chargeLevel > 0.1) {
          forceDirection.copy(particle.position).sub(mouseData.position).normalize();
          const explosionStrength = chargeLevel * interactionStrength * 0.025;
          forceDirection.multiply(explosionStrength);
          
          // Add randomness
          forceDirection.add(new Vector3(
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.005
          ));
        } else if (interactionState.isActive) {
          forceDirection.copy(mouseData.position).sub(particle.position).normalize();
          forceDirection.multiply(interactionStrength * 0.005);
        }
        break;
    }
    
    particle.velocity.add(forceDirection);
    particle.energy = Math.min(particle.energy + 0.015, 1.0);
    return true;
  }
  
  return false;
}

// Main physics update function
function updateParticlePhysics(data) {
  const { particles, mouseData, interactionState, settings, time, deltaTime } = data;
  
  // Clear and rebuild spatial grid
  spatialGrid.clear();
  
  // Convert plain objects back to Vector3 instances and insert into spatial grid
  const processedParticles = particles.map(p => ({
    ...p,
    position: new Vector3(p.position.x, p.position.y, p.position.z),
    velocity: new Vector3(p.velocity.x, p.velocity.y, p.velocity.z),
    basePosition: new Vector3(p.basePosition.x, p.basePosition.y, p.basePosition.z)
  }));
  
  processedParticles.forEach(particle => {
    spatialGrid.insert(particle);
  });
  
  const mousePosition = new Vector3(mouseData.position.x, mouseData.position.y, mouseData.position.z);
  const mouseDataWithVector = {
    ...mouseData,
    position: mousePosition
  };
  
  // Update each particle
  processedParticles.forEach((particle, i) => {
    // Skip update based on LOD
    if (particle.updateFrequency > 1 && (i % particle.updateFrequency !== 0)) {
      return;
    }
    
    // Mouse interaction
    const hadMouseInteraction = calculateMouseInteraction(particle, mouseDataWithVector, interactionState);
    if (!hadMouseInteraction) {
      particle.energy = Math.max(particle.energy - 0.005, 0.3);
    }
    
    // Flocking behavior using spatial grid
    if (settings.flockingEnabled && particle.qualityLevel !== 'low') {
      const neighbors = spatialGrid.queryRadius(particle.position, settings.flockingRadius);
      calculateFlockingForces(particle, neighbors, settings);
    }
    
    // Float animation using cached trigonometric functions
    const floatY = calculationCache.sin(time + particle.phase) * 0.5 + 
                  calculationCache.sin(time * 1.5 + particle.phase * 2) * 0.2;
    const floatX = calculationCache.cos(time * 0.7 + particle.phase) * 0.3;
    
    // Update position
    particle.position.add(particle.velocity);
    particle.position.y += floatY * 0.001;
    particle.position.x += floatX * 0.0005;
    
    // Boundary constraints
    const boundary = 10;
    if (Math.abs(particle.position.x) > boundary) {
      particle.velocity.x *= -0.7;
      particle.position.x = Math.sign(particle.position.x) * boundary;
    }
    if (Math.abs(particle.position.y) > boundary) {
      particle.velocity.y *= -0.7;
      particle.position.y = Math.sign(particle.position.y) * boundary;
    }
    
    // Return force
    const returnForce = new Vector3()
      .copy(particle.basePosition)
      .sub(particle.position)
      .multiply(0.001 * (1 - particle.energy * 0.5));
    particle.velocity.add(returnForce);
    
    // Damping
    particle.velocity.multiply(0.99 - particle.energy * 0.01);
    
    // Update lifecycle
    particle.lifecycle = Math.min(particle.lifecycle + deltaTime, particle.maxLifetime);
  });
  
  // Return updated particle data (convert Vector3 back to plain objects for transfer)
  return processedParticles.map(p => ({
    ...p,
    position: { x: p.position.x, y: p.position.y, z: p.position.z },
    velocity: { x: p.velocity.x, y: p.velocity.y, z: p.velocity.z },
    basePosition: { x: p.basePosition.x, y: p.basePosition.y, z: p.basePosition.z }
  }));
}

// Worker message handler
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'UPDATE_PHYSICS':
      try {
        const updatedParticles = updateParticlePhysics(data);
        self.postMessage({
          type: 'PHYSICS_UPDATED',
          data: updatedParticles
        });
      } catch (error) {
        self.postMessage({
          type: 'ERROR',
          error: error.message
        });
      }
      break;
      
    case 'CLEAR_CACHE':
      calculationCache.clear();
      self.postMessage({
        type: 'CACHE_CLEARED'
      });
      break;
      
    default:
      self.postMessage({
        type: 'ERROR',
        error: `Unknown message type: ${type}`
      });
  }
};

// Send ready signal
self.postMessage({
  type: 'WORKER_READY'
});