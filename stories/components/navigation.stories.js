import { header, tabbar, footer, sectionIndex } from "../../src/layout.mjs";
import { initMenu, initSectionIndex } from "../../public/app.js";

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
  parameters: { docs: { description: { story: "Under 1200px the same nav list becomes a sheet, opened from the Menu button in the masthead." } } },
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
export const MastheadWithCart = {
  name: "Masthead · items in the cart",
  globals: { viewport: { value: "desktop" } },
  parameters: { docs: { description: { story: "Account, cart and menu are one style of 44px icon button. The cart count is a round badge over the icon's corner, hidden at zero." } } },
  render: () =>
    mount(header("/shop") + sample, (d) => {
      const n = d.querySelector("[data-cart-count]");
      n.textContent = "4";
      n.hidden = false;
    }),
};
export const SectionIndex = {
  name: "Section index",
  parameters: { docs: { description: { story: "Sticky under the masthead on every page. Links fill the strip so the 4px current-item bar sits on its bottom line; app.js highlights the section in view while scrolling and on click." } } },
  render: () => mount(sectionIndex("/king-puck"), (d) => d.querySelector("a").classList.add("is-current")),
};
export const SectionIndexChildPage = {
  name: "Section index · on a child page",
  parameters: { docs: { description: { story: "On a child page of a section (Where to Stay under The Fair) the links point back to the section page and the child page shows as current." } } },
  render: () => sectionIndex("/puck-fair", "/stay"),
};
export const SectionIndexLive = {
  name: "Section index · scroll spy",
  render: () =>
    mount(`${sectionIndex("/story")}${["what-is-puck-fair", "history", "why-a-goat", "legend", "sources"].map((id, i) => `<section class="content-section" id="${id}"><div class="wrap"><h2>${["What Is Puck Fair?", "Chronology", "Why a Goat?", "The Legend", "Sources"][i]}</h2><div class="ph-photo" style="height:480px"><span>Scroll</span></div></div></section>`).join("")}`, (d) => initSectionIndex(d)),
};
export const Footer = { render: () => footer() };
