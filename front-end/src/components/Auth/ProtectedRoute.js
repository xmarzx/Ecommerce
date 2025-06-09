import React, { useContext, useEffect, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useContext(AuthContext);
  const location = useLocation();
  const toastShownRef = useRef(false);

  useEffect(() => {
    toastShownRef.current = false;
  }, [location.pathname]);

  if (loading) {
    return <div>Cargando autenticación...</div>;
  }

  if (!isAuthenticated) {
    if (!toastShownRef.current) {
      toast.error("Necesitas iniciar sesión para acceder a esta página.");
      toastShownRef.current = true;
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!user || !user.role || !allowedRoles.includes(user.role)) {
      if (!toastShownRef.current) {
        toast.error(
          "No tienes los permisos necesarios para acceder a esta página."
        );
        toastShownRef.current = true;
      }
      return <Navigate to="/" replace state={{ from: location }} />;
    }
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
