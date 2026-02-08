import { useState, useEffect } from "react";
import AuthForm from "../components/auth/AuthForm";
import type { LoginPayload } from "../components/auth/typeAuth";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    if (user.role === "Admin") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/course", { replace: true });
    }
  }, [user, navigate]);

  async function handleLogin(data: LoginPayload) {
    try {
      setLoading(true);
      setError(null);

      await login(data);

      // Role-based landing
      navigate("/after-login", { replace: true });
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