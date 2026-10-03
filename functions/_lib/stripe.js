import { catalog } from "./cart.js";

// Builds the form-encoded body for POST /v1/checkout/sessions.
export function checkoutParams({ lines, subtotal }, { siteUrl, currency }) {
  const p = new URLSearchParams();
  p.set("mode", "payment");
  p.set("success_url", `${siteUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`);
  p.set("cancel_url", `${siteUrl}/shop.html`);
  p.set("billing_address_collection", "auto");
  p.set("phone_number_collection[enabled]", "true");
  p.set("allow_promotion_codes", "true");

  lines.forEach((l, i) => {
    p.set(`line_items[${i}][quantity]`, String(l.qty));
    p.set(`line_items[${i}][price_data][currency]`, currency);
    p.set(`line_items[${i}][price_data][unit_amount]`, String(l.unitAmount));
    p.set(`line_items[${i}][price_data][product_data][name]`, l.name);
    p.set(`line_items[${i}][price_data][product_data][metadata][product_id]`, l.id);
    if (l.variant) p.set(`line_items[${i}][price_data][product_data][metadata][variant]`, l.variant);
  });

  const { shipping } = catalog;
  shipping.allowedCountries.forEach((c, i) => {
    p.set(`shipping_address_collection[allowed_countries][${i}]`, c);
  });
  const free = shipping.freeOver && subtotal >= shipping.freeOver;
  shipping.options.forEach((o, i) => {
    const k = `shipping_options[${i}][shipping_rate_data]`;
    p.set(`${k}[type]`, "fixed_amount");
    p.set(`${k}[display_name]`, free ? `${o.name} (free)` : o.name);
    p.set(`${k}[fixed_amount][amount]`, String(free ? 0 : o.amount));
    p.set(`${k}[fixed_amount][currency]`, currency);
    p.set(`${k}[delivery_estimate][minimum][unit]`, "business_day");
    p.set(`${k}[delivery_estimate][minimum][value]`, String(o.minDays));
    p.set(`${k}[delivery_estimate][maximum][unit]`, "business_day");
    p.set(`${k}[delivery_estimate][maximum][value]`, String(o.maxDays));
  });

  return p;
}

// Verifies a Stripe-Signature header (t=...,v1=...) using Web Crypto.
export async function verifyStripeSignature(payload, header, secret, toleranceSec = 300, now = Date.now()) {
  if (!header) return false;
  let timestamp = null;
  const signatures = [];
  for (const part of header.split(",")) {
    const [k, v] = part.split("=");
    if (k === "t") timestamp = v;
    if (k === "v1") signatures.push(v);
  }
  if (!timestamp || signatures.length === 0) return false;
  if (Math.abs(now / 1000 - Number(timestamp)) > toleranceSec) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`));
  const expected = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return signatures.some((s) => timingSafeEqual(s, expected));
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
