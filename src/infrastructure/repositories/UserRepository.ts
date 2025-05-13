import { Injectable } from '../../core/di/decorators';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserApi } from '../api/UserApi';
import { PaginationParams } from '../../domain/dto/PaginationParams';
import { UserFilters } from '../../domain/dto/UserFilters';
import { ApplicationError } from '../../domain/errors/ApplicationError';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly api: UserApi) { }
}

  async getAll(pagination ?: PaginationParams, filters ?: UserFilters): Promise < PaginatedResponse < IUser >> {
  return this.api.fetchUsers(pagination, filters);
}

  async getById(_id: string): Promise < IUser | null > {
  throw new NotFoundError('Method not implemented');
}

  async create(_user: IUser): Promise < IUser > {
  throw new NotFoundError('Method not implemented');
}

  async update(_id: string, _user: IUser): Promise < IUser > {
  throw new NotFoundError('Method not implemented');
}

  async delete (_id: string): Promise < void> {
  throw new NotFoundError('Method not implemented');
}
}
