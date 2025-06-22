import { Container } from '../core/di/Container';
import { Injectable } from '../core/di/decorators';
import { PaginationParams } from '../domain/dto/PaginationParams';
import { IUserRepository } from '../domain/repositories/IUserRepository';

// Example of using the Injectable decorator
@Injectable()
export class UserService {
  constructor(private readonly userRepository: IUserRepository) { }

  async getUsers() {
    return this.userRepository.findAll(new PaginationParams());
  }
}

const mockUserRepository: IUserRepository = {
  findAll: async (params, filters) => [],
  findByEmail: async (email) => null,
  findActive: async (params) => [],
  countActive: async () => 0,
  findById: async (id) => null,
  save: async (entity) => entity,
  update: async (entity) => entity,
  delete: async (id) => { },
  count: async (filters) => 0,
};

// Example of setting dependencies
const container = Container.getInstance();

// Registering dependencies
container.register('IUserRepository', mockUserRepository);
container.register(UserService, UserService);

// Getting an instance of a service with automatic dependency injection
const userService = container.resolve(UserService);
