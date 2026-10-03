import "../public/tokens.css";
import "../public/styles.css";

/** @type { import('@storybook/html-vite').Preview } */
export default {
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      options: {
        paper: { name: "Paper", value: "#efe8da" },
        night: { name: "Night", value: "#121211" },
        card: { name: "Card", value: "#f7f2e7" },
      },
    },
    viewport: {
      options: {
        phone: { name: "Phone · 390", styles: { width: "390px", height: "844px" }, type: "mobile" },
        tablet: { name: "Tablet · 820", styles: { width: "820px", height: "1180px" }, type: "tablet" },
        desktop: { name: "Desktop · 1280", styles: { width: "1280px", height: "900px" }, type: "desktop" },
      },
    },
    options: {
      storySort: { order: ["Introduction", "Foundations", "Layout", "Components", "Sections", "Navigation", "Commerce", "Forms", "Pages"] },
    },
  },
  initialGlobals: { backgrounds: { value: "paper" } },
};

// Storybook has no Pages Functions: answer the shop's API calls from the real catalog.
import catalog from "../functions/_lib/catalog.js";
const realFetch = window.fetch.bind(window);
window.fetch = (input, init) => {
  const url = typeof input === "string" ? input : input.url;
  if (url.endsWith("/api/products")) {
    const { categories, products, shipping } = catalog;
    return Promise.resolve(Response.json({ categories, products, freeShippingOver: shipping.freeOver }));
  }
  if (url.endsWith("/api/checkout") || url.endsWith("/api/submit")) {
    return Promise.resolve(Response.json({ error: "Not available in Storybook." }, { status: 503 }));
  }
  return realFetch(input, init);
};
