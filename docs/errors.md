---
aliases: [Помилки, Errors]
tags: [errors, exceptions]
created: 2025-05-12
---

# Обробка помилок

## Базові класи

### ApplicationError

> [!NOTE]
> Базовий клас для всіх помилок в додатку

```typescript
export class ApplicationError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = "ApplicationError";
  }
}
```

### NotFoundError

> [!NOTE]
> Помилка при відсутності ресурсу

```typescript
export class NotFoundError extends ApplicationError {
  constructor(resource: string) {
    super(`${resource} not found`, "NOT_FOUND");
  }
}
```

## Обробка помилок

### В сервісах

```typescript
try {
  const users = await repository.getAll();
} catch (error) {
  throw new ApplicationError("Failed to fetch users", "FETCH_ERROR");
}
```

### В компонентах

```typescript
const { error } = useUsers();

if (error) {
  return <ErrorDisplay message={error} />;
}
```

## Коди помилок

| Код              | Рівень      | Опис               |
| ---------------- | ----------- | ------------------ |
| NETWORK_ERROR    | 🔴 Critical | Помилка мережі     |
| NOT_FOUND        | 🟡 Warning  | Ресурс не знайдено |
| VALIDATION_ERROR | 🟡 Warning  | Помилка валідації  |

## Пов'язані матеріали

- [[api#Коди помилок|API Error Codes]]
- [[development-guide#Обробка помилок|Error Handling Guide]]
