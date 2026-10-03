import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveCart, CartError } from "../functions/_lib/cart.js";
import { checkoutParams, verifyStripeSignature } from "../functions/_lib/stripe.js";

test("prices come from the catalog, including variant prices", () => {
  const { lines, subtotal } = resolveCart([
    { id: "tee-crowned", variant: "M", qty: 2, unitAmount: 1 },
    { id: "poster-vintage", variant: "A1", qty: 1 },
  ]);
  assert.equal(lines[0].unitAmount, 2800);
  assert.equal(lines[0].name, "Crowned King T-shirt (M)");
  assert.equal(lines[1].unitAmount, 4500);
  assert.equal(subtotal, 2800 * 2 + 4500);
});

test("rejects bad carts", () => {
  assert.throws(() => resolveCart([]), CartError);
  assert.throws(() => resolveCart([{ id: "nope", qty: 1 }]), CartError);
  assert.throws(() => resolveCart([{ id: "tee-crowned", variant: "XS", qty: 1 }]), CartError);
  assert.throws(() => resolveCart([{ id: "mug-king", qty: 0 }]), CartError);
  assert.throws(() => resolveCart([{ id: "mug-king", qty: 1.5 }]), CartError);
});

test("free shipping applies over the threshold", () => {
  const small = checkoutParams(resolveCart([{ id: "stickers", qty: 1 }]), { siteUrl: "https://x", currency: "eur" });
  assert.equal(small.get("shipping_options[0][shipping_rate_data][fixed_amount][amount]"), "500");
  const big = checkoutParams(resolveCart([{ id: "hoodie-reeks", variant: "L", qty: 2 }]), { siteUrl: "https://x", currency: "eur" });
  assert.equal(big.get("shipping_options[0][shipping_rate_data][fixed_amount][amount]"), "0");
  assert.equal(big.get("line_items[0][price_data][unit_amount]"), "5500");
});

test("verifies Stripe signatures", async () => {
  const secret = "whsec_test";
  const payload = '{"type":"x"}';
  const t = Math.floor(Date.now() / 1000);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${t}.${payload}`));
  const sig = Buffer.from(mac).toString("hex");
  assert.equal(await verifyStripeSignature(payload, `t=${t},v1=${sig}`, secret), true);
  assert.equal(await verifyStripeSignature(payload + " ", `t=${t},v1=${sig}`, secret), false);
  assert.equal(await verifyStripeSignature(payload, `t=${t - 1000},v1=${sig}`, secret), false);
  assert.equal(await verifyStripeSignature(payload, null, secret), false);
});

import { safeNext, readCookie, sha256, normalizeEmail, validEmail } from "../functions/_lib/auth.js";

test("auth helpers", async () => {
  assert.equal(safeNext("/shop?c=prints"), "/shop?c=prints");
  assert.equal(safeNext("//evil.com"), "/account");
  assert.equal(safeNext("https://evil.com"), "/account");
  assert.equal(safeNext(undefined), "/account");
  const req = new Request("https://x", { headers: { Cookie: "a=1; kp_session=abc%3D; b=2" } });
  assert.equal(readCookie(req, "kp_session"), "abc=");
  assert.equal(readCookie(req, "missing"), null);
  assert.equal((await sha256("x")).length, 64);
  assert.equal(normalizeEmail("  Me@Example.COM "), "me@example.com");
  assert.equal(validEmail("me@example.com"), true);
  assert.equal(validEmail("nope"), false);
});
