import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { TorusKnot } from '@react-three/drei';
import { useRef } from 'react';
import { Mesh } from 'three';

function InteractiveTorusKnot() {
  const meshRef = useRef<Mesh>(null!);
  const { viewport, mouse } = useThree();

  useFrame((state, delta) => {
    if (meshRef.current) {
      const x = (mouse.x * viewport.width) / 2.5;
      const y = (mouse.y * viewport.height) / 2.5;
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.1;
      meshRef.current.position.set(x, y, 0);
    }
  });

  return (
    <TorusKnot ref={meshRef} args={[1, 0.4, 256, 32]}>
      <meshStandardMaterial color={'#1B365D'} wireframe />
    </TorusKnot>
  );
}

export function LivingHeroBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <InteractiveTorusKnot />
      </Canvas>
    </div>
  );
}
