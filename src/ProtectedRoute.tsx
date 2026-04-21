import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    
    if (!allowedRoles.includes(payload.role)) {
      return <Navigate to="/login" replace />;
    }
    
  } catch (err) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>; // wrap children in fragment
};

export default ProtectedRoute;