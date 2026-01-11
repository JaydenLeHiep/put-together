import { useState } from "react";
import AuthForm from "../components/auth/AuthForm";
import type { LoginPayload } from "../components/auth/typeAuth";
import { useAuth } from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/";

  async function handleLogin(data: LoginPayload) {
    try {
      setLoading(true);
      setError(null);

      await login(data);

      navigate(from, { replace: true });
    } catch {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthForm
      mode="login"
      onSubmit={handleLogin}
      loading={loading}
      error={error}
    />
  );
}
