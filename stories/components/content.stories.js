import { initTagTips } from "../../public/app.js";

export default { title: "Components/Content" };

const el = (html, init) => {
  const d = document.createElement("div");
  d.innerHTML = html;
  init?.(d);
  return d;
};

export const EvidenceTags = {
  name: "Evidence tags (hover for the definition)",
  parameters: { docs: { description: { story: "Every historical claim carries one of four labels, from the editorial principle: Documented, Tradition, Legend, Unknown. Illustration marks art that stands in for a photograph. Hover or focus a badge: its one-line definition opens below it (app.js initTagTips makes badges focusable and flips the tip to end at the badge when it would run off the right edge)." } } },
  render: () => el(`<div class="sb-pad stack stack-lg" style="min-height:220px">
    <div class="cluster"><span class="tag documented">Documented</span><span class="tag tradition">Tradition</span><span class="tag legend">Legend</span><span class="tag unknown">Unknown</span><span class="tag illustration">Illustration</span></div>
    <div class="dark cluster" style="padding:var(--space-5)"><span class="tag documented">Documented</span><span class="tag tradition">Tradition</span><span class="tag legend">Legend</span><span class="tag unknown">Unknown</span><span class="tag illustration">Illustration</span></div>
  </div>`, initTagTips),
};

export const Timeline = {
  parameters: { docs: { description: { story: "A marker line; each entry is a header line (timeframe on the marker's line, evidence badge right-aligned) over a card. Era rows carry a heading and no marker. The marker takes the evidence colour. One layout at every width." } } },
  render: () => el(`<div class="sb-pad wrap"><ol class="timeline">
    <li class="era"><h3>An Era</h3><p>One line on what this stretch of time is about.</p></li>
    <li class="documented"><div class="when">1613<span class="tag documented">Documented</span></div><div class="entry"><h3>The Foundation Document</h3><p>A patent to hold a fair on Lammas Day and two days after.</p><p class="source">Where the sources disagree, a source note sits under the entry.</p></div></li>
    <li class="tradition"><div class="when">1808<span class="tag tradition">Tradition</span></div><div class="entry"><h3>Tolls and a Loophole</h3><p>A goat is hoisted onto a stage to prove the fair is a goat fair.</p></div></li>
    <li class="legend"><div class="when">1640s–50s<span class="tag legend">Legend</span></div><div class="entry"><h3>The Goat Who Warned the Town</h3><p>The best-known story, and why it can't be the beginning.</p></div></li>
    <li class="unknown"><div class="when">After 1795<span class="tag unknown">Unknown</span></div><div class="entry"><h3>When Did the Crowning Begin?</h3><p>The evidence doesn't allow a confident answer.</p></div></li>
  </ol><p class="credit">A credit line in the small muted style closes a timeline drawn from someone else's research.</p></div>`, initTagTips),
};

export const Gallery = {
  parameters: { docs: { description: { story: ".gallery: a responsive grid of captioned figures; .feature spans two columns; a .ph-photo placeholder holds a slot until a photograph arrives." } } },
  render: () => `<div class="sb-pad wrap"><div class="gallery">
    <figure class="feature"><div class="ph-photo"><img src="/img/king/crowned.jpg" alt=""></div><figcaption>A featured photograph spans two columns</figcaption></figure>
    <figure><div class="ph-photo"><img src="/img/king/street.jpg" alt=""></div><figcaption>Captioned</figcaption></figure>
    <figure><div class="ph-photo"><span>Photo</span></div><figcaption>Placeholder until a photograph arrives</figcaption></figure>
    <figure><div class="ph-photo"><img src="/img/king/eye.jpg" alt=""></div><figcaption>Beneath the crown</figcaption></figure>
    <figure><div class="ph-photo"><span>Photo</span></div><figcaption>Year wanted</figcaption></figure>
  </div></div>`,
};

