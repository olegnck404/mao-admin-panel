import { Container } from '../core/di/Container';
import { Injectable } from '../core/di/decorators';
import { IUserRepository } from '../domain/repositories/IUserRepository';

// Пример использования декоратора Injectable
@Injectable()
export class UserService {
  constructor(private readonly userRepository: IUserRepository) { }

  async getUsers() {
    return this.userRepository.findAll();
  }
}

// Пример установки зависимостей
const container = Container.getInstance();

// Регистрация зависимостей
container.register('IUserRepository', mockUserRepository);
container.register(UserService, UserService);

// Получение экземпляра сервиса с автоматическим внедрением зависимостей
const userService = container.resolve(UserService);
