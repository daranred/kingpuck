# Handoff: KingPuck.com

Written 4 October 2026 at the end of a long session. Read this, `CLAUDE.md`, `TODO.md` and `docs/research/puck-fair.md` before doing anything. The working tree is clean; everything below is on `main`, which Cloudflare Pages deploys automatically (`kingpuck.pages.dev`).

## The owner's direction (most recent first; these override older decisions)

1. **Puck Fair is the main story. King Puck and Queen Puck are its characters, secondary to it.** "King Puck" is just the domain. The site's hierarchy, home page, nav order and copy should lead with the fair (the town, the three days, the history) and present the King and Queen as characters within it. This has NOT been applied yet; it is the first thing to do and it changes the plan in section 3.
2. Use common modern web patterns for navigation, timelines and the rest of the UI, for responsive design.
3. Simplify the architecture, but **keep every image** and find places to use them (56 are currently unreferenced; list in `docs/unused-images.txt`).
4. Scrape https://puckfair.ie (timeline, information, history, home) and incorporate it into the sections with links back for reference. The owner asked to use the Chrome MCP for this. Neither was possible from the cloud session: `puckfair.ie` is blocked by the environment's network policy, and Claude in Chrome isn't connected to a cloud session. **Do this from a local session with Claude in Chrome, or ask the owner to allow `puckfair.ie` under Network access in the cloud environment settings.** Every claim already on the site is labelled Documented / Tradition / Legend / Unknown; keep that, and add puckfair.ie links to the Sources section on the History page and to the research file.

## Done since the handoff was written (all on `main`)

- One navigation component (`tools/consolidate-nav.py` has been run; keep it only as a record). The Fair leads: The Fair · History · King Puck · Queen Puck · Archive · Stories · Shop. Support and About are in the menu sheet and footer; the red Share your story button is always in the header. Section index at every size.
- Renames: The Story → History, Puck Fair → The Fair (URLs unchanged). The three days live only on The Fair page; History links there.
- Modern timeline (`.timeline`: line, evidence-coloured markers, card entries) on History; the same cards as a horizontal snap strip (`.timeline-strip`) on the home page.
- One captioned gallery grid (`.gallery`) on Archive, Queen Puck, King Puck and a Killorglin gallery on The Fair. Every image in `public/img` is now referenced; scene cut-outs use cleaned `-c.jpg` crops (originals kept). Art that stands in for archive photographs carries the Illustration tag.
- Puck Fair reframed as the main story: home hero is "Puck Fair" with the fair banner photo; "The Characters of the Fair" presents King, Queen and the people; page titles, leads and the footer follow.

## Still open

- **puckfair.ie scrape with links back** (direction 4 above). Blocked from the cloud environment; needs a local session with Claude in Chrome, or `puckfair.ie` allowed in the cloud environment's Network access. Add findings and links to `docs/research/puck-fair.md` and the Sources section on History.
- Replace placeholder product art; the setup items in `TODO.md`.

## How the site works

- `src/pages/*.html` are page bodies with a JSON header comment; `src/layout.mjs` wraps them (header, footer, cart drawer, section index); `src/site.mjs` is the hierarchy that drives all navigation; `tools/build.mjs` writes `public/`. Commit `src/` and `public/` together.
- `public/tokens.css` holds every design value (colours, type, spacing, `--control-height` 40px, `--scrim-side` photo gradient, `--radius-control` 8px). `public/styles.css` is components. Nothing smaller than 14px; no all-caps except the wordmark; headings in Title Case; focus rings navy, red only for errors; every control ≥40px, tap targets ≥44px.
- `functions/` are Cloudflare Pages Functions: Stripe checkout and webhook, Printful (dormant until `PRINTFUL_API_KEY`), magic-link auth, archive submissions, a site-wide password gate (`SITE_PASSWORD`). `functions/_lib/catalog.js` is the product source of truth.
- `<!-- calendar:id -->` in a page expands to an add-to-calendar menu; `.ics` files build into `public/cal/`.
- `npm test` (19 tests) must pass; `npm run build`; `npm run build-storybook` should still compile. The Pages build uses Wrangler 3.114, which rejects JSON import attributes.
- Verify in a browser: `npx wrangler pages dev public --port 8799`, then Playwright with `executablePath: "/opt/pw-browsers/chromium"` (cloud) or a local Chromium. Google Fonts are blocked in the cloud, so screenshots there show fallback fonts.

## Also known

- Another Claude session has pushed to `main` several times in parallel (dark chrome, scene library, high-res section banners, 40px buttons). Always `git fetch origin main` and rebase before pushing; conflicts have been in `src/pages/*.html` image lines.
- Photos: `public/img/king` (10 King Puck photos, upscaled 4× with Real-ESRGAN), `public/img/heroes` (per-page header banners), `public/img/posters`, `public/img/products` (placeholder art, to be replaced).
- Printful: wired but on hold. Steps in README "Printing and shipping".
- Open setup items (domain, Stripe secrets, KV/R2 bindings, email) are in `TODO.md`.
