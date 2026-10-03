// Wraps each src/pages/*.html body in the shared layout (src/layout.mjs) and writes it to public/.
// Each page starts with a JSON comment: <!-- {"title": "...", "desc": "...", "section": "/story"} -->
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { chrome, esc } from "../src/layout.mjs";

export const FONTS = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap";

export function parsePage(raw, file = "page") {
  const m = raw.match(/^<!--\s*(\{[\s\S]*?\})\s*-->/);
  if (!m) throw new Error(`${file}: missing JSON header comment`);
  return { meta: JSON.parse(m[1]), body: raw.slice(m[0].length).trim() };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const file of readdirSync("src/pages").filter((f) => f.endsWith(".html"))) {
    const { meta, body } = parsePage(readFileSync(`src/pages/${file}`, "utf8"), file);
    writeFileSync(`public/${file}`, `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(meta.title)}</title>
  <meta name="description" content="${esc(meta.desc)}">
  <meta property="og:title" content="${esc(meta.title)}">
  <meta property="og:description" content="${esc(meta.desc)}">
  <meta property="og:image" content="https://kingpuck.com/img/emblem.svg">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${FONTS}" rel="stylesheet">
  <link rel="stylesheet" href="/tokens.css">
  <link rel="stylesheet" href="/styles.css">
  <script type="module" src="/app.js"></script>
</head>
<body${meta.bodyAttrs ? " " + meta.bodyAttrs : ""}>
${chrome(meta.section, body)}
</body>
</html>
`);
    console.log("built", file);
  }
}
