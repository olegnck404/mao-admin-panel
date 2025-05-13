# Технічна документація по API

## Endpoints

### Users

#### GET /api/users

Отримання списку користувачів з підтримкою пагінації та фільтрації.

**Параметри запиту:**

| Параметр | Тип    | Опис                            |
| -------- | ------ | ------------------------------- |
| page     | number | Номер сторінки                  |
| limit    | number | Кількість елементів на сторінці |
| role     | string | Фільтр за роллю користувача     |
| q        | string | Пошуковий запит                 |

**Приклад відповіді:**

\`\`\`json
{
"items": [
{
"id": "1",
"name": "John Doe",
"email": "john@example.com",
"role": "admin"
}
],
"total": 100,
"page": 1,
"totalPages": 10,
"hasNext": true,
"hasPrevious": false
}
\`\`\`

## Моделі даних

### User

\`\`\`typescript
interface IUser {
id: string;
name: string;
email: string;
role: string;
}
\`\`\`

### PaginatedResponse

\`\`\`typescript
interface PaginatedResponse<T> {
items: T[];
total: number;
page: number;
totalPages: number;
hasNext: boolean;
hasPrevious: boolean;
}
\`\`\`

## Коди помилок

| Код              | Опис                    |
| ---------------- | ----------------------- |
| NETWORK_ERROR    | Помилка мережі          |
| NOT_FOUND        | Ресурс не знайдено      |
| UNAUTHORIZED     | Необхідна авторизація   |
| FORBIDDEN        | Доступ заборонено       |
| VALIDATION_ERROR | Помилка валідації даних |
