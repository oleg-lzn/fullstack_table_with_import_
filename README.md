# Fullstack Table Import Application

Простое приложение для импорта данных из Google Sheets и управления продуктами.

## Структура проекта

```
fullstack_table_with_import/
├── backend/          # NextJS API
├── frontend/         # Nuxt 3 приложение
├── shared/           # Общие типы и утилиты
└── README.md
```

## Технологии

### Backend

- NextJS 14 с App Router
- TypeORM
- PostgreSQL
- Парсинг Google Sheets

### Frontend

- Nuxt 3
- TypeScript
- NuxtUI

## Функционал

- Импорт данных из Google Sheets
- CRUD операции для продуктов
- Поиск и фильтрация
- Валидация данных

## Запуск

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Google Sheets

Ссылка на таблицу для импорта:
https://docs.google.com/spreadsheets/d/1JSxXiuWX9dJEeUKGYUY4EsQ5wJln7acNr7UEpA20Ys0/edit?usp=sharing
