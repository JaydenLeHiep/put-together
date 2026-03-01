import React, { useState, useEffect } from "react";
import { forgotPassword } from "../services/userService";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      await forgotPassword(email);

      setSuccessMessage(
        "If the email exists, a password reset link has been sent.",
      );
    } catch {
      setErrorMessage("Failed to send password reset email.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!errorMessage) return;

    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  return (
    <div className="max-w-md mx-auto mt-20 space-y-6">
      {successMessage && (
        <SuccessMessage title="Email Sent!" message={successMessage} />
      )}

      {errorMessage && (
        <ErrorMessage
          title="Error"
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}

      <form onSubmit={handleForgotPassword} className="space-y-4">
        <h2 className="text-xl font-semibold text-center">Forgot Password</h2>

        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:border-indigo-500 transition-colors"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-400 transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};
