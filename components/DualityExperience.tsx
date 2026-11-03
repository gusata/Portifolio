"use client";

import Image from "next/image";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useScroll,
  useTransform,
  type MotionStyle,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

type World = "selector" | "developer" | "photographer";
type Category = "PORTRAITS" | "STREET" | "LIFESTYLE" | "MOMENTS";
type Project = {
  id: string;
  number: string;
  name: string;
  category: string;
  summary: string;
  visual: "claudefy" | "leia" | "bob" | "formazzi" | "quiet" | "blitz";
  source?: string;
  live?: string;
};
type PhotoSlot = { id: number; number: string; category: Category; ratio: "wide" | "portrait" | "square" };
type Curtain = { target: World; phase: "cover" | "reveal"; x: number; y: number };

const categories: Category[] = ["PORTRAITS", "STREET", "LIFESTYLE", "MOMENTS"];
const projects: Project[] = [
  { id: "claudefy", number: "01", name: "CLAUDEFY", category: "AI TOOLING / WINDOWS", summary: "A native Windows utility that surfaces Claude Code token usage, session limits and plan progress through system notifications.", visual: "claudefy", source: "https://github.com/gusata/ClaudeFy" },
  { id: "leia", number: "02", name: "LEIA", category: "AI / CODE DOCUMENTATION", summary: "An AI documentation engine that reads a codebase and translates its structure into clear project documentation.", visual: "leia", source: "https://github.com/gusata/LEIA" },
  { id: "bob", number: "03", name: "BOB", category: "PRODUCT / BROWSER START PAGE", summary: "A quiet browser start page for local notes and text shortcuts. Personal data stays on the device.", visual: "bob", source: "https://github.com/gusata/Bob", live: "https://bob-webpage.vercel.app/" },
  { id: "formazzi", number: "04", name: "FORMAZZI", category: "FULL STACK / LEARNING", summary: "A corporate training platform for courses, certifications, assessments and employee progress.", visual: "formazzi", source: "https://github.com/gusata/Front_Formazzi" },
  { id: "quiet-head", number: "05", name: "QUIET HEAD", category: "PRODUCT / AUTOMOTIVE COMMUNITY", summary: "A social space for people who share a love of cars.", visual: "quiet", source: "https://github.com/gusata/Quiet-Head", live: "https://quiet-head.vercel.app/" },
  { id: "blitz", number: "06", name: "BLITZ", category: "PRODUCT / DOCUMENT OCR", summary: "An AI-assisted OCR workflow that reads documents and sends extracted information into a system.", visual: "blitz" },
];

const photoSlots: PhotoSlot[] = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  number: String(i + 1).padStart(2, "0"),
  category: categories[Math.floor(i / 4)],
  ratio: i % 4 === 1 ? "portrait" : i % 4 === 3 ? "square" : "wide",
}));

const cubic = [0.76, 0, 0.24, 1] as const;
const bodyScrollLocks = new Set<symbol>();
let overflowBeforeLock: string | null = null;

function respondToHeadline(event: ReactPointerEvent<HTMLElement>, reduced: boolean) {
  if (reduced || event.pointerType === "touch") return;
  const rect = event.currentTarget.getBoundingClientRect();
  const position = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  const tension = 1 + (1 - Math.abs(position - 0.5) * 2) * 0.026;
  event.currentTarget.style.setProperty("--contact-stretch", tension.toFixed(3));
  event.currentTarget.style.setProperty("--contact-shift", `${(position - 0.5) * 8}px`);
}

function resetHeadline(event: ReactPointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--contact-stretch", "1");
  event.currentTarget.style.setProperty("--contact-shift", "0px");
}

function acquireBodyScrollLock() {
  const token = Symbol("body-scroll-lock");
  if (bodyScrollLocks.size === 0) overflowBeforeLock = document.body.style.overflow;
  bodyScrollLocks.add(token);
  document.body.style.overflow = "hidden";
  return () => {
    if (!bodyScrollLocks.delete(token) || bodyScrollLocks.size > 0) return;
    document.body.style.overflow = overflowBeforeLock ?? "";
    overflowBeforeLock = null;
  };
}

function IntroSequence({ onFinish }: { onFinish: () => void }) {
  const [closing, setClosing] = useState(false);
  const completed = useRef(false);
  const finish = useCallback(() => {
    if (completed.current) return;
    completed.current = true;
    setClosing(true);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(finish, 2600);
    return () => window.clearTimeout(timer);
  }, [finish]);

  const nameLine = (line: string, offset: number) => (
    <span className="intro-line" key={line}>
      {Array.from(line, (letter, i) => (
        <motion.span
          aria-hidden="true"
          key={`${letter}-${i}`}
          initial={{ y: "115%", x: i % 2 ? 12 : -12, rotate: i % 2 ? 5 : -5 }}
          animate={{ y: "0%", x: 0, rotate: 0 }}
          transition={{ duration: 0.62, delay: offset + i * 0.035, ease: cubic }}
        >{letter}</motion.span>
      ))}
    </span>
  );

  return (
    <motion.div
      className="opening-film"
      initial={{ clipPath: "inset(0 0 0 0)" }}
      animate={{ clipPath: closing ? "inset(0 0 100% 0)" : "inset(0 0 0 0)" }}
      transition={{ duration: closing ? 0.62 : 0.01, ease: cubic }}
      onAnimationComplete={() => { if (closing) onFinish(); }}
      aria-label="Gustavo Galeazzi. Two ways of seeing the world."
    >
      <motion.div className="opening-field opening-field--blue" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, delay: 0.45, ease: cubic }} />
      <motion.div className="opening-field opening-field--copper" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, delay: 0.58, ease: cubic }} />
      <motion.span className="opening-g" initial={{ scaleX: 0.18, scaleY: 0.82, x: "-50%", y: "-50%", opacity: 0 }} animate={{ scaleX: [0.18, 1, 2.35, 0.9], scaleY: [0.82, 1, 1, 0.8], x: ["-50%", "-50%", "-50%", "-58%"], y: "-50%", opacity: [0, 1, 1, 0] }} transition={{ duration: 1.45, times: [0, 0.18, 0.58, 1], ease: cubic }}>G</motion.span>
      <motion.i className="opening-line opening-line--one" initial={{ scaleX: 0 }} animate={{ scaleX: [0, 1, 1, 0] }} transition={{ duration: 2.25, times: [0, 0.25, 0.7, 1], ease: cubic }} />
      <motion.i className="opening-line opening-line--two" initial={{ scaleX: 0 }} animate={{ scaleX: [0, 0, 1, 0] }} transition={{ duration: 2.25, times: [0, 0.34, 0.72, 1], ease: cubic }} />
      <div className="opening-copy">
        <span className="opening-overline">GUSTAVO GALEAZZI / 2026</span>
        <h1>{nameLine("GUSTAVO", 0.74)}{nameLine("GALEAZZI", 0.88)}</h1>
        <motion.p initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0 0 0)" }} transition={{ duration: 0.6, delay: 1.74, ease: cubic }}>TWO WAYS OF SEEING THE WORLD.</motion.p>
      </div>
      <div className="opening-signature" aria-hidden="true"><span>01 / CREATE</span><span>02 / OBSERVE</span></div>
      <button className="opening-skip" type="button" onClick={finish}>SKIP INTRO <span aria-hidden="true">↗</span></button>
    </motion.div>
  );
}

