import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';
import { ExcelData } from '../types';

interface ResultsTableProps {
  data: ExcelData | null;
  onExport: (fileName: string) => void;
  fileName: string;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  data,
  onExport,
  fileName
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const rowsPerPage = 10;

  if (!data || data.rows.length === 0) {
    return (
      <div className="bg-white border rounded-lg p-8 text-center">
        <p className="text-gray-500">No hay datos disponibles</p>
      </div>
    );
  }

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Ordenar los datos
  const sortedRows = [...data.rows].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const valueA = a[sortColumn];
    const valueB = b[sortColumn];
    
    // Manejar valores nulos o indefinidos
    if (valueA === undefined || valueA === null) return sortDirection === 'asc' ? -1 : 1;
    if (valueB === undefined || valueB === null) return sortDirection === 'asc' ? 1 : -1;
    
    // Ordenar según el tipo de dato
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    // Para números y otros tipos
    return sortDirection === 'asc' 
      ? (valueA > valueB ? 1 : -1) 
      : (valueA > valueB ? -1 : 1);
  });

  // Paginación
  const totalPages = Math.ceil(sortedRows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = sortedRows.slice(startIndex, startIndex + rowsPerPage);
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <h3 className="font-medium text-gray-700">Resultados ({data.rows.length} filas)</h3>
          {'duplicateCount' in data && (
            <p className="text-sm text-red-600 mt-1">
              Duplicados encontrados: {String(data.duplicateCount)}
            </p>
          )}
        </div>
        <button
          onClick={() => onExport(fileName)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {data.headers.map((header) => (
                <th
                  key={header.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort(header.key)}
                >
                  <div className="flex items-center">
                    {header.name}
                    {sortColumn === header.key && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                {data.headers.map((header) => (
                  <td key={header.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row[header.key] !== undefined && row[header.key] !== null
                      ? String(row[header.key])
                      : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Paginación */}
      {totalPages > 1 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
                <span className="font-medium">
                  {Math.min(startIndex + rowsPerPage, data.rows.length)}
                </span>{' '}
                de <span className="font-medium">{data.rows.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Anterior</span>
                  <ChevronDown className="h-5 w-5 rotate-90" />
                </button>
                
                {/* Botones de página */}
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNum;
                  
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => goToPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                        ${currentPage === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Siguiente</span>
                  <ChevronDown className="h-5 w-5 -rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;