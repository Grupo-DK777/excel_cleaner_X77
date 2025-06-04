import { useState, createContext, useContext, ReactNode } from 'react';
import { 
  ExcelFile, 
  ExcelData, 
  ProcessingOptions, 
  ProcessingResult 
} from '../types';
import { 
  readExcelFile, 
  processExcelData, 
  exportToExcel 
} from '../utils/excelUtils';
import { addRecentFile } from '../utils/localStorage';
import { mockExcelData } from '../utils/mockData';
import { saveResult, getResults } from '../utils/localStorage';

interface ExcelProcessingContextType {
  file: ExcelFile | null;
  data: ExcelData | null;
  processedData: ExcelData | null;
  options: ProcessingOptions;
  selectedColumns: string[];
  results: ProcessingResult[];
  loading: boolean;
  error: string | null;
  setFile: (file: File | null) => Promise<void>;
  setSelectedColumns: (columns: string[]) => void;
  setOptions: (options: Partial<ProcessingOptions>) => void;
  processData: () => void;
  exportData: (fileName: string) => void;
  resetData: () => void;
  useMockData: () => void;
}

const DEFAULT_OPTIONS: ProcessingOptions = {
  removeDuplicates: true,
  trimWhitespace: true,
  convertToLowercase: false,
  convertToUppercase: false,
  removeEmptyRows: true,
  formatNumbers: false,
  formatDates: false,
  customReplacements: []
};

const ExcelProcessingContext = createContext<ExcelProcessingContextType | undefined>(undefined);

export const ExcelProcessingProvider = ({ children }: { children: ReactNode }) => {
  const [file, setFileState] = useState<ExcelFile | null>(null);
  const [data, setData] = useState<ExcelData | null>(null);
  const [processedData, setProcessedData] = useState<ExcelData | null>(null);
  const [options, setOptionsState] = useState<ProcessingOptions>(DEFAULT_OPTIONS);
  const [selectedColumns, setSelectedColumnsState] = useState<string[]>([]);
  const [results, setResults] = useState<ProcessingResult[]>(getResults());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Establecer archivo
  const setFile = async (fileObj: File | null): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!fileObj) {
        setFileState(null);
        setData(null);
        setProcessedData(null);
        setSelectedColumnsState([]);
        setLoading(false);
        return;
      }
      
      const newFile: ExcelFile = {
        id: Math.random().toString(36).substring(2, 11),
        name: fileObj.name,
        size: fileObj.size,
        type: fileObj.type,
        lastModified: fileObj.lastModified
      };
      
      const sheetsData = await readExcelFile(fileObj);
      const firstSheet = Array.isArray(sheetsData) ? sheetsData[0] : sheetsData;
      
      if (!firstSheet || !firstSheet.headers) {
        throw new Error('El archivo no contiene datos válidos');
      }
      
      setFileState(newFile);
      setData(firstSheet);
      setSelectedColumnsState(firstSheet.headers.map(h => h.key));
      
      // Añadir a archivos recientes
      addRecentFile(fileObj.name);
    } catch (err) {
      setError('Error al procesar el archivo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Establecer columnas seleccionadas
  const setSelectedColumns = (columns: string[]): void => {
    setSelectedColumnsState(columns);
  };

  // Establecer opciones
  const setOptions = (newOptions: Partial<ProcessingOptions>): void => {
    setOptionsState(prev => ({ ...prev, ...newOptions }));
  };

  // Procesar datos
  const processData = (): void => {
    setLoading(true);
    setError(null);
    
    try {
      if (!data || selectedColumns.length === 0) {
        setError('No hay datos para procesar o no se han seleccionado columnas');
        setLoading(false);
        return;
      }
      
      // Convertir el data en un array y crear el objeto de columnas seleccionadas
      const dataArray = [data];
      const selectedColumnsObj = { [data.sheetName]: selectedColumns };
      
      const processed = processExcelData(dataArray, selectedColumnsObj, options);
      
      // Convertir el resultado procesado al formato ExcelData y agregar el duplicateCount
      setProcessedData({
        headers: data.headers,
        rows: processed.cleanData.rows,
        totalRows: processed.cleanData.rows.length,
        duplicateRows: processed.duplicateData.rows,
        sheetName: data.sheetName,
        duplicateCount: processed.duplicateData.rows.length // Agregamos el duplicateCount aquí
      });
      
      // Guardar resultado
      if (file) {
        const result: ProcessingResult = {
          id: Math.random().toString(36).substring(2, 11),
          fileName: file.name,
          timestamp: Date.now(), // Cambiar a timestamp numérico
          originalRows: data.totalRows,
          processedRows: processed.cleanData.rows.length,
          duplicateCount: processed.duplicateData.rows.length
        };
        saveResult(result); // Guardar en localStorage
        setResults(getResults()); // Actualizar el estado con los datos de localStorage
      }
    } catch (error) {
      setError('Error al procesar los datos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Exportar datos
  const exportData = (fileName: string): void => {
    if (processedData) {
      // Convertir los datos al formato ProcessedResult
      const processedResult = {
        cleanData: {
          headers: processedData.headers,
          rows: processedData.rows,
          totalRows: processedData.totalRows
        },
        duplicateData: {
          headers: [
            { key: 'Valor_Duplicado', name: 'Valor Duplicado', selected: true },
            { key: 'Hoja_Original', name: 'Hoja Original', selected: true },
            { key: 'Fila_Original', name: 'Fila Original', selected: true },
            { key: 'Columna', name: 'Columna', selected: true },
            { key: 'Ocurrencia', name: 'Ocurrencia', selected: true }
          ],
          rows: processedData.duplicateRows || [],
          totalRows: processedData.duplicateRows?.length || 0
        },
        duplicateCount: processedData.duplicateCount || 0
      };
      
      exportToExcel(processedResult, fileName);
    }
  };

  // Resetear datos
  const resetData = (): void => {
    setFileState(null);
    setData(null);
    setProcessedData(null);
    setSelectedColumnsState([]);
    setError(null);
  };

  // Usar datos mock para desarrollo
  const useMockData = (): void => {
    setFileState({
      id: 'mock-file',
      name: 'datos_ejemplo.xlsx',
      size: 12345,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      lastModified: Date.now()
    });
    
    setData(mockExcelData);
    setSelectedColumnsState(mockExcelData.headers.map(h => h.key));
  };

  return (
    <ExcelProcessingContext.Provider
      value={{
        file,
        data,
        processedData,
        options,
        selectedColumns,
        results,
        loading,
        error,
        setFile,
        setSelectedColumns,
        setOptions,
        processData,
        exportData,
        resetData,
        useMockData
      }}
    >
      {children}
    </ExcelProcessingContext.Provider>
  );
};

export const useExcelProcessing = (): ExcelProcessingContextType => {
  const context = useContext(ExcelProcessingContext);
  
  if (context === undefined) {
    throw new Error('useExcelProcessing debe ser usado dentro de un ExcelProcessingProvider');
  }
  
  return context;
};