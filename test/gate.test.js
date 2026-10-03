import { test } from "node:test";
import assert from "node:assert/strict";
import { checkGate } from "../functions/_lib/gate.js";

const req = (path, auth) => new Request(`https://kingpuck.com${path}`, { headers: auth ? { Authorization: auth } : {} });
const basic = (s) => "Basic " + Buffer.from(s).toString("base64");

test("gate is off without a password", async () => {
  assert.equal(await checkGate(req("/"), undefined), null);
});

test("gate asks for the password", async () => {
  const res = await checkGate(req("/"), "secret");
  assert.equal(res.status, 401);
  assert.match(res.headers.get("WWW-Authenticate"), /^Basic/);
  assert.equal((await checkGate(req("/", basic("x:wrong")), "secret")).status, 401);
  assert.equal((await checkGate(req("/", "Basic !!!"), "secret")).status, 401);
});

test("gate lets the right password through, with any username", async () => {
  assert.equal(await checkGate(req("/shop.html", basic("anyone:secret")), "secret"), null);
  assert.equal(await checkGate(req("/", basic(":pa:ss")), "pa:ss"), null);
});

test("Stripe webhook stays open", async () => {
  assert.equal(await checkGate(req("/api/stripe-webhook"), "secret"), null);
});
