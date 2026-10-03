import { resolveCart, CartError } from "../_lib/cart.js";
import { checkoutParams } from "../_lib/stripe.js";
import { getSession } from "../_lib/auth.js";

export async function onRequestPost({ request, env }) {
  if (!env.STRIPE_SECRET_KEY) {
    return Response.json({ error: "The shop isn't taking orders just yet — check back soon." }, { status: 503 });
  }

  let cart;
  try {
    const body = await request.json();
    cart = resolveCart(body.items);
  } catch (err) {
    const message = err instanceof CartError ? err.message : "Invalid request.";
    return Response.json({ error: message }, { status: 400 });
  }

  const siteUrl = env.SITE_URL || new URL(request.url).origin;
  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: checkoutParams(cart, { siteUrl, currency: env.CURRENCY || "eur", customerEmail: (await getSession(request, env))?.email }),
  });
  const session = await res.json();
  if (!res.ok) {
    console.error("Stripe error", session.error);
    return Response.json({ error: "Couldn't start checkout. Please try again." }, { status: 502 });
  }
  return Response.json({ url: session.url });
}
