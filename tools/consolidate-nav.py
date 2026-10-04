# Prepared but NOT yet run. Consolidates the three navigations into one (see docs/HANDOFF.md). Run from the repo root: python3 tools/consolidate-nav.py, then npm run build and check every breakpoint.
import re
R = "/home/user/kingpuck/"

def edit(p, pairs):
    s = open(R + p).read()
    for a, b in pairs:
        assert s.count(a) == 1, (p, a[:70], s.count(a))
        s = s.replace(a, b)
    open(R + p, "w").write(s)

# ---------- site.mjs: labels, trimmed icons, no sectionIcon ----------
s = open(R + "src/site.mjs").read()
s = s.replace('// Site hierarchy. Drives the header menus, the footer sitemap and each page\'s section index.',
              '// Site hierarchy. Drives the one nav (masthead, menu sheet, bottom bar), the footer sitemap and each page\'s section index.')
s = s.replace('{ href: "/story", label: "The Story", children: [\n    ["what-is-puck-fair", "What Is Puck Fair?"], ["history", "History"], ["why-a-goat", "Why a Goat?"],\n    ["legend", "Legend"], ["three-days", "The Three Days"] ] },',
              '{ href: "/story", label: "History", children: [\n    ["what-is-puck-fair", "What Is Puck Fair?"], ["history", "Timeline"], ["why-a-goat", "Why a Goat?"],\n    ["legend", "The Legend"], ["sources", "Sources"] ] },')
s = s.replace('{ href: "/puck-fair", label: "Puck Fair", children: [', '{ href: "/puck-fair", label: "The Fair", children: [')
s = s.replace('{ href: "/archive", label: "The Archive", children: [', '{ href: "/archive", label: "Archive", children: [')
i = s.index("// Line icons"); j = s.index("// Bottom bar on phones")
s = s[:i] + '''// Line icons (24×24, stroke = currentColor) for the masthead buttons and the bottom bar.
export const icons = {
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  story: '<path d="M4 5h6a3 3 0 013 3v12a2 2 0 00-2-2H4z"/><path d="M20 5h-6a3 3 0 00-3 3v12a2 2 0 012-2h7z"/>',
  archive: '<rect x="3" y="4" width="18" height="5"/><path d="M5 9v11h14V9"/><path d="M10 13h4"/>',
  shop: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 016 0v2"/>',
  support: '<path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  cart: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 016 0v2"/>',
};
''' + s[j:]
s = s.replace('["/story", "Story", "story"]', '["/story", "History", "story"]')
open(R + "src/site.mjs", "w").write(s)

# ---------- layout.mjs: one nav ----------
s = open(R + "src/layout.mjs").read()
s = s.replace('import { sections, childHref, icons, sectionIcon, tabs } from "./site.mjs";\n\n// Support and About live in the footer only; the header and sidebar skip them.\nconst navSections = sections.filter((s) => !s.footerOnly);\nimport { expandCalendars } from "./calendar.mjs";',
              'import { sections, childHref, icons, tabs } from "./site.mjs";\nimport { expandCalendars } from "./calendar.mjs";\n\n// Support and About are reached from the header button, the menu sheet and the footer, not the main list.\nconst primary = sections.filter((s) => !s.footerOnly);\nconst secondary = sections.filter((s) => s.footerOnly);')
i = s.index("const shortLabel"); j = s.index("export function sectionIndex")
s = s[:i] + '''const navItem = (s, current) => `
        <li class="nav-item${s.href === current ? " is-current" : ""}"><a href="${s.href}"${s.href === current ? ' aria-current="page"' : ""}>${esc(s.label)}</a></li>`;

/* The one navigation. Inline in the masthead from 1000px; below that the list becomes a menu sheet
   opened by the Menu button (in the masthead on tablets, in the bottom bar on phones). */
export function header(current) {
  return `<header class="masthead">
  <div class="wrap masthead-top">
    <a class="wordmark" href="/" aria-label="King Puck home"><img src="/img/emblem.svg" alt="" width="30" height="30"><span>King Puck</span></a>
    <nav class="site-nav" id="site-nav" aria-label="Main">
      <ul class="nav-list">${primary.map((s) => navItem(s, current)).join("")}
      </ul>
      <ul class="nav-list nav-more">${secondary.map((s) => navItem(s, current)).join("")}
      </ul>
    </nav>
    <div class="masthead-actions">
      <a class="btn red share-btn" href="/support#submit" aria-label="Share your story">${icon("support")}<span>Share your story</span></a>
      <a class="account-btn" href="/login" data-account-link aria-label="Sign in">${icon("user")}<span data-account-label>Sign in</span></a>
      <button class="cart-btn" type="button" data-open-cart aria-label="Cart, 0 items">${icon("cart")}<span data-cart-count>0</span></button>
      <button class="menu-btn" type="button" data-menu aria-controls="site-nav" aria-expanded="false" aria-label="Menu">${icon("menu")}</button>
    </div>
  </div>
</header>`;
}

/* Phone bottom bar (<700px): four destinations plus Menu, which opens the same sheet. */
export function tabbar(current) {
  const tab = ([href, label, ic]) => {
    const on = href === "/" ? !current : href === current;
    return `<a class="tab${on ? " is-current" : ""}" href="${href}"${on ? ' aria-current="page"' : ""}>${icon(ic)}<span>${label}</span></a>`;
  };
  return `<nav class="tabbar" aria-label="Quick navigation">
  ${tabs.map(tab).join("\\n  ")}
  <button class="tab" type="button" data-menu aria-controls="site-nav" aria-expanded="false">${icon("menu")}<span>Menu</span></button>
</nav>`;
}

''' + s[j:]
s = s.replace('export const chrome = (section, body) => `${header(section)}\n${sidebar(section)}\n<div class="page">', 'export const chrome = (section, body) => `${header(section)}\n<div class="page">')
open(R + "src/layout.mjs", "w").write(s)

