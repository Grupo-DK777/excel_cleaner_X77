import { read, utils } from 'xlsx';
import { ExcelData, ExcelColumn } from '../../types';

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