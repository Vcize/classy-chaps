/* =============================================================
   Sections D — Packing checklist, Food plan, Safety, Quote wall, Footer
   ============================================================= */
import { useState, useEffect, useMemo } from "react";
import { Icon, Reveal, SectionHead } from "./ui.jsx";
import { TRIP } from "./data.js";

/* ---------- interactive packing checklist (persisted) ---------- */
export function Packing() {
  const packing = TRIP.packing;
  const cats = Object.keys(packing);
  const allItems = cats.flatMap((c) => packing[c].items.map((it) => `${c}::${it}`));
  const [checked, setChecked] = useState(() => {
    try {
      const raw = localStorage.getItem("ccsc-pack");
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });
  useEffect(() => {
    try { localStorage.setItem("ccsc-pack", JSON.stringify(checked)); } catch (e) {}
  }, [checked]);
  const toggle = (key) => setChecked((c) => ({ ...c, [key]: !c[key] }));
  const doneCount = allItems.filter((k) => checked[k]).length;
  const pct = Math.round((doneCount / allItems.length) * 100);

  const catAccent = { Trail: "var(--summit)", House: "var(--blaze)", Safety: "var(--cv-magenta-400)" };

  return (
    <section className="section" id="packing" style={{ background: "linear-gradient(180deg, var(--ink), #0a1c17 50%, var(--ink))" }}>
      <div className="wrap">
        <SectionHead eyebrow="Packing List" title="Pack like a classy chap" kicker="Tap to check things off — your list saves itself on this device. Day packs only." />

        <Reveal delay={60}>
          <div className="xc" style={{ padding: "18px 22px", marginTop: 32, marginBottom: 24, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 220px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Loadout progress</span>
                <span className="mono" style={{ color: "var(--summit)", fontSize: 14 }}>{doneCount}/{allItems.length} · {pct}%</span>
              </div>
              <div className="prog-track"><div className="prog-fill" style={{ width: `${pct}%` }} /></div>
            </div>
            <button onClick={() => setChecked({})}
              style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 999, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "var(--font-body)", color: "var(--fg-on-dark-muted)", background: "transparent", border: "1px solid rgba(255,255,255,0.14)" }}>
              <Icon name="rotate-ccw" size={14} />Reset
            </button>
          </div>
        </Reveal>

        <div style={{ display: "grid", gap: 18, gridTemplateColumns: "1fr" }} className="pack-grid">
          {cats.map((cat, ci) => {
            const accent = catAccent[cat];
            return (
              <Reveal key={cat} delay={ci * 80}>
                <div className="xc" style={{ padding: "20px 16px", height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "0 6px 14px", marginBottom: 6, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <span style={{ display: "grid", placeItems: "center", width: 38, height: 38, borderRadius: 11, color: accent, background: `${accent}1f`, border: `1px solid ${accent}40` }}>
                      <Icon name={packing[cat].icon} size={19} />
                    </span>
                    <div>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18 }}>{cat}</div>
                      <div style={{ fontSize: 11.5, color: "var(--fg-on-dark-faint)" }}>{packing[cat].items.length} items</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gap: 2 }}>
                    {packing[cat].items.map((it) => {
                      const key = `${cat}::${it}`;
                      const on = !!checked[key];
                      return (
                        <div key={it} className={`check-row ${on ? "done" : ""}`} onClick={() => toggle(key)}>
                          <span className="check-box" style={on ? { background: accent, borderColor: accent } : {}}>
                            {on && <Icon name="check" size={14} stroke={3} />}
                          </span>
                          <span className="check-label">{it}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
      <style>{`@media(min-width:780px){.pack-grid{grid-template-columns:repeat(3,1fr)!important}}`}</style>
    </section>
  );
}

/* ---------- food / grocery / recovery ---------- */
export function Food() {
  const food = TRIP.food;
  return (
    <section className="section topo-bg" id="food">
      <div className="wrap">
        <SectionHead eyebrow="Fuel & Recovery" eyebrowClass="eyebrow-blaze" title="Grocery, grill, recover" kicker="The orchard kitchen and BBQ do the heavy lifting. Carb-load before Alta, soak in the pool after." />
        <div style={{ display: "grid", gap: 18, gridTemplateColumns: "1fr", marginTop: 40 }} className="food-grid">
          {food.map((f, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="xc xc-hover" style={{ padding: "24px 22px", height: "100%" }}>
                <span className={`ico-tile ${i === 1 ? "blaze" : i === 2 ? "punch" : ""}`} style={{ width: 50, height: 50 }}><Icon name={f.icon} size={24} /></span>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 21, margin: "18px 0 6px" }}>{f.title}</h3>
                <p style={{ margin: "0 0 16px", fontSize: 13.5, fontStyle: "italic", color: "var(--fg-on-dark-faint)" }}>{f.tone}</p>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 9 }}>
                  {f.items.map((it, j) => (
                    <li key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "var(--fg-on-dark-muted)" }}>
                      <Icon name="utensils" size={14} style={{ color: "var(--summit)", marginTop: 3, flex: "none" }} />{it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <style>{`@media(min-width:780px){.food-grid{grid-template-columns:repeat(3,1fr)!important}}`}</style>
    </section>
  );
}

/* ---------- safety / wildlife ---------- */
export function Safety() {
  const bc = TRIP.baseCamp;
  const safety = TRIP.packing.Safety.items;
  const wildlife = ["Rattlesnakes", "Mountain lions", "Bobcats", "Coyotes", "Skunks", "Possums", "Raccoons", "Owls", "Deer", "Scorpions", "Honeybees", "Spiders", "Centipedes", "Ants"];
  return (
    <section className="section" id="safety" style={{ background: "linear-gradient(180deg, var(--ink), #0a1c17 55%, var(--ink))" }}>
      <div className="wrap">
        <SectionHead eyebrow="Safety & House Rules" title={<>Don't be a <span style={{ color: "var(--cv-magenta-400)" }}>cautionary tale</span></>} kicker="We're here to celebrate, not to make the news. A few non-negotiables for the trail and the house." />
        <div style={{ display: "grid", gap: 18, gridTemplateColumns: "1fr", marginTop: 40 }} className="safety-grid">
          <Reveal>
            <div className="xc" style={{ padding: "24px 22px", height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 16 }}>
                <span className="ico-tile"><Icon name="shield-check" size={22} /></span>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, margin: 0 }}>Trail rules</h3>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 11 }}>
                {safety.map((s, i) => (
                  <li key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start", fontSize: 14.5, color: "var(--fg-on-dark-muted)" }}>
                    <Icon name="circle-check" size={17} style={{ color: "var(--summit)", marginTop: 1, flex: "none" }} />{s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div style={{ display: "grid", gap: 18, height: "100%" }}>
              <div className="xc" style={{ padding: "24px 22px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
                  <span className="ico-tile blaze"><Icon name="paw-print" size={22} /></span>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, margin: 0 }}>Critter watch</h3>
                </div>
                <p style={{ margin: "0 0 14px", fontSize: 13.5, color: "var(--fg-on-dark-faint)" }}>The orchard and trails come with neighbors. Most are harmless — give them room.</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {wildlife.map((w) => (
                    <span key={w} style={{ fontSize: 12, padding: "5px 11px", borderRadius: 999, background: "rgba(245,192,74,0.08)", border: "1px solid rgba(245,192,74,0.22)", color: "var(--fg-on-dark-muted)" }}>{w}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {bc.warnings.map((w, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "14px 16px", borderRadius: 14, background: "rgba(198,97,214,0.07)", border: "1px solid rgba(198,97,214,0.22)" }}>
                    <Icon name={w.icon} size={18} style={{ color: "var(--cv-magenta-400)", flex: "none" }} />
                    <span style={{ fontSize: 13.5, color: "var(--fg-on-dark-muted)" }}>{w.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`@media(min-width:880px){.safety-grid{grid-template-columns:1fr 1fr!important;align-items:start}}`}</style>
    </section>
  );
}

/* ---------- campfire quote wall ---------- */
export function Quotes() {
  const quotes = TRIP.quotes;
  const embers = useMemo(
    () => Array.from({ length: 18 }, (_, i) => ({
      left: 8 + (i * 37) % 84,
      dur: 4 + (i % 5) * 1.3,
      delay: (i % 7) * 0.9,
      drift: ((i % 5) - 2) * 16,
      size: 2 + (i % 3),
    })),
    []
  );
  return (
    <section className="section topo-bg campfire-stage" id="quotes" style={{ overflow: "hidden" }}>
      {/* rising embers + fire glow anchored to the section base */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        {embers.map((e, i) => (
          <span key={i} className="ember" style={{
            left: `${e.left}%`, width: e.size, height: e.size,
            animationDuration: `${e.dur}s`, animationDelay: `${e.delay}s`,
            "--drift": `${e.drift}px`,
          }} />
        ))}
        <div className="fire-glow" />
      </div>
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <SectionHead eyebrow="From the Group Chat" eyebrowClass="eyebrow-blaze" title={<>Around the <span style={{ color: "var(--blaze)" }}>campfire</span></>} kicker="Real words, lightly archived for posterity. The hype was, and remains, immaculate." align="center" />
        <Reveal delay={60}>
          <div className="quote-cols" style={{ marginTop: 44, columnGap: 16 }}>
            {quotes.map((q, i) => (
              <div key={i} className="quote-card ember-card">
                <Icon name="quote" size={20} style={{ color: "var(--blaze)", opacity: 0.55 }} />
                <p style={{ margin: "10px 0 14px", fontSize: "clamp(15px,2vw,18px)", fontFamily: "var(--font-display)", fontWeight: 700, lineHeight: 1.32 }}>{q.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--fg-on-dark-faint)" }}>
                  <span style={{ width: 18, height: 1, background: "rgba(255,255,255,0.25)" }} />{q.author}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
      <style>{`
        .quote-cols{column-count:1}
        @media(min-width:620px){.quote-cols{column-count:2}}
        @media(min-width:980px){.quote-cols{column-count:3}}
      `}</style>
    </section>
  );
}

/* ---------- footer ---------- */
export function Footer() {
  const b = TRIP.brand;
  return (
    <footer className="foot topo-bg" style={{ paddingTop: 64, paddingBottom: 40 }}>
      <div className="wrap" style={{ textAlign: "center" }}>
        <Reveal>
          <span className="crest" style={{ width: 56, height: 56, borderRadius: 16, margin: "0 auto" }}><Icon name="mountain" size={28} /></span>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(26px,5vw,44px)", margin: "20px 0 6px", letterSpacing: "-0.02em", textTransform: "uppercase" }}>
            Classy Chaps <span style={{ color: "var(--summit)" }}>Summit Club</span>
          </h3>
          <p style={{ color: "var(--fg-on-dark-muted)", maxWidth: 460, margin: "0 auto 24px", fontSize: 15 }}>{b.tagline}</p>
          <div style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 18px", fontSize: 13, color: "var(--fg-on-dark-faint)", marginBottom: 28 }}>
            <span style={{ display: "inline-flex", gap: 7, alignItems: "center" }}><Icon name="calendar-days" size={14} style={{ color: "var(--summit)" }} />{b.dates}</span>
            <span className="divider-dot">•</span>
            <span style={{ display: "inline-flex", gap: 7, alignItems: "center" }}><Icon name="map-pin" size={14} style={{ color: "var(--summit)" }} />{b.location}</span>
          </div>
          <div className="np-badge" style={{ margin: "0 auto" }}><Icon name="sparkles" size={14} />{b.callToArms}</div>
        </Reveal>
        <div style={{ marginTop: 40, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 12, color: "var(--fg-on-dark-faint)" }}>
          {b.est} · Built for the chaps · The California Way
        </div>
      </div>
    </footer>
  );
}
