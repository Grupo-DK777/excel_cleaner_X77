import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';
import { ExcelData } from '../types';

interface ResultsTableProps {
  data: ExcelData | null;
  onExport: (fileName: string) => void;
  fileName: string;
  onRestart: () => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  data,
  onExport,
  fileName,
  onRestart,
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

  const sortedRows = [...data.rows].sort((a, b) => {
    if (!sortColumn) return 0;
    const valueA = a[sortColumn];
    const valueB = b[sortColumn];

    if (valueA === undefined || valueA === null) return sortDirection === 'asc' ? -1 : 1;
    if (valueB === undefined || valueB === null) return sortDirection === 'asc' ? 1 : -1;

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    return sortDirection === 'asc'
      ? valueA > valueB ? 1 : -1
      : valueA > valueB ? -1 : 1;
  });

  const totalPages = Math.ceil(sortedRows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = sortedRows.slice(startIndex, startIndex + rowsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const calculatePageNumber = (index: number, current: number, total: number): number => {
    if (total <= 5) return index + 1;
    if (current <= 3) return index + 1;
    if (current >= total - 2) return total - 4 + index;
    return current - 2 + index;
  };

  return (
    <div className="bg-white border rounded-lg shadow-lg overflow-hidden">
      {/* Cabecera con botón exportar */}
      <div className="flex justify-between items-center p-6 border-b bg-gray-50">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Resultados ({data.rows.length} filas)
          </h3>
          {'duplicateCount' in data && (
            <p className="text-sm text-red-600 mt-1 font-medium">
              Duplicados encontrados: {String(data.duplicateCount)}
            </p>
          )}
        </div>
        <button
          onClick={() => onExport(fileName)}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center font-medium shadow-sm"
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar Resultados
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-100">
              {data.headers.map((header) => (
                <th
                  key={header.key}
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleSort(header.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{header.name}</span>
                    {sortColumn === header.key && (
                      <span className="text-blue-600">
                        {sortDirection === 'asc'
                          ? <ChevronUp className="h-4 w-4" />
                          : <ChevronDown className="h-4 w-4" />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-blue-50 transition-colors">
                {data.headers.map((header) => (
                  <td key={header.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
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
      <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between border-t border-gray-200 bg-gray-50 gap-4">
        <div className="text-sm text-gray-700">
          Mostrando <span className="font-semibold">{startIndex + 1}</span> a{' '}
          <span className="font-semibold">{Math.min(startIndex + rowsPerPage, data.rows.length)}</span> de{' '}
          <span className="font-semibold">{data.rows.length}</span> resultados
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Anterior
          </button>
          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            const pageNum = calculatePageNumber(i, currentPage, totalPages);
            return (
              <button
                key={i}
                onClick={() => goToPage(pageNum)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pageNum === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;
