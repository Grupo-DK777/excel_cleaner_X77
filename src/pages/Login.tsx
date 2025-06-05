import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import EpicLoginBackground from '../components/background/EpicLoginBackground';
import LoginFooter from "../components/ui/LoginFooter";


const Login: React.FC = () => {
  const { isAuthenticated, login, loading, error } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validateForm = (): boolean => {
    const errors = { email: '', password: '' };
    let isValid = true;

    if (!formData.email) {
      errors.email = 'El email es obligatorio';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'La contraseña es obligatoria';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Debe tener al menos 6 caracteres';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = await login(formData.email, formData.password);
    if (success) navigate('/dashboard');
  };

  return (
    <EpicLoginBackground>
      <div className="relative z-10 min-h-screen flex items-center justify-center py-6 px-6 sm:px-8 lg:px-10">
        <div className="w-full max-w-md space-y-4 bg-gradient-to-b from-white/10 to-black/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10">
          <div className="text-center animate-fade-in">
            <div className="flex justify-center items-center mt-2 mb-6">
              <img
                src="/images/LogoX77.png"
                alt="Logo X77"
                className="h-52 w-auto drop-shadow-xl hover:scale-110 hover:rotate-2 hover:brightness-110 transform transition-all duration-500 cursor-pointer"
              />
            </div>
            <h2 className="text-3xl font-extrabold text-white">ExcelCleaner</h2>
            <p className="mt-3 text-base text-gray-300">
              Inicia sesión para limpiar y procesar tus archivos Excel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="usuario@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 bg-white/10 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border ${
                    formErrors.email ? 'border-red-400' : 'border-white/20'
                  }`}
                />
              </div>
              {formErrors.email && <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 bg-white/10 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border ${
                    formErrors.password ? 'border-red-400' : 'border-white/20'
                  }`}
                />
              </div>
              {formErrors.password && <p className="text-red-400 text-sm mt-1">{formErrors.password}</p>}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start text-sm text-red-600">
                <AlertCircle className="h-5 w-5 mr-2 text-red-500 mt-0.5" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 rounded-md text-white font-semibold ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>

            <p className="text-xs text-center text-gray-300 mt-2">
              <span className="font-semibold">Credenciales de prueba:</span>
              <br />
              usuario@ejemplo.com — password123
            </p>
          </form>
        </div>
      </div>
      <LoginFooter />
    </EpicLoginBackground>
  );
};

export default Login;
