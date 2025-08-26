import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GallifreyanThreeBackgroundProps {
  className?: string;
}

// Performance levels for adaptive quality
type PerformanceLevel = 'low' | 'medium' | 'high' | 'ultra';

interface QualitySettings {
  ringComplexity: number;
  particleCount: number;
  animationEnabled: boolean;
  shadowsEnabled: boolean;
  renderScale: number;
}

const QUALITY_PRESETS: Record<PerformanceLevel, QualitySettings> = {
  low: {
    ringComplexity: 8,
    particleCount: 25,
    animationEnabled: false,
    shadowsEnabled: false,
    renderScale: 0.7,
  },
  medium: {
    ringComplexity: 16,
    particleCount: 50,
    animationEnabled: true,
    shadowsEnabled: false,
    renderScale: 0.8,
  },
  high: {
    ringComplexity: 24,
    particleCount: 100,
    animationEnabled: true,
    shadowsEnabled: false,
    renderScale: 1.0,
  },
  ultra: {
    ringComplexity: 32,
    particleCount: 150,
    animationEnabled: true,
    shadowsEnabled: true,
    renderScale: 1.0,
  },
};

// Ring configurations for traversing animation - subtle but visible
const TRAVERSING_RING_CONFIGS = {
  ring1: {
    name: 'Ring 1',
    startPosition: [-12, 3, -4] as [number, number, number],
    endPosition: [12, 3, -4] as [number, number, number],
    rotation: [0, 0, Math.PI * 0.2] as [number, number, number], // Slightly tilted
    scale: 0.8, // Larger and more visible
    speed: 0.0008, // Very slow traversal
    spinSpeed: 0.0003, // Very gentle spin
  },
  ring2: {
    name: 'Ring 2',
    startPosition: [12, -2, -3] as [number, number, number],
    endPosition: [-12, -2, -3] as [number, number, number],
    rotation: [Math.PI * 0.3, 0, Math.PI * 0.1] as [number, number, number], // Different orientation
    scale: 0.6, // Visible size
    speed: 0.0006, // Very slow
    spinSpeed: -0.0004, // Gentle reverse spin
  },
  ring3: {
    name: 'Ring 3',
    startPosition: [-12, 1, 1] as [number, number, number],
    endPosition: [12, 1, 1] as [number, number, number],
    rotation: [Math.PI * 0.1, Math.PI * 0.4, 0] as [number, number, number], // Vertical-ish
    scale: 0.7, // Good visibility
    speed: 0.0004, // Extremely slow
    spinSpeed: 0.0002, // Barely perceptible spin
  },
  ring4: {
    name: 'Ring 4',
    startPosition: [12, -1, 0] as [number, number, number],
    endPosition: [-12, -1, 0] as [number, number, number],
    rotation: [Math.PI * 0.2, Math.PI * 0.6, Math.PI * 0.3] as [number, number, number], // Complex orientation
    scale: 0.5, // Smallest but still visible
    speed: 0.001, // Slow but slightly faster than others
    spinSpeed: 0.0005, // Very gentle spin
  },
  ring5: {
    name: 'Ring 5',
    startPosition: [-12, 0, -1] as [number, number, number],
    endPosition: [12, 0, -1] as [number, number, number],
    rotation: [Math.PI * 0.4, Math.PI * 0.1, Math.PI * 0.5] as [number, number, number],
    scale: 0.65,
    speed: 0.0007, // Medium slow
    spinSpeed: -0.0003, // Gentle reverse
  },
  ring6: {
    name: 'Ring 6',
    startPosition: [12, 2, -2] as [number, number, number],
    endPosition: [-12, 2, -2] as [number, number, number],
    rotation: [Math.PI * 0.6, Math.PI * 0.3, Math.PI * 0.2] as [number, number, number],
    scale: 0.75,
    speed: 0.0005, // Very slow
    spinSpeed: 0.0001, // Almost imperceptible
  },
};

// Shared materials for performance (created once, reused)
let sharedMaterials: Record<string, THREE.Material> | null = null;

function getSharedMaterials() {
  if (!sharedMaterials) {
    // Subtle but visible unified Gallifrey Teal color scheme
    sharedMaterials = {
      tealPrimary1: new THREE.MeshBasicMaterial({ color: 0x2D5A87, transparent: true, opacity: 0.4 }),
      tealPrimary2: new THREE.MeshBasicMaterial({ color: 0x2D5A87, transparent: true, opacity: 0.35 }),
      tealPrimary3: new THREE.MeshBasicMaterial({ color: 0x2D5A87, transparent: true, opacity: 0.3 }),
      tealPrimary4: new THREE.MeshBasicMaterial({ color: 0x2D5A87, transparent: true, opacity: 0.25 }),
      tealAccent: new THREE.MeshBasicMaterial({ color: 0x3A6B93, transparent: true, opacity: 0.2 }), // Subtle lighter teal
      tealGlow1: new THREE.MeshBasicMaterial({ color: 0x2D5A87, transparent: true, opacity: 0.15 }),
      tealGlow2: new THREE.MeshBasicMaterial({ color: 0x2D5A87, transparent: true, opacity: 0.12 }),
      tealGlow3: new THREE.MeshBasicMaterial({ color: 0x2D5A87, transparent: true, opacity: 0.1 }),
      tealGlow4: new THREE.MeshBasicMaterial({ color: 0x2D5A87, transparent: true, opacity: 0.08 }),
    };
  }
  return sharedMaterials;
}

