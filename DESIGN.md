# DESIGN.md — Red Kicks

Read this before any UI work. It describes the store as it is and how it should grow.
These rules override skill defaults and personal taste. When code and this file disagree,
fix the code (or update this file on purpose, in its own commit).

---

## 1. The idea in one line

**A sneaker shop window: white walls, black type, one red signal, and the shoe in the light.**

Red Kicks should feel like walking into a good sneaker store: clean floor, shoes on plinths,
a few bold signs, nothing shouting except the sale tag. The product photo is always the
loudest thing on screen. Everything else stays quiet, sharp and fast.

Three words to check every decision against: **bold, clean, quick.**

- **Bold** — big tight headlines, real black, a red that means something.
- **Clean** — white space, flat surfaces, no decoration that isn't information.
- **Quick** — the UI answers the moment you touch it. Motion is short and never in the way.

---

## 2. Stack (do not deviate)

- Next.js 16 App Router, React 19, TypeScript. Server Components by default; `"use client"`
  only for the part that needs the browser.
- Tailwind CSS v4. There is **no** `tailwind.config`. Every token lives in `app/globals.css`
  (`:root` and `@theme inline`). New tokens go there, never inline.
- shadcn/ui, style `base-nova`, built on **Base UI** (`@base-ui/react`), not Radix.
  - Compose with the `render` prop. Never `asChild`. Never install `@radix-ui/*`.
  - Add components with `npx shadcn@latest add <name>`; they land in `components/ui`.
  - Don't edit `components/ui` for one-off needs. Add a cva variant or compose.
- Icons: `lucide-react` only, size 16 or 20, `strokeWidth={1.5}` (2 for tiny 16px icons
  that look thin). No emoji as icons.
- Carousel: `embla-carousel-react`. Animation: CSS + `tw-animate-css`. No new UI or
  animation libraries.
- Class merging: `cn()` from `@/lib/utils`.

---

## 3. Colour

### 3.1 The palette

| Token | Value | Role |
|---|---|---|
| `--background` | white | The shop floor. Page background. |
| `--foreground` | `#181818` | Ink. All text, icons, the black strips (delivery banner, footer). |
| `--surface` | `#f5f5f3` | The plinth. Product image tiles, quiet panels. |
| `--surface-hover` | `#e9e9e6` | Surface under the pointer. |
| `--muted-foreground` | `#646464` | Secondary text: meta, helper text, old prices. |
| `--border` | `oklch(0.922 0 0)` | Hairlines and input outlines. |
| `--brand` | `#d71920` | **Red Kicks red.** The signal. Also `--primary` and `--ring`. |
| `--brand-hover` | `#af1218` | Red under the pointer / pressed. |
| `--brand-bright` | `#ff3b3b` | Red as **text on ink** (5:1 on `#181818`). Footer "Sale", banner highlights. |

Use the Tailwind names: `bg-background`, `text-foreground`, `bg-surface`, `hover:bg-surface-hover`,
`text-muted-foreground`, `border-border`, `bg-brand`, `hover:bg-brand-hover`, `text-brand-bright`.

**Never** `bg-white`, `text-gray-500`, `bg-black`, hex values, or `bg-[#111]` in components.
If you need a colour that has no token, add the token first.

### 3.2 Where red is allowed

Red is a signal, not a theme. It means **"act here" or "deal here."** Allowed on:

1. The primary button (`Add to bag`, `Checkout`, the hero CTA).
2. Sale prices and the `Sale` badge.
3. The bag count badge.
4. The red full stop at the end of page titles (`.title-mark`).
5. Focus rings and text selection (already wired in `globals.css`).
6. `text-link` style links, sparingly (one or two per section).

Never on: section backgrounds, body text, large borders, icons for decoration, gradients.
Outside of a product grid's sale prices, aim for **one red thing per screen**.

### 3.3 Ink sections

