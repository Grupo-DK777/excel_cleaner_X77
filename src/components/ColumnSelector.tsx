import React from 'react';
import { Check, X } from 'lucide-react';
import { ExcelColumn } from '../types';

interface ColumnSelectorProps {
  columns: ExcelColumn[];
  selectedColumns: string[];
  onColumnToggle: (columnKey: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  columns,
  selectedColumns,
  onColumnToggle,
  onSelectAll,
  onDeselectAll
}) => {
  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="border-b px-4 py-3 bg-gray-50 flex items-center justify-between">
        <h3 className="font-medium text-gray-700">Selección de columnas</h3>
        <div className="flex space-x-2">
          <button
            onClick={onSelectAll}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Seleccionar todo
          </button>
          <button
            onClick={onDeselectAll}
            className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Deseleccionar todo
          </button>
        </div>
      </div>
      
      <div className="p-4 max-h-60 overflow-y-auto">
        {columns.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay columnas disponibles</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {columns.map((column) => {
              const isSelected = selectedColumns.includes(column.key);
              return (
                <div
                  key={column.key}
                  className={`border rounded-md p-3 cursor-pointer transition-colors
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 hover:bg-blue-100' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }
                  `}
                  onClick={() => onColumnToggle(column.key)}
                >
                  <div className="flex items-center">
                    <div 
                      className={`w-5 h-5 rounded flex items-center justify-center mr-2
                        ${isSelected 
                          ? 'bg-blue-600 text-white' 
                          : 'border border-gray-300 bg-white'
                        }
                      `}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {column.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="px-4 py-3 bg-gray-50 border-t">
        <p className="text-sm text-gray-600">
          {selectedColumns.length} de {columns.length} columnas seleccionadas
        </p>
      </div>
    </div>
  );
};

export default ColumnSelector;