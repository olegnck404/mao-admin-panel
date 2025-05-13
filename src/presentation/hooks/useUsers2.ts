import { useCallback, useEffect, useState } from 'react';
import { UserService } from '../../application/services/UserService';
import { Container } from '../../core/di/Container';
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
  const [pagination, setPagination] = useState(initialPagination);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<UserFilters>(initialFilters);

  const userService = Container.getInstance().resolve(UserService);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [items, total] = await Promise.all([
        userService.findAll(pagination, filters),
        userService.count(filters)
      ]);

      setUsers(items);
      setTotalItems(total);
    } catch (err) {
      setError(
        err instanceof ApplicationError
          ? err
          : new ApplicationError('UNKNOWN_ERROR', 'Невідома помилка при завантаженні користувачів')
      );
    } finally {
      setLoading(false);
    }
  }, [pagination, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const setPage = useCallback((page: number) => {
    setPagination(prev => new PaginationParams(page, prev.limit));
  }, []);

  const updateFilters = useCallback((newFilters: UserFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => new PaginationParams(1, prev.limit)); // Сброс на первую страницу
  }, []);

  return {
    users,
    loading,
    error,
    pagination: {
      currentPage: pagination.page,
      totalItems,
      pageSize: pagination.limit
    },
    filters,
    refreshUsers: fetchUsers,
    setPage,
    setFilters: updateFilters
  };
};
