import { useCallback, useState } from 'react';
import { PaginationParams } from '../../domain/dto/PaginationParams';
import { UserFilters } from '../../domain/dto/UserFilters';
import { User } from '../../domain/entities/User';
import { ApplicationError } from '../../domain/errors/ApplicationError';

export interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: ApplicationError | null;
  pagination: {
    currentPage: number;
    totalItems: number;
    pageSize: number;
  };
  filters: UserFilters;
  refreshUsers: () => Promise<void>;
  setPage: (page: number) => void;
  setFilters: (filters: UserFilters) => void;
}

export const useUsers = (
  initialFilters: UserFilters = {},
  initialPagination: PaginationParams = new PaginationParams()
): UseUsersResult => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApplicationError | null>(null);
  const [pagination, setPagination] = useState(new PaginationParams());
  const [filters, setFilters] = useState<UserFilters>(initialFilters);

  const userService = ServiceFactory.getInstance().getUserService();

  const loadUsers = useCallback(async (page: number = 1, userFilters: UserFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const pagination: PaginationParams = {
        page,
        limit: DEFAULT_PAGE_SIZE
      };

      const response = await userService.getUsers(pagination, userFilters);
      setUsers(response.items);
      setTotalItems(response.total);
      setCurrentPage(page);
      setFilters(userFilters);
    } catch (err) {
      const errorMessage = err instanceof ApplicationError
        ? err.message
        : 'An error occurred while loading users';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const changePage = (page: number) => {
    loadUsers(page, filters);
  };

  const updateFilters = (newFilters: UserFilters) => {
    loadUsers(1, { ...filters, ...newFilters });
  };

  return {
    users,
    loading,
    error,
    totalItems,
    currentPage,
    filters,
    loadUsers,
    changePage,
    updateFilters
  };
};
