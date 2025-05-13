import { UserService } from '../../application/services/UserService';
import { UserApi } from '../api/UserApi';
import { UserRepository } from '../repositories/UserRepository';

export class ServiceFactory {
  private static instance: ServiceFactory;
  private userService: UserService | null = null;

  private constructor() { }

  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  getUserService(): UserService {
    if (!this.userService) {
      const api = new UserApi();
      const repository = new UserRepository(api);
      this.userService = new UserService(repository);
    }
    return this.userService;
  }
}
