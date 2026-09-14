# AI Fashion — Repository Guide

## Purpose

AI Fashion is a premium commerce platform for clothing stores. Its core customer experience is a helpful AI sales assistant that helps customers discover, understand, and virtually try clothing before purchase.

## Architecture

- Keep the Next.js customer application in `src/app` and product features in `src/features`.
- Keep reusable primitives in `src/components/ui`, shared utilities in `src/lib`, and domain contracts in `src/types`.
- Design integrations behind provider-neutral interfaces: future AI, payments, search, storage, and store data must not leak vendor-specific types into UI components.
- The initial implementation is single-store; model every future store-scoped resource with an optional path to a `storeId` boundary.
- Future bounded contexts include customer app, store/admin dashboard, API/backend, AI services, catalog, orders, reservations, authentication, and shared UI/types. Do not build infrastructure until a feature needs it.

## Coding standards

- Use strict TypeScript; do not use `any` or suppress type errors.
- Prefer server components by default and add `"use client"` only for interactive boundaries.
- Use named exports for shared components and absolute `@/` imports.
- Use `cn()` for conditional class names. Keep components focused and compose UI primitives.
- Format with Prettier and validate with ESLint before committing. Never wrap imports in `try/catch`.

## Naming

- React components: PascalCase filenames and exports.
- Hooks: `useX`. Types/interfaces: PascalCase. Functions and variables: camelCase.
- Use kebab-case for route folders and descriptive, domain-oriented names.

## UI rules

- The visual direction is quiet, premium, accessible, and mobile-first.
- Prefer a restrained neutral palette, clear typography, generous whitespace, and purposeful motion only.
- Use semantic HTML, visible keyboard focus, labels for controls, and `aria-live` for dynamic feedback.
- Build empty, loading, and error states whenever data can be absent, pending, or fail.

## AI rules

- The assistant must be kind, positive, respectful, and non-judgmental about appearance.
- Do not make negative appearance inferences or claims. Do not imply real AI processing when a capability is mocked.
- Support text, voice, and image interaction affordances. Preserve a future handoff path to a human consultant.

## Security and data

- Never commit secrets, user photos, access tokens, or production data.
- Validate untrusted input at API boundaries when APIs are added. Apply least privilege and avoid exposing sensitive details in client errors.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
npm run format:check
```

## Git workflow

- Keep changes small, cohesive, and reviewable.
- Run relevant checks before each commit. Use imperative commit messages.
- Do not amend or overwrite user work. Inspect `git status` before committing.
