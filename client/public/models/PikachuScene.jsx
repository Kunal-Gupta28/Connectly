import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Pikachu from './Pikachu';

export default function PikachuScene() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Pikachu />
        <OrbitControls />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
} 