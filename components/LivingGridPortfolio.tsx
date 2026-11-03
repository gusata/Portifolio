"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

type PortfolioProject = {
  id: string;
  number: string;
  name: string;
  category: string;
  description: string;
  detail: string;
  href?: string;
  live?: string;
  artwork: "claudefy" | "leia" | "bob" | "blitz";
};

const projects: PortfolioProject[] = [
  {
    id: "claudefy",
    number: "01",
    name: "Claudefy",
    category: "WINDOWS UTILITY / AI TOOLING",
    description: "Live Claude Code token usage, session limits and plan progress, surfaced through native Windows notifications.",
    detail: "LOCAL TOOL / SYSTEM NOTIFICATIONS",
    href: "https://github.com/gusata/ClaudeFy",
    artwork: "claudefy",
  },
  {
    id: "leia",
    number: "02",
    name: "LEIA",
    category: "AI / CODE DOCUMENTATION",
    description: "An AI documentation engine that reads a codebase and turns its structure into clear project documentation.",
    detail: "CODEBASE → DOCUMENTATION",
    href: "https://github.com/gusata/LEIA",
    artwork: "leia",
  },
  {
    id: "bob",
    number: "03",
    name: "Bob",
    category: "PRODUCT / BROWSER START PAGE",
    description: "A quiet browser start page for local notes and text shortcuts. Personal data stays on the device.",
    detail: "LOCAL NOTES / TEXT SHORTCUTS",
    href: "https://github.com/gusata/Bob",
    live: "https://bob-webpage.vercel.app/",
    artwork: "bob",
  },
  {
    id: "blitz",
    number: "04",
    name: "Blitz",
    category: "PRODUCT / DOCUMENT OCR",
    description: "An AI-assisted OCR workflow that reads documents and sends extracted information into a system.",
    detail: "DOCUMENT → INFORMATION",
    artwork: "blitz",
  },
];

const navigation = [
  { number: "01", label: "WORK", href: "#work" },
  { number: "02", label: "ABOUT", href: "#about" },
  { number: "03", label: "PLAYGROUND", href: "#playground" },
  { number: "04", label: "CONTACT", href: "#contact" },
];

const introEvent = "gg-living-grid-intro-change";
const motionPreference = "(prefers-reduced-motion: reduce)";
function reducedMotionSnapshot() {
  return typeof window !== "undefined" && window.matchMedia(motionPreference).matches;
}
function subscribeToMotionPreference(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia(motionPreference);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
function useReducedPreference() {
  return useSyncExternalStore(subscribeToMotionPreference, reducedMotionSnapshot, () => false);
}
function introSnapshot() {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem("gg-living-grid-intro") !== "seen" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
}
function subscribeToIntro(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  window.addEventListener(introEvent, callback);
  preference.addEventListener("change", callback);
  return () => {
    window.removeEventListener(introEvent, callback);
    preference.removeEventListener("change", callback);
  };
}
function markIntroSeen() {
  try { window.sessionStorage.setItem("gg-living-grid-intro", "seen"); } catch { /* Storage can be disabled. */ }
  window.dispatchEvent(new Event(introEvent));
}

type FlightPoint = { x: number; y: number; size: number };
type FlightGeometry = { source: [FlightPoint, FlightPoint]; target: [FlightPoint, FlightPoint] };
type FlightRef = RefObject<HTMLSpanElement | null>;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

function Arrow() {
  return <span aria-hidden="true" className="menu-arrow">↗</span>;
}

function IntroSequence() {
  const [phase, setPhase] = useState<"hold" | "exit">("hold");
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setPhase("exit");
    window.setTimeout(markIntroSeen, 560);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(finish, 2450);
    return () => window.clearTimeout(timer);
  }, [finish]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = originalOverflow; };
  }, []);

  return (
    <div className="intro-sequence" data-phase={phase} role="presentation">
      <div className="intro-shutter intro-shutter--top" />
      <div className="intro-shutter intro-shutter--bottom" />
      <div className="intro-rules" />
      <p className="intro-overline"><span>G / 01</span><span>AN INDEPENDENT DIGITAL PRACTICE</span></p>
      <div className="intro-mark" aria-label="Gustavo Galeazzi">
        <span className="intro-single" aria-hidden="true">G</span>
        <span className="intro-fragments" aria-hidden="true">{Array.from({ length: 13 }, (_, i) => <i key={i} className="intro-fragment" />)}</span>
        <h1 className="intro-name"><span>GUSTAVO</span><span>GALEAZZI</span></h1>
      </div>
      <div className="intro-cut" aria-hidden="true"><i /></div>
      <p className="intro-foot"><span>FORM / FUNCTION / FEELING</span><span>THE LIVING GRID</span><span>2026</span></p>
      <button className="intro-skip" onClick={finish} type="button">SKIP INTRO <b>↗</b></button>
    </div>
  );
}

