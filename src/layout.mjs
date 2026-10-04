// Shared page chrome. Used by tools/build.mjs (static pages) and by Storybook.
import { sections, childHref, icons, tabs } from "./site.mjs";
import { expandCalendars } from "./calendar.mjs";

// Support and About are reached from the header button, the menu sheet and the footer, not the main list.
const primary = sections.filter((s) => !s.footerOnly);
const secondary = sections.filter((s) => s.footerOnly);

export const FONTS = "https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@400;600&display=swap";

// Each src/pages/*.html starts with a JSON comment holding title, desc, section, bodyAttrs.
export function parsePage(raw, file = "page") {
  const m = raw.match(/^<!--\s*(\{[\s\S]*?\})\s*-->/);
  if (!m) throw new Error(`${file}: missing JSON header comment`);
  return { meta: JSON.parse(m[1]), body: expandCalendars(raw.slice(m[0].length).trim()) };
}

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
export const icon = (name, cls = "icon") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`;
const navItem = (s, current) => `
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
      <p class="footer-mark">Long live Puck Fair.</p>
      <p>KingPuck.com is the living archive of Puck Fair: the three days, the history, the King and Queen, and the people behind one of Ireland's oldest fairs.</p>
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
  <header><h2>Your Cart</h2><button class="icon-btn" type="button" aria-label="Close cart" data-close-cart>×</button></header>
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
<div class="page">
<main class="page-stack">
${withSectionIndex(section, body)}
</main>
${footer()}
</div>
${tabbar(section)}
${drawer()}`;
