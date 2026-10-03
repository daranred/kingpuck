import { test } from "node:test";
import assert from "node:assert/strict";
import { checkGate, gateToken, GATE_COOKIE } from "../functions/_lib/gate.js";

const req = (path, init = {}) => new Request(`https://kingpuck.com${path}`, init);
const login = (password, next = "/shop") =>
  req("/__gate", { method: "POST", body: new URLSearchParams({ password, next }) });

test("gate is off without a password", async () => {
  assert.equal(await checkGate(req("/"), undefined), null);
});

test("pages show the password screen, APIs get JSON", async () => {
  const page = await checkGate(req("/story"), "secret");
  assert.equal(page.status, 401);
  assert.match(page.headers.get("Content-Type"), /text\/html/);
  const html = await page.text();
  assert.match(html, /type="password"/);
  assert.match(html, /name="next" value="\/story"/);
  const api = await checkGate(req("/api/products"), "secret");
  assert.equal(api.status, 401);
  assert.match(api.headers.get("Content-Type"), /json/);
});

test("right password sets a cookie and redirects; wrong one shows an error", async () => {
  const ok = await checkGate(login("secret"), "secret");
  assert.equal(ok.status, 303);
  assert.equal(ok.headers.get("Location"), "/shop");
  const cookie = ok.headers.get("Set-Cookie");
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.ok(!cookie.includes("secret"));
  const bad = await checkGate(login("nope"), "secret");
  assert.equal(bad.status, 401);
  assert.match(await bad.text(), /isn't right/);
});

test("cookie lets visitors in until the password changes", async () => {
  const c = `${GATE_COOKIE}=${await gateToken("secret")}`;
  assert.equal(await checkGate(req("/shop", { headers: { Cookie: c } }), "secret"), null);
  assert.equal((await checkGate(req("/shop", { headers: { Cookie: c } }), "changed")).status, 401);
  assert.equal((await checkGate(req("/", { headers: { Cookie: `${GATE_COOKIE}=forged` } }), "secret")).status, 401);
});

test("redirect after unlocking stays on this site", async () => {
  assert.equal((await checkGate(login("secret", "//evil.com"), "secret")).headers.get("Location"), "/");
  assert.equal((await checkGate(login("secret", "https://evil.com"), "secret")).headers.get("Location"), "/");
});

test("Stripe webhook and the emblem stay open", async () => {
  assert.equal(await checkGate(req("/api/stripe-webhook"), "secret"), null);
  assert.equal(await checkGate(req("/img/emblem.svg"), "secret"), null);
});
