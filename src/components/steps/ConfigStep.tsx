import React from 'react';
import ColumnSelector from '../ColumnSelector';
import ProcessingOptions from '../ProcessingOptions';
import { ExcelColumn } from '../../types';

interface ConfigStepProps {
  columns: ExcelColumn[];  // Cambiado de string[] a ExcelColumn[]
  selectedColumns: string[];
  onColumnToggle: (column: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  options: any; // Tipo específico de opciones
  onOptionsChange: (options: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const ConfigStep: React.FC<ConfigStepProps> = ({
  columns,
  selectedColumns,
  onColumnToggle,
  onSelectAll,
  onDeselectAll,
  options,
  onOptionsChange,
  onNext,
  onBack,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Configurar Procesamiento</h2>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Seleccionar Columnas</h3>
        <ColumnSelector
          columns={columns}
          selectedColumns={selectedColumns}
          onColumnToggle={onColumnToggle}
          onSelectAll={onSelectAll}
          onDeselectAll={onDeselectAll}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Opciones de Procesamiento</h3>
        <ProcessingOptions
          options={options}
          onOptionsChange={onOptionsChange}
        />
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Anterior
        </button>
        <button
          onClick={onNext}
          disabled={selectedColumns.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Procesar
        </button>
      </div>
    </div>
  );
};

export default ConfigStep;