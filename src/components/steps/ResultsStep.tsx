import React from 'react';
import ResultsTable from '../ResultsTable';

interface ResultsStepProps {
  processedData: any;
  originalRowCount: number;
  processedRowCount: number;
  duplicatesCount: number;
  onExport: () => void;
  onBack: () => void;
  onReset: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({
  processedData,
  originalRowCount,
  processedRowCount,
  duplicatesCount,
  onExport,
  onBack,
  onReset,
}) => {
  return (
    <div className="space-y-8">
      {/* Título */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Resultados del Procesamiento</h2>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
            <div className="flex-shrink-0 text-blue-600 text-4xl font-bold mr-4">{originalRowCount}</div>
            <div>
              <h3 className="text-sm font-medium text-blue-700">Filas Originales</h3>
              <p className="text-sm text-blue-600">Total de registros</p>
            </div>
          </div>

          <div className="flex items-center bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
            <div className="flex-shrink-0 text-green-600 text-4xl font-bold mr-4">{processedRowCount}</div>
            <div>
              <h3 className="text-sm font-medium text-green-700">Filas Procesadas</h3>
              <p className="text-sm text-green-600">Registros únicos</p>
            </div>
          </div>

          <div className="flex items-center bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
            <div className="flex-shrink-0 text-red-600 text-4xl font-bold mr-4">{duplicatesCount}</div>
            <div>
              <h3 className="text-sm font-medium text-red-700">Duplicados</h3>
              <p className="text-sm text-red-600">Registros duplicados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de resultados */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <ResultsTable 
          data={processedData} 
          onExport={onExport}
          fileName="resultados_procesados.xlsx"
          onRestart={onBack}
        />
      </div>

      {/* Botones */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-100 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Anterior
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Hacer nueva solicitud
        </button>
      </div>
    </div>
  );
};

export default ResultsStep;
