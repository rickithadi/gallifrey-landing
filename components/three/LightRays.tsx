import * as THREE from 'three';

import React, { useCallback, useMemo, useRef } from 'react';

import { useFrame } from '@react-three/fiber';

interface LightRaysProps {
  variant: 'original' | 'lightweight';
  mousePosition: THREE.Vector3;
  time: number;
}

// Optimized vertex shader for light rays with instanced rendering
const lightRayVertexShader = `
  uniform float time;
  uniform vec3 lightSource;
  uniform float intensity;
  uniform float performanceLevel;

  attribute vec3 instancePosition;
  attribute float instanceRotation;
  attribute float instanceScale;
  attribute float instanceIntensity;

  varying vec2 vUv;
  varying float vDistanceFromLight;
  varying float vIntensity;
  varying float vInstanceIntensity;

  mat3 rotationZ(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(
      c, -s, 0.0,
      s, c, 0.0,
      0.0, 0.0, 1.0
    );
  }

  void main() {
    vUv = uv;
    vInstanceIntensity = instanceIntensity;

    // Apply instance transformations
    vec3 transformedPosition = position * instanceScale;
    transformedPosition = rotationZ(instanceRotation) * transformedPosition;
    transformedPosition += instancePosition;

    vec3 worldPosition = (modelMatrix * vec4(transformedPosition, 1.0)).xyz;
    vDistanceFromLight = distance(worldPosition.xy, lightSource.xy);

    // Simplified intensity calculation for performance
    if (performanceLevel > 0.5) {
      vec3 toLight = normalize(lightSource - worldPosition);
      float angle = dot(normalize(transformedPosition), toLight);
      vIntensity = intensity * instanceIntensity * max(0.0, angle) / (1.0 + vDistanceFromLight * 0.1);
    } else {
      // Simplified calculation for low performance
      vIntensity = intensity * instanceIntensity / (1.0 + vDistanceFromLight * 0.2);
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformedPosition, 1.0);
  }
`;

// Optimized fragment shader with reduced calculations
const lightRayFragmentShader = `
  uniform vec3 rayColor;
  uniform float opacity;
  uniform float time;
  uniform float performanceLevel;

  varying vec2 vUv;
  varying float vDistanceFromLight;
  varying float vIntensity;
  varying float vInstanceIntensity;

  void main() {
    // Adaptive ray pattern complexity
    float rayPattern;
    if (performanceLevel > 0.7) {
      // High quality: complex pattern with multiple harmonics
      rayPattern = sin(vUv.y * 3.14159 * 8.0 + time * 2.0) * 0.5 + 0.5;
      rayPattern = pow(rayPattern, 3.0);
    } else if (performanceLevel > 0.3) {
      // Medium quality: simplified pattern
      rayPattern = sin(vUv.y * 3.14159 * 4.0 + time) * 0.5 + 0.5;
      rayPattern = pow(rayPattern, 2.0);
    } else {
      // Low quality: basic gradient
      rayPattern = 1.0 - vUv.y;
    }

    // Optimized fade calculations
    float centerFade = 1.0 - smoothstep(0.1, 1.0, abs(vUv.x - 0.5) * 2.0);
    float lengthFade = 1.0 - vUv.y; // Simplified length fade

    // Conditional flicker for performance
    float flicker = 1.0;
    if (performanceLevel > 0.5) {
      flicker = sin(time * 3.0 + vDistanceFromLight) * 0.1 + 0.9;
    }

    float alpha = opacity * rayPattern * centerFade * lengthFade * vIntensity * vInstanceIntensity * flicker;

    gl_FragColor = vec4(rayColor, alpha);
  }
`;

