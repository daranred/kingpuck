import { verifyStripeSignature } from "../_lib/stripe.js";

export async function onRequestPost({ request, env }) {
  const payload = await request.text();
  const ok = await verifyStripeSignature(payload, request.headers.get("Stripe-Signature"), env.STRIPE_WEBHOOK_SECRET ?? "");
  if (!ok) return new Response("Bad signature", { status: 400 });

  const event = JSON.parse(payload);
  if (event.type === "checkout.session.completed") {
    const s = event.data.object;
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
    if (env.ORDERS) await env.ORDERS.put(`order:${order.created}:${order.id}`, JSON.stringify(order));
  }
  return new Response("ok");
}