// Shared geometries for performance
let sharedGeometries: Record<string, THREE.BufferGeometry> | null = null;

function getSharedGeometries(complexity: number) {
  const key = `complexity_${complexity}`;
  if (!sharedGeometries || !sharedGeometries[key]) {
    sharedGeometries = sharedGeometries || {};
    // Much thinner, more elegant ring profiles
    sharedGeometries[`${key}_torus_outer`] = new THREE.TorusGeometry(2.5, 0.03, Math.max(4, complexity / 4), complexity); // Thinner tube
    sharedGeometries[`${key}_torus_middle`] = new THREE.TorusGeometry(2.0, 0.02, Math.max(3, complexity / 6), Math.max(12, complexity * 0.75)); // Very thin
    sharedGeometries[`${key}_torus_inner`] = new THREE.TorusGeometry(1.5, 0.015, Math.max(3, complexity / 8), Math.max(8, complexity * 0.5)); // Ultra thin
    sharedGeometries[`${key}_torus_glow`] = new THREE.TorusGeometry(2.8, 0.05, Math.max(4, complexity / 4), complexity); // Subtle glow
    sharedGeometries[`${key}_sphere_small`] = new THREE.SphereGeometry(0.04, Math.max(4, complexity / 4), Math.max(4, complexity / 4)); // Smaller details
    sharedGeometries[`${key}_sphere_center`] = new THREE.SphereGeometry(0.08, Math.max(4, complexity / 4), Math.max(4, complexity / 4)); // Smaller center
  }
  return {
    torusOuter: sharedGeometries[`${key}_torus_outer`],
    torusMiddle: sharedGeometries[`${key}_torus_middle`],
    torusInner: sharedGeometries[`${key}_torus_inner`],
    torusGlow: sharedGeometries[`${key}_torus_glow`],
    sphereSmall: sharedGeometries[`${key}_sphere_small`],
    sphereCenter: sharedGeometries[`${key}_sphere_center`],
  };
}

// Traversing Ring Component - rings that move across the screen
function TraversingRing3D({
  startPosition,
  endPosition,
  rotation,
  scale,
  speed,
  spinSpeed,
  quality
}: {
  startPosition: [number, number, number];
  endPosition: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  speed: number;
  spinSpeed: number;
  quality: QualitySettings;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const innerElementsRef = useRef<THREE.Group>(null);
  const progress = useRef(0);

  // Use shared materials and geometries for performance
  const materials = getSharedMaterials();
  const geometries = getSharedGeometries(quality.ringComplexity);

  // Unified teal materials with random variation
  const materialConfig = useMemo(() => {
    const variations = [
      { primary: materials.tealPrimary1, accent: materials.tealAccent, glow: materials.tealGlow1 },
      { primary: materials.tealPrimary2, accent: materials.tealAccent, glow: materials.tealGlow2 },
      { primary: materials.tealPrimary3, accent: materials.tealAccent, glow: materials.tealGlow3 },
      { primary: materials.tealPrimary4, accent: materials.tealAccent, glow: materials.tealGlow4 },
    ];
    return variations[Math.floor(Math.random() * variations.length)];
  }, [materials]);

  // Traversing animation with spinning
  useFrame(() => {
    if (!quality.animationEnabled || !groupRef.current) return;
    
    // Update progress for traversal
    progress.current += speed;
    if (progress.current > 1) {
      progress.current = 0; // Wrap around
    }
    
    // Interpolate position between start and end
    const currentPos = new THREE.Vector3().lerpVectors(
      new THREE.Vector3(...startPosition),
      new THREE.Vector3(...endPosition),
      progress.current
    );
    groupRef.current.position.copy(currentPos);
    
    // Set base rotation from config
    groupRef.current.rotation.set(...rotation);
    
    // Add spinning animation
    groupRef.current.rotation.y += spinSpeed;
    groupRef.current.rotation.z += spinSpeed * 0.3;
    
    // Keep consistent scale for subtle effect
    groupRef.current.scale.setScalar(scale);

    // Inner elements counter-rotation for visual interest
    if (innerElementsRef.current) {
      innerElementsRef.current.rotation.x += spinSpeed * 0.5;
      innerElementsRef.current.rotation.z -= spinSpeed * 0.2;
    }
  });

  // Reduce decorative elements based on performance level
  const decorativeNodeCount = Math.max(3, Math.floor(quality.ringComplexity / 6));

  return (
    <group ref={groupRef}>
      {/* Outer ring structure - thinnest */}
      <mesh>
        <primitive object={geometries.torusOuter} />
        <primitive object={materialConfig.primary} />
      </mesh>

      {/* Middle ring - very thin */}
      <mesh>
        <primitive object={geometries.torusMiddle} />
        <primitive object={materialConfig.accent} />
      </mesh>

      {/* Inner ring - ultra thin */}
      <mesh>
        <primitive object={geometries.torusInner} />
        <primitive object={materialConfig.primary} />
      </mesh>

      {/* Inner decorative elements */}
      <group ref={innerElementsRef}>
        {/* Minimal decorative nodes for performance */}
        {Array.from({ length: Math.max(2, decorativeNodeCount / 2) }, (_, i) => {
          const angle = (i / Math.max(2, decorativeNodeCount / 2)) * Math.PI * 2;
          const radius = 1.2 + Math.sin(i) * 0.3; // Varying radius
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <mesh key={i} position={[x, y, 0]}>
              <primitive object={geometries.sphereSmall} />
              <primitive object={materialConfig.glow} />
            </mesh>
          );
        })}
      </group>

      {/* Subtle outer glow ring */}
      <mesh>
        <primitive object={geometries.torusGlow} />
        <primitive object={materialConfig.glow} />
      </mesh>
    </group>
  );
}

