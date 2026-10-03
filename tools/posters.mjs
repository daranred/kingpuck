// Generates the "King Puck propaganda" poster series as SVG (public/img/posters/).
// Street-poster style: flat posterised tones, sunburst rays, halftone, stencil type.
import { mkdirSync, writeFileSync } from "node:fs";

const W = 600, H = 800, CX = 300, CY = 360;

const rays = (n, c1, c2) => {
  let out = `<rect width="${W}" height="${H}" fill="${c1}"/>`;
  for (let i = 0; i < n; i += 2) {
    const a1 = (i / n) * Math.PI * 2, a2 = ((i + 1) / n) * Math.PI * 2, r = 1000;
    out += `<path d="M${CX} ${CY} L${CX + r * Math.cos(a1)} ${CY + r * Math.sin(a1)} L${CX + r * Math.cos(a2)} ${CY + r * Math.sin(a2)} Z" fill="${c2}"/>`;
  }
  return out;
};

const halftone = (id, color, size = 9) => `<pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.22}" fill="${color}"/></pattern>`;

const star = (x, y, r, fill) => {
  let d = "";
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.42 : r;
    d += `${i ? "L" : "M"}${(x + rr * Math.cos(a)).toFixed(1)} ${(y + rr * Math.sin(a)).toFixed(1)} `;
  }
  return `<path d="${d}Z" fill="${fill}"/>`;
};

// The goat: three posterised tones (shadow / mid / highlight) + crown.
const goat = ({ shadow, mid, hi, crown, line }) => `
  <!-- shoulders -->
  <path d="M212 500 C190 590 150 650 90 700 L510 700 C450 650 410 590 388 500 Z" fill="${shadow}"/>
  <path d="M300 520 C330 600 380 660 440 700 L300 700 Z" fill="${mid}"/>
  <path d="M232 560 l-14 40 M262 580 l-8 46 M338 580 l8 46 M368 560 l14 40" stroke="${hi}" stroke-width="6" stroke-linecap="round"/>
  <!-- horns: swept up and back, like a Kerry mountain goat -->
  <path d="M268 306 C248 250 222 196 170 150 C176 168 186 186 192 200 C212 236 228 276 244 318 Z" fill="${mid}" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M332 306 C352 250 378 196 430 150 C424 168 414 186 408 200 C388 236 372 276 356 318 Z" fill="${mid}" stroke="${line}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M258 296 C242 252 220 212 186 176 C214 204 236 244 250 292 Z M342 296 C358 252 380 212 414 176 C386 204 364 244 350 292 Z" fill="${hi}"/>
  <path d="M244 318 C236 290 226 266 214 244 M356 318 C364 290 374 266 386 244" stroke="${shadow}" stroke-width="5" fill="none"/>
  <!-- ears -->
  <path d="M248 356 C210 340 164 348 134 378 C174 396 222 390 252 376 Z" fill="${shadow}"/>
  <path d="M352 356 C390 340 436 348 466 378 C426 396 378 390 348 376 Z" fill="${mid}"/>
  <path d="M244 362 C210 354 176 360 154 374 C188 380 220 378 244 368 Z M356 362 C390 354 424 360 446 374 C412 380 380 378 356 368 Z" fill="${hi}"/>
  <g transform="matrix(1 0 0 0.84 0 46.7)">
  <!-- head: mid base, shadow side, highlight ridge -->
  <path d="M300 292 C342 292 364 322 362 362 C360 412 346 472 332 522 C324 550 313 568 300 570 C287 568 276 550 268 522 C254 472 240 412 238 362 C236 322 258 292 300 292 Z" fill="${mid}"/>
  <path d="M300 292 C258 292 236 322 238 362 C240 412 254 472 268 522 C276 550 287 568 300 570 C292 540 286 500 284 460 C282 420 276 390 270 370 C280 360 296 330 300 292 Z" fill="${shadow}"/>
  <path d="M304 300 C316 340 318 380 314 430 C312 470 310 500 306 530 C320 500 334 450 340 400 C344 360 336 320 304 300 Z" fill="${hi}"/>
  <!-- brow + eyes -->
  <path d="M252 372 C262 360 280 360 290 372 C278 368 264 368 252 372 Z M348 372 C338 360 320 360 310 372 C322 368 336 368 348 372 Z" fill="${line}"/>
  <path d="M256 386 C266 378 282 378 290 388 C280 394 266 394 256 386 Z" fill="${hi}"/>
  <path d="M264 386 h20" stroke="${line}" stroke-width="5" stroke-linecap="round"/>
  <path d="M344 386 C334 378 318 378 310 388 C320 394 334 394 344 386 Z" fill="${hi}"/>
  <path d="M316 386 h20" stroke="${line}" stroke-width="5" stroke-linecap="round"/>
  <!-- muzzle -->
  <path d="M276 522 C284 506 316 506 324 522 C320 548 310 566 300 568 C290 566 280 548 276 522 Z" fill="${shadow}"/>
  <path d="M286 528 c4 -6 10 -6 10 2 M314 528 c-4 -6 -10 -6 -10 2" stroke="${hi}" stroke-width="4" fill="none" stroke-linecap="round"/>
  <!-- beard -->
  <path d="M282 556 C284 600 292 640 300 676 C308 640 316 600 318 556 C306 566 294 566 282 556 Z" fill="${shadow}"/>
  <path d="M300 572 C302 610 302 640 300 676 C310 640 314 604 314 566 Z" fill="${mid}"/>
  </g>
  <!-- crown -->
  <g fill="${crown}" stroke="${line}" stroke-width="4" stroke-linejoin="round">
    <path d="M246 296 L236 222 L268 252 L300 196 L332 252 L364 222 L354 296 Z"/>
    <rect x="244" y="284" width="112" height="18"/>
  </g>
  <circle cx="300" cy="190" r="9" fill="${crown}" stroke="${line}" stroke-width="4"/>
  <circle cx="236" cy="216" r="7" fill="${crown}" stroke="${line}" stroke-width="4"/>
  <circle cx="364" cy="216" r="7" fill="${crown}" stroke="${line}" stroke-width="4"/>
  <path d="M276 293 h48" stroke="${line}" stroke-width="4" stroke-dasharray="6 8"/>`;

