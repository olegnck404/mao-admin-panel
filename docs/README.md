# MAO Admin Panel - Документація

> [!TIP]
> Для полной документации смотрите [[HANDBOOK|Полное руководство]]

## Быстрые ссылки

- [[api|API Documentation]]
- [[architecture|Архитектура]]
- [[components|Компоненты]]
- [[development-guide|Руководство разработчика]]

## Зміст

1. [Огляд проекту](#огляд-проекту)
2. [Архітектура](#архітектура)
3. [Технічний стек](#технічний-стек)
4. [Початок роботи](#початок-роботи)
5. [Структура проекту](#структура-проекту)
6. [Компоненти та хуки](#компоненти-та-хуки)
7. [API та взаємодія з сервером](#api-та-взаємодія-з-сервером)
8. [Управління станом](#управління-станом)

## Огляд проекту

MAO Admin Panel - це адміністративна панель, розроблена з використанням React та TypeScript. Проект побудований на принципах Clean Architecture та SOLID, що забезпечує високу масштабованість та підтримку коду.

## Архітектура

Проект розділений на чотири основні шари:

### 1. Domain Layer (src/domain)

- Містить бізнес-логіку та основні сутності
- Інтерфейси та контракти
- Value Objects
- Data Transfer Objects (DTO)

### 2. Application Layer (src/application)

- Сервіси для обробки бізнес-логіки
- Координація між різними частинами системи
- Реалізація use cases

### 3. Infrastructure Layer (src/infrastructure)

- Реалізація взаємодії з API
- Репозиторії для роботи з даними
- Фабрики для створення сервісів

### 4. Presentation Layer (src/presentation)

- React компоненти
- Користувацькі хуки
- Управління станом UI

## Технічний стек

- React
- TypeScript
- Vite
- ESLint
- React Router
- Axios (для HTTP запитів)

## Початок роботи

\`\`\`bash

# Клонування репозиторію

git clone https://github.com/your-username/mao-admin-panel.git

# Встановлення залежностей

cd mao-admin-panel
npm install

# Запуск проекту в режимі розробки

npm run dev

# Збірка проекту

npm run build

# Запуск тестів

npm run test
\`\`\`

## Структура проекту

\`\`\`
src/
├── application/ # Сервіси та бізнес-логіка
├── domain/ # Основні сутності та інтерфейси
├── infrastructure/ # Взаємодія з зовнішніми сервісами
├── presentation/ # UI компоненти
├── config/ # Конфігурація
└── theme/ # Стилі та теми
\`\`\`

## Компоненти та хуки

### UserList

Компонент для відображення списку користувачів з підтримкою пагінації та фільтрації.

\`\`\`typescript
import { useUsers } from '../hooks/useUsers';

const UserList: React.FC = () => {
const { users, loading, error } = useUsers();
// ...
};
\`\`\`

### useUsers Hook

Хук для управління даними користувачів:

\`\`\`typescript
export const useUsers = () => {
// Отримання даних користувачів
const loadUsers = async () => {
// ...
};

// Зміна сторінки
const changePage = (page: number) => {
// ...
};

return {
users,
loading,
error,
loadUsers,
changePage
};
};
\`\`\`

## API та взаємодія з сервером

### UserApi

Клас для взаємодії з API:

\`\`\`typescript
export class UserApi {
async fetchUsers(pagination?: PaginationParams, filters?: UserFilters): Promise<PaginatedResponse<IUser>> {
// ...
}
}
\`\`\`

### Обробка помилок

Система використовує спеціальні класи для обробки помилок:

\`\`\`typescript
export class ApplicationError extends Error {
constructor(message: string, public readonly code: string) {
super(message);
this.name = 'ApplicationError';
}
}
\`\`\`

## Управління станом

### Фабрика сервісів

Для управління залежностями використовується паттерн Factory:

\`\`\`typescript
export class ServiceFactory {
private static instance: ServiceFactory;

static getInstance(): ServiceFactory {
if (!ServiceFactory.instance) {
ServiceFactory.instance = new ServiceFactory();
}
return ServiceFactory.instance;
}
}
\`\`\`

### Value Objects

Для забезпечення типобезпеки та валідації даних використовуються Value Objects:

\`\`\`typescript
export class Email {
private readonly value: string;

constructor(email: string) {
if (!this.isValid(email)) {
throw new Error('Invalid email format');
}
this.value = email;
}
}
\`\`\`

## Внесення змін

1. Створіть нову гілку для ваших змін
2. Напишіть тести для нового функціоналу
3. Зробіть commit з описовим повідомленням
4. Відправте pull request

## Корисні команди

\`\`\`bash

# Перевірка типів

npm run type-check

# Запуск лінтера

npm run lint

# Форматування коду

npm run format

# Запуск тестів з покриттям

npm run test:coverage
\`\`\`

## Додаткові матеріали

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

# Использование с GitLab

## Документация

Вся основная документация по проекту находится в папке `docs/`. Здесь вы найдете:

- FULL_DOCUMENTATION.md — полная документация
- HANDBOOK.md — справочник
- development-guide.md — гайд по разработке
- и другие файлы по архитектуре, API, тестированию и ошибкам

## CI/CD с GitLab

Для автоматизации сборки и тестирования проекта на GitLab рекомендуется использовать файл `.gitlab-ci.yml` в корне репозитория. Пример для Node.js:

```yaml
stages:
  - install
  - test
  - build

install:
  stage: install
  script:
    - npm ci

lint:
  stage: test
  script:
    - npm run lint

unit_test:
  stage: test
  script:
    - npm run test

build:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
```

## Советы

- Для подробной информации по архитектуре и API смотрите соответствующие файлы в `docs/`.
- Обновляйте документацию при изменениях в проекте.