The delivery banner and the footer are ink (`bg-foreground text-background`). That black is
the store's frame — top and bottom only. Don't add more black sections in the middle of a page.
On ink, red text uses `text-brand-bright`, never `text-brand` (too dark to read).

### 3.4 Dark mode

The store is **light only**. The `.dark` block in `globals.css` is shadcn's default leftover and
is not a designed theme. Don't add `dark:` classes. If dark mode is ever wanted, it gets designed
as its own task (ink background, `--surface` becomes `#222`, red stays `#d71920` for fills and
`--brand-bright` for text).

---

## 4. Typography

### 4.1 Faces

- **Geist Sans** — everything: UI, body, product names, prices, and page/section titles.
- **Anton** (`font-display`) — heavy condensed, the sports-poster face. Only for big slogans:
  the hero and campaign banners. Always uppercase, `leading-[0.9] tracking-tight`, never below
  `text-4xl`, never for body or buttons.
- Numbers that line up (prices, sizes, totals, quantities): `tabular-nums` in Geist.
  No monospace font for prices or labels.

### 4.2 Scale (use these, nothing in between)

| Role | Class | Notes |
|---|---|---|
| Hero / campaign | `font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.9] tracking-tight` | Anton, uppercase. A slogan, not a product name. |
| Page title | `.page-title` | Geist 700, tight tracking, ends with `.title-mark` red full stop. |
| Section title | `.section-title` | Geist 700, tight tracking. |
| Section intro | `.section-intro` | One sentence, muted, max 32rem. |
| Panel title | `.panel-title` | Filters, order summary, bag sections. |
| Product name | `text-sm font-medium` | Never bold, never uppercase. |
| Body | `text-base` | Max width `max-w-prose`. |
| Secondary | `text-sm text-muted-foreground` | Meta, helper text. |
| Badge / small label | `text-xs font-semibold` | Sentence case. |

Rules:

- Hierarchy comes from **size and weight**, not colour and not boxes.
- Big text gets **negative** tracking (already in the classes); small text stays at 0.
- Titles are sentence case: "New this week." — not "NEW THIS WEEK" in Geist, not Title Case.
- Uppercase only through Anton. No tracked-out all-caps labels above headings (eyebrows).
- Left-aligned by default. Centre only short single lines inside a centred block (empty states).
- `text-wrap: balance` on titles (in the classes), `text-pretty` on paragraphs.

---

## 5. Layout and spacing

### 5.1 Containers

- Every page uses `.content-shell` (max 100rem, 1rem gutters, 2rem from `sm`). One container,
  reused everywhere. Never set page widths per page.
- Sections use `.section-space` for vertical rhythm. Every section, same value.
- Full-bleed things (hero, ink strips) break out of the shell on purpose; their content goes
  back inside a `.content-shell`.

### 5.2 Spacing scale

For padding, margin and gap use only Tailwind steps **1, 2, 3, 4, 6, 8, 12, 16, 24**.
No 5, 7, 10, 14, 20. No arbitrary values (`mt-[18px]`). Heights and positions (`h-11`,
`h-16`, `top-24`) are sizes, not spacing — they're fine.

- Inside a group (name + price, label + input): `gap-1` or `gap-2`.
- Between groups: `gap-6` or `gap-8`.
- Section header to content: `gap-8` (or `mb-8` on the header only).
- **Proximity rule:** space inside a group is always smaller than space between groups.
- Build layouts with `gap-*` on the flex/grid parent. No `space-y-*`. Don't mix `mt-*` and
  `mb-*` on siblings.
- Touch targets: at least 44px (`min-h-11` / `size-11`) on anything tappable.

### 5.3 Grids

- Product grid: `grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6 md:gap-y-12`.
  Row gap is always bigger than column gap — shoes read as rows on shelves.
- Breakpoints: design at **375, 768, 1440**. Nothing may scroll sideways at 375.

---

## 6. Shape and depth

