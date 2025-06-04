import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { validateExcelFile } from '../utils/excelUtils';

interface FileUploaderProps {
  onFileSelect: (file: File | null) => Promise<void>;
  isLoading?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, isLoading = false }) => {
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const file = acceptedFiles[0];
    
    // Validar que sea un archivo Excel
    if (!validateExcelFile(file)) {
      setError('El archivo debe ser un documento Excel válido (.xls o .xlsx)');
      return;
    }
    
    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo no debe superar los 10MB');
      return;
    }
    
    setSelectedFile(file);
    await onFileSelect(file);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    disabled: isLoading
  });

  const handleRemoveFile = async () => {
    setSelectedFile(null);
    setError(null);
    await onFileSelect(null);
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center">
            <Upload 
              className={`h-12 w-12 mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} 
            />
            <p className="text-lg font-medium mb-2">
              {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra y suelta un archivo Excel'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              o haz clic para seleccionar
            </p>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Seleccionar archivo
            </button>
            <p className="text-xs text-gray-500 mt-4">
              Formatos soportados: .xlsx, .xls (máx. 10MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <FileSpreadsheet className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{selectedFile.name}</h3>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024).toFixed(2)} KB • Subido {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {isLoading && (
            <div className="mt-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
              <p className="text-sm text-gray-600">Procesando archivo...</p>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;