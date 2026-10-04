import { header, tabbar, footer, sectionIndex } from "../../src/layout.mjs";
import { initMenu } from "../../public/app.js";

export default { title: "Navigation" };

const mount = (html, init) => {
  const d = document.createElement("div");
  d.innerHTML = html;
  init?.(d);
  return d;
};
const sample = `<div class="sb-pad wrap"><p class="lead">Page content</p><div class="ph-photo" style="height:420px"><span>Content</span></div></div>`;

export const MastheadDesktop = {
  name: "Masthead · desktop",
  globals: { viewport: { value: "desktop" } },
  render: () => mount(header("/story") + sample),
};
export const MastheadNight = {
  name: "Masthead · night (home)",
  globals: { viewport: { value: "desktop" } },
  render: () => mount(`<div class="home">${header()}</div>` + sample),
};
export const MenuSheetTablet = {
  name: "Menu sheet · tablet",
  globals: { viewport: { value: "tablet" } },
  parameters: { docs: { description: { story: "Under 1000px the same nav list becomes a sheet, opened from the Menu button in the masthead." } } },
  render: () =>
    mount(`${header("/king-puck")}${sample}`, (d) => {
      initMenu(d);
      requestAnimationFrame(() => d.querySelector(".menu-btn").click());
    }),
};
export const BottomBarPhone = {
  name: "Bottom bar · phone",
  globals: { viewport: { value: "phone" } },
  parameters: { docs: { description: { story: "Under 700px. Four destinations plus Menu, which opens the same sheet from the bottom bar." } } },
  render: () => mount(`${header("/archive")}${sample}${tabbar("/archive")}`, (d) => initMenu(d)),
};
export const MenuSheetPhone = {
  name: "Menu sheet · phone",
  globals: { viewport: { value: "phone" } },
  render: () =>
    mount(`${header()}${sample}${tabbar()}`, (d) => {
      initMenu(d);
      requestAnimationFrame(() => d.querySelector(".tabbar [data-menu]").click());
    }),
};
export const SectionIndex = { name: "Section index", render: () => sectionIndex("/king-puck") };
export const Footer = { render: () => footer() };
