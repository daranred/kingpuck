import { checkGate } from "./_lib/gate.js";

// Runs before every page, asset and API route.
export async function onRequest({ request, env, next }) {
  return (await checkGate(request, env.SITE_PASSWORD)) ?? next();
}
