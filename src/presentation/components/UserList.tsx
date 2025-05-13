import React, { useEffect, useState } from 'react';
import { USER_ROLES } from '../../config/constants';
import { useUsers } from '../hooks/useUsers';

const UserList: React.FC = () => {
  const { 
    users, 
    loading, 
    error, 
    totalItems,
    currentPage,
    loadUsers,
    changePage,
    updateFilters 
  } = useUsers();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSearch = () => {
    updateFilters({ searchQuery, role: selectedRole || undefined });
  };

  const totalPages = Math.ceil(totalItems / 10);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Ошибка: {error}
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
          placeholder="Поиск по имени..."
        />
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">Все роли</option>
          <option value={USER_ROLES.ADMIN}>Администратор</option>
          <option value={USER_ROLES.USER}>Пользователь</option>
          <option value={USER_ROLES.MANAGER}>Менеджер</option>
        </select>
        <button onClick={handleSearch}>Поиск</button>
      </div>

      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>

      <div className="pagination">
        <button 
          onClick={() => changePage(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          Назад
        </button>
        <span>Страница {currentPage} из {totalPages}</span>
        <button 
          onClick={() => changePage(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          Вперед
        </button>
      </div>
    </div>
  );
};

export default UserList;
