import { User, ExcelData, ProcessingOption } from '../types';

// Usuarios mock para desarrollo
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Usuario de Prueba',
    email: 'usuario@ejemplo.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
  },
  {
    id: '2',
    name: 'Administrador',
    email: 'admin@ejemplo.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
  }
];

// Autenticación mock
export const mockLogin = (email: string, password: string): Promise<{ user: User, token: string } | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // En un entorno real, esto sería validado en el servidor
      if ((email === 'usuario@ejemplo.com' && password === 'password123') || 
          (email === 'admin@ejemplo.com' && password === 'admin123')) {
        const user = mockUsers.find(u => u.email === email);
        if (user) {
          resolve({
            user,
            token: 'mock-jwt-token-' + Math.random().toString(36).substring(2)
          });
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    }, 800); // Simulando latencia de red
  });
};

// Datos de Excel mock para desarrollo
export const mockExcelData: ExcelData = {
  headers: [
    { key: 'id', name: 'ID', selected: true },
    { key: 'nombre', name: 'Nombre', selected: true },
    { key: 'email', name: 'Email', selected: true },
    { key: 'telefono', name: 'Teléfono', selected: true },
    { key: 'ciudad', name: 'Ciudad', selected: true },
    { key: 'fecha', name: 'Fecha', selected: true }
  ],
  rows: [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@ejemplo.com', telefono: '555-1234', ciudad: 'Madrid', fecha: '2023-01-15' },
    { id: 2, nombre: 'María López', email: 'maria@ejemplo.com', telefono: '555-5678', ciudad: 'Barcelona', fecha: '2023-02-20' },
    { id: 3, nombre: 'Carlos Ruiz', email: 'carlos@ejemplo.com', telefono: '555-9012', ciudad: 'Valencia', fecha: '2023-03-10' },
    { id: 4, nombre: 'Ana García', email: 'ana@ejemplo.com', telefono: '555-3456', ciudad: 'Sevilla', fecha: '2023-04-05' },
    { id: 5, nombre: 'Pedro Martín', email: 'pedro@ejemplo.com', telefono: '555-7890', ciudad: 'Bilbao', fecha: '2023-05-25' },
    { id: 5, nombre: 'Pedro Martín', email: 'pedro@ejemplo.com', telefono: '555-7890', ciudad: 'Bilbao', fecha: '2023-05-25' }, // Duplicado intencional
    { id: 6, nombre: 'Laura Sánchez ', email: 'laura@ejemplo.com', telefono: '555-2345', ciudad: ' Madrid ', fecha: '2023-06-12' }, // Espacios en blanco
    { id: 7, nombre: 'Miguel Torres', email: 'miguel@ejemplo.com', telefono: '555-6789', ciudad: 'Barcelona', fecha: '2023-07-30' },
    { id: 8, nombre: 'Sofía Navarro', email: 'sofia@ejemplo.com', telefono: '', ciudad: 'Valencia', fecha: '2023-08-22' }, // Teléfono vacío
    { id: 9, nombre: 'Javier Moreno', email: 'javier@ejemplo.com', telefono: '555-0123', ciudad: 'Sevilla', fecha: '2023-09-14' },
    { id: 10, nombre: '', email: '', telefono: '', ciudad: '', fecha: '' }, // Fila vacía
  ],
  totalRows: 11
};

// Opciones de procesamiento mock
export const mockProcessingOptions: ProcessingOption[] = [
  {
    id: 'removeDuplicates',
    name: 'Eliminar duplicados',
    description: 'Elimina filas duplicadas basadas en los valores de las columnas seleccionadas',
    enabled: true
  },
  {
    id: 'trimWhitespace',
    name: 'Eliminar espacios en blanco',
    description: 'Elimina espacios en blanco al inicio y final de cada celda',
    enabled: true
  },
  {
    id: 'convertToLowercase',
    name: 'Convertir a minúsculas',
    description: 'Convierte todos los textos a minúsculas',
    enabled: false
  },
  {
    id: 'convertToUppercase',
    name: 'Convertir a mayúsculas',
    description: 'Convierte todos los textos a mayúsculas',
    enabled: false
  },
  {
    id: 'removeEmptyRows',
    name: 'Eliminar filas vacías',
    description: 'Elimina filas que no contienen datos en las columnas seleccionadas',
    enabled: true
  },
  {
    id: 'formatNumbers',
    name: 'Formatear números',
    description: 'Aplica formato a valores numéricos',
    enabled: false
  },
  {
    id: 'formatDates',
    name: 'Formatear fechas',
    description: 'Estandariza el formato de fechas',
    enabled: false
  }
];