function WorldSelector({ onEnter, reduced }: { onEnter: (world: Exclude<World, "selector">, x: number, y: number) => void; reduced: boolean }) {
  const splitTarget = useMotionValue(0.5);
  const split = useSpring(splitTarget, { stiffness: reduced ? 1000 : 145, damping: reduced ? 100 : 26, mass: reduced ? 0.1 : 0.72 });
  const [active, setActive] = useState<"developer" | "photographer" | null>(null);
  const [vertical, setVertical] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 720px)");
    const update = () => setVertical(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const developerClip = useTransform(split, (p) => vertical
    ? `polygon(0 0, 100% 0, 100% ${p * 100 - 1}%, 0 ${p * 100 + 1}%)`
    : `polygon(0 0, ${p * 100 - 0.5}% 0, ${p * 100 + 0.5}% 100%, 0 100%)`);
  const photographerClip = useTransform(split, (p) => vertical
    ? `polygon(0 ${p * 100 - 1}%, 100% ${p * 100 + 1}%, 100% 100%, 0 100%)`
    : `polygon(${p * 100 - 0.5}% 0, 100% 0, 100% 100%, ${p * 100 + 0.5}% 100%)`);
  const divider = useTransform(split, (p) => vertical ? `translateY(${(p - 0.5) * 100}vh)` : `translateX(${(p - 0.5) * 100}vw)`);

  const focus = (world: "developer" | "photographer") => {
    setActive(world);
    splitTarget.set(world === "developer" ? 0.62 : 0.38);
  };
  const release = () => {
    setActive(null);
    splitTarget.set(0.5);
  };
  const activate = (world: "developer" | "photographer") => onEnter(world, world === "developer" ? 25 : 75, 52);

  return (
    <main className="identity-selector" data-active={active ?? "none"} data-vertical={vertical} onPointerMove={(event) => {
      if (reduced || event.pointerType === "touch") return;
      const bounds = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      event.currentTarget.style.setProperty("--selector-x", `${(x - .5) * 24}px`);
      event.currentTarget.style.setProperty("--selector-y", `${(y - .5) * 18}px`);
      splitTarget.set(vertical ? .5 : .5 + (.5 - x) * .28);
    }} onPointerLeave={() => { release(); }}>
      <h1 className="sr-only">Gustavo Galeazzi — Developer and Photographer</h1>
      <div className="selector-base" />
      <motion.button className="selector-territory selector-territory--developer" style={{ clipPath: developerClip, backgroundColor: active === "developer" ? "#4169E1" : "#17213B" }} onPointerEnter={() => focus("developer")} onPointerLeave={release} onFocus={() => focus("developer")} onBlur={release} onClick={() => activate("developer")} aria-label="Enter world 01, Developer">
        <span className="territory-index">01 <i /> BUILD / MAKE / SOLVE</span>
        <div className="developer-selector-art" aria-hidden="true"><span>01</span><i /><i /><i /><b>LOGIC<br />IN MOTION</b></div>
        <span className="territory-title">DEVELOPER</span>
        <span className="territory-enter">ENTER WORLD <b aria-hidden="true">↗</b></span>
      </motion.button>
      <motion.button className="selector-territory selector-territory--photographer" style={{ clipPath: photographerClip, backgroundColor: active === "photographer" ? "#D66744" : "#1B1F2A" }} onPointerEnter={() => focus("photographer")} onPointerLeave={release} onFocus={() => focus("photographer")} onBlur={release} onClick={() => activate("photographer")} aria-label="Enter world 02, Photographer">
        <span className="territory-index">02 <i /> LIGHT / FRAME / FEEL</span>
        <div className="selector-photo-field" aria-hidden="true"><span>02 / THE ART OF OBSERVING</span><i /><b>Light.<br />Space.<br />Feeling.</b><small>ORIGINAL COLLECTION / AWAITING PHOTOGRAPHS</small></div>
        <span className="territory-title territory-title--serif">PHOTOGRAPHER</span>
        <span className="territory-enter">ENTER WORLD <b aria-hidden="true">↗</b></span>
      </motion.button>
      <motion.div className="selector-divider" style={{ transform: divider }} aria-hidden="true"><i /></motion.div>
      <div className="selector-heading"><span>GG / GUSTAVO GALEAZZI</span><span>CHOOSE A WORLD <i aria-hidden="true">↓</i></span></div>
      <motion.div className="selector-seal" animate={{ scale: reduced ? 1 : active ? 1.04 : 1, y: reduced ? 0 : active ? -6 : 0 }} transition={{ duration: reduced ? 0.01 : 0.55, ease: cubic }} aria-hidden="true">
        <span className="seal-monogram">DUALITY</span><span>TWO WORLDS. ONE CREATIVE MIND.</span>
      </motion.div>
      <div className="selector-footer"><span>AN EXPLORATION IN TWO DISCIPLINES</span><span>MOVE TO EXPLORE / SELECT TO ENTER</span><span>01 — 02</span></div>
    </main>
  );
}

