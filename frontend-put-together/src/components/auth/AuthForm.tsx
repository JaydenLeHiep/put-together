import { useState, useEffect } from "react";
import type { RegisterPayload, LoginPayload } from "./typeAuth";

type AuthFormPropsBase = {
  loading?: boolean;
  error?: string | null;
};

type AuthFormLoginProps = AuthFormPropsBase & {
  mode: "login";
  onSubmit: (data: LoginPayload) => void;
};

type AuthFormRegisterProps = AuthFormPropsBase & {
  mode: "register";
  onSubmit: (data: RegisterPayload) => void;
};

type AuthFormProps = AuthFormLoginProps | AuthFormRegisterProps;

export default function AuthForm({
  mode,
  onSubmit,
  loading = false,
  error = null,
}: AuthFormProps) {
  const isLogin = mode === "login";
  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isLogin) {
      if (password !== confirmPassword) {
        setLocalError("Passwords do not match.");
        return;
      }
    }

    if (isLogin) {
      onSubmit({
        identifier,
        password,
      });
    } else {
      onSubmit({
        username,
        email,
        password,
      });
    }
    setIdentifier("");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setLocalError(null);
  }

  useEffect(() => {
    if (!localError) return;

    const timer = setTimeout(() => {
      setLocalError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [localError]);

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        {/* Header */}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">
            {isLogin ? "Sign in to your account" : "Create your account"}
          </h2>
        </div>

        {/* Form */}
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* LOGIN: identifier */}
            {isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email or Username
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-lila-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>
            )}

            {/* REGISTER: username */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-lila-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>
            )}

            {/* REGISTER: email */}
            {!isLogin && (
              <div>
                <label className="block text-sm/6 font-medium text-black-100">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-lila-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>
            )}

            {/* PASSWORD (shared) */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm/6 font-medium text-black-100">
                  Password
                </label>

                {isLogin && (
                  <div className="text-sm">
                    <a
                      href="/forgot-password"
                      className="font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                      Forgot password?
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-2 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-lila-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    // Eye Off
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18M10.584 10.587a2 2 0 002.829 2.828M9.88 4.24A9.77 9.77 0 0112 4.5c5 0 9 7.5 9 7.5a15.05 15.05 0 01-4.293 4.918M6.53 6.53C4.89 7.86 3.75 9.5 3 12c0 0 4 7.5 9 7.5 1.32 0 2.58-.28 3.73-.78"
                      />
                    </svg>
                  ) : (
                    // Eye
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12s3.75-7.5 9.75-7.5S21.75 12 21.75 12 18 19.5 12 19.5 2.25 12 2.25 12z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {!isLogin && (
                <div>
                  <label className="block text-sm/6 font-medium text-black-100">
                    Confirm Password
                  </label>
                  <div className="mt-2 relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-lila-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.8}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 3l18 18M10.584 10.587a2 2 0 002.829 2.828M9.88 4.24A9.77 9.77 0 0112 4.5c5 0 9 7.5 9 7.5a15.05 15.05 0 01-4.293 4.918M6.53 6.53C4.89 7.86 3.75 9.5 3 12c0 0 4 7.5 9 7.5 1.32 0 2.58-.28 3.73-.78"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.8}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 12s3.75-7.5 9.75-7.5S21.75 12 21.75 12 18 19.5 12 19.5 2.25 12 2.25 12z"
                          />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ERROR */}
            {localError && <p className="text-sm text-red-400">{localError}</p>}
            {error && <p className="text-sm text-red-400">{error}</p>}

            {/* SUBMIT */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                {loading
                  ? "Processing..."
                  : isLogin
                    ? "Sign in"
                    : "Create account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
