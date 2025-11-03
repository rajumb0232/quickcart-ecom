import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../features/auth/authSelectors";

interface RequireUnAuthProps {
  children: React.ReactElement;
}

export default function RequireUnAuth({ children }: RequireUnAuthProps) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (isAuthenticated) {
    // Redirect to home or to where they came from
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}
