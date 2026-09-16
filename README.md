# AI Fashion

AI Fashion — premium-платформа для магазинов одежды с уважительным AI Продавцом. **Task 03** добавляет PostgreSQL/Drizzle persistence foundation; реальные AI, платежи, try-on, voice/image recognition и production OAuth не подключены.

## Почему PostgreSQL + Drizzle

Выбран **PostgreSQL** как надёжная реляционная основа для транзакций, inventory, заказов и связей multi-store. **Drizzle** выбран за типизированную schema-first модель, SQL-миграции и тонкий runtime-слой — repository contracts остаются независимыми от ORM.

## Архитектура

`src/app` содержит UI/API, `src/features` — клиентские feature-модули, а `src/server` — только server-side domain, repositories, persistence, AI orchestration, auth и commerce services. Поток: **UI → API → service → repository → PostgreSQL**. Клиент не импортирует DB или AI provider.

- `src/server/db/schema.ts` и `drizzle/0000_initial.sql` — Drizzle schema и первая PostgreSQL migration.
- `src/server/repositories/DatabaseCatalogRepository.ts` — persistence adapter; `MockCatalogRepository` сохранён для быстрых unit tests.
- `src/types` — provider-neutral catalog, AI, auth и search contracts.
- `src/server/services/validation.ts` — server-boundary validation без доверия к цене, stock или totals от клиента.

## Schema и multi-store

Migration создаёт stores, users/profile preferences, products, variants/inventory, favorites, carts/cart items, orders/order items, reservations, conversations/messages и consultant handoffs. Products, inventory, orders и reservations принадлежат store; user-owned records имеют user boundary. Никакой singleton store ID не заложен в contracts.

## Database setup

