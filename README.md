# MAO Admin Panel

Административная панель для управления системой MAO. Проект построен на принципах Clean Architecture с использованием React и TypeScript.

## Быстрый старт

```bash
# Клонирование репозитория

git clone https://github.com/your-username/mao-admin-panel.git
cd mao-admin-panel
npm install
npm run dev
```

## Структура проекта

- `src/` — исходный код (domain, application, infrastructure, presentation)
- `docs/` — подробная документация (архитектура, API, гайды)
- `public/` — статические файлы

## Документация

- [Полная документация](docs/FULL_DOCUMENTATION.md)
- [Руководство разработчика](docs/development-guide.md)
- [Архитектура](docs/ARCHITECTURE.md)
- [API](docs/API.md)
- [Ошибки](docs/errors.md)

## CI/CD с GitHub Actions

Для автоматизации сборки и тестирования используйте GitHub Actions. Пример workflow:

```yaml
name: Node.js CI

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18.x"
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

## Внесение изменений

1. Создайте новую ветку для изменений
2. Покройте новый функционал тестами
3. Сделайте осмысленный commit
4. Откройте Pull Request

## Лицензия

MIT
