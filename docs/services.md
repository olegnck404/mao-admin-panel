---
aliases: [Services, Сервіси]
tags: [services, application-layer]
created: 2025-05-12
---

# Сервіси

## Application Services

### UserService

> [!NOTE]
> Сервіс для роботи з користувачами

```typescript
export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getUsers(
    pagination?: PaginationParams,
    filters?: UserFilters
  ): Promise<PaginatedResponse<IUser>> {
    return this.userRepository.getAll(pagination, filters);
  }
}
```

#### Методи

| Метод         | Опис                        | Параметри           |
| ------------- | --------------------------- | ------------------- |
| `getUsers`    | Отримання користувачів      | pagination, filters |
| `getUserById` | Отримання користувача за ID | id                  |

#### Залежності

- [[IUserRepository]] - репозиторій користувачів
- [[PaginationParams]] - параметри пагінації
- [[UserFilters]] - параметри фільтрації

## Infrastructure Services

### UserApi

> [!NOTE]
> Сервіс для роботи з API користувачів

```typescript
export class UserApi {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }
}
```

### ServiceFactory

> [!NOTE]
> Фабрика для створення сервісів

```typescript
export class ServiceFactory {
  private static instance: ServiceFactory;

  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }
}
```

## Пов'язані матеріали

- [[architecture#Application Layer|Application Layer]]
- [[api|API Documentation]]
- [[repositories|Repositories]]