function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const latest = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.body.classList.add("cursor-ready");
    const node = cursorRef.current;
    if (!node) return;

    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      latest.current = { x: event.clientX, y: event.clientY };
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(() => {
        node.style.setProperty("--cursor-x", `${latest.current.x}px`);
        node.style.setProperty("--cursor-y", `${latest.current.y}px`);
        node.classList.add("is-visible");
        frame.current = 0;
      });
    };
    const inspect = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const interactive = target.closest<HTMLElement>("[data-cursor]");
      const mode = interactive?.dataset.cursor ?? "default";
      node.dataset.mode = mode;
      const label = node.querySelector<HTMLElement>(".cursor-label");
      if (label) label.textContent = mode === "view" ? "VIEW" : mode === "drag" ? "MOVE" : mode === "open" ? "OPEN" : "";
    };
    const leave = () => node.classList.remove("is-visible");
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", inspect);
    document.addEventListener("pointerout", inspect);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      document.body.classList.remove("cursor-ready");
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", inspect);
      document.removeEventListener("pointerout", inspect);
      document.documentElement.removeEventListener("pointerleave", leave);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  return <div className="custom-cursor" ref={cursorRef} aria-hidden="true"><span className="cursor-label" /></div>;
}

function Navigation({
  menuOpen,
  setMenuOpen,
  menuMounted,
  setMenuMounted,
  activeIndex,
  markRef,
  markFirstRef,
  markSecondRef,
  markOpacity,
  navOpacity,
  navHiddenAtEnd,
}: {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  menuMounted: boolean;
  setMenuMounted: (mounted: boolean) => void;
  activeIndex: number;
  markRef: RefObject<HTMLAnchorElement | null>;
  markFirstRef: FlightRef;
  markSecondRef: FlightRef;
  markOpacity: MotionValue<number>;
  navOpacity: MotionValue<number>;
  navHiddenAtEnd: boolean;
}) {
  const reducedMotion = useReducedPreference();

  useEffect(() => {
    if (!menuMounted) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuMounted, setMenuOpen]);

  return (
    <>
      <motion.header className="site-nav" aria-label="Main navigation" aria-hidden={navHiddenAtEnd} inert={navHiddenAtEnd} style={{ opacity: navOpacity, pointerEvents: navHiddenAtEnd ? "none" : "auto" }}>
        <a ref={markRef} className="brand-mark" href="#top" aria-label="Gustavo Galeazzi, back to top" data-cursor="open">
          <motion.span ref={markFirstRef} style={{ opacity: markOpacity }}>G</motion.span>
          <motion.span ref={markSecondRef} style={{ opacity: markOpacity }}>G</motion.span>
          <motion.i aria-hidden="true" style={{ opacity: markOpacity }} />
        </a>
        <span className="nav-caption">CREATIVE DEVELOPER / 2026</span>
        <div className="nav-side">
          <div className="nav-index" aria-label={`Section ${activeIndex + 1} of 4`}>
            <span>INDEX</span>
            <span className="nav-index-window" aria-hidden="true">
              <motion.span key={activeIndex} initial={reducedMotion ? false : { y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reducedMotion ? undefined : { y: -12, opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .3, ease: [0.16, 1, 0.3, 1] }}>{String(activeIndex + 1).padStart(2, "0")}</motion.span>
            </span>
          </div>
          <button className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="site-menu" onClick={() => {
            if (menuOpen) setMenuOpen(false);
            else { setMenuMounted(true); setMenuOpen(true); }
          }} data-cursor="open"><span>{menuOpen ? "CLOSE" : "INDEX"}</span><b aria-hidden="true" /></button>
        </div>
      </motion.header>

      {menuMounted && (
        <div id="site-menu" className="menu-layer" data-open={menuOpen ? "true" : "false"} role="dialog" aria-modal="true" aria-label="Section index" onAnimationEnd={(event) => {
          if (event.target === event.currentTarget && !menuOpen && event.animationName.startsWith("menu-close")) setMenuMounted(false);
          if (event.animationName === "menu-close-bottom" && !menuOpen) setMenuMounted(false);
        }}>
          <nav className="menu-copy" aria-label="Portfolio sections">
            <div className="menu-meta"><span>GUSTAVO GALEAZZI / INDEX</span><span>SELECT A FRAME / 2026</span></div>
            <div className="menu-list">
              {navigation.map((item, index) => (
                <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} data-cursor="open" style={{ "--menu-delay": `${index * 90}ms` } as CSSProperties}>
                  <span className="menu-number">{item.number}</span><span className="menu-label">{item.label}</span><Arrow />
                </a>
              ))}
            </div>
            <div className="menu-meta"><span>DESIGN / DEVELOPMENT / EXPLORATION</span><span>SÃO PAULO, BR</span></div>
          </nav>
          <div className="menu-shutter menu-shutter--top" />
          <div className="menu-shutter menu-shutter--bottom" />
        </div>
      )}
    </>
  );
}

function GlyphLine({
  text,
  className = "",
  firstGRef,
  secondGRef,
  isFirst = false,
}: {
  text: string;
  className?: string;
  firstGRef?: FlightRef;
  secondGRef?: FlightRef;
  isFirst?: boolean;
}) {
  const letters = text.split("");
  return (
    <span className={`hero-title-line ${className}`} aria-label={text}>
      {letters.map((letter, index) => {
        const ref = letter === "G" && index === 0 ? (isFirst ? firstGRef : secondGRef) : undefined;
        return <span className="hero-glyph" data-glyph key={`${letter}-${index}`} ref={ref}>{letter}</span>;
      })}
    </span>
  );
}

