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

## Server boundaries and privacy

- Keep AI providers, repositories, orchestration, and credentials in `src/server`; client components call only validated API routes.
- Never expose API keys, secrets, or provider credentials in browser code or public environment variables.
- Validate every server input. Treat client-provided prices, stock, store scope, and product data as untrusted; resolve authoritative values server-side.
- Minimize personal data and retain it only for the supported feature. Future user photos require private/signed storage and explicit access controls.
- Never infer sensitive attributes from photographs. Provider API keys and raw image references must remain server-side.

## Real AI integration

- Keep real provider calls in `src/server/ai`; never import an AI SDK or use an API key in client code.
- Ground product, price, size, stock, brand, and availability claims in controlled catalog tools. Do not let model text create commercial facts.
- Limit input length, history, tool calls, and provider timeout. Log only request IDs, latency, tool names, and safe error codes.
- Register every AI tool explicitly and validate both arguments and catalog-grounded results; reject unknown product/variant IDs and server-calculated budget violations.
- Commerce mutations require authenticated server services. A model must never receive direct repository, database, price, stock, or authorization control.

## Images, tenancy, and transactions

- Treat every image as private untrusted input; require explicit purpose/consent, validate magic bytes and limits, use random storage IDs, temporary access, retention, and deletion.
- Scope every staff/customer resource on the server by both owner and store; frontend visibility is never authorization.
- Reservation, stock decrement, order creation, and checkout must use database transactions and authoritative prices/inventory.
