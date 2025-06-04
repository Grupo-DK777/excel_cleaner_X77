import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useExcelProcessing } from '../hooks/useExcelProcessing';
import Navbar from '../components/Navbar';
import StepIndicator from '../components/steps/StepIndicator';
import UploadStep from '../components/steps/UploadStep';
import ConfigStep from '../components/steps/ConfigStep';
import ResultsStep from '../components/steps/ResultsStep';

const steps = [
  { number: 1, label: 'Cargar archivo' },
  { number: 2, label: 'Configurar' },
  { number: 3, label: 'Resultados' },
];

const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const {
    file,
    data,
    processedData,
    selectedColumns,
    options,
    loading,
    setFile,
    setSelectedColumns,
    setOptions,
    processData,
    exportData,
  } = useExcelProcessing();

  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleNextStep = () => {
    if (activeStep < 3) setActiveStep(activeStep + 1);
  };

  const handlePrevStep = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  const handleColumnToggle = (columnKey: string) => {
    if (selectedColumns.includes(columnKey)) {
      setSelectedColumns(selectedColumns.filter((key) => key !== columnKey));
    } else {
      setSelectedColumns([...selectedColumns, columnKey]);
    }
  };

  const handleSelectAllColumns = () => {
    if (data) {
      setSelectedColumns(data.headers.map((header) => header.key));
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

  const handleReset = () => {
    setFile(null);
    setSelectedColumns([]);
    setOptions(DEFAULT_OPTIONS);
    setActiveStep(1);
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

          <StepIndicator steps={steps} currentStep={activeStep} />

          <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
            {activeStep === 1 && (
              <UploadStep
                file={file}
                loading={loading}
                onFileSelect={setFile}
                onNextStep={handleNextStep}
              />
            )}

            {activeStep === 2 && data && (
              <ConfigStep
                columns={data.headers}
                selectedColumns={selectedColumns}
                onColumnToggle={handleColumnToggle}
                onSelectAll={handleSelectAllColumns}
                onDeselectAll={handleDeselectAllColumns}
                options={options}
                onOptionsChange={setOptions}
                onNext={handleProcess}
                onBack={handlePrevStep}
              />
            )}

            {activeStep === 3 && processedData && (
              <ResultsStep
                processedData={processedData}
                originalRowCount={data?.totalRows || 0}
                processedRowCount={processedData.totalRows || 0}
                duplicatesCount={processedData.duplicateCount || 0}
                onExport={exportData}
                onBack={handlePrevStep}
                onReset={handleReset}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
