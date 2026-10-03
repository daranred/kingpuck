export default { title: "Components/Content" };

export const EvidenceTags = {
  name: "Evidence tags",
  parameters: { docs: { description: { story: "Every historical claim carries one of four labels, from the editorial principle: Documented, Tradition, Legend, Unknown." } } },
  render: () => `<div class="sb-pad stack stack-lg">
    <div class="cluster"><span class="tag documented">Documented</span><span class="tag tradition">Tradition</span><span class="tag legend">Legend</span><span class="tag unknown">Unknown</span></div>
    <div class="dark cluster" style="padding:var(--space-5)"><span class="tag documented">Documented</span><span class="tag tradition">Tradition</span><span class="tag legend">Legend</span><span class="tag unknown">Unknown</span></div>
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
    <div class="ph-photo" style="aspect-ratio:4/5"><img src="/img/posters/puck.svg" alt=""></div>
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
