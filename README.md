# ExcelCleaner

Una aplicación web profesional para limpiar y procesar archivos Excel, desarrollada con React, TypeScript y TailwindCSS.

## Características

- Autenticación de usuarios
- Carga de archivos Excel (.xlsx, .xls)
- Selección de columnas a procesar
- Opciones de limpieza personalizables
- Visualización de resultados en tabla interactiva
- Exportación de datos procesados

## Requisitos

- Node.js (versión 16 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/excel-cleaner.git
cd excel-cleaner
```

2. Instalar dependencias
```bash
npm install
```

3. Iniciar el servidor de desarrollo
```bash
npm run dev
```

4. Abrir el navegador en http://localhost:5173

## Uso

1. Inicia sesión con tu cuenta o utiliza las credenciales de prueba:
   - Email: usuario@ejemplo.com
   - Contraseña: password123

2. En el Dashboard, sube un archivo Excel utilizando el componente de arrastrar y soltar o seleccionando un archivo.

3. Selecciona las columnas que deseas procesar.

4. Configura las opciones de limpieza según tus necesidades.

5. Procesa el archivo y visualiza los resultados.

6. Exporta los datos procesados en el formato deseado.

## Tecnologías utilizadas

- React.js
- TypeScript
- Vite
- TailwindCSS
- React Router
- XLSX (SheetJS)
- React Dropzone

## Estructura del proyecto

```
/src
  /components      # Componentes reutilizables
  /pages           # Páginas de la aplicación
  /utils           # Utilidades y funciones auxiliares
  /hooks           # Custom hooks
  /types           # Interfaces y tipos TypeScript
  /assets          # Imágenes, iconos, etc.
  /styles          # Estilos globales
  /contexts        # Contextos de React
  /mocks           # Datos de prueba
```

## Licencia

MIT