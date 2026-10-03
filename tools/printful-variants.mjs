// Lists your Printful store's sync variant ids, to paste into "printful" fields in functions/_lib/catalog.js.
// Usage: PRINTFUL_API_KEY=... [PRINTFUL_STORE_ID=...] node tools/printful-variants.mjs
const key = process.env.PRINTFUL_API_KEY;
if (!key) {
  console.error("Set PRINTFUL_API_KEY (Printful → Settings → API access).");
  process.exit(1);
}
const headers = { Authorization: `Bearer ${key}`, ...(process.env.PRINTFUL_STORE_ID ? { "X-PF-Store-Id": process.env.PRINTFUL_STORE_ID } : {}) };
const get = async (path) => {
  const res = await fetch(`https://api.printful.com${path}`, { headers });
  const body = await res.json();
  if (!res.ok) throw new Error(`${path}: ${body.error?.message ?? res.status}`);
  return body;
};

for (let offset = 0; ; offset += 100) {
  const { result: products, paging } = await get(`/store/products?limit=100&offset=${offset}`);
  for (const p of products) {
    const { result } = await get(`/store/products/${p.id}`);
    console.log(`\n${p.name}`);
    for (const v of result.sync_variants) console.log(`  ${String(v.id).padEnd(12)} ${v.name}`);
  }
  if (!paging || offset + 100 >= paging.total) break;
}
