---
aliases: [Керівництво розробника, Development Guide]
tags: [development, guide, setup]
created: 2025-05-12
---

# Керівництво розробника

## Початок роботи

### Встановлення

```bash
# Клонування репозиторію
git clone https://github.com/your-username/mao-admin-panel.git

# Встановлення залежностей
cd mao-admin-panel
npm install
```

### Команди

| Команда         | Опис                     |
| --------------- | ------------------------ |
| `npm run dev`   | Запуск в режимі розробки |
| `npm run build` | Збірка проекту           |
| `npm run test`  | Запуск тестів            |
| `npm run lint`  | Перевірка коду           |

## Структура проекту

```
src/
├── application/    # Сервіси та бізнес-логіка
├── domain/        # Основні сутності
├── infrastructure/# Зовнішні сервіси
├── presentation/  # UI компоненти
├── config/       # Конфігурація
└── theme/        # Стилі та теми
```

## Робота з кодом

### Додавання нової функціональності

1. Визначення вимог
2. Створення інтерфейсів
3. Реалізація бізнес-логіки
4. Додавання UI компонентів

> [!TIP]
> Завжди починайте з domain layer!

### Обробка помилок

```typescript
try {
  await userService.getUsers();
} catch (err) {
  if (err instanceof ApplicationError) {
    // Обробка відомої помилки
  } else {
    // Обробка невідомої помилки
  }
}
```

## Тестування

### Unit тести

```typescript
describe("UserService", () => {
  it("should get users", async () => {
    // Arrange
    const service = new UserService(mockRepo);

    // Act
    const result = await service.getUsers();

    // Assert
    expect(result).toBeDefined();
  });
});
```

### E2E тести

```typescript
describe("UserList", () => {
  it("should display users", async () => {
    render(<UserList />);
    await screen.findByText("User List");
    expect(screen.getByRole("list")).toBeInTheDocument();
  });
});
```

## Best Practices

### Clean Architecture

- ✅ Залежності направлені всередину
- ✅ Доменна логіка незалежна
- ❌ Не змішуйте шари архітектури

### SOLID

- ✅ Один клас - одна відповідальність
- ✅ Використовуйте інтерфейси
- ❌ Не порушуйте інкапсуляцію

### React

- ✅ Компоненти малі та перевикористовувані
- ✅ Логіка винесена в хуки
- ❌ Не дублюйте стан

## Пов'язані матеріали

- [[architecture|Архітектура]]
- [[api|API Документація]]
- [[components|Компоненти]]
