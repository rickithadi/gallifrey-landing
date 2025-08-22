import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SimpleThreeAnimationProps {
  className?: string;
}

function RotatingCube() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#1B365D" />
    </mesh>
  );
}

function FloatingOrbs() {
  const orbsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (orbsRef.current) {
      orbsRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      orbsRef.current.children.forEach((child, index) => {
        child.position.y = Math.sin(state.clock.elapsedTime + index) * 0.5;
      });
    }
  });

  return (
    <group ref={orbsRef}>
      {Array.from({ length: 6 }, (_, index) => (
        <mesh
          key={index}
          position={[
            Math.cos((index / 6) * Math.PI * 2) * 3,
            0,
            Math.sin((index / 6) * Math.PI * 2) * 3
          ]}
        >
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial 
            color={index % 2 === 0 ? "#60A5FA" : "#F97316"} 
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

export function SimpleThreeAnimation({ className = "" }: SimpleThreeAnimationProps) {
  return (
    <div className={`w-full h-96 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <directionalLight
          position={[-10, -10, -5]}
          intensity={0.5}
          castShadow
        />
        
        <RotatingCube />
        <FloatingOrbs />
      </Canvas>
    </div>
  );
}