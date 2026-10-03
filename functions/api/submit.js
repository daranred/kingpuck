// Archive submissions: stores the form + files in R2 (binding ARCHIVE) for review.
import { getSession, indexForCustomer } from "../_lib/auth.js";
const MAX_FILES = 5;
const MAX_BYTES = 20 * 1024 * 1024;
const TEXT_FIELDS = ["name", "email", "year", "place", "people", "story", "provenance"];

export async function onRequestPost({ request, env }) {
  if (!env.ARCHIVE) {
    return Response.json({ error: "Online submissions open soon. Until then, email stories@kingpuck.com." }, { status: 503 });
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Invalid submission." }, { status: 400 });
  }

  const entry = Object.fromEntries(TEXT_FIELDS.map((k) => [k, String(form.get(k) ?? "").trim().slice(0, 5000)]));
  if (!entry.name || !entry.email || !entry.story) {
    return Response.json({ error: "Please add your name, email and a few words about your story." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.email)) {
    return Response.json({ error: "Please check your email address." }, { status: 400 });
  }
  if (form.get("permission") !== "yes") {
    return Response.json({ error: "Please confirm you have the right to share this material." }, { status: 400 });
  }

  const files = form.getAll("files").filter((f) => typeof f === "object" && f.size > 0);
  if (files.length > MAX_FILES) return Response.json({ error: `Please send up to ${MAX_FILES} files at a time.` }, { status: 400 });
  for (const f of files) {
    if (f.size > MAX_BYTES) return Response.json({ error: `${f.name} is over 20 MB.` }, { status: 400 });
    if (!/^image\//.test(f.type) && f.type !== "application/pdf") {
      return Response.json({ error: `${f.name} isn't an image or PDF.` }, { status: 400 });
    }
  }

  const id = `${new Date().toISOString().slice(0, 10)}-${crypto.randomUUID().slice(0, 8)}`;
  const stored = [];
  for (const [i, f] of files.entries()) {
    const key = `submissions/${id}/${i + 1}-${f.name.replace(/[^\w.-]+/g, "_").slice(-80)}`;
    await env.ARCHIVE.put(key, f.stream(), { httpMetadata: { contentType: f.type } });
    stored.push({ key, name: f.name, type: f.type, size: f.size });
  }
  const record = { id, received: new Date().toISOString(), status: "pending-review", permission: true, ...entry, files: stored };
  await env.ARCHIVE.put(`submissions/${id}/submission.json`, JSON.stringify(record, null, 2), {
    httpMetadata: { contentType: "application/json" },
  });
  const session = await getSession(request, env);
  await indexForCustomer(env, session?.email ?? entry.email, "submission", id, { id, received: record.received, status: record.status, year: entry.year, place: entry.place, files: stored.length });
  return Response.json({ ok: true, id });
}
