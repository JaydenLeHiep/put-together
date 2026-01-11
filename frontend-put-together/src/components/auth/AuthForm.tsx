import { useState } from "react";
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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
  }

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

                {/* {isLogin && (
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                      Forgot password?
                    </a>
                  </div>
                )} */}
              </div>

              <div className="mt-2">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-lila-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>

            {/* ERROR */}
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
