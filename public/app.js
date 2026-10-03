// Cart (localStorage) + shop rendering + checkout. Shared by every page.
const CART_KEY = "kingpuck.cart";
const fmt = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });
const money = (cents) => fmt.format(cents / 100);

let catalog = null;
const loadCatalog = () => (catalog ??= fetch("/api/products").then((r) => r.json()));

function readCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
}
function writeCart(cart) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
  renderCart();
}
const priceOf = (p, v) => p.variantPrices?.[v] ?? p.price;

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

function openCart() { document.body.classList.add("cart-open"); }
function closeCart() { document.body.classList.remove("cart-open"); }

async function renderCart() {
  const cart = readCart();
  const count = cart.reduce((n, l) => n + l.qty, 0);
  document.querySelectorAll("[data-cart-count]").forEach((el) => (el.textContent = count));

  const list = document.querySelector(".cart-items");
  if (!list) return;
  const { products, freeShippingOver } = await loadCatalog();
  let subtotal = 0;
  list.innerHTML = "";
  cart.forEach((l, i) => {
    const p = products.find((x) => x.id === l.id);
    if (!p) return;
    const unit = priceOf(p, l.variant);
    subtotal += unit * l.qty;
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${p.image}" alt="">
      <div>
        <div class="name"></div>
        <div class="qty">
          <button type="button" aria-label="Decrease">−</button><span>${l.qty}</span><button type="button" aria-label="Increase">+</button>
        </div>
      </div>
      <div class="price">${money(unit * l.qty)}</div>`;
    li.querySelector(".name").textContent = l.variant ? `${p.name} (${l.variant})` : p.name;
    const [dec, inc] = li.querySelectorAll(".qty button");
    dec.onclick = () => setQty(i, l.qty - 1);
    inc.onclick = () => setQty(i, l.qty + 1);
    list.append(li);
  });
  if (!cart.length) list.innerHTML = `<li class="empty" style="display:block">Your cart is empty.</li>`;

  document.querySelector("[data-subtotal]").textContent = money(subtotal);
  const left = freeShippingOver - subtotal;
  document.querySelector("[data-ship-note]").textContent =
    !cart.length ? "" : left > 0 ? `Add ${money(left)} more for free shipping.` : "You've unlocked free shipping!";
  document.querySelector("[data-checkout]").disabled = !cart.length;
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

async function renderShop(root) {
  const { categories, products } = await loadCatalog();
  const limit = Number(root.dataset.limit) || Infinity;
  const filters = root.querySelector(".filters");
  const grid = root.querySelector(".grid");
  let active = new URLSearchParams(location.search).get("c") || "all";

  if (filters) {
    filters.innerHTML = "";
    for (const c of [{ id: "all", name: "Everything" }, ...categories]) {
      const b = document.createElement("button");
      b.className = "chip";
      b.type = "button";
      b.textContent = c.name;
      b.setAttribute("aria-pressed", c.id === active);
      b.onclick = () => {
        active = c.id;
        filters.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-pressed", x === b));
        draw();
      };
      filters.append(b);
    }
  }

  function draw() {
    grid.innerHTML = "";
    products
      .filter((p) => active === "all" || p.category === active)
      .slice(0, limit)
      .forEach((p) => {
        const card = document.createElement("article");
        card.className = "card";
        card.innerHTML = `
          <img src="${p.image}" alt="" loading="lazy">
          <div class="card-body">
            <h3></h3><p></p>
            <div class="card-foot">
              <span class="price"></span>
              ${p.variants ? `<select aria-label="Option">${p.variants.map((v) => `<option>${v}</option>`).join("")}</select>` : ""}
              <button class="btn" type="button">Add</button>
            </div>
          </div>`;
        card.querySelector("h3").textContent = p.name;
        card.querySelector("p").textContent = p.description;
        const price = card.querySelector(".price");
        const select = card.querySelector("select");
        const update = () => (price.textContent = money(priceOf(p, select?.value)));
        select?.addEventListener("change", update);
        update();
        card.querySelector("button").onclick = () => addToCart(p.id, select?.value ?? null);
        grid.append(card);
      });
  }
  draw();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-open-cart]").forEach((b) => (b.onclick = openCart));
  document.querySelectorAll("[data-close-cart]").forEach((b) => (b.onclick = closeCart));
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeCart());
  const co = document.querySelector("[data-checkout]");
  if (co) co.onclick = () => checkout(co);
  document.querySelectorAll("[data-shop]").forEach(renderShop);
  if (document.body.dataset.clearCart !== undefined) writeCart([]);
  renderCart();
});
