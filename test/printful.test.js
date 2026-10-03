import { test } from "node:test";
import assert from "node:assert/strict";
import { printfulItems, printfulRecipient, sendToPrintful } from "../functions/_lib/printful.js";

const products = [
  { id: "tee", printful: { S: 11, M: 12 } },
  { id: "mug", printful: 21 },
  { id: "book" },
];
const session = {
  id: "cs_test_abc",
  payment_intent: "pi_3Pabc123",
  customer_details: { email: "a@b.ie", name: "Aoife", phone: "+353 1 234" },
  collected_information: { shipping_details: { name: "Aoife Murphy", address: { line1: "1 Main St", line2: null, city: "Killorglin", state: "Kerry", country: "IE", postal_code: "V93 X1Y2" } } },
};

test("maps catalog options to Printful sync variants; the rest is manual", () => {
  const { items, manual } = printfulItems([{ id: "tee", variant: "M", qty: 2 }, { id: "mug", variant: null, qty: 1 }, { id: "book", variant: null, qty: 1 }, { id: "tee", variant: "XL", qty: 1 }], products);
  assert.deepEqual(items, [{ sync_variant_id: 12, quantity: 2 }, { sync_variant_id: 21, quantity: 1 }]);
  assert.deepEqual(manual.map((l) => `${l.id}:${l.variant}`), ["book:null", "tee:XL"]);
});

test("recipient comes from the Stripe shipping details", () => {
  const r = printfulRecipient(session);
  assert.equal(r.name, "Aoife Murphy");
  assert.equal(r.country_code, "IE");
  assert.equal(r.zip, "V93 X1Y2");
  assert.equal(r.email, "a@b.ie");
});

test("creates a draft order keyed by the payment, unless auto-confirm is on", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, init) => {
    calls.push({ url, init });
    return new Response(JSON.stringify({ result: { id: 99, status: "draft" } }), { status: 200 });
  });
  const lines = [{ id: "tee-crowned", variant: "M", qty: 1 }];
  // Real catalog products have no Printful ids yet, so nothing is sent.
  assert.deepEqual(await sendToPrintful(session, lines, { PRINTFUL_API_KEY: "k" }), { skipped: true, manual: lines });
  assert.equal(calls.length, 0);
});

test("sends mapped items with the right headers and treats duplicates as done", async (t) => {
  const { catalog } = await import("../functions/_lib/cart.js");
  const tee = catalog.products.find((p) => p.id === "tee-crowned");
  tee.printful = { M: 555 };
  t.after(() => delete tee.printful);
  const calls = [];
  let reply = { status: 200, body: { result: { id: 99, status: "draft" } } };
  t.mock.method(globalThis, "fetch", async (url, init) => {
    calls.push({ url, init });
    return new Response(JSON.stringify(reply.body), { status: reply.status });
  });
  const lines = [{ id: "tee-crowned", variant: "M", qty: 2 }];
  const out = await sendToPrintful(session, lines, { PRINTFUL_API_KEY: "k", PRINTFUL_STORE_ID: "7" });
  assert.deepEqual(out, { id: 99, status: "draft", manual: [] });
  assert.equal(calls[0].url, "https://api.printful.com/orders?confirm=false");
  assert.equal(calls[0].init.headers.Authorization, "Bearer k");
  assert.equal(calls[0].init.headers["X-PF-Store-Id"], "7");
  const body = JSON.parse(calls[0].init.body);
  assert.equal(body.external_id, "pi_3Pabc123");
  assert.deepEqual(body.items, [{ sync_variant_id: 555, quantity: 2 }]);

  await sendToPrintful(session, lines, { PRINTFUL_API_KEY: "k", PRINTFUL_AUTO_CONFIRM: "true" });
  assert.equal(calls[1].url, "https://api.printful.com/orders?confirm=true");

  reply = { status: 400, body: { error: { message: "Order with this external ID already exists" } } };
  assert.deepEqual(await sendToPrintful(session, lines, { PRINTFUL_API_KEY: "k" }), { duplicate: true, manual: [] });

  reply = { status: 500, body: { error: { message: "boom" } } };
  await assert.rejects(sendToPrintful(session, lines, { PRINTFUL_API_KEY: "k" }), /Printful 500: boom/);
});
