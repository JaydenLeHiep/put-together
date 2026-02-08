import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../LoadingSpinner";

export function AdminRoute() {
  const { user, isAuthenticated, isAuthReady } = useAuth();
  const location = useLocation();

  // Wait for auth bootstrap (refresh token check)
  if (!isAuthReady) {
    return <LoadingSpinner />;
  }

  // Not logged in → go to login
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Logged in but not admin → redirect to user area
  if (user.role !== "Admin") {
    return <Navigate to="/course" replace />;
  }

  // Authorized admin → render nested admin routes
  return <Outlet />;
}