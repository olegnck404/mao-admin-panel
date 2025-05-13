---
aliases: [Repositories, Репозиторії]
tags: [repositories, infrastructure-layer]
created: 2025-05-12
---

# Репозиторії

## Інтерфейси

### IUserRepository

> [!NOTE]
> Базовий інтерфейс для роботи з користувачами

```typescript
export interface IUserRepository {
  getAll(
    pagination?: PaginationParams,
    filters?: UserFilters
  ): Promise<PaginatedResponse<IUser>>;

  getById(id: string): Promise<IUser | null>;
  create(user: IUser): Promise<IUser>;
  update(id: string, user: IUser): Promise<IUser>;
  delete(id: string): Promise<void>;
}
```

## Реалізації

### UserRepository

> [!NOTE]
> Реалізація репозиторію користувачів

```typescript
export class UserRepository implements IUserRepository {
  constructor(private api: UserApi) {}

  async getAll(
    pagination?: PaginationParams,
    filters?: UserFilters
  ): Promise<PaginatedResponse<IUser>> {
    return this.api.fetchUsers(pagination, filters);
  }
}
```

## Паттерни

### Repository Pattern

> [!INFO]
> Репозиторій абстрагує доступ до даних та інкапсулює логіку роботи з джерелом даних

#### Переваги

- ✅ Абстракція джерела даних
- ✅ Централізована логіка доступу
- ✅ Спрощене тестування
- ✅ Перевикористання коду

#### Приклад використання

```typescript
const repository = new UserRepository(api);
const users = await repository.getAll();
```

## Тестування

### Mock Repository

```typescript
class MockUserRepository implements IUserRepository {
  private users: IUser[] = [];

  async getAll(): Promise<PaginatedResponse<IUser>> {
    return {
      items: this.users,
      total: this.users.length,
      page: 1,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    };
  }
}
```

## Пов'язані матеріали

- [[architecture#Infrastructure Layer|Infrastructure Layer]]
- [[api|API Integration]]
- [[testing#Integration Tests|Repository Testing]]
