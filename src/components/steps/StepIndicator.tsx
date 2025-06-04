import React from 'react';

interface Step {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;

          return (
            <div key={step.number} className="relative flex flex-col items-center flex-1">
              {/* Línea conectora */}
              {step.number < steps.length && (
                <div
                  className={`absolute w-full h-1 top-1/2 -translate-y-1/2 left-1/2 ${isCompleted ? 'bg-blue-600' : 'bg-gray-200'}`}
                  style={{ width: 'calc(100% - 2rem)' }}
                />
              )}
              
              {/* Círculo del paso */}
              <div
                className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 ${isActive
                  ? 'border-blue-600 bg-white text-blue-600'
                  : isCompleted
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-300 bg-white text-gray-400'}`}
              >
                <span className="text-sm font-medium">{step.number}</span>
              </div>
              
              {/* Etiqueta del paso */}
              <div className="mt-3 text-center">
                <span
                  className={`text-sm font-medium ${isActive
                    ? 'text-blue-600'
                    : isCompleted
                    ? 'text-blue-600'
                    : 'text-gray-500'}`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;