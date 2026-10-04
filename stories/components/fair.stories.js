import { pageSection } from "../_pages.js";
import { initTagTips } from "../../public/app.js";

export default {
  title: "Sections/The Fair",
  parameters: { docs: { description: { component: "Sections read straight from src/pages/puck-fair.html: the canonical three days with add-to-calendar menus, the programme day cards, the traditions list and getting there." } } },
};

const el = (html, init) => {
  const d = document.createElement("main");
  d.className = "page-stack";
  d.innerHTML = html;
  init?.(d);
  return d;
};

export const ThreeDays = { name: "Three days (+ add to calendar)", render: () => el(pageSection("puck-fair", "three-days")) };
export const Programme = { name: "Programme (day cards)", render: () => el(pageSection("puck-fair", "schedule")) };
export const Coronation = { render: () => el(pageSection("puck-fair", "coronation"), initTagTips) };
export const Traditions = { name: "Traditions (dark photo band, ruled list)", render: () => el(pageSection("puck-fair", "traditions"), initTagTips) };
export const GettingThere = { name: "Getting there (split + note box)", render: () => el(pageSection("puck-fair", "visit")) };
