import catalog from "../../functions/_lib/catalog.json";
import { productCard, renderShop, stayArea } from "../../public/app.js";
import stays from "../../public/stays.json";

export default { title: "Commerce" };

const names = Object.fromEntries(catalog.categories.map((c) => [c.id, c.name]));
const wrap = (inner) => {
  const d = document.createElement("div");
  d.className = "sb-pad wrap";
  if (typeof inner === "string") d.innerHTML = inner;
  else d.append(inner);
  return d;
};

export const ProductCard = {
  name: "Product card",
  args: { product: "poster-long-live" },
  argTypes: { product: { control: "select", options: catalog.products.map((p) => p.id) } },
  render: ({ product }) => {
    const d = wrap(`<div style="max-width:300px"></div>`);
    d.firstChild.append(productCard(catalog.products.find((p) => p.id === product), names[catalog.products.find((p) => p.id === product).category]));
    return d;
  },
};

export const ShopWithFilters = {
  name: "Shop (filters + grid)",
  render: () => {
    const d = wrap(`<div data-shop><div class="filters" role="group" aria-label="Filter by category"></div><div class="grid"></div></div>`);
    renderShop(d.querySelector("[data-shop]"));
    return d;
  },
};

export const CartDrawer = {
  name: "Cart drawer (open)",
  render: () => `<div style="min-height:700px;position:relative">
    <aside class="drawer is-open" aria-label="Shopping cart" style="position:absolute">
      <header><h2>Your cart</h2><button class="icon-btn" type="button" aria-label="Close cart">×</button></header>
      <ul class="cart-items">
        <li><img src="/img/posters/long-live-the-king.svg" alt=""><div><div class="name">Long Live the King Poster (A2)</div><div class="qty"><button type="button">−</button><span>1</span><button type="button">+</button></div></div><div class="price">€32.00</div></li>
        <li><img src="/img/products/tee.svg" alt=""><div><div class="name">Crowned King T-shirt (M)</div><div class="qty"><button type="button">−</button><span>2</span><button type="button">+</button></div></div><div class="price">€56.00</div></li>
      </ul>
      <footer>
        <div class="row"><span>Subtotal</span><span>€88.00</span></div>
        <p class="note">You've unlocked free shipping.</p>
        <button class="btn red" type="button">Checkout securely</button>
        <p class="note">Shipping and taxes are calculated at checkout.</p>
      </footer>
    </aside></div>`,
};

export const StayAreas = {
  name: "Where to stay (VRBO areas)",
  render: () => {
    const d = wrap(`<div class="stay-areas"></div>`);
    stays.areas.forEach((a) => d.firstChild.append(stayArea(a, stays)));
    return d;
  },
};
