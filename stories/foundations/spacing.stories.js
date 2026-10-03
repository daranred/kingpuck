import { tokensWith, resolved, sb } from "../_tokens.js";

export default { title: "Foundations/Spacing" };

const bar = (t) =>
  sb.row([sb.code(t.name), `<div style="height:16px;width:var(${t.name});background:var(--color-red)"></div>`, `<span class="muted" style="font:var(--text-sm) var(--font-sans)">${t.value}${t.value.startsWith("var(") || t.value.startsWith("clamp(") ? ` → ${resolved(t.name)}` : ""}</span>`]);

export const Scale = {
  name: "Space scale",
  render: () => sb.page(sb.section("Space scale", "The base scale. Every gap, stack and inset is built from these steps.", tokensWith("--space-").map(bar).join(""))),
};

export const GapAndStack = {
  name: "Gap & stack",
  render: () =>
    sb.page(
      [
        sb.section("Gap", "Space between siblings in a flex or grid row (cluster, grid). Use with gap: var(--gap-*).", tokensWith("--gap-").map(bar).join("")),
        sb.section("Stack", "Vertical rhythm between stacked blocks. Use with the .stack primitive or margin-block.", tokensWith("--stack-").map(bar).join("")),
        sb.section(
          "Inset",
          "Padding inside components.",
          tokensWith("--inset-")
            .map((t) => sb.row([sb.code(t.name), `<span style="display:inline-block;padding:var(${t.name});background:var(--color-paper-2);outline:1px dashed var(--color-red);font:var(--text-sm) var(--font-sans)">Content</span>`, `<span class="muted">${t.value}</span>`]))
            .join(""),
        ),
        sb.section(
          "Section rhythm",
          "Vertical padding for every .block and .content-section band.",
          sb.row([sb.code("--space-section"), `<div style="height:var(--space-section);width:24px;background:var(--color-red)"></div>`, `<span class="muted">${resolved("--space-section")}</span>`]),
        ),
      ].join(""),
    ),
};
