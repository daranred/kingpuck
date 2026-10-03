import { groupsWith, resolved, sb } from "../_tokens.js";

export default { title: "Foundations/Color" };

const swatch = ({ name, value }) => `
  <div style="border:var(--border-rule);background:var(--color-card)">
    <div style="height:88px;background:var(${name})"></div>
    <div style="padding:var(--space-3);display:grid;gap:var(--gap-2xs);font-family:var(--font-sans)">
      <b style="font-size:var(--text-sm)">${name.replace("--color-", "")}</b>
      ${sb.code(name)}
      <span class="muted" style="font-size:var(--text-sm)">${value.startsWith("var(") ? `${value} → ${resolved(name)}` : value}</span>
    </div>
  </div>`;

export const Palette = {
  render: () =>
    sb.page(
      groupsWith("--color-")
        .map((g) => sb.section(g.group.replace("Color — ", ""), "", `<div class="grid-auto" style="--grid-min:180px;--grid-gap:var(--gap-md)">${g.tokens.map(swatch).join("")}</div>`))
        .join(""),
    ),
};

export const Pairings = {
  name: "Text on background",
  render: () =>
    sb.page(
      sb.section(
        "Approved pairings",
        "Ink on paper for reading; cream on night for bands; red for calls to action.",
        `<div class="grid-auto" style="--grid-min:220px">${[
          ["--color-paper", "--color-ink", "Paper / Ink"],
          ["--color-paper-2", "--color-ink-2", "Paper 2 / Ink 2"],
          ["--color-card", "--color-muted", "Card / Muted"],
          ["--color-night", "--color-card", "Night / Card"],
          ["--color-night", "--color-gold-2", "Night / Gold 2"],
          ["--color-red", "--color-card", "Red / Card"],
        ]
          .map(([bg, fg, label]) => `<div style="background:var(${bg});color:var(${fg});padding:var(--space-5);border:var(--border-rule)"><h3 class="mb-0">${label}</h3><p class="mb-0" style="font-size:var(--text-sm)">The goat. The crown. The legend.</p></div>`)
          .join("")}</div>`,
      ),
    ),
};
