import { readCookie, sha256, sessionCookie, SESSION_COOKIE } from "../../_lib/auth.js";

export async function onRequestPost({ request, env }) {
  const sid = readCookie(request, SESSION_COOKIE);
  if (sid && env.AUTH) await env.AUTH.delete(`session:${await sha256(sid)}`);
  return Response.json({ ok: true }, { headers: { "Set-Cookie": sessionCookie("", 0) } });
}
