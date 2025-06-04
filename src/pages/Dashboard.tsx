import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AlertCircle, FileSpreadsheet, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useExcelProcessing } from '../hooks/useExcelProcessing';
import Navbar from '../components/Navbar';
import FileUploader from '../components/FileUploader';
import ColumnSelector from '../components/ColumnSelector';
import ProcessingOptions from '../components/ProcessingOptions';
import ResultsTable from '../components/ResultsTable';

const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const {
    file,
    data,
    processedData,
    selectedColumns,
    options,
    loading,
    error,
    setFile,
    setSelectedColumns,
    setOptions,
    processData,
    exportData,
    useMockData
  } = useExcelProcessing();
  
  const [activeStep, setActiveStep] = useState<number>(1);

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login\" replace />;
  }

  const handleNextStep = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleColumnToggle = (columnKey: string) => {
    if (selectedColumns.includes(columnKey)) {
      setSelectedColumns(selectedColumns.filter(key => key !== columnKey));
    } else {
      setSelectedColumns([...selectedColumns, columnKey]);
    }
  };

  const handleSelectAllColumns = () => {
    if (data) {
      setSelectedColumns(data.headers.map(header => header.key));
    }
  };

  const handleDeselectAllColumns = () => {
    setSelectedColumns([]);
  };

  const handleProcess = () => {
    if (selectedColumns.length > 0) {
      processData();
      setActiveStep(3);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Bienvenido al Sistema de Prueba. Aquí puedes procesar tus archivos Excel.
            </p>
          </div>
          
          {/* Pasos */}
          <div className="mb-8">
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center h-10 w-10 rounded-full ${
                  activeStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                1
              </div>
              <div
                className={`flex-1 h-1 mx-2 ${
                  activeStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              ></div>
              <div
                className={`flex items-center justify-center h-10 w-10 rounded-full ${
                  activeStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                2
              </div>
              <div
                className={`flex-1 h-1 mx-2 ${
                  activeStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              ></div>
              <div
                className={`flex items-center justify-center h-10 w-10 rounded-full ${
                  activeStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                3
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <div className="text-xs font-medium text-gray-500">Cargar archivo</div>
              <div className="text-xs font-medium text-gray-500">Configurar</div>
              <div className="text-xs font-medium text-gray-500">Resultados</div>
            </div>
          </div>
          
          {/* Contenido según el paso activo */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {activeStep === 1 && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Cargar archivo Excel</h2>
                <FileUploader onFileSelect={setFile} isLoading={loading} />
                
                {!file && !loading && (
                  <div className="mt-6 border-t pt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">¿No tienes un archivo para probar?</h3>
                    <button
                      type="button"
                      onClick={useMockData}
                      className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 transition-colors flex items-center"
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2 text-blue-600" />
                      Usar datos de ejemplo
                    </button>
                  </div>
                )}
                
                {file && data && data.headers && data.headers.length > 0 && (
                  <div className="mt-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start">
                      <div className="mr-3 mt-0.5">
                        <FileSpreadsheet className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-blue-800">Archivo cargado correctamente</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          {file.name} • {data.totalRows} filas • {data.headers.length} columnas
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                      >
                        Continuar
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeStep === 2 && data && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Configurar procesamiento</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">1. Selecciona las columnas a procesar</h3>
                    <ColumnSelector
                      columns={data.headers}
                      selectedColumns={selectedColumns}
                      onColumnToggle={handleColumnToggle}
                      onSelectAll={handleSelectAllColumns}
                      onDeselectAll={handleDeselectAllColumns}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">2. Configura las opciones de limpieza</h3>
                    <ProcessingOptions
                      options={options}
                      onOptionsChange={setOptions}
                    />
                  </div>
                </div>
                
                {selectedColumns.length === 0 && (
                  <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-700">
                      Debes seleccionar al menos una columna para procesar
                    </p>
                  </div>
                )}
                
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Volver
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleProcess}
                    disabled={selectedColumns.length === 0}
                    className={`px-4 py-2 rounded-md text-white transition-colors ${
                      selectedColumns.length === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Procesar datos
                  </button>
                </div>
              </div>
            )}
            
            {activeStep === 3 && processedData && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Resultados</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 mb-1">Filas originales</div>
                    <div className="text-2xl font-bold text-blue-700">{data?.totalRows || 0}</div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-green-600 mb-1">Filas procesadas</div>
                    <div className="text-2xl font-bold text-green-700">{processedData.totalRows}</div>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-sm text-red-600 mb-1">Duplicados encontrados</div>
                    <div className="text-2xl font-bold text-red-700">{processedData.duplicateCount || 0}</div>
                  </div>
                </div>
                
                <ResultsTable
                  data={processedData}
                  onExport={exportData}
                  fileName={file?.name || ''}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;