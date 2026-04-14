# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

The primary user-facing artifact is **Coffee Shop**, a React/Vite website for Ember & Bean. It provides a warm, modern coffee shop shopping experience with a homepage, coffee menu, product details, cart management, multi-step checkout, multiple demo payment options, and local demo order history.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS
- **Routing**: wouter
- **UI components**: shadcn-style component set, Radix UI primitives, lucide-react icons
- **State persistence**: browser localStorage for cart and demo order history
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/coffee-shop run dev` — run the Coffee Shop website locally

## Artifacts

- `artifacts/coffee-shop` — Ember & Bean coffee shop website served at `/`
- `artifacts/api-server` — shared API server served at `/api`
- `artifacts/mockup-sandbox` — design/mockup canvas sandbox served at `/__mockup`

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
