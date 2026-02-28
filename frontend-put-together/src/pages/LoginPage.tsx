import { useState, useEffect } from "react";
import AuthForm from "../components/auth/AuthForm";
import type { LoginPayload } from "../components/auth/typeAuth";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    if (user.role === "Admin") {
      navigate("/admin/dashboard", { replace: true });
    } else if (user.role === "Student") {
      navigate("/student/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  async function handleLogin(data: LoginPayload) {
    try {
      setLoading(true);
      setErrorMessage(null);

      await login(data);
      setSuccessMessage("Login successful!.");
    } catch {
      setErrorMessage("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {successMessage && (
        <SuccessMessage
          title="Success!"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
      {errorMessage && (
        <ErrorMessage
          title="Error!"
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
      <AuthForm
        mode="login"
        onSubmit={handleLogin}
        loading={loading}
        error={errorMessage}
      />
    </>
  );
}
