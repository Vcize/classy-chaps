/* =============================================================
   Shared grocery list — one list for the whole crew, backed by
   a Cloudflare KV store via /api/grocery. Chaps add what they
   want (tagged with who requested it); the shopper checks items
   off as they land in the cart.
   ============================================================= */
import { useState, useEffect, useRef, useCallback } from "react";
import { Icon, Reveal, SectionHead } from "./ui.jsx";
import { TRIP } from "./data.js";

const API = "/api/grocery";
const CHAPS = TRIP.crew.map((c) => c.name);
const ME_KEY = "ccsc-grocery-me";

export function GroceryList() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [me, setMe] = useState(() => {
    try { return localStorage.getItem(ME_KEY) || ""; } catch { return ""; }
  });
  const [status, setStatus] = useState("loading"); // loading | ok | offline
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  const rememberMe = (name) => {
    setMe(name);
    try { localStorage.setItem(ME_KEY, name); } catch {}
  };

  const load = useCallback(async () => {
    try {
      const r = await fetch(API, { cache: "no-store" });
      const data = await r.json();
      if (data.error) { setStatus("offline"); return; }
      setItems(data.items || []);
      setStatus("ok");
    } catch {
      setStatus("offline");
    }
  }, []);

  // initial load + light polling so the crew sees each other's edits
  useEffect(() => {
    load();
    const t = setInterval(load, 12000);
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      clearInterval(t);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [load]);

  // send an action; the server returns the authoritative list
  const act = useCallback(async (action, payload = {}, optimistic) => {
    if (optimistic) setItems(optimistic);
    setBusy(true);
    try {
      const r = await fetch(API, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });
      const data = await r.json();
      if (data.error) { setStatus("offline"); await load(); return; }
      setItems(data.items || []);
      setStatus("ok");
    } catch {
      await load(); // reconcile on failure
    } finally {
      setBusy(false);
    }
  }, [load]);

  const add = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    const optimistic = [...items, { id: "tmp-" + Date.now(), text: t.slice(0, 120), by: me, got: false, ts: Date.now() }];
    act("add", { text: t, by: me }, optimistic);
    setText("");
    inputRef.current?.focus();
  };

  const toggle = (id) =>
    act("toggle", { id }, items.map((i) => (i.id === id ? { ...i, got: !i.got } : i)));

  const setBy = (id, by) =>
    act("setBy", { id, by }, items.map((i) => (i.id === id ? { ...i, by } : i)));

  const remove = (id) =>
    act("remove", { id }, items.filter((i) => i.id !== id));

  const clearGot = () =>
    act("clearGot", {}, items.filter((i) => !i.got));

  // unchecked first (oldest at top), acquired sink to the bottom
  const sorted = [...items].sort((a, b) => (a.got === b.got ? a.ts - b.ts : a.got ? 1 : -1));
  const gotCount = items.filter((i) => i.got).length;

  const chapSelect = (value, onChange, extraClass = "") => (
    <select
      className={`gl-by ${value ? "set" : ""} ${extraClass}`}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Requested by"
    >
      <option value="">Requested by</option>
      {CHAPS.map((n) => <option key={n} value={n}>{n}</option>)}
    </select>
  );

  return (
    <section className="section topo-bg" id="grocery">
      <div className="wrap">
        <SectionHead
          eyebrow="Base Camp Kitchen"
          eyebrowClass="eyebrow-blaze"
          title={<>The shared <span style={{ color: "var(--blaze)" }}>grocery list</span></>}
          kicker="Add whatever you want from the store and tag who's asking — everyone shares one list. The shopper checks things off as they land in the cart."
        />

        <Reveal delay={60}>
          <div className="xc" style={{ padding: "clamp(18px,3vw,26px)", marginTop: 36, maxWidth: 720, marginInline: "auto" }}>
            {/* shared indicator + counts */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", color: status === "offline" ? "var(--cv-magenta-400)" : "var(--summit)" }}>
                <span className={`gl-live ${status === "offline" ? "off" : ""}`} />
                {status === "offline" ? "Shared list unavailable" : "Shared live with the crew"}
              </span>
              {items.length > 0 && (
                <span className="mono" style={{ fontSize: 12.5, color: "var(--fg-on-dark-faint)" }}>
                  {gotCount}/{items.length} in the cart
                </span>
              )}
            </div>

            {/* add row */}
            <form onSubmit={add} className="gl-add-row">
              {chapSelect(me, rememberMe, "gl-by-add")}
              <input
                ref={inputRef}
                className="gl-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add an item — burgers, sunscreen, more snacks…"
                maxLength={120}
                aria-label="Add a grocery item"
              />
              <button type="submit" className="gl-add" disabled={!text.trim() || busy}>
                <Icon name="plus" size={16} />Add
              </button>
            </form>

            {/* list */}
            {status === "loading" ? (
              <p style={{ color: "var(--fg-on-dark-faint)", fontSize: 14, padding: "8px 4px" }}>Loading the list…</p>
            ) : status === "offline" ? (
              <p style={{ color: "var(--fg-on-dark-faint)", fontSize: 14, padding: "8px 4px" }}>
                The shared list isn't reachable right now. Try again in a moment.
              </p>
            ) : items.length === 0 ? (
              <div style={{ textAlign: "center", padding: "26px 12px", color: "var(--fg-on-dark-faint)" }}>
                <Icon name="shopping-cart" size={26} style={{ color: "var(--summit)", opacity: 0.7 }} />
                <p style={{ marginTop: 10, fontSize: 14 }}>No items yet — add the first thing the crew needs.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 2 }}>
                {sorted.map((it) => (
                  <div key={it.id} className="gl-row">
                    <div className="gl-main" onClick={() => toggle(it.id)} role="button" aria-pressed={it.got}>
                      <span className="check-box" style={it.got ? { background: "var(--summit)", borderColor: "var(--summit)" } : {}}>
                        {it.got && <Icon name="check" size={14} stroke={3} />}
                      </span>
                      <span className="check-label" style={it.got ? { color: "var(--fg-on-dark-faint)", textDecoration: "line-through" } : {}}>
                        {it.text}
                      </span>
                    </div>
                    {chapSelect(it.by, (v) => setBy(it.id, v))}
                    <button
                      className="gl-remove"
                      aria-label={`Remove ${it.text}`}
                      onClick={() => remove(it.id)}
                    >
                      <Icon name="x" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {gotCount > 0 && (
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "flex-end" }}>
                <button onClick={clearGot} disabled={busy}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 999, cursor: "pointer", fontSize: 12.5, fontWeight: 600, fontFamily: "var(--font-body)", color: "var(--fg-on-dark-muted)", background: "transparent", border: "1px solid rgba(255,255,255,0.14)" }}>
                  <Icon name="check" size={13} />Clear acquired ({gotCount})
                </button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