function WorldNavigation({ world, onReturn, onSwitch, links, reduced }: { world: "developer" | "photographer"; onReturn: () => void; onSwitch: () => void; links: { label: string; href: string }[]; reduced: boolean }) {
  const photo = world === "photographer";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const releaseMenuScroll = useRef<(() => void) | null>(null);
  const registerMenuScroll = useCallback((release: (() => void) | null) => { releaseMenuScroll.current = release; }, []);
  const closeMenu = useCallback((restoreFocus = true) => {
    setMenuOpen(false);
    if (restoreFocus) window.requestAnimationFrame(() => toggleRef.current?.focus());
  }, []);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 721px)");
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const focusFrame = window.requestAnimationFrame(() => menuRef.current?.querySelector<HTMLElement>("a")?.focus());
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); closeMenu(); return; }
      if (event.key !== "Tab") return;
      const focusable = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)') ?? []).filter((item) => item.getClientRects().length > 0);
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable[focusable.length - 1].focus(); }
      else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) { event.preventDefault(); focusable[0].focus(); }
    };
    window.addEventListener("keydown", key);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", key);
    };
  }, [menuOpen, closeMenu]);
  return (
    <header className={`world-nav ${photo ? "world-nav--photo" : "world-nav--dev"}`}>
      <button className="world-mark" onClick={onReturn} aria-label="Return to world selection"><span>GG</span><i> / </i>WORLD SELECT</button>
      <nav className="world-nav-links" aria-label={`${photo ? "Photographer" : "Developer"} sections`}>
        {links.map((link, i) => <a href={link.href} key={link.href}><span>{String(i + 1).padStart(2, "0")}</span>{link.label}</a>)}
      </nav>
      <button ref={toggleRef} className="world-menu-toggle" onClick={() => menuOpen ? closeMenu() : setMenuOpen(true)} aria-expanded={menuOpen} aria-controls={menuOpen ? "world-mobile-menu" : undefined} aria-label={menuOpen ? "Close section menu" : "Open section menu"}><span>{menuOpen ? "CLOSE" : "MENU"}</span><i aria-hidden="true">{menuOpen ? "×" : "+"}</i></button>
      <button className="world-switch" onClick={onSwitch}><span>SWITCH TO</span><b>{photo ? "DEVELOPER" : "PHOTOGRAPHER"}</b><i aria-hidden="true">↗</i></button>
      <AnimatePresence>
        {menuOpen && <motion.div ref={menuRef} id="world-mobile-menu" className={`mobile-world-menu ${photo ? "mobile-world-menu--photo" : "mobile-world-menu--dev"}`} role="dialog" aria-modal="true" aria-label={`${photo ? "Photographer" : "Developer"} section menu`} initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0)" }} exit={reduced ? { opacity: 0 } : { clipPath: "inset(100% 0 0 0)" }} transition={{ duration: reduced ? 0.01 : 0.5, ease: cubic }}>
          <MenuExitScrollLock register={registerMenuScroll} />
          <div className="mobile-menu-top"><span>{photo ? "02 / PHOTOGRAPHER" : "01 / DEVELOPER"}</span><button onClick={() => closeMenu()}>CLOSE <b aria-hidden="true">×</b></button></div>
          <nav aria-label="Sections">
            {links.map((link, i) => <motion.a key={link.href} href={link.href} onClick={() => { releaseMenuScroll.current?.(); releaseMenuScroll.current = null; closeMenu(false); }} initial={reduced ? false : { clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0)" }} transition={{ duration: reduced ? 0.01 : 0.46, delay: reduced ? 0 : 0.08 + i * 0.055, ease: cubic }}><span>{String(i + 1).padStart(2, "0")} —</span><b>{link.label}</b><i aria-hidden="true">↗</i></motion.a>)}
          </nav>
          <div className="mobile-menu-bottom"><span>GUSTAVO GALEAZZI / TWO WORLDS</span><button onClick={() => { closeMenu(false); onSwitch(); }}>SWITCH WORLD <b>{photo ? "DEVELOPER" : "PHOTOGRAPHER"} ↗</b></button></div>
        </motion.div>}
      </AnimatePresence>
    </header>
  );
}

function MenuExitScrollLock({ register }: { register: (release: (() => void) | null) => void }) {
  useEffect(() => {
    const release = acquireBodyScrollLock();
    register(release);
    return () => { release(); register(null); };
  }, [register]);
  return null;
}

function ProjectArtwork({ project }: { project: Project }) {
  if (project.visual === "bob" || project.visual === "quiet" || project.visual === "blitz") {
    const src = project.visual === "bob" ? "/work/bob.png" : project.visual === "quiet" ? "/quiet.png" : "/blitz3.jpeg";
    return <Image src={src} alt={`${project.name} project image`} fill sizes="(max-width: 720px) 100vw, 58vw" className={`project-image project-image--${project.visual}`} />;
  }
  return (
    <div className={`project-study project-study--${project.visual}`} aria-label={`Conceptual visual study for ${project.name}; not a product screenshot`}>
      <span className="study-label">VISUAL STUDY / NOT A SCREENSHOT</span>
      {project.visual === "claudefy" && <div className="study-claude"><span>CLAUDE CODE / ACTIVITY</span><i /><b>SESSION</b><strong>WINDOW</strong><small>USAGE · LIMITS · PLAN</small><div><i /><i /><i /></div></div>}
      {project.visual === "leia" && <div className="study-leia"><div><small>01 / SOURCE</small><b>function<br />read(source)<br />map(context)</b><i /></div><span>→</span><div><small>02 / EXPLANATION</small><b>STRUCTURE<br />BECOMES<br />LANGUAGE.</b><i /></div></div>}
      {project.visual === "formazzi" && <div className="study-formazzi"><small>LEARNING / IN SEQUENCE</small><b>COURSE</b><i /><b>ASSESSMENT</b><i /><b>CERTIFICATION</b></div>}
    </div>
  );
}

function ProjectScene({ project, index, onOpen, reduced }: { project: Project; index: number; onOpen: (project: Project) => void; reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // The section is viewport-height, so its useful on-screen pass sits around
  // the middle of this start/end progress range. Keep the reveals there;
  // animating at 0.0–0.16 made them finish while the project was still offscreen.
  const mediaClip = useTransform(scrollYProgress, [0.08, 0.32, 0.62, 0.84], ["inset(36% 0 36% 0)", "inset(0)", "inset(0)", "inset(30% 0 30% 0)"]);
  const headingClip = useTransform(scrollYProgress, [0.08, 0.31, 0.62, 0.83], ["inset(0 100% 0 0)", "inset(0)", "inset(0)", "inset(0 0 0 100%)"]);
  const headingY = useTransform(scrollYProgress, [0.12, 0.38, 0.64, 0.88], [24, 0, 0, -22]);
  const artworkScale = useTransform(scrollYProgress, [0.1, 0.43, 0.7, 0.91], [1.16, 1, 1.07, 1.12]);
  const artworkY = useTransform(scrollYProgress, [0.1, 0.46, 0.88], [28, 0, -26]);
  const move = (event: ReactPointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType === "touch") return;
    const r = event.currentTarget.getBoundingClientRect();
    setPointer({ x: ((event.clientX - r.left) / r.width - 0.5) * 2, y: ((event.clientY - r.top) / r.height - 0.5) * 2 });
  };
  const visualStyle = { "--pointer-x": `${pointer.x * 4}px`, "--pointer-y": `${pointer.y * 3}px` } as CSSProperties;
  return (
    <section ref={ref} className={`project-scene project-scene--${index % 2 ? "reverse" : "forward"}`} id={`project-${project.id}`} data-project={project.id} onPointerMove={move} onPointerLeave={() => setPointer({ x: 0, y: 0 })}>
      <div className="project-rail"><span>{project.number} / 06</span><span>{project.category}</span></div>
      <div className="project-layout">
        <div className="project-story">
          <span className="project-index">{project.number}</span>
          <motion.h2 style={{ clipPath: reduced ? "inset(0)" : headingClip, y: reduced ? 0 : headingY }}>{project.name}</motion.h2>
          <p>{project.summary}</p>
          <button className="text-action" onClick={() => onOpen(project)}>OPEN PROJECT <i aria-hidden="true">↗</i></button>
        </div>
        <motion.div className="project-media-frame" style={{ ...visualStyle, clipPath: reduced ? "inset(0)" : mediaClip }} layoutId={`project-media-${project.id}`}>
          <button className="project-media-button" onClick={() => onOpen(project)} aria-label={`Open ${project.name} project details`}>
            <motion.div className="project-art-motion" style={{ scale: reduced ? 1 : artworkScale, y: reduced ? 0 : artworkY }}><ProjectArtwork project={project} /></motion.div>
          </button>
          <span className="project-media-number">{project.number}</span>
        </motion.div>
      </div>
      <div className="project-bottom-rule"><span>{project.name} / SELECTED WORK</span><span>SCROLL TO CONTINUE ↓</span></div>
    </section>
  );
}

function ProjectDetail({ project, onClose, onNext, reduced }: { project: Project; onClose: () => void; onNext: () => void; reduced: boolean }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => acquireBodyScrollLock(), []);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])')).filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);
  return (
    <motion.div ref={dialogRef} className="project-detail" initial={reduced ? false : { clipPath: "inset(0 0 0 100%)" }} animate={{ clipPath: "inset(0 0 0 0)" }} exit={reduced ? { opacity: 1 } : { clipPath: "inset(0 100% 0 0)" }} transition={{ duration: reduced ? 0.01 : 0.72, ease: cubic }} role="dialog" aria-modal="true" aria-label={`${project.name} project`}>
      <div className="detail-nav"><span>PROJECT / {project.number} — {project.category}</span><button onClick={onClose} autoFocus>CLOSE <b aria-hidden="true">×</b></button></div>
      <div className="detail-hero">
        <motion.div className="detail-media" layoutId={`project-media-${project.id}`}><ProjectArtwork project={project} /></motion.div>
        <h2>{project.name}</h2>
      </div>
      <div className="detail-copy"><span>{project.number} / DIGITAL PRACTICE</span><p>{project.summary}</p><div className="detail-links">{project.source && <a href={project.source} target="_blank" rel="noreferrer">VIEW SOURCE <b aria-hidden="true">↗</b></a>}{project.live && <a href={project.live} target="_blank" rel="noreferrer">VISIT LIVE PROJECT <b aria-hidden="true">↗</b></a>}</div><button className="detail-next" onClick={onNext}>NEXT PROJECT <b aria-hidden="true">↓</b></button></div>
    </motion.div>
  );
}

