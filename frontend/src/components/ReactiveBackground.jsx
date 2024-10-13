// src/components/ReactiveBackground.jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import { useTheme } from '@chakra-ui/react';

function FloatingObject({ position, children }) {
  return (
    <Float
      speed={1.5} // Animation speed
      rotationIntensity={0.3} // Rotation strength
      floatIntensity={0.5} // Float strength
    >
      <mesh position={position}>
        {children}
      </mesh>
    </Float>
  );
}

function ReactiveBackground() {
  const theme = useTheme();
  const isDarkMode = theme.colorMode === 'dark';

  return (
    <Canvas style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, width: '100vw', height: '100vh' }}>
      {/* Add background stars */}
      <Stars radius={50} depth={20} count={5000} factor={4} saturation={0} fade />

      {/* Floating cubes */}
      <FloatingObject position={[2, 0, -5]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={isDarkMode ? 'lightblue' : 'purple'} />
      </FloatingObject>

      {/* Floating sphere */}
      <FloatingObject position={[-2, 1, -3]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color={isDarkMode ? 'pink' : 'blue'} />
      </FloatingObject>

      {/* Additional floating items */}
      <FloatingObject position={[1, -1, -6]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={isDarkMode ? 'orange' : 'green'} />
      </FloatingObject>

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.5} />
    </Canvas>
  );
}

export default ReactiveBackground;
