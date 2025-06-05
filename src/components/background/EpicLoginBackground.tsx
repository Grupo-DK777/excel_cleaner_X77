// src/components/background/EpicLoginBackground.tsx
import React from 'react';
import DynamicBackground from './DynamicBackground';
import AnimatedSharkBackground from './AnimatedSharkBackground';

interface EpicLoginBackgroundProps {
  children: React.ReactNode;
}

const EpicLoginBackground: React.FC<EpicLoginBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Logo watermark girando lentamente */}
      <img
        src="/images/LogoX77.png"
        alt="Watermark"
        className="absolute top-1/2 left-1/2 opacity-5 animate-spin-slow pointer-events-none"
        style={{ transform: 'translate(-50%, -50%)', width: '600px', zIndex: 0 }}
      />

      {/* Fondo dinámico con partículas */}
      <div className="absolute inset-0 z-0">
        <DynamicBackground />
      </div>

      {/* Tiburones animados */}
      <div className="absolute inset-0 z-10 opacity-80">
        <AnimatedSharkBackground className="bg-transparent" />
      </div>

      {/* Contenido encima */}
      <div className="relative z-20 animate-fade-in-down">
        {children}
      </div>
    </div>
  );
};

export default EpicLoginBackground;
