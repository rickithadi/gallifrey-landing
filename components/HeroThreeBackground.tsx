import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HeroThreeBackgroundProps {
  className?: string;
}

function GallifreyanRings() {
  const groupRef = useRef<THREE.Group>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Gallifreyan timepiece-inspired rings with subtle, sophisticated movement
  const rings = useMemo(() => {
    const ringConfigs = [
      // Outer timepiece ring - slow, majestic
      { radius: 2.5, thickness: 0.02, position: [0, 0, -3], speed: 0.05, opacity: 0.15, color: '#2D5A87', emissive: '#1B365D', segments: 60 },
      // Mid ring - moderate rotation
      { radius: 1.8, thickness: 0.025, position: [0, 0, -2], speed: -0.08, opacity: 0.25, color: '#234669', emissive: '#1F2937', segments: 32 },
      // Inner accent ring
      { radius: 1.2, thickness: 0.018, position: [0, 0, -1], speed: 0.12, opacity: 0.35, color: '#2D5A87', emissive: '#234669', segments: 24 },
      // Floating detail rings
      { radius: 0.4, thickness: 0.008, position: [1.5, 1.2, -0.5], speed: 0.2, opacity: 0.6, color: '#1F2937', emissive: '#2D5A87', segments: 16 },
      { radius: 0.3, thickness: 0.006, position: [-1.8, 0.8, -1.2], speed: -0.15, opacity: 0.5, color: '#234669', emissive: '#1F2937', segments: 12 },
      { radius: 0.5, thickness: 0.01, position: [2.2, -1.5, -2], speed: 0.18, opacity: 0.4, color: '#2D5A87', emissive: '#1B365D', segments: 20 },
    ];
    
    return ringConfigs;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating motion for the entire group
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      
      // Individual ring rotations and cursor avoidance
      groupRef.current.children.forEach((ring, index) => {
        const config = rings[index];
        
        // Faster spinning when cursor is near
        const distanceFromCursor = Math.sqrt(
          Math.pow(ring.position.x - mousePosition.x * 5, 2) + 
          Math.pow(ring.position.y - mousePosition.y * 5, 2)
        );
        const speedMultiplier = Math.max(0.5, 3 - distanceFromCursor * 0.5);
        
        // Subtle Gallifreyan timepiece rotation - elegant and purposeful
        const time = state.clock.elapsedTime;
        
        // Primary rotation on Z-axis (clockwise/counterclockwise like timepiece)
        ring.rotation.z += config.speed * 0.003 * speedMultiplier;
        
        // Very subtle X and Y wobbles for organic feel
        ring.rotation.x = Math.sin(time * 0.1 + index * 0.3) * 0.02;
        ring.rotation.y = Math.cos(time * 0.08 + index * 0.5) * 0.015;
        
        // Subtle time dilation effect near cursor
        if (distanceFromCursor < 3) {
          const dilationForce = 0.008;
          const directionX = ring.position.x - mousePosition.x * 3;
          const directionY = ring.position.y - mousePosition.y * 3;
          const distance = Math.sqrt(directionX * directionX + directionY * directionY);
          
          if (distance > 0) {
            // Slight positional shift like time ripples
            ring.position.x += (directionX / distance) * dilationForce;
            ring.position.y += (directionY / distance) * dilationForce;
          }
        } else {
          // Gracefully return to timepiece positions
          const returnForce = 0.003;
          const originalPos = config.position;
          ring.position.x += (originalPos[0] - ring.position.x) * returnForce;
          ring.position.y += (originalPos[1] - ring.position.y) * returnForce;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {rings.map((config, index) => (
        <mesh key={index} position={config.position as [number, number, number]}>
          <torusGeometry args={[config.radius, config.thickness, 8, config.segments]} />
          <meshStandardMaterial
            color={config.color}
            transparent
            opacity={config.opacity}
            emissive={config.emissive}
            emissiveIntensity={0.15}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      {/* Soft ambient lighting for Gallifreyan atmosphere */}
      <ambientLight intensity={0.3} color="#F9FAFB" />
      
      {/* Primary directional light with Gallifrey teal tint */}
      <directionalLight
        position={[8, 6, 4]}
        intensity={0.6}
        color="#2D5A87"
        castShadow={false}
      />
      
      {/* Accent point light for depth and highlights */}
      <pointLight
        position={[-3, 4, 2]}
        intensity={0.4}
        color="#234669"
      />
      
      {/* Subtle rim lighting */}
      <pointLight
        position={[0, 0, 5]}
        intensity={0.2}
        color="#1F2937"
      />
      
      <GallifreyanRings />
    </>
  );
}

export function HeroThreeBackground({ className = "" }: HeroThreeBackgroundProps) {
  return (
    <div className={`absolute inset-0 ${className}`} style={{ zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
        performance={{ min: 0.5, max: 1 }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}