function Hero({
  heroRef,
  firstGRef,
  secondGRef,
  progress,
  ruleScale,
  reduced,
}: {
  heroRef: RefObject<HTMLElement | null>;
  firstGRef: FlightRef;
  secondGRef: FlightRef;
  progress: MotionValue<number>;
  ruleScale: MotionValue<number>;
  reduced: boolean;
}) {
  const titleOpacity = useTransform(progress, (value) => reduced ? 1 : 1 - clamp01((value - .18) / .72));

  const respondToPointer = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch" || reduced) return;
    const glyphs = event.currentTarget.querySelectorAll<HTMLElement>("[data-glyph]");
    glyphs.forEach((glyph) => {
      const rect = glyph.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);
      const reach = Math.max(1, 205 - distance);
      const force = Math.max(0, reach / 205);
      glyph.style.setProperty("--glyph-x", `${Math.max(-7, Math.min(7, dx * .024 * force))}px`);
      glyph.style.setProperty("--glyph-y", `${Math.max(-4, Math.min(4, dy * .018 * force))}px`);
      glyph.style.setProperty("--glyph-w", `${1 + force * .065}`);
    });
  };
  const resetGlyphs = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.querySelectorAll<HTMLElement>("[data-glyph]").forEach((glyph) => {
      glyph.style.setProperty("--glyph-x", "0px");
      glyph.style.setProperty("--glyph-y", "0px");
      glyph.style.setProperty("--glyph-w", "1");
    });
  };

  return (
    <section id="top" ref={heroRef} className="hero" data-nav-index="0" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} />)}</div>
      <div className="hero-notes"><span>INDEPENDENT DIGITAL PRACTICE</span><span>01 — 04&nbsp;&nbsp; / &nbsp;&nbsp;SCROLL TO MOVE</span></div>
      <div className="hero-layout" onPointerMove={respondToPointer} onPointerLeave={resetGlyphs} data-cursor="view">
        <motion.h1 id="hero-title" className="hero-title" style={{ opacity: titleOpacity }}>
          <GlyphLine text="GUSTAVO" firstGRef={firstGRef} isFirst />
          <GlyphLine text="GALEAZZI" className="hero-title-line--second" secondGRef={secondGRef} />
        </motion.h1>
        <div className="hero-subgrid">
          <p className="hero-role">CREATIVE DEVELOPER<br />DIGITAL EXPERIENCES / 2026</p>
          <p className="hero-statement">Digital experiences<br />&amp; intelligent systems</p>
          <p className="hero-availability">AVAILABLE FOR<br />SELECT PROJECTS</p>
        </div>
      </div>
      <div className="hero-foot"><span>TYPE / SPACE / INTERACTION</span><motion.i className="hero-rule" style={{ scaleX: ruleScale }} /><span>SCROLL TO ENTER THE WORK&nbsp; ↓</span></div>
    </section>
  );
}

function ArtworkDrawing({ project }: { project: PortfolioProject }) {
  return (
    <>
      <rect x="0" y="0" width="1200" height="800" fill="#111111" />
      <path d="M0 114H1200M0 686H1200" stroke="#f4f3ef" strokeOpacity=".24" />
      <path d="M90 0V800M1110 0V800" stroke="#f4f3ef" strokeOpacity=".16" />
      <g fill="none" stroke="#f4f3ef" strokeOpacity=".17">
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${125 + i * 118} 115V685`} />)}
      </g>
      {project.artwork === "claudefy" && (
        <>
          <g stroke="#f4f3ef" strokeOpacity=".25">
            {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M165 ${228 + i * 48}H1035`} />)}
          </g>
          <path d="M165 492L290 420L416 455L550 320L685 376L800 260L925 314L1035 205" fill="none" stroke="#d7ff3f" strokeWidth="8" />
          <path d="M165 540H530M165 571H440M785 571H1035" stroke="#f4f3ef" strokeWidth="13" strokeOpacity=".77" />
          <circle cx="1035" cy="205" r="15" fill="#d7ff3f" />
          <text x="163" y="185" fill="#f4f3ef" fontFamily="Courier New" fontSize="19" letterSpacing="4">SESSION / LIVE WINDOW</text>
          <text x="790" y="630" fill="#f4f3ef" fontFamily="Courier New" fontSize="18" letterSpacing="4">NATIVE SIGNAL / 01</text>
        </>
      )}
      {project.artwork === "leia" && (
        <>
          <path d="M266 213V588M266 268H360M266 378H360M266 488H360" fill="none" stroke="#d7ff3f" strokeWidth="3" />
          <g fill="#f4f3ef">
            <rect x="385" y="253" width="405" height="14" /> <rect x="385" y="283" width="312" height="8" opacity=".5" />
            <rect x="385" y="363" width="512" height="14" /> <rect x="385" y="393" width="377" height="8" opacity=".5" />
            <rect x="385" y="473" width="438" height="14" /> <rect x="385" y="503" width="326" height="8" opacity=".5" />
          </g>
          <path d="M820 253H1000V291H820ZM820 363H1035V401H820ZM820 473H965V511H820Z" fill="none" stroke="#d7ff3f" strokeWidth="2" />
          <text x="166" y="650" fill="#f4f3ef" fontFamily="Courier New" fontSize="18" letterSpacing="4">SOURCE / STRUCTURE / CONTEXT</text>
        </>
      )}
      {project.artwork === "bob" && (
        <>
          <path d="M166 228H1035M166 572H1035" stroke="#d7ff3f" strokeWidth="3" />
          <text x="168" y="310" fill="#f4f3ef" fontFamily="Arial, sans-serif" fontSize="54" fontWeight="700" letterSpacing="-2">NOTES / 01</text>
          <text x="168" y="430" fill="#f4f3ef" fontFamily="Arial, sans-serif" fontSize="54" fontWeight="700" letterSpacing="-2">TEXT / 02</text>
          <text x="168" y="550" fill="#d7ff3f" fontFamily="Arial, sans-serif" fontSize="54" fontWeight="700" letterSpacing="-2">LOCAL / 03</text>
          <path d="M755 283H1015M755 403H965M755 523H1035" stroke="#f4f3ef" strokeWidth="1" strokeOpacity=".45" />
          <path d="M738 255V544" stroke="#f4f3ef" strokeOpacity=".27" />
        </>
      )}
      {project.artwork === "blitz" && (
        <>
          <g fill="none" stroke="#f4f3ef" strokeWidth="2">
            <path d="M254 400H490M710 400H946" />
            <path d="M464 382L490 400L464 418M736 382L710 400L736 418" />
            <rect x="153" y="293" width="256" height="214" />
            <rect x="471" y="293" width="256" height="214" stroke="#d7ff3f" strokeWidth="4" />
            <rect x="789" y="293" width="256" height="214" />
          </g>
          <path d="M196 343H365M196 379H332M196 415H354M514 345H684M514 381H656M514 417H673M832 345H1002M832 381H970M832 417H986" stroke="#f4f3ef" strokeWidth="8" strokeOpacity=".6" />
          <text x="177" y="565" fill="#f4f3ef" fontFamily="Courier New" fontSize="19" letterSpacing="4">DOCUMENT</text>
          <text x="529" y="565" fill="#d7ff3f" fontFamily="Courier New" fontSize="19" letterSpacing="4">READ</text>
          <text x="823" y="565" fill="#f4f3ef" fontFamily="Courier New" fontSize="19" letterSpacing="4">INFORMATION</text>
        </>
      )}
      <path d="M88 147H1112" stroke="#d7ff3f" strokeWidth="2" />
      <circle cx="88" cy="147" r="5" fill="#d7ff3f" />
      <circle cx="1112" cy="147" r="5" fill="#d7ff3f" />
    </>
  );
}

