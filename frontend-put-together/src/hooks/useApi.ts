import { createRefreshTokenUser } from "../services/userService";
import { useAuth } from "./useAuth";

let refreshPromise: Promise<string> | null = null;

export function useApi() {
    const { accessToken, setAccessToken, logout } = useAuth();

    async function apiFetch(
        input: RequestInfo,
        init: RequestInit = {}
    ): Promise<Response> {
        // send access token from memory
        const headers = new Headers(init.headers);
        headers.set("Content-Type", "application/json");
        if (accessToken) {
            headers.set("Authorization", `Bearer ${accessToken}`);
        }

        const response = await fetch(input, {
            ...init,
            headers,
            credentials: "include",
        });

        if (response.status !== 401) {
            return response;
        }

        // unauthorized → refresh (single flight)
        if (!refreshPromise) {
            refreshPromise = createRefreshTokenUser()
                .then(res => {
                    setAccessToken(res.accessToken);
                    return res.accessToken;
                })
                .catch(async err => {
                    await logout();
                    throw err;
                })
                .finally(() => {
                    refreshPromise = null;
                });
        }

        const newAccessToken = await refreshPromise;

        // retry original request ONCE
        const retryHeaders = new Headers(init.headers);
        retryHeaders.set("Content-Type", "application/json");
        retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);

        return fetch(input, {
            ...init,
            headers: retryHeaders,
            credentials: "include",
        });
    }

    return { apiFetch };
}

let apiFetchRef:
    | ((input: RequestInfo, init?: RequestInit) => Promise<Response>)
    | null = null;

export function setApiFetch(
    apiFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>
) {
    apiFetchRef = apiFetch;
}

export function apiFetch(
    input: RequestInfo,
    init?: RequestInit
): Promise<Response> {
    if (!apiFetchRef) {
        throw new Error("apiFetch has not been initialized yet");
    }
    return apiFetchRef(input, init);
}