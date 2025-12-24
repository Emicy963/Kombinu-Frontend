import { Moon, Sun } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/debug/ErrorBoundary';
import { LogViewer } from './components/debug/LogViewer';
import { Header } from './components/layout/Header';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import CriarConteudo from './pages/CriarConteudo';
import DashboardAprendiz from './pages/DashboardAprendiz';
import DashboardCriador from './pages/DashboardCriador';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Marketplace from './pages/Marketplace';
import PainelAdmin from './pages/PainelAdmin';
import Quiz from './pages/Quiz';
import Ranking from './pages/Ranking';
import Register from './pages/Register';
import VisualizarConteudo from './pages/VisualizarConteudo';
import { logger } from './utils/logger';

// Dark Mode Toggle Component
function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
             (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="fixed top-4 right-4 z-50 p-3 bg-white dark:bg-dark-bg-secondary rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-dark-border-primary"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
}

// Log de inicialização da aplicação
logger.info('Aplicação KOMBINU inicializada', 'App', {
  version: '1.0.0',
  environment: import.meta.env.MODE,
  timestamp: new Date().toISOString()
});

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
  const { usuario, loading } = useAuth();
  
  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }
  
  if (!usuario) {
    logger.debug('Usuário não autenticado, redirecionando para login', 'ProtectedRoute');
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(usuario.tipo)) {
    logger.warning(
      `Usuário ${usuario.id} tentou acessar rota não autorizada`,
      'ProtectedRoute',
      { userType: usuario.tipo, allowedRoles }
    );
    return <Navigate to={usuario.tipo === 'criador' ? '/dashboard-criador' : '/dashboard-aprendiz'} />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const authContext = useAuth();
  
  // Verifica se o contexto está disponível
  if (!authContext) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Inicializando aplicação...</p>
        </div>
      </div>
    );
  }
  
  const { usuario } = authContext;
  
  useEffect(() => {
    if (usuario) {
      logger.info(
        `Usuário autenticado: ${usuario.nome}`,
        'AppRoutes',
        { userId: usuario.id, userType: usuario.tipo }
      );
    }
  }, [usuario]);
  
  return (
    <ErrorBoundary context="AppRoutes">
      <Routes>
        <Route path="/" element={
          <ErrorBoundary context="LandingPage">
            <LandingPage />
          </ErrorBoundary>
        } />
        
        <Route path="/login" element={
          <ErrorBoundary context="Login">
            <Login />
          </ErrorBoundary>
        } />
        
        <Route path="/register" element={
          <ErrorBoundary context="Register">
            <Register />
          </ErrorBoundary>
        } />
        
        <Route path="/dashboard-criador" element={
          <ProtectedRoute allowedRoles={['criador']}>
            <ErrorBoundary context="DashboardCriador">
              <Header />
              <DashboardCriador />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard-aprendiz" element={
          <ProtectedRoute allowedRoles={['aprendiz']}>
            <ErrorBoundary context="DashboardAprendiz">
              <Header />
              <DashboardAprendiz />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        
        <Route path="/marketplace" element={
          <ProtectedRoute allowedRoles={['criador', 'aprendiz']}>
            <ErrorBoundary context="Marketplace">
              <Header />
              <Marketplace />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        
        <Route path="/criar-conteudo" element={
          <ProtectedRoute allowedRoles={['criador']}>
            <ErrorBoundary context="CriarConteudo">
              <Header />
              <CriarConteudo />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        
        <Route path="/conteudo/:id" element={
          <ProtectedRoute allowedRoles={['criador', 'aprendiz']}>
            <ErrorBoundary context="VisualizarConteudo">
              <Header />
              <VisualizarConteudo />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        
        <Route path="/quiz/:id" element={
          <ProtectedRoute allowedRoles={['aprendiz']}>
            <ErrorBoundary context="Quiz">
              <Header />
              <Quiz />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        
        <Route path="/ranking" element={
          <ProtectedRoute allowedRoles={['criador', 'aprendiz']}>
            <ErrorBoundary context="Ranking">
              <Header />
              <Ranking />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ErrorBoundary context="PainelAdmin">
              <Header />
              <PainelAdmin />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ErrorBoundary>
  );
}

function App() {
  useEffect(() => {
    logger.info('Componente App montado', 'App');
    
    return () => {
      logger.info('Componente App desmontado', 'App');
    };
  }, []);

  return (
    <ErrorBoundary context="App">
      <AuthProvider>
        <DataProvider>
          <Router>
            <div className="min-h-screen dark-bg-primary">
              <DarkModeToggle />
              <AppRoutes />
              {/* LogViewer apenas em desenvolvimento */}
              {import.meta.env.DEV && <LogViewer />}
            </div>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;