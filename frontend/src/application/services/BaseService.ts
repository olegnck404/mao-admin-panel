import { Injectable } from '../../core/di/decorators';
import { IBaseRepository } from '../../domain/interfaces/IRepository';
import { PaginationParams } from '../../domain/dto/PaginationParams';
import { Result } from '../../core/Result';
import { ApplicationError } from '../../domain/errors/ApplicationError';

@Injectable()
export abstract class BaseService<T, TId = string, TFilters = any> {
  constructor(
    protected readonly repository: IBaseRepository<T, TId, TFilters>
  ) { }

  public async findAll(
    pagination: PaginationParams,
    filters?: TFilters
  ): Promise<Result<{ items: T[]; total: number }>> {
    try {
      const [items, total] = await Promise.all([
        this.repository.findAll(pagination, filters),
        this.repository.count(filters)
      ]);
      return Result.ok({ items, total });
    } catch (error) {
      return Result.fail(
        this.handleError(error, 'FETCH_ERROR', 'Помилка при отриманні даних')
      );
    }
  }

  public async findById(id: TId): Promise<Result<T>> {
    try {
      const entity = await this.repository.findById(id);
      if (!entity) {
        return Result.fail(
          new ApplicationError(
            'NOT_FOUND',
            `Сутність з ID ${String(id)} не знайдена`
          )
        );
      }
      return Result.ok(entity);
    } catch (error) {
      return Result.fail(
        this.handleError(error, 'FETCH_ERROR', 'Помилка при отриманні даних')
      );
    }
  }

  public async save(entity: T): Promise<Result<T>> {
    try {
      const savedEntity = await this.repository.save(entity);
      return Result.ok(savedEntity);
    } catch (error) {
      return Result.fail(
        this.handleError(error, 'SAVE_ERROR', 'Помилка при збереженні даних')
      );
    }
  }

  public async update(entity: T): Promise<Result<T>> {
    try {
      const updatedEntity = await this.repository.update(entity);
      return Result.ok(updatedEntity);
    } catch (error) {
      return Result.fail(
        this.handleError(error, 'UPDATE_ERROR', 'Помилка при оновленні даних')
      );
    }
  }

  public async delete(id: TId): Promise<Result<void>> {
    try {
      await this.repository.delete(id);
      return Result.ok();
    } catch (error) {
      return Result.fail(
        this.handleError(error, 'DELETE_ERROR', 'Помилка при видаленні даних')
      );
    }
  }

  protected handleError(
    error: unknown,
    code: string,
    defaultMessage: string
  ): ApplicationError {
    if (error instanceof ApplicationError) {
      return error;
    }
    return new ApplicationError(
      code,
      error instanceof Error ? error.message : defaultMessage,
      error
    );
  }
}
