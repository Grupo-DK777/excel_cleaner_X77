import React from 'react';
import { Download, FileSpreadsheet, File as FileCsv } from 'lucide-react';

interface DownloadButtonProps {
  onExport: (fileName: string) => void;
  fileName: string;
  disabled?: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  onExport,
  fileName,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleExport = () => {
    onExport(fileName);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center justify-center px-4 py-2 rounded-md text-white transition-colors ${
          disabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        <Download className="h-4 w-4 mr-2" />
        Exportar
      </button>
      
      {isOpen && !disabled && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              type="button"
              onClick={handleExport}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              role="menuitem"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
              Exportar como Excel (.xlsx)
            </button>
            {/* Se podrían agregar más opciones de exportación en el futuro */}
            <button
              type="button"
              onClick={handleExport}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              role="menuitem"
            >
              <FileCsv className="h-4 w-4 mr-2 text-blue-600" />
              Exportar como CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadButton;