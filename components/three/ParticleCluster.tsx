import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleClusterProps {
  variant: 'original' | 'lightweight';
  mousePosition: THREE.Vector3;
  time: number;
}

interface ClusterNode {
  position: THREE.Vector3;
  targetPosition: THREE.Vector3;
  velocity: THREE.Vector3;
  size: number;
  energy: number;
  clusterId: number;
  formationTime: number;
}

export function ParticleCluster({ variant, mousePosition, time }: ParticleClusterProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const nodesRef = useRef<ClusterNode[]>([]);
  const clustersRef = useRef<Map<number, THREE.Vector3>>(new Map());
  
  const nodeCount = 60;
  const clusterCount = 4;
  
  // Initialize cluster nodes
  const nodes = useMemo(() => {
    const nodes: ClusterNode[] = [];
    
    // Create cluster centers
    for (let i = 0; i < clusterCount; i++) {
      const clusterCenter = new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5
      );
      clustersRef.current.set(i, clusterCenter);
    }
    
    // Create nodes assigned to clusters
    for (let i = 0; i < nodeCount; i++) {
      const clusterId = Math.floor(i / (nodeCount / clusterCount));
      const clusterCenter = clustersRef.current.get(clusterId)!;
      
      // Random position within cluster radius
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 2 + 0.5;
      const height = (Math.random() - 0.5) * 1;
      
      const position = new THREE.Vector3(
        clusterCenter.x + Math.cos(angle) * radius,
        clusterCenter.y + Math.sin(angle) * radius,
        clusterCenter.z + height
      );
      
      nodes.push({
        position: position.clone(),
        targetPosition: position.clone(),
        velocity: new THREE.Vector3(),
        size: 0.01 + Math.random() * 0.02,
        energy: Math.random(),
        clusterId,
        formationTime: Math.random() * 10,
      });
    }
    
    nodesRef.current = nodes;
    return nodes;
  }, [nodeCount, clusterCount]);
  
  // Cluster formation patterns
  const formations = useMemo(() => [
    // Spiral formation
    (nodes: ClusterNode[], center: THREE.Vector3, time: number) => {
      nodes.forEach((node, index) => {
        const angle = (index / nodes.length) * Math.PI * 4 + time * 0.5;
        const radius = 1 + Math.sin(time + index * 0.1) * 0.5;
        node.targetPosition.set(
          center.x + Math.cos(angle) * radius,
          center.y + Math.sin(angle) * radius,
          center.z + Math.sin(time + index * 0.05) * 0.5
        );
      });
    },
    
    // Sphere formation
    (nodes: ClusterNode[], center: THREE.Vector3, time: number) => {
      nodes.forEach((node, index) => {
        const phi = Math.acos(-1 + (2 * index) / nodes.length);
        const theta = Math.sqrt(nodes.length * Math.PI) * phi + time * 0.3;
        const radius = 1.5 + Math.sin(time + index * 0.1) * 0.3;
        
        node.targetPosition.set(
          center.x + radius * Math.cos(theta) * Math.sin(phi),
          center.y + radius * Math.sin(theta) * Math.sin(phi),
          center.z + radius * Math.cos(phi)
        );
      });
    },
    
    // Wave formation
    (nodes: ClusterNode[], center: THREE.Vector3, time: number) => {
      nodes.forEach((node, index) => {
        const waveX = (index / nodes.length) * Math.PI * 2;
        const waveY = Math.sin(waveX + time) * 1.5;
        const waveZ = Math.cos(waveX * 2 + time * 0.7) * 0.5;
        
        node.targetPosition.set(
          center.x + (index / nodes.length - 0.5) * 4,
          center.y + waveY,
          center.z + waveZ
        );
      });
    },
  ], []); // Empty dependency array since formations are static
  
  // Geometry and material
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(0.02, 1), []);
  const material = useMemo(() => {
    const baseColor = variant === 'lightweight' ? '#2D5A87' : '#3B82F6';
    return new THREE.MeshStandardMaterial({
      color: baseColor,
      emissive: baseColor,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.8,
      roughness: 0.3,
      metalness: 0.7,
    });
  }, [variant]);
  
  // Animation loop
  useFrame(() => {
    if (!meshRef.current) return;
    
    const dummy = new THREE.Object3D();
    
    // Update cluster centers with organic movement
    clustersRef.current.forEach((center, clusterId) => {
      // Gentle orbital movement
      const orbitRadius = 2;
      const orbitSpeed = 0.1 + clusterId * 0.05;
      const orbitAngle = time * orbitSpeed + clusterId * Math.PI * 0.5;
      
      center.x = Math.cos(orbitAngle) * orbitRadius + Math.sin(time * 0.3 + clusterId) * 0.5;
      center.y = Math.sin(orbitAngle) * orbitRadius + Math.cos(time * 0.2 + clusterId) * 0.3;
      center.z = Math.sin(time * 0.4 + clusterId) * 1;
      
      // Mouse attraction effect on clusters
      const mouseDistance = center.distanceTo(mousePosition);
      if (mouseDistance < 5) {
        const attraction = mousePosition.clone().sub(center);
        attraction.multiplyScalar(0.01 * (1 - mouseDistance / 5));
        center.add(attraction);
      }
    });
    
    // Update node formations and positions
    clustersRef.current.forEach((center, clusterId) => {
      const clusterNodes = nodes.filter(node => node.clusterId === clusterId);
      
      // Choose formation based on time and cluster
      const formationIndex = Math.floor((time * 0.1 + clusterId) % formations.length);
      formations[formationIndex](clusterNodes, center, time + clusterId * 2);
    });
    
    // Update individual nodes
    nodes.forEach((node, index) => {
      // Move towards target position
      const direction = node.targetPosition.clone().sub(node.position);
      direction.multiplyScalar(0.02);
      node.velocity.add(direction);
      
      // Add some randomness
      node.velocity.add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.001,
        (Math.random() - 0.5) * 0.001,
        (Math.random() - 0.5) * 0.001
      ));
      
      // Apply velocity with damping
      node.velocity.multiplyScalar(0.95);
      node.position.add(node.velocity);
      
      // Update energy based on formation time
      const formationProgress = Math.max(0, Math.min(1, (time - node.formationTime) * 0.5));
      node.energy = formationProgress;
      
      // Pulsing effect
      const pulseScale = 1 + Math.sin(time * 3 + index * 0.5) * 0.2 * node.energy;
      
      // Set instance matrix
      dummy.position.copy(node.position);
      dummy.scale.setScalar(pulseScale * (0.5 + node.energy * 0.5));
      dummy.updateMatrix();
      
      meshRef.current!.setMatrixAt(index, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, nodeCount]}
      frustumCulled={false}
      castShadow
      receiveShadow
    />
  );
}