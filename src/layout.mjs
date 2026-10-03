// Shared page chrome. Used by tools/build.mjs (static pages) and by Storybook.
import { sections, childHref, icons, sectionIcon, tabs } from "./site.mjs";

export const FONTS = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap";

// Each src/pages/*.html starts with a JSON comment holding title, desc, section, bodyAttrs.
export function parsePage(raw, file = "page") {
  const m = raw.match(/^<!--\s*(\{[\s\S]*?\})\s*-->/);
  if (!m) throw new Error(`${file}: missing JSON header comment`);
  return { meta: JSON.parse(m[1]), body: raw.slice(m[0].length).trim() };
}

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
export const icon = (name, cls = "icon") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`;
const shortLabel = { "Support the Archive": "Support", "The Story": "Story", "The Archive": "Archive" };
const subLinks = (s) => s.children.map((c) => `<li><a href="${childHref(s, c)}">${esc(c[1])}</a></li>`).join("");

/* Desktop masthead (≥1200px). On phones it collapses to logo + cart; its nav becomes the Menu sheet. */
export function header(current) {
  const items = sections.map((s) => `
        <li class="nav-item${s.href === current ? " is-current" : ""}">
          <a href="${s.href}"${s.href === current ? ' aria-current="page"' : ""}>${esc(shortLabel[s.label] ?? s.label)}</a>
          <ul class="nav-sub">${subLinks(s)}</ul>
        </li>`).join("");
  return `<header class="masthead">
  <div class="wrap masthead-top">
    <a class="wordmark" href="/" aria-label="King Puck home"><img src="/img/emblem.svg" alt="" width="30" height="30"><span>King Puck</span></a>
    <nav class="site-nav" id="site-nav" aria-label="Main">
      <p class="sheet-title">Explore King Puck</p>
      <ul class="nav-list">${items}
      </ul>
    </nav>
    <div class="masthead-actions">
      <a class="account-btn" href="/login" data-account-link aria-label="Sign in">${icon("user")}<span data-account-label>Sign in</span></a>
      <button class="cart-btn" type="button" data-open-cart>Cart <span data-cart-count>0</span></button>
    </div>
  </div>
</header>`;
}

/* Tablet sidebar (700–1199px): every section, the current one expanded. */
export function sidebar(current) {
  const items = sections.map((s) => {
    const on = s.href === current;
    return `
      <li class="side-item${on ? " is-current" : ""}">
        <a href="${s.href}"${on ? ' aria-current="page"' : ""}>${icon(sectionIcon[s.href])}<span>${esc(s.label)}</span></a>
        ${on ? `<ul class="side-sub">${subLinks(s)}</ul>` : ""}
      </li>`;
  }).join("");
  return `<aside class="sidebar" aria-label="Sections">
  <a class="wordmark" href="/"><img src="/img/emblem.svg" alt="" width="28" height="28"><span>King Puck</span></a>
  <nav><ul class="side-list">
      <li class="side-item${!current ? " is-current" : ""}"><a href="/"${!current ? ' aria-current="page"' : ""}>${icon("home")}<span>Home</span></a></li>${items}
  </ul></nav>
  <a class="side-account" href="/login" data-account-link>${icon("user")}<span data-account-label>Sign in</span></a>
  <button class="side-cart" type="button" data-open-cart>${icon("cart")}<span>Cart</span><b data-cart-count>0</b></button>
</aside>`;
}

/* Phone bottom bar (<700px). */
export function tabbar(current) {
  const tab = ([href, label, ic]) => {
    const on = href === "/" ? !current : href === current;
    return `<a class="tab${on ? " is-current" : ""}" href="${href}"${on ? ' aria-current="page"' : ""}>${icon(ic)}<span>${label}</span></a>`;
  };
  return `<nav class="tabbar" aria-label="Quick navigation">
  ${tabs.map(tab).join("\n  ")}
  <button class="tab" type="button" data-menu aria-controls="site-nav" aria-expanded="false">${icon("menu")}<span>Menu</span></button>
</nav>`;
}

export function sectionIndex(current) {
  const s = sections.find((x) => x.href === current);
  if (!s || s.href === "/shop") return "";
  const seen = new Set();
  const links = s.children.filter(([slug]) => !slug.startsWith("/") && !seen.has(slug) && seen.add(slug));
  return `<nav class="section-index" aria-label="${esc(s.label)}">
  <div class="wrap"><span>In this section</span>${links.map((c) => `<a href="#${c[0]}">${esc(c[1])}</a>`).join("")}</div>
</nav>`;
}

export const footer = () => `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-lead">
      <p class="footer-mark">Long live King Puck.</p>
      <p>KingPuck.com is the living archive of Puck Fair: the story, people and culture behind one of Ireland's oldest fairs.</p>
      <a class="btn red" href="/support#submit">Your Puck. Your story. →</a>
    </div>
    <div class="sitemap">${sections.map((s) => `
      <div><h4><a href="${s.href}">${esc(s.label)}</a></h4>${s.children.map((c) => `<a href="${childHref(s, c)}">${esc(c[1])}</a>`).join("")}</div>`).join("")}
    </div>
    <p class="fine">© 2026 KingPuck.com. An independent project, not the official Puck Fair organisation. Secure payments by Stripe.</p>
  </div>
</footer>`;

export const drawer = () => `<div class="drawer-backdrop" data-close-cart></div>
<aside class="drawer" aria-label="Shopping cart">
  <header><h2>Your cart</h2><button class="icon-btn" type="button" aria-label="Close cart" data-close-cart>×</button></header>
  <ul class="cart-items"></ul>
  <footer>
    <div class="row"><span>Subtotal</span><span data-subtotal>€0.00</span></div>
    <p class="note" data-ship-note></p>
    <p class="error" data-cart-error role="alert"></p>
    <button class="btn red" type="button" data-checkout disabled>Checkout securely</button>
    <p class="note">Shipping and taxes are calculated at checkout.</p>
  </footer>
</aside>`;

// The section index goes straight after the page header.
const withSectionIndex = (section, body) => {
  const idx = section ? sectionIndex(section) : "";
  return idx && body.includes("</header>") ? body.replace("</header>", `</header>\n${idx}`) : body;
};

/* Everything inside <body>. */
export const chrome = (section, body) => `${header(section)}
${sidebar(section)}
<div class="page">
<main>
${withSectionIndex(section, body)}
</main>
${footer()}
</div>
${tabbar(section)}
${drawer()}`;
