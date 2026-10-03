// Wraps each src/pages/*.html body in the shared layout (src/layout.mjs) and writes it to public/.
// Each page starts with a JSON comment: <!-- {"title": "...", "desc": "...", "section": "/story"} -->
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { chrome, esc, parsePage, FONTS } from "../src/layout.mjs";

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