function ProjectArtwork({ project, index, progress, reduced }: {
  project: PortfolioProject;
  index: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const maskId = `project-title-mask-${project.id}`;
  const pointerStretch = useMotionValue(1);
  const hoverStretch = useSpring(pointerStretch, { stiffness: 150, damping: 24, mass: .35 });
  const respondToProjectPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || reduced) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const offset = (event.clientX - bounds.left) / Math.max(1, bounds.width) - .5;
    pointerStretch.set(1 + offset * .035);
  };
  const clip = useTransform(progress, (value) => {
    if (reduced) return "inset(0% 0% 0% 0%)";
    const t = clamp01((value - .03) / .56);
    const vertical = 47 * (1 - t);
    const horizontal = 10 * (1 - t);
    return `inset(${vertical}% ${horizontal}% ${vertical}% ${horizontal}%)`;
  });
  const fullOpacity = useTransform(progress, (value) => reduced ? .12 : clamp01((value - .08) / .37));
  const maskOpacity = useTransform(progress, (value) => reduced ? 0 : 1 - clamp01((value - .37) / .19));
  const maskScale = useTransform(progress, (value) => reduced ? .75 : 1.06 - clamp01(value / .82) * .31);
  const maskY = useTransform(progress, (value) => reduced ? 0 : clamp01(value / .82) * -92);
  const finalScale = useTransform(progress, (value) => index === projects.length - 1 && !reduced ? 1 - clamp01((value - .79) / .19) * .87 : 1);
  const titleOpacity = useTransform(progress, (value) => reduced ? 1 : clamp01((value - .40) / .17));
  const detailsOpacity = useTransform(progress, (value) => reduced ? 1 : clamp01((value - .48) / .2));
  const [detailsVisible, setDetailsVisible] = useState(reduced);
  useMotionValueEvent(progress, "change", (value) => {
    const next = reduced || value > .47;
    setDetailsVisible((current) => current === next ? current : next);
  });

  return (
      <div className="project-visual" onPointerMove={respondToProjectPointer} onPointerLeave={() => pointerStretch.set(1)} data-cursor="view">
      <motion.div className="project-artwork project-artwork-full" style={{ clipPath: clip, opacity: fullOpacity, scale: finalScale }}>
        <svg viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden="true"><ArtworkDrawing project={project} /></svg>
      </motion.div>
      <motion.div className="project-artwork project-artwork-mask" style={{ opacity: maskOpacity, scale: maskScale, scaleX: hoverStretch, y: maskY }}>
        <svg viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="800">
              <rect width="1200" height="800" fill="black" />
              <text x="600" y="475" textAnchor="middle" fill="white" fontFamily="Arial, Helvetica, sans-serif" fontSize="186" fontWeight="900" letterSpacing="-13" textLength="1030" lengthAdjust="spacingAndGlyphs">{project.name.toUpperCase()}</text>
            </mask>
          </defs>
          <g mask={`url(#${maskId})`}><ArtworkDrawing project={project} /></g>
        </svg>
      </motion.div>
      <motion.div className="project-title" style={{ opacity: titleOpacity, y: useTransform(progress, (value) => reduced ? 0 : 24 - clamp01((value - .40) / .17) * 24), zIndex: 5 }}>
        <span className="project-kicker">{project.number} / {project.category}</span>
        <span>{project.name}</span>
      </motion.div>
      <motion.div className="project-details" style={{ opacity: detailsOpacity, pointerEvents: detailsVisible ? "auto" : "none" }} aria-hidden={!detailsVisible}>
        <p>{project.description}</p>
        <span>{project.detail}</span>
        <div>
          {project.href && <a className="project-link" href={project.href} target="_blank" rel="noreferrer" tabIndex={detailsVisible ? 0 : -1} data-cursor="open">SOURCE <b>↗</b></a>}
          {project.live && <a className="project-link" href={project.live} target="_blank" rel="noreferrer" tabIndex={detailsVisible ? 0 : -1} data-cursor="open">LIVE PROJECT <b>↗</b></a>}
        </div>
      </motion.div>
    </div>
  );
}