function DeveloperWorld({ onReturn, onSwitch, reduced }: { onReturn: () => void; onSwitch: () => void; reduced: boolean }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const { scrollYProgress: aboutProgress } = useScroll({ target: aboutRef, offset: ["start end", "end start"] });
  const aboutDrift = useTransform(aboutProgress, [0, 0.5, 1], [-46, 0, 38]);
  const aboutWordScale = useTransform(aboutProgress, [0, 0.5, 1], [0.86, 1, 1.08]);
  const restoreProjectFocus = useRef(false);
  const detailOpen = selected !== null;
  useEffect(() => {
    if (!detailOpen) return;
    return acquireBodyScrollLock();
  }, [detailOpen]);
  const open = useCallback((project: Project) => {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSelected(project);
  }, []);
  const close = useCallback(() => {
    restoreProjectFocus.current = true;
    setSelected(null);
  }, []);
  const next = useCallback(() => {
    if (!selected) return;
    setSelected(projects[(projects.findIndex((project) => project.id === selected.id) + 1) % projects.length]);
  }, [selected]);
  const pointer = (event: ReactPointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType === "touch") return;
    const r = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--type-stretch", String(1 + Math.max(0, 1 - Math.abs(event.clientX - (r.left + r.width / 2)) / (r.width * 0.8)) * 0.012));
    event.currentTarget.style.setProperty("--grid-x", `${((event.clientX - r.left) / r.width - 0.5) * 13}px`);
  };
  return (
    <main className="developer-world">
      <WorldNavigation world="developer" onReturn={onReturn} onSwitch={onSwitch} reduced={reduced} links={[{ label: "WORK", href: "#dev-work" }, { label: "ABOUT", href: "#dev-about" }, { label: "CONTACT", href: "#dev-contact" }]} />
      <section className="developer-hero" onPointerMove={pointer} onPointerLeave={(event) => { event.currentTarget.style.setProperty("--type-stretch", "1"); event.currentTarget.style.setProperty("--grid-x", "0px"); }}>
        <div className="dev-grid-plane" aria-hidden="true"><i /><i /><i /><i /><b /><b /><b /></div>
        <div className="dev-hero-top"><span>GUSTAVO GALEAZZI / CREATIVE DEVELOPER</span><span>SELECTED WORK / 2026</span></div>
        <motion.h1 initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0 0)" }} transition={{ duration: reduced ? 0.01 : 0.9, delay: reduced ? 0 : 0.12, ease: cubic }}><span>I BUILD</span><span>WHAT I</span><span>IMAGINE<span className="hero-period">.</span></span></motion.h1>
        <div className="dev-hero-bottom"><p>IDEAS INTO INTERFACES.<br />SYSTEMS INTO EXPERIENCE.</p><a href="#dev-work" className="scroll-cue"><i /> SCROLL TO EXPLORE</a><span>01 — DEVELOPER</span></div>
        <motion.div className="dev-hero-orbit" style={{ x: "var(--grid-x, 0px)" }} aria-hidden="true"><span>GG</span><i /><small>FORM / FUNCTION</small></motion.div>
      </section>
      <section className="dev-work-intro" id="dev-work"><span>01 / SELECTED WORK</span><h2>BUILT TO<br />BE USED.</h2><p>Six projects. Different problems. One curiosity about how digital tools can feel clearer and more human.</p></section>
      <div className="project-sequence">{projects.map((project, i) => <ProjectScene key={project.id} project={project} index={i} onOpen={open} reduced={reduced} />)}</div>
      <section ref={aboutRef} className="developer-about" id="dev-about"><div className="about-number">02 / ABOUT</div><div className="about-phrase"><motion.h2 style={{ x: reduced ? 0 : aboutDrift }}><span>MAKE<br />THINGS</span><motion.em style={{ scaleX: reduced ? 1 : aboutWordScale }}>MATTER.</motion.em></motion.h2><p>I build interfaces, tools and digital systems. I care about clear structure, useful detail and ideas that reward a closer look.</p></div><div className="about-vertical">DESIGN / DEVELOPMENT / EXPLORATION</div></section>
      <section className="developer-contact" id="dev-contact"><span>03 / CONTACT</span><h2 onPointerMove={(event) => respondToHeadline(event, reduced)} onPointerLeave={resetHeadline}><span>LET&apos;S BUILD</span><span>SOMETHING NEW.</span></h2><a className="contact-mail" href="mailto:gustavosgaleazzi@gmail.com">START A CONVERSATION <b aria-hidden="true">↗</b><small>gustavosgaleazzi@gmail.com</small></a><IdentityLoop world="developer" onClick={onReturn} /><div className="developer-endnote">TWO DISCIPLINES / ONE CREATIVE MIND <button onClick={onReturn}>RETURN TO THE WORLDS ↗</button></div></section>
      <AnimatePresence onExitComplete={() => { if (restoreProjectFocus.current) { restoreProjectFocus.current = false; returnFocus.current?.focus(); } }}>{selected && <ProjectDetail key={selected.id} project={selected} onClose={close} onNext={next} reduced={reduced} />}</AnimatePresence>
    </main>
  );
}

