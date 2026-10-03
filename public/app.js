// King Puck site behaviour: menu, then/now slider, cart + shop, archive submissions, VRBO stays.
const CART_KEY = "kingpuck.cart";
const fmt = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });
const money = (cents) => fmt.format(cents / 100);
const priceOf = (p, v) => p.variantPrices?.[v] ?? p.price;

let catalog = null;
const loadCatalog = () => (catalog ??= fetch("/api/products").then((r) => r.json()));

/* ---------- Menu (phone sheet, opened from the bottom bar) ---------- */
export function initMenu(root = document) {
  const header = root.querySelector(".masthead");
  const buttons = [...root.querySelectorAll("[data-menu]")];
  if (!header || !buttons.length) return;
  const set = (open) => {
    header.classList.toggle("menu-open", open);
    document.body.classList.toggle("menu-open", open);
    buttons.forEach((b) => b.setAttribute("aria-expanded", open));
  };
  buttons.forEach((b) => (b.onclick = () => set(!header.classList.contains("menu-open"))));
  header.querySelectorAll(".site-nav a").forEach((a) => a.addEventListener("click", () => set(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && set(false));
}

/* ---------- Then / Now ---------- */
export function initCompare(el) {
  const input = el.querySelector("input[type=range]");
  const set = () => el.style.setProperty("--pos", `${input.value}%`);
  input.addEventListener("input", set);
  set();
}

/* ---------- Cart ---------- */
function readCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
}
function writeCart(cart) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
  renderCart();
}
function addToCart(id, variant) {
  const cart = readCart();
  const line = cart.find((l) => l.id === id && l.variant === variant);
  if (line) line.qty = Math.min(line.qty + 1, 20);
  else cart.push({ id, variant, qty: 1 });
  writeCart(cart);
  openCart();
}
function setQty(index, qty) {
  const cart = readCart();
  if (qty < 1) cart.splice(index, 1);
  else cart[index].qty = Math.min(qty, 20);
  writeCart(cart);
}
export const openCart = () => document.body.classList.add("cart-open");
const closeCart = () => document.body.classList.remove("cart-open");

export async function renderCart() {
  const cart = readCart();
  const count = cart.reduce((n, l) => n + l.qty, 0);
  document.querySelectorAll("[data-cart-count]").forEach((el) => (el.textContent = count));
  const list = document.querySelector(".cart-items");
  const subtotalEl = document.querySelector("[data-subtotal]");
  const noteEl = document.querySelector("[data-ship-note]");
  const checkoutBtn = document.querySelector("[data-checkout]");
  if (!list || !subtotalEl || !checkoutBtn) return;
  if (!cart.length) {
    list.innerHTML = `<li class="empty" style="display:block">Your cart is empty.</li>`;
    subtotalEl.textContent = money(0);
    if (noteEl) noteEl.textContent = "";
    checkoutBtn.disabled = true;
    return;
  }
  const { products, freeShippingOver } = await loadCatalog();
  let subtotal = 0;
  list.innerHTML = "";
  cart.forEach((l, i) => {
    const p = products.find((x) => x.id === l.id);
    if (!p) return;
    const unit = priceOf(p, l.variant);
    subtotal += unit * l.qty;
    const li = document.createElement("li");
    li.innerHTML = `<img src="${p.image}" alt=""><div><div class="name"></div><div class="qty"><button type="button" aria-label="Decrease">−</button><span>${l.qty}</span><button type="button" aria-label="Increase">+</button></div></div><div class="price">${money(unit * l.qty)}</div>`;
    li.querySelector(".name").textContent = l.variant ? `${p.name} (${l.variant})` : p.name;
    const [dec, inc] = li.querySelectorAll(".qty button");
    dec.onclick = () => setQty(i, l.qty - 1);
    inc.onclick = () => setQty(i, l.qty + 1);
    list.append(li);
  });
  subtotalEl.textContent = money(subtotal);
  const left = freeShippingOver - subtotal;
  if (noteEl) noteEl.textContent = left > 0 ? `Add ${money(left)} more for free shipping.` : "You've unlocked free shipping.";
  checkoutBtn.disabled = false;
}

async function checkout(btn) {
  const err = document.querySelector("[data-cart-error]");
  err.textContent = "";
  btn.disabled = true;
  btn.textContent = "Starting checkout…";
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: readCart() }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Checkout failed.");
    location.href = data.url;
  } catch (e) {
    err.textContent = e.message;
    btn.disabled = false;
    btn.textContent = "Checkout securely";
  }
}

/* ---------- Shop ---------- */
export function productCard(p, categoryName = "", onAdd = () => {}) {
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `<img src="${p.image}" alt="" loading="lazy"><div class="card-body"><span class="cat"></span><h3></h3><p></p><div class="card-foot"><span class="price"></span>${p.variants ? `<select aria-label="Option">${p.variants.map((v) => `<option>${v}</option>`).join("")}</select>` : ""}<button class="btn" type="button">Add</button></div></div>`;
  card.querySelector(".cat").textContent = categoryName;
  card.querySelector("h3").textContent = p.name;
  card.querySelector("p").textContent = p.description;
  const price = card.querySelector(".price");
  const select = card.querySelector("select");
  const update = () => (price.textContent = money(priceOf(p, select?.value)));
  select?.addEventListener("change", update);
  update();
  card.querySelector("button").onclick = () => onAdd(p.id, select?.value ?? null);
  return card;
}

