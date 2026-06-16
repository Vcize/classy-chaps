/* =============================================================
   Cloudflare Pages Function — shared grocery list backed by KV.
   Bind a KV namespace to this Pages project under the name GROCERY
   (Settings → Functions → KV namespace bindings).

   GET  /api/grocery            → { items: [...] }
   POST /api/grocery  body:
     { action: "add", text, by }    → append an item (by = who requested it)
     { action: "toggle", id }       → flip got
     { action: "setBy", id, by }    → set who requested an item
     { action: "remove", id }       → delete an item
     { action: "clearGot" }         → drop everything already acquired
   ============================================================= */
const KEY = "grocery-list";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

async function read(env) {
  const raw = await env.GROCERY.get(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function onRequestGet({ env }) {
  // Graceful behaviour if the KV binding isn't wired up yet.
  if (!env.GROCERY) return json({ items: [], error: "storage-unconfigured" });
  return json({ items: await read(env) });
}

export async function onRequestPost({ request, env }) {
  if (!env.GROCERY) return json({ items: [], error: "storage-unconfigured" });

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "bad-request" }, 400);
  }

  let items = await read(env);
  switch (body.action) {
    case "add": {
      const text = (body.text || "").trim().slice(0, 120);
      const by = (body.by || "").trim().slice(0, 40);
      if (text) items.push({ id: crypto.randomUUID(), text, by, got: false, ts: Date.now() });
      break;
    }
    case "toggle":
      items = items.map((i) => (i.id === body.id ? { ...i, got: !i.got } : i));
      break;
    case "setBy": {
      const by = (body.by || "").trim().slice(0, 40);
      items = items.map((i) => (i.id === body.id ? { ...i, by } : i));
      break;
    }
    case "remove":
      items = items.filter((i) => i.id !== body.id);
      break;
    case "clearGot":
      items = items.filter((i) => !i.got);
      break;
    default:
      return json({ error: "unknown-action" }, 400);
  }

  await env.GROCERY.put(KEY, JSON.stringify(items));
  return json({ items });
}
