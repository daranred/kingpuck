// Pulls real sections and headers out of src/pages so component stories never drift from the site.
import { parsePage } from "../src/layout.mjs";

const files = import.meta.glob("../src/pages/*.html", { query: "?raw", import: "default", eager: true });

export const pageBody = (name) => parsePage(files[`../src/pages/${name}.html`], name).body;

// The <section id="…"> … </section> block of a page (sections never nest).
export function pageSection(name, id) {
  const m = pageBody(name).match(new RegExp(`<section[^>]*\\bid="${id}"[\\s\\S]*?\\n</section>`));
  if (!m) throw new Error(`${name}#${id} not found`);
  return m[0];
}

// The photo-band page header at the top of a page.
export function pageHeader(name) {
  const m = pageBody(name).match(/<header class="page-head[\s\S]*?<\/header>/);
  if (!m) throw new Error(`${name}: no page header`);
  return m[0];
}
