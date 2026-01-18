// export type AuthMode = "login" | "register";

export type RegisterPayload = {
    username: string;
    email: string;
    password: string;
};

export type LoginPayload = {
    identifier: string;
    password: string;
};

export type LoginInfo = {
    accessToken: string;
    refreshToken: string;
    userInfo: AuthUser
}

export type AuthUser = {
    id: string;
    userName: string;
    email: string;
    role: string;
};

export type AuthContextType = {
    user: AuthUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isAuthReady: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    logout: () => Promise<void>;
    setAccessToken: (token: string | null) => void;
};

export type RefreshInfo = {
    accessToken: string,
    expirationInSeconds: number
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";
