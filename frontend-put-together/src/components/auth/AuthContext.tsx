import { createContext } from "react";
import type { AuthContextType } from "./typeAuth";

export const AuthContext = createContext<AuthContextType | null>(null);
