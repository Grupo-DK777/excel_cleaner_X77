import React from 'react';
import { Navigate } from 'react-router-dom';
import { Calendar, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useExcelProcessing } from '../hooks/useExcelProcessing';
import Navbar from '../components/Navbar';

const Results: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { results, exportData } = useExcelProcessing();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Resultados recientes</h1>
            <p className="mt-1 text-sm text-gray-500">
              Historial de archivos procesados
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
              <div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Archivo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Filas
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duplicados
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Opciones aplicadas
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((result) => (
                      <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{result.fileName}</div>
                              <div className="text-sm text-gray-500">{result.processedColumns.length} columnas</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500">
                              {new Date(result.timestamp).toLocaleDateString()} {new Date(result.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-gray-900">{result.originalRowCount}</span>
                            <ArrowRight className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-green-600 font-medium">{result.processedRowCount}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-red-600 font-medium">{result.duplicateCount}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {result.appliedOptions.map((option, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {option}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => exportData(result.fileName)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
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