# Handoff: KingPuck.com

Written 4 October 2026 at the end of a long session. Read this, `CLAUDE.md`, `TODO.md` and `docs/research/puck-fair.md` before doing anything. The working tree is clean; everything below is on `main`, which Cloudflare Pages deploys automatically (`kingpuck.pages.dev`).

## The owner's direction (most recent first; these override older decisions)

1. **Puck Fair is the main story. King Puck and Queen Puck are its characters, secondary to it.** "King Puck" is just the domain. The site's hierarchy, home page, nav order and copy should lead with the fair (the town, the three days, the history) and present the King and Queen as characters within it. This has NOT been applied yet; it is the first thing to do and it changes the plan in section 3.
2. Use common modern web patterns for navigation, timelines and the rest of the UI, for responsive design.
3. Simplify the architecture, but **keep every image** and find places to use them (56 are currently unreferenced; list in `docs/unused-images.txt`).
4. Scrape https://puckfair.ie (timeline, information, history, home) and incorporate it into the sections with links back for reference. The owner asked to use the Chrome MCP for this. Neither was possible from the cloud session: `puckfair.ie` is blocked by the environment's network policy, and Claude in Chrome isn't connected to a cloud session. **Do this from a local session with Claude in Chrome, or ask the owner to allow `puckfair.ie` under Network access in the cloud environment settings.** Every claim already on the site is labelled Documented / Tradition / Legend / Unknown; keep that, and add puckfair.ie links to the Sources section on the History page and to the research file.

## What was agreed and not yet done

The owner approved these in the last session (apart from deleting images, which they refused):

- **Consolidate the navigation into one component.** Today there are three: desktop top bar with anchor dropdowns, a tablet left sidebar (700–1199px), and a phone top bar + bottom tab bar + menu sheet. Plan: one nav; inline list ≥1000px, menu sheet below, bottom bar on phones; drop the sidebar and the dropdowns; show the on-page section strip at every size (horizontal scroll); add a "Share your story" button to the header. `tools/consolidate-nav.py` is a prepared, **unrun** script that does all of this plus the renames below. Re-read it against the current files before running it; it asserts on exact strings and will stop if the files have moved on. Now that the fair comes first, change the nav order in `src/site.mjs` to: The Fair · History · King Puck · Queen Puck · Archive · Stories · Shop.
- **Rename** "The Story" → "History" and "Puck Fair" → "The Fair" (URLs `/story` and `/puck-fair` stay). Given direction 1, consider making `/puck-fair` the richest page and the home page's main call to action.
- **One canonical three-days section** on The Fair page (with the add-to-calendar buttons from `src/calendar.mjs`). Home keeps its three cards as a teaser linking there; History links there instead of repeating it. The script removes the History copy.
- **Modern timeline**: replace `.timeline` (two-column rows) with a vertical line and markers, the evidence tag on the marker, entries as cards; and the five "dots" strip on the home page with the same component or a horizontal scroller. Galleries: one responsive grid with captions for King, Queen, Archive and Stories (today `.wall` is a 6-column grid with placeholders).
- **Place the images.** 56 unused: `public/img/scenes/scene-*.jpg` (50 grid cut-outs that carry a sliver of the neighbouring image on the left/bottom and a number badge bottom-left; crop box `(8%, 2%) → (97%, 80%)` cleans them), plus `town-bridge`, `crown-eye-closeup`, `crowned-portrait`, `puck-fair-banner-street`, `robe-detail`, `sepia-two-men-and-goat`, `signpost-killorglin`, `sunset-over-town`. Empty slots that want them: Archive gallery (9), Queen Puck gallery (9), home royal cards (Queen, The people), Stories portraits. The sepia/engraving scenes stand in for archive photographs and must carry the "Illustration" tag (`.tag.illustration`, see `.illustration-note` on the home page).
- Then: update Storybook's navigation story, README, CLAUDE.md; tests, build, screenshots at 1400 / 900 / 390px; push.

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
