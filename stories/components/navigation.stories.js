import { header, sidebar, tabbar, footer, sectionIndex } from "../../src/layout.mjs";
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
export const SidebarTablet = {
  name: "Sidebar · tablet",
  globals: { viewport: { value: "tablet" } },
  parameters: { docs: { description: { story: "700–1199px. All sections with icons; the current section expands to its sub-pages." } } },
  render: () => mount(`${header("/king-puck")}${sidebar("/king-puck")}<div class="page">${sample}</div>`),
};
export const BottomBarPhone = {
  name: "Bottom bar · phone",
  globals: { viewport: { value: "phone" } },
  parameters: { docs: { description: { story: "Under 700px. Four destinations plus Menu, which opens the full hierarchy as a sheet." } } },
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