- **Buttons and the search field are pills** (`rounded-full`). That's the store's signature
  shape — keep it consistent: every button, chip and filter toggle is a pill, the hero's included.
- **Image tiles, cards and panels** use `rounded-2xl` (1rem — the trending card value). One
  radius for every tile in the store; don't mix 1rem and 0.5rem tiles.
  - The one exception: the Shop by category cards are several times wider than a trending card,
    and at that size the tile radius reads as a thick, soft corner, so they use `rounded-lg` (the
    base radius). A tile only changes radius because of its size — never for variety.
- **Inputs, selects, dropdowns, popovers** use `rounded-lg` (the base `--radius`).
- Full-bleed banners and ink strips: `rounded-none`.
- Depth comes from **surface colour and borders**, not shadows. `shadow-sm` only on floating
  layers (dropdown, popover, sheet, search overlay). Never `shadow-lg`/`xl`, never coloured
  shadows.
- Sticky bars (navbar, filter bar, mobile buy bar) are solid `bg-background` with a
  `border-b`. No transparency, no `backdrop-blur`, no glass. **The one exception is the main navbar and its
  menu panel:** they are glass (`bg-background/75 backdrop-blur-xl backdrop-saturate-150`, a hairline `border-b border-border/60`
  and `shadow-sm`), sticky, so the page slides under them blurred. The glass is its own layer inside the header
  (not the header itself), so the menu panel can blur the page behind it too.

---

## 7. Photography

The photo is the product. Treat every image the same so the grid reads as one shelf.

- Shoes are cut out (transparent background) and sit on `bg-surface`. No white boxes on grey,
  no photo backgrounds inside product tiles.
- **The whole shoe is visible.** Nothing cropped at the toe or heel. Side profile, toe pointing
  left, same angle across a grid.
- Breathing room: the shoe fills about 70% of the tile (`.product-image` uses 16% padding).
- `next/image` with real `sizes`, `object-contain` for products, `object-cover` only for
  lifestyle/campaign photos (hero, categories).
- Category and campaign photos show **a complete product in context** — a recognisable shoe,
  not a blurry close-up or a mirrored fake. Use brands the store sells.
- Every image has a meaningful `alt` ("Nike Air Max 90 in white and red"), decorative ones `alt=""`.
- No filters, overlays, gradients or vignettes on product photos. Text on a lifestyle photo
  sits on a flat ink scrim only if contrast needs it.

---

## 8. Motion

Motion should feel like the store is **responding to you**, not performing for you.
Short, sharp, from where you touched, and always interruptible.

### 8.1 Timing tokens

Add these to `@theme inline` in `globals.css` and use them instead of raw values:

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Things arriving: menus, sheets, images. |
| `--ease-in-out` | `cubic-bezier(0.45, 0, 0.55, 1)` | Things moving between two places: carousel, crossfades. |
| `--ease-spring` | a `linear()` curve of a critically damped spring (in `globals.css`) | Things that move between two places and should feel physical, 500ms and up: the Trending tab pill and lists, the Trending card hover. It starts gently and settles slowly, so it reads slower than a bezier of the same length. |
| `--duration-instant` | `100ms` | Press feedback (scale, colour). |
| `--duration-fast` | `150ms` | Hovers, small fades, icons. |
| `--duration-base` | `200ms` | Dropdowns, tooltips, card hover. |
| `--duration-slow` | `300ms` | Sheets, drawers, mega-menu, page-level reveals. |

Nothing in the UI animates longer than 400ms, with these exceptions: the carousel slide and the spring motions of the Trending tabs and cards (500–700ms, see §8.3). Never use `cubic-bezier(0.22, 1, 0.36, 1)`-style curves for a long move: they do most of the work in the first fifth of the time, so a 500ms move feels like a 150ms snap.

### 8.2 Rules