function ProjectStage({ project, index, onCurrent }: {
  project: PortfolioProject;
  index: number;
  onCurrent: (index: number) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedPreference();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const annotationColor = useTransform(scrollYProgress, (value) => {
    if (reduced) return "#111111";
    const amount = clamp01((value - .48) / .2);
    const start = [17, 17, 17];
    const end = [244, 243, 239];
    return `rgb(${start.map((channel, i) => Math.round(channel + (end[i] - channel) * amount)).join(" ")})`;
  });
  const annotationOpacity = useTransform(scrollYProgress, (value) => index === projects.length - 1 && !reduced ? 1 - clamp01((value - .84) / .13) : 1);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (value > .06 && value < .96) onCurrent(index);
  });

  return (
    <section ref={sectionRef} id={index === 0 ? "work" : `project-${project.id}`} className="project-section" data-nav-index={index} data-last={index === projects.length - 1 ? "true" : "false"} data-reduced={reduced ? "true" : "false"} aria-labelledby={`project-heading-${project.id}`}>
      <div className="project-stage">
        <motion.div className="project-top" style={{ color: annotationColor, opacity: annotationOpacity }}><span>{project.number} — SELECTED WORK</span><span>{project.category}</span></motion.div>
        <ProjectArtwork project={project} index={index} progress={scrollYProgress} reduced={reduced} />
        <h2 className="visually-hidden" id={`project-heading-${project.id}`}>{project.name}</h2>
        <motion.div className="project-footer" style={{ color: annotationColor, opacity: annotationOpacity }}><span>GUSTAVO GALEAZZI / 2026</span><span>{project.number} / 0{projects.length}</span><span>SCROLL TO EXPAND&nbsp; ↓</span></motion.div>
      </div>
    </section>
  );
}

function About({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const reduced = useReducedPreference();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const firstLineY = useTransform(scrollYProgress, (value) => reduced ? 0 : -clamp01((value - .2) / .34) * 70);
  const firstLineOpacity = useTransform(scrollYProgress, (value) => reduced ? 1 : 1 - clamp01((value - .25) / .25) * .42);
  const ideaX = useTransform(scrollYProgress, (value) => reduced ? 0 : clamp01((value - .12) / .55) * -24);
  const moveScale = useTransform(scrollYProgress, (value) => reduced ? 1 : 1 + clamp01((value - .12) / .6) * .1);
  const moveY = useTransform(scrollYProgress, (value) => reduced ? 0 : clamp01((value - .68) / .28) * -38);
  const copyOpacity = useTransform(scrollYProgress, (value) => reduced ? 1 : clamp01((value - .28) / .26));
  const copyY = useTransform(scrollYProgress, (value) => reduced ? 0 : 22 - clamp01((value - .28) / .26) * 22);
  const [wordLayout, setWordLayout] = useState<0 | 1>(0);

  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => {
      const section = sectionRef.current;
      if (document.visibilityState !== "visible" || !section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) setWordLayout((state) => state === 0 ? 1 : 0);
    }, 3900);
    return () => window.clearInterval(timer);
  }, [reduced, sectionRef]);

  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="about" ref={sectionRef} className="about-section" data-nav-index="1" aria-labelledby="about-heading">
      <div className="about-sticky">
        <div className="about-index"><span>02 / ABOUT</span><span>SÃO PAULO, BRAZIL</span></div>
        <div className="about-main">
          <h2 id="about-heading" className="about-heading">
            <motion.span style={{ y: firstLineY, opacity: firstLineOpacity }}>I MAKE</motion.span>
            <span className="about-line-two"><motion.span style={{ x: ideaX }}>IDEAS</motion.span> <motion.span className="about-emphasis" style={{ scale: moveScale, y: moveY, transformOrigin: "left center" }}>MOVE</motion.span><i className="about-dot" /></span>
          </h2>
          <motion.div className="about-copy" style={{ opacity: copyOpacity, y: copyY }}>
            <span className="micro">A PRACTICE IN MAKING</span>
            <p>I’m Gustavo, a creative developer building thoughtful digital experiences and practical AI tools.</p>
            <p>I work across design, software and interaction — turning complex ideas into clear, useful things.</p>
          </motion.div>
        </div>
        <div className={`word-field word-field--${wordLayout === 0 ? "a" : "b"}`} aria-label="Design, development and exploration">
          <span className="word-field-label">THREE WAYS INTO AN IDEA</span>
          <span className="field-word field-word--design">DESIGN /</span>
          <span className="field-word field-word--development">DEVELOPMENT /</span>
          <span className="field-word field-word--exploration">EXPLORATION</span>
        </div>
        <div className="about-footer"><span>FORM MEETS FUNCTION</span><div className="about-progress"><motion.i style={{ scaleX: progressScale }} /></div><span>02 / 04</span></div>
      </div>
    </section>
  );
}

