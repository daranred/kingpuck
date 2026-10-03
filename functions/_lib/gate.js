// Site-wide password gate. On only when the SITE_PASSWORD secret is set.
// Visitors see a branded password page; the right password sets a signed,
// HttpOnly cookie for 30 days. Changing SITE_PASSWORD signs everyone out.

export const GATE_COOKIE = "kp_gate";
export const GATE_PATH = "/__gate";
const GATE_DAYS = 30;

// Stripe calls this from its servers, so it can't fill in a password.
// The emblem and favicon are shown on the password page itself.
const OPEN_PATHS = ["/api/stripe-webhook", "/img/emblem.svg", "/favicon.svg"];

const enc = new TextEncoder();
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

// Cookie value: HMAC of a fixed label keyed by the password. No password is stored in the cookie.
export async function gateToken(password) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, enc.encode("kingpuck-gate-v1")));
}

async function sameDigest(a, b) {
  const [x, y] = await Promise.all([a, b].map((s) => crypto.subtle.digest("SHA-256", enc.encode(String(s)))));
  const p = new Uint8Array(x), q = new Uint8Array(y);
  let diff = 0;
  for (let i = 0; i < p.length; i++) diff |= p[i] ^ q[i];
  return diff === 0;
}

function readCookie(request, name) {
  for (const part of (request.headers.get("Cookie") ?? "").split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return null;
}

// Only same-site relative paths after unlocking.
const safeNext = (next) => (typeof next === "string" && /^\/(?!\/)[\w\-./?=&#%]*$/.test(next) && !next.startsWith(GATE_PATH) ? next : "/");

export async function checkGate(request, password) {
  if (!password) return null;
  const url = new URL(request.url);
  if (OPEN_PATHS.includes(url.pathname)) return null;

  if (url.pathname === GATE_PATH && request.method === "POST") {
    const form = await request.formData().catch(() => null);
    const next = safeNext(form?.get("next"));
    if (form && (await sameDigest(form.get("password") ?? "", password))) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: next,
          "Set-Cookie": `${GATE_COOKIE}=${await gateToken(password)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${GATE_DAYS * 86400}`,
          "Cache-Control": "no-store",
        },
      });
    }
    return gatePage(next, true);
  }

  const cookie = readCookie(request, GATE_COOKIE);
  if (cookie && (await sameDigest(cookie, await gateToken(password)))) return null;

  if (url.pathname.startsWith("/api/")) {
    return Response.json({ error: "Password required." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  return gatePage(safeNext(url.pathname + url.search), false);
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

// Self-contained page: every other asset is behind the gate.
// Colours match tokens.css; all text clears WCAG AA on the chrome background.
export function gatePage(next, wrong) {
  return new Response(
    `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>King Puck — Coming soon</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>
  :root { --chrome: #1f1f1e; --card: #f7f2e7; --text: #d9d2c1; --muted: #b9b2a3; --red: #b01e23; --red-2: #8f171b; --gold: #d4b56d; --field: #2c2c2a; --line: #6b6b66; }
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; background: var(--chrome); color: var(--text); font: 16px/1.6 Inter, system-ui, -apple-system, "Segoe UI", sans-serif; }
  main { width: min(420px, 100%); display: flex; flex-direction: column; gap: 24px; text-align: center; }
  img { width: 72px; height: 72px; margin: 0 auto; }
  h1 { margin: 0; font: 400 clamp(2.4rem, 9vw, 3.4rem)/0.95 "Instrument Serif", Georgia, serif; text-transform: uppercase; color: var(--card); letter-spacing: 0.02em; }
  p { margin: 0; }
  form { display: flex; flex-direction: column; gap: 16px; text-align: left; }
  label { display: flex; flex-direction: column; gap: 8px; font-weight: 600; font-size: 0.875rem; color: var(--card); }
  input { min-height: 40px; padding: 0 16px; border: 1px solid var(--line); border-radius: 8px; background: var(--field); color: var(--card); font: inherit; }
  input:focus-visible, button:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
  button { min-height: 40px; border: 0; border-radius: 8px; background: var(--red); color: var(--card); font: 600 1rem/1 Inter, system-ui, -apple-system, "Segoe UI", sans-serif; cursor: pointer; }
  button:hover { background: var(--red-2); }
  .error { color: #f2a7a0; font-weight: 600; font-size: 0.9375rem; }
  .small { font-size: 0.875rem; color: var(--muted); }
</style>
</head>
<body>
<main>
  <img src="/img/emblem.svg" alt="">
  <h1>King Puck</h1>
  <p>The living archive of Puck Fair is almost ready. Enter the password to preview the site.</p>
  <form method="post" action="${GATE_PATH}">
    <input type="hidden" name="next" value="${esc(next)}">
    <label>Password
      <input type="password" name="password" required autofocus autocomplete="current-password"${wrong ? ' aria-invalid="true" aria-describedby="gate-error"' : ""}>
    </label>
    ${wrong ? '<p class="error" id="gate-error" role="alert">That password isn\'t right. Please try again.</p>' : ""}
    <button type="submit">Enter</button>
  </form>
  <p class="small">Killorglin · County Kerry · Ireland</p>
</main>
</body>
</html>`,
    { status: 401, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } },
  );
}
