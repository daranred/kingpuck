# King Puck — to-do

Everything still open for kingpuck.com, in rough order. Tick items off (`- [x]`) as they're done; steps for each are in the README.

## Domain
- [ ] In Cloudflare → kingpuck.com → DNS → Records, delete the old `A` record pointing to `67.205.6.99`.
- [ ] In Workers & Pages → kingpuck → Custom domains, add `kingpuck.com` and `www.kingpuck.com`, and wait for both to show **Active**.
- [ ] SSL/TLS: set the mode to **Full** and turn on **Always Use HTTPS**.
- [ ] Optional: redirect `www.kingpuck.com` to `kingpuck.com` (Rules → Redirect Rules).
- [ ] Optional: password-protect the site until launch: add the `SITE_PASSWORD` secret in Cloudflare (branded password screen is built), and remove it at launch.

## Payments (Stripe)
- [ ] Activate the Stripe account (identity and business details, Irish or EU bank account).
- [ ] Add the secret `STRIPE_SECRET_KEY` in Cloudflare.
- [ ] In Stripe → Webhooks, add `https://kingpuck.com/api/stripe-webhook` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`, then add its signing secret as `STRIPE_WEBHOOK_SECRET`.
- [ ] Retry the latest deployment so the new secrets apply, then test a purchase with card `4242 4242 4242 4242` in test mode.

## Accounts, orders and submissions
- [ ] Create the `ORDERS` KV namespace and bind it (order log).
- [ ] Create the `AUTH` KV namespace and bind it (sign-in and account page).
- [ ] Create a Resend account, verify kingpuck.com, and add `RESEND_API_KEY` (sign-in emails).
- [ ] Create the `kingpuck-archive` R2 bucket and bind it as `ARCHIVE` (photo and story submissions).
- [ ] Set up `hello@` and `stories@kingpuck.com` with Cloudflare Email Routing.

## Printing and shipping (Printful), on hold
The code is deployed and switched off until `PRINTFUL_API_KEY` is set.
- [ ] Create a Printful account with a **Manual order / API** store, and add the products with their artwork.
- [ ] Add the secret `PRINTFUL_API_KEY` (and `PRINTFUL_STORE_ID` if there's more than one store), then retry the deployment.
- [ ] Run `npm run printful-variants` and add each product's ids to `functions/_lib/catalog.js` (or send them to Claude to add).
- [ ] Compare Printful's production and shipping costs with the shop's prices: €5 Ireland, €15 international, free over €75. Check US orders especially.
- [ ] Review the first orders as drafts; once happy, set `PRINTFUL_AUTO_CONFIRM` to `true`.
- [ ] Decide how to fulfil what Printful can't make: books (e.g. Lulu), enamel pins and patches (a batch from a pin maker), signed editions.

## Content
- [ ] Replace the placeholder product art with real product photos.
- [ ] Fill the empty photo slots with real archive photographs: the Then side of Then / Now, the Archive and Queen Puck galleries, the people and story cards, the music plate on The Fair. The blurry scene art that used to fill them is in `dont-use/`.
- [ ] Ask Killorglin Archives (killorglinarchives.com) whether and on what terms their photographs can be used. The site blocks automated reading, so open it in a browser.
- [ ] Larger originals of the page-header banners in `public/img/heroes` (about 2000×450 now; fine as short bands, too soft for anything taller).
- [x] Check the history against puckfair.ie (done 4 October 2026; see `docs/research/puck-fair.md`).
- [ ] Settle the 1613 document with the committee or the Patent Rolls: charter from James I (puckfair.ie/history) or patent from the Irish Parliament (Tom Doyle's chronology)? And confirm the spelling of Seán Moraghan's name against his 2013 book.
- [ ] Each year: refresh the programme fixed points on The Fair page from puckfair.ie.

## Legal (before selling)
- [ ] Add shipping and returns, and privacy pages. They're required for EU consumer sales.
- [ ] Check whether "Puck Fair" is a registered trademark before selling merchandise that carries the name.
