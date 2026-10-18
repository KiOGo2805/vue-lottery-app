import { AuthService } from "../../entities/session";
import { UserService } from "../../entities/user";
import { ServiceProvider } from "../../shared/api";

export function registerServices(): void {
  ServiceProvider.register("auth", () => new AuthService());
  ServiceProvider.register("users", () => new UserService());
}