```bash
cp .env.example .env
# set DATABASE_URL to a local PostgreSQL database
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

`db:seed` добавляет один demo store и 36 реалистичных mock products c цветами, размерами, variants, stock и безопасными `placehold.co` URLs. Seed никогда не используется React-компонентами.

## API, validation and auth mode

Catalog routes validate query filters and product IDs, returning clean 400 errors. AI/handoff routes keep explicit mock behavior. Future prices, stock, totals и store authority must always be fetched server-side.

`getCurrentSession()` uses a development-only `x-ai-fashion-dev-user` header or `DEV_USER_ID`; without it the visitor is a guest. This is an auth boundary—not password auth. A future established provider can add email, phone, Google and Apple without changing feature services.

## Product and commerce foundation

`/products/[id]` renders a server-loaded product view with image, price, colors, sizes, availability, store, AI hint and placeholder commerce actions. Product cards route to it.

`FavoriteService`, `CartService` and `ReservationService` model ownership, server-derived price/subtotal, stock restrictions, 24-hour expiry and positive quantities. Their persistence tables are part of the migration; real database adapters/API UI wiring are the next incremental integration.

## Commands

```bash
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npm run format:check
npm run db:generate
npm run db:migrate
npm run db:seed
```

## Security

No secrets or provider keys belong in browser code. API inputs are validated, malformed IDs and invalid prices return 4xx responses, and API error responses must not expose stack traces. Future user images need private/signed storage; AI must never infer sensitive attributes.

## Tests and environment limitation

`npm test` uses Node's built-in test runner and covers catalog filters/stock, validation, intent parsing, AI recommendations, cart/subtotal/quantity, favorites ownership and reservations.

This environment’s proxy returns `403 Forbidden` from npmjs.org (observed for `@types/node`) so `npm install`, TypeScript, ESLint, migration execution and production build cannot be verified here. The failure is external: standard npm registry configuration is retained and unnecessary prior dependencies were removed.

## Recommended Task 04

Run PostgreSQL locally, apply/validate migration, finish database adapters for commerce/conversations/handoff, wire authenticated APIs and UI states, then consider a reviewed production auth provider. Do not add real AI or payments yet.

## Task 04 API and runtime status

Authenticated resources expose `GET/POST /api/favorites`, `DELETE /api/favorites/:productId`, `GET/POST /api/cart`, `PATCH/DELETE /api/cart/:itemId`, `GET/POST /api/reservations`, `DELETE /api/reservations/:id`, and `GET /api/auth/session`. Error responses use `{ "error": { "code", "message" } }`; guest requests receive `AUTH_REQUIRED`.

The development services preserve user boundaries in-memory while the PostgreSQL migration reserves equivalent durable tables. Because the environment cannot install dependencies or provide PostgreSQL tools, persistent runtime migration, seeded DB verification, database-backed commerce adapters, conversation persistence, and handoff persistence remain unverified and must be completed with a running PostgreSQL instance before production use.

## Real AI Seller (Task 05)

The server can use OpenAI's Responses API through `OpenAiProvider`; the UI remains provider-agnostic and only calls `/api/ai/seller`. Set `REAL_AI_ENABLED=true`, `OPENAI_API_KEY`, optional `OPENAI_MODEL`, and `AI_REQUEST_TIMEOUT_MS` only on the server. Without a key or enabled flag, `createAiProvider` deliberately selects `MockAiProvider`.

The provider receives only the latest 12 conversation messages and may call the controlled `search_products` catalog tool. Product recommendations are returned structurally from repository results, so the model cannot invent product facts. Requests are capped at 1,200 characters and 40 stored messages; provider requests time out, return safe 429/503 errors, and safe logs contain request ID, latency and tool names—not prompts, keys, or photos. Future work must add user/store quotas and token-cost monitoring.

## AI Seller capabilities (Task 06)

Controlled catalog tools now cover `search_products`, `get_product`, `check_stock`, `find_similar_products`, and `recommend_outfit`. All IDs, prices, sizes, colors, stock states, and outfit totals come from `CatalogRepository`; unknown IDs, unavailable sizes/colors, and over-budget outfits are rejected before any claim reaches the user. Structured responses include product recommendations, actions, optional outfit data, and a follow-up prompt.

`AiUsageGuard` limits requests per minute, input/output size, and tool-call count, with future token accounting intentionally left behind the same abstraction. OpenAI receives only explicitly registered tool definitions; invalid tool names/arguments fail closed. `MockAiProvider` returns the same structured product actions and follow-up fields without a live provider call. Commerce mutations continue through authenticated cart/favorites/reservation APIs rather than model-controlled database access.

# Tasks 07–12 platform foundation

## Image search and privacy

Image contracts, signature-based validation, explicit consent, private random object identities, temporary access and deletion are provider-neutral. `ImageCatalogSearchService` treats detected attributes as visual estimates and resolves every product fact through `CatalogRepository`. The analyzer mock ignores embedded text as untrusted content. No real vision provider or cloud storage has been runtime-verified.

## Virtual try-on

`VirtualTryOnProvider` and the asynchronous job service ground garments in the catalog and store inputs/results through private `ImageStorage`. The mock exercises lifecycle/error paths only; it is not a real generated fitting. Results explicitly say they show how an item _may_ look and do not guarantee physical fit.

## Customer commerce and personalization

Responsive navigation, catalog filters/sorting, product details, honest guest favorites/cart states, profile privacy controls, order/payment boundaries, and server-authoritative commerce services form the customer foundation. Fashion preferences require explicit consent, can be viewed/deleted, use category-specific sizes as guidance, and only rank—never hide—catalog results.

## Multi-store administration

Store memberships and server authorization distinguish customer, staff, store admin and platform admin. Admin UI sections are scaffolds for store-scoped APIs. Inventory validation prevents negative stock. Product-image AI suggestions require human review and cannot set price or inventory. Analytics contracts never fabricate events.

## Production audit status

Migration `0001_platform_foundation.sql` adds tenant/query indexes, phone and cart uniqueness, store memberships, private image assets, VTO jobs, preference profiles and analytics events. Reservations, inventory decrement, order creation and checkout require PostgreSQL transactions/row locking before production to prevent overselling. API keys remain server-only; image text is untrusted; AI tools are allowlisted; commerce mutations require auth and confirmation boundaries.

The repository is **not production ready**: npm access and PostgreSQL are unavailable in this environment, migrations were not executed, OpenAI/vision/VTO were not live-tested, in-memory adapters are process-local, production auth/storage/rate limiting/monitoring are absent, and customer/admin UI runtime accessibility/responsiveness was not browser-verified.

## Task 13 runtime verification

The pre-populated `node_modules` is sufficient to run Next.js and lint, but `npm install` still fails through the environment proxy on `drizzle-kit`; no root lockfile could be generated. On 2026-09-16 the development server rendered `/`, `/ai`, `/search`, `/products/midnight-dress`, `/favorites`, `/cart`, `/profile`, `/admin`, `/try-on/midnight-dress`, `/api/catalog`, and `/api/auth/session` with HTTP 200 and no server runtime error.

Image search is connected through `/api/image-search` to consent, magic-byte/dimension/pixel limits, private in-memory storage, the clearly identified mock analyzer, and catalog-grounded products. Mock VTO is connected through `/api/vto` and `/try-on/[productId]`; it requires development authentication and consent and explicitly states that no real AI result was generated. These process-local adapters are development-only.

PostgreSQL binaries and container tooling remain unavailable. Drizzle packages are the only missing dependency group observed by typecheck/build, so migrations, seed, persistent commerce repositories, and inventory transactions were not executed. Favorites/cart/reservations remain process-local; reservation and VTO deletion ownership checks were hardened, but production persistence and transactional stock locking remain blockers.
