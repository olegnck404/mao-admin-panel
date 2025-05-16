import { PaginationParams } from '../dto/PaginationParams';

export interface IBaseRepository<T, TId = string, TFilters = any> {
  findById(id: TId): Promise<T | null>;
  findAll(params: PaginationParams, filters?: TFilters): Promise<T[]>;
  save(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: TId): Promise<void>;
  count(filters?: TFilters): Promise<number>;
}

export interface IQueryableRepository<T, TFilters = any> {
  query(filters: TFilters): Promise<T[]>;
}

export interface IAggregateRepository<T, TAggregation = any> {
  aggregate(params: TAggregation): Promise<any>;
}
