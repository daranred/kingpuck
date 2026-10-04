// Structured data (schema.org JSON-LD) for each page. One Organization/WebSite on the home page,
// an Event for the fair, Products for the shop, BreadcrumbList elsewhere.
import { sections } from "./site.mjs";

export const SITE = "https://kingpuck.com";
const NEXT_FAIR_YEAR = new Date().getMonth() > 7 || (new Date().getMonth() === 7 && new Date().getDate() > 12) ? new Date().getFullYear() + 1 : new Date().getFullYear();

const org = { "@type": "Organization", "@id": `${SITE}/#org`, name: "King Puck", url: SITE, logo: `${SITE}/img/emblem.svg`, description: "The living archive of Puck Fair, Killorglin, County Kerry. An independent project, not the official Puck Fair organisation." };

export function fairEvent() {
  return {
    "@type": "Festival",
    name: "Puck Fair",
    alternateName: "Aonach an Phoic",
    description: "Ireland's oldest fair: three days every August in Killorglin, County Kerry, when a wild mountain goat is crowned King Puck.",
    startDate: `${NEXT_FAIR_YEAR}-08-10`,
    endDate: `${NEXT_FAIR_YEAR}-08-12`,
    eventSchedule: { "@type": "Schedule", repeatFrequency: "P1Y", byMonth: 8, byMonthDay: [10, 11, 12] },
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    isAccessibleForFree: true,
    location: { "@type": "Place", name: "Killorglin", address: { "@type": "PostalAddress", addressLocality: "Killorglin", addressRegion: "County Kerry", addressCountry: "IE" } },
    image: `${SITE}/img/heroes/puck-fair.jpg`,
    url: `${SITE}/puck-fair`,
    sameAs: ["https://puckfair.ie/", "https://en.wikipedia.org/wiki/Puck_Fair"],
  };
}

function breadcrumbs(path, meta) {
  const s = sections.find((x) => x.href === (meta.section ?? path));
  const items = [{ name: "Home", item: SITE + "/" }];
  if (s && s.href !== path) items.push({ name: s.label, item: SITE + s.href });
  items.push({ name: meta.title.split(" — ")[0].split(" | ")[0], item: SITE + path });
  return { "@type": "BreadcrumbList", itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.item })) };
}

export function products(catalog) {
  return catalog.products.map((p) => ({
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: SITE + p.image,
    url: `${SITE}/shop?c=${p.category}`,
    brand: { "@type": "Brand", name: "King Puck" },
    offers: { "@type": "Offer", priceCurrency: "EUR", price: (p.price / 100).toFixed(2), availability: "https://schema.org/InStock", url: `${SITE}/shop?c=${p.category}` },
  }));
}

const money = (c) => "€" + (c / 100).toFixed(2);
export function shopGrid(catalog) {
  return catalog.products.map((p) => `<article class="card"><img src="${p.image}" alt="${p.name}" loading="lazy" width="600" height="800"><div class="card-body"><h3>${p.name}</h3><p>${p.description}</p><div class="card-foot"><span class="price">${money(p.price)}</span><a class="btn" href="/shop?c=${p.category}">View</a></div></div></article>`).join("\n      ");
}

export function structuredData(path, meta, catalog) {
  const graph = [];
  if (path === "/") graph.push(org, { "@type": "WebSite", url: SITE, name: "King Puck · Puck Fair", publisher: { "@id": `${SITE}/#org` } }, fairEvent());
  else if (path === "/puck-fair") graph.push(fairEvent(), breadcrumbs(path, meta));
  else if (path === "/shop") graph.push({ "@type": "ItemList", name: "King Puck shop", itemListElement: products(catalog).map((p, i) => ({ "@type": "ListItem", position: i + 1, item: p })) }, breadcrumbs(path, meta));
  else graph.push(breadcrumbs(path, meta));
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}
