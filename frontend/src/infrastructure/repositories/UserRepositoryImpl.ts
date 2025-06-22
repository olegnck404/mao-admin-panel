import { Injectable } from '../../core/di/decorators';
import { PaginationParams } from '../../domain/dto/PaginationParams';
import { UserFilters } from '../../domain/dto/QueryParams';
import { User } from '../../domain/entities/User';
import { ApplicationError } from '../../domain/errors/ApplicationError';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserApi } from '../api/UserApi';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly api: UserApi) { }

  async findAll(pagination: PaginationParams, filters?: UserFilters): Promise<User[]> {
    try {
      const response = await this.api.fetchUsers(pagination, filters);
      return response.items.map(userData => new User(
        userData.id,
        userData.name,
        userData.email,
        userData.role
      ));
    } catch (error) {
      throw new ApplicationError(
        'USERS_FETCH_ERROR',
        'Error getting user list'
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
        `Error getting user: ${id}`
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
        'Error creating user'
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
        'Error updating user'
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.api.deleteUser(id);
    } catch (error) {
      throw new ApplicationError(
        'USER_DELETE_ERROR',
        'Error deleting user'
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
        'Error counting users'
      );
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    // TODO: implement
    return null;
  }

  async findActive(params: PaginationParams): Promise<User[]> {
    // TODO: implement
    return [];
  }

  async countActive(): Promise<number> {
    // TODO: implement
    return 0;
  }
}
