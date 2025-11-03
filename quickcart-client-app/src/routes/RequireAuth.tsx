import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectRoles } from "../features/auth/authSelectors";

interface RequireAuthProps {
  allowedRoles?: string[];
  children: React.ReactElement;
}

export default function RequireAuth({
  allowedRoles,
  children,
}: RequireAuthProps) {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const roles = useSelector(selectRoles);

  if (!isAuthenticated) {
    // Not logged in — redirect to login
    return <Navigate to="/sign" state={{ from: location }} replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.some((r) => roles.includes(r as any))
  ) {
    // Logged in but not allowed
    return <Navigate to="/unauthorized" replace />;
  }

  // Allowed → show the protected content
  return children;
}