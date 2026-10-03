import { getSession, normalizeEmail } from "../_lib/auth.js";

// Orders and archive submissions for the signed-in customer.
export async function onRequestGet({ request, env }) {
  const session = await getSession(request, env);
  if (!session) return Response.json({ error: "Please sign in." }, { status: 401 });

  const prefix = `customer:${normalizeEmail(session.email)}:`;
  const { keys } = await env.AUTH.list({ prefix, limit: 200 });
  const items = await Promise.all(keys.map(async (k) => ({ key: k.name, data: await env.AUTH.get(k.name, "json") })));
  const of = (kind) => items.filter((i) => i.key.startsWith(`${prefix}${kind}:`)).map((i) => i.data).sort((a, b) => (b.created ?? b.received ?? "").localeCompare(a.created ?? a.received ?? ""));
  return Response.json({ email: session.email, orders: of("order"), submissions: of("submission") }, { headers: { "Cache-Control": "no-store" } });
}
