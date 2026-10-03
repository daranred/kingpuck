import { randomToken, sha256, sessionCookie, SESSION_DAYS } from "../../_lib/auth.js";

export async function onRequestGet({ request, env }) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (!env.AUTH || !/^[a-f0-9]{64}$/.test(token)) return Response.redirect(new URL("/login?error=invalid", request.url), 302);

  const key = `login:${await sha256(token)}`;
  const login = await env.AUTH.get(key, "json");
  if (!login) return Response.redirect(new URL("/login?error=expired", request.url), 302);
  await env.AUTH.delete(key); // single use

  const sid = randomToken();
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  await env.AUTH.put(`session:${await sha256(sid)}`, JSON.stringify({ email: login.email, created: new Date().toISOString() }), {
    expirationTtl: maxAge,
  });
  return new Response(null, {
    status: 302,
    headers: { Location: new URL(login.next || "/account", request.url).toString(), "Set-Cookie": sessionCookie(sid, maxAge) },
  });
}
