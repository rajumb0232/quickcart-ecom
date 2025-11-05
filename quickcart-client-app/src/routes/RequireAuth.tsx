import React from "react";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectRoles,
} from "../features/auth/authSelectors";
import { Navigate, useLocation } from "react-router-dom";

interface RequireAuthProps {
  allowedRoles?: string[];
  children: React.ReactElement;
}

export default function RequireAuth({
  allowedRoles,
  children,
}: RequireAuthProps) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const roles = useSelector(selectRoles);
  const location = useLocation();

  if (!isAuthenticated) {
    // Not logged in — redirect to login page with the current location for redirect after login
    return <Navigate to="/sign" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.some((r) => roles.includes(r as any))) {
    // Logged in but not authorized for this role — redirect to sign or unauthorized page
    return <Navigate to="/sign" replace />;
  }

  // Allowed → show the protected content
  return children;
}