function PhotoPlaceholder({ photo, onOpen, className = "", active = false, motionStyle }: { photo: PhotoSlot; onOpen?: (photo: PhotoSlot) => void; className?: string; active?: boolean; motionStyle?: MotionStyle }) {
  const content = <><span className="photo-slot-art" aria-hidden="true"><i className="photo-cross photo-cross--one" /><i className="photo-cross photo-cross--two" /><b>{photo.number}</b><span>FRAME / {photo.number}</span></span><span className="photo-slot-note"><b>PHOTOGRAPH PLACEHOLDER</b><small>ADD ORIGINAL IMAGE / {photo.category}</small></span></>;
  const classNames = `photo-slot photo-slot--${photo.ratio} photo-slot--tone-${photo.id % 4} ${className}${active ? " is-active" : ""}`;
  const focusFrame = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
    event.currentTarget.style.setProperty("--focus-x", `${x}%`);
    event.currentTarget.style.setProperty("--focus-y", `${y}%`);
    event.currentTarget.style.setProperty("--pan-x", `${(50 - x) * 0.08}px`);
    event.currentTarget.style.setProperty("--pan-y", `${(50 - y) * 0.06}px`);
  };
  const resetFocus = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--focus-x", "50%");
    event.currentTarget.style.setProperty("--focus-y", "50%");
    event.currentTarget.style.setProperty("--pan-x", "0px");
    event.currentTarget.style.setProperty("--pan-y", "0px");
  };
  return onOpen
    ? <motion.button style={motionStyle} data-photo-id={photo.id} className={classNames} onPointerMove={focusFrame} onPointerLeave={resetFocus} onClick={() => onOpen(photo)} aria-current={active ? "true" : undefined} aria-label={`Open photo placeholder ${photo.number}, suggested collection ${photo.category}${active ? ", currently centered" : ""}`}>{content}</motion.button>
    : <motion.div style={motionStyle} data-photo-id={photo.id} className={classNames} onPointerMove={focusFrame} onPointerLeave={resetFocus} role="img" aria-label={`Photograph placeholder ${photo.number}, suggested collection ${photo.category}`}>{content}</motion.div>;
}

