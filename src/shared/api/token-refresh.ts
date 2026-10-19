interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export async function refreshAccessToken(
  baseUrl: string,
): Promise<string | null> {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    window.location.href = "/login";
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken, expiresInMins: 30 }),
    });

    if (!response.ok) {
      throw new Error("Refresh token expired");
    }

    const data: TokenRefreshResponse = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    return data.accessToken;
  } catch (error) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
    throw error;
  }
}
