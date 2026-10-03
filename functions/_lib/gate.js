// Site-wide password gate (HTTP Basic auth). On only when SITE_PASSWORD is set.
// Any username works; only the password is checked.

// Stripe calls this from its servers, so it can't answer a password prompt.
const OPEN_PATHS = ["/api/stripe-webhook"];

export async function checkGate(request, password) {
  if (!password) return null;
  if (OPEN_PATHS.includes(new URL(request.url).pathname)) return null;
  if (await matches(request.headers.get("Authorization"), password)) return null;
  return new Response("Password required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="King Puck", charset="UTF-8"', "Cache-Control": "no-store" },
  });
}

async function matches(header, password) {
  const m = /^Basic\s+(.+)$/i.exec(header ?? "");
  if (!m) return false;
  let decoded;
  try {
    decoded = new TextDecoder().decode(Uint8Array.from(atob(m[1]), (c) => c.charCodeAt(0)));
  } catch {
    return false;
  }
  const given = decoded.slice(decoded.indexOf(":") + 1);
  // Compare digests so the check takes the same time however much of the password is right.
  const [a, b] = await Promise.all([given, password].map((s) => crypto.subtle.digest("SHA-256", new TextEncoder().encode(s))));
  const x = new Uint8Array(a), y = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}
