import { ProcessingOptions } from '../types';

export const DEFAULT_PROCESSING_OPTIONS: ProcessingOptions = {
  removeDuplicates: true,
  trimWhitespace: true,
  convertToLowercase: false,
  convertToUppercase: false,
  removeEmptyRows: true,
  formatNumbers: false,
  formatDates: false,
  customReplacements: []
};

export const PROCESSING_OPTION_LABELS = {
  removeDuplicates: 'Eliminar duplicados',
  trimWhitespace: 'Eliminar espacios en blanco',
  convertToLowercase: 'Convertir a minúsculas',
  convertToUppercase: 'Convertir a mayúsculas',
  removeEmptyRows: 'Eliminar filas vacías',
  formatNumbers: 'Formatear números',
  formatDates: 'Formatear fechas'
};