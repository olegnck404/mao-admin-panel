# MAO Admin Panel Посібник

## 📚 Зміст

1. [[#Вступ]]
2. [[#Архітектура]]
3. [[#Розробка]]
4. [[#API]]
5. [[#Компоненти]]
6. [[#Тестування]]

## Вступ

> [!NOTE]
> MAO Admin Panel - це адміністративна панель, побудована на принципах Clean Architecture та SOLID.

### Технічний стек

- ⚛️ React + TypeScript
- 📦 Vite
- 🔍 ESLint
- 🎨 CSS Modules

### Швидкий старт

```bash
# Клонування репозиторію
git clone https://github.com/your-username/mao-admin-panel.git

# Встановлення залежностей
cd mao-admin-panel
npm install

# Запуск у режимі розробки
npm run dev
```

## Архітектура

### Структура проекту

```
src/
├── domain/          # Бізнес-логіка та інтерфейси
├── application/     # Сервіси
├── infrastructure/  # Зовнішні сервіси
├── presentation/    # UI компоненти
└── config/         # Конфігурація
```

### Clean Architecture

> [!IMPORTANT]
> Проект дотримується принципів Clean Architecture:

1. **Domain Layer**

   - Інтерфейси (`IUser`, `IUserRepository`)
   - Value Objects (`Email`, `UserRole`)
   - DTO (`UserDTO`, `QueryParams`)

2. **Application Layer**

   - Сервіси (`UserService`)
   - Use Cases

3. **Infrastructure Layer**

   - Репозиторії (`UserRepository`)
   - API клієнти (`UserApi`)
   - Фабрики (`ServiceFactory`)

4. **Presentation Layer**
   - React компоненти
   - Хуки (`useUsers`)
   - Сторінки

### Принципи SOLID

#### Single Responsibility

```typescript
// Кожен клас має одну відповідальність
class UserService {
  async getUsers(): Promise<User[]> {
    // Тільки логіка отримання користувачів
  }
}
```

#### Open/Closed

```typescript
// Розширюваність без модифікації
interface IUserFilter {
  apply(users: User[]): User[];
}

class RoleFilter implements IUserFilter {
  apply(users: User[]): User[] {
    // Фільтрація за роллю
  }
}
```

## Розробка

### Компоненти

#### UserList

```typescript
const UserList: React.FC = () => {
  const { users, loading, error } = useUsers();

  if (loading) return <div>Завантаження...</div>;
  if (error) return <div>Помилка: {error}</div>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};
```

### Хуки

#### useUsers

```typescript
export const useUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);

  // Логіка завантаження користувачів

  return { users, loading };
};
```

## API

### Ендпоінти

#### Users API

- `GET /api/users` - отримання списку користувачів
- `GET /api/users/:id` - отримання користувача за ID
- `POST /api/users` - створення користувача
- `PUT /api/users/:id` - оновлення користувача
- `DELETE /api/users/:id` - видалення користувача

### Моделі даних

#### User

```typescript
interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
}
```

#### PaginatedResponse

```typescript
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}
```

## Тестування

### Unit Tests

```typescript
describe("UserService", () => {
  it("має отримувати користувачів", async () => {
    const service = new UserService(mockRepo);
    const users = await service.getUsers();
    expect(users).toBeDefined();
  });
});
```

### Integration Tests

```typescript
describe("UserRepository", () => {
  it("має отримувати користувачів", async () => {
    const repo = new UserRepository(mockApi);
    const users = await repo.getAll();
    expect(users.length).toBeGreaterThan(0);
  });
});
```

### E2E Tests

```typescript
describe("UserList", () => {
  it("має відображати користувачів", async () => {
    render(<UserList />);
    await screen.findByText("Список користувачів");
    expect(screen.getByRole("list")).toBeInTheDocument();
  });
});
```

## Найкращі практики

### Код

- ✅ Використовуйте TypeScript
- ✅ Дотримуйтесь принципів SOLID
- ✅ Пишіть тести
- ✅ Документуйте код
- ❌ Не змішуйте шари архітектури
- ❌ Не ускладнюйте без необхідності

### Git

```bash
# Створення нової гілки
git checkout -b feature/user-management

# Коміт
git commit -m "feat: додано управління користувачами"

# Відправка змін
git push origin feature/user-management
```

### Команди

| Команда         | Опис                     |
| --------------- | ------------------------ |
| `npm run dev`   | Запуск у режимі розробки |
| `npm run build` | Збірка проекту           |
| `npm run test`  | Запуск тестів            |
| `npm run lint`  | Перевірка коду           |

## Корисні посилання

- 📘 [React Documentation](https://reactjs.org)
- 📘 [TypeScript Documentation](https://www.typescriptlang.org)
- 📘 [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- 📘 [SOLID Principles](https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)

## Додатки

### A. Глосарій

- **Clean Architecture**: Архітектурний підхід, що забезпечує розділення відповідальності
- **SOLID**: Принципи об'єктно-орієнтованого програмування
- **DTO**: Data Transfer Object - об'єкти для передачі даних
- **Repository**: Патерн для абстракції роботи з даними

### B. Поширені запитання

#### Q: Як додати нову функціональність?

A: Дотримуйтесь принципів Clean Architecture:

1. Визначте вимоги
2. Додайте інтерфейси в domain layer
3. Реалізуйте бізнес-логіку
4. Створіть UI компоненти

#### Q: Як працювати з даними?

A: Використовуйте репозиторії та сервіси:

1. Визначте модель в domain layer
2. Створіть репозиторій
3. Реалізуйте сервіс
4. Використовуйте хуки в компонентах