function PhotoViewer({ photo, onClose, onChange, reduced }: { photo: PhotoSlot; onClose: () => void; onChange: (direction: number) => void; reduced: boolean }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => acquireBodyScrollLock(), []);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") { event.preventDefault(); onChange(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); onChange(-1); }
      if (event.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])')).filter((element) => element.getClientRects().length > 0);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose, onChange]);
  return (
    <motion.div ref={dialogRef} className="photo-viewer" initial={reduced ? false : { clipPath: "circle(0% at 50% 50%)" }} animate={{ clipPath: "circle(150% at 50% 50%)" }} exit={reduced ? { opacity: 1 } : { clipPath: "circle(0% at 50% 50%)" }} transition={{ duration: reduced ? 0.01 : 0.72, ease: cubic }} role="dialog" aria-modal="true" aria-label={`Photograph placeholder ${photo.number}`}>
      <div className="viewer-shutter" aria-hidden="true">{Array.from({ length: 6 }, (_, blade) => <motion.i key={blade} style={{ rotate: blade * 30 }} initial={reduced ? false : { scaleY: 0.08, opacity: 0.2 }} animate={{ scaleY: reduced ? 1 : [0.08, 1, 0.18], opacity: reduced ? 0.5 : [0.2, 0.8, 0.35] }} transition={{ duration: reduced ? 0.01 : 0.86, delay: reduced ? 0 : blade * 0.035, ease: cubic }} />)}</div>
      <header><button onClick={onClose} autoFocus>02 / COLLECTION <span>× CLOSE</span></button><span>{photo.category} / {photo.number}</span></header>
      <div className="viewer-frame"><PhotoPlaceholder photo={photo} className="photo-slot--viewer" /></div>
      <footer><button onClick={() => onChange(-1)}>← PREVIOUS FRAME</button><span>PLACEHOLDER / REPLACE WITH ORIGINAL PHOTOGRAPH</span><button onClick={() => onChange(1)}>NEXT FRAME →</button></footer>
    </motion.div>
  );
}