1. **Animate only `transform` and `opacity`** (plus `color`/`background-color` for hovers).
   Never `width`, `height`, `top`, `margin`, `box-shadow` or `filter`.
2. **Respond on press, not release.** Buttons get `active:scale-[0.97]` with
   `duration-[var(--duration-instant)]` — the press is felt immediately.
3. **Hover in fast, hover out slower.** Arriving is `--duration-fast`; leaving can take
   `--duration-base` so the UI doesn't flicker when the pointer passes across a grid.
4. **Enter and exit the same way.** A sheet that slides in from the right leaves to the right.
   A menu grows out of the button that opened it (`transform-origin` at the trigger).
5. **Exits are faster than entrances** (about two-thirds the time).
6. **Interruptible.** Never block input while something animates. Prefer CSS transitions over
   keyframes for anything a user can reverse (open/close), because transitions reverse from
   where they are; keyframes jump.
7. **Hover effects only on real pointers:** wrap them in `@media (hover: hover) and (pointer: fine)`
   (or Tailwind's `hover:` which already does this in v4). Touch shows the final state directly.
8. **One choreographed moment per page at most** (e.g. the listing grid's `.grid-reveal`).
   No fade-up on every section as you scroll. No parallax, no bounce, no spin, no confetti.
9. **Reduced motion:** the global rule in `globals.css` cuts durations to ~0. Anything that
   moves a large area must still make sense with no motion (state just changes).

### 8.3 The store's motion vocabulary

Reuse these; don't invent new effects per component.

| Moment | Motion |
|---|---|
| Button press | Scale to 0.97, 100ms. Colour change 150ms. |
| Listing card hover | Photo scales to 1.03 over 200ms `--ease-out`. No lift, no shadow, no sliding buttons. |
| Trending card hover | One slow, soft crossfade on `--ease-spring`: the photo fades and settles to 0.96 (500ms) while the name and price rise in (600ms, starting 120ms later). Leaving: text out 250ms, photo back 550ms. |
| Tab switch (Trending) | The black pill glides to the chosen tab (700ms, `--ease-spring`, transform only, so it can be interrupted). Both lists stay loaded and stacked: the old one fades out (300ms), the new one fades in and rises (600ms, after 150ms). |
| Wishlist heart | On add: heart fills red and scales 1 → 1.2 → 1 over 200ms. On remove: just unfills. |
| Add to bag | Button shows "Added" with a check for ~1.5s; the bag count badge scales 1 → 1.15 → 1. No flying-shoe animation. |
| Mega-menu | Panel drops open, then after 200ms the links slide down 10px and fade in (`.nav-panel-content`). |
| Dropdown / popover | Fade + scale from 0.96 at the trigger, 200ms in, 150ms out. |
| Sheet / drawer | Slide from its edge, 300ms `--ease-out` in, 200ms out. Scrim fades with it. |
| Image gallery | Crossfade 200ms between photos. Thumbnails change instantly. |
| Hero carousel | Slide 500ms `--ease-in-out`. Autoplay 6s, pauses on hover/focus/touch, off under reduced motion. Prev/next always visible. |
| Page content loading | Skeleton in the final layout, `animate-pulse` on `bg-surface`. Never a spinner on a blank page. |
| Filter change | Results swap without animation; the count updates. Speed is the feature. |

---

## 9. Components

### 9.1 Buttons

- Pill, `min-h-11`, `px-6`, `text-sm font-semibold`, icon 16px with `gap-2`.
- **Primary** (`bg-brand text-white hover:bg-brand-hover`): one per screen — the main action.
- **Secondary** (`bg-foreground text-background`): a strong action that isn't *the* action.
- **Outline** (`border border-border hover:bg-surface`) and **ghost** (`hover:bg-surface`) for the rest.
- Labels are verbs: "Add to bag", "Checkout", "Shop men". No arrows appended to labels.
- Disabled: `opacity-50`, no hover, `cursor-not-allowed`.

### 9.2 Product card (listings)

- Structure: image tile → name → price. Plus the wishlist heart, top-right of the tile,
  always visible (not slid in on hover), `size-11` hit area.
- Tile: `aspect-square bg-surface rounded-2xl`, `next/image` `object-contain`.
- No card border, no card shadow, no card padding. The tile is the card.
- Text: `pt-3 flex flex-col gap-1`. Brand in `text-sm text-muted-foreground`, name in
  `text-sm font-medium`, price in `tabular-nums`.
- Badges (`New`, `Sale`) sit top-left on the tile: `text-xs font-semibold`, pill, `bg-background`
  for New, `bg-brand text-white` for Sale. Max one badge per card.
- Colour count ("3 colours") as secondary text, not swatches, unless swatches are interactive.

### 9.3 Price

- Regular: `text-foreground tabular-nums font-medium`.
- Sale: new price `text-brand`, old price `line-through text-muted-foreground`, in that order.
- Always the `Price` component; never format prices by hand.

### 9.4 Product page

- Desktop: two columns, gallery 7/12, info 5/12; the info column is `sticky top-24`.
- Mobile: gallery, then info, then a sticky bottom "Add to bag" bar (solid, `border-t`).
- Info order: brand, name, price, colourways, size picker, Add to bag, details.
- Size picker: grid of equal pill-or-rounded buttons, `h-11`, `tabular-nums`.
  Selected = `bg-foreground text-background`. Sold out = shown, disabled, `line-through`
  in `text-muted-foreground` — never hidden. Low stock ("Only 2 left") in `text-sm`, not red.
- Colourways: thumbnail tiles, selected one gets a `ring-2 ring-foreground`.

### 9.5 Announcement bar and navbar

- **Announcement bar** (`AnnouncementBar.tsx`): an ink strip, `min-h-11`. In the middle, one short promise at a time (delivery time, free delivery, sale) with previous and next arrows and a pause button; the message rises in on `--ease-spring`. It stops while the pointer or keyboard is on it and never moves by itself with reduced motion. Messages are short, sentence case, real promises the store keeps. On large screens the shopper's own links sit on the right: Help, wishlist, account. On phones only the messages show.
- **Navbar**: solid `bg-background`, `border-b`. Logo left, links centred (Women, Men, Brands, then Sale in `text-brand`), then a pill search field and the bag on the right. The search field opens the search panel. On phones: logo left, search, wishlist, account and bag icons right, links on a second row.
- Wishlist and account live in the announcement bar from `lg` up, and in the navbar below it. The bag count badge is the shared `CountBadge`.
- Mega-menu: solid panel, plain link columns, the motion from §8.3.
- The navbar is sticky glass (§6); the announcement bar above it is solid ink and scrolls away.

### 9.6 Listing page and filters

- Page title (with red full stop) + result count in secondary text.
- Filter bar is sticky and **solid** — no blur.
- Filters are pill toggles; active = `bg-foreground text-background`.
- Empty result: say what happened and offer the way out ("No shoes match these filters.
  Clear filters").

### 9.7 Forms (checkout, support)

- Labels above inputs, always visible. No placeholder-as-label.
- Inputs `h-11 rounded-lg border-border`, focus ring red.
- Errors under the field in `text-sm text-destructive`, saying how to fix it.
- One column on mobile, never more than two on desktop.

### 9.8 States

Every list and async view has all three:

- **Loading:** skeleton matching the final layout.
- **Empty:** one sentence + one action. ("Your bag is empty. Shop new drops")
- **Error:** what went wrong + retry. Never apologise, never vague.

### 9.9 Home sections

- Hero: the same layout on every slide, the way Nike and Foot Locker do it: a **big slogan**, **one
  short line**, **one button**. Only the **slogan's colour** changes, one solid, calm colour taken
  from the photo (silver, tan, sage, rust, volt in `HeroCarousel.tsx`). The button is **plain
  white** on every slide, like Nike's: never orange, green or any photo colour. No glass: no
  gradient text, transparency, `backdrop-blur`, glow or tinted shadow.
  - One face (Anton), one button shape (the pill), one label ("Shop now →"). Don't give a slide its
    own font, shape or extra button: that reads as a template trying to look custom.
  - The text sits in the quiet part of each photo (empty sky, backdrop, floor), never over the
    shoe, the athlete or busy grass. A soft gradient behind it, not a dark layer over the photo.
  - 16px of side padding on phones, 32px on laptops; the button is never clipped or overlapped.
- Trending, Shop by brand, Shop by category: section title (+ optional intro) then content.
- **Store facts** (the Advantages section): allowed only with **real numbers from the
  database** ("73 styles", "6 brands"), set as big Geist numbers with a short label — no icons
  in tinted squares, no "10k+ happy customers".

---

## 10. Copy

- Short, concrete, sneaker language: "New drops", "Size guide", "Add to bag", "Sold out".
- UK sizes and spelling: "UK 9", "colour", "favourites".
- Sentence case everywhere. No exclamation marks. No emoji.
- Banned words: elevate, unleash, unlock, seamless, step into, curated, discover our,
  game-changer, effortless, premium experience, journey.
- Buttons are verbs. The same action keeps the same name through the flow ("Add to bag" →
  toast "Added to bag").

---

## 11. AI slop — banned patterns

If it looks like it could be on any startup's landing page, it doesn't belong here.

- Gradients on text, buttons, backgrounds or borders. (The `multi` colour swatch is data, not decoration.)
- Glassmorphism, `backdrop-blur`, glow, coloured or large shadows (the navbar in §6 is the only glass).
- Three (or four) feature cards with an icon in a tinted rounded square.
- Stats rows with made-up numbers, fake testimonials, star ratings without reviews, logo clouds.
- Pill badges above the hero headline ("✨ New collection").
- Tracked-out uppercase eyebrow labels over every heading.
- Numbered markers (01 / 02 / 03) on things that aren't steps.
- "→" appended to every link and button.
- Middle-dot meta strings ("Nike · Running · Men") — use separate lines or plain commas.
- Cards inside cards; borders around everything.
- Everything centred.
- Fade-up-on-scroll on every section; hover lifts with shadows.
- Decorative blobs, dots, grids, noise or squiggles.
- Different radius, padding or shadow for the same kind of element.

---

## 12. Accessibility

- Text contrast at least 4.5:1. `#d71920` on white passes for text; on ink use `--brand-bright`.
- Visible focus on every interactive element (global red outline in `globals.css` — don't remove it).
- Icon-only buttons have `aria-label` ("Add to favourites", "Open bag").
- Full keyboard support: menus, carousel, size picker, filters, dialogs (Esc closes, focus returns).
- Size and colour choices are not shown by colour alone (line-through + label for sold out).
- Respect `prefers-reduced-motion` (global rule already in place).

---

## 13. Known gaps (fix when touching these files)

- `app/components/listing/ProductListing.tsx` — filter bar uses `bg-background/80 backdrop-blur-xl`. Make it solid.
- `app/globals.css` — add the motion tokens from §8.1; the `.dark` block is unused.
- Category photos: Outdoor still needs a real product-in-context photo.
- `Advantages` — check it against §9.9 when it moves to the database (step 3c).

---

## 14. Definition of done

Before saying a UI task is finished:

1. Screenshot it at **375, 768 and 1440 px** (built-in browser or Playwright) and look at them.
2. Check against §3.2 (red), §5 (spacing), §6 (shape), §8 (motion) and §11 (slop). Fix every violation.
3. Try it with keyboard only, and with reduced motion on.
4. Run the `web-design-guidelines` skill on the changed files.
5. No new dependencies, no hardcoded colours, no arbitrary spacing values, no console errors.
