import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ExcelProcessingProvider } from './hooks/useExcelProcessing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';

function App() {
  return (
    <AuthProvider>
      <ExcelProcessingProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resultados" element={<Results />} />
            <Route path="/" element={<Navigate replace to="/dashboard" />} />
          </Routes>
        </Router>
      </ExcelProcessingProvider>
    </AuthProvider>
  );
}

export default App;