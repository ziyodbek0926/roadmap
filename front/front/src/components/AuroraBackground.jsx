import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { Suspense } from 'react';

function Blob({ position, color, scale, speed = 1.5 }) {
  return (
    <Float speed={speed} rotationIntensity={0.8} floatIntensity={1.8}>
      <Sphere args={[1, 64, 64]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          distort={0.42}
          speed={1.8}
          roughness={0.25}
          metalness={0.05}
        />
      </Sphere>
    </Float>
  );
}

/**
 * Soft, slow-moving abstract 3D shapes for glassmorphism auth screens.
 * Sits absolutely behind the form — parent must be `position: relative`.
 */
export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-sky-100 to-mint-100" />
      <Canvas
        className="absolute inset-0"
        camera={{ position: [0, 0, 9], fov: 45 }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Blob position={[-3.2, 2, -2]} color="#c4b5fd" scale={1.6} speed={1.2} />
          <Blob position={[3.4, -1.6, -3]} color="#6ee7b7" scale={2.1} speed={1.6} />
          <Blob position={[2.4, 2.6, -4]} color="#fde047" scale={1.2} speed={1.9} />
          <Blob position={[-2.6, -2.2, -3]} color="#7dd3fc" scale={1.4} speed={1.4} />
        </Suspense>
      </Canvas>
    </div>
  );
}
