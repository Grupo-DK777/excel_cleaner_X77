// Interfaces para autenticación
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Interfaces para archivos y datos
export interface ExcelFile {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export interface ExcelColumn {
  key: string;
  name: string;
  selected: boolean;
}

export interface ExcelData {
  headers: ExcelColumn[];
  rows: Record<string, any>[];
  totalRows: number;
  duplicateRows?: Record<string, any>[];
}

// Interfaces para opciones de procesamiento
export interface ProcessingOption {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface ProcessingOptions {
  removeDuplicates: boolean;
  trimWhitespace: boolean;
  convertToLowercase: boolean;
  convertToUppercase: boolean;
  removeEmptyRows: boolean;
  formatNumbers: boolean;
  formatDates: boolean;
  customReplacements: Array<{
    from: string;
    to: string;
  }>;
}

// Interfaces para resultados
export interface ProcessingResult {
  id: string;
  fileName: string;
  originalRowCount: number;
  processedRowCount: number;
  duplicateCount: number;
  appliedOptions: string[];
  processedColumns: string[];
  timestamp: number;
}

// Interfaces para preferencias de usuario
export interface UserPreferences {
  theme: 'light' | 'dark';
  defaultProcessingOptions: ProcessingOptions;
  recentFiles: string[];
}