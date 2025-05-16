import 'reflect-metadata';

export const INJECTABLE_METADATA_KEY = 'custom:injectable';
export const PARAMS_METADATA_KEY = 'custom:params';
export const SINGLETON_METADATA_KEY = 'custom:singleton';

export type Constructor<T = any> = new (...args: any[]) => T;
export type Token<T = any> = Constructor<T> | string | symbol;

export interface IContainer {
  register<T>(token: Token<T>, implementation: any): void;
  resolve<T>(token: Token<T>): T;
}

export class Container implements IContainer {
  private static instance: Container;
  private readonly registry = new Map<Token, any>();
  private readonly singletons = new Map<Token, any>();

  private constructor() { }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public register<T>(token: Token<T>, implementation: any): void {
    this.registry.set(token, implementation);
  }

  public registerSingleton<T>(token: Token<T>, implementation: T): void {
    this.singletons.set(token, implementation);
  }

  public resolve<T>(token: Token<T>): T {
    // Check singletons first
    if (this.singletons.has(token)) {
      return this.singletons.get(token);
    }

    // Check registered implementations
    const implementation = this.registry.get(token);
    if (implementation) {
      if (typeof implementation === 'function' && this.isInjectable(implementation)) {
        const instance = this.createInstance(implementation);
        if (this.isSingleton(implementation)) {
          this.singletons.set(token, instance);
        }
        return instance;
      }
      return implementation;
    }

    // Try to create instance if token is constructor
    if (typeof token === 'function' && this.isInjectable(token)) {
      const instance = this.createInstance(token);
      if (this.isSingleton(token)) {
        this.singletons.set(token, instance);
      }
      return instance;
    }

    throw new Error(`Cannot resolve ${this.getTokenName(token)}`);
  }

  private createInstance<T>(ctor: Constructor<T>): T {
    const paramTypes = this.getParameterTypes(ctor);
    const dependencies = paramTypes.map(type => this.resolve(type));
    return new ctor(...dependencies);
  }

  private isInjectable(target: any): boolean {
    return Reflect.hasMetadata(INJECTABLE_METADATA_KEY, target);
  }

  private isSingleton(target: any): boolean {
    return Reflect.hasMetadata(SINGLETON_METADATA_KEY, target);
  }

  private getParameterTypes(target: any): Token[] {
    return Reflect.getMetadata(PARAMS_METADATA_KEY, target) || [];
  }

  private getTokenName(token: Token): string {
    if (typeof token === 'function') {
      return token.name;
    }
    return String(token);
  }

  public clearRegistry(): void {
    this.registry.clear();
    this.singletons.clear();
  }
}
