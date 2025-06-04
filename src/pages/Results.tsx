import React from 'react';
import { Navigate } from 'react-router-dom';
import { Calendar, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useExcelProcessing } from '../hooks/useExcelProcessing';
import Navbar from '../components/Navbar';

const Results: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { results, exportData } = useExcelProcessing();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Resultados recientes</h1>
            <p className="mt-1 text-sm text-gray-500">
              Historial de los últimos 10 archivos procesados
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {results.length === 0 ? (
              <div className="p-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FileSpreadsheet className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay resultados recientes</h3>
                <p className="text-gray-500 mb-6">
                  Aún no has procesado ningún archivo Excel. Dirígete al Dashboard para comenzar.
                </p>
                <a
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Ir al Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Archivo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Filas originales</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Filas procesadas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duplicados</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((result) => (
                      <tr key={result.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.fileName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(result.timestamp)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.originalRows}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.processedRows}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.duplicateCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => exportData(result.fileName)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Exportar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;