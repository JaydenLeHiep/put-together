import { useState } from "react";
import { resendVerification } from "../services/userService";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";

export default function ResendVerifyPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage(null);

      await resendVerification(email);

      setSuccessMessage("Verification email has been sent again.");
    } catch {
      setErrorMessage("Failed to resend verification email.");
    } finally {
      setLoading(false);
    }
  };

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

      <form onSubmit={handleResend} className="space-y-4">
        <h2 className="text-xl font-semibold text-center">
          Resend Verification Email
        </h2>

        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-xl p-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-500 text-white py-2 rounded-lg"
        >
          {loading ? "Sending..." : "Resend Email"}
        </button>
      </form>
    </div>
  );
}
