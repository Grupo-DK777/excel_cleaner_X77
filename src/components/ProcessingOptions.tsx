import React, { useState } from 'react';
import { Settings, Plus, Trash2 } from 'lucide-react';
import { ProcessingOptions } from '../types';

interface ProcessingOptionsProps {
  options: ProcessingOptions;
  onOptionsChange: (options: Partial<ProcessingOptions>) => void;
}

const ProcessingOptionsComponent: React.FC<ProcessingOptionsProps> = ({
  options,
  onOptionsChange
}) => {
  const [showCustomReplacements, setShowCustomReplacements] = useState(false);
  const [newReplacement, setNewReplacement] = useState({ from: '', to: '' });

  const handleToggleOption = (optionKey: keyof ProcessingOptions) => {
    if (typeof options[optionKey] === 'boolean') {
      onOptionsChange({ [optionKey]: !options[optionKey] });
    }
  };

  const handleAddReplacement = () => {
    if (newReplacement.from.trim() !== '') {
      const updatedReplacements = [
        ...options.customReplacements,
        { ...newReplacement }
      ];
      onOptionsChange({ customReplacements: updatedReplacements });
      setNewReplacement({ from: '', to: '' });
    }
  };

  const handleRemoveReplacement = (index: number) => {
    const updatedReplacements = [...options.customReplacements];
    updatedReplacements.splice(index, 1);
    onOptionsChange({ customReplacements: updatedReplacements });
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="border-b px-4 py-3 bg-gray-50 flex items-center">
        <Settings className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="font-medium text-gray-700">Opciones de procesamiento</h3>
      </div>
      
      <div className="p-4">
        <div className="space-y-3">
          {/* Opciones booleanas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="removeDuplicates"
                checked={options.removeDuplicates}
                onChange={() => handleToggleOption('removeDuplicates')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="removeDuplicates" className="ml-2 text-sm text-gray-700">
                Eliminar duplicados
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="trimWhitespace"
                checked={options.trimWhitespace}
                onChange={() => handleToggleOption('trimWhitespace')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="trimWhitespace" className="ml-2 text-sm text-gray-700">
                Eliminar espacios en blanco
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="convertToLowercase"
                checked={options.convertToLowercase}
                onChange={() => handleToggleOption('convertToLowercase')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="convertToLowercase" className="ml-2 text-sm text-gray-700">
                Convertir a minúsculas
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="convertToUppercase"
                checked={options.convertToUppercase}
                onChange={() => handleToggleOption('convertToUppercase')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="convertToUppercase" className="ml-2 text-sm text-gray-700">
                Convertir a mayúsculas
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="removeEmptyRows"
                checked={options.removeEmptyRows}
                onChange={() => handleToggleOption('removeEmptyRows')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="removeEmptyRows" className="ml-2 text-sm text-gray-700">
                Eliminar filas vacías
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="formatDates"
                checked={options.formatDates}
                onChange={() => handleToggleOption('formatDates')}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="formatDates" className="ml-2 text-sm text-gray-700">
                Formatear fechas
              </label>
            </div>
          </div>
          
          {/* Reemplazos personalizados */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowCustomReplacements(!showCustomReplacements)}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              {showCustomReplacements ? 'Ocultar' : 'Mostrar'} reemplazos personalizados
            </button>
            
            {showCustomReplacements && (
              <div className="mt-3 border rounded-md p-3 bg-gray-50">
                <div className="space-y-3">
                  {options.customReplacements.map((replacement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={replacement.from}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                        placeholder="Buscar..."
                      />
                      <span className="text-gray-500">→</span>
                      <input
                        type="text"
                        value={replacement.to}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                        placeholder="Reemplazar con..."
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveReplacement(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newReplacement.from}
                      onChange={(e) => setNewReplacement({ ...newReplacement, from: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Buscar..."
                    />
                    <span className="text-gray-500">→</span>
                    <input
                      type="text"
                      value={newReplacement.to}
                      onChange={(e) => setNewReplacement({ ...newReplacement, to: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Reemplazar con..."
                    />
                    <button
                      type="button"
                      onClick={handleAddReplacement}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingOptionsComponent;