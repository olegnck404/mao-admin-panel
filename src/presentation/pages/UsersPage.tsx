import React from 'react';
import { PaginationParams } from '../../domain/dto/PaginationParams';
import { UserFilters } from '../../domain/dto/UserFilters';
import { UserRole } from '../../domain/entities/User';
import { Pagination } from '../components/common/Pagination';
import { Table } from '../components/common/Table';
import { useFilters } from '../hooks/useFilters';
import { usePagination } from '../hooks/usePagination';
import { useUsers } from '../hooks/useUsers';

interface UsersPageProps {
    initialFilters?: UserFilters;
    initialPagination?: PaginationParams;
}

export const UsersPage: React.FC<UsersPageProps> = ({
    initialFilters,
    initialPagination = new PaginationParams()
}) => {
    const { filters, setFilters } = useFilters<UserFilters>(initialFilters);
    const { pagination, setPagination } = usePagination(initialPagination);
    const { users, loading, error, totalCount } = useUsers(filters, pagination);

    if (loading) return <div>Завантаження...</div>;
    if (error) return <div>Помилка: {error.message}</div>;

    const columns = [
        { key: 'name', title: 'Ім\'я' },
        { key: 'email', title: 'Email' },
        { key: 'role', title: 'Роль', 
          render: (role: UserRole) => role.toString() 
        }
    ];

    return (
        <div className="users-page">
            <h1>Користувачі</h1>
            
            <Table 
                data={users}
                columns={columns}
                loading={loading}
            />

            <Pagination
                currentPage={pagination.page}
                totalPages={Math.ceil(totalCount / pagination.limit)}
                onPageChange={(page) => setPagination({ ...pagination, page })}
            />
        </div>
    );
};
