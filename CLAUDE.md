# KingPuck.com

The living archive of Puck Fair (Killorglin, County Kerry). Static pages on Cloudflare Pages with Pages Functions for the shop and accounts. Setup and deployment: `README.md`. Open work: `TODO.md`.

## Working on the site

- Edit pages in `src/pages/*.html`, then `npm run build` to regenerate `public/`. Commit both.
- Shared design values live in `public/tokens.css`; components in `public/styles.css`. Storybook documents them.
- `npm test` must pass before pushing. The site deploys from `main`.

## Puck Fair history

Research notes, sources and how each claim is labelled: `docs/research/puck-fair.md`. Read it before writing or changing any history or story copy.

- Every historical claim carries one of four labels: Documented, Tradition, Legend, Unknown. Never present a legend or theory as fact.
- There is no single verified origin story. 1613 is the earliest documented date, not the founding date. The Cromwell goat story is a legend.
- Add new findings and their sources to the research file.
