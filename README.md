# Todo App — Frontend

A task management application with categories, built with React + TypeScript + Vite.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 6** — bundler and dev server
- **Tailwind CSS 4** — utility-first styling
- **Zustand** — global state management (tasks and categories)
- **Axios** — API communication with Django backend
- **Framer Motion** — animations
- **Yup** — form validation
- **Emoji Mart** — emoji picker for categories
- **oxlint** — fast Rust-based linter
- **Sentry** — error monitoring (production only)

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/)

## Installation

```bash
pnpm install
```

## Configuration

Create a `.env` file at the project root:

```bash
cp .env.example .env
```

```env
# Django API URL (local development)
VITE_API_URL=http://localhost:8000/api

# Sentry DSN — disabled in development, active in production
VITE_SENTRY_DSN=
```

> In production (Vercel, Netlify), set both `VITE_API_URL` and `VITE_SENTRY_DSN` in the platform's environment variables. Sentry is automatically disabled in development (`enabled: PROD`).
>
> **Important:** `VITE_API_URL` must include the `/api` path prefix, matching the backend route structure. Example for production:
> ```
> VITE_API_URL=https://todo-back-z27h.onrender.com/api
> ```
> Setting it to `https://todo-back-z27h.onrender.com` (without `/api`) will result in 404 errors on all API calls.

## Scripts

```bash
# Development
pnpm dev

# Development accessible on local network
pnpm dev:host

# Lint
pnpm lint

# Production build
pnpm build

# Preview the build
pnpm preview

# Unit tests (run once)
pnpm test

# Unit tests (watch mode)
pnpm test:watch

# Unit tests with coverage
pnpm test:coverage

# E2E tests (headless)
pnpm e2e

# E2E tests with Playwright UI
pnpm e2e:ui

# E2E tests in headed mode
pnpm e2e:headed
```

## Project Structure

```
src/
├── components/
│   ├── App.tsx               # Root component — initial data fetching
│   ├── Main.tsx              # Main UI logic and orchestration
│   ├── layout/
│   │   ├── Header.tsx        # App header
│   │   └── Footer.tsx        # App footer
│   └── elements/
│       ├── TasksList.tsx         # Task list display
│       ├── CategoriesList.tsx    # Category list and selection
│       ├── CategoryFilter.tsx    # Dropdown filter by category
│       ├── EmojiPicker.tsx       # Emoji picker for categories
│       └── ConfirmDeleteModal.tsx # Delete confirmation dialog
├── services/
│   └── api.ts            # Axios API client (tasks + categories)
├── store/
│   ├── useTaskStore.tsx      # Zustand store for tasks
│   └── useCategoryStore.tsx  # Zustand store for categories
├── types/
│   └── index.ts          # TypeScript interfaces (Task, Category)
├── utils/
│   ├── task.ts           # Task text parsing (hashtag support)
│   ├── category.ts       # Category helpers
│   ├── keyboard.ts       # Keyboard event utilities
│   └── taskHelpers.ts    # Task count helpers
└── validation/
    └── taskSchema.ts     # Yup schema for task input
```

Path alias `@` is configured to point to `src/` (e.g. `import { ... } from "@/store/useTaskStore"`).

## Key Features

- Create, update, and delete tasks and categories
- Filter tasks by category
- Emoji icons for categories
- Delete confirmation modal when a category has associated tasks
- Optimistic UI updates with error rollback
- Enter key to submit forms
- Responsive layout (mobile and desktop)

## API Layer

`src/services/api.ts` exposes two namespaced clients:

- `tasksApi` — `getAll`, `getById`, `create`, `update`, `delete`
- `categoriesApi` — `getAll`, `create`, `update`, `delete`

API responses use snake_case (`is_completed`, `category`) and are mapped to camelCase on the frontend (`completed`, `categoryId`).

## Tests

The project has two levels of testing:

**Unit / integration tests** — [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)

Located in `src/tests/`:
- `AddTaskForm.test.tsx`
- `CategoriesList.test.tsx`
- `CategoryFilter.test.tsx`
- `ConfirmDeleteModal.test.tsx`
- `TasksList.test.tsx`
- `TasksListWithAPI.test.tsx`

Run in jsdom with `@testing-library/jest-dom` matchers (`src/tests/setup.ts`).

**End-to-end tests** — [Playwright](https://playwright.dev/) (Chromium)

Located in `e2e/`:
- `task-creation-and-filter.spec.ts`

Runs against `http://localhost:5173` (single worker to avoid DB conflicts, 1 retry for network flakiness).

## Backend

This frontend communicates with a Django REST API. See the backend repository for CORS configuration and required environment variables (`ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`).
