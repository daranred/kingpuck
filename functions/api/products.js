import { catalog } from "../_lib/cart.js";

export function onRequestGet() {
  const { categories, products, shipping } = catalog;
  return Response.json(
    { categories, products, freeShippingOver: shipping.freeOver },
    { headers: { "Cache-Control": "public, max-age=300" } },
  );
}
