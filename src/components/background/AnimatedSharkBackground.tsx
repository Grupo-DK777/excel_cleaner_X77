import React, { useRef, useEffect } from 'react';
import { useSharkAnimation } from './useSharkAnimation';

interface AnimatedSharkBackgroundProps {
  className?: string;
}

const AnimatedSharkBackground: React.FC<AnimatedSharkBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useSharkAnimation(canvasRef);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full bg-black ${className}`}
    />
  );
};

export default AnimatedSharkBackground;