type PullStyle = CSSProperties & {
  "--pull-x"?: string; "--pull-y"?: string; "--stretch"?: string;
  "--grid-x"?: string; "--grid-y"?: string; "--mark-x"?: string; "--mark-y"?: string;
  "--first-x"?: string; "--first-y"?: string; "--second-x"?: string; "--second-y"?: string; "--skew"?: string; "--reverse-skew"?: string;
  "--column-left"?: string; "--column-right"?: string;
};

function Playground() {
  const [pull, setPull] = useState({ x: 0, y: 0, active: false, turn: 0 });
  const fieldRef = useRef<HTMLDivElement>(null);

  const updatePull = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" && event.buttons === 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width - .5) * 2;
    const ny = ((event.clientY - rect.top) / rect.height - .5) * 2;
    setPull((value) => ({ ...value, x: Math.max(-1, Math.min(1, nx)) * 100, y: Math.max(-1, Math.min(1, ny)) * 75, active: true }));
  };
  const reset = () => setPull((value) => ({ ...value, x: 0, y: 0, active: false }));
  const recompose = () => setPull((value) => ({ ...value, x: value.turn % 2 === 0 ? 66 : -66, y: value.turn % 2 === 0 ? -42 : 42, active: true, turn: value.turn + 1 }));
  const resetButton = () => { setPull((value) => ({ x: 0, y: 0, active: false, turn: value.turn })); fieldRef.current?.focus(); };
  const style: PullStyle = {
    "--pull-x": `${pull.x}px`, "--pull-y": `${pull.y}px`, "--stretch": pull.active ? "1.08" : "1",
    "--grid-x": `${pull.x * -.12}px`, "--grid-y": `${pull.y * -.12}px`,
    "--mark-x": `${pull.x * .2}px`, "--mark-y": `${pull.y * .2}px`,
    "--first-x": `${pull.x * -.1}px`, "--first-y": `${pull.y * .08}px`,
    "--second-x": `${pull.x * .1}px`, "--second-y": `${pull.y * -.08}px`,
    "--skew": `${pull.x * -.008}deg`, "--reverse-skew": `${pull.x * .008}deg`,
    "--column-left": `${pull.x * -.06}px`, "--column-right": `${pull.x * .06}px`,
  };

  return (
    <section id="playground" className="playground" data-nav-index="2" aria-labelledby="playground-title">
      <div className="playground-head micro"><span>03 / PLAYGROUND</span><span>TYPE / LINE / RESPONSE</span></div>
      <div className="playground-layout">
        <div className="playground-copy">
          <span className="micro">A SMALL STUDY IN FLEXIBILITY</span>
          <h2 id="playground-title"><span>PLAYGROUND</span><span>/ 001</span></h2>
          <p>Move through the structure. The grid gives way, the letters answer, then settle back into place.</p>
          <span className="play-note">DRAG OR MOVE ACROSS THE MARK</span>
          <button className="play-reset" type="button" onClick={pull.active ? resetButton : recompose} data-cursor="open">{pull.active ? "RESET FORM" : "RECOMPOSE"} <b>{pull.active ? "↺" : "↗"}</b></button>
        </div>
        <div ref={fieldRef} className={`playfield${pull.active ? " is-active" : ""}`} style={style} role="group" tabIndex={0} aria-label="Interactive GG monogram. Drag across it or use the arrow keys to reshape it." data-cursor="drag"
          onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); updatePull(event); }}
          onPointerMove={updatePull}
          onPointerUp={reset}
          onPointerCancel={reset}
          onPointerLeave={reset}
          onKeyDown={(event) => {
            const step = 22;
            if (event.key === "ArrowLeft") setPull((value) => ({ ...value, x: value.x - step, active: true }));
            else if (event.key === "ArrowRight") setPull((value) => ({ ...value, x: value.x + step, active: true }));
            else if (event.key === "ArrowUp") setPull((value) => ({ ...value, y: value.y - step, active: true }));
            else if (event.key === "ArrowDown") setPull((value) => ({ ...value, y: value.y + step, active: true }));
            else if (event.key === "Escape") reset();
          }}>
          <span className="playfield-coordinate">GG / 001<br />STRUCTURE STUDY</span>
          <div className="playfield-grid" aria-hidden="true">{Array.from({ length: 5 }, (_, i) => <i key={i} />)}</div>
          <div className="playfield-mark" aria-hidden="true"><span>G</span><span>G</span><b /></div>
          <span className="playfield-coordinate">MOVE / RECOMPOSE<br />RETURN / REST</span>
        </div>
      </div>
      <div className="play-footer"><span>ONE MARK / MANY ARRANGEMENTS</span><span>NO FIXED VIEWPOINT</span><span>03 / 04</span></div>
    </section>
  );
}

