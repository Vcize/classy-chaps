/* =============================================================
   Sections C — Trail Intel (route maps, drawn elevation,
   summit reveal, waterfall motion) + Expedition Stats
   ============================================================= */
import { useState, useEffect, useRef, useMemo, Fragment } from "react";
import { Icon, Reveal, SectionHead, Photo, useInView, CountUp } from "./ui.jsx";
import { TRIP } from "./data.js";

/* ---------- a path that traces itself when `seen` ---------- */
function PathTrace({ d, stroke, width = 2.5, dash, delay = 0, seen, className = "" }) {
  const pref = useRef(null);
  const [len, setLen] = useState(700);
  useEffect(() => { if (pref.current) setLen(pref.current.getTotalLength()); }, [d]);
  return (
    <path ref={pref} d={d} fill="none" stroke={stroke} strokeWidth={width}
      strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash}
      className={`trace-path ${seen ? "drawn" : ""} ${className}`}
      style={{ "--len": len, transitionDelay: `${delay}s` }} />
  );
}

/* ---------- stylized route-tracing trail map ---------- */
function TrailMap({ trail, accent, isHard, seen }) {
  // winding route from trailhead (bottom-left) to objective (upper-right)
  const route = isHard
    ? "M44 244 C110 232 96 188 162 178 C232 168 214 120 286 122 C356 124 342 74 410 60 C436 55 452 48 470 44"
    : "M44 240 C112 232 104 198 184 196 C262 194 244 158 322 158 C396 158 388 120 470 110";
  const waypoints = isHard
    ? [[162, 178, "Lakes Tr."], [286, 122, "Panther Gap"], [410, 60, ""]]
    : [[184, 196, "Kings R."], [322, 158, ""]];
  const end = isHard ? [470, 44] : [470, 110];
  const uid = useMemo(() => "tm" + Math.random().toString(36).slice(2, 7), []);
  return (
    <div style={{ position: "relative" }}>
      <svg viewBox="0 0 510 280" width="100%" style={{ display: "block" }}>
        <defs>
          <radialGradient id={uid + "g"} cx="0.85" cy="0.2" r="0.9">
            <stop offset="0" stopColor={accent} stopOpacity="0.1" />
            <stop offset="1" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="510" height="280" fill={`url(#${uid}g)`} />
        {/* faint contour rings as a "map" backdrop */}
        {[0, 1, 2, 3, 4].map((r) => (
          <ellipse key={r} cx={end[0] - 20} cy={end[1] + 24} rx={40 + r * 34} ry={26 + r * 22}
            fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        ))}
        {/* dashed base route (the planned line) */}
        <path d={route} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />
        {/* glowing traced route */}
        <PathTrace d={route} stroke={accent} width={3} seen={seen} />
        {/* waypoint dots */}
        {waypoints.map((w, i) => (
          <g key={i} className={`trace-marker ${seen ? "drawn" : ""}`} style={{ transitionDelay: `${0.9 + i * 0.35}s` }}>
            <circle cx={w[0]} cy={w[1]} r="4.5" fill="var(--ink)" stroke={accent} strokeWidth="2" />
            {w[2] && <text x={w[0]} y={w[1] - 11} fill="var(--fg-on-dark-faint)" fontSize="10.5" textAnchor="middle" fontFamily="var(--font-mono)">{w[2]}</text>}
          </g>
        ))}
        {/* trailhead flag */}
        <g transform="translate(44,244)">
          <circle r="6" fill={accent} />
          <circle r="11" fill="none" stroke={accent} strokeOpacity="0.4" strokeWidth="1.5" />
          <text x="0" y="26" fill="var(--fg-on-dark-muted)" fontSize="10.5" textAnchor="middle" fontFamily="var(--font-mono)" letterSpacing="1">START</text>
        </g>
        {/* objective marker — summit (Alta) or falls (Mist) */}
        <g transform={`translate(${end[0]},${end[1]})`} className={`trace-marker ${seen ? "drawn" : ""}`} style={{ transitionDelay: "1.7s" }}>
          {isHard ? (
            <Fragment>
              <circle className={`summit-ping ${seen ? "go" : ""}`} r="5" fill="none" stroke={accent} strokeWidth="2" />
              <path d="M0 -16 L7 -2 L-7 -2 Z" fill={accent} />
              <path d="M0 -16 L3 -10 L-3 -10 Z" fill="#cdeee9" />
            </Fragment>
          ) : (
            <Fragment>
              <circle r="7" fill={accent} fillOpacity="0.25" />
              <circle r="3.5" fill={accent} />
            </Fragment>
          )}
        </g>
      </svg>
      <span style={{ position: "absolute", top: 12, left: 14, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--fg-on-dark-faint)", display: "inline-flex", alignItems: "center", gap: 6 }}>
        <Icon name="route" size={13} style={{ color: accent }} />Route trace
      </span>
    </div>
  );
}

/* ---------- elevation profile, drawn on view, with summit reveal ---------- */
function ElevationChart({ profile, color, labels, isHard, seen }) {
  const W = 560, H = 200, padX = 8, padY = 18;
  const min = Math.min(...profile), max = Math.max(...profile);
  const span = max - min || 1;
  const pts = profile.map((v, i) => {
    const x = padX + (i / (profile.length - 1)) * (W - padX * 2);
    const y = padY + (1 - (v - min) / span) * (H - padY * 2);
    return [x, y];
  });
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${H} L${pts[0][0].toFixed(1)} ${H} Z`;
  const peakIdx = profile.indexOf(max);
  const peak = pts[peakIdx];
  const uid = useMemo(() => "ec" + Math.random().toString(36).slice(2, 8), []);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", overflow: "visible" }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.34" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1="0" x2={W} y1={padY + g * (H - padY * 2)} y2={padY + g * (H - padY * 2)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      <path d={area} fill={`url(#${uid})`} className={`trace-fill ${seen ? "drawn" : ""}`} />
      <PathTrace d={line} stroke={color} width={2.5} seen={seen} />
      {/* summit reveal: planted flag + ping */}
      <g className={`trace-marker ${seen ? "drawn" : ""}`} style={{ transitionDelay: "1.4s" }} transform={`translate(${peak[0]},${peak[1]})`}>
        <circle className={`summit-ping ${seen ? "go" : ""}`} cx="0" cy="0" r="5" fill="none" stroke={color} strokeWidth="2" />
        <circle cx="0" cy="0" r="5" fill={color} />
        {isHard && (
          <g className={`flag-plant ${seen ? "go" : ""}`}>
            <line x1="0" y1="-4" x2="0" y2="-22" stroke={color} strokeWidth="2" />
            <path d="M0 -22 L14 -18 L0 -13 Z" fill={color} />
          </g>
        )}
      </g>
    </svg>
  );
}

/* ---------- waterfall motion motif (Mist Falls header) ---------- */
function WaterfallMotif({ accent }) {
  const cols = [0, 1, 2, 3, 4];
  const uid = useMemo(() => "wf" + Math.random().toString(36).slice(2, 7), []);
  return (
    <svg viewBox="0 0 80 96" width="74" height="88" aria-hidden="true" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={uid}><rect x="26" y="8" width="28" height="64" /></clipPath>
        <linearGradient id={uid + "w"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={accent} stopOpacity="0" />
          <stop offset="0.4" stopColor={accent} stopOpacity="0.85" />
          <stop offset="1" stopColor="#cdeee9" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      {/* cliff */}
      <path d="M14 8 L26 8 L26 72 L14 78 Z" fill="rgba(255,255,255,0.06)" />
      <path d="M54 8 L66 8 L66 78 L54 72 Z" fill="rgba(255,255,255,0.06)" />
      {/* falling water columns */}
      <g clipPath={`url(#${uid})`}>
        {cols.map((c) => (
          <rect key={c} className="fall-col" x={28 + c * 5} y="0" width="3" height="40"
            fill={`url(#${uid}w)`} rx="1.5"
            style={{ animationDuration: `${0.7 + (c % 3) * 0.25}s`, animationDelay: `${c * 0.15}s` }} />
        ))}
      </g>
      {/* pool + mist */}
      <ellipse cx="40" cy="78" rx="20" ry="5" fill={accent} fillOpacity="0.2" />
      {[0, 1, 2, 3].map((m) => (
        <ellipse key={m} className="mist-puff" cx={30 + m * 7} cy="74" rx="5" ry="3" fill="#cdeee9"
          style={{ animationDuration: `${2 + (m % 2)}s`, animationDelay: `${m * 0.5}s` }} />
      ))}
    </svg>
  );
}

/* ---------- summit motif (Alta Peak header) ---------- */
function SummitMotif({ accent, seen }) {
  return (
    <svg viewBox="0 0 80 96" width="74" height="88" aria-hidden="true" style={{ overflow: "visible" }}>
      <path d="M8 84 L34 30 L48 54 L60 32 L74 84 Z" fill="rgba(255,255,255,0.07)" stroke={accent} strokeOpacity="0.3" strokeWidth="1" />
      <path d="M34 30 L26 46 L34 42 L42 50 L34 30 Z" fill="#cdeee9" fillOpacity="0.6" />
      <path d="M60 32 L54 44 L60 41 L66 48 L60 32 Z" fill="#cdeee9" fillOpacity="0.5" />
      <g transform="translate(34,30)">
        <circle className={`summit-ping ${seen ? "go" : ""}`} r="4" fill="none" stroke={accent} strokeWidth="2" />
        <g className={`flag-plant ${seen ? "go" : ""}`}>
          <line x1="0" y1="0" x2="0" y2="-18" stroke={accent} strokeWidth="2" />
          <path d="M0 -18 L13 -14 L0 -9 Z" fill={accent} />
        </g>
      </g>
    </svg>
  );
}

function TrailCard({ trail }) {
  const [ref, seen] = useInView({ threshold: 0.25 });
  const isHard = trail.difficultyLevel >= 4;
  const accent = isHard ? "var(--cv-magenta-400)" : "var(--summit)";
  return (
    <div ref={ref} className="xc" style={{ padding: 0, overflow: "hidden" }}>
      {/* trail photo banner */}
      <Photo
        src={trail.photo}
        alt={trail.name}
        label={`Add a ${trail.name} photo`}
        icon={isHard ? "mountain-snow" : "image"}
        focus={isHard ? "center 32%" : "center 38%"}
        radius="0"
        className="ticked"
        style={{ height: 210, borderLeft: 0, borderRight: 0, borderTop: 0 }}
      />
      {/* header band */}
      <div style={{ position: "relative", padding: "22px 24px 18px", background: isHard ? "linear-gradient(180deg, rgba(198,97,214,0.12), transparent)" : "linear-gradient(180deg, rgba(111,227,217,0.1), transparent)" }}>
        <div style={{ position: "absolute", top: 10, right: 14 }}>
          {isHard ? <SummitMotif accent={accent} seen={seen} /> : <WaterfallMotif accent={accent} />}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: accent }}>
            <Icon name={isHard ? "mountain-snow" : "footprints"} size={15} />{trail.difficulty}
          </span>
          <div className="diff-track" style={{ width: 88 }}>
            {[0, 1, 2, 3, 4].map((s) => (
              <span key={s} className={`diff-seg ${s < trail.difficultyLevel ? (isHard ? "on-4" : "on-2") : ""}`} />
            ))}
          </div>
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px,3.5vw,32px)", margin: 0, letterSpacing: "-0.02em" }}>{trail.name}</h3>
        <p style={{ margin: "6px 0 0", color: "var(--fg-on-dark-muted)", fontSize: 14, maxWidth: "78%" }}>{trail.subtitle}</p>
      </div>

      {/* route-tracing map */}
      <div style={{ padding: "4px 10px 0" }}>
        <TrailMap trail={trail} accent={accent} isHard={isHard} seen={seen} />
      </div>

      {/* elevation chart */}
      <div style={{ padding: "8px 6px 0" }}>
        <ElevationChart profile={trail.profile} color={accent} isHard={isHard} seen={seen} />
        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 18px 4px", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-on-dark-faint)" }}>
          <span>{trail.profileLabels.start} · {Math.min(...trail.profile).toLocaleString()} ft</span>
          <span style={{ color: accent }}>{trail.profileLabels.peak} · {Math.max(...trail.profile).toLocaleString()} ft</span>
        </div>
      </div>

      {/* stats grid */}
      <div style={{ padding: "16px 24px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {trail.stats.map((s) => (
            <div key={s.label} style={{ display: "flex", gap: 11, alignItems: "center", padding: "12px 14px", borderRadius: 13, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <Icon name={s.icon} size={19} style={{ color: accent, flex: "none" }} />
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, lineHeight: 1.1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "var(--fg-on-dark-faint)", marginTop: 2 }}>{s.label}{s.sub ? ` · ${s.sub}` : ""}</div>
              </div>
            </div>
          ))}
        </div>

        <p style={{ margin: "18px 0 14px", fontStyle: "italic", color: accent, fontSize: 14 }}>{trail.tone}</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: trail.conditions ? 16 : 18 }}>
          {trail.highlights.map((h) => (
            <span key={h} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 999, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--fg-on-dark-muted)" }}>{h}</span>
          ))}
        </div>

        {trail.conditions && (
          <div style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "13px 15px", borderRadius: 13, background: "rgba(245,192,74,0.08)", border: "1px solid rgba(245,192,74,0.24)", marginBottom: 18 }}>
            <Icon name="snowflake" size={18} style={{ color: "var(--blaze)", flex: "none", marginTop: 1 }} />
            <span style={{ fontSize: 13, color: "var(--fg-on-dark-muted)" }}>{trail.conditions}</span>
          </div>
        )}

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16 }}>
          <div className="kicker" style={{ fontSize: 10.5, marginBottom: 10 }}>Day pack checklist</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {trail.bring.map((b) => (
              <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, padding: "5px 11px", borderRadius: 999, background: isHard ? "rgba(198,97,214,0.1)" : "rgba(111,227,217,0.1)", border: `1px solid ${isHard ? "rgba(198,97,214,0.26)" : "rgba(111,227,217,0.26)"}`, color: accent }}>
                <Icon name="check" size={12} />{b}
              </span>
            ))}
          </div>
        </div>

        <a href={trail.mapsUrl} target="_blank" rel="noopener" className="xc-hover" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 18, padding: "11px 18px", borderRadius: 999, textDecoration: "none", fontSize: 13.5, fontWeight: 600, color: accent, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <Icon name="map" size={15} />View trailhead in Maps <Icon name="external-link" size={13} />
        </a>
      </div>
    </div>
  );
}