export async function renderShop(root) {
  const { categories, products } = await loadCatalog();
  const limit = Number(root.dataset.limit) || Infinity;
  const filters = root.querySelector(".filters");
  const grid = root.querySelector(".grid");
  const catName = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  let active = new URLSearchParams(location.search).get("c") || "all";

  if (filters) {
    for (const c of [{ id: "all", name: "Everything" }, ...categories]) {
      const b = document.createElement("button");
      b.className = "chip";
      b.type = "button";
      b.textContent = c.name;
      b.setAttribute("aria-pressed", c.id === active);
      b.onclick = () => {
        active = c.id;
        filters.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-pressed", x === b));
        history.replaceState(null, "", c.id === "all" ? location.pathname : `?c=${c.id}`);
        draw();
      };
      filters.append(b);
    }
  }

  function draw() {
    grid.innerHTML = "";
    const list = products.filter((p) => active === "all" || p.category === active).slice(0, limit);
    if (!list.length) grid.innerHTML = `<p class="muted">New pieces for this collection are on the way.</p>`;
    list.forEach((p) => grid.append(productCard(p, catName[p.category], addToCart)));
  }
  draw();
}

/* ---------- Archive submissions ---------- */
export function initSubmitForm(form) {
  const status = form.querySelector("[data-form-status]");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type=submit]");
    status.className = "form-status";
    status.textContent = "Sending…";
    btn.disabled = true;
    try {
      const res = await fetch("/api/submit", { method: "POST", body: new FormData(form) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      form.reset();
      status.classList.add("ok");
      status.textContent = "Thank you. Your contribution has been received and will be reviewed for the archive.";
    } catch (err) {
      status.classList.add("err");
      status.textContent = err.message;
    } finally {
      btn.disabled = false;
    }
  });
}

/* ---------- Stays (VRBO) ---------- */
export function stayArea(a, cfg) {
  const link = document.createElement("a");
  link.className = "stay-area";
  link.href = vrboSearch(a.query, cfg);
  link.target = "_blank";
  link.rel = "noopener sponsored";
  link.innerHTML = `<span class="caption"></span><b></b><span></span>`;
  const [dist, name, note] = link.children;
  dist.textContent = a.distance;
  name.textContent = `${a.name} →`;
  note.textContent = a.note;
  return link;
}
export function vrboSearch(query, cfg) {
  const u = new URL("https://www.vrbo.com/search");
  u.searchParams.set("destination", query);
  if (cfg.fair?.checkIn) u.searchParams.set("startDate", cfg.fair.checkIn);
  if (cfg.fair?.checkOut) u.searchParams.set("endDate", cfg.fair.checkOut);
  if (cfg.affiliateId) u.searchParams.set("affcid", cfg.affiliateId);
  return u.toString();
}
function withAffiliate(url, cfg) {
  if (!cfg.affiliateId) return url;
  const u = new URL(url);
  u.searchParams.set("affcid", cfg.affiliateId);
  return u.toString();
}
export async function renderStays(root) {
  const cfg = await fetch("/stays.json").then((r) => r.json());
  const label = root.querySelector("[data-fair-label]");
  if (cfg.fair?.label) label.textContent = cfg.fair.label;
  root.querySelector("[data-vrbo-main]").href = vrboSearch(cfg.areas[0].query, cfg);

  const areas = root.querySelector("[data-areas]");
  for (const a of cfg.areas) areas.append(stayArea(a, cfg));

  if (cfg.featured?.length) {
    root.querySelector("[data-featured]").hidden = false;
    const grid = root.querySelector("[data-featured-grid]");
    for (const s of cfg.featured) {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `<img alt="" loading="lazy"><div class="card-body"><span class="cat"></span><h3></h3><p></p><div class="card-foot"><span class="price"></span><a class="btn red" target="_blank" rel="noopener sponsored">View on VRBO</a></div></div>`;
      card.querySelector("img").src = s.image;
      card.querySelector(".cat").textContent = [s.area, s.sleeps && `Sleeps ${s.sleeps}`].filter(Boolean).join(" · ");
      card.querySelector("h3").textContent = s.title;
      card.querySelector("p").textContent = s.description ?? "";
      card.querySelector(".price").textContent = s.priceFrom ? `From ${s.priceFrom}/night` : "";
      card.querySelector("a").href = withAffiliate(s.url, cfg);
      grid.append(card);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  document.querySelectorAll("[data-compare]").forEach(initCompare);
  document.querySelectorAll("[data-open-cart]").forEach((b) => (b.onclick = openCart));
  document.querySelectorAll("[data-close-cart]").forEach((b) => (b.onclick = closeCart));
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeCart());
  const co = document.querySelector("[data-checkout]");
  if (co) co.onclick = () => checkout(co);
  document.querySelectorAll("[data-shop]").forEach(renderShop);
  document.querySelectorAll("[data-submit-form]").forEach(initSubmitForm);
  document.querySelectorAll("[data-stays]").forEach(renderStays);
  if (document.body.hasAttribute("data-clear-cart")) writeCart([]);
  renderCart();
});
