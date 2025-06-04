import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileSpreadsheet, User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y nombre */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <FileSpreadsheet className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">ExcelCleaner</span>
            </Link>
          </div>

          {/* Enlaces para desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors ${isActive('/dashboard')}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/resultados"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors ${isActive('/resultados')}`}
                >
                  Resultados
                </Link>
                
                {/* Perfil de usuario */}
                <div className="ml-4 flex items-center">
                  <div className="flex items-center">
                    {user?.avatar ? (
                      <img
                        className="h-8 w-8 rounded-full border-2 border-white"
                        src={user.avatar}
                        alt={user.name}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-300 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-700" />
                      </div>
                    )}
                    <span className="ml-2 text-sm font-medium">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-4 flex items-center text-sm px-3 py-2 rounded-md bg-blue-700 hover:bg-blue-800 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Salir
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors ${isActive('/login')}`}
              >
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Botón de menú móvil */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-600 pb-3 px-4">
          {isAuthenticated ? (
            <>
              <div className="pt-2 pb-4 space-y-1">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors ${isActive('/dashboard')}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/resultados"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors ${isActive('/resultados')}`}
                >
                  Resultados
                </Link>
              </div>
              
              {/* Perfil en móvil */}
              <div className="pt-4 pb-3 border-t border-blue-700">
                <div className="flex items-center px-3">
                  {user?.avatar ? (
                    <img
                      className="h-10 w-10 rounded-full border-2 border-white"
                      src={user.avatar}
                      alt={user.name}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-300 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-700" />
                    </div>
                  )}
                  <div className="ml-3">
                    <div className="text-base font-medium">{user?.name}</div>
                    <div className="text-sm text-blue-200">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="pt-2 pb-3 space-y-1">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors ${isActive('/login')}`}
              >
                Iniciar Sesión
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;