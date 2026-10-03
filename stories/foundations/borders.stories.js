import { tokensWith, sb } from "../_tokens.js";

export default { title: "Foundations/Borders, radius & effects" };

export const Dividers = {
  parameters: { docs: { description: { story: "Use these for every rule, card edge and separator. `--border-divider` is the default; `--border-divider-strong` opens a section; `--border-divider-night` on navy and forest." } } },
  render: () =>
    sb.page(
      sb.section(
        "Dividers",
        "One divider colour family, shown on every surface it's used on.",
        `<div class="grid-auto" style="--grid-min:240px">${[
          ["--color-paper", "Paper"],
          ["--color-paper-2", "Paper 2"],
          ["--color-card", "Card"],
          ["--color-navy", "Navy"],
          ["--color-forest", "Forest"],
        ]
          .map(([bg, label]) => {
            const night = bg === "--color-navy" || bg === "--color-forest";
            const tokens = night ? ["--border-divider-night"] : ["--border-divider", "--border-divider-strong"];
            return `<div style="background:var(${bg});color:${night ? "var(--color-card)" : "var(--color-ink)"};padding:var(--space-5)" class="stack stack-md">
              <b style="font:var(--weight-semibold) var(--text-sm) var(--font-sans)">${label}</b>
              ${tokens.map((t) => `<div class="stack stack-xs"><div style="border-top:var(${t})"></div>${sb.code(t)}</div>`).join("")}
            </div>`;
          })
          .join("")}</div>`,
      ),
    ),
};

export const Borders = {
  render: () =>
    sb.page(
      [
        sb.section(
          "Borders",
          "Thin rules carry the editorial structure. Every divider uses the light --border-rule — never black. --border-field (ink) is only for form field outlines, which need the contrast.",
          tokensWith("--border-")
            .map((t) => sb.row([sb.code(t.name), t.name.includes("width") ? `<div style="border-top:var(${t.name}) solid var(--color-divider);width:100%"></div>` : `<div style="border:var(${t.name});height:56px;background:${t.name.includes("night") ? "var(--color-night)" : "var(--color-card)"}"></div>`, `<span class="muted" style="font-size:var(--text-xs)">${t.value}</span>`]))
            .join(""),
        ),
        sb.section(
          "Radius",
          "Square by default. Full radius only for dots and the compare handle.",
          tokensWith("--radius-").map((t) => sb.row([sb.code(t.name), `<div style="width:72px;height:72px;background:var(--color-ink);border-radius:var(${t.name})"></div>`, `<span class="muted">${t.value}</span>`])).join(""),
        ),
        sb.section(
          "Shadow",
          "Used sparingly: printed photographs in the collage and raised menus.",
          tokensWith("--shadow-").map((t) => sb.row([sb.code(t.name), `<div style="width:140px;height:90px;background:var(--color-card);box-shadow:var(${t.name})"></div>`, `<span class="muted" style="font-size:var(--text-xs)">${t.value}</span>`])).join(""),
        ),
      ].join(""),
    ),
};

export const MotionAndLayers = {
  name: "Motion, layout & layers",
  render: () =>
    sb.page(
      [
        sb.section("Motion", "", [...tokensWith("--duration-"), ...tokensWith("--ease")].map((t) => sb.row([sb.code(t.name), "", `<span class="muted">${t.value}</span>`])).join("")),
        sb.section("Layout", "Breakpoints: phone < 700px · tablet 700–1199px · desktop ≥ 1200px.", [...tokensWith("--container"), ...tokensWith("--gutter"), ...tokensWith("--header-"), ...tokensWith("--sidebar-"), ...tokensWith("--tabbar-")].map((t) => sb.row([sb.code(t.name), "", `<span class="muted">${t.value}</span>`])).join("")),
        sb.section("Layers (z-index)", "", tokensWith("--z-").map((t) => sb.row([sb.code(t.name), "", `<span class="muted">${t.value}</span>`])).join("")),
      ].join(""),
    ),
};