const frame = (c, hi) => `
  <circle cx="${CX}" cy="${CY}" r="228" fill="none" stroke="${c}" stroke-width="14"/>
  <circle cx="${CX}" cy="${CY}" r="212" fill="none" stroke="${hi}" stroke-width="3" stroke-dasharray="2 10"/>
  <circle cx="${CX}" cy="${CY}" r="246" fill="none" stroke="${c}" stroke-width="3"/>`;

const banner = ({ bg, fg, accent, title, sub, size = 92 }) => `
  <rect x="0" y="672" width="${W}" height="128" fill="${bg}"/>
  <rect x="0" y="672" width="${W}" height="6" fill="${accent}"/>
  <text x="${CX}" y="${672 + 18 + size * 0.78}" text-anchor="middle" font-family="Impact, 'Oswald', 'Bebas Neue', 'Arial Narrow', sans-serif" font-weight="900" font-size="${size}" fill="${fg}" textLength="${W - 130}" lengthAdjust="spacingAndGlyphs">${title}</text>
  <text x="${CX}" y="786" text-anchor="middle" font-family="'Arial Narrow', Arial, sans-serif" font-weight="700" font-size="15" letter-spacing="6" fill="${accent}">${sub}</text>
  ${star(36, 728, 14, accent)}${star(W - 36, 728, 14, accent)}`;

const poster = (p) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>${halftone("ht", p.dots)}<clipPath id="c"><rect width="${W}" height="${H}"/></clipPath></defs>
  <g clip-path="url(#c)">
    ${rays(36, p.bg, p.ray)}
    <rect width="${W}" height="${H}" fill="url(#ht)" opacity=".55"/>
    <circle cx="${CX}" cy="${CY}" r="228" fill="${p.disc}"/>
    ${frame(p.frame, p.frameHi)}
    ${goat(p.goat)}
    ${banner(p.banner)}
    <rect x="10" y="10" width="${W - 20}" height="${H - 20}" fill="none" stroke="${p.border}" stroke-width="4"/>
  </g>
</svg>
`;

const INK = "#141412", CREAM = "#efe3c8", RED = "#b3261e", RED2 = "#8f1d17", GOLD = "#d2a744", BLUE = "#7f9fa8", NAVY = "#1d2733";

export const posters = {
  "long-live-the-king": poster({
    bg: RED, ray: RED2, dots: CREAM, disc: CREAM, frame: INK, frameHi: RED, border: CREAM,
    goat: { shadow: INK, mid: BLUE, hi: CREAM, crown: GOLD, line: INK },
    banner: { bg: INK, fg: CREAM, accent: GOLD, title: "LONG LIVE THE KING", sub: "KILLORGLIN · CO. KERRY", size: 66 },
  }),
  puck: poster({
    bg: NAVY, ray: INK, dots: GOLD, disc: RED, frame: GOLD, frameHi: CREAM, border: GOLD,
    goat: { shadow: INK, mid: CREAM, hi: "#ffffff", crown: GOLD, line: INK },
    banner: { bg: GOLD, fg: INK, accent: RED, title: "PUCK", sub: "10 · 11 · 12 AUGUST", size: 86 },
  }),
  "goat-crown-legend": poster({
    bg: CREAM, ray: "#e4d3ae", dots: RED, disc: INK, frame: RED, frameHi: CREAM, border: INK,
    goat: { shadow: RED2, mid: GOLD, hi: CREAM, crown: GOLD, line: INK },
    banner: { bg: RED, fg: CREAM, accent: INK, title: "THE GOAT. THE CROWN. THE LEGEND.", sub: "KING PUCK · KILLORGLIN", size: 40 },
  }),
};

if (import.meta.url === `file://${process.argv[1]}`) {
  mkdirSync("public/img/posters", { recursive: true });
  for (const [name, svg] of Object.entries(posters)) {
    writeFileSync(`public/img/posters/${name}.svg`, svg);
    console.log("poster", name);
  }
}
