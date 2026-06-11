/* =============================================================
   Shared UI kit — icons, reveal, section heads, topo texture,
   and the motion engine (parallax, scroll progress, count-up).
   ============================================================= */
import { useState, useEffect, useRef } from "react";
import { Icon } from "./icons.jsx";

export { Icon };

/* ---------- reveal-on-scroll ---------- */
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("in");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export function Reveal({ children, delay = 0, as = "div", className = "", style = {}, ...rest }) {
  const ref = useReveal();
  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ---------- section heading ---------- */
export function SectionHead({ eyebrow, eyebrowClass = "eyebrow-summit", title, kicker, children, align = "left" }) {
  return (
    <Reveal style={{ textAlign: align, maxWidth: align === "center" ? 760 : "none", margin: align === "center" ? "0 auto" : 0 }}>
      {eyebrow && (
        <div className="eyebrow" style={{ marginBottom: 14 }}>
          <span className={eyebrowClass}>{eyebrow}</span>
        </div>
      )}
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "clamp(30px, 4.6vw, 52px)",
          lineHeight: 1.04,
          letterSpacing: "-0.02em",
          margin: 0,
        }}
      >
        {title}
      </h2>
      {kicker && (
        <p style={{ color: "var(--fg-on-dark-muted)", fontSize: "clamp(15px,2vw,18px)", marginTop: 16, maxWidth: 640, marginInline: align === "center" ? "auto" : 0 }}>
          {kicker}
        </p>
      )}
      {children}
    </Reveal>
  );
}

/* ---------- placeholder image block ---------- */
export function ImgPlaceholder({ label = "Add photo", icon = "image", style = {}, className = "" }) {
  return (
    <div className={`imgph ${className}`} style={style}>
      <span className="imgph-label">
        <Icon name={icon} size={16} />
        {label}
      </span>
    </div>
  );
}

/* ---------- photo: real image when src is set, else a labeled slot ---------- */
export function Photo({ src, alt = "", label = "Add photo", icon = "image", caption, focus = "center", radius = "var(--r-lg)", style = {}, className = "" }) {
  const [broken, setBroken] = useState(false);
  const show = src && !broken;
  return (
    <figure className={`photo-frame ${className}`} style={{ margin: 0, borderRadius: radius, ...style }}>
      {show ? (
        <img src={src} alt={alt} loading="lazy" onError={() => setBroken(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: focus, display: "block" }} />
      ) : (
        <div className="imgph" style={{ width: "100%", height: "100%", borderRadius: radius }}>
          <span className="imgph-label"><Icon name={icon} size={16} />{label}</span>
        </div>
      )}
      {caption && show && <figcaption className="photo-cap"><Icon name="camera" size={12} />{caption}</figcaption>}
    </figure>
  );
}

/* ---------- topographic contour texture generator ---------- */
function buildTopo() {
  const W = 760, cx = 380, cy = 380;
  const rings = 13;
  const seeds = [1.7, 3.1, 4.4, 2.2, 5.6, 1.1, 3.9];
  let paths = "";
  for (let r = 0; r < rings; r++) {
    const base = 26 + r * 27;
    const steps = 72;
    let d = "";
    for (let s = 0; s <= steps; s++) {
      const a = (s / steps) * Math.PI * 2;
      let noise = 0;
      seeds.forEach((sd, k) => {
        noise += Math.sin(a * (k + 2) + sd + r * 0.45) * (10 - k * 1.1);
      });
      const rad = base + noise + r * 1.5;
      const x = cx + Math.cos(a) * rad;
      const y = cy + Math.sin(a) * rad * 0.92;
      d += (s === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1) + " ";
    }
    const op = r % 4 === 0 ? 0.5 : 0.28;
    paths += `<path d='${d}Z' fill='none' stroke='%236FE3D9' stroke-opacity='${op}' stroke-width='1'/>`;
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${W}' viewBox='0 0 ${W} ${W}'>${paths}</svg>`;
  return `url("data:image/svg+xml,${svg.replace(/#/g, "%23").replace(/\n/g, "")}")`;
}
document.documentElement.style.setProperty("--topo-url", buildTopo());

/* =============================================================
   MOTION ENGINE — parallax, scroll progress, in-view, count-up
   ============================================================= */
export const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- single shared rAF scroll loop; subscribers get scrollY ---- */
const _scrollSubs = new Set();
let _ticking = false;
function _onScroll() {
  if (_ticking) return;
  _ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    _scrollSubs.forEach((fn) => fn(y));
    _ticking = false;
  });
}
window.addEventListener("scroll", _onScroll, { passive: true });
window.addEventListener("resize", _onScroll, { passive: true });

/* ---- parallax: translateY(scrollY * speed) relative to element's start ---- */
export function useParallax(speed = 0.2, axis = "y") {
  const ref = useRef(null);
  useEffect(() => {
    if (REDUCED || !ref.current) return;
    const el = ref.current;
    let base = 0;
    const measure = () => { base = window.scrollY + el.getBoundingClientRect().top; };
    measure();
    const apply = (y) => {
      const rel = y - base;
      const t = (rel * speed).toFixed(2);
      el.style.transform = axis === "y" ? `translate3d(0, ${t}px, 0)` : `translate3d(${t}px, 0, 0)`;
    };
    apply(window.scrollY);
    _scrollSubs.add(apply);
    window.addEventListener("resize", measure);
    return () => { _scrollSubs.delete(apply); window.removeEventListener("resize", measure); };
  }, [speed, axis]);
  return ref;
}

/* ---- global document scroll progress 0..1 ---- */
export function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0);
    };
    fn();
    _scrollSubs.add(fn);
    return () => _scrollSubs.delete(fn);
  }, []);
  return p;
}

/* ---- in-view boolean (fires once by default) ---- */
export function useInView({ threshold = 0.3, once = true } = {}) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (REDUCED) { setSeen(true); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { setSeen(true); if (once) io.unobserve(el); }
        else if (!once) setSeen(false);
      }),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);
  return [ref, seen];
}

/* ---- count-up: animates the numeric part of a string in-place ---- */
export function CountUp({ value, duration = 1500, className = "", style = {} }) {
  const [ref, seen] = useInView({ threshold: 0.5 });
  const m = String(value).match(/^([^\d-]*)(-?[\d,]*\.?\d+)(.*)$/);
  const [shown, setShown] = useState(m ? m[1] + "0" + m[3] : value);
  useEffect(() => {
    if (!m) { setShown(value); return; }
    if (!seen) return;
    if (REDUCED) { setShown(value); return; }
    const prefix = m[1], suffix = m[3];
    const hasComma = m[2].includes(",");
    const dec = (m[2].split(".")[1] || "").length;
    const end = parseFloat(m[2].replace(/,/g, ""));
    const t0 = performance.now();
    let raf;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      const cur = end * eased;
      const num = dec ? cur.toFixed(dec) : Math.round(cur);
      const formatted = hasComma ? Number(num).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) : num;
      setShown(prefix + formatted + suffix);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value]);
  return <span ref={ref} className={className} style={style}>{shown}</span>;
}
