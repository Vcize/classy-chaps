/* =============================================================
   Sections A — Nav, Hero + Countdown, Mission, Crew
   ============================================================= */
import { useState, useEffect, useMemo } from "react";
import { Icon, Reveal, SectionHead, Photo, useParallax, useInView } from "./ui.jsx";
import { TRIP } from "./data.js";

/* ---------- parallax layer wrapper ---------- */
function PLayer({ speed, z, children, style = {} }) {
  const ref = useParallax(speed);
  return (
    <div ref={ref} aria-hidden="true" style={{ position: "absolute", inset: "-12% 0", zIndex: z, willChange: "transform", ...style }}>
      {children}
    </div>
  );
}

/* ---------- designed Sierra ridgeline hero backdrop (parallax) ---------- */
function HeroScene() {
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        x: (i * 67.3) % 100,
        y: (i * 37.1) % 60,
        r: ((i * 13) % 3) * 0.5 + 0.6,
        d: ((i * 7) % 10) * 0.4,
        dur: 2.4 + ((i * 5) % 5) * 0.7,
      })),
    []
  );
  const ridge = (W, H) => ({ width: "100%", height: H, position: "absolute", bottom: 0, left: 0 });
  return (
    <div className="hero-photo" aria-hidden="true">
      {/* base sky */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "linear-gradient(180deg, #0a2a30 0%, #0c2b24 42%, #08140f 100%)" }} />
      {/* drifting moonlight wash */}
      <div className="moon-wash" style={{ position: "absolute", inset: 0, zIndex: 1 }} />

      {/* moon + stars — slowest */}
      <PLayer speed={0.6} z={2}>
        <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <radialGradient id="moonHalo" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#bff3ee" stopOpacity="0.5" />
              <stop offset="0.5" stopColor="#6FE3D9" stopOpacity="0.16" />
              <stop offset="1" stopColor="#6FE3D9" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g className="moon-drift">
            <circle cx="1130" cy="155" r="120" fill="url(#moonHalo)" />
            <circle cx="1130" cy="155" r="46" fill="#cdf6f1" />
            <circle cx="1110" cy="146" r="46" fill="#0c2b24" opacity="0.96" />
          </g>
          {stars.map((st, i) => (
            <circle key={i} cx={st.x * 14.4} cy={st.y * 9} r={st.r}
              fill="#e6fffb" style={{ animation: `tw ${st.dur}s ease-in-out ${st.d}s infinite`, opacity: 0.5 }} />
          ))}
        </svg>
      </PLayer>

      {/* far ridge */}
      <PLayer speed={0.45} z={3}>
        <svg viewBox="0 0 1440 900" preserveAspectRatio="none" style={ridge(1440, "100%")}>
          <defs><linearGradient id="r1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1c4a44" /><stop offset="1" stopColor="#143a35" /></linearGradient></defs>
          <path d="M0 520 L150 470 L330 510 L520 430 L720 500 L900 440 L1120 500 L1300 450 L1440 490 L1440 900 L0 900 Z" fill="url(#r1)" opacity="0.85" />
        </svg>
      </PLayer>

      {/* mid ridge */}
      <PLayer speed={0.3} z={4}>
        <svg viewBox="0 0 1440 900" preserveAspectRatio="none" style={ridge(1440, "100%")}>
          <defs><linearGradient id="r2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#163a37" /><stop offset="1" stopColor="#0f2c28" /></linearGradient></defs>
          <path d="M0 600 L220 560 L400 610 L600 540 L820 605 L1040 545 L1240 610 L1440 565 L1440 900 L0 900 Z" fill="url(#r2)" />
          <path d="M600 540 L578 575 L600 567 L626 583 L600 540 Z" fill="#cdeee9" opacity="0.45" />
        </svg>
      </PLayer>

      {/* near granite — fastest (foreground) */}
      <PLayer speed={0.12} z={5}>
        <svg viewBox="0 0 1440 900" preserveAspectRatio="none" style={ridge(1440, "100%")}>
          <defs><linearGradient id="r3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0e2622" /><stop offset="1" stopColor="#0a1c18" /></linearGradient></defs>
          <path d="M0 720 L180 690 L360 735 L520 660 L640 705 L760 620 L900 700 L1080 670 L1280 730 L1440 695 L1440 900 L0 900 Z" fill="url(#r3)" />
          <path d="M760 620 L735 660 L760 652 L785 668 L760 620 Z" fill="#cdeee9" opacity="0.5" />
          <path d="M520 660 L500 690 L520 684 L545 698 L520 660 Z" fill="#cdeee9" opacity="0.4" />
        </svg>
      </PLayer>
    </div>
  );
}

