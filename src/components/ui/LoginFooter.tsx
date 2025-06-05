import React from 'react';

const LoginFooter: React.FC = () => {
  return (
    <div className="relative w-full h-24 mt-8 overflow-hidden rounded-b-2xl">
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <div className="flex items-center justify-center h-full">
          <div className="text-white/80 text-sm font-light tracking-wider transform hover:scale-105 transition-all duration-300 cursor-default">
            Powered by Advanced Excel Processing
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
    </div>
  );
};

export default LoginFooter;