/* =============================================================
   Sections B — Flight Board, Base Camp, Itinerary timeline
   ============================================================= */
import { useState } from "react";
import { Icon, Reveal, SectionHead, Photo } from "./ui.jsx";
import { TRIP } from "./data.js";

/* ---------- one simplified leg: airport · time · flight # ---------- */
function FlightLeg({ leg, label, kind }) {
  // kind: "arrival" shows arrival airport + arrive time; "departure" shows departure airport + depart time
  const isArr = kind === "arrival";
  const airport = leg && leg.route ? (isArr ? leg.route[leg.route.length - 1] : leg.route[0]) : null;
  const time = leg ? (isArr ? leg.arrive : leg.depart) : null;
  // flight number: prefer a real flight code (e.g. DL3777), else show the carrier
  const flightNo = leg && leg.flight && !leg.flight.includes("→") ? leg.flight : (leg ? leg.carrier : null);
  const tbd = !leg || leg.status === "TBD";
  const driving = !tbd && leg.status === "DRIVING";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--fg-on-dark-faint)", fontWeight: 600 }}>{label}</span>
        <span className={`status-pill status-${tbd ? "TBD" : leg.status}`}>{tbd ? "TBD" : leg.status}</span>
      </div>
      {tbd ? (
        <div className="mono" style={{ fontSize: 13, color: "var(--fg-on-dark-faint)" }}>—</div>
      ) : driving ? (
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <Icon name="car" size={16} style={{ color: "var(--blaze)", flex: "none" }} />
          <span style={{ fontSize: 13.5, color: "var(--fg-on-dark-muted)" }}>{leg.note}</span>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
            <span className="chip-iata" style={{ fontSize: 17 }}>{airport}</span>
            <span className="mono" style={{ fontSize: 15, color: "var(--summit)", fontWeight: 700 }}>{time}</span>
            <span className="mono" style={{ fontSize: 12, color: "var(--fg-on-dark-faint)" }}>{flightNo}</span>
          </div>
          {leg.note && (
            <div style={{ fontSize: 11.5, fontStyle: "italic", color: "var(--fg-on-dark-faint)", marginTop: 6 }}>{leg.note}</div>
          )}
        </div>
      )}
    </div>
  );
}

export function FlightBoard() {
  const flights = TRIP.flights;
  const confirmed = flights.filter((f) => ["CONFIRMED", "DRIVING"].includes(f.arrival.status)).length;
  return (
    <section className="section topo-bg" id="flights">
      <div className="wrap">
        <SectionHead eyebrow="The Arrival Manifest" eyebrowClass="eyebrow-blaze" title={<>The Flight <span style={{ color: "var(--summit)" }}>Board</span></>} kicker="Who's landing when — and who's road-tripping. Times straight from the group chat; flight numbers still trickling in." />
        <Reveal delay={80}>
          <div className="board" style={{ marginTop: 36 }}>
            <div className="board-head">
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <span className="board-dot" />
                <span className="mono" style={{ fontSize: 12.5, letterSpacing: "0.18em", color: "var(--summit)" }}>FAT · FRESNO YOSEMITE INTL</span>
              </div>
              <span className="mono" style={{ fontSize: 11.5, color: "var(--fg-on-dark-faint)" }}>{confirmed}/7 LOCKED IN</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0 }}>
              {flights.map((f, i) => (
                <div key={f.name} className="flight-row" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, padding: "18px 20px", borderTop: i ? "1px solid rgba(111,227,217,0.1)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontWeight: 800, color: f.birthday ? "var(--cv-magenta-400)" : "var(--summit)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>{f.name[0]}</div>
                    <div>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17 }}>{f.name}</div>
                      {f.birthday && <div style={{ fontSize: 10.5, letterSpacing: "0.12em", color: "var(--cv-magenta-400)", fontWeight: 700 }}>BIRTHDAY CHAP</div>}
                    </div>
                  </div>
                  <div className="flight-legs" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
                    <FlightLeg leg={f.arrival} label="Arrival" kind="arrival" />
                    <FlightLeg leg={f.departure} label="Departure" kind="departure" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
      <style>{`
        @media(min-width:760px){
          .flight-row{grid-template-columns:160px 1fr!important;align-items:start}
          .flight-legs{grid-template-columns:1fr 1fr!important;gap:28px!important}
        }
      `}</style>
    </section>
  );
}

