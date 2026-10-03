import { verifyStripeSignature } from "../_lib/stripe.js";
import { indexForCustomer } from "../_lib/auth.js";
import { stripeLineItems, sendToPrintful } from "../_lib/printful.js";

export async function onRequestPost({ request, env }) {
  const payload = await request.text();
  const ok = await verifyStripeSignature(payload, request.headers.get("Stripe-Signature"), env.STRIPE_WEBHOOK_SECRET ?? "");
  if (!ok) return new Response("Bad signature", { status: 400 });

  const event = JSON.parse(payload);
  const s = event.data.object;
  if (event.type === "checkout.session.completed") {
    const order = {
      id: s.id,
      created: new Date(s.created * 1000).toISOString(),
      email: s.customer_details?.email,
      name: s.customer_details?.name,
      shipping: s.shipping_details ?? s.collected_information?.shipping_details ?? null,
      total: s.amount_total,
      currency: s.currency,
      paymentStatus: s.payment_status,
    };
    console.log("Order paid", order.id, order.total);
    if (s.payment_status === "paid") {
      const failed = await fulfil(s, env);
      if (failed) return failed;
    }
    if (env.ORDERS) await env.ORDERS.put(`order:${order.created}:${order.id}`, JSON.stringify(order));
    await indexForCustomer(env, order.email, "order", order.id, { id: order.id, created: order.created, total: order.total, currency: order.currency, status: order.paymentStatus });
  }
  // Bank debits and similar settle later: fulfil once the money has arrived.
  if (event.type === "checkout.session.async_payment_succeeded") {
    const failed = await fulfil(s, env);
    if (failed) return failed;
  }
  return new Response("ok");
}

async function fulfil(session, env) {
  if (!env.PRINTFUL_API_KEY) return null;
  try {
    const result = await sendToPrintful(session, await stripeLineItems(session.id, env), env);
    console.log("Printful", session.id, JSON.stringify(result));
    return null;
  } catch (err) {
    // A 500 makes Stripe retry later; the payment id keeps the retry from duplicating the order.
    console.error("Printful failed", session.id, err.message);
    return new Response("Printful order failed", { status: 500 });
  }
}
