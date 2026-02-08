import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import {
  loginUser,
  createRefreshTokenUser,
  logoutUser,
} from "../../services/userService";
import type { AuthUser, LoginPayload, AuthStatus } from "./typeAuth";
import { ApiInitializer } from "./ApiInitializer";
import { userFromAccessToken } from "../../utils/jwt";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      try {
        const res = await createRefreshTokenUser();
        setAccessToken(res.accessToken);
        setUser(userFromAccessToken(res.accessToken));
        setStatus("authenticated");
      } catch {
        setUser(null);
        setAccessToken(null);
        setStatus("unauthenticated");
      } finally {
        setIsAuthReady(true);
      }
    }
    bootstrap();
  }, []);

  const login = async (payload: LoginPayload) => {
    const res = await loginUser(payload);

    localStorage.removeItem("pt_logged_out");

    setUser({
      id: res.userInfo.id,
      userName: res.userInfo.userName,
      email: res.userInfo.email,
      role: res.userInfo.roleName,
    });

    setAccessToken(res.accessToken);
    setStatus("authenticated");
  };

  const logout = async () => {
    try {
      await logoutUser(); // backend deletes refresh cookie
    } catch { }

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