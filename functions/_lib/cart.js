import catalog from "./catalog.json" with { type: "json" };

export { catalog };

const MAX_QTY = 20;
const MAX_LINES = 30;

export function priceFor(product, variant) {
  return product.variantPrices?.[variant] ?? product.price;
}

// Resolves a client cart against the catalog. Only ids, variants and quantities
// are taken from the client; names and prices always come from the catalog.
export function resolveCart(items, cat = catalog) {
  if (!Array.isArray(items) || items.length === 0) throw new CartError("Your cart is empty.");
  if (items.length > MAX_LINES) throw new CartError("Too many items in cart.");

  const lines = items.map((item) => {
    const product = cat.products.find((p) => p.id === item?.id);
    if (!product) throw new CartError(`Unknown product: ${item?.id}`);

    const qty = Number(item.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
      throw new CartError(`Invalid quantity for ${product.name}.`);
    }

    let variant = null;
    if (product.variants) {
      if (!product.variants.includes(item.variant)) {
        throw new CartError(`Please choose an option for ${product.name}.`);
      }
      variant = item.variant;
    }

    return {
      id: product.id,
      name: variant ? `${product.name} (${variant})` : product.name,
      variant,
      qty,
      unitAmount: priceFor(product, variant),
    };
  });

  const subtotal = lines.reduce((sum, l) => sum + l.unitAmount * l.qty, 0);
  return { lines, subtotal };
}

export class CartError extends Error {}
