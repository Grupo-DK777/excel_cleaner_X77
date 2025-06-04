export const tableStyles = {
  // Contenedor principal
  wrapper: "bg-white border rounded-lg shadow-lg overflow-hidden",
  
  // Sección de encabezado
  header: {
    container: "flex justify-between items-center p-6 border-b bg-gray-50",
    titleSection: {
      title: "text-lg font-semibold text-gray-800",
      duplicateCount: "text-sm text-red-600 mt-1 font-medium"
    }
  },

  // Tabla
  table: {
    container: "overflow-x-auto",
    table: "min-w-full divide-y divide-gray-200",
    thead: "bg-gray-100",
    th: "px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors",
    sortIconContainer: "flex items-center space-x-1",
    sortIcon: {
      wrapper: "text-blue-600",
      icon: "h-4 w-4"
    }
  },

  // Cuerpo de la tabla
  tbody: {
    base: "bg-white divide-y divide-gray-200",
    row: "hover:bg-blue-50 transition-colors",
    cell: "px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium"
  },

  // Paginación
  pagination: {
    container: "px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-gray-50",
    content: "flex-1 flex justify-between items-center",
    text: "text-sm text-gray-700",
    bold: "font-semibold",
    buttonGroup: "flex items-center space-x-2",
    pageNumbers: "flex space-x-1",
    button: {
      base: "px-4 py-2 border text-sm font-medium rounded-md transition-colors shadow-sm",
      navigation: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",
      active: "bg-blue-600 border-blue-600 text-white",
      inactive: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
    }
  },

  // Estado vacío
  empty: {
    container: "bg-white border rounded-lg p-8 text-center",
    text: "text-gray-500"
  }
} as const;