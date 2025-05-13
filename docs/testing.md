---
aliases: [Testing, Тестування]
tags: [testing, jest, react-testing-library]
created: 2025-05-12
---

# Тестування

## Види тестів

### Unit Tests

> [!NOTE]
> Тестування окремих компонентів та функцій

#### Приклад тесту сервісу

```typescript
describe("UserService", () => {
  let service: UserService;
  let repository: MockUserRepository;

  beforeEach(() => {
    repository = new MockUserRepository();
    service = new UserService(repository);
  });

  it("should get users with pagination", async () => {
    const result = await service.getUsers({ page: 1, limit: 10 });
    expect(result.items).toBeDefined();
  });
});
```

### Integration Tests

> [!NOTE]
> Тестування взаємодії між компонентами

#### Приклад тесту репозиторію

```typescript
describe("UserRepository", () => {
  let repository: UserRepository;
  let api: MockUserApi;

  beforeEach(() => {
    api = new MockUserApi();
    repository = new UserRepository(api);
  });

  it("should fetch users from api", async () => {
    const users = await repository.getAll();
    expect(users).toBeDefined();
  });
});
```

### E2E Tests

> [!NOTE]
> Тестування повного функціоналу

#### Приклад E2E тесту

```typescript
describe("UserList", () => {
  it("should display users and pagination", async () => {
    render(<UserList />);

    // Чекаємо завантаження
    await screen.findByText("User List");

    // Перевіряємо відображення
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
```

## Інструменти

### Jest

- Unit тести
- Інтеграційні тести
- Моки та стаби

### React Testing Library

- Тестування компонентів
- User-centric підхід
- Доступність

### Cypress

- E2E тестування
- Візуальне тестування
- API тестування

## Best Practices

### Загальні принципи

- ✅ Тести незалежні
- ✅ Один тест - одна перевірка
- ✅ Читабельні назви тестів
- ❌ Не тестуйте імплементацію

### Моки

```typescript
const mockUserRepository = {
  getAll: jest.fn(),
  getById: jest.fn(),
};
```

### Фікстури

```typescript
const userFixture = {
  id: "1",
  name: "Test User",
  email: "test@example.com",
  role: "user",
};
```

## Команди

| Команда                 | Опис                  |
| ----------------------- | --------------------- |
| `npm test`              | Запуск всіх тестів    |
| `npm run test:watch`    | Запуск в watch режимі |
| `npm run test:coverage` | Звіт по покриттю      |

## Пов'язані матеріали

- [[development-guide#Тестування|Керівництво по тестуванню]]
- [[architecture#Testing|Архітектура тестів]]
