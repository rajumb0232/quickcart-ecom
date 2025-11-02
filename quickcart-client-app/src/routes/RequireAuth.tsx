import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useTypedSelector } from "../hooks/reduxHooks"; 

interface RequireAuthProps {
  allowedRoles?: string[];
  children: React.ReactElement;
}

export default function RequireAuth({ allowedRoles, children }: RequireAuthProps) {
  // access auth state from Redux
  const auth = useTypedSelector((state) => state.auth);
  const location = useLocation();

  if (!auth.isAuthenticated) {
    // Not logged in — redirect to login
    return <Navigate to="/sign" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.some((r) => auth.roles.includes(r as any))) {
    // Logged in but not allowed
    return <Navigate to="/unauthorized" replace />;
  }

  // Allowed → show the protected content
  return children;
}
