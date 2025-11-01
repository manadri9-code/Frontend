import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <p>Cargando...</p>; // Muestra "cargando" mientras revisa el token
  }

  // Si no está logueado, redirige a /login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Si está logueado, muestra el contenido de la ruta (la página)
  return <Outlet />;
};

export default ProtectedRoute;