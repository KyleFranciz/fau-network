# Agent Guidelines

Guidelines for AI agents in this repository.

## Build/Lint/Test Commands

**Frontend:**

- Build: `npm run build` (in `frontend/`)
- Lint: `npm run lint` (in `frontend/`)
- Preview: `npm run preview` (in `frontend/`)

**Backend:**

- Build: `tsc` (in `backend/`)
- Start: `npm run start` (in `backend/`)
- Dev: `npm run dev` (in `backend/`)

## Code Style Guidelines

- **Language:** TypeScript
- **Formatting:** Follow Prettier/ESLint.
- **Imports:** Use absolute imports.
- **Naming:** camelCase for variables/functions, PascalCase for components.
- **Error Handling:** Use `try...catch`.

## Data Fetching

- Use `useQueries` from `react-query` in the frontend.
- Add axios fetching functions to `@frontend/src/services/eventFetchers.ts` for api requests for events.
