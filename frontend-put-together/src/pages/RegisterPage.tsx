import { useState } from "react";
import AuthForm from "../components/auth/AuthForm";
import type { RegisterPayload } from "../components/auth/typeAuth";
import { createUser } from "../services/userService";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(data: RegisterPayload) {
    try {
      setLoading(true);
      setError(null);

      await createUser(data);

      alert("Registration successful!");
    } catch {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthForm
      mode="register"
      onSubmit={handleRegister}
      loading={loading}
      error={error}
    />
  );
}
