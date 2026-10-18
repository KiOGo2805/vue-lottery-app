import { http } from "../../../shared/api/http-client";
import type {
  AuthResponse,
  LoginCredentials,
} from "../../../shared/types/auth";
import type { User } from "../../user/model/user";

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
