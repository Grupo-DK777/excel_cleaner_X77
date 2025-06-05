// src/components/background/DynamicBackground.tsx
import React, { useRef, useEffect } from 'react';

interface DynamicBackgroundProps {
  children: React.ReactNode;
}

interface CelestialBody {
  x: number;
  y: number;
  radius: number;
  color: string;
  orbitRadius: number;
  speed: number;
  angle: number;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const planets = useRef<CelestialBody[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializePlanets();
    };

    const initializePlanets = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) / 3;

      // Sol central
      planets.current = [
        {
          x: centerX,
          y: centerY,
          radius: scale * 0.15,
          color: '#FFD700',
          orbitRadius: 0,
          speed: 0,
          angle: 0
        },
        // Mercurio
        {
          x: 0,
          y: 0,
          radius: scale * 0.05,
          color: '#8B8989',
          orbitRadius: scale * 0.4,
          speed: 0.02,
          angle: 0
        },
        // Venus
        {
          x: 0,
          y: 0,
          radius: scale * 0.08,
          color: '#DEB887',
          orbitRadius: scale * 0.6,
          speed: 0.015,
          angle: Math.PI
        },
        // Tierra
        {
          x: 0,
          y: 0,
          radius: scale * 0.085,
          color: '#4169E1',
          orbitRadius: scale * 0.8,
          speed: 0.01,
          angle: Math.PI / 2
        },
        // Marte
        {
          x: 0,
          y: 0,
          radius: scale * 0.06,
          color: '#CD5C5C',
          orbitRadius: scale,
          speed: 0.008,
          angle: Math.PI * 1.5
        }
      ];
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Dibujar órbitas
      planets.current.slice(1).forEach(planet => {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.arc(centerX, centerY, planet.orbitRadius, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Actualizar y dibujar planetas
      planets.current.forEach((planet, index) => {
        if (index > 0) {
          planet.angle += planet.speed;
          planet.x = centerX + Math.cos(planet.angle) * planet.orbitRadius;
          planet.y = centerY + Math.sin(planet.angle) * planet.orbitRadius;
        }

        // Efecto de brillo
        const gradient = ctx.createRadialGradient(
          planet.x, planet.y, 0,
          planet.x, planet.y, planet.radius
        );
        gradient.addColorStop(0, planet.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(planet.x, planet.y, planet.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = planet.color;
        ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default DynamicBackground;
