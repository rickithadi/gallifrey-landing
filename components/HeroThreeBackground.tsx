import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HeroThreeBackgroundProps {
  className?: string;
}

// Enterprise Constellation - Three-Pillar Node System
function EnterpriseConstellation() {
  const groupRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.Group[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connectionsRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const particlesRef = useRef<any[]>([]);
  const [motionAllowed, setMotionAllowed] = useState(true);
  const [businessContext, setBusinessContext] = useState({
    presentation_mode: false,
    corporate_network: false,
    mobile_executive: false
  });

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMotionAllowed(!mediaQuery.matches);
    
    const handleChange = () => setMotionAllowed(!mediaQuery.matches);
    mediaQuery.addListener(handleChange);

    // Business context detection
    const detectBusinessContext = () => {
      // Detect corporate network (slower connections)
      const connection = (navigator as Navigator & { connection?: { effectiveType?: string; downlink?: number } }).connection;
      const isCorporateNetwork = connection && (
        connection.effectiveType === '3g' || (connection.downlink && connection.downlink < 2.0)
      );

      // Detect mobile executive usage (tablets, high-res mobile)
      const isMobileExecutive = /iPad|iPhone|iPod/.test(navigator.userAgent) && 
                               window.screen.width >= 768;

      setBusinessContext({
        presentation_mode: false, // Can be detected via screen sharing API
        corporate_network: !!isCorporateNetwork,
        mobile_executive: isMobileExecutive
      });
    };

    detectBusinessContext();
    
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  // Three pillar node configurations - representing the service pillars
  const pillarNodes = useMemo(() => [
    {
      name: 'Digital Assets',
      position: new THREE.Vector3(-1.8, 1.2, -2),
      color: '#2D5A87',
      emissive: '#1B365D',
      pattern: 'precision', // Geometric precision pattern
      scale: 1.0
    },
    {
      name: 'Market Authority', 
      position: new THREE.Vector3(1.8, 1.2, -2),
      color: '#234669',
      emissive: '#2D5A87', 
      pattern: 'authority', // Expanding influence rings
      scale: 1.1
    },
    {
      name: 'Enterprise Security',
      position: new THREE.Vector3(0, -1.5, -2),
      color: '#1F2937',
      emissive: '#234669',
      pattern: 'security', // Protective barriers
      scale: 1.05
    }
  ], []);

  // Data flow connections between pillars
  const connections = useMemo(() => {
    const lines = [];
    // Connect each pillar to the others (triangle formation)
    for (let i = 0; i < pillarNodes.length; i++) {
      for (let j = i + 1; j < pillarNodes.length; j++) {
        lines.push({
          start: pillarNodes[i].position,
          end: pillarNodes[j].position,
          opacity: 0.15,
          pulseSpeed: 0.3 + Math.random() * 0.4
        });
      }
    }
    return lines;
  }, [pillarNodes]);

  // Create sophisticated node geometries
  const createNodeGeometry = (pattern: string) => {
    switch (pattern) {
      case 'precision':
        // Geometric precision - icosahedron for mathematical elegance
        return <icosahedronGeometry args={[0.15, 1]} />;
      case 'authority':
        // Authority - sphere with subtle faceting
        return <sphereGeometry args={[0.18, 16, 12]} />;
      case 'security':
        // Security - octahedron for protective symbolism
        return <octahedronGeometry args={[0.16]} />;
      default:
        return <sphereGeometry args={[0.15, 12, 8]} />;
    }
  };

  // Animation frame logic
  useFrame((state) => {
    if (!motionAllowed || !groupRef.current) return;

    const time = state.clock.elapsedTime;
    const adaptiveSpeed = businessContext.mobile_executive ? 0.7 : 1.0; // Slower for battery

    // Gentle orbital motion for entire constellation
    groupRef.current.position.y = Math.sin(time * 0.2 * adaptiveSpeed) * 0.1;
    groupRef.current.rotation.y = time * 0.05 * adaptiveSpeed;

    // Individual node behaviors based on their pillar characteristics
    nodesRef.current.forEach((nodeGroup, index) => {
      if (!nodeGroup) return;
      
      const config = pillarNodes[index];
      const phase = index * (Math.PI * 2 / 3); // 120-degree phase offset

      switch (config.pattern) {
        case 'precision':
          // Precise, measured rotation - mathematical consistency
          nodeGroup.rotation.x = time * 0.3 * adaptiveSpeed;
          nodeGroup.rotation.y = time * 0.2 * adaptiveSpeed;
          nodeGroup.scale.setScalar(1.0 + Math.sin(time + phase) * 0.02);
          break;
          
        case 'authority':
          // Building presence - subtle expansion and contraction
          const authorityScale = 1.0 + Math.sin(time * 0.4 + phase) * 0.04;
          nodeGroup.scale.setScalar(authorityScale);
          nodeGroup.rotation.z = time * 0.15 * adaptiveSpeed;
          break;
          
        case 'security':
          // Protective stability - slow, steady rotation
          nodeGroup.rotation.x = time * 0.1 * adaptiveSpeed;
          nodeGroup.rotation.z = time * 0.08 * adaptiveSpeed;
          break;
      }
    });

    // Animate connection pulse effects
    connectionsRef.current.forEach((connection, index) => {
      if (!connection) return;
      
      const material = connection.material as THREE.LineBasicMaterial;
      const pulseSpeed = connections[index]?.pulseSpeed || 0.5;
      const pulse = Math.sin(time * pulseSpeed + index) * 0.5 + 0.5;
      material.opacity = connections[index].opacity + pulse * 0.1;
    });

    // Animate data particles flowing between nodes
    particlesRef.current.forEach((particles, index) => {
      if (!particles) return;
      
      const material = particles.material as THREE.PointsMaterial;
      const flow = (time * 0.5 + index) % 1;
      material.opacity = 0.3 + Math.sin(flow * Math.PI * 2) * 0.2;
    });
  });

  return (
    <group ref={groupRef}>
      {/* Three Pillar Nodes */}
      {pillarNodes.map((config, index) => (
        <group
          key={`node-${index}`}
          ref={(ref) => { if (ref) nodesRef.current[index] = ref; }}
          position={config.position}
        >
          {/* Main node */}
          <mesh>
            {createNodeGeometry(config.pattern)}
            <meshStandardMaterial
              color={config.color}
              emissive={config.emissive}
              emissiveIntensity={0.2}
              roughness={0.2}
              metalness={0.4}
              transparent
              opacity={0.8}
            />
          </mesh>
          
          {/* Pillar-specific effect rings */}
          {config.pattern === 'authority' && (
            <>
              <mesh>
                <ringGeometry args={[0.3, 0.32, 16]} />
                <meshBasicMaterial
                  color={config.emissive}
                  transparent
                  opacity={0.1}
                />
              </mesh>
              <mesh rotation={[0, 0, Math.PI / 4]}>
                <ringGeometry args={[0.4, 0.42, 16]} />
                <meshBasicMaterial
                  color={config.color}
                  transparent
                  opacity={0.05}
                />
              </mesh>
            </>
          )}
          
          {config.pattern === 'security' && (
            <mesh>
              <ringGeometry args={[0.25, 0.27, 8]} />
              <meshBasicMaterial
                color={config.emissive}
                transparent
                opacity={0.15}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* Data Flow Connections */}
      {connections.map((connection, index) => (
        <line
          key={`connection-${index}`}
          ref={(ref) => { if (ref) connectionsRef.current[index] = ref; }}
        >
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                connection.start.x, connection.start.y, connection.start.z,
                connection.end.x, connection.end.y, connection.end.z
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#2D5A87"
            transparent
            opacity={connection.opacity}
          />
        </line>
      ))}

      {/* Data Flow Particles */}
      {connections.map((connection, index) => {
        const particleCount = businessContext.corporate_network ? 3 : 6;
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
          const t = i / (particleCount - 1);
          positions[i * 3] = connection.start.x + (connection.end.x - connection.start.x) * t;
          positions[i * 3 + 1] = connection.start.y + (connection.end.y - connection.start.y) * t;
          positions[i * 3 + 2] = connection.start.z + (connection.end.z - connection.start.z) * t;
        }

        return (
          <points
            key={`particles-${index}`}
            ref={(ref) => { if (ref) particlesRef.current[index] = ref; }}
          >
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={particleCount}
                array={positions}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial
              color="#2D5A87"
              size={0.02}
              transparent
              opacity={0.4}
            />
          </points>
        );
      })}
    </group>
  );
}

function Scene() {
  return (
    <>
      {/* Professional lighting setup for enterprise sophistication */}
      <ambientLight intensity={0.3} color="#F8FAFC" />
      
      {/* Key light for definition */}
      <directionalLight
        position={[5, 8, 3]}
        intensity={0.6}
        color="#2D5A87"
        castShadow={false}
      />
      
      {/* Fill light to soften shadows */}
      <directionalLight
        position={[-3, 5, -2]}
        intensity={0.2}
        color="#234669"
      />
      
      {/* Rim light for premium edge definition */}
      <directionalLight
        position={[-2, -3, 5]}
        intensity={0.3}
        color="#1B365D"
      />
      
      <EnterpriseConstellation />
    </>
  );
}

export function HeroThreeBackground({ className = "" }: HeroThreeBackgroundProps) {
  const [motionAllowed, setMotionAllowed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMotionAllowed(!mediaQuery.matches);
    
    const handleChange = () => setMotionAllowed(!mediaQuery.matches);
    mediaQuery.addListener(handleChange);

    // Detect mobile devices for performance optimization
    const mobileCheck = window.matchMedia('(max-width: 768px)');
    setIsMobile(mobileCheck.matches);

    // Enhanced business device detection
    const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
    const isSlowConnection = Boolean(connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'));
    const isLowEndDevice = Boolean(navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
    setIsLowPerformance(isSlowConnection || isLowEndDevice);

    return () => mediaQuery.removeListener(handleChange);
  }, []);

  // Enhanced decision logic for enterprise contexts
  // Temporarily disable Three.js for build
  const shouldRenderThreeJS = false; // motionAllowed && !isMobile && !isLowPerformance;

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ zIndex: 0 }}>
      {shouldRenderThreeJS ? (
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          gl={{
            antialias: false, // Optimized for performance
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true, // Needed for proper depth sorting
          }}
          dpr={Math.min(window.devicePixelRatio, 2)} // Cap for performance
          performance={{ min: 0.5, max: 1, debounce: 200 }}
          frameloop="always" // Smooth enterprise-grade animation
        >
          <Scene />
        </Canvas>
      ) : (
        // Enhanced static fallback representing the three pillars
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gallifrey-teal/6 via-transparent to-gallifrey-charcoal/4" />
          
          {/* Three Pillar Static Representation */}
          <div className="absolute top-1/3 left-1/4 w-6 h-6 rounded-full border-2 border-gallifrey-teal/25 opacity-40">
            <div className="absolute inset-2 rounded-full bg-gallifrey-teal/10"></div>
          </div>
          
          <div className="absolute top-1/3 right-1/4 w-7 h-7 rounded-full border-2 border-gallifrey-charcoal/20 opacity-35">
            <div className="absolute inset-2 rounded-full bg-gallifrey-charcoal/8"></div>
          </div>
          
          <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-2 border-gallifrey-teal/20 opacity-30">
            <div className="absolute inset-2 rounded-full bg-gallifrey-teal/6"></div>
          </div>
          
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <line x1="25%" y1="33%" x2="75%" y2="33%" stroke="#2D5A87" strokeWidth="1" strokeOpacity="0.3" />
            <line x1="25%" y1="33%" x2="50%" y2="50%" stroke="#2D5A87" strokeWidth="1" strokeOpacity="0.3" />
            <line x1="75%" y1="33%" x2="50%" y2="50%" stroke="#2D5A87" strokeWidth="1" strokeOpacity="0.3" />
          </svg>
        </div>
      )}
    </div>
  );
}