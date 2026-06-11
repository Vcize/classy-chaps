/* =============================================================
   Extras — Expedition progress tracker + Achievement badges
   ============================================================= */
import { useState, useEffect, useMemo, Fragment } from "react";
import { Icon, Reveal, SectionHead, useScrollProgress } from "./ui.jsx";

/* ---------- floating expedition progress tracker ---------- */
export function ExpeditionTracker() {
  const progress = useScrollProgress();
  const waypoints = useMemo(
    () => [
      { id: "top", label: "Trailhead", icon: "tent-tree" },
      { id: "crew", label: "The Crew", icon: "users" },
      { id: "basecamp", label: "Base Camp", icon: "home" },
      { id: "trails", label: "On Trail", icon: "footprints" },
      { id: "stats", label: "Summit", icon: "mountain-snow" },
      { id: "quotes", label: "Campfire", icon: "flame" },
    ],
    []
  );
  const [fracs, setFracs] = useState(waypoints.map((_, i) => i / (waypoints.length - 1)));
  useEffect(() => {
    const measure = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setFracs(
        waypoints.map((w) => {
          const el = document.getElementById(w.id);
          if (!el || h <= 0) return 0;
          const top = window.scrollY + el.getBoundingClientRect().top;
          return Math.min(1, Math.max(0, top / h));
        })
      );
    };
    measure();
    const t1 = setTimeout(measure, 600);
    const t2 = setTimeout(measure, 1600);
    window.addEventListener("resize", measure);
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener("resize", measure); };
  }, []);

  let current = 0;
  fracs.forEach((f, i) => { if (progress + 0.015 >= f) current = i; });

  const go = (id) => {
    if (id === "top") window.scrollTo({ top: 0, behavior: "smooth" });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const pctLabel = Math.round(progress * 100);

  return (
    <Fragment>
      {/* top hairline progress */}
      <div className="exp-top"><div className="exp-top-fill" style={{ width: `${progress * 100}%` }} /></div>

      {/* right vertical rail (desktop) */}
      <div className="exp-rail" aria-hidden="true">
        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <div className="mono" style={{ fontSize: 15, fontWeight: 700, color: "var(--summit)", lineHeight: 1 }}>{String(pctLabel).padStart(2, "0")}<span style={{ fontSize: 9, color: "var(--fg-on-dark-faint)" }}>%</span></div>
          <div style={{ fontSize: 8.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--fg-on-dark-faint)", marginTop: 4 }}>Ascent</div>
        </div>
        <div className="exp-track" style={{ height: "min(54vh, 460px)" }}>
          <div className="exp-track-fill" style={{ height: `${progress * 100}%` }} />
          <div className="exp-climber" style={{ top: `${progress * 100}%` }} />
          {waypoints.map((w, i) => (
            <div
              key={w.id}
              className={`exp-node ${i < current ? "done" : ""} ${i === current ? "current" : ""}`}
              style={{ top: `${fracs[i] * 100}%`, cursor: "pointer" }}
              onClick={() => go(w.id)}
              role="button"
              title={w.label}
            >
              <span className="exp-dot" />
              <span className="exp-label">{w.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
}

/* ---------- achievement badges ---------- */
export function Achievements() {
  const badges = [
    { icon: "plane", tone: "blaze", title: "Wheels Down", desc: "All seven chaps land in Fresno", meta: "Thu Jun 18" },
    { icon: "waves", tone: "", title: "Falls Chaser", desc: "8 miles & 875 ft to Mist Falls", meta: "Fri · Moderate" },
    { icon: "mountain-snow", tone: "punch", title: "Alta Summiteer", desc: "11,200 ft — the 14-mile bad idea", meta: "Sat · Hard" },
    { icon: "trending-up", tone: "blaze", title: "Vertical Mile", desc: "~4,800 ft of cumulative gain", meta: "Two hikes" },
    { icon: "cake", tone: "punch", title: "Forty & Fearless", desc: "Two birthdays conquered on trail", meta: "Brett · DiBlasi" },
    { icon: "cookie", tone: "", title: "Snack Sommelier", desc: "Mandatory breaks, expertly taken", meta: "100% rate" },
  ];
  return (
    <section className="section" id="achievements" style={{ background: "linear-gradient(180deg, var(--ink), #0a1c17 55%, var(--ink))" }}>
      <div className="wrap">
        <SectionHead align="center" eyebrow="Achievement Unlocks" title={<>Patches to <span style={{ color: "var(--summit)" }}>earn</span></>} kicker="Complete the mission, collect the hardware. Bragging rights are non-transferable." />
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", marginTop: 44 }}>
          {badges.map((b, i) => {
            const accent = b.tone === "blaze" ? "var(--blaze)" : b.tone === "punch" ? "var(--cv-magenta-400)" : "var(--summit)";
            return (
              <Reveal key={i} delay={(i % 3) * 70}>
                <div className="xc badge-row" style={{ padding: 20, display: "flex", gap: 16, alignItems: "center", height: "100%" }}>
                  <span className={`badge-medal ${b.tone}`}><Icon name={b.icon} size={26} /></span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17 }}>{b.title}</span>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--fg-on-dark-muted)", marginTop: 4 }}>{b.desc}</div>
                    <div style={{ fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: accent, fontWeight: 700, marginTop: 9 }}>{b.meta}</div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
