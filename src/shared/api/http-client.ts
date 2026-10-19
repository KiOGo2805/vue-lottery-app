import { refreshAccessToken } from "./token-refresh";

const BASE_URL = import.meta.env.VITE_API_URL;

export async function http<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const accessToken = localStorage.getItem("accessToken");
  const headers = new Headers(options.headers || {});

  headers.set("Content-Type", "application/json");

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (
    response.status === 401 &&
    path !== "/auth/login" &&
    path !== "/auth/refresh"
  ) {
    const refreshedAccessToken = await refreshAccessToken(BASE_URL);

    if (refreshedAccessToken) {
      headers.set("Authorization", `Bearer ${refreshedAccessToken}`);
      response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    }
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
