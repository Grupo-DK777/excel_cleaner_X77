import { useReducer, createContext, useContext, ReactNode } from 'react';
import { 
  ExcelFile, 
  ExcelData, 
  ProcessingOptions, 
  ProcessingResult 
} from '../types';
import { 
  readExcelFile, 
  validateExcelFile 
} from '../services/excel/excelReader';
import {
  processExcelData
} from '../services/excel/excelProcessor';
import {
  exportToExcel
} from '../services/excel/excelExporter';
import { addRecentFile, saveResult, getResults } from '../utils/localStorage';
import { mockExcelData } from '../utils/mockData';

// Definir acciones
type ExcelAction = 
  | { type: 'SET_FILE'; payload: ExcelFile | null }
  | { type: 'SET_DATA'; payload: ExcelData | null }
  | { type: 'SET_PROCESSED_DATA'; payload: ExcelData | null }
  | { type: 'SET_SELECTED_COLUMNS'; payload: string[] }
  | { type: 'SET_OPTIONS'; payload: Partial<ProcessingOptions> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_DATA' }
  | { type: 'USE_MOCK_DATA' };

// Estado inicial
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

interface ExcelState {
  file: ExcelFile | null;
  data: ExcelData | null;
  processedData: ExcelData | null;
  options: ProcessingOptions;
  selectedColumns: string[];
  results: ProcessingResult[];
  loading: boolean;
  error: string | null;
}

const initialState: ExcelState = {
  file: null,
  data: null,
  processedData: null,
  options: DEFAULT_OPTIONS,
  selectedColumns: [],
  results: getResults(),
  loading: false,
  error: null
};

// Reducer
function excelReducer(state: ExcelState, action: ExcelAction): ExcelState {
  switch (action.type) {
    case 'SET_FILE':
      return { ...state, file: action.payload };
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SET_PROCESSED_DATA':
      return { ...state, processedData: action.payload };
    case 'SET_SELECTED_COLUMNS':
      return { ...state, selectedColumns: action.payload };
    case 'SET_OPTIONS':
      return { 
        ...state, 
        options: { ...state.options, ...action.payload } 
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_DATA':
      return { 
        ...state, 
        file: null, 
        data: null, 
        processedData: null, 
        selectedColumns: [],
        error: null 
      };
    case 'USE_MOCK_DATA':
      return {
        ...state,
        file: {
          id: 'mock-file',
          name: 'datos_ejemplo.xlsx',
          size: 12345,
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          lastModified: Date.now()
        },
        data: mockExcelData,
        selectedColumns: mockExcelData.headers.map(h => h.key)
      };
    default:
      return state;
  }
}

// Contexto
interface ExcelProcessingContextType extends ExcelState {
  setFile: (file: File | null) => Promise<void>;
  setSelectedColumns: (columns: string[]) => void;
  setOptions: (options: Partial<ProcessingOptions>) => void;
  processData: () => void;
  exportData: (fileName: string) => void;
  resetData: () => void;
  useMockData: () => void;
}

const ExcelProcessingContext = createContext<ExcelProcessingContextType | undefined>(undefined);

export const ExcelProcessingProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(excelReducer, initialState);

  // Establecer archivo
  const setFile = async (fileObj: File | null): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      if (!fileObj) {
        dispatch({ type: 'RESET_DATA' });
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
      
      dispatch({ type: 'SET_FILE', payload: newFile });
      dispatch({ type: 'SET_DATA', payload: firstSheet });
      dispatch({ 
        type: 'SET_SELECTED_COLUMNS', 
        payload: firstSheet.headers.map(h => h.key) 
      });
      
      // Añadir a archivos recientes
      addRecentFile(fileObj.name);
    } catch (err) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Error al procesar el archivo' 
      });
      console.error(err);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Establecer columnas seleccionadas
  const setSelectedColumns = (columns: string[]): void => {
    dispatch({ type: 'SET_SELECTED_COLUMNS', payload: columns });
  };

  const setOptions = (newOptions: Partial<ProcessingOptions>): void => {
    dispatch({ type: 'SET_OPTIONS', payload: newOptions });
  };

  const processData = (): void => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      if (!state.data || state.selectedColumns.length === 0) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: 'No hay datos para procesar o no se han seleccionado columnas' 
        });
        return;
      }
      
      // Convertir el data en un array y crear el objeto de columnas seleccionadas
      const dataArray = [state.data];
      const selectedColumnsObj = { [state.data.sheetName]: state.selectedColumns };
      
      const processed = processExcelData(dataArray, selectedColumnsObj, state.options);
      
      // Convertir el resultado procesado al formato ExcelData
      dispatch({ 
        type: 'SET_PROCESSED_DATA', 
        payload: {
          headers: state.data.headers,
          rows: processed.cleanData.rows,
          totalRows: processed.cleanData.rows.length,
          duplicateRows: processed.duplicateData.rows,
          sheetName: state.data.sheetName,
          duplicateCount: processed.duplicateData.rows.length
        }
      });
      
      // Guardar resultado
      if (state.file) {
        const result: ProcessingResult = {
          id: Math.random().toString(36).substring(2, 11),
          fileName: state.file.name,
          timestamp: Date.now(),
          originalRowCount: state.data.totalRows,
          processedRowCount: processed.cleanData.rows.length,
          duplicateCount: processed.duplicateData.rows.length,
          appliedOptions: Object.entries(state.options)
            .filter(([_, value]) => value === true)
            .map(([key]) => key),
          processedColumns: state.selectedColumns
        };
        saveResult(result);
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Error al procesar los datos' 
      });
      console.error(error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const exportData = (fileName: string): void => {
    if (state.processedData) {
      // Convertir los datos al formato ProcessedResult
      const processedResult = {
        cleanData: {
          headers: state.processedData.headers,
          rows: state.processedData.rows,
          totalRows: state.processedData.totalRows
        },
        duplicateData: {
          headers: [
            { key: 'Valor_Duplicado', name: 'Valor Duplicado', selected: true },
            { key: 'Hoja_Original', name: 'Hoja Original', selected: true },
            { key: 'Fila_Original', name: 'Fila Original', selected: true },
            { key: 'Columna', name: 'Columna', selected: true },
            { key: 'Ocurrencia', name: 'Ocurrencia', selected: true }
          ],
          rows: state.processedData.duplicateRows || [],
          totalRows: state.processedData.duplicateRows?.length || 0
        },
        duplicateCount: state.processedData.duplicateCount || 0
      };
      
      exportToExcel(processedResult, fileName);
    }
  };

  const resetData = (): void => {
    dispatch({ type: 'RESET_DATA' });
  };

  const useMockData = (): void => {
    dispatch({ type: 'USE_MOCK_DATA' });
  };

  return (
    <ExcelProcessingContext.Provider
      value={{
        ...state,
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