import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { JSX } from "react";
import LoadingSpinner from "../LoadingSpinner";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading, isAuthReady } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthReady) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}
