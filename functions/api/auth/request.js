import { randomToken, sha256, normalizeEmail, validEmail, safeNext, LINK_MINUTES } from "../../_lib/auth.js";

export async function onRequestPost({ request, env }) {
  const devLog = env.DEV_LOG_MAGIC_LINKS === "true"; // local development only (.dev.vars)
  if (!env.AUTH || (!env.RESEND_API_KEY && !devLog)) {
    return Response.json({ error: "Sign-in is coming soon." }, { status: 503 });
  }
  const body = await request.json().catch(() => ({}));
  const email = normalizeEmail(body.email);
  if (!validEmail(email)) return Response.json({ error: "Please enter a valid email address." }, { status: 400 });

  // One link per address per minute.
  const throttleKey = `throttle:${await sha256(email)}`;
  if (await env.AUTH.get(throttleKey)) {
    return Response.json({ error: "We've just sent you a link. Please check your inbox, or try again in a minute." }, { status: 429 });
  }
  await env.AUTH.put(throttleKey, "1", { expirationTtl: 60 });

  const token = randomToken();
  await env.AUTH.put(`login:${await sha256(token)}`, JSON.stringify({ email, next: safeNext(body.next) }), {
    expirationTtl: LINK_MINUTES * 60,
  });

  const siteUrl = env.SITE_URL || new URL(request.url).origin;
  const link = `${siteUrl}/api/auth/verify?token=${token}`;
  if (devLog) {
    console.log(`[dev] magic link for ${email}: ${link}`);
    return Response.json({ ok: true });
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.EMAIL_FROM || "King Puck <hello@kingpuck.com>",
      to: email,
      subject: "Your King Puck sign-in link",
      text: `Sign in to King Puck:\n\n${link}\n\nThis link works once and expires in ${LINK_MINUTES} minutes. If you didn't ask for it, you can ignore this email.`,
      html: `<p>Sign in to King Puck:</p><p><a href="${link}">Sign in</a></p><p>This link works once and expires in ${LINK_MINUTES} minutes. If you didn't ask for it, you can ignore this email.</p>`,
    }),
  });
  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return Response.json({ error: "We couldn't send the email. Please try again." }, { status: 502 });
  }
  // Same response whether or not the address has bought before.
  return Response.json({ ok: true });
}
