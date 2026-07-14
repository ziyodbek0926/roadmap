import { Canvas } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-b from-[#1e1b4b] via-[#312e81] to-[#4c1d95]">
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.9} />
            <pointLight position={[5, 5, 5]} intensity={1.2} color="#c4b5fd" />
            <Stars radius={90} depth={50} count={3500} factor={4} fade speed={1} />

            <Float speed={1.8} rotationIntensity={1.1} floatIntensity={2.4}>
              <mesh>
                <icosahedronGeometry args={[1.3, 0]} />
                <meshStandardMaterial color="#a78bfa" wireframe />
              </mesh>
            </Float>

            <Float speed={2.4} rotationIntensity={0.6} floatIntensity={1.6} position={[-3, 1.4, -2]}>
              <mesh>
                <octahedronGeometry args={[0.5, 0]} />
                <meshStandardMaterial color="#fde047" wireframe />
              </mesh>
            </Float>

            <Float speed={1.4} rotationIntensity={0.9} floatIntensity={2} position={[3, -1.2, -2]}>
              <mesh>
                <torusGeometry args={[0.5, 0.16, 16, 48]} />
                <meshStandardMaterial color="#6ee7b7" wireframe />
              </mesh>
            </Float>
          </Suspense>
        </Canvas>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 text-center px-6"
      >
        <motion.div
          className="text-8xl mb-4"
          animate={{ y: [0, -14, 0], rotate: [0, 6, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          🧑‍🚀
        </motion.div>
        <h1 className="text-7xl font-black text-white mb-3 tracking-tight">404</h1>
        <p className="text-primary-200/90 text-lg mb-8 max-w-md mx-auto leading-relaxed">
          Siz koinotning noma'lum burchagiga adashib qoldingiz — bu yerda hech qanday dars yo'q!
        </p>
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => navigate('/dashboard')}
          className="px-8 py-4 bg-sun-400 hover:bg-sun-300 text-ink-900 font-bold rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-colors"
        >
          🚀 Bosh sahifaga qaytish
        </motion.button>
      </motion.div>
    </div>
  );
}
