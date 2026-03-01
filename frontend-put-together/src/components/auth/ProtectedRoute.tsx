import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../LoadingSpinner";

export function ProtectedRoute() {
  const { isAuthenticated, isAuthReady } = useAuth();
  const location = useLocation();

  // wait for refresh-token bootstrap
  if (!isAuthReady) {
    return <LoadingSpinner />;
  }

  // Not authenticated AFTER bootstrap
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Authenticated → render child routes
  return <Outlet />;
}