import { sb } from "../_tokens.js";

export default {
  title: "Layout/Primitives",
  parameters: { docs: { description: { component: "Three primitives carry the spacing system: `.stack` (vertical rhythm), `.cluster` (wrapping rows) and `.grid-auto` (responsive grid). Pick a size modifier rather than adding margins." } } },
};

const box = (t, h = 48) => `<div style="background:var(--color-paper-2);border:var(--border-rule);min-height:${h}px;padding:var(--space-2);font:var(--text-sm) var(--font-sans)">${t}</div>`;

export const Stack = {
  args: { size: "md" },
  argTypes: { size: { control: "select", options: ["xs", "sm", "md", "lg", "xl", "2xl"] } },
  render: ({ size }) => sb.page(sb.section(`.stack.stack-${size}`, "Children are separated by --stack-gap; nothing is added above the first or below the last.", `<div class="stack stack-${size}" style="max-width:420px;outline:1px dashed var(--color-red)">${box("Kicker", 24)}${box("Heading", 56)}${box("Lead paragraph", 72)}${box("Button", 40)}</div>`)),
};

export const Cluster = {
  args: { size: "sm" },
  argTypes: { size: { control: "select", options: ["xs", "sm", "md", "lg"] } },
  render: ({ size }) => sb.page(sb.section(`.cluster.cluster-${size}`, "Inline items that wrap, with one gap in both directions.", `<div class="cluster cluster-${size}" style="max-width:520px;outline:1px dashed var(--color-red)">${["Photos", "Queens", "Posters", "Films", "Stories", "Newspapers", "Programs", "Audio"].map((t) => `<span class="tag documented">${t}</span>`).join("")}</div>`)),
};

export const GridAuto = {
  name: "Grid auto",
  args: { min: 200 },
  argTypes: { min: { control: { type: "range", min: 120, max: 400, step: 20 } } },
  render: ({ min }) => sb.page(sb.section(".grid-auto", "Columns never narrower than --grid-min; gap from --grid-gap (default --gap-lg).", `<div class="grid-auto" style="--grid-min:${min}px">${Array.from({ length: 8 }, (_, i) => box(`Item ${i + 1}`, 100)).join("")}</div>`)),
};

export const Split = {
  render: () => sb.page(sb.section(".split", "Two columns on desktop and tablet; stacks under 860px.", `<div class="split">${box("Text column", 200)}${box("Image column", 200)}</div>`)),
};
