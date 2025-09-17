# Fullstack Table with Import

Полнофункциональное приложение для управления продуктами с возможностью импорта данных из Google Sheets или CSV файлов.

## Структура проекта

```
├── backend/          # Next.js API сервер
├── frontend/         # Nuxt 3 клиент
├── shared/           # Общие типы и константы
└── package.json      # Корневой package.json с workspace
```

## Технологии

### Backend

- **Next.js 14** - React фреймворк
- **TypeScript** - типизация
- **PostgreSQL** - база данных
- **Google Sheets API** - интеграция с Google Sheets

### Frontend

- **Nuxt 3** - Vue.js фреймворк
- **TypeScript** - типизация
- **Vue 3 Composition API** - современный подход
- **CSS** - обычные CSS классы

## Возможности

### Основной функционал

- ✅ **Импорт данных** из Google Sheets или CSV файлов
- ✅ **Список продуктов** с таблицей и пагинацией
- ✅ **Детали продукта** с полной информацией
- ✅ **Навигация** между страницами

### Дополнительные возможности

- ✅ **Валидация данных** при импорте
- ✅ **Редактирование и удаление** продуктов
- ✅ **Фильтрация и поиск** по названию, бренду, категории и цене
- ✅ **Responsive design** для мобильных устройств

## Установка и запуск

### 1. Установка зависимостей

```bash
npm run install:all
```

### 2. Настройка базы данных

Создайте PostgreSQL базу данных и настройте переменные окружения в `backend/env.local`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
GOOGLE_SHEETS_API_KEY="your_api_key"
```

### 3. Запуск в режиме разработки

```bash
npm run dev
```

Это запустит:

- Backend на http://localhost:3000
- Frontend на http://localhost:3001

### 4. Отдельный запуск сервисов

```bash
# Только backend
npm run dev:backend

# Только frontend
npm run dev:frontend
```

## API Endpoints

### Продукты

- `GET /api/products` - получить список продуктов
- `GET /api/products/:id` - получить продукт по ID
- `PUT /api/products/:id` - обновить продукт
- `DELETE /api/products/:id` - удалить продукт

### Импорт

- `POST /api/import` - импорт данных из Google Sheets или CSV

## Использование

### Импорт данных

1. Откройте http://localhost:3001
2. Введите ссылку на Google Sheets или загрузите CSV файл
3. Нажмите "Импортировать"
4. Проверьте результат импорта

**Пример ссылки на Google Sheets:**

```
https://docs.google.com/spreadsheets/d/1JSxXiuWX9dJEeUKGYUY4EsQ5wJln7acNr7UEpA20Ys0/edit?usp=sharing
```

### Управление продуктами

1. Перейдите на страницу "Продукты"
2. Используйте фильтры для поиска нужных продуктов
3. Нажмите "Просмотр" для просмотра деталей
4. Используйте "Редактировать" или "Удалить" для управления

### Фильтрация

- **Поиск** - по названию или бренду
- **Бренд** - фильтр по конкретному бренду
- **Категория** - фильтр по категории
- **Цена** - диапазон цен от/до

## Структура данных

### Product

```typescript
interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  description?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### ImportResult

```typescript
interface ImportResult {
  success: boolean;
  message: string;
  importedCount: number;
  errors?: string[];
}
```

## Особенности реализации

### Backend

- **RESTful API** с Next.js App Router
- **TypeScript** для типизации
- **PostgreSQL** с Prisma ORM
- **Google Sheets API** интеграция
- **CSV парсинг** с Papa Parse
- **Валидация данных** с Zod

### Frontend

- **SPA режим** для лучшего UX
- **Composition API** Vue 3
- **Reactive фильтры** с debounced search
- **Модальные окна** для редактирования
- **Responsive дизайн**
- **Error handling** и loading states

## Разработка

### Структура файлов

#### Backend

```
backend/
├── src/
│   ├── app/api/          # API routes
│   ├── services/         # Бизнес логика
│   └── types/            # TypeScript типы
├── prisma/               # Схема базы данных
└── package.json
```

#### Frontend

```
frontend/
├── pages/                # Страницы приложения
├── assets/css/           # Стили
├── types/                # TypeScript типы
└── package.json
```

### Команды разработки

```bash
# Установка всех зависимостей
npm run install:all

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшен версии
npm run start
```

## Лицензия

MIT
