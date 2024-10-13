import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useTheme } from '@chakra-ui/react';
import Particles from 'react-tsparticles'; // Install using npm or yarn

const InactivityBackground = () => {
  const theme = useTheme();
  const isDarkMode = theme.colorMode === 'dark';

  // State to manage inactivity
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let timeout;

    const handleActivity = () => {
      setIsActive(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsActive(false); // Set inactive after 5 seconds
      }, 5000);
    };

    // Attach activity listeners
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

  // Particle options
  const particleOptions = {
    fpsLimit: 60,
    particles: {
      number: { value: 50 },
      size: { value: { min: 1, max: 3 } },
      move: { 
        direction: 'random', 
        speed: 1,
        outModes: { default: 'out' }
      },
      color: {
        value: isDarkMode ? '#FFFFFF' : '#000000',
      },
    },
    detectRetina: true,
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, zIndex: -1, width: '100vw', height: '100vh' }}>
      {!isActive && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: isDarkMode ? 'rgba(0, 128, 0, 0.5)' : 'rgba(0, 255, 0, 0.5)',
          animation: 'fadeOut 3s forwards'
        }} />
      )}
      <Particles options={particleOptions} />
      <style>
        {`
          @keyframes fadeOut {
            0% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default InactivityBackground;
