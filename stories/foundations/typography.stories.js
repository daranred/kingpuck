import { tokensWith, resolved, sb } from "../_tokens.js";

export default { title: "Foundations/Typography" };

export const Families = {
  render: () =>
    sb.page(
      sb.section(
        "Families",
        "Two families. Display serif for headings (only h1 is uppercase); Inter for everything else: body, navigation, buttons and labels.",
        tokensWith("--font-")
          .map((t) => sb.row([sb.code(t.name), `<span style="font-family:var(${t.name});font-size:var(--text-2xl)">King Puck · Killorglin 1613</span>`, `<span class="muted" style="font:var(--text-sm) var(--font-sans)">${t.value}</span>`]))
          .join(""),
      ),
    ),
};

export const Scale = {
  render: () =>
    sb.page(
      sb.section(
        "Type scale",
        "Fluid sizes use clamp() and grow with the viewport. Nothing is smaller than --text-sm (14px); body text is 16px.",
        tokensWith("--text-")
          .reverse()
          .map((t) => sb.row([sb.code(t.name), `<span style="font-family:var(--font-display);font-size:var(${t.name});line-height:1">The goat</span>`, `<span class="muted" style="font:var(--text-sm) var(--font-sans)">${t.value}</span>`]))
          .join(""),
      ),
    ),
};

export const LeadingTrackingWeight = {
  name: "Leading, tracking, weight",
  render: () =>
    sb.page(
      [
        sb.section("Line height", "", tokensWith("--leading-").map((t) => sb.row([sb.code(t.name), `<p class="mb-0" style="line-height:var(${t.name});max-width:28rem;background:var(--color-card)">Every August, Killorglin crowns a wild goat King and celebrates for three days.</p>`, `<span class="muted">${t.value}</span>`])).join("")),
        sb.section("Letter spacing", "", tokensWith("--tracking-").map((t) => sb.row([sb.code(t.name), `<span style="font:600 var(--text-sm) var(--font-sans);letter-spacing:var(${t.name})">Killorglin · County Kerry</span>`, `<span class="muted">${t.value}</span>`])).join("")),
        sb.section("Weight", "", tokensWith("--weight-").map((t) => sb.row([sb.code(t.name), `<span style="font:var(${t.name}) var(--text-lg) var(--font-sans)">Gathering · Fair · Scattering</span>`, `<span class="muted">${t.value}</span>`])).join("")),
      ].join(""),
    ),
};

export const TextStyles = {
  name: "Text styles",
  render: () =>
    sb.page(
      sb.section(
        "Text styles",
        "The classes components use. No eyebrows: a heading stands on its own, with no small label above it. No all-caps labels or wide letter spacing. Every text colour meets WCAG AA (4.5:1).",
        `<div class="stack stack-xl">
          <div>${sb.code(".hero h1")}<h1 style="font-size:var(--text-4xl);line-height:.82" class="mb-0">King Puck</h1></div>
          <div>${sb.code("h1 / .display")}<h1 class="mb-0">A goat becomes King</h1></div>
          <div>${sb.code("h2 / .display.sm")}<h2 class="mb-0">Meet the royal family</h2></div>
          <div>${sb.code("h3")}<h3 class="mb-0">Gathering Day</h3></div>
          <div>${sb.code(".lead")}<p class="lead mb-0">Every August, Killorglin crowns a wild goat King and celebrates for three days.</p></div>
          <div>${sb.code("p (body)")}<p class="mb-0" style="max-width:40rem">Puck Fair takes place every year from 10 to 12 August in Killorglin, County Kerry, on the banks of the River Laune.</p></div>
          <div>${sb.code(".muted")}<p class="muted mb-0">Puck Fair · 10–12 August</p></div>
          <div>${sb.code(".closing")}<p class="closing" style="margin-top:0">Long live King Puck.</p></div>
        </div>`,
      ),
    ),
};
