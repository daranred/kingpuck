import { homeSection } from "../_home.js";
import { initCompare, productCard } from "../../public/app.js";
import catalog from "../../functions/_lib/catalog.js";

export default { title: "Sections/Home" };

const el = (html, init) => {
  const d = document.createElement("div");
  d.innerHTML = html;
  init?.(d);
  return d;
};

export const Hero = { render: () => homeSection(0) };
export const GoatBecomesKing = { name: "Intro + stats", render: () => homeSection(1) };
export const HistoryInMotion = { name: "History in motion", render: () => homeSection(2) };
export const ThreeDays = { name: "Three days (numbered rows)", render: () => homeSection(3) };
export const RoyalFamily = { name: "Meet the royal family", render: () => homeSection(4) };
export const ThenNow = {
  name: "Then / Now compare",
  parameters: { docs: { description: { story: "Drag (or use arrow keys on) the slider. Replace each `.ph-photo` with an `<img>` of the same scene." } } },
  render: () => el(homeSection(5), (d) => d.querySelectorAll("[data-compare]").forEach(initCompare)),
};
export const People = { name: "Everyone has a Puck story (collage)", render: () => homeSection(6) };
export const ArchiveTiles = { name: "Explore the archive (tiles)", render: () => homeSection(7) };
export const ShopRow = {
  name: "Take a piece of the archive home",
  render: () =>
    el(homeSection(8), (d) => {
      const grid = d.querySelector(".grid");
      catalog.products.slice(0, 4).forEach((p) => grid.append(productCard(p)));
    }),
};
export const Closing = { name: "Closing CTA + add your story", render: () => homeSection(9) };
