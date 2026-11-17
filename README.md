# RED KICKS

A sneaker store for men and women, built with Next.js, PostgreSQL and Prisma. A CRM for managing products and orders is planned next.

> 🚧 **Work in progress.** The store works end to end on a real database. Accounts, saved orders and the CRM are still being built.

## Features

### Done
- **Browse:** home page, men, women, sale, shop all, and a page for each brand
- **Filter and sort:** by category, colour, size and price, saved in the URL so a filtered page can be shared
- **Search:** live suggestions as you type, plus a full results page
- **Product page:** photo gallery, colourways, and sizes with live stock
- **Bag and wishlist:** saved in the browser, so they survive a page reload
- **Checkout:** form with checks on every field and an order confirmation (demo only, no payment is taken)
- **Catalogue:** 70+ products from 14 brands, with colourways, UK sizes and stock, stored in PostgreSQL
- **Home page banner:** a carousel with a big slogan, one short line and one button per slide
- **Tests:** unit tests for the bag, checkout totals, filters and search

### In progress
- User accounts (sign up and log in)
- Saving orders to the database
- CRM for managing products, stock and orders

## Tech stack

| Part | Tools |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui on Base UI |
| Database | PostgreSQL 17 (Docker), Prisma 7 |
| Testing | Vitest |

## Architecture

Next.js is both the frontend and the backend. There is no separate Express server.

```
Browser
   ↓
Next.js pages (Server Components read the data on the server)
   ↓
lib/            business logic: products, filters, search, bag totals
   ↓
Prisma
   ↓
PostgreSQL
```

**Why this design**

- **One app, one deploy.** Server Components read the database directly, so most pages need no API.
- **All data goes through one file.** Every page gets products from `lib/products.ts`. Changing how data is loaded means changing one place.
- **Filters live in the URL.** A filtered page can be shared, bookmarked and used with the back button.

**What comes next:** the store and the CRM will be two Next.js apps in one monorepo. They will share one package with the Prisma schema and the business logic, and both will use the same database.

## Database

| Table | Holds |
|---|---|
| Brand | Name, slug, logo |
| Product | Name, gender, category, price, sale price, flags (new, featured, trending) |
| Variant | One colourway of a product: its colours and photos |
| Size | One size of a colourway, with how many are in stock |

## Design

The look of the store (colours, type, spacing, motion and the rules for the home banner) is written down in [DESIGN.md](DESIGN.md).

## Getting started

> These steps are for the current single app. They will change when the project moves to a monorepo.

You need Node.js and Docker.

1. Install packages:
   ```bash
   npm install
   ```
2. Create a `.env` file with these two values (never commit it). The database user and name come from `docker-compose.yml`:
   ```
   POSTGRES_PASSWORD=your-password
   DATABASE_URL=postgresql://Meiad:your-password@localhost:5000/kicks-store
   ```
3. Start the database:
   ```bash
   docker compose up -d
   ```
4. Create the tables and load the products:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```
5. Run the app at http://localhost:3000:
   ```bash
   npm run dev
   ```

Run the tests with `npm test`.

## Roadmap

- [x] Store UI: browse, filter, search, product page
- [x] Bag, wishlist and checkout
- [x] PostgreSQL and Prisma replace the mock data
- [ ] Input validation on the server
- [ ] User accounts and admin role
- [ ] Save orders to the database
- [ ] Move to a monorepo with a shared package
- [ ] CRM app: products, stock and orders
- [ ] Deploy

## Author

**Meiad Majzoubi** · [GitHub](https://github.com/MeiadMajzoubi)
