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
```

## Project Structure

```
src/
├── components/       # React components (App, Main, UI elements, layout)
├── services/         # Axios API calls (api.ts)
├── store/            # Zustand stores (tasks, categories)
├── types/            # TypeScript types
├── utils/            # Utility functions
└── validation/       # Yup validation schemas
```

## Backend

This frontend communicates with a Django REST API. See the backend repository for CORS configuration and required environment variables (`ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`).
