import { chrome, parsePage } from "../../src/layout.mjs";
import { initMenu, initCompare, renderShop, renderStays, initSubmitForm } from "../../public/app.js";

const files = import.meta.glob("../../src/pages/*.html", { query: "?raw", import: "default", eager: true });

export default {
  title: "Pages",
  parameters: { docs: { description: { component: "Full pages from src/pages with the shared layout. Use the viewport toolbar to switch phone / tablet / desktop navigation." } } },
};

const page = (name) => () => {
  const { meta, body } = parsePage(files[`../../src/pages/${name}.html`], name);
  const d = document.createElement("div");
  for (const attr of (meta.bodyAttrs ?? "").match(/[\w-]+(="[^"]*")?/g) ?? []) {
    const [k, v = ""] = attr.split("=");
    if (k === "class") d.className = v.replace(/"/g, "");
  }
  d.innerHTML = chrome(meta.section, body);
  initMenu(d);
  d.querySelectorAll("[data-compare]").forEach(initCompare);
  d.querySelectorAll("[data-shop]").forEach(renderShop);
  d.querySelectorAll("[data-stays]").forEach(renderStays);
  d.querySelectorAll("[data-submit-form]").forEach(initSubmitForm);
  return d;
};

export const Home = { render: page("index") };
export const History = { name: "History", render: page("story") };
export const KingPuck = { name: "King Puck", render: page("king-puck") };
export const QueenPuck = { name: "Queen Puck", render: page("queen-puck") };
export const Archive = { name: "The Archive", render: page("archive") };
export const Stories = { render: page("stories") };
export const TheFair = { name: "The Fair", render: page("puck-fair") };
export const WhereToStay = { name: "Where to Stay", render: page("stay") };
export const Shop = { render: page("shop") };
export const Support = { name: "Support the Archive", render: page("support") };
export const About = { render: page("about") };
export const SignIn = { name: "Sign in", render: page("login") };
export const HomePhone = { name: "Home · phone", globals: { viewport: { value: "phone" } }, render: page("index") };
export const HomeTablet = { name: "Home · tablet", globals: { viewport: { value: "tablet" } }, render: page("index") };
