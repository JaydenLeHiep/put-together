import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import {
  loginUser,
  createRefreshTokenUser,
  logoutUser,
} from "../../services/userService";
import type { AuthUser, LoginPayload, AuthStatus } from "./typeAuth";
import { ApiInitializer } from "./ApiInitializer";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const res = await createRefreshTokenUser();
        if (cancelled) return;

        setAccessToken(res.accessToken);
        setStatus("authenticated");
      } catch {
        setStatus("unauthenticated");
      } finally {
        setIsAuthReady(true);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (payload: LoginPayload) => {
    const res = await loginUser(payload);

    setUser(res.userInfo);
    setAccessToken(res.accessToken);
    setStatus("authenticated");
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore
    }

    setAccessToken(null);
    setUser(null);
    setStatus("unauthenticated");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: status === "authenticated",
        isAuthReady,
        login,
        logout,
        setAccessToken,
      }}
    >
      <ApiInitializer />
      {children}
    </AuthContext.Provider>
  );
}
