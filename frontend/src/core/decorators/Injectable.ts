import 'reflect-metadata';

export type Constructor<T = any> = new (...args: any[]) => T;

export function Injectable() {
  return function <T>(target: Constructor<T>) {
    if (!Reflect.hasMetadata('injectable', target)) {
      Reflect.defineMetadata('injectable', true, target);
      Reflect.defineMetadata('params', Reflect.getMetadata('design:paramtypes', target) || [], target);
    }
    return target;
  };
}

export function Inject(token: Constructor) {
  return function (target: any, _propertyKey: string | symbol, parameterIndex: number) {
    const params = Reflect.getMetadata('design:paramtypes', target) || [];
    params[parameterIndex] = token;
    Reflect.defineMetadata('design:paramtypes', params, target);
  };
}

export class Container {
  private static instance: Container;
  private dependencies = new Map<Constructor, any>();
  private singletons = new Map<Constructor, any>();

  private constructor() { }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public register<T>(token: Constructor<T>, implementation: T): void {
    this.dependencies.set(token, implementation);
  }

  public registerSingleton<T>(token: Constructor<T>, implementation: T): void {
    this.singletons.set(token, implementation);
  }

  public resolve<T>(token: Constructor<T>): T {
    // Check for singleton
    const singleton = this.singletons.get(token);
    if (singleton) {
      return singleton;
    }

    // Check for registered dependency
    const dependency = this.dependencies.get(token);
    if (dependency) {
      return dependency;
    }

    // Create a new instance
    if (Reflect.hasMetadata('injectable', token)) {
      const params = Reflect.getMetadata('params', token) || [];
      const dependencies = params.map((param: Constructor) => this.resolve(param));
      const instance = new token(...dependencies);

      // If it's a singleton, save the instance
      if (Reflect.hasMetadata('singleton', token)) {
        this.singletons.set(token, instance);
      }

      return instance;
    }

    throw new Error(`Failed to create an instance of ${token.name}. Make sure the class is marked with @Injectable()`);
  }

  public clearContainer(): void {
    this.dependencies.clear();
    this.singletons.clear();
  }
}
