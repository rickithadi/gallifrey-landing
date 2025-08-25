import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HeroThreeBackgroundProps {
  className?: string;
}

function GallifreyanRings() {
  const groupRef = useRef<THREE.Group>(null);
  const [motionAllowed, setMotionAllowed] = useState(true);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMotionAllowed(!mediaQuery.matches);
    
    const handleChange = () => setMotionAllowed(!mediaQuery.matches);
    mediaQuery.addListener(handleChange);
    
    return () => mediaQuery.removeListener(handleChange);
  }, []);
  
  // Gallifreyan timepiece-inspired rings with subtle, sophisticated movement
  const rings = useMemo(() => {
    const ringConfigs = [
      // Outer timepiece ring - faster spinning
      { radius: 2.5, thickness: 0.02, position: [2, 0, -3], speed: 0.15, opacity: 0.12, color: '#2D5A87', emissive: '#1B365D', segments: 60 },
      // Mid ring - increased rotation speed
      { radius: 1.8, thickness: 0.025, position: [1.5, 0, -2], speed: -0.25, opacity: 0.18, color: '#234669', emissive: '#1F2937', segments: 32 },
      // Inner accent ring - faster rotation
      { radius: 1.2, thickness: 0.018, position: [1, 0, -1], speed: 0.35, opacity: 0.25, color: '#2D5A87', emissive: '#234669', segments: 24 },
      // Floating detail rings - much faster spinning
      { radius: 0.4, thickness: 0.008, position: [3, 1.5, -0.5], speed: 0.6, opacity: 0.4, color: '#1F2937', emissive: '#2D5A87', segments: 16 },
      { radius: 0.3, thickness: 0.006, position: [2.5, -1.2, -1.2], speed: -0.45, opacity: 0.35, color: '#234669', emissive: '#1F2937', segments: 12 },
      { radius: 0.5, thickness: 0.01, position: [4, -0.8, -2], speed: 0.55, opacity: 0.3, color: '#2D5A87', emissive: '#1B365D', segments: 20 },
    ];
    
    return ringConfigs;
  }, []);

  useFrame((state) => {
    if (groupRef.current && motionAllowed) {
      // Gentle floating motion for the entire group
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      
      // Individual ring rotations - pure spinning motion
      groupRef.current.children.forEach((ring, index) => {
        const config = rings[index];
        const time = state.clock.elapsedTime;
        
        // Primary rotation on Z-axis (clockwise/counterclockwise like timepiece)
        ring.rotation.z += config.speed * 0.01;
        
        // Very subtle X and Y wobbles for organic feel
        ring.rotation.x = Math.sin(time * 0.1 + index * 0.3) * 0.02;
        ring.rotation.y = Math.cos(time * 0.08 + index * 0.5) * 0.015;
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
  const [motionAllowed, setMotionAllowed] = useState(true);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMotionAllowed(!mediaQuery.matches);
    
    const handleChange = () => setMotionAllowed(!mediaQuery.matches);
    mediaQuery.addListener(handleChange);
    
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ zIndex: 0 }}>
      {motionAllowed ? (
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
      ) : (
        // Static fallback for reduced motion users
        <div className="absolute inset-0 bg-gradient-to-br from-gallifrey-teal/5 to-gallifrey-charcoal/5" />
      )}
    </div>
  );
}