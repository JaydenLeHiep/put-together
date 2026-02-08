import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  sub: string;
  unique_name: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
};

export function userFromAccessToken(token: string) {
  const decoded = jwtDecode<JwtPayload>(token);

  return {
    id: decoded.sub,
    userName: decoded.unique_name,
    email: "",
    role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
  };
}