export function LightRays({ variant, mousePosition, time }: LightRaysProps) {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const performanceLevel = useRef(1.0);
  const frameCounter = useRef(0);
  const adaptiveRayCount = useRef(12);

  // Color scheme for light rays
  const rayColor = useMemo(() => {
    if (variant === 'lightweight') {
      return new THREE.Color('#60A5FA'); // Light blue
    }
    return new THREE.Color('#3B82F6'); // Professional blue
  }, [variant]);

  // Create instanced geometry and material for better performance
  const { geometry, material, instanceData } = useMemo(() => {
    const maxRayCount = 12;
    const rayGeometry = new THREE.PlaneGeometry(0.05, 8, 1, 8); // Reduced segments for performance

    const rayMaterial = new THREE.ShaderMaterial({
      vertexShader: lightRayVertexShader,
      fragmentShader: lightRayFragmentShader,
      uniforms: {
        time: { value: 0 },
        lightSource: { value: mousePosition },
        rayColor: { value: rayColor },
        opacity: { value: 0.6 },
        intensity: { value: 1.0 },
        performanceLevel: { value: 1.0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Create instance data
    const instancePositions = new Float32Array(maxRayCount * 3);
    const instanceRotations = new Float32Array(maxRayCount);
    const instanceScales = new Float32Array(maxRayCount);
    const instanceIntensities = new Float32Array(maxRayCount);

    for (let i = 0; i < maxRayCount; i++) {
      const angle = (i / maxRayCount) * Math.PI * 2;

      // Position (rays emanate from center)
      instancePositions[i * 3] = 0;
      instancePositions[i * 3 + 1] = 0;
      instancePositions[i * 3 + 2] = 0;

      // Rotation
      instanceRotations[i] = angle;

      // Scale (slight variation)
      instanceScales[i] = 0.8 + Math.random() * 0.4;

      // Intensity (variation for dynamic effect)
      instanceIntensities[i] = 0.5 + Math.random() * 0.5;
    }

    return {
      geometry: rayGeometry,
      material: rayMaterial,
      instanceData: {
        positions: instancePositions,
        rotations: instanceRotations,
        scales: instanceScales,
        intensities: instanceIntensities,
      }
    };
  }, [rayColor, mousePosition]);

  // Performance monitoring function
  const adaptPerformance = useCallback((currentFPS: number) => {
    if (currentFPS < 30) {
      performanceLevel.current = 0.2;
      adaptiveRayCount.current = 6;
    } else if (currentFPS < 45) {
      performanceLevel.current = 0.5;
      adaptiveRayCount.current = 8;
    } else {
      performanceLevel.current = 1.0;
      adaptiveRayCount.current = 12;
    }
  }, []);

  // Setup instanced mesh attributes
  useFrame((state, delta) => {
    if (!instancedMeshRef.current) return;

    frameCounter.current++;

    // Performance monitoring every 60 frames
    if (frameCounter.current % 60 === 0) {
      const currentFPS = 1000 / (delta * 1000 || 16.67);
      adaptPerformance(currentFPS);
    }

    // Position instanced mesh at mouse location
    instancedMeshRef.current.position.copy(mousePosition);

    // Update shader uniforms
    if (material.uniforms) {
      material.uniforms.time.value = time;
      material.uniforms.lightSource.value.copy(mousePosition);
      material.uniforms.performanceLevel.value = performanceLevel.current;
    }

    // Update instance matrices based on adaptive ray count
    const dummy = new THREE.Object3D();
    for (let i = 0; i < adaptiveRayCount.current; i++) {
      const angle = (i / adaptiveRayCount.current) * Math.PI * 2;

      // Add slight rotation animation
      const animatedAngle = angle + Math.sin(time + i) * 0.1;

      dummy.position.set(0, 0, 0);
      dummy.rotation.z = animatedAngle;

      // Vary scale based on time for dynamic effect
      const scaleVariation = 0.8 + Math.sin(time * 2 + i) * 0.2;
      dummy.scale.setScalar(scaleVariation);

      dummy.updateMatrix();
      instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
    }

    // Hide unused instances by scaling them to zero
    for (let i = adaptiveRayCount.current; i < 12; i++) {
      dummy.position.set(0, 0, 0);
      dummy.scale.setScalar(0);
      dummy.updateMatrix();
      instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
    }

    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[geometry, material, 12]} // Max 12 instances
      frustumCulled={false}
    >
      <bufferGeometry attach="geometry" {...geometry} />
      <shaderMaterial attach="material" {...material} />
    </instancedMesh>
  );
}
