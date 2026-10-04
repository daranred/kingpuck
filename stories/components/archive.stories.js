import { pageSection, pageHeader } from "../_pages.js";

export default {
  title: "Sections/Archive & galleries",
  parameters: { docs: { description: { component: "The .gallery grid (captioned figures, a .feature tile spanning two columns, .ph-photo placeholders until photographs arrive) as used on the Archive, King Puck and Queen Puck pages, plus the collecting empty states." } } },
};

const el = (html) => {
  const d = document.createElement("main");
  d.className = "page-stack";
  d.innerHTML = html;
  return d;
};

export const PageHeader = { name: "Page header (photo band)", render: () => el(pageHeader("archive")) };
export const PhotographsPlaceholders = { name: "Gallery · placeholders (Archive)", render: () => el(pageSection("archive", "photographs")) };
export const KingGallery = { name: "Gallery · photographs (King Puck)", render: () => el(pageSection("king-puck", "gallery")) };
export const QueenGallery = { name: "Gallery · Queens (placeholders)", render: () => el(pageSection("queen-puck", "gallery")) };
export const Collecting = { name: "Empty state · collecting now", render: () => el(pageSection("archive", "posters")) };
export const Search = { name: "Dark navy band", render: () => el(pageSection("archive", "search")) };
