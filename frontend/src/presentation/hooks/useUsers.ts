import { useCallback, useEffect, useState } from 'react';
import { UserService } from '../../application/services/UserService';
import { DEFAULT_PAGE_SIZE } from '../../config/constants';
import { Container } from '../../core/di/Container';
import { PaginationParams } from '../../domain/dto/PaginationParams';
import { UserFilters } from '../../domain/dto/QueryParams';
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
  setFilters: (newFilters: UserFilters) => void;
}

export const useUsers = (
  initialFilters: UserFilters = {},
  initialPagination: Partial<PaginationParams> = {}
): UseUsersResult => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApplicationError | null>(null);

  const [pagination, setPagination] = useState({
    currentPage: initialPagination.page || 1,
    totalItems: 0,
    pageSize: initialPagination.limit || DEFAULT_PAGE_SIZE,
  });
  const [filters, setFiltersState] = useState<UserFilters>(initialFilters);
  const userService = Container.getInstance().resolve(UserService);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new PaginationParams(
        pagination.currentPage,
        pagination.pageSize
      );
      const result = await userService.getUsers(params, filters);

      if (result.isSuccess()) {
        const { items, total } = result.getValue();
        setUsers(items);
        setPagination((prev) => ({ ...prev, totalItems: total }));
      } else {
        setError(result.getError());
      }
    } catch (err) {
      if (err instanceof ApplicationError) {
        setError(err);
      } else {
        setError(new ApplicationError('FETCH_ERROR', 'An unexpected error occurred'));
      }
    } finally {
      setLoading(false);
    }
  }, [userService, pagination.currentPage, pagination.pageSize, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const setPage = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const setFilters = (newFilters: UserFilters) => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setFiltersState(newFilters);
  };

  return {
    users,
    loading,
    error,
    pagination,
    filters,
    refreshUsers: fetchUsers,
    setPage,
    setFilters,
  };
};
