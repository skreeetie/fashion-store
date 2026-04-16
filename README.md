Деплой: https://dev-fashion-store.vercel.app

# Fashion Store

Интернет-магазин на Next.js с каталогом товаров, фильтрами/сортировкой, роутами под разные витрины (`/`, `/men`, `/women`, `/new`), корзиной и серверным API.

## Стек

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- Redux Toolkit + RTK Query
- Prisma + PostgreSQL
- Zod (валидация контрактов и query-параметров)

## Команды

Все команды из `package.json`:

- `pnpm dev` - запуск локальной разработки
- `pnpm build` - генерация Prisma Client + production build Next.js
- `pnpm start` - запуск production-сборки
- `pnpm lint` - запуск ESLint
- `pnpm db:generate` - `prisma generate`
- `pnpm db:push` - `prisma db push`
- `pnpm db:migrate` - `prisma migrate dev`
- `pnpm db:deploy` - `prisma migrate deploy`
- `pnpm db:seed` - заполнение БД тестовыми товарами
- `pnpm db:studio` - запуск Prisma Studio

## Быстрый старт

1. Установить зависимости:
```bash
pnpm install
```
2. Подготовить `.env` (`DATABASE_URL`, `DIRECT_URL`, при необходимости `PEXELS_API_KEY`, `NEXT_PUBLIC_API_ORIGIN`).
3. Применить миграции и сиды (опционально):
```bash
pnpm db:migrate
pnpm db:seed
```
4. Запустить проект:
```bash
pnpm dev
```

## Основные фичи

- Каталог товаров с пагинацией
- Фильтрация по категориям и сортировка по цене/названию
- Отдельные витрины:
  - `/men` (мужская подборка)
  - `/women` (женская подборка)
  - `/new` (новинки с визуальным бейджем в карточке)
- Корзина на Redux с синхронизацией в `sessionStorage`
- Переключение светлой/тёмной темы (с сохранением в `localStorage`)
- Кастомная страница `404`
- Общие `Header` и `Footer` в layout

## API

Основные эндпоинты:

- `GET /api/products`
- `GET /api/products/men`
- `GET /api/products/women`
- `GET /api/products/new`

Поддерживаемые query-параметры:

- `page`
- `perPage`
- `category` (`all | clothes | shoes | accessories`)
- `sortBy` (`none | price | name`)
- `sortOrder` (`asc | desc`)

## Навигация (frontend)

- `/` - главная витрина
- `/new` - новинки
- `/women` - женская витрина
- `/men` - мужская витрина
- `/about` - страница о проекте
- `/contact` - контакты