function Contact({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const reduced = useReducedPreference();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const textOpacity = useTransform(scrollYProgress, (value) => reduced ? 1 : 1 - clamp01((value - .68) / .25));
  const textScale = useTransform(scrollYProgress, (value) => reduced ? 1 : 1 - clamp01((value - .68) / .25) * .22);
  const logoOpacity = useTransform(scrollYProgress, (value) => reduced ? 1 : clamp01((value - .74) / .22));
  const footerOpacity = useTransform(scrollYProgress, (value) => reduced ? 1 : 1 - clamp01((value - .81) / .18));
  const metaOpacity = useTransform(scrollYProgress, (value) => reduced ? 1 : 1 - clamp01((value - .82) / .16));
  const oldOpacity = useTransform(scrollYProgress, (value) => reduced ? 0 : 1 - clamp01(value / .14));
  const oldY = useTransform(scrollYProgress, (value) => reduced ? -20 : -clamp01(value / .14) * 112);
  const newOpacity = useTransform(scrollYProgress, (value) => reduced ? 1 : clamp01(value / .12));
  const newY = useTransform(scrollYProgress, (value) => reduced ? 0 : 70 - clamp01(value / .12) * 70);

  const reactToPointer = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch" || reduced) return;
    const glyphs = event.currentTarget.querySelectorAll<HTMLElement>("[data-contact-glyph]");
    glyphs.forEach((glyph) => {
      const rect = glyph.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const force = Math.max(0, 1 - Math.hypot(dx, dy) / 210);
      glyph.style.setProperty("--contact-x", `${Math.max(-5, Math.min(5, dx * .02 * force))}px`);
      glyph.style.setProperty("--contact-y", `${Math.max(-3, Math.min(3, dy * .015 * force))}px`);
      glyph.style.setProperty("--contact-w", `${1 + force * .045}`);
    });
  };
  const releasePointer = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.querySelectorAll<HTMLElement>("[data-contact-glyph]").forEach((glyph) => {
      glyph.style.setProperty("--contact-x", "0px");
      glyph.style.setProperty("--contact-y", "0px");
      glyph.style.setProperty("--contact-w", "1");
    });
  };

  return (
    <section id="contact" ref={sectionRef} className="contact-section" data-nav-index="3" aria-labelledby="contact-heading">
      <div className="contact-sticky">
        <motion.div className="contact-meta" style={{ opacity: metaOpacity }}><span>04 / CONTACT</span><span>THE LAST FRAME IS A BEGINNING</span></motion.div>
        <motion.div className="contact-content" style={{ opacity: textOpacity, scale: textScale }} onPointerMove={reactToPointer} onPointerLeave={releasePointer}>
          <p className="contact-kicker"><i /> OPEN TO SELECT PROJECTS / 2026</p>
          <h2 id="contact-heading" className="contact-headline" aria-label="Let’s create something.">
            <motion.span className="contact-morph" aria-hidden="true">
              <motion.span className="contact-word-old" style={{ opacity: oldOpacity, y: oldY }}>{Array.from("MOVE", (letter, index) => <span data-contact-glyph key={`${letter}-${index}`}>{letter}</span>)}</motion.span>
              <motion.span className="contact-word-new" style={{ opacity: newOpacity, y: newY }}>{Array.from("LET’S", (letter, index) => <span data-contact-glyph key={`${letter}-${index}`}>{letter}</span>)}</motion.span>
            </motion.span>
            <span>{Array.from("CREATE", (letter, index) => <span data-contact-glyph key={`${letter}-${index}`}>{letter}</span>)}</span>
            <span>{Array.from("SOMETHING", (letter, index) => <span data-contact-glyph key={`${letter}-${index}`}>{letter}</span>)}<span className="contact-period" data-contact-glyph>.</span></span>
          </h2>
          <div className="contact-actions">
            <a className="contact-email" href="mailto:gustavosgaleazzi@gmail.com" data-cursor="open"><span>HAVE AN IDEA?</span>gustavosgaleazzi@gmail.com</a>
            <nav className="contact-socials" aria-label="Social links">
              <a href="https://github.com/gusata" target="_blank" rel="noreferrer" data-cursor="open">GITHUB ↗</a>
              <a href="https://www.linkedin.com/in/gustavo-sanches-galeazzi-058346258/" target="_blank" rel="noreferrer" data-cursor="open">LINKEDIN ↗</a>
            </nav>
          </div>
        </motion.div>
        <motion.div className="contact-monogram" style={{ opacity: logoOpacity, scale: useTransform(logoOpacity, [0, 1], [.72, 1]) }} aria-hidden="true"><span>G</span><span>G</span><i /></motion.div>
        <motion.footer className="contact-footer" style={{ opacity: footerOpacity }}><span>GUSTAVO GALEAZZI / SÃO PAULO, BR</span><span>FORM / FUNCTION / FEELING</span><a href="#top" data-cursor="open">BACK TO THE FIRST FRAME ↑</a></motion.footer>
      </div>
    </section>
  );
}