/* ---------- countdown ---------- */
function Countdown({ targetISO }) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  const cells = [
    { n: d, l: "Days" },
    { n: h, l: "Hours" },
    { n: m, l: "Min" },
    { n: s, l: "Sec" },
  ];
  return (
    <div className="count-grid">
      {cells.map((c) => (
        <div className="count-cell" key={c.l}>
          <div className="count-num">{String(c.n).padStart(2, "0")}</div>
          <div className="count-lbl">{c.l}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- nav ---------- */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    ["Mission", "mission"], ["Crew", "crew"], ["Flights", "flights"],
    ["Base Camp", "basecamp"], ["Itinerary", "itinerary"], ["Trails", "trails"],
    ["Packing", "packing"],
  ];
  const go = (id) => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap nav-inner">
        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          style={{ display: "flex", alignItems: "center", gap: 11, textDecoration: "none", color: "inherit" }}>
          <span className="crest"><Icon name="mountain" size={20} /></span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, letterSpacing: "0.01em" }}>Summit Club</span>
            <span style={{ fontSize: 9.5, letterSpacing: "0.24em", color: "var(--fg-on-dark-faint)", marginTop: 3 }}>EST. 2026</span>
          </span>
        </a>
        <div className="nav-links">
          {links.map(([label, id]) => (
            <a key={id} className="nav-link" href={`#${id}`} onClick={(e) => { e.preventDefault(); go(id); }}>{label}</a>
          ))}
        </div>
        <button onClick={() => setOpen((o) => !o)} aria-label="Menu"
          style={{ display: "grid", placeItems: "center", width: 42, height: 42, borderRadius: 11, background: "rgba(111,227,217,0.1)", border: "1px solid rgba(111,227,217,0.26)", color: "var(--summit)", cursor: "pointer" }}
          className="nav-burger">
          <Icon name={open ? "x" : "menu"} size={20} />
        </button>
      </div>
      {open && (
        <div className="wrap" style={{ paddingBottom: 16 }}>
          <div className="xc" style={{ padding: 8, display: "grid", gap: 2 }}>
            {links.map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); go(id); }}
                style={{ padding: "12px 14px", borderRadius: 10, color: "var(--fg-on-dark)", textDecoration: "none", fontSize: 15, fontWeight: 500 }}>{label}</a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

/* ---------- hero ---------- */
export function Hero() {
  const b = TRIP.brand;
  return (
    <header className="hero" id="top">
      <HeroScene />
      <div className="hero-scrim" />
      <div className="hero-content wrap">
        <Reveal>
          <div className="np-badge" style={{ marginBottom: 22 }}>
            <span className="crest" style={{ width: 26, height: 26, borderRadius: 8 }}><Icon name="tent-tree" size={15} /></span>
            {b.location}
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p className="kicker" style={{ marginBottom: 14, color: "var(--blaze)" }}>{b.callToArms}</p>
        </Reveal>
        <h1 className="hero-title" style={{ marginTop: 4 }}>
          <span className="l1">Classy Chaps</span><span className="l2">Summit Club</span>
        </h1>
        <Reveal delay={220}>
          <p style={{ maxWidth: 560, fontSize: "clamp(16px,2.4vw,20px)", color: "var(--fg-on-dark-muted)", marginTop: 22, marginBottom: 30 }}>
            {b.tagline}
          </p>
        </Reveal>
        <Reveal delay={300}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 18, marginBottom: 34 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 600 }}>
              <Icon name="calendar-days" size={18} className="eyebrow-summit" style={{ color: "var(--summit)" }} />
              {b.dates}
            </div>
            <span className="divider-dot">•</span>
            <div style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 600 }}>
              <Icon name="users" size={18} style={{ color: "var(--summit)" }} />
              7 chaps · 2 birthdays
            </div>
          </div>
        </Reveal>
        <Reveal delay={360}>
          <p className="kicker" style={{ marginBottom: 12 }}>Countdown to wheels-down</p>
          <Countdown targetISO={b.targetISO} />
        </Reveal>
        <Reveal delay={480} style={{ marginTop: 30 }}>
          <span className="scroll-cue"><span className="dot" />Begin ascent</span>
        </Reveal>
      </div>
    </header>
  );
}

