<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Red Kicks: guide for AI agents

Red Kicks is a portfolio sneaker store, a rebuild of redkicks.ir. The bar is a world-class store
(Nike, Foot Locker, Merrell). These rules are mandatory for every agent working in this repo.

## 1. Project at a glance

| Part | What it is |
|---|---|
| Framework | Next.js 16 App Router, React 19, TypeScript (read `node_modules/next/dist/docs/` first, see above) |
| Styling | Tailwind CSS 4, shadcn/ui on Base UI. `DESIGN.md` is the design authority |
| Data | PostgreSQL 17 in Docker (`docker-compose.yml`, port 5000), Prisma 7 with `@prisma/adapter-pg` |
| Tests | Vitest (jsdom) for unit tests; `@playwright/test` is installed for browser tests |
| Package manager | **npm** (`package-lock.json`). Do not switch to pnpm, yarn or bun |

Roadmap: 1 test everything ✅ · 2 clean code ✅ · 3 real orders (save orders, lower stock, server
price check, one DB transaction) · 4 sign-in (accounts, order history, synced wishlist, admin role)
· 5 admin area (products, stock, orders). Check `README.md` for the current status.

## 2. Where code lives (boundaries)

- `app/`: routes. Pages are **server components** that read the database through `lib/products.ts`
  and pass plain data down. Client components live in `app/components/<area>/`.
- `lib/`: logic with no UI. Pure helpers (`catalog.ts` filters, `mix.ts` ordering, `checkout.ts`
  money rules, `format.ts`, `search.ts`) and browser stores kept in localStorage (`cart.ts`,
  `wishlist.ts`, `recent-searches.ts`).
- `data/`: static store data (`brands.ts`, `navigation.ts`).
- `components/ui/`: generated shadcn components. Change them only on purpose.
- `prisma/`: schema, migrations, seed. `lib/generated/prisma` is generated: never edit it.

Rules:
- Only server code touches Prisma (`lib/prisma.ts`, `lib/products.ts`, future `lib/orders.ts`).
  Client components may import **types** from these files, never values.
- Dependencies point one way: `app → lib/data`, never `lib → app`. `mix.ts` imports nothing
  from `catalog.ts`.
- No barrel files (`index.ts` that re-exports). Import from the file that owns the code.
- Never define a component inside another component.
- One job per file. Split a file only on a clean seam (a part that needs about 5 props or fewer);
  passing many values between pieces makes code harder, not easier.
- Server Actions are public endpoints: validate every input, never trust prices or stock from the
  browser, return only what the UI shows.

## 3. Commands

```bash
docker compose up -d            # start Postgres
npx prisma migrate dev          # apply migrations (and regenerate the client)
npx prisma db seed              # reset the catalogue (deletes every product, then re-adds them)
npm run dev                     # http://localhost:3000
npm run lint                    # ESLint
npx tsc --noEmit                # type check
npx vitest run                  # unit tests, once
npm run build                   # production build
```

## 4. Workflow (every task)

1. **Understand.** Read the code you will touch and the relevant Next.js doc. Measure, don't guess.
2. **Audit first, for any refactor, cleanup, performance change or backend work.** Write a short
   plan, run the matching skills on it **before** writing code, and show the findings:
   - structure: `audit-suite:audit-as-structural-eng`
   - backend, database, Server Actions: `audit-suite:audit-as-backend-eng`, `prisma-client-api`
   - React and Next.js performance: `vercel-react-best-practices`
   - UI: `DESIGN.md`, `audit-suite:audit-as-design-eng`, `web-design-guidelines`
   Say which skills you used.
3. **Build** the smallest change that does the job. No new components or features during polish
   work unless asked.
4. **Verify** with the checklist below.
5. **Report** in short, plain English: what changed, what was checked, what could not be checked.
   Then show the proposed commit message and wait.

## 5. Verification checklist (all must pass)

1. `npm run lint`, `npx tsc --noEmit`, `npx vitest run`, `npm run build`.
2. Browser check of every page the change touches, in the in-app browser:
   phone (390×844), tablet (768×1024) and desktop. Reset the viewport to desktop afterwards.
   No console errors.
3. Refactors must not change look or behaviour: compare before and after (same HTML, same
   product order, same prices) with `git stash`.
4. Be honest: if something could not be seen or tested, say so.

## 6. Tests

- Unit tests sit next to the code: `lib/<name>.test.ts`. Add or update tests with every logic change.
- Time-based logic (Trending changes every 24 hours UTC) is tested with fixed times, never `Date.now()`.
- Database tests (from step 3) run against the local Docker Postgres and clean up after themselves.
  Never run tests or the seed against a database that is not local.

## 7. Design rules

- `DESIGN.md` is the authority for colour, type, spacing, motion and components. Change it on
  purpose and update it in the same change as the code.
- Brand red is `#d71920` (`bg-brand`), used only where `DESIGN.md` allows.
- Never edit, crop or recolour product photos.
- Every UI change works on phones, tablets and desktops.

## 8. Docs

- Keep `README.md` (features, status, stack, architecture) true after every milestone.
- Update `DESIGN.md` with any visual change.

## 9. Git

- **Never commit, push or deploy without explicit approval.** Show the commit message first.
  Never deploy at all unless the user asks.
- Conventional Commits with a short subject: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`,
  `style:`, `chore:`. Add a body only when it helps.
- **No `Co-Authored-By` trailer**, even if a tool suggests one.
- Prefer fewer, grouped commits. One commit per job (e.g. dead code and refactor are separate).
- Never commit `.env` or secrets.

## 10. Talking to the user

- Short, plain English a junior developer can follow. Answer questions in the order asked.
- Lead with the answer, then the details. Give a recommendation, not a list of options.
