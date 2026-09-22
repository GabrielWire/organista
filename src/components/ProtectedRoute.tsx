import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types/auth';
import { Loader2 } from 'lucide-react';

interface Props {
  children: React.ReactElement;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400 mb-3" />
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Carregando portal CCB...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If user document not yet loaded or doesn't have required role
  if (allowedRoles && userData && !allowedRoles.includes(userData.role)) {
    if (userData.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/aluno" replace />;
  }

  return children;
};