export const DayCards = {
  name: "Day cards (programme)",
  render: () => `<div class="sb-pad wrap cols-3">
    <article class="day-card"><h3>Gathering Day</h3><ul class="list-rules"><li>Horse fair<span class="muted">Early morning</span></li><li>Coronation Parade<span class="muted">5 pm</span></li></ul></article>
    <article class="day-card"><h3>Fair Day</h3><ul class="list-rules"><li>Cattle fair<span class="muted">Early morning</span></li><li>Céilí<span class="muted">Late</span></li></ul></article>
    <article class="day-card"><h3>Scattering Day</h3><ul class="list-rules"><li>Dethronement<span class="muted">6 pm</span></li><li>Fireworks<span class="muted">Midnight</span></li></ul></article>
  </div>`,
};

export const LegendKey = {
  name: "Legend key",
  render: () => `<div class="sb-pad wrap"><div class="legend-key">
    <div><span class="tag documented">Documented</span><p>Supported by records or reliable sources.</p></div>
    <div><span class="tag tradition">Tradition</span><p>Passed down through generations.</p></div>
    <div><span class="tag legend">Legend</span><p>Associated with Puck, not established as fact.</p></div>
    <div><span class="tag unknown">Unknown</span><p>The evidence doesn't allow a confident answer.</p></div>
  </div></div>`,
};

export const PhotoPlaceholder = {
  name: "Photo placeholder",
  parameters: { docs: { description: { story: "`.ph-photo` stands in for archive photography. Drop an `<img>` inside to replace it; the label hides behind the image." } } },
  render: () => `<div class="sb-pad grid-auto" style="--grid-min:220px">
    <div class="ph-photo" style="aspect-ratio:4/5"><span>Archive photograph</span></div>
    <div class="ph-photo now" style="aspect-ratio:4/5"><span>Contemporary photograph</span></div>
    <div class="ph-photo" style="aspect-ratio:4/5"><img src="/img/king/crowned.jpg" alt=""></div>
    <div class="ph-photo square"><img src="/img/king/crowned-square.jpg" alt=""></div>
    <div class="ph-photo wide"><img src="/img/king/town-bridge.jpg" alt=""><small class="tag illustration photo-tag">Illustration</small></div>
  </div>`,
};

export const Plate = {
  render: () => `<div class="sb-pad" style="max-width:360px"><figure class="plate"><div class="ph-photo"><span>Portrait<br>King Puck</span></div><figcaption><b>Plate 01</b> King Puck above the Square, Killorglin. Photograph wanted.</figcaption></figure></div>`,
};

export const StoryCards = {
  name: "Story card",
  render: () => `<div class="sb-pad wrap cols-3">${["The goat catchers", "The horse traders", "The musicians"].map((t) => `<article class="story-card"><div class="ph-photo"><span>Portrait</span></div><h3>${t}</h3><p>Families who have been part of the fair for generations.</p></article>`).join("")}</div>`,
};

export const EmptyState = {
  name: "Empty state",
  render: () => `<div class="sb-pad wrap"><div class="empty-state"><h3>The register is being compiled</h3><p>If you have a photograph of King Puck from any year, it could fill a gap in the record.</p><a class="btn" href="#">Submit a photograph</a></div></div>`,
};

export const NoteBox = { name: "Note box", render: () => `<div class="sb-pad" style="max-width:520px"><div class="note-box"><p>KingPuck.com is an independent archive, not the fair's organiser.</p><p><a class="arrow-link" href="#">Official Puck Fair website</a></p></div></div>` };

export const RuledList = {
  name: "Ruled list",
  render: () => `<div class="sb-pad" style="max-width:560px"><ul class="list-rules"><li>The crowning of a wild goat<span class="tag documented">Documented</span></li><li>A Queen chosen from local schoolchildren<span class="tag tradition">Tradition</span></li><li>The goat who warned the town<span class="tag legend">Legend</span></li></ul></div>`,
};
