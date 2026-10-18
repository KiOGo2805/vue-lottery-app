type ServiceFactory = () => unknown;

export class ServiceProvider {
  private static readonly factories = new Map<string, ServiceFactory>();
  private static readonly instances = new Map<string, unknown>();

  static register(key: string, factory: ServiceFactory): void {
    if (!key.trim()) {
      throw new Error("Service key cannot be empty");
    }

    this.factories.set(key, factory);
    this.instances.delete(key);
  }

  static get<T>(key: string): T {
    const existing = this.instances.get(key);
    if (existing !== undefined) {
      return existing as T;
    }

    const factory = this.factories.get(key);
    if (!factory) {
      throw new Error(`Service "${key}" is not registered`);
    }

    const instance = factory();
    this.instances.set(key, instance);
    return instance as T;
  }
}
