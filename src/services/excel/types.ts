import { ExcelColumn } from '../../types';

export interface ProcessedResult {
  cleanData: {
    headers: ExcelColumn[];
    rows: Record<string, any>[];
    totalRows: number;
  };
  duplicateData: {
    headers: ExcelColumn[];
    rows: Record<string, any>[];
    totalRows: number;
  };
  duplicateCount: number;
}