import { utils, write } from 'xlsx';
import { ProcessedResult } from './types';

export const exportToExcel = (processedResult: ProcessedResult, fileName: string): void => {
  const workbook = utils.book_new();

  // Crear hoja para datos limpios con una sola columna
  const cleanData = processedResult.cleanData.rows.map(row => ({
    'Datos Limpios': Object.values(row)[0] // Tomamos solo el primer valor de cada fila
  }));
  const cleanWs = utils.json_to_sheet(cleanData);
  utils.book_append_sheet(workbook, cleanWs, 'Datos Limpios');

  // Crear hoja para datos duplicados con el formato específico
  const duplicateData = processedResult.duplicateData.rows.map(row => ({
    'Valor Duplicado': row.Valor_Duplicado,
    'Hoja Original': row.Hoja_Original,
    'Fila Original': row.Fila_Original,
    'Columna': row.Columna,
    'Ocurrencia': row.Ocurrencia
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