export function TrailIntel() {
  const trails = TRIP.trails;
  const order = ["mistFalls", "altaPeak"];
  return (
    <section className="section" id="trails" style={{ background: "linear-gradient(180deg, var(--ink), #0a1c17 50%, var(--ink))" }}>
      <div className="wrap">
        <SectionHead eyebrow="Trail Intel" title={<>Two trails. <span style={{ color: "var(--cv-magenta-400)" }}>One bad idea.</span></>} kicker="Friday is the granite-and-waterfall warmup. Saturday is the 14-mile sufferfest to 11,200 feet. Watch each route trace itself — and bring the snacks." />
        <div style={{ display: "grid", gap: 22, gridTemplateColumns: "1fr", marginTop: 40 }} className="trail-grid">
          {order.map((k) => (
            <TrailCard key={k} trail={trails[k]} />
          ))}
        </div>
      </div>
      <style>{`@media(min-width:880px){.trail-grid{grid-template-columns:1fr 1fr!important;align-items:start}}`}</style>
    </section>
  );
}

/* ---------- expedition stats (count-up) ---------- */
export function Stats() {
  const stats = TRIP.stats;
  const accentFor = (i) => (i === 1 ? "var(--cv-magenta-400)" : i === 7 || i === 8 ? "var(--blaze)" : "var(--summit)");
  const bgFor = (i) => (i === 1 ? "rgba(198,97,214,0.1)" : i === 7 || i === 8 ? "rgba(245,192,74,0.1)" : "rgba(111,227,217,0.1)");
  return (
    <section className="section topo-bg" id="stats">
      <div className="wrap">
        <SectionHead eyebrow="Expedition Stats" eyebrowClass="eyebrow-blaze" title="The mission by the numbers" kicker="Everything you need to know about the 40th celebration weekend, quantified." align="center" />
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", marginTop: 44 }}>
          {stats.map((s, i) => (
            <Reveal key={i} delay={(i % 3) * 60}>
              <div className="xc xc-hover" style={{ padding: "22px 18px", height: "100%", textAlign: "center" }}>
                <span style={{ display: "inline-grid", placeItems: "center", width: 44, height: 44, borderRadius: 13, color: accentFor(i), background: bgFor(i), border: `1px solid ${accentFor(i)}33` }}>
                  <Icon name={s.icon} size={21} />
                </span>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(26px,4vw,38px)", marginTop: 14, letterSpacing: "-0.02em", color: accentFor(i) }}>
                  <CountUp value={s.value} />
                </div>
                <div style={{ fontSize: 12.5, color: "var(--fg-on-dark-muted)", marginTop: 6 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
