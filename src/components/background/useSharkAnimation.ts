import { useEffect, useRef } from 'react';

interface Shark {
  x: number;
  y: number;
  speed: number;
  scale: number;
}

export const useSharkAnimation = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const sharksRef = useRef<Shark[]>([]);
  const animationFrameRef = useRef<number>();
  const sharkImageRef = useRef<HTMLImageElement>();

  const initializeSharks = () => {
    const sharks: Shark[] = [];
    const numSharks = 5;

    for (let i = 0; i < numSharks; i++) {
      sharks.push({
        x: Math.random() * -500, // Posición inicial fuera de la pantalla
        y: Math.random() * window.innerHeight,
        speed: 1 + Math.random() * 2,
        scale: 0.5 + Math.random() * 0.5
      });
    }

    sharksRef.current = sharks;
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const sharkImage = sharkImageRef.current;

    if (!canvas || !ctx || !sharkImage) return;

    // Limpiar canvas
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Actualizar y dibujar tiburones
    sharksRef.current.forEach((shark, index) => {
      // Mover tiburón
      shark.x += shark.speed;

      // Reiniciar posición si sale de la pantalla
      if (shark.x > canvas.width + 100) {
        shark.x = -200;
        shark.y = Math.random() * canvas.height;
        shark.speed = 1 + Math.random() * 2;
        shark.scale = 0.5 + Math.random() * 0.5;
      }

      // Dibujar tiburón
      ctx.save();
      ctx.translate(shark.x, shark.y);
      ctx.scale(shark.scale, shark.scale);
      ctx.drawImage(sharkImage, -100, -50, 200, 100);
      ctx.restore();
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Cargar imagen del tiburón
    const sharkImage = new Image();
    sharkImage.src = '/images/LogoX77.png'; // Usar el logo como placeholder
    sharkImage.onload = () => {
      sharkImageRef.current = sharkImage;
      initializeSharks();
      animate();
    };

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
};