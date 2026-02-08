import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../LoadingSpinner";

export default function AfterLoginRedirect() {
  const { user, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return <LoadingSpinner />;
  }

  if (user?.role === "Admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/course" replace />;
}