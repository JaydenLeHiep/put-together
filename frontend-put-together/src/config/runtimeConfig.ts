declare global {
  interface Window {
    __CONFIG__?: {
      API_BASE_URL?: string;
    };
  }
}

export function getApiBaseUrl(): string {
  const injected = window.__CONFIG__?.API_BASE_URL;

  if (injected && injected !== "__API_BASE_URL__") {
    return injected;
  }

  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  return "http://localhost:5242";
}