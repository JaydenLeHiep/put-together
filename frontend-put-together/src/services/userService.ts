import type { RegisterPayload, LoginPayload, LoginInfo, RefreshInfo } from "../components/auth/typeAuth"
import { getApiBaseUrl } from "../config/runtimeConfig";

const API = `${getApiBaseUrl()}/api/users`;

export async function createUser(registerPayload: RegisterPayload): Promise<void> {
    const res = await fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(registerPayload),
    });
    if (!res.ok) throw new Error("User register fehlgeschlagen.");
}

export async function loginUser(loginPayload: LoginPayload): Promise<LoginInfo> {
    const res = await fetch(`${API}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginPayload),
    });

    if (!res.ok) throw new Error("User login fehlgeschlagen.");

    return res.json();
}

export async function createRefreshTokenUser(): Promise<RefreshInfo> {
    const res = await fetch(`${API}/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!res.ok) throw new Error("User refresh fehlgeschlagen.");

    return res.json();
}

export async function logoutUser(): Promise<void> {
    const res = await fetch(`${API}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!res.ok) throw new Error("User logout fehlgeschlagen.");

    return res.json();
}