function PhotographerWorld({ onReturn, onSwitch, reduced }: { onReturn: () => void; onSwitch: () => void; reduced: boolean }) {
  const [category, setCategory] = useState<Category | "ALL">("ALL");
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const [activeStripId, setActiveStripId] = useState(0);
  const returnFocus = useRef<HTMLElement | null>(null);
  const restorePhotoFocus = useRef(false);
  const viewerOpen = activePhoto !== null;
  useEffect(() => {
    if (!viewerOpen) return;
    return acquireBodyScrollLock();
  }, [viewerOpen]);
  const stripFrame = useRef<number | null>(null);
  const stripDrag = useRef<{ pointerId: number; startX: number; startScrollLeft: number; moved: boolean } | null>(null);
  const suppressStripClick = useRef(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const photoHeroRef = useRef<HTMLElement>(null);
  const wallRef = useRef<HTMLElement>(null);
  const { scrollYProgress: photoHeroProgress } = useScroll({ target: photoHeroRef, offset: ["start start", "end start"] });
  const photoHeroY = useTransform(photoHeroProgress, [0, 0.52, 1], [0, -30, -76]);
  const photoHeroScale = useTransform(photoHeroProgress, [0, 0.52, 1], [1, 1.08, 1.16]);
  const { scrollYProgress: wallProgress } = useScroll({ target: wallRef, offset: ["start end", "end start"] });
  const wallA = useTransform(wallProgress, [0, 0.5, 1], ["10vh", "0vh", "-8vh"]);
  const wallB = useTransform(wallProgress, [0, 0.5, 1], ["-8vh", "0vh", "10vh"]);
  const wallC = useTransform(wallProgress, [0, 0.5, 1], ["6vh", "0vh", "-9vh"]);
  const visiblePhotos = useMemo(() => category === "ALL" ? photoSlots : photoSlots.filter((photo) => photo.category === category), [category]);
  const selectedPhoto = activePhoto === null ? null : photoSlots.find((photo) => photo.id === activePhoto) ?? null;
  const openPhoto = useCallback((photo: PhotoSlot) => {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setActivePhoto(photo.id);
  }, []);
  const closePhoto = useCallback(() => {
    restorePhotoFocus.current = true;
    setActivePhoto(null);
  }, []);
  const changePhoto = useCallback((direction: number) => {
    setActivePhoto((current) => {
      if (current === null) return null;
      const collection = visiblePhotos.some((photo) => photo.id === current) ? visiblePhotos : photoSlots;
      const index = collection.findIndex((photo) => photo.id === current);
      return collection[(index + direction + collection.length) % collection.length].id;
    });
  }, [visiblePhotos]);
  const updateStripFocus = useCallback(() => {
    if (stripFrame.current !== null) window.cancelAnimationFrame(stripFrame.current);
    stripFrame.current = window.requestAnimationFrame(() => {
      const strip = stripRef.current;
      if (!strip) return;
      const center = strip.getBoundingClientRect().left + strip.clientWidth / 2;
      const frames = Array.from(strip.querySelectorAll<HTMLElement>("[data-photo-id]"));
      const active = frames.reduce<HTMLElement | null>((nearest, frame) => {
        if (!nearest) return frame;
        const frameDistance = Math.abs(frame.getBoundingClientRect().left + frame.clientWidth / 2 - center);
        const nearestDistance = Math.abs(nearest.getBoundingClientRect().left + nearest.clientWidth / 2 - center);
        return frameDistance < nearestDistance ? frame : nearest;
      }, null);
      if (active) setActiveStripId(Number(active.dataset.photoId));
      stripFrame.current = null;
    });
  }, []);
  useEffect(() => {
    updateStripFocus();
    return () => { if (stripFrame.current !== null) window.cancelAnimationFrame(stripFrame.current); };
  }, [visiblePhotos, updateStripFocus]);
  const chooseCategory = (next: Category | "ALL") => {
    setCategory(next);
    const first = next === "ALL" ? photoSlots[0] : photoSlots.find((photo) => photo.category === next);
    if (first) setActiveStripId(first.id);
    window.requestAnimationFrame(() => stripRef.current?.scrollTo({ left: 0, behavior: reduced ? "auto" : "smooth" }));
  };
  const moveStrip = (direction: number) => {
    const strip = stripRef.current;
    if (!strip) return;
    const currentIndex = Math.max(0, visiblePhotos.findIndex((photo) => photo.id === activeStripId));
    const target = strip.querySelector<HTMLElement>(`[data-photo-id="${visiblePhotos[Math.min(visiblePhotos.length - 1, Math.max(0, currentIndex + direction))]?.id}"]`);
    if (!target) return;
    const left = strip.scrollLeft + target.getBoundingClientRect().left - strip.getBoundingClientRect().left - (strip.clientWidth - target.clientWidth) / 2;
    strip.scrollTo({ left: Math.max(0, Math.min(strip.scrollWidth - strip.clientWidth, left)), behavior: reduced ? "auto" : "smooth" });
  };
  const startStripDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || event.button !== 0) return;
    const strip = event.currentTarget;
    suppressStripClick.current = false;
    stripDrag.current = { pointerId: event.pointerId, startX: event.clientX, startScrollLeft: strip.scrollLeft, moved: false };
  };
  const dragStrip = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = stripDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) > 5 && !drag.moved) {
      drag.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.classList.add("is-dragging");
    }
    if (drag.moved) event.currentTarget.scrollLeft = drag.startScrollLeft - distance;
  };
  const endStripDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = stripDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (drag.moved) {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      event.currentTarget.classList.remove("is-dragging");
      suppressStripClick.current = true;
      window.setTimeout(() => { suppressStripClick.current = false; }, 120);
    }
    stripDrag.current = null;
  };
  const preventClickAfterDrag = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!suppressStripClick.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressStripClick.current = false;
  };
  return (
    <main className="photographer-world">
      <WorldNavigation world="photographer" onReturn={onReturn} onSwitch={onSwitch} reduced={reduced} links={[{ label: "FILM", href: "#photo-film" }, { label: "WALL", href: "#photo-wall" }, { label: "CONTACT", href: "#photo-contact" }]} />
      <section ref={photoHeroRef} className="photographer-hero">
        <div className="photo-hero-meta"><span>GUSTAVO GALEAZZI / PHOTOGRAPHER</span><span>LIGHT STUDY / 2026</span></div>
        <motion.div className="photo-hero-frame" style={{ y: reduced ? 0 : photoHeroY, scale: reduced ? 1 : photoHeroScale }} initial={reduced ? false : { clipPath: "inset(46% 0 46% 0)" }} animate={{ clipPath: "inset(0)" }} transition={{ duration: reduced ? 0.01 : 0.88, delay: reduced ? 0 : 0.12, ease: cubic }}><PhotoPlaceholder photo={photoSlots[0]} onOpen={openPhoto} className="photo-slot--hero" /><div className="hero-frame-corners" aria-hidden="true"><i /><i /><i /><i /></div></motion.div>
        <motion.h1 initial={reduced ? false : { clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0)" }} transition={{ duration: reduced ? 0.01 : 0.72, delay: reduced ? 0 : 0.28, ease: cubic }}>THROUGH<br /><em>MY EYES.</em></motion.h1>
        <p className="photo-hero-caption">A PLACE FOR IMAGES, LIGHT AND THE DETAILS<br />THAT MAKE A MOMENT STAY.</p>
        <div className="photo-hero-bottom"><span>02 — PHOTOGRAPHER</span><a className="scroll-cue" href="#photo-film"><i /> ENTER THE COLLECTION</a><span>COLLECTION STATUS / PLACEHOLDERS</span></div>
      </section>
      <section className="photo-film-section" id="photo-film">
        <div className="photo-section-head"><div><span>01 / THE FILM STRIP</span><h2>ONE FRAME<br />LEADS TO ANOTHER.</h2></div><p>Drag the sequence or use the arrows. These are clearly marked image slots, ready for original photographs.</p></div>
        <div className="collection-controls"><div className="category-list" role="group" aria-label="Suggested photo collections">{(["ALL", ...categories] as const).map((item) => <button key={item} className={category === item ? "is-active" : ""} onClick={() => chooseCategory(item)} aria-pressed={category === item}>{item}</button>)}</div><div className="strip-arrows"><button onClick={() => moveStrip(-1)} aria-label="Previous frame">←</button><button onClick={() => moveStrip(1)} aria-label="Next frame">→</button></div></div>
        <div className="photo-strip" ref={stripRef} role="region" aria-label="Photograph film strip; use the arrow buttons or drag to explore" tabIndex={0} onScroll={updateStripFocus} onPointerDown={startStripDrag} onPointerMove={dragStrip} onPointerUp={endStripDrag} onPointerCancel={endStripDrag} onClickCapture={preventClickAfterDrag}>{visiblePhotos.map((photo) => <PhotoPlaceholder key={photo.id} photo={photo} onOpen={openPhoto} active={photo.id === activeStripId} className="photo-slot--strip" />)}</div>
        <p className="sr-only" aria-live="polite">Frame {String(Math.max(0, visiblePhotos.findIndex((photo) => photo.id === activeStripId)) + 1).padStart(2, "0")} of {visiblePhotos.length} is centered.</p>
        <p className="photo-disclaimer">SUGGESTED CATEGORIES / NO ORIGINAL PHOTOGRAPHS WERE INCLUDED IN THE PROJECT FILES.</p>
      </section>
      <section ref={wallRef} className="photo-wall-section" id="photo-wall"><div className="photo-wall-head"><span>02 / THE EXHIBITION WALL</span><h2>LOOK<br /><em>CLOSER.</em></h2><p>Each frame is a replaceable placeholder. Collection titles are suggestions, not a record of existing work.</p></div><div className="exhibition-wall"><PhotoPlaceholder photo={photoSlots[4]} onOpen={openPhoto} motionStyle={{ y: reduced ? 0 : wallA }} className="photo-slot--wall photo-slot--wall-a" /><PhotoPlaceholder photo={photoSlots[9]} onOpen={openPhoto} motionStyle={{ y: reduced ? 0 : wallB }} className="photo-slot--wall photo-slot--wall-b" /><PhotoPlaceholder photo={photoSlots[13]} onOpen={openPhoto} motionStyle={{ y: reduced ? 0 : wallC }} className="photo-slot--wall photo-slot--wall-c" /><div className="wall-note"><span>FRAME / FOCUS / FEELING</span><i /></div></div></section>
      <section className="contact-sheet-section"><div className="contact-sheet-head"><span>03 / THE CONTACT SHEET</span><h2>SELECT A FRAME.</h2><p>Open any slot to preview the intended full-screen viewer and directional navigation.</p></div><div className="contact-sheet-grid">{visiblePhotos.map((photo) => <PhotoPlaceholder key={photo.id} photo={photo} onOpen={openPhoto} className="photo-slot--sheet" />)}</div><div className="photo-disclaimer">IMAGE PLACEHOLDERS / REPLACE WITH GUSTAVO&apos;S ORIGINAL PHOTOGRAPHS</div></section>
      <section className="photographer-contact" id="photo-contact"><span>04 / CONTACT</span><h2 onPointerMove={(event) => respondToHeadline(event, reduced)} onPointerLeave={resetHeadline}><span>EVERY FRAME</span><span><em>TELLS SOMETHING.</em></span></h2><p>PHOTOGRAPHY / COLLECTION IN PROGRESS</p><a className="contact-mail contact-mail--photo" href="mailto:gustavosgaleazzi@gmail.com">START A CONVERSATION <b aria-hidden="true">↗</b><small>gustavosgaleazzi@gmail.com</small></a><IdentityLoop world="photographer" onClick={onReturn} /><div className="photographer-endnote">TWO DISCIPLINES / ONE CREATIVE MIND <button onClick={onReturn}>RETURN TO THE WORLDS ↗</button></div></section>
      <AnimatePresence mode="wait" onExitComplete={() => { if (restorePhotoFocus.current) { restorePhotoFocus.current = false; returnFocus.current?.focus(); } }}>{selectedPhoto && <PhotoViewer key={selectedPhoto.id} photo={selectedPhoto} onClose={closePhoto} onChange={changePhoto} reduced={reduced} />}</AnimatePresence>
    </main>
  );
}

