import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../services/userService";
import LoadingSpinner from "../components/LoadingSpinner";
import SuccessMessage from "../components/SuccessMessage";
import ErrorMessage from "../components/ErrorMessage";

export const EmailVerifyPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setErrorMessage("Invalid or missing token.");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);

        setSuccessMessage(
          "Email verified successfully! Redirecting to login...",
        );

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch {
        setErrorMessage(
          "Verification failed. Token may be invalid or expired.",
        );
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [searchParams, navigate]);

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
    <div className="mt-20 flex flex-col items-center">
      {loading && (
        <>
          <LoadingSpinner />
          <p className="mt-4">Verifying your email...</p>
        </>
      )}

      {!loading && successMessage && (
        <div className="w-full max-w-md mt-6">
          <SuccessMessage title="Success!" message={successMessage} />
        </div>
      )}

      {!loading && errorMessage && (
        <div className="w-full max-w-md mt-6">
          <ErrorMessage
            title="Error!"
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
          />
        </div>
      )}
    </div>
  );
};
