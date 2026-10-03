// Sends paid orders to Printful for printing and shipping (EU and US production).
// A catalog product opts in with a `printful` field holding Printful *sync variant* ids
// (Printful dashboard → Stores → your store → product → variant), either one id or one per option:
//   "printful": 4321             or   "printful": { "S": 4321, "M": 4322, ... }
// Products without it (books, pins, signed editions) are left for you to send yourself.
import { catalog } from "./cart.js";

const API = "https://api.printful.com";

// lines: [{ id, variant, qty }] from the Stripe session's line items.
export function printfulItems(lines, products = catalog.products) {
  const items = [], manual = [];
  for (const l of lines) {
    const p = products.find((x) => x.id === l.id);
    const map = p?.printful;
    const syncVariantId = typeof map === "object" && map !== null ? map[l.variant] : map;
    if (syncVariantId) items.push({ sync_variant_id: syncVariantId, quantity: l.qty });
    else manual.push(l);
  }
  return { items, manual };
}

export function printfulRecipient(session) {
  const ship = session.shipping_details ?? session.collected_information?.shipping_details ?? {};
  const a = ship.address ?? session.customer_details?.address ?? {};
  return {
    name: ship.name ?? session.customer_details?.name ?? "",
    address1: a.line1 ?? "",
    address2: a.line2 ?? undefined,
    city: a.city ?? "",
    state_code: a.state || undefined,
    country_code: a.country ?? "",
    zip: a.postal_code ?? "",
    email: session.customer_details?.email ?? undefined,
    phone: session.customer_details?.phone ?? undefined,
  };
}

// Stripe sends the session without line items; read them back with our product metadata.
export async function stripeLineItems(sessionId, env) {
  const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}/line_items?limit=100&expand[]=data.price.product`, {
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` },
  });
  if (!res.ok) throw new Error(`Stripe line items: ${res.status}`);
  const { data } = await res.json();
  return data.map((li) => ({ id: li.price.product.metadata.product_id, variant: li.price.product.metadata.variant ?? null, qty: li.quantity }));
}

// Creates the Printful order. Orders are drafts (you approve them in Printful) unless
// PRINTFUL_AUTO_CONFIRM is "true". The payment id is the external id, so Stripe's
// webhook retries can't create a second order.
export async function sendToPrintful(session, lines, env) {
  const { items, manual } = printfulItems(lines);
  if (!items.length) return { skipped: true, manual };
  const confirm = env.PRINTFUL_AUTO_CONFIRM === "true";
  const externalId = String(session.payment_intent ?? session.id).replace(/[^A-Za-z0-9_-]/g, "").slice(-32);
  const res = await fetch(`${API}/orders?confirm=${confirm}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.PRINTFUL_API_KEY}`,
      "Content-Type": "application/json",
      ...(env.PRINTFUL_STORE_ID ? { "X-PF-Store-Id": env.PRINTFUL_STORE_ID } : {}),
    },
    body: JSON.stringify({ external_id: externalId, shipping: "STANDARD", recipient: printfulRecipient(session), items }),
  });
  const body = await res.json().catch(() => ({}));
  if (res.ok) return { id: body.result?.id, status: body.result?.status, manual };
  if (/already exists/i.test(body.error?.message ?? body.result ?? "")) return { duplicate: true, manual };
  throw new Error(`Printful ${res.status}: ${body.error?.message ?? JSON.stringify(body)}`);
}
