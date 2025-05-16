import { API_CONFIG, ERROR_MESSAGES } from '../../config/constants';
import { PaginatedResponse, PaginationParams, UserFilters, UserQueryBuilder } from '../../domain/dto/QueryParams';
import { ApplicationError, NotFoundError } from '../../domain/errors/ApplicationError';
import { IUser } from '../../domain/interfaces/IUser';

export class UserApi {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  async fetchUsers(pagination?: PaginationParams, filters?: UserFilters): Promise<PaginatedResponse<IUser>> {
    try {
      const queryBuilder = new UserQueryBuilder(filters, pagination);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(`${this.baseUrl}/users${queryBuilder.toString()}`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        this.handleResponseError(response);
      }

      const data = await response.json();
      return {
        items: data.users,
        total: data.total,
        page: data.page,
        totalPages: data.totalPages,
        hasNext: data.hasNext,
        hasPrevious: data.hasPrevious
      };
    } catch (error) {
      if (error instanceof ApplicationError) {
        throw error;
      }
      throw new ApplicationError(
        ERROR_MESSAGES.NETWORK_ERROR,
        'NETWORK_ERROR'
      );
    }
  }

  private handleResponseError(response: Response): never {
    switch (response.status) {
      case 404:
        throw new NotFoundError('Users');
      case 401:
        throw new ApplicationError(ERROR_MESSAGES.UNAUTHORIZED, 'UNAUTHORIZED');
      case 403:
        throw new ApplicationError(ERROR_MESSAGES.FORBIDDEN, 'FORBIDDEN');
      default:
        throw new ApplicationError(ERROR_MESSAGES.UNKNOWN_ERROR, 'UNKNOWN_ERROR');
    }
  }
}