function HeroFlight({ geometry, progress }: { geometry: FlightGeometry | null; progress: MotionValue<number> }) {
  const smooth = useSpring(progress, { stiffness: 125, damping: 31, mass: .65 });
  return <><FlightLetter index={0} geometry={geometry} progress={smooth} /><FlightLetter index={1} geometry={geometry} progress={smooth} /></>;
}

function FlightLetter({ index, geometry, progress }: { index: 0 | 1; geometry: FlightGeometry | null; progress: MotionValue<number> }) {
  const source = geometry?.source[index] ?? { x: 0, y: 0, size: 16 };
  const target = geometry?.target[index] ?? { x: 0, y: 0, size: 16 };
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const x = useTransform(progress, [0, .05, .28, .58, .82, 1], [0, 0, dx * .22, dx * .74, dx, dx]);
  const y = useTransform(progress, [0, .05, .28, .58, .82, 1], [0, 0, dy * .18 + (index === 0 ? -35 : 24), dy * .58 + (index === 0 ? 20 : -18), dy, dy]);
  const size = useTransform(progress, [0, .05, .28, .58, .82, 1], [source.size, source.size, source.size * .76, source.size * .4, target.size, target.size]);
  const opacity = useTransform(progress, [0, .015, .07, .68, .84, .92, 1], [0, 0, 1, 1, 1, .15, 0]);
  return <motion.span className={`hero-flight hero-flight--${index === 0 ? "first" : "second"}`} style={{ left: source.x, top: source.y, x, y, fontSize: size, opacity }}>G</motion.span>;
}

export function LivingGridPortfolio() {
  const reduced = useReducedPreference();
  const heroRef = useRef<HTMLElement>(null);
  const firstGRef = useRef<HTMLSpanElement>(null);
  const secondGRef = useRef<HTMLSpanElement>(null);
  const markRef = useRef<HTMLAnchorElement>(null);
  const markFirstRef = useRef<HTMLSpanElement>(null);
  const markSecondRef = useRef<HTMLSpanElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const { scrollYProgress: contactProgress } = useScroll({ target: contactRef, offset: ["start start", "end end"] });
  const ruleScale = useTransform(heroProgress, [0, .6, 1], [1, .88, .2]);
  const markOpacity = useTransform(heroProgress, (value) => reduced ? 1 : clamp01((value - .68) / .24));
  const navOpacity = useTransform(contactProgress, (value) => reduced ? 1 : 1 - clamp01((value - .89) / .1));
  const introActive = useSyncExternalStore(subscribeToIntro, introSnapshot, () => false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [navHiddenAtEnd, setNavHiddenAtEnd] = useState(false);
  const [flight, setFlight] = useState<FlightGeometry | null>(null);

  useMotionValueEvent(contactProgress, "change", (value) => {
    const hidden = !reduced && value > .96;
    setNavHiddenAtEnd((current) => current === hidden ? current : hidden);
  });

  const measureFlight = useCallback(() => {
    const sourceOne = firstGRef.current?.getBoundingClientRect();
    const sourceTwo = secondGRef.current?.getBoundingClientRect();
    const targetOne = markFirstRef.current?.getBoundingClientRect();
    const targetTwo = markSecondRef.current?.getBoundingClientRect();
    if (!sourceOne || !sourceTwo || !targetOne || !targetTwo) return;
    const sizeOf = (element: Element) => Number.parseFloat(window.getComputedStyle(element).fontSize) || 16;
    setFlight({
      source: [
        { x: sourceOne.left, y: sourceOne.top, size: sizeOf(firstGRef.current!) },
        { x: sourceTwo.left, y: sourceTwo.top, size: sizeOf(secondGRef.current!) },
      ],
      target: [
        { x: targetOne.left, y: targetOne.top, size: sizeOf(markFirstRef.current!) },
        { x: targetTwo.left, y: targetTwo.top, size: sizeOf(markSecondRef.current!) },
      ],
    });
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(measureFlight);
    const onResize = () => window.requestAnimationFrame(measureFlight);
    window.addEventListener("resize", onResize);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("resize", onResize); };
  }, [measureFlight]);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-nav-index]");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const index = Number(entry.target.getAttribute("data-nav-index"));
        if (Number.isFinite(index)) setActiveIndex(index);
      }
    }, { threshold: 0, rootMargin: "-48% 0px -48% 0px" });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuMounted) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [menuMounted]);

  return (
    <main className="portfolio">
      <Navigation
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        menuMounted={menuMounted}
        setMenuMounted={setMenuMounted}
        activeIndex={activeIndex}
        markRef={markRef}
        markFirstRef={markFirstRef}
        markSecondRef={markSecondRef}
        markOpacity={markOpacity}
        navOpacity={navOpacity}
        navHiddenAtEnd={navHiddenAtEnd}
      />
      {!reduced && <HeroFlight geometry={flight} progress={heroProgress} />}
      <Hero heroRef={heroRef} firstGRef={firstGRef} secondGRef={secondGRef} progress={heroProgress} ruleScale={ruleScale} reduced={reduced} />
      <div className="work" aria-label="Selected work">
        {projects.map((project, index) => <ProjectStage key={project.id} project={project} index={index} onCurrent={setActiveIndex} />)}
      </div>
      <About sectionRef={aboutRef} />
      <Playground />
      <Contact sectionRef={contactRef} />
      <Cursor />
      {introActive && <IntroSequence />}
    </main>
  );
}
