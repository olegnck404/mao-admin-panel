
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FilterParams {
  role?: string;
  searchQuery?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface UserFilters extends FilterParams {
  role?: string;
  searchQuery?: string;
}

export class UserQueryBuilder {
  private params: URLSearchParams;

  constructor(filters?: UserFilters, pagination?: PaginationParams) {
    this.params = new URLSearchParams();

    if (pagination) {
      this.params.set('page', pagination.page.toString());
      this.params.set('limit', pagination.limit.toString());
    }

    if (filters?.role) {
      this.params.set('role', filters.role);
    }

    if (filters?.searchQuery) {
      this.params.set('q', filters.searchQuery);
    }
  }

  toString(): string {
    const query = this.params.toString();
    return query ? `?${query}` : '';
  }
}