# ---------- styles.css: masthead → section index block ----------
s = open(R + "public/styles.css").read()
i = s.index("/* ---------- Masthead ---------- */"); j = s.index("/* ---------- Bands ---------- */")
s = s[:i] + '''/* ---------- Masthead: the one navigation ----------
   ≥1000px: inline list. Below: the list is a sheet opened by the Menu button (masthead on tablets,
   bottom bar on phones). One markup, restyled per width. */
.masthead { --masthead-bg: var(--color-chrome); position: sticky; top: 0; z-index: var(--z-header); background: var(--masthead-bg); color: var(--color-card); border-bottom: var(--border-divider-chrome); }
.masthead-top { display: flex; align-items: center; gap: var(--gap-md); height: var(--header-height); }
.wordmark { display: flex; align-items: center; gap: var(--gap-xs); text-decoration: none; font: var(--weight-regular) 1.9rem/1 var(--font-display); text-transform: uppercase; letter-spacing: var(--tracking-wide); white-space: nowrap; }
.wordmark img { width: 30px; height: 30px; }
.site-nav { margin-left: auto; }
.nav-list { list-style: none; margin: 0; padding: 0; display: flex; gap: clamp(var(--gap-2xs), 0.6vw, var(--gap-xs)); }
.nav-more { display: none; }
.nav-item > a { display: block; white-space: nowrap; padding: var(--space-5) var(--space-3); text-decoration: none; font: var(--weight-semibold) var(--text-sm)/1 var(--font-sans); opacity: 0.8; border-bottom: var(--border-width-thick) solid transparent; }
.nav-item > a:hover, .nav-item.is-current > a { opacity: 1; border-bottom-color: var(--color-red); }
.masthead-actions { display: flex; align-items: center; gap: var(--gap-xs); }
.share-btn { padding-inline: var(--space-4); }
.share-btn .icon { width: 18px; height: 18px; }
.cart-btn, .menu-btn { min-height: var(--control-height); min-width: var(--control-height); background: none; border: var(--border-width-hair) solid currentColor; border-radius: var(--radius-control); color: inherit; padding: 0 var(--space-4); font: var(--weight-semibold) var(--text-sm)/1 var(--font-sans); white-space: nowrap; cursor: pointer; }
.cart-btn span { display: inline-block; border-radius: var(--radius-badge); min-width: 1.4em; margin-left: var(--space-1); padding: 0 var(--space-1); background: var(--color-red); color: var(--color-card); }
.menu-btn { display: none; padding: 0; }
.icon { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; flex: none; }
.tabbar { display: none; }

/* Below 1000px the list becomes a full-height sheet under the masthead. */
@media (max-width: 999px) {
  .masthead-top { justify-content: space-between; }
  .site-nav { display: none; position: fixed; inset: var(--header-height) 0 0 0; z-index: var(--z-nav); overflow-y: auto; background: var(--masthead-bg); padding: var(--space-3) var(--gutter) var(--space-7); }
  .masthead.menu-open .site-nav { display: block; }
  body.menu-open { overflow: hidden; }
  .nav-list { flex-direction: column; gap: 0; }
  .nav-more { display: flex; margin-top: var(--stack-lg); padding-top: var(--space-2); border-top: var(--border-divider-chrome); }
  .nav-item { border-bottom: var(--border-divider-chrome); }
  .nav-item > a { padding: var(--space-4) 0; font-size: var(--text-md); border: 0; opacity: 1; }
  .nav-item.is-current > a { color: var(--color-gold-2); }
  .menu-btn { display: inline-flex; align-items: center; justify-content: center; }
}

/* Phones: 56px bar, the sheet sits between it and the bottom tab bar, whose Menu replaces the masthead's. */
@media (max-width: 699px) {
  body { padding-bottom: calc(var(--tabbar-height) + env(safe-area-inset-bottom)); }
  .masthead-top { height: 56px; }
  .wordmark { font-size: 1.5rem; }
  .site-nav { inset: 56px 0 calc(var(--tabbar-height) + env(safe-area-inset-bottom)) 0; }
  .menu-btn { display: none; }
  .share-btn { padding: 0; min-width: var(--control-height); }
  .share-btn span { display: none; }
  .tabbar { display: grid; grid-template-columns: repeat(5, 1fr); position: fixed; left: 0; right: 0; bottom: 0; z-index: var(--z-nav); height: calc(var(--tabbar-height) + env(safe-area-inset-bottom)); padding-bottom: env(safe-area-inset-bottom); background: var(--color-chrome); border-top: var(--border-divider-chrome); }
  .tab { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--gap-2xs); background: none; border: 0; color: var(--color-night-muted); text-decoration: none; font: var(--weight-semibold) var(--text-sm) var(--font-sans); letter-spacing: var(--tracking-wide); cursor: pointer; position: relative; }
  .tab.is-current, .tab[aria-expanded="true"] { color: var(--color-card); }
  .tab.is-current::before { content: ""; position: absolute; top: 0; left: 30%; right: 30%; border-top: var(--border-accent); }
  .hero { min-height: calc(100svh - 56px - var(--tabbar-height)); }
}

/* ---------- Section index: on-page navigation at every size (scrolls sideways when it must) ---------- */
.section-index { border-bottom: var(--border-divider); background: var(--color-paper); }
.section-index .wrap { display: flex; align-items: center; gap: var(--gap-lg); padding: var(--space-2) 0; overflow-x: auto; scrollbar-width: none; }
.section-index .wrap::-webkit-scrollbar { display: none; }
.section-index span { flex: none; font: var(--weight-semibold) var(--text-sm) var(--font-sans); color: var(--color-muted); }
.section-index a { flex: none; display: inline-flex; align-items: center; min-height: var(--target-min); font: var(--text-sm) var(--font-sans); text-decoration: none; color: var(--color-ink-2); border-bottom: var(--border-width-thick) solid transparent; }
.section-index a:hover { color: var(--color-ink); border-bottom-color: var(--color-red); }

''' + s[j:]
s = s.replace('.side-account { display: flex; align-items: center; gap: var(--gap-sm); margin-top: auto; min-height: var(--target-min); padding: 0 var(--space-2); text-decoration: none; color: var(--color-night-text); font: var(--weight-semibold) var(--text-sm) var(--font-sans); }\n.side-account:hover { color: var(--color-card); }\n.side-account + .side-cart { margin-top: 0; }\n', '')
s = s.replace('@media (max-width: 699px) { .masthead .nav-item { border-bottom: var(--border-divider-chrome); } }\n', '')
assert ".side-" not in s and ".sidebar" not in s and ".nav-sub" not in s and "sheet-title" not in s
open(R + "public/styles.css", "w").write(s)

