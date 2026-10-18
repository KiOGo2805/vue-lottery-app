import { http } from "../../../shared/api";
import type { AuthResponse, LoginCredentials } from "../model/auth";
import type { User } from "../../../shared/model";

export class AuthService {
  login(credentials: LoginCredentials): Promise<AuthResponse> {
    return http<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ ...credentials, expiresInMins: 30 }),
    });
  }

  getCurrentUser(): Promise<User> {
    return http<User>("/auth/me");
  }
}
