import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* Dev-only mock of the /api/grocery Cloudflare Pages Function.
   Vite's dev server doesn't run Pages Functions, so this middleware
   mirrors functions/api/grocery.js against an in-memory store —
   letting the grocery list work end-to-end in local preview.
   In production the real KV-backed function takes over; this never ships. */
function devGroceryApi() {
  let items = [
    { id: "seed-1", text: "Ribeyes for Saturday night", by: "Brett", got: false, ts: 1 },
    { id: "seed-2", text: "Coffee (a lot of coffee)", by: "", got: true, ts: 2 },
  ];
  let n = 100;
  return {
    name: "dev-grocery-api",
    configureServer(server) {
      server.middlewares.use("/api/grocery", (req, res) => {
        const send = (data, status = 200) => {
          res.statusCode = status;
          res.setHeader("content-type", "application/json");
          res.setHeader("cache-control", "no-store");
          res.end(JSON.stringify(data));
        };
        if (req.method === "GET") return send({ items });
        if (req.method === "POST") {
          let raw = "";
          req.on("data", (c) => (raw += c));
          req.on("end", () => {
            let body = {};
            try { body = raw ? JSON.parse(raw) : {}; } catch { return send({ error: "bad-request" }, 400); }
            if (body.action === "add") {
              const text = (body.text || "").trim().slice(0, 120);
              const by = (body.by || "").trim().slice(0, 40);
              if (text) items.push({ id: "dev-" + n++, text, by, got: false, ts: Date.now() });
            } else if (body.action === "toggle") {
              items = items.map((i) => (i.id === body.id ? { ...i, got: !i.got } : i));
            } else if (body.action === "setBy") {
              const by = (body.by || "").trim().slice(0, 40);
              items = items.map((i) => (i.id === body.id ? { ...i, by } : i));
            } else if (body.action === "remove") {
              items = items.filter((i) => i.id !== body.id);
            } else if (body.action === "clearGot") {
              items = items.filter((i) => !i.got);
            } else {
              return send({ error: "unknown-action" }, 400);
            }
            send({ items });
          });
          return;
        }
        send({ error: "method-not-allowed" }, 405);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devGroceryApi()],
});
