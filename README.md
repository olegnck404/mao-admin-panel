# MAO Admin Panel

[![CI/CD](https://github.com/olegnck404/mao-admin-panel/actions/workflows/ci.yml/badge.svg)](https://github.com/olegnck404/mao-admin-panel/actions/workflows/ci.yml)
[![Documentation](https://github.com/olegnck404/mao-admin-panel/actions/workflows/documentation.yml/badge.svg)](https://github.com/olegnck404/mao-admin-panel/actions/workflows/documentation.yml)

Адміністративна панель для керування системою MAO. Проєкт побудований на принципах Clean Architecture з використанням React і TypeScript.

[📚 Документация](https://olegnck404.github.io/mao-admin-panel/)

## Швидкий старт

```bash
# Клонування репозиторію

git clone https://github.com/your-username/mao-admin-panel.git
cd mao-admin-panel
npm install
npm run dev
```

## Структура проєкту

- `src/` — вихідний код (domain, application, infrastructure, presentation)
- `docs/` — детальна документація (архітектура, API, гайди)
- `public/` — статичні файли

## Документація

- [Повна документація](docs/FULL_DOCUMENTATION.md)
- [Гайд для розробника](docs/development-guide.md)
- [Архітектура](docs/ARCHITECTURE.md)
- [API](docs/API.md)
- [Помилки](docs/errors.md)

## CI/CD з GitHub Actions

Для автоматизації збірки та тестування використовуйте GitHub Actions. Приклад workflow:

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

## Внесення змін

1. Створіть нову гілку для змін
2. Покрийте новий функціонал тестами
3. Зробіть осмислений commit
4. Відкрийте Pull Request

## Ліцензія

MIT