function IdentityLoop({ world, onClick }: { world: "developer" | "photographer"; onClick: () => void }) {
  return <button className={`identity-loop identity-loop--${world}`} onClick={onClick} aria-label="Return to the two-world selector"><span>GG</span><i /><small>TWO<br />WORLDS</small></button>;
}

function TransitionCurtain({ curtain }: { curtain: Curtain }) {
  const closed = curtain.target === "developer" ? "inset(0 100% 0 0)" : "circle(0% at var(--curtain-origin))";
  const open = curtain.target === "developer" ? "inset(0)" : "circle(150% at var(--curtain-origin))";
  return (
    <motion.div className="world-curtain" data-world={curtain.target} data-phase={curtain.phase} initial={{ clipPath: closed }} animate={{ clipPath: curtain.phase === "cover" ? open : closed }} transition={{ duration: 0.56, ease: cubic }} style={{ "--curtain-origin": `${curtain.x}% ${curtain.y}%` } as CSSProperties} aria-hidden="true">
      {curtain.target === "photographer" ? <div className="curtain-aperture"><i /><i /><i /><i /><i /><i /></div> : curtain.target === "developer" ? <div className="curtain-grid"><i /><i /><i /><i /><i /><i /></div> : <div className="curtain-two-worlds"><i /><i /><b>GG</b></div>}
    </motion.div>
  );
}

export function DualityExperience() {
  const reduced = useReducedMotion();
  const [world, setWorld] = useState<World>("selector");
  const [showIntro, setShowIntro] = useState(false);
  const [curtain, setCurtain] = useState<Curtain | null>(null);
  const scrollPositions = useRef({ developer: 0, photographer: 0 });
  const introFinish = useCallback(() => {
    setShowIntro(false);
    try { window.sessionStorage.setItem("duality-intro-seen", "yes"); } catch { /* The intro is optional. */ }
  }, []);

  useEffect(() => {
    if (reduced) return;
    try { if (window.sessionStorage.getItem("duality-intro-seen") === "yes") return; } catch { /* Storage can be disabled. */ }
    const timer = window.setTimeout(() => setShowIntro(true), 0);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  const transitionTo = useCallback((target: World, x = 50, y = 50) => {
    if (target === world || curtain) return;
    if (world === "developer" || world === "photographer") scrollPositions.current[world] = window.scrollY;
    if (reduced) {
      setWorld(target);
      window.requestAnimationFrame(() => window.scrollTo(0, target === "developer" || target === "photographer" ? scrollPositions.current[target] : 0));
      return;
    }
    setCurtain({ target, phase: "cover", x, y });
  }, [world, curtain, reduced]);

  useEffect(() => {
    if (!curtain) return;
    const releaseScroll = acquireBodyScrollLock();
    if (curtain.phase === "cover") {
      const timer = window.setTimeout(() => {
        setWorld(curtain.target);
        window.requestAnimationFrame(() => window.scrollTo(0, curtain.target === "developer" || curtain.target === "photographer" ? scrollPositions.current[curtain.target] : 0));
        setCurtain((current) => current ? { ...current, phase: "reveal" } : current);
      }, 560);
      return () => { window.clearTimeout(timer); releaseScroll(); };
    }
    const timer = window.setTimeout(() => setCurtain(null), 620);
    return () => { window.clearTimeout(timer); releaseScroll(); };
  }, [curtain]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{showIntro && !reduced && <IntroSequence key="opening" onFinish={introFinish} />}</AnimatePresence>
      <div className="duality-site" aria-hidden={showIntro} inert={showIntro}>
        {world === "selector" && <WorldSelector onEnter={(target, x, y) => transitionTo(target, x, y)} reduced={Boolean(reduced)} />}
        {world === "developer" && <DeveloperWorld onReturn={() => transitionTo("selector")} onSwitch={() => transitionTo("photographer")} reduced={Boolean(reduced)} />}
        {world === "photographer" && <PhotographerWorld onReturn={() => transitionTo("selector")} onSwitch={() => transitionTo("developer")} reduced={Boolean(reduced)} />}
      </div>
      <AnimatePresence>{curtain && <TransitionCurtain key={curtain.target} curtain={curtain} />}</AnimatePresence>
    </MotionConfig>
  );
}
