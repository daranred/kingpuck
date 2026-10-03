// Passwordless (magic-link) auth. Tokens and sessions live in KV (binding AUTH), stored by SHA-256 hash only.
export const SESSION_COOKIE = "kp_session";
export const SESSION_DAYS = 30;
export const LINK_MINUTES = 15;

export const randomToken = () => [...crypto.getRandomValues(new Uint8Array(32))].map((b) => b.toString(16).padStart(2, "0")).join("");

export async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const normalizeEmail = (e) => String(e ?? "").trim().toLowerCase();
export const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 254;

export function readCookie(request, name) {
  const header = request.headers.get("Cookie") ?? "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return null;
}

export const sessionCookie = (value, maxAge) =>
  `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;

// Only allow same-site relative redirects after sign-in.
export const safeNext = (next) => (typeof next === "string" && /^\/(?!\/)[\w\-./?=&#%]*$/.test(next) ? next : "/account");

export async function getSession(request, env) {
  if (!env.AUTH) return null;
  const sid = readCookie(request, SESSION_COOKIE);
  if (!sid) return null;
  return env.AUTH.get(`session:${await sha256(sid)}`, "json");
}

// Per-customer index so the account page can list orders and submissions.
export async function indexForCustomer(env, email, kind, id, data) {
  if (!env.AUTH || !email) return;
  await env.AUTH.put(`customer:${normalizeEmail(email)}:${kind}:${id}`, JSON.stringify(data));
}
