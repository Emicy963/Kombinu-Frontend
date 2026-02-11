import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('creator' | 'learner' | 'admin')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { usuario, loading } = useAuth();
  const location = useLocation();

  // Se o contexto está a carregar, mostra spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Se não estiver logado, redireciona para login
  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se o utilizador logado não pertencer ao array de roles permitidos, manda para a base
  if (allowedRoles && !allowedRoles.includes(usuario.tipo as any)) {
    return <Navigate to={usuario.tipo === 'criador' ? '/dashboard/creator' : '/dashboard/learner'} replace />;
  }

  return <>{children}</>;
}
