import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder } from '@react-three/drei';

export default function Pikachu() {
  const groupRef = useRef();

  // Add some animation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Body */}
      <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#FFD700" />
      </Sphere>

      {/* Head */}
      <Sphere args={[0.8, 32, 32]} position={[0, 1.2, 0]}>
        <meshStandardMaterial color="#FFD700" />
      </Sphere>

      {/* Ears */}
      <Cylinder args={[0.1, 0.1, 0.8, 32]} position={[-0.5, 1.8, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <meshStandardMaterial color="#FFD700" />
      </Cylinder>
      <Cylinder args={[0.1, 0.1, 0.8, 32]} position={[0.5, 1.8, 0]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial color="#FFD700" />
      </Cylinder>

      {/* Eyes */}
      <Sphere args={[0.15, 32, 32]} position={[-0.3, 1.3, 0.6]}>
        <meshStandardMaterial color="black" />
      </Sphere>
      <Sphere args={[0.15, 32, 32]} position={[0.3, 1.3, 0.6]}>
        <meshStandardMaterial color="black" />
      </Sphere>

      {/* Cheeks */}
      <Sphere args={[0.2, 32, 32]} position={[-0.6, 1, 0.5]}>
        <meshStandardMaterial color="#FF0000" />
      </Sphere>
      <Sphere args={[0.2, 32, 32]} position={[0.6, 1, 0.5]}>
        <meshStandardMaterial color="#FF0000" />
      </Sphere>

      {/* Tail */}
      <Cylinder args={[0.1, 0.1, 1.5, 32]} position={[0, -0.5, -1]} rotation={[Math.PI / 4, 0, 0]}>
        <meshStandardMaterial color="#FFD700" />
      </Cylinder>
    </group>
  );
} 