# ---------- tokens.css ----------
edit("public/tokens.css", [
    ("  --sidebar-width: 236px;\n", ""),
    ("  /* Breakpoints (for reference; media queries can't read variables):\n     phone < 700px  → top bar + bottom tab bar\n     tablet 700–1199px → left sidebar\n     desktop ≥ 1200px → top masthead with dropdowns */",
     "  /* Breakpoints (for reference; media queries can't read variables):\n     < 700px   → 56px top bar + bottom tab bar; nav in the menu sheet\n     < 1000px  → nav in the menu sheet, opened from the masthead\n     ≥ 1000px  → inline nav in the masthead */"),
    ("  /* Color — chrome: header, sidebar, bottom bar and footer share one dark grey. */", "  /* Color — chrome: header, menu sheet, bottom bar and footer share one colour. */"),
    ("blue-black: header, sidebar, tab bar, footer.", "blue-black: header, sheet, tab bar, footer."),
])

# ---------- History page: rename, drop the duplicated three days ----------
s = open(R + "src/pages/story.html").read()
s = s.replace('"title": "The Story — King Puck"', '"title": "History — King Puck"')
s = s.replace('<p class="crumbs"><a href="/">Home</a> / The Story</p>\n    <h1>The Story</h1>', '<p class="crumbs"><a href="/">Home</a> / History</p>\n    <h1>History</h1>')
k = s.index('<section class="content-section" id="three-days">'); e = s.index("</section>", k) + len("</section>\n")
s = s[:k] + s[e:]
s = s.replace("      <p>It is less a story about a goat than about a town. An old August market became a livestock fair, became a three-day celebration, and somewhere along the way a goat became King.</p>\n",
              "      <p>It is less a story about a goat than about a town. An old August market became a livestock fair, became a three-day celebration, and somewhere along the way a goat became King.</p>\n      <p>What happens on each of the three days is on <a href=\"/puck-fair#three-days\">The Fair</a> page.</p>\n")
assert "three-days" not in s.split('href="/puck-fair#three-days"')[0]
open(R + "src/pages/story.html", "w").write(s)
print("nav, labels, three-days: done")
