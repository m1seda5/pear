import { useState, useEffect } from 'react';

const useDrag = (storageKey, defaultPosition) => {
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : defaultPosition;
  });

  const startDrag = (e) => {
    e.preventDefault();
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const onMouseMove = (e) => {
      const newX = e.clientX - startX;
      const newY = e.clientY - startY;
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 380, newX)),
        y: Math.max(0, Math.min(window.innerHeight - 200, newY))
      });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(position));
  }, [position, storageKey]);

  return { position, startDrag };
};

export default useDrag; 