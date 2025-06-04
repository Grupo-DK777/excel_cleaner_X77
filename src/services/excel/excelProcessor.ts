import { ProcessingOptions, ExcelData, ExcelColumn } from '../../types';
import { ProcessedResult } from './types';

/**
 * Procesa los datos según las opciones seleccionadas
 */
export const processExcelData = (
  sheetsData: ExcelData[],
  selectedColumns: { [sheetName: string]: string[] },
  options: ProcessingOptions
): ProcessedResult => {
  // Mapa para rastrear valores únicos a través de todas las hojas
  const uniqueMap = new Map<string, {
    value: string,
    originalRow: Record<string, any>,
    sheetName: string,
    occurrences: number,
    locations: Array<{
      sheetName: string,
      columnKey: string,
      rowIndex: number
    }>
  }>();

  const duplicateRows: Array<{
    row: Record<string, any>,
    duplicateInfo: {
      value: string,
      originalSheetName: string,
      originalRowIndex: number,
      currentSheetName: string,
      columnKey: string,
      occurrenceNumber: number
    }
  }> = [];

  let duplicateCount = 0;

  // Procesar cada hoja
  sheetsData.forEach(sheetData => {
    const sheetColumns = selectedColumns[sheetData.sheetName] || [];

    // Procesar cada fila de la hoja
    sheetData.rows.forEach((row, rowIndex) => {
      sheetColumns.forEach(columnKey => {
        let value = row[columnKey];
        
        if (value === null || value === undefined) return;
        
        // Aplicar transformaciones
        value = applyTransformations(value, options);

        const existingEntry = uniqueMap.get(value);
        
        if (existingEntry) {
          // Es un duplicado
          handleDuplicate(existingEntry, sheetData, row, columnKey, rowIndex, options, duplicateRows);
          if (options.removeDuplicates) duplicateCount++;
        } else {
          // Es un valor único
          uniqueMap.set(value, {
            value,
            originalRow: row,
            sheetName: sheetData.sheetName,
            occurrences: 1,
            locations: [{
              sheetName: sheetData.sheetName,
              columnKey,
              rowIndex
            }]
          });
        }
      });
    });
  });

  // Preparar datos limpios
  const cleanRows = Array.from(uniqueMap.values())
    .map(entry => ({
      ...entry.originalRow,
      _sheetName: entry.sheetName,
      _processedLocations: entry.locations
    }));

  // Filtrar duplicateRows para solo incluir las ocurrencias después de la primera
  const filteredDuplicateRows = duplicateRows.filter(({ duplicateInfo }) => {
    return duplicateInfo.occurrenceNumber > 1;
  });

  return formatResults(sheetsData, cleanRows, filteredDuplicateRows);
};

// Funciones auxiliares para modularizar el procesamiento
const applyTransformations = (value: any, options: ProcessingOptions): string => {
  let processedValue = String(value);
  
  if (options.trimWhitespace) processedValue = processedValue.trim();
  if (options.convertToLowercase) processedValue = processedValue.toLowerCase();
  if (options.convertToUppercase) processedValue = processedValue.toUpperCase();
  
  // Aplicar reemplazos personalizados
  options.customReplacements.forEach(replacement => {
    processedValue = processedValue.replace(new RegExp(replacement.from, 'g'), replacement.to);
  });
  
  return processedValue;
};

const handleDuplicate = (
  existingEntry: any,
  sheetData: ExcelData,
  row: Record<string, any>,
  columnKey: string,
  rowIndex: number,
  options: ProcessingOptions,
  duplicateRows: any[]
) => {
  existingEntry.occurrences++;
  existingEntry.locations.push({
    sheetName: sheetData.sheetName,
    columnKey,
    rowIndex
  });
  
  if (options.removeDuplicates) {
    duplicateRows.push({
      row,
      duplicateInfo: {
        value: existingEntry.value,
        originalSheetName: existingEntry.sheetName,
        originalRowIndex: existingEntry.locations[0].rowIndex,
        currentSheetName: sheetData.sheetName,
        columnKey,
        occurrenceNumber: existingEntry.occurrences
      }
    });
  }
};

const formatResults = (
  sheetsData: ExcelData[],
  cleanRows: Record<string, any>[],
  filteredDuplicateRows: any[]
): ProcessedResult => {
  return {
    cleanData: {
      headers: [
        ...sheetsData[0].headers,
        { key: '_sheetName', name: 'Hoja de Origen', selected: true },
        { key: '_processedLocations', name: 'Ubicaciones Procesadas', selected: true }
      ],
      rows: cleanRows,
      totalRows: cleanRows.length
    },
    duplicateData: {
      headers: [
        { key: 'Valor_Duplicado', name: 'Valor Duplicado', selected: true },
        { key: 'Hoja_Original', name: 'Hoja Original', selected: true },
        { key: 'Fila_Original', name: 'Fila Original', selected: true },
        { key: 'Hoja_Actual', name: 'Hoja Actual', selected: true },
        { key: 'Columna', name: 'Columna', selected: true },
        { key: 'Ocurrencia', name: 'Ocurrencia', selected: true }
      ],
      rows: filteredDuplicateRows.map(({ row, duplicateInfo }) => ({
        ...row,
        Valor_Duplicado: duplicateInfo.value,
        Hoja_Original: duplicateInfo.originalSheetName,
        Fila_Original: duplicateInfo.originalRowIndex + 1,
        Hoja_Actual: duplicateInfo.currentSheetName,
        Columna: duplicateInfo.columnKey,
        Ocurrencia: duplicateInfo.occurrenceNumber
      })),
      totalRows: filteredDuplicateRows.length
    },
    duplicateCount: filteredDuplicateRows.length
  };
};