/* ---------- mission ---------- */
export function Mission() {
  const m = TRIP.mission;
  return (
    <section className="section topo-bg" id="mission">
      <div className="wrap">
        <div style={{ display: "grid", gap: "clamp(28px,5vw,64px)", gridTemplateColumns: "1fr", alignItems: "center" }} className="mission-grid">
          <div>
            <SectionHead eyebrow={m.eyebrow} title={m.title} />
            <Reveal delay={80}>
              <p style={{ color: "var(--fg-on-dark-muted)", fontSize: "clamp(15px,2vw,18px)", marginTop: 22, maxWidth: 560 }}>{m.body}</p>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {m.pillars.map((p, i) => (
                <div key={i} className="xc xc-hover" style={{ padding: 20 }}>
                  <span className={`ico-tile ${i === 2 ? "punch" : i === 3 ? "blaze" : ""}`}><Icon name={p.icon} size={22} /></span>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, marginTop: 16 }}>{p.value}</div>
                  <div style={{ color: "var(--fg-on-dark-faint)", fontSize: 13, marginTop: 4 }}>{p.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`@media(min-width:880px){.mission-grid{grid-template-columns:1.1fr 0.9fr!important}}`}</style>
    </section>
  );
}

/* ---------- crew mission patches ---------- */
function PatchCard({ c, i }) {
  const [ref, seen] = useInView({ threshold: 0.35 });
  const accent = c.birthday ? "var(--cv-magenta-400)" : "var(--summit)";
  const rivets = [
    { top: 7, left: "50%", mt: 0, ml: -2.5 },
    { top: "50%", left: 7, mt: -2.5, ml: 0 },
    { top: "50%", right: 7, mt: -2.5 },
    { bottom: 7, left: "50%", ml: -2.5 },
  ];
  return (
    <div
      ref={ref}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? "none" : "scale(0.84) rotate(-7deg)",
        transition: "opacity 0.6s var(--ease-out), transform 0.7s cubic-bezier(0.34,1.56,0.64,1)",
        transitionDelay: `${(i % 4) * 90}ms`,
        textAlign: "center",
      }}
    >
      <div className="patch-wrap">
        <div className={`patch ${c.birthday ? "birthday" : ""}`}>
          <div className="patch-shine" />
          {rivets.map((r, k) => (
            <span key={k} className="patch-rivet" style={{ ...r, background: accent, opacity: 0.6 }} />
          ))}
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "12% 8%" }}>
            <span style={{ fontSize: "clamp(8px,2.1vw,10px)", letterSpacing: "0.2em", textTransform: "uppercase", color: accent, fontWeight: 700, marginBottom: "4%" }}>
              {c.birthday ? "Est. 40 yrs" : "Summit Club"}
            </span>
            <span className="patch-mono" style={{ color: c.birthday ? "var(--cv-magenta-400)" : "var(--fg-on-dark)" }}>
              {c.birthday ? "40" : c.name[0]}
            </span>
            <span style={{ display: "inline-flex", gap: 3, margin: "6% 0", color: accent }}>
              <Icon name={c.birthday ? "cake" : "mountain"} size={13} />
            </span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(12px,3vw,16px)", lineHeight: 1 }}>{c.name}</span>
          </div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: accent, fontWeight: 600, marginTop: 13 }}>{c.role}</div>
      <div style={{ fontSize: 12, color: "var(--fg-on-dark-faint)", marginTop: 4, textWrap: "balance" }}>{c.note}</div>
    </div>
  );
}

export function Crew() {
  const crew = TRIP.crew;
  const photos = TRIP.photos;
  return (
    <section className="section" id="crew" style={{ background: "linear-gradient(180deg, var(--ink), #0a1c17 60%, var(--ink))", overflowX: "clip" }}>
      <div className="wrap">
        <SectionHead eyebrow="The Crew" title={<>Seven <span style={{ color: "var(--summit)" }}>classy chaps</span></>} kicker="Every expedition issues patches. Hover a badge to catch the light — two of these gentlemen are turning forty." />

        {/* featured birthday boys */}
        <Reveal delay={60}>
          <div className="birthday-feature" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0, marginTop: 40, borderRadius: "var(--r-xl)", overflow: "hidden", border: "1px solid rgba(198,97,214,0.3)", background: "linear-gradient(180deg, rgba(198,97,214,0.08), rgba(20,16,38,0.5))" }}>
            <Photo
              src={photos.birthdayBoys}
              alt="DiBlasi and Brett, the birthday boys"
              label="The birthday boys"
              icon="users"
              focus="center 30%"
              radius="0"
              className="ticked"
              caption="DiBlasi (left) & Brett · pre-expedition carbo-load"
              style={{ minHeight: 260, height: "100%" }}
            />
            <div style={{ padding: "clamp(22px,3.5vw,34px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, alignSelf: "flex-start", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--cv-magenta-400)", background: "rgba(198,97,214,0.14)", border: "1px solid rgba(198,97,214,0.3)", padding: "6px 13px", borderRadius: 999 }}>
                <Icon name="cake" size={14} />Turning 40 × 2
              </span>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(24px,3.6vw,36px)", margin: "16px 0 0", letterSpacing: "-0.02em" }}>
                The birthday boys
              </h3>
              <p style={{ color: "var(--fg-on-dark-muted)", fontSize: "clamp(14px,2vw,16px)", marginTop: 12, maxWidth: 460 }}>
                <strong style={{ color: "var(--cv-magenta-400)" }}>DiBlasi</strong> and <strong style={{ color: "var(--cv-magenta-400)" }}>Brett</strong> are the reason we're dragging seven grown men up 4,000 feet of granite. The least they can do is summit for it.
              </p>
              <p style={{ fontStyle: "italic", color: "var(--blaze)", fontSize: 14, marginTop: 14 }}>"Hell yeah. I'm definitely in."</p>
            </div>
          </div>
        </Reveal>

        <div style={{ display: "grid", gap: "28px 18px", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", marginTop: 44 }}>
          {crew.map((c, i) => (
            <PatchCard key={c.name} c={c} i={i} />
          ))}
        </div>
      </div>
      <style>{`@media(min-width:760px){.birthday-feature{grid-template-columns:1.05fr 0.95fr!important}}`}</style>
    </section>
  );
}