// Refined particle system for subtle energy flows
function RefinedParticleFlow({ quality }: { quality: QualitySettings }) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = Math.max(25, quality.particleCount);

  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Random positions in a larger sphere around the rings
      const radius = 4 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Unified teal colors with slight variations
      const tealColor = new THREE.Color(0x2D5A87);
      const intensity = 0.7 + Math.random() * 0.3; // Vary intensity slightly
      colors[i * 3] = tealColor.r * intensity;
      colors[i * 3 + 1] = tealColor.g * intensity;
      colors[i * 3 + 2] = tealColor.b * intensity;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return geometry;
  }, [particleCount]);

  useFrame(() => {
    if (particlesRef.current && quality.animationEnabled) {
      // Very gentle floating motion - more subtle
      particlesRef.current.rotation.y += 0.0002;
      particlesRef.current.rotation.x += 0.0001;
    }
  });

  return (
    <points ref={particlesRef}>
      <primitive object={particlesGeometry} />
      <pointsMaterial
        size={0.008}
        transparent
        opacity={0.15}
        vertexColors
        sizeAttenuation
      />
    </points>
  );
}

// Main scene component with performance monitoring
function GallifreyanScene() {
  const groupRef = useRef<THREE.Group>(null);
  const [motionAllowed, setMotionAllowed] = useState(true);
  const [currentQuality, setCurrentQuality] = useState<QualitySettings>(QUALITY_PRESETS.medium);

  useEffect(() => {
    // Respect user's motion preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMotionAllowed(!mediaQuery.matches);
    
    const handleChange = () => setMotionAllowed(!mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Simple performance detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
    
    if (isMobile || isLowEnd) {
      setCurrentQuality(QUALITY_PRESETS.low);
    } else if (window.innerWidth < 1024) {
      setCurrentQuality(QUALITY_PRESETS.medium);
    } else {
      setCurrentQuality(QUALITY_PRESETS.high);
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // No global rotation needed - rings move individually

  return (
    <group ref={groupRef}>
      {/* Traversing rings with different orientations and speeds */}
      {Object.entries(TRAVERSING_RING_CONFIGS).map(([key, config]) => (
        <TraversingRing3D
          key={key}
          startPosition={config.startPosition}
          endPosition={config.endPosition}
          rotation={config.rotation}
          scale={config.scale}
          speed={motionAllowed ? config.speed : 0}
          spinSpeed={motionAllowed ? config.spinSpeed : 0}
          quality={currentQuality}
        />
      ))}
      
      {/* Minimal particle flow for subtle effect */}
      {motionAllowed && <RefinedParticleFlow quality={{...currentQuality, particleCount: Math.max(8, currentQuality.particleCount / 4)}} />}
    </group>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-gallifrey-teal/4 via-transparent to-gallifrey-charcoal/3">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gallifrey-teal/30 border-t-gallifrey-teal animate-spin" />
      </div>
    </div>
  );
}

// Main component
export function GallifreyanThreeBackground({ className = "" }: GallifreyanThreeBackgroundProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ zIndex: 0 }}>
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ 
            position: [0, 0, 12], // Closer for better visibility while staying subtle
            fov: 75, // Balanced field of view
            near: 0.1,
            far: 200
          }}
          style={{ 
            background: 'transparent',
            opacity: 0.6 // More visible but still subtle
          }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
        >
          {/* Balanced ambient lighting for visibility */}
          <ambientLight intensity={0.3} />
          
          {/* Gentle directional light */}
          <directionalLight position={[5, 5, 5]} intensity={0.15} />
          
          {/* Main scene */}
          <GallifreyanScene />
        </Canvas>
      </Suspense>
    </div>
  );
}