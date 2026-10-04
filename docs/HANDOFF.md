# Handoff: KingPuck.com

Written 4 October 2026 at the end of a long session. Read this, `CLAUDE.md`, `TODO.md` and `docs/research/puck-fair.md` before doing anything. The working tree is clean; everything below is on `main`, which Cloudflare Pages deploys automatically (`kingpuck.pages.dev`).

## The owner's direction (most recent first; these override older decisions)

1. **Puck Fair is the main story. King Puck and Queen Puck are its characters, secondary to it.** "King Puck" is just the domain. The site's hierarchy, home page, nav order and copy should lead with the fair (the town, the three days, the history) and present the King and Queen as characters within it. This has NOT been applied yet; it is the first thing to do and it changes the plan in section 3.
2. Use common modern web patterns for navigation, timelines and the rest of the UI, for responsive design.
3. Simplify the architecture. (Superseded on 4 October 2026: the owner then asked for **all blurry images to be removed**. They live in `dont-use/` at the repo root, outside `public/`, with the measurements in `dont-use/README.md`. Nothing in `src/` may reference them.)
4. Scrape https://puckfair.ie (timeline, information, history, home) and incorporate it into the sections with links back for reference. The owner asked to use the Chrome MCP for this. Neither was possible from the cloud session: `puckfair.ie` is blocked by the environment's network policy, and Claude in Chrome isn't connected to a cloud session. **Do this from a local session with Claude in Chrome, or ask the owner to allow `puckfair.ie` under Network access in the cloud environment settings.** Every claim already on the site is labelled Documented / Tradition / Legend / Unknown; keep that, and add puckfair.ie links to the Sources section on the History page and to the research file.

## Done since the handoff was written (all on `main`)

- One navigation component (`tools/consolidate-nav.py` has been run; keep it only as a record). The Fair leads: The Fair · History · King Puck · Queen Puck · Archive · Stories · Shop. Support and About are in the menu sheet and footer; the red Share your story button is always in the header. Section index at every size.
- Renames: The Story → History, Puck Fair → The Fair (URLs unchanged). The three days live only on The Fair page; History links there.
- Modern timeline (`.timeline`: line, evidence-coloured markers, card entries) on History; the same cards as a horizontal snap strip (`.timeline-strip`) on the home page.
- One captioned gallery grid (`.gallery`) on Archive, Queen Puck, King Puck and a Killorglin gallery on The Fair. Every image in `public/img` is now referenced; scene cut-outs use cleaned `-c.jpg` crops (originals kept). Art that stands in for archive photographs carries the Illustration tag.
- Puck Fair reframed as the main story: home hero is "Puck Fair"; "The Characters of the Fair" presents King, Queen and the people; page titles, leads and the footer follow.
- **puckfair.ie crawled and folded in** (4 October 2026; the network policy now allows it). All eight pages are summarised in `docs/research/puck-fair.md`. The History page carries the full chronology in our own words, credited to **Tom Doyle** ("Puck Fair: A Chronology", puckfair.ie/timeline) with links back; The Fair page has the 2026 programme fixed points, the 72-hour tradition, *An Poc ar Buile*, parking and the shuttle; King Puck has the organisers' welfare statement; Queen Puck has how the Queen is chosen (primary schools, Lady in Waiting, her own coronation a month before). The organisers name the current Queen on puckfair.ie/history; the site links there rather than naming a child without her family's permission. Official merchandise (Casey Collections) is linked from The Fair and the Shop.
- **Blurry images moved to `dont-use/`**: every scene cut-out and crop, the 13 small named scenes and the old support banner (all measured under 0.004 Laplacian std-dev at 800px, against 0.011+ for the King photos). Pages now use the twelve King Puck photographs and the honest `.ph-photo` placeholder. The home hero is `img/king/crowd.jpg` (1620×1288) instead of the 447px-tall banner.
- Header: the section index is sticky under the masthead on every page; account, cart and menu are one style of 44px icon button with a round cart badge (hidden at zero); the Share your story button has no icon and reads "Share" on phones.

## Still open

- **Killorglin Archives** (https://www.killorglinarchives.com/-/archive/all-images/page/2): the owner asked whether their photographs can be used. The site sits behind a JavaScript bot check, so it could not be read from the cloud. Open it in a local browser, look for a rights or terms page, and in any case ask the archive in writing before using anything.
- The `.ph-photo` placeholders (Queen gallery, Archive gallery, Stories portraits, the Then side of Then/Now, the music plate on The Fair) wait for real photographs.
- Replace placeholder product art; the setup items in `TODO.md`.

## How the site works

- `src/pages/*.html` are page bodies with a JSON header comment; `src/layout.mjs` wraps them (header, footer, cart drawer, section index); `src/site.mjs` is the hierarchy that drives all navigation; `tools/build.mjs` writes `public/`. Commit `src/` and `public/` together.
- `public/tokens.css` holds every design value (colours, type, spacing, `--control-height` 48px, `--scrim-side` photo gradient, `--radius-control` 8px). `public/styles.css` is components. Nothing smaller than 14px; no all-caps except the wordmark; headings in Title Case; focus rings navy, red only for errors; every control 48px, tap targets ≥44px.
- `functions/` are Cloudflare Pages Functions: Stripe checkout and webhook, Printful (dormant until `PRINTFUL_API_KEY`), magic-link auth, archive submissions, a site-wide password gate (`SITE_PASSWORD`). `functions/_lib/catalog.js` is the product source of truth.
- `<!-- calendar:id -->` in a page expands to an add-to-calendar menu; `.ics` files build into `public/cal/`.
- `npm test` (19 tests) must pass; `npm run build`; `npm run build-storybook` should still compile. The Pages build uses Wrangler 3.114, which rejects JSON import attributes.
- Verify in a browser: `npx wrangler pages dev public --port 8799`, then Playwright with `executablePath: "/opt/pw-browsers/chromium"` (cloud) or a local Chromium. Google Fonts are blocked in the cloud, so screenshots there show fallback fonts.

## Also known

- Another Claude session has pushed to `main` several times in parallel (dark chrome, scene library, high-res section banners, 40px buttons). Always `git fetch origin main` and rebase before pushing; conflicts have been in `src/pages/*.html` image lines.
- Photos: `public/img/king` (12 King Puck and town photos, upscaled 4× with Real-ESRGAN; the only sharp set), `public/img/heroes` (per-page header banners, about 2000×450, fine as short bands but too soft for a tall hero), `public/img/posters` (366px wide; sharp but small), `public/img/products` (placeholder art, to be replaced). `dont-use/` holds the rejected images.
- Printful: wired but on hold. Steps in README "Printing and shipping".
- Open setup items (domain, Stripe secrets, KV/R2 bindings, email) are in `TODO.md`.
