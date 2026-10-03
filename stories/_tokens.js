// Reads public/tokens.css so the Foundations stories always match the live tokens.
import raw from "../public/tokens.css?raw";

// Returns [{ group, tokens: [{ name, value }] }] using the "/* Group — sub */" comments as headings.
export function tokenGroups() {
  const groups = [];
  let current = { group: "Tokens", tokens: [] };
  for (const line of raw.split("\n")) {
    const comment = line.match(/^\s*\/\*\s*([^*]+?)\s*\*\/\s*$/);
    if (comment) {
      if (current.tokens.length) groups.push(current);
      current = { group: comment[1], tokens: [] };
      continue;
    }
    const decl = line.match(/^\s*(--[\w-]+):\s*([^;]+);/);
    if (decl) current.tokens.push({ name: decl[1], value: decl[2].trim() });
  }
  if (current.tokens.length) groups.push(current);
  return groups;
}

export const tokensWith = (prefix) => tokenGroups().flatMap((g) => g.tokens).filter((t) => t.name.startsWith(prefix));
export const groupsWith = (prefix) =>
  tokenGroups().map((g) => ({ ...g, tokens: g.tokens.filter((t) => t.name.startsWith(prefix)) })).filter((g) => g.tokens.length);

export const resolved = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export const sb = {
  page: (inner) => `<div class="sb-pad wrap stack stack-2xl">${inner}</div>`,
  section: (title, note, inner) =>
    `<section class="stack stack-lg"><div class="stack stack-xs"><h2 class="display sm mb-0">${title}</h2>${note ? `<p class="muted mb-0" style="font-family:var(--font-sans);font-size:var(--text-sm)">${note}</p>` : ""}</div>${inner}</section>`,
  code: (s) => `<code style="font:12px/1.4 ui-monospace,Menlo,monospace">${s}</code>`,
  row: (cells) =>
    `<div style="display:grid;grid-template-columns:200px 1fr 220px;gap:var(--gap-lg);align-items:center;padding:var(--space-3) 0;border-bottom:var(--border-rule)">${cells.join("")}</div>`,
};
