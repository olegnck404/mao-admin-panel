import 'reflect-metadata';
import { INJECTABLE_METADATA_KEY, PARAMS_METADATA_KEY, SINGLETON_METADATA_KEY, Token } from './Container';

export function Injectable(): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, target);

    // Store parameter types
    const types = Reflect.getMetadata('design:paramtypes', target) || [];
    Reflect.defineMetadata(PARAMS_METADATA_KEY, types, target);

    return target;
  };
}

export function Singleton(): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata(SINGLETON_METADATA_KEY, true, target);
    return Injectable()(target);
  };
}

export function Inject(token: Token): ParameterDecorator {
  return (target: any, _: string | symbol | undefined, parameterIndex: number) => {
    const existingParams = Reflect.getMetadata(PARAMS_METADATA_KEY, target) || [];
    existingParams[parameterIndex] = token;
    Reflect.defineMetadata(PARAMS_METADATA_KEY, existingParams, target);
  };
}
