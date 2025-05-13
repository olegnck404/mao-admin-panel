---
aliases: [Models, Моделі]
tags: [models, domain, interfaces]
created: 2025-05-12
---

# Моделі та інтерфейси

## Доменні моделі

### User Interface

> [!NOTE]
> Базовий інтерфейс користувача

```typescript
interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
}
```

## Data Transfer Objects

### UserDTO

> [!NOTE]
> DTO для передачі даних користувача між шарами

```typescript
export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: string;
}
```

### QueryParams

> [!NOTE]
> Параметри для запитів з пагінацією та фільтрацією

```typescript
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FilterParams {
  role?: string;
  searchQuery?: string;
}
```

## Value Objects

### Email

> [!NOTE]
> Value Object для валідації email

```typescript
export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error("Invalid email format");
    }
    this.value = email;
  }
}
```

### UserRole

> [!NOTE]
> Value Object для ролей користувача

```typescript
export class UserRole {
  private static readonly ALLOWED_ROLES = ["admin", "user", "manager"] as const;
}
```

## Пов'язані матеріали

- [[architecture#Domain Layer|Domain Layer]]
- [[api#Моделі даних|API Models]]
