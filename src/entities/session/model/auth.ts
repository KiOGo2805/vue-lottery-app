import type { User } from "../../../shared/model";

export interface AuthResponse extends User {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  username: string;
  password?: string;
  expiresInMins?: number;
}
