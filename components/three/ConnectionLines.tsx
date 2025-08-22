import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ConnectionLinesProps {
  particleCount: number;
  variant: 'original' | 'lightweight';
  mousePosition: THREE.Vector3;
  time: number;
}

export function ConnectionLines({ particleCount, variant, time }: ConnectionLinesProps) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const particlePositions = useRef<Float32Array>(new Float32Array(particleCount * 3));

  // Connection parameters
  const maxConnections = Math.min(particleCount * 2, 200); // Limit for performance
  const connectionDistance = 2.5;

  // Create geometry for lines
  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(maxConnections * 6); // 2 vertices per line, 3 coords per vertex
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [maxConnections]);

  // Material with brand colors
  const material = useMemo(() => {
    const color = variant === 'lightweight' ? '#2D5A87' : '#6B7280';
    return new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      vertexColors: false,
    });
  }, [variant]);

  // Update connections
  useFrame(() => {
    if (!linesRef.current) return;

    const positions = geometry.attributes.position.array as Float32Array;
    let connectionIndex = 0;

    // Generate some sample particle positions (in real app, these would come from ParticleSystem)
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + time * 0.1;
      const radius = 3 + Math.sin(time + i) * 0.5;
      
      particlePositions.current[i * 3] = Math.cos(angle) * radius;
      particlePositions.current[i * 3 + 1] = Math.sin(angle) * radius + Math.sin(time + i * 0.5) * 0.5;
      particlePositions.current[i * 3 + 2] = Math.sin(time + i * 0.3) * 0.5;
    }

    // Create connections between nearby particles
    for (let i = 0; i < particleCount && connectionIndex < maxConnections; i++) {
      const pos1 = new THREE.Vector3(
        particlePositions.current[i * 3],
        particlePositions.current[i * 3 + 1],
        particlePositions.current[i * 3 + 2]
      );

      for (let j = i + 1; j < particleCount && connectionIndex < maxConnections; j++) {
        const pos2 = new THREE.Vector3(
          particlePositions.current[j * 3],
          particlePositions.current[j * 3 + 1],
          particlePositions.current[j * 3 + 2]
        );

        const distance = pos1.distanceTo(pos2);
        
        if (distance < connectionDistance) {
          // Add line between particles
          positions[connectionIndex * 6] = pos1.x;
          positions[connectionIndex * 6 + 1] = pos1.y;
          positions[connectionIndex * 6 + 2] = pos1.z;
          
          positions[connectionIndex * 6 + 3] = pos2.x;
          positions[connectionIndex * 6 + 4] = pos2.y;
          positions[connectionIndex * 6 + 5] = pos2.z;
          
          connectionIndex++;
        }
      }
    }

    // Clear unused connection slots
    for (let i = connectionIndex; i < maxConnections; i++) {
      positions[i * 6] = 0;
      positions[i * 6 + 1] = 0;
      positions[i * 6 + 2] = 0;
      positions[i * 6 + 3] = 0;
      positions[i * 6 + 4] = 0;
      positions[i * 6 + 5] = 0;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.setDrawRange(0, connectionIndex * 2);
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry} material={material} />
  );
}