/* ---------- base camp ---------- */
export function BaseCamp() {
  const bc = TRIP.baseCamp;
  const [tab, setTab] = useState("access");
  const tabs = [
    { id: "access", label: "Getting In", icon: "key-round" },
    { id: "provided", label: "Provided", icon: "package-check" },
    { id: "checkout", label: "Checkout", icon: "log-out" },
  ];
  const content = {
    access: bc.access,
    provided: bc.provided,
    checkout: bc.checkoutTasks,
  };
  return (
    <section className="section" id="basecamp" style={{ background: "linear-gradient(180deg, var(--ink), #0a1c17 50%, var(--ink))" }}>
      <div className="wrap">
        <SectionHead eyebrow="Base Camp" title={<>Citrus Cove 1</>} kicker={bc.blurb} />
        <div style={{ display: "grid", gap: 22, gridTemplateColumns: "1fr", marginTop: 40 }} className="bc-grid">
          {/* left: photo + map + quick stats */}
          <Reveal>
            <Photo src={TRIP.photos.baseCamp} label="Add a photo of the house / pool" icon="image" focus="center 62%" className="ticked" caption="Citrus Cove 1 · the recovery pool" style={{ minHeight: 230 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 14 }}>
              {bc.quickStats.map((q) => (
                <div key={q.label} className="xc" style={{ padding: "14px 12px", textAlign: "center" }}>
                  <Icon name={q.icon} size={20} style={{ color: "var(--summit)" }} />
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, marginTop: 8 }}>{q.value}</div>
                  <div style={{ fontSize: 11, color: "var(--fg-on-dark-faint)", marginTop: 2 }}>{q.label}</div>
                </div>
              ))}
            </div>
            <a href={bc.mapsUrl} target="_blank" rel="noopener" className="xc xc-hover" style={{ display: "flex", alignItems: "center", gap: 13, padding: 16, marginTop: 14, textDecoration: "none", color: "inherit" }}>
              <span className="ico-tile blaze"><Icon name="map-pin" size={20} /></span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{bc.address}</div>
                <div style={{ fontSize: 12, color: "var(--summit)", marginTop: 3, display: "flex", alignItems: "center", gap: 5 }}>Open in Maps <Icon name="external-link" size={12} /></div>
              </div>
            </a>
          </Reveal>

          {/* right: details + warnings */}
          <Reveal delay={100}>
            <div className="xc" style={{ padding: "clamp(20px,3vw,28px)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, paddingBottom: 18, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                {[["Check-in", bc.checkIn, "log-in"], ["Checkout", bc.checkOut, "log-out"], ["Host", bc.host, "user-round"], ["Confirmation", bc.confirmation, "ticket"]].map(([l, v, ic]) => (
                  <div key={l} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                    <Icon name={ic} size={17} style={{ color: "var(--summit)", marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-on-dark-faint)" }}>{l}</div>
                      <div style={{ fontWeight: 600, fontSize: 14, marginTop: 3, fontFamily: l === "Confirmation" ? "var(--font-mono)" : "inherit", color: l === "Confirmation" ? "var(--blaze)" : "inherit" }}>{v}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 18, marginBottom: 16 }}>
                {tabs.map((t) => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "10px 8px", borderRadius: 999, cursor: "pointer", fontSize: 12.5, fontWeight: 600, fontFamily: "var(--font-body)",
                      border: `1px solid ${tab === t.id ? "rgba(111,227,217,0.5)" : "rgba(255,255,255,0.12)"}`,
                      background: tab === t.id ? "rgba(111,227,217,0.14)" : "transparent",
                      color: tab === t.id ? "var(--summit)" : "var(--fg-on-dark-muted)" }}>
                    <Icon name={t.icon} size={15} /><span className="tab-label">{t.label}</span>
                  </button>
                ))}
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 9 }}>
                {content[tab].map((item, i) => (
                  <li key={i} style={{ display: "flex", gap: 11, alignItems: "flex-start", fontSize: 14, color: "var(--fg-on-dark-muted)" }}>
                    <Icon name={tab === "checkout" ? "square-check" : "circle-dot"} size={16} style={{ color: "var(--summit)", marginTop: 2, flex: "none" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
              {bc.warnings.map((w, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "13px 16px", borderRadius: 14, background: "rgba(245,192,74,0.07)", border: "1px solid rgba(245,192,74,0.22)" }}>
                  <Icon name={w.icon} size={18} style={{ color: "var(--blaze)", flex: "none" }} />
                  <span style={{ fontSize: 13.5, color: "var(--fg-on-dark-muted)" }}>{w.text}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`@media(min-width:900px){.bc-grid{grid-template-columns:1fr 1fr!important}}@media(max-width:420px){.tab-label{display:none}}`}</style>
    </section>
  );
}

/* ---------- itinerary timeline ---------- */
export function Itinerary() {
  const days = TRIP.itinerary;
  const kindColor = { travel: "var(--blaze)", hike: "var(--summit)", summit: "var(--cv-magenta-400)" };
  const kindBg = { travel: "rgba(245,192,74,0.13)", hike: "rgba(111,227,217,0.12)", summit: "rgba(198,97,214,0.13)" };
  const kindBorder = { travel: "rgba(245,192,74,0.3)", hike: "rgba(111,227,217,0.3)", summit: "rgba(198,97,214,0.32)" };
  return (
    <section className="section topo-bg" id="itinerary">
      <div className="wrap">
        <SectionHead eyebrow="Daily Itinerary" eyebrowClass="eyebrow-blaze" title="Four days, one mission" kicker="Travel in, two hikes, pool recovery, and out. Here's the play-by-play." />
        <div style={{ position: "relative", marginTop: 44 }}>
          <div className="time-line" style={{ position: "absolute", left: 23, top: 8, bottom: 8, width: 2, background: "linear-gradient(180deg, rgba(111,227,217,0.4), rgba(111,227,217,0.05))" }} />
          <div style={{ display: "grid", gap: 18 }}>
            {days.map((d, i) => (
              <Reveal key={i} delay={i * 60}>
                <div style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 18, alignItems: "start" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, display: "grid", placeItems: "center", zIndex: 1, color: kindColor[d.kind], background: kindBg[d.kind], border: `1px solid ${kindBorder[d.kind]}`, backdropFilter: "blur(4px)" }}>
                    <Icon name={d.icon} size={22} />
                  </div>
                  <div className="xc xc-hover" style={{ padding: "18px 20px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "4px 12px", marginBottom: 4 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20 }}>{d.day}</span>
                      <span className="mono" style={{ fontSize: 12.5, color: "var(--fg-on-dark-faint)" }}>{d.date}</span>
                      <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: kindColor[d.kind] }}>{d.title}</span>
                    </div>
                    <p style={{ margin: "0 0 14px", color: kindColor[d.kind], fontStyle: "italic", fontSize: 13.5 }}>{d.tone}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }} className="itin-items">
                      {d.items.map((it, j) => (
                        <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13.5, color: "var(--fg-on-dark-muted)" }}>
                          <Icon name="check" size={15} style={{ color: kindColor[d.kind], marginTop: 2, flex: "none" }} />{it}
                        </div>
                      ))}
                    </div>
                    {d.trail && (
                      <a href="#trails" onClick={(e) => { e.preventDefault(); document.getElementById("trails")?.scrollIntoView({ behavior: "smooth" }); window.dispatchEvent(new CustomEvent("select-trail", { detail: d.trail })); }}
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, fontSize: 13, fontWeight: 600, color: kindColor[d.kind], textDecoration: "none" }}>
                        Trail intel <Icon name="arrow-right" size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(min-width:620px){.itin-items{grid-template-columns:1fr 1fr!important}}`}</style>
    </section>
  );
}
