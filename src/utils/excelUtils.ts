import { read, utils, write } from 'xlsx';
import { ExcelData, ExcelColumn, ProcessingOptions } from '../types';

/**
 * Lee un archivo Excel y extrae sus datos
 */
export const readExcelFile = async (file: File): Promise<ExcelData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        
        // Procesar todas las hojas
        const sheetsData: ExcelData[] = workbook.SheetNames.map(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = utils.sheet_to_json(worksheet);
          
          const headers: ExcelColumn[] = [];
          if (jsonData.length > 0) {
            Object.keys(jsonData[0] as object).forEach((key) => {
              headers.push({
                key,
                name: key,
                selected: true
              });
            });
          }
          
          return {
            sheetName,
            headers,
            rows: jsonData as Record<string, any>[],
            totalRows: jsonData.length
          };
        });
        
        resolve(sheetsData);
      } catch (error) {
        reject(new Error('Error al procesar el archivo Excel'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Valida si el archivo es un archivo Excel válido
 */
export const validateExcelFile = (file: File): boolean => {
  const validTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel.sheet.macroEnabled.12'
  ];
  
  // Verificar el tipo MIME
  if (!validTypes.includes(file.type)) {
    // Verificar la extensión como respaldo
    const extension = file.name.split('.').pop()?.toLowerCase();
    return extension === 'xls' || extension === 'xlsx';
  }
  
  return true;
};

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
        value = String(value);
        if (options.trimWhitespace) value = value.trim();
        if (options.convertToLowercase) value = value.toLowerCase();
        if (options.convertToUppercase) value = value.toUpperCase();
        
        // Aplicar reemplazos personalizados
        options.customReplacements.forEach(replacement => {
          value = value.replace(new RegExp(replacement.from, 'g'), replacement.to);
        });

        const existingEntry = uniqueMap.get(value);
        
        if (existingEntry) {
          // Es un duplicado
          existingEntry.occurrences++;
          existingEntry.locations.push({
            sheetName: sheetData.sheetName,
            columnKey,
            rowIndex
          });
          
          if (options.removeDuplicates) {
            duplicateCount++;
            duplicateRows.push({
              row,
              duplicateInfo: {
                value,
                originalSheetName: existingEntry.sheetName,
                originalRowIndex: existingEntry.locations[0].rowIndex,
                currentSheetName: sheetData.sheetName,
                columnKey,
                occurrenceNumber: existingEntry.occurrences
              }
            });
          }
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
    const entry = uniqueMap.get(duplicateInfo.value);
    return duplicateInfo.occurrenceNumber > 1;
  });

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
        ...sheetsData[0].headers,
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

export const exportToExcel = (processedResult: ProcessedResult, fileName: string): void => {
  const workbook = utils.book_new();

  // Crear hoja para datos limpios - una sola columna
  const cleanData = processedResult.cleanData.rows.map(row => ({
    'Dato': Object.values(row)[0] // Tomar solo el primer valor de cada fila
  }));
  const cleanWs = utils.json_to_sheet(cleanData);
  utils.book_append_sheet(workbook, cleanWs, 'Datos Limpios');

  // Crear hoja para datos duplicados con el formato específico
  const duplicateData = processedResult.duplicateData.rows.map(row => ({
    'Dato': row.Valor_Duplicado,
    'Fila Original': row.Fila_Original,
    'Hoja': row.Hoja_Original,
    'Veces Duplicado': row.Ocurrencia
  }));
  const duplicateWs = utils.json_to_sheet(duplicateData);
  utils.book_append_sheet(workbook, duplicateWs, 'Duplicados');

  // Exportar el libro
  const blob = new Blob([write(workbook, { bookType: 'xlsx', type: 'array' })], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  // Descargar el archivo
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}_processed.xlsx`;
  link.click();
  window.URL.revokeObjectURL(url);
};

interface ProcessedResult {
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