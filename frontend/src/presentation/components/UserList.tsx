import React, { useState } from 'react';
import { USER_ROLES } from '../../config/constants';
import { UserFilters } from '../../domain/dto/QueryParams';
import { useUsers } from '../hooks/useUsers';

const UserList: React.FC = () => {
    const { users, loading, error, pagination, setPage, setFilters } = useUsers();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('');

    const handleSearch = () => {
        const filters: UserFilters = {};
        if (searchQuery) filters.searchQuery = searchQuery;
        if (selectedRole) filters.role = selectedRole;
        setFilters(filters);
    };

    const totalPages = Math.ceil(pagination.totalItems / pagination.pageSize);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div style={{ color: 'red' }}>
                <h2>Error</h2>
                <p>
                    <strong>{error.code}:</strong> {error.message}
                </p>
            </div>
        );
    }

    return (
        <div className="user-list">
            <h1>User List</h1>

            <div className="filters">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name..."
                />
                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    <option value="">All roles</option>
                    <option value={USER_ROLES.ADMIN}>Administrator</option>
                    <option value={USER_ROLES.USER}>User</option>
                    <option value={USER_ROLES.MANAGER}>Manager</option>
                </select>
                <button onClick={handleSearch}>Search</button>
            </div>

            <ul>
                {users.map((user) => (
                    <li key={user.getId()}>
                        {user.getName()} - {user.getEmail()}
                    </li>
                ))}
            </ul>

            <div className="pagination">
                <button
                    onClick={() => setPage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                >
                    Previous
                </button>
                <span>
                    Page {pagination.currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setPage(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UserList;
