---
aliases: [Компоненти, Components]
tags: [components, react, ui]
created: 2025-05-12
---

# Компоненти

## Користувацькі компоненти

### UserList

> [!NOTE]
> Компонент для відображення списку користувачів

#### Використання

\`\`\`typescript
import { UserList } from '../components/UserList';

const Page = () => (
<UserList />
);
\`\`\`

#### Props

Не приймає пропси, використовує внутрішній стан

#### Хуки

- [[useUsers]] - управління даними користувачів

## Користувацькі хуки

### useUsers

> [!NOTE]
> Хук для роботи з даними користувачів

#### API

\`\`\`typescript
const {
users, // Список користувачів
loading, // Стан завантаження
error, // Помилка, якщо є
totalItems, // Загальна кількість
currentPage, // Поточна сторінка
loadUsers, // Функція завантаження
changePage, // Зміна сторінки
updateFilters // Оновлення фільтрів
} = useUsers();
\`\`\`

## Пов'язані матеріали

- [[architecture#Presentation Layer|Presentation Layer]]
- [[api#Users API|Users API]]
