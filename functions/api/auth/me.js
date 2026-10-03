import { getSession } from "../../_lib/auth.js";

export async function onRequestGet({ request, env }) {
  const session = await getSession(request, env);
  if (!session) return Response.json({ signedIn: false, available: Boolean(env.AUTH && (env.RESEND_API_KEY || env.DEV_LOG_MAGIC_LINKS === "true")) }, { headers: { "Cache-Control": "no-store" } });
  return Response.json({ signedIn: true, email: session.email }, { headers: { "Cache-Control": "no-store" } });
}
