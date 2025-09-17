### 1. Предварительные требования

- Node.js 18+
- PostgreSQL
- npm или yarn

### 2. Установка

```bash
# Клонировать репозиторий
git clone [repository-url]
cd fullstack_table_with_import_

# Установить все зависимости
cd backend && npm install
cd frontend && npm install

```

### 3. Настройка базы данных

```bash

# Запустить PostgreSQL и выполнить SQL скрипт
Запустить postgresSQL
psql postgres

дальше
CREATE ROLE postgres WITH LOGIN SUPERUSER CREATEDB CREATEROLE PASSWORD 'postgres';

дальше проверить, что сделал юзера \du
Выход из постргеса - \q

и потом

psql -U postgres -f database/init.sql

```

### 4. Настройка переменных окружения

```bash
# Скопировать пример и заполнить своими данными
cp backend/.env.example backend/.env.local

# Отредактировать backend/.env.local с вашими данными PostgreSQL
```

### 5. Запуск

```bash
# Запуск backend (порт 3005)
npm run dev:backend

# В новом терминале - запуск frontend (порт 3002)
npm run dev:frontend
```

### 6. Проверка

- Backend: http://localhost:3005
- Frontend: http://localhost:3002

### Порты

- Backend: 3005
- Frontend: 3002

### API Endpoints

- GET /api/products - Список продуктов
- POST /api/import - Импорт из Google Sheets
- CRUD операции для продуктов
  Также сверстал страницу на нексте со всеми эндпойнтами
