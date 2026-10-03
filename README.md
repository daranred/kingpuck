# KingPuck.com

A site celebrating the history of Puck Fair (Killorglin, Co. Kerry), with an online shop.

- **Hosting:** Cloudflare Pages (static files in `public/`)
- **API:** Cloudflare Pages Functions (`functions/api/`)
- **Payments:** Stripe Checkout (cards, Apple Pay and Google Pay, promo codes, shipping address)
- **Products:** `functions/_lib/catalog.json`, the single source of truth. The browser only sends product ids and quantities; prices are always looked up on the server.

```
public/            index, history, shop, success, 404, styles.css, app.js, img/
functions/api/     products.js (GET), checkout.js (POST), stripe-webhook.js (POST)
functions/_lib/    catalog.json, cart.js, stripe.js
test/              node --test unit tests
```

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

Until `STRIPE_SECRET_KEY` is set, the site works fully but checkout shows "The shop isn't taking orders just yet".

## Editing products

Edit `functions/_lib/catalog.json`. Prices are in cents (`2800` = €28.00). `variants` lists sizes or options, and `variantPrices` overrides the price for a specific option. Put product photos in `public/img/products/` and update `image`. The current images are placeholder illustrations.

## Before launch

- [ ] Fact-check the history page (`public/history.html`) with local sources or the Puck Fair committee. The legends are written as legends, but dates and details should be verified.
- [ ] Replace the placeholder product art with real photos.
- [ ] Decide on fulfilment: ship it yourself, or use print-on-demand (Printful/Gelato) for tees and posters. Print-on-demand can be wired into the webhook later.
- [ ] Check whether "Puck Fair" is a registered trademark before selling merchandise that carries the name.
- [ ] Add shipping/returns and privacy pages. They're required for EU consumer sales.
- [ ] Set up `hello@` and `stories@kingpuck.com`. Cloudflare Email Routing is free.
