import React from 'react';
import FileUploader from '../FileUploader';

interface UploadStepProps {
  onFileSelect: (file: File) => void;
  onNextStep: () => void;  // Cambiado de onNext a onNextStep
  file: File | null;
  loading: boolean;
}

const UploadStep: React.FC<UploadStepProps> = ({ onFileSelect, onNextStep, file, loading }) => {  // Actualizado aquí también
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Subir Archivo Excel</h2>
      <FileUploader onFileSelect={onFileSelect} />
      {file && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onNextStep}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadStep;