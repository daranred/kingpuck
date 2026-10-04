import { pageSection } from "../_pages.js";
import { initTagTips } from "../../public/app.js";

export default {
  title: "Sections/History",
  parameters: { docs: { description: { component: "Sections read straight from src/pages/story.html. The chronology is the .timeline component: era rows, a marker line, the timeframe on the marker's line with the evidence badge right-aligned, and a card per entry. Hover or focus any badge for its definition." } } },
};

const el = (html) => {
  const d = document.createElement("main");
  d.className = "page-stack";
  d.innerHTML = html;
  initTagTips(d);
  return d;
};

export const Chronology = { name: "Chronology (timeline)", render: () => el(pageSection("story", "history")) };
export const WhatIsPuckFair = { name: "What is Puck Fair? (split)", render: () => el(pageSection("story", "what-is-puck-fair")) };
export const WhyAGoat = { name: "Why a goat? (badges in prose)", render: () => el(pageSection("story", "why-a-goat")) };
export const Legend = { name: "The legend (dark photo band)", render: () => el(pageSection("story", "legend")) };
export const Sources = { name: "Sources (ruled list)", render: () => el(pageSection("story", "sources")) };
