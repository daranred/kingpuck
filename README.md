# KingPuck.com

A site celebrating the history of Puck Fair (Killorglin, Co. Kerry), with an online shop.

- **Hosting:** Cloudflare Pages (static files in `public/`)
- **API:** Cloudflare Pages Functions (`functions/api/`)
- **Payments:** Stripe Checkout (cards, Apple Pay and Google Pay, promo codes, shipping address)
- **Products:** `functions/_lib/catalog.js`, the single source of truth. The browser only sends product ids and quantities; prices are always looked up on the server.

```
src/site.mjs       site hierarchy (drives the menus, sidebar, bottom bar and footer sitemap)
src/layout.mjs     shared chrome: masthead, tablet sidebar, phone bottom bar, footer, cart drawer
src/pages/*.html   page content; `npm run build` wraps each in the layout and writes public/
public/            the deployed site: tokens.css (design tokens), styles.css, app.js, img/, stays.json
functions/api/     products, checkout, stripe-webhook, submit (archive uploads)
functions/_lib/    catalog.js (products), cart.js, stripe.js
tools/             build.mjs (pages), posters.mjs (poster SVGs)
test/              node --test unit tests
```

**Editing pages:** change `src/pages/*.html` (or `src/layout.mjs` for the header/footer), run `npm run build`, and commit both `src/` and `public/`. Cloudflare serves `public/` as-is, so no build command is needed there.

**Navigation:** desktop (≥1200px) top bar with dropdowns · tablet (700–1199px) left sidebar · phone (<700px) bottom tab bar with a Menu sheet.

**Where to Stay (VRBO):** edit `public/stays.json`. Add featured listings (title, url, image, area, sleeps, priceFrom) and, if you join the Expedia Group affiliate programme, your `affiliateId`. Update the `fair` dates each year.

**Archive submissions:** run `npx wrangler r2 bucket create kingpuck-archive`, uncomment the `[[r2_buckets]]` block in `wrangler.toml`, then add the R2 binding `ARCHIVE` to the Pages project. Submissions land in `submissions/<id>/` for review.

## Run locally

```sh
npm install
cp .dev.vars.example .dev.vars   # add your Stripe *test* keys
npm run dev                      # http://localhost:8788
npm test
```

Use Stripe test card `4242 4242 4242 4242` with any future date and any CVC.

## Go live on kingpuck.com

1. **Stripe:** create an account at stripe.com and copy your secret key (Developers → API keys).
2. **Deploy:** `npx wrangler login`, then `npm run deploy`. The first run creates the `kingpuck` Pages project.
3. **Secrets:** in the Cloudflare dashboard → Workers & Pages → kingpuck → Settings → Variables and secrets, add:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET` (see step 5)
4. **Domain:** in the Pages project → Custom domains, add `kingpuck.com` and `www.kingpuck.com`. If the domain's DNS is already on Cloudflare, this takes one click.
5. **Order webhook:** in Stripe → Developers → Webhooks, add the endpoint `https://kingpuck.com/api/stripe-webhook` for the event `checkout.session.completed`, then copy its signing secret into `STRIPE_WEBHOOK_SECRET`.
6. **Order log (optional):** run `npx wrangler kv namespace create ORDERS`, then uncomment the block in `wrangler.toml` and paste in the id. Paid orders will also be saved there. Stripe's dashboard always lists every order either way.
7. **Password (optional, e.g. before launch):** add a secret `SITE_PASSWORD`, then redeploy. Every page then asks for it (any username works). Delete the secret and redeploy to open the site. The Stripe webhook is never blocked.

Until `STRIPE_SECRET_KEY` is set, the site works fully but checkout shows "The shop isn't taking orders just yet".

## Sign in (magic links)

Customers sign in with a one-time email link: no passwords. The account page lists their orders and archive submissions, and checkout pre-fills their email.

1. `npx wrangler kv namespace create AUTH`, paste the id into the `AUTH` block in `wrangler.toml` and uncomment it (or add a KV binding named `AUTH` to the Pages project).
2. Create a free account at resend.com, verify the kingpuck.com domain, and add the secret `RESEND_API_KEY` (and optionally `EMAIL_FROM`, e.g. `King Puck <hello@kingpuck.com>`).

Until both are set, the "Sign in" link stays hidden. For local testing, put `DEV_LOG_MAGIC_LINKS=true` in `.dev.vars` and run `npx wrangler pages dev --kv AUTH --r2 ARCHIVE`: sign-in links are printed to the console instead of emailed.

## Storybook (design system)

```sh
npm run storybook        # http://localhost:6006
npm run build-storybook  # static build in storybook-static/
```

- **Foundations:** colour, typography, spacing (space / gap / stack / inset), borders, radius, shadow, motion, layout and layers. Read live from `public/tokens.css`.
- **Layout:** `.stack`, `.cluster`, `.grid-auto`, `.split`.
- **Components, Sections, Navigation, Commerce, Forms:** every building block, with the homepage sections read straight from `src/pages/index.html`.
- **Pages:** every page with the shared layout. Use the viewport toolbar (Phone · Tablet · Desktop) to see the bottom bar, sidebar and masthead.

To publish it, create a second Cloudflare Pages project from this repo with build command `npm run build-storybook` and output directory `storybook-static`.

## Editing products

Edit `functions/_lib/catalog.js`. Prices are in cents (`2800` = €28.00). `variants` lists sizes or options, and `variantPrices` overrides the price for a specific option. Put product photos in `public/img/products/` and update `image`. The current images are placeholder illustrations.

## Before launch

- [ ] Fact-check the history page (`public/history.html`) with local sources or the Puck Fair committee. The legends are written as legends, but dates and details should be verified.
- [ ] Replace the placeholder product art with real photos.
- [ ] Decide on fulfilment: ship it yourself, or use print-on-demand (Printful/Gelato) for tees and posters. Print-on-demand can be wired into the webhook later.
- [ ] Check whether "Puck Fair" is a registered trademark before selling merchandise that carries the name.
- [ ] Add shipping/returns and privacy pages. They're required for EU consumer sales.
- [ ] Set up `hello@` and `stories@kingpuck.com`. Cloudflare Email Routing is free.
