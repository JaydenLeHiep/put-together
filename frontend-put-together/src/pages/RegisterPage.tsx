import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";
import type { RegisterPayload } from "../components/auth/typeAuth";
import { createUser } from "../services/userService";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleRegister(data: RegisterPayload) {
    try {
      setLoading(true);
      setErrorMessage(null);

      await createUser(data);

      setSuccessMessage(
        "Registration successful! Please check your email to verify.",
      );
    } catch {
      setErrorMessage("Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {successMessage && (
        <div className="space-y-4">
          <SuccessMessage title="Success!" message={successMessage} />

          <div className="text-center">
            <button
              onClick={() => navigate("/resend-verify")}
              className="text-indigo-600 hover:underline text-sm"
            >
              Didn’t receive the email? Resend verification
            </button>
          </div>
        </div>
      )}
      {errorMessage && (
        <ErrorMessage
          title="Error!"
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}

      <AuthForm
        mode="register"
        onSubmit={handleRegister}
        loading={loading}
        error={errorMessage}
      />
    </div>
  );
}
