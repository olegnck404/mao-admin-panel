import { Injectable } from '../../core/di/decorators';
import { PaginationParams } from '../../domain/dto/PaginationParams';
import { UserFilters } from '../../domain/dto/UserFilters';
import { User } from '../../domain/entities/User';
import { ApplicationError } from '../../domain/errors/ApplicationError';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserApi } from '../api/UserApi';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly api: UserApi) { }

  async findAll(pagination: PaginationParams, filters?: UserFilters): Promise<User[]> {
    try {
      const response = await this.api.getUsers(pagination, filters);
      return response.items.map(userData => new User(
        userData.id,
        userData.name,
        userData.email,
        userData.role
      ));
    } catch (error) {
      throw new ApplicationError(
        'USERS_FETCH_ERROR',
        'Помилка при отриманні списку користувачів',
        error
      );
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const userData = await this.api.getUser(id);
      return userData ? new User(
        userData.id,
        userData.name,
        userData.email,
        userData.role
      ) : null;
    } catch (error) {
      throw new ApplicationError(
        'USER_FETCH_ERROR',
        `Помилка при отриманні користувача: ${id}`,
        error
      );
    }
  }

  async save(user: User): Promise<User> {
    try {
      const userData = await this.api.createUser({
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        role: user.getRole()
      });
      return new User(
        userData.id,
        userData.name,
        userData.email,
        userData.role
      );
    } catch (error) {
      throw new ApplicationError(
        'USER_CREATE_ERROR',
        'Помилка при створенні користувача',
        error
      );
    }
  }

  async update(user: User): Promise<User> {
    try {
      const userData = await this.api.updateUser(user.getId(), {
        name: user.getName(),
        email: user.getEmail(),
        role: user.getRole()
      });
      return new User(
        userData.id,
        userData.name,
        userData.email,
        userData.role
      );
    } catch (error) {
      throw new ApplicationError(
        'USER_UPDATE_ERROR',
        'Помилка при оновленні користувача',
        error
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.api.deleteUser(id);
    } catch (error) {
      throw new ApplicationError(
        'USER_DELETE_ERROR',
        'Помилка при видаленні користувача',
        error
      );
    }
  }

  async count(filters?: UserFilters): Promise<number> {
    try {
      const response = await this.api.getUsersCount(filters);
      return response.total;
    } catch (error) {
      throw new ApplicationError(
        'USERS_COUNT_ERROR',
        'Помилка при підрахунку користувачів',
        error
      );
    }
  }
}
