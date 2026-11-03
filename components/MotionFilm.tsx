"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";

type Project = { id: string; name: string; category: string; description: string; detail: string; source?: string; live?: string };
const projects: Project[] = [
  { id: "claudefy", name: "CLAUDEFY", category: "AI TOOLING / WINDOWS", description: "Claude Code usage, session limits and plan progress brought into native Windows notifications.", detail: "A LOCAL UTILITY FOR CLEARER SIGNALS", source: "https://github.com/gusata/ClaudeFy" },
  { id: "leia", name: "LEIA", category: "AI / DOCUMENTATION", description: "An AI documentation engine that reads a codebase and turns its structure into useful project documentation.", detail: "FROM SOURCE CODE TO SHARED KNOWLEDGE", source: "https://github.com/gusata/LEIA" },
  { id: "bob", name: "BOB", category: "PRODUCT / BROWSER", description: "A quiet browser start page for local notes and text shortcuts, keeping personal data on the device.", detail: "A SMALLER, MORE PERSONAL STARTING POINT", source: "https://github.com/gusata/Bob", live: "https://bob-webpage.vercel.app/" },
  { id: "blitz", name: "BLITZ", category: "PRODUCT / DOCUMENT OCR", description: "An AI-assisted workflow that reads documents and carries the extracted information into a system.", detail: "DOCUMENTS TURNED INTO INFORMATION" },
];
const sections = [{ label: "WORK", href: "#work" }, { label: "ABOUT", href: "#about" }, { label: "PLAYGROUND", href: "#playground" }, { label: "CONTACT", href: "#contact" }];
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = [0.22, 1, 0.36, 1] as const;
const mediaQuery = "(prefers-reduced-motion: reduce)";
const introKey = "gg-motion-film-intro";
const introEvent = "gg-motion-film-intro-end";
let introDismissed = false;

function subscribeMotion(callback: () => void) {
  const media = window.matchMedia(mediaQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
function useReducedMotion() {
  return useSyncExternalStore(subscribeMotion, () => window.matchMedia(mediaQuery).matches, () => false);
}
function introSnapshot() {
  if (introDismissed || window.matchMedia(mediaQuery).matches || window.location.hash) return false;
  try { return sessionStorage.getItem(introKey) !== "seen"; } catch { return true; }
}
function subscribeIntro(callback: () => void) {
  const media = window.matchMedia(mediaQuery);
  window.addEventListener(introEvent, callback);
  media.addEventListener("change", callback);
  return () => { window.removeEventListener(introEvent, callback); media.removeEventListener("change", callback); };
}
function dismissIntro() {
  introDismissed = true;
  try { sessionStorage.setItem(introKey, "seen"); } catch { /* The in-memory flag also handles blocked storage. */ }
  window.dispatchEvent(new Event(introEvent));
}

function Opening() {
  const [skipping, setSkipping] = useState(false);
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(dismissIntro, 2900);
    return () => { window.clearTimeout(timer); document.body.style.overflow = previous; };
  }, []);
  const skip = () => { setSkipping(true); window.setTimeout(dismissIntro, 180); };
  return (
    <div className="opening" data-skipping={skipping} aria-label="Introduction">
      <div className="opening-paper" />
      <div className="opening-letter" aria-hidden="true"><span>G</span><span>G</span><span>G</span></div>
      <div className="opening-rule" aria-hidden="true" />
      <button type="button" className="opening-skip" onClick={skip}>SKIP INTRO <span>↗</span></button>
    </div>
  );
}

type Point = { x: number; y: number; size: number };
type Flight = { from: [Point, Point]; to: [Point, Point] };
type SpanRef = RefObject<HTMLSpanElement | null>;

function FlyingLetter({ index, geometry, progress }: { index: 0 | 1; geometry: Flight | null; progress: MotionValue<number> }) {
  const from = geometry?.from[index] ?? { x: 0, y: 0, size: 16 };
  const to = geometry?.to[index] ?? { x: 0, y: 0, size: 16 };
  const smooth = useSpring(progress, { stiffness: 150, damping: 34, mass: .65 });
  const x = useTransform(smooth, [0, .12, .48, .82], [0, 0, (to.x - from.x) * .55, to.x - from.x]);
  const y = useTransform(smooth, [0, .12, .48, .82], [0, 0, (to.y - from.y) * .45 + (index ? 35 : -35), to.y - from.y]);
  const scale = useTransform(smooth, [0, .12, .48, .82], [1, 1, .48, to.size / from.size]);
  const opacity = useTransform(smooth, [0, .08, .14, .72, .86], [0, 0, 1, 1, 0]);
  return <motion.span className="flying-letter" aria-hidden="true" style={{ left: from.x, top: from.y, x, y, scale, fontSize: from.size, opacity: geometry ? opacity : 0 }}>G</motion.span>;
}

function Pointer() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const node = ref.current;
    if (!node) return;
    const move = (event: PointerEvent) => {
      node.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      node.dataset.visible = "true";
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-pointer]") : null;
      node.dataset.label = target?.dataset.pointer || "";
    };
    const leave = () => { node.dataset.visible = "false"; };
    document.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => { document.removeEventListener("pointermove", move); document.documentElement.removeEventListener("pointerleave", leave); };
  }, []);
  return <div className="film-pointer" ref={ref} aria-hidden="true"><i /><span /></div>;
}

function Menu({ open, setOpen, reduced }: { open: boolean; setOpen: (value: boolean) => void; reduced: boolean }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", key);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", key); };
  }, [open, setOpen]);
  return (
    <div id="film-index" className="menu-film" data-open={open} aria-hidden={!open} inert={!open} role="dialog" aria-modal="true" aria-label="Section index">
      <div className="menu-plane">
        <div className="menu-top"><span>GUSTAVO GALEAZZI / INDEX</span><button ref={closeRef} type="button" onClick={() => setOpen(false)} data-pointer="CLOSE">CLOSE <span>×</span></button></div>
        <nav className="menu-items" aria-label="Portfolio sections">
          {sections.map((item, index) => <a href={item.href} key={item.href} onClick={() => setOpen(false)} data-pointer="OPEN" style={{ "--delay": reduced ? "0ms" : `${index * 65}ms` } as CSSProperties}><span>0{index + 1}</span><strong>{item.label}</strong><b>↗</b></a>)}
        </nav>
        <div className="menu-bottom"><span>AN INDEPENDENT DIGITAL PRACTICE</span><span>SÃO PAULO, BR / 2026</span></div>
      </div>
      <div className="menu-cover menu-cover-top" aria-hidden="true"><span>GUSTAVO GALEAZZI</span></div><div className="menu-cover menu-cover-bottom" aria-hidden="true"><span>THE LIVING GRID / 2026</span></div>
    </div>
  );
}

function Header({ open, setOpen, index, markA, markB, markOpacity, hidden }: { open: boolean; setOpen: (value: boolean) => void; index: number; markA: SpanRef; markB: SpanRef; markOpacity: MotionValue<number>; hidden: boolean }) {
  return <header className="film-header" aria-hidden={hidden} inert={hidden}>
    <a href="#top" className="film-mark" aria-label="Back to the beginning" data-pointer="TOP"><motion.span ref={markA} style={{ opacity: markOpacity }}>G</motion.span><motion.span ref={markB} style={{ opacity: markOpacity }}>G</motion.span></a>
    <span className="header-caption">CREATIVE DEVELOPER <i /> 2026</span>
    <div className="header-right"><span className="header-index" aria-label={`Index ${index + 1}`}><span>INDEX</span><span className="number-window"><motion.b key={index} initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: .35, ease }}>0{index + 1}</motion.b></span></span><button type="button" className="header-menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="film-index" data-pointer="OPEN">INDEX <span><i /><i /></span></button></div>
  </header>;
}

function HeroLine({ text, firstRef, opacity }: { text: string; firstRef: SpanRef; opacity: MotionValue<number> }) {
  return <span className="name-line" aria-label={text}>{Array.from(text, (letter, index) => <motion.span className="name-glyph" data-name-glyph key={`${letter}-${index}`} ref={index === 0 ? firstRef : undefined} style={index === 0 ? { opacity } : undefined} aria-hidden="true">{letter}</motion.span>)}</span>;
}

function Hero({ heroRef, first, second, progress, reduced }: { heroRef: RefObject<HTMLElement | null>; first: SpanRef; second: SpanRef; progress: MotionValue<number>; reduced: boolean }) {
  const firstX = useTransform(progress, (value) => `${reduced ? 0 : -clamp((value - .20) / .72) * 105}%`);
  const secondX = useTransform(progress, (value) => `${reduced ? 0 : clamp((value - .20) / .72) * 105}%`);
  const nameOpacity = useTransform(progress, (value) => reduced ? 1 : 1 - clamp((value - .48) / .4));
  const gOpacity = useTransform(progress, (value) => reduced ? 1 : 1 - clamp((value - .07) / .08));
  const lineWidth = useTransform(progress, (value) => reduced ? 1 : 1 - clamp((value - .5) / .5) * .48);
  const respond = (event: ReactPointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType === "touch") return;
    event.currentTarget.querySelectorAll<HTMLElement>("[data-name-glyph]").forEach((glyph) => {
      const rect = glyph.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2); const dy = event.clientY - (rect.top + rect.height / 2);
      const influence = Math.max(0, 1 - Math.hypot(dx, dy) / 190);
      glyph.style.setProperty("--nx", `${Math.max(-6, Math.min(6, dx * influence * .025))}px`);
      glyph.style.setProperty("--ny", `${Math.max(-4, Math.min(4, dy * influence * .018))}px`);
      glyph.style.setProperty("--nw", `${1 + influence * .055}`);
    });
  };
  const reset = (event: ReactPointerEvent<HTMLElement>) => event.currentTarget.querySelectorAll<HTMLElement>("[data-name-glyph]").forEach((glyph) => { glyph.style.setProperty("--nx", "0px"); glyph.style.setProperty("--ny", "0px"); glyph.style.setProperty("--nw", "1"); });
  return <section id="top" ref={heroRef} className="hero-film" data-index="0" aria-labelledby="hero-name">
    <div className="hero-screen">
      <div className="hero-edition"><span>INDEPENDENT PRACTICE<br />SÃO PAULO / BRAZIL</span><span>AN INDEX OF IDEAS<br />2026 — 01 / 04</span></div>
      <div className="hero-composition" onPointerMove={respond} onPointerLeave={reset}>
        <div className="hero-side-label">GUSTAVO GALEAZZI <span>↗</span> DIGITAL PRACTICE</div>
        <h1 id="hero-name" className="hero-name" aria-label="Gustavo Galeazzi">
          <motion.span className="name-row name-row-one" style={{ x: firstX, opacity: nameOpacity }}><HeroLine text="GUSTAVO" firstRef={first} opacity={gOpacity} /></motion.span>
          <motion.span className="name-row name-row-two" style={{ x: secondX, opacity: nameOpacity }}><HeroLine text="GALEAZZI" firstRef={second} opacity={gOpacity} /></motion.span>
        </h1>
        <div className="hero-crossline" aria-hidden="true"><i /></div>
      </div>
      <div className="hero-information"><span>CREATIVE DEVELOPER<br />/ 2026</span><p>DIGITAL EXPERIENCES<br />&amp; INTELLIGENT SYSTEMS</p><span>AVAILABLE FOR<br />SELECT PROJECTS</span></div>
      <div className="hero-bottom"><span>01 / THE BEGINNING</span><motion.i style={{ scaleX: lineWidth }} /><span>SCROLL TO REVEAL&nbsp; ↓</span></div>
    </div>
  </section>;
}

function Art({ project }: { project: Project }) {
  if (project.id === "claudefy") return <>
    <rect width="1440" height="900" fill="#111111" /><path d="M90 90H1350M90 810H1350M90 90V810M1350 90V810" fill="none" stroke="#f4f3ef" strokeOpacity=".35" />
    <text x="95" y="190" fill="#f4f3ef" fontSize="25" letterSpacing="8">SIGNAL / 01</text><text x="90" y="585" fill="#f4f3ef" fontSize="440" fontWeight="900" letterSpacing="-38">01:00</text>
    <path d="M950 252H1325M950 308H1250M950 364H1290" stroke="#d7ff3f" strokeWidth="7" /><text x="955" y="748" fill="#f4f3ef" fontSize="22" letterSpacing="4">USAGE / LIMITS / TIME</text>
    <rect x="90" y="775" width="240" height="8" fill="#d7ff3f" />
  </>;
  if (project.id === "leia") return <>
    <rect width="1440" height="900" fill="#111111" /><rect x="90" y="100" width="1260" height="700" fill="none" stroke="#f4f3ef" strokeOpacity=".45" />
    <text x="100" y="210" fill="#f4f3ef" fontSize="25" letterSpacing="7">READ / INTERPRET / WRITE</text><text x="62" y="650" fill="#f4f3ef" fontWeight="900" fontSize="690" letterSpacing="-45">[</text><text x="1020" y="650" fill="#f4f3ef" fontWeight="900" fontSize="690" letterSpacing="-45">]</text>
    <g fill="#f4f3ef"><rect x="420" y="285" width="530" height="15" /><rect x="420" y="337" width="400" height="15" /><rect x="420" y="389" width="478" height="15" /><rect x="420" y="441" width="320" height="15" /><rect x="420" y="493" width="510" height="15" /><rect x="420" y="545" width="380" height="15" /></g><rect x="420" y="598" width="128" height="15" fill="#d7ff3f" />
  </>;
  if (project.id === "bob") return <>
    <rect width="1440" height="900" fill="#111111" /><path d="M0 450H1440M720 0V900" stroke="#f4f3ef" strokeOpacity=".22" /><circle cx="720" cy="450" r="286" fill="#f4f3ef" /><circle cx="720" cy="450" r="218" fill="#111111" /><circle cx="720" cy="450" r="134" fill="#f4f3ef" />
    <text x="105" y="150" fill="#f4f3ef" fontSize="24" letterSpacing="6">A PLACE TO BEGIN AGAIN</text><text x="101" y="790" fill="#f4f3ef" fontSize="25" letterSpacing="5">NOTES / SHORTCUTS / LOCAL</text><rect x="706" y="436" width="28" height="28" fill="#d7ff3f" />
  </>;
  return <>
    <rect width="1440" height="900" fill="#111111" /><text x="45" y="680" fill="#f4f3ef" fontWeight="900" fontSize="470" letterSpacing="-35">BLITZ</text>
    <rect x="315" y="135" width="1005" height="580" fill="#f4f3ef" /><image href="/blitz3.jpeg" x="332" y="152" width="971" height="546" preserveAspectRatio="xMidYMid slice" style={{ filter: "grayscale(1) contrast(1.08)" }} />
    <rect x="315" y="715" width="1005" height="12" fill="#d7ff3f" /><text x="95" y="815" fill="#f4f3ef" fontSize="24" letterSpacing="6">DOCUMENT / DATA / DECISION</text>
  </>;
}

function ProjectScene({ project, index, setIndex, reduced }: { project: Project; index: number; setIndex: (index: number) => void; reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [detailsVisible, setDetailsVisible] = useState(reduced);
  const interactive = reduced || detailsVisible;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const maskScale = useTransform(scrollYProgress, (v) => reduced ? 1 : .012 + clamp(v / .2) * .988);
  const maskOpacity = useTransform(scrollYProgress, (v) => reduced ? 0 : 1 - clamp((v - .32) / .18));
  const fullClip = useTransform(scrollYProgress, (v) => {
    if (reduced) return "inset(0% 0% 0% 0%)";
    const open = clamp((v - .26) / .27);
    const close = clamp((v - .86) / .14);
    const vertical = (1 - open) * 49.8 + close * 49.2;
    const horizontal = index === projects.length - 1 ? close * 49.2 : 0;
    return `inset(${vertical}% ${horizontal}% ${vertical}% ${horizontal}%)`;
  });
  const detailsOpacity = useTransform(scrollYProgress, (v) => reduced ? 1 : clamp((v - .44) / .16) * (1 - clamp((v - .82) / .12)));
  const detailsY = useTransform(scrollYProgress, (v) => reduced ? 0 : 35 * (1 - clamp((v - .44) / .16)));
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > .03 && v < .98) setIndex(index);
    const visible = reduced || (v > .46 && v < .91);
    setDetailsVisible((previous) => previous === visible ? previous : visible);
  });
  const maskId = `film-mask-${project.id}`;
  const movePreview = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--art-shift", `${((event.clientX - rect.left) / rect.width - .5) * 15}px`);
  };
  return <section ref={ref} className="project-film" id={index === 0 ? "work" : `work-${project.id}`} data-index={index} aria-labelledby={`title-${project.id}`}>
    <div className="project-screen" onPointerMove={movePreview} onPointerLeave={(event) => event.currentTarget.style.setProperty("--art-shift", "0px")}>
      <div className="project-topline"><span>SELECTED WORK / 0{index + 1}</span><span>{project.category}</span></div>
      <motion.div className="project-mask" style={{ scaleY: maskScale, opacity: maskOpacity }} aria-hidden="true">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"><defs><mask id={maskId}><rect width="1440" height="900" fill="black" /><text x="720" y="555" fill="white" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="310" textLength="1320" lengthAdjust="spacingAndGlyphs">{project.name}</text></mask></defs><g mask={`url(#${maskId})`}><Art project={project} /></g><text x="720" y="555" fill="none" stroke="#111111" strokeWidth="4" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="310" textLength="1320" lengthAdjust="spacingAndGlyphs">{project.name}</text></svg>
      </motion.div>
      <motion.div className="project-image" style={{ clipPath: fullClip }} aria-hidden="true"><div className="project-image-inner"><svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"><Art project={project} /></svg></div></motion.div>
      <h2 className="visually-hidden" id={`title-${project.id}`}>{project.name}</h2>
      <motion.div className="project-info" style={{ opacity: detailsOpacity, y: detailsY, pointerEvents: interactive ? "auto" : "none" }} aria-hidden={!interactive} inert={!interactive}>
        <div className="project-info-title"><span>0{index + 1} / {project.category}</span><p className="project-display-name">{project.name}</p></div>
        <div className="project-info-copy"><p>{project.description}</p><span>{project.detail}</span><div className="project-links">{project.source && <a href={project.source} target="_blank" rel="noreferrer" data-pointer="OPEN">SOURCE ↗</a>}{project.live && <a href={project.live} target="_blank" rel="noreferrer" data-pointer="OPEN">LIVE PROJECT ↗</a>}</div></div>
      </motion.div>
      <div className="project-baseline"><span>THE LIVING GRID / 2026</span><span>0{index + 1} / 04</span><span>SCROLL TO TRANSFORM ↓</span></div>
    </div>
  </section>;
}

function About({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const firstX = useTransform(scrollYProgress, (v) => reduced ? 0 : 80 * (1 - clamp(v / .24)));
  const secondX = useTransform(scrollYProgress, (v) => reduced ? 0 : -55 * (1 - clamp((v - .05) / .24)));
  const copyY = useTransform(scrollYProgress, (v) => reduced ? 0 : 28 * (1 - clamp((v - .18) / .22)));
  const copyOpacity = useTransform(scrollYProgress, (v) => reduced ? 1 : clamp((v - .12) / .2));
  const squareScale = useTransform(scrollYProgress, (v) => reduced ? 1 : 1 + (1 - clamp(v / .25)) * 3);
  return <section id="about" ref={ref} className="about-film" data-index="1" aria-labelledby="about-title"><div className="about-screen">
    <div className="scene-label"><span>02 / ABOUT</span><span>FORM / FUNCTION / FEELING</span></div>
    <div className="about-body"><h2 id="about-title"><motion.span style={{ x: firstX }}>I MAKE</motion.span><motion.span style={{ x: secondX }}>IDEAS <span className="about-move">MOVE<motion.i style={{ scale: squareScale }} /></span></motion.span></h2>
      <motion.div className="about-copy" style={{ y: copyY, opacity: copyOpacity }}><span>THE PERSON BEHIND THE PRACTICE / 01</span><p>I’m Gustavo Galeazzi, a creative developer in São Paulo. I build digital experiences and intelligent systems that make complicated things feel clear, useful and human.</p><p>My work moves between design, code and experimentation — always looking for a more thoughtful way to connect them.</p></motion.div>
    </div>
    <div className="word-composition" aria-label="Design, development and exploration"><span>AN ONGOING CONVERSATION</span><b>DESIGN</b><b>DEVELOPMENT</b><b>EXPLORATION</b></div>
    <div className="scene-footer"><span>STILL IN MOTION</span><span>GUSTAVO GALEAZZI / 2026</span></div>
  </div></section>;
}

function Playground() {
  const [pull, setPull] = useState({ x: 0, y: 0, active: false });
  const field = useRef<HTMLDivElement>(null);
  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" && !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setPull({ x: Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)), y: Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1)), active: true });
  };
  const rest = () => setPull({ x: 0, y: 0, active: false });
  const style = { "--pull-x": `${pull.x * 34}px`, "--pull-y": `${pull.y * 24}px`, "--pull-rotate": `${pull.x * 5}deg`, "--pull-width": 1 + Math.abs(pull.x) * .08, "--grid-x": `${pull.x * 28}px`, "--grid-y": `${pull.y * 20}px` } as CSSProperties;
  return <section id="playground" className="play-film" data-index="2" aria-labelledby="play-title">
    <div className="play-screen"><div className="scene-label"><span>03 / PLAYGROUND</span><span>TYPE / LINE / RESPONSE</span></div>
      <div className="play-layout"><div className="play-copy"><span>PLAYGROUND / 001</span><h2 id="play-title">A GRID<br />WITH A<br /><em>PULSE.</em></h2><p>Move across the mark or take hold of it. The grid will find its way back.</p><button type="button" onClick={() => { setPull({ x: .8, y: -.5, active: true }); window.setTimeout(rest, 800); }} data-pointer="MOVE">RECOMPOSE ↗</button><small>DRAG / TOUCH / ARROW KEYS</small></div>
        <div ref={field} className="play-object" style={style} data-active={pull.active} tabIndex={0} role="group" aria-label="Interactive GG monogram. Drag or use the arrow keys to move the letters." data-pointer="DRAG" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); move(event); }} onPointerMove={move} onPointerUp={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); rest(); }} onPointerCancel={rest} onPointerLeave={(event) => { if (!event.currentTarget.hasPointerCapture(event.pointerId)) rest(); }} onBlur={rest} onKeyDown={(event) => { const keys: Record<string, [number, number]> = { ArrowLeft: [-.3, 0], ArrowRight: [.3, 0], ArrowUp: [0, -.3], ArrowDown: [0, .3] }; const delta = keys[event.key]; if (!delta) return; event.preventDefault(); setPull((old) => ({ x: Math.max(-1, Math.min(1, old.x + delta[0])), y: Math.max(-1, Math.min(1, old.y + delta[1])), active: true })); }}>
          <div className="play-lines" aria-hidden="true"><i /><i /><i /><i /><i /></div><span className="play-coord">X / Y<br />001</span><div className="play-monogram" aria-hidden="true"><span>G</span><span>G</span><i /></div><span className="play-coord play-coord-end">MOVE<br />RETURN</span>
        </div>
      </div><div className="scene-footer"><span>AN EXPERIMENT IN RESISTANCE</span><span>03 / 04</span></div></div>
    <div className="word-bridge" aria-hidden="true"><span>MOVE</span><i /><small>ONE WORD BECOMES AN INVITATION</small></div>
  </section>;
}

function Contact({ reduced, onEnding }: { reduced: boolean; onEnding: (hidden: boolean) => void }) {
  const ref = useRef<HTMLElement>(null);
  const [contentVisible, setContentVisible] = useState(true);
  const interactive = reduced || contentVisible;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const oldY = useTransform(scrollYProgress, (v) => reduced ? -100 : -110 * clamp(v / .16));
  const oldOpacity = useTransform(scrollYProgress, (v) => reduced ? 0 : 1 - clamp(v / .12));
  const newY = useTransform(scrollYProgress, (v) => reduced ? 0 : 100 * (1 - clamp(v / .16)));
  const newOpacity = useTransform(scrollYProgress, (v) => reduced ? 1 : clamp(v / .12));
  const contentOpacity = useTransform(scrollYProgress, (v) => reduced ? 1 : 1 - clamp((v - .7) / .22));
  const contentScale = useTransform(scrollYProgress, (v) => reduced ? 1 : 1 - clamp((v - .7) / .22) * .1);
  const markOpacity = useTransform(scrollYProgress, (v) => reduced ? 0 : clamp((v - .78) / .18));
  useMotionValueEvent(scrollYProgress, "change", (v) => { const hidden = !reduced && v > .96; const contentHidden = !reduced && v > .91; onEnding(hidden); setContentVisible((old) => old === !contentHidden ? old : !contentHidden); });
  const react = (event: ReactPointerEvent<HTMLHeadingElement>) => {
    if (reduced || event.pointerType === "touch") return;
    event.currentTarget.querySelectorAll<HTMLElement>("[data-contact-letter]").forEach((letter) => { const r = letter.getBoundingClientRect(); const dx = event.clientX - (r.left + r.width / 2); const dy = event.clientY - (r.top + r.height / 2); const f = Math.max(0, 1 - Math.hypot(dx, dy) / 170); letter.style.setProperty("--cx", `${Math.max(-5, Math.min(5, dx * f * .02))}px`); letter.style.setProperty("--cw", `${1 + f * .045}`); });
  };
  const release = (event: ReactPointerEvent<HTMLHeadingElement>) => event.currentTarget.querySelectorAll<HTMLElement>("[data-contact-letter]").forEach((letter) => { letter.style.setProperty("--cx", "0px"); letter.style.setProperty("--cw", "1"); });
  const letters = (word: string) => Array.from(word, (letter, index) => <span data-contact-letter key={`${letter}-${index}`}>{letter}</span>);
  return <section id="contact" ref={ref} className="contact-film" data-index="3" aria-labelledby="contact-title"><div className="contact-screen">
    <motion.div className="contact-frame" style={{ opacity: contentOpacity, scale: contentScale }} aria-hidden={!interactive} inert={!interactive}>
      <div className="scene-label"><span>04 / CONTACT</span><span>THE LAST FRAME IS A BEGINNING</span></div>
      <div className="contact-content"><span className="contact-kicker">AVAILABLE FOR SELECT PROJECTS / 2026</span>
        <h2 id="contact-title" aria-label="Let’s create something" onPointerMove={react} onPointerLeave={release}><span className="contact-switch"><motion.span style={{ y: oldY, opacity: oldOpacity }} aria-hidden="true">{letters("MOVE")}</motion.span><motion.span style={{ y: newY, opacity: newOpacity }} aria-hidden="true">{letters("LET’S")}</motion.span></span><span>{letters("CREATE")}</span><span>{letters("SOMETHING")}<i>.</i></span></h2>
        <div className="contact-actions"><a href="mailto:gustavosgaleazzi@gmail.com" data-pointer="EMAIL"><small>HAVE AN IDEA?</small>gustavosgaleazzi@gmail.com <b>↗</b></a><div><a href="https://github.com/gusata" target="_blank" rel="noreferrer" data-pointer="OPEN">GITHUB ↗</a><a href="https://www.linkedin.com/in/gustavo-sanches-galeazzi-058346258/" target="_blank" rel="noreferrer" data-pointer="OPEN">LINKEDIN ↗</a></div></div>
      </div><div className="scene-footer"><span>SÃO PAULO, BRAZIL / 2026</span><a href="#top" data-pointer="TOP">BACK TO THE BEGINNING ↑</a></div>
    </motion.div><motion.div className="end-mark" aria-hidden="true" style={{ opacity: markOpacity }}><span>G</span><span>G</span><i /></motion.div>
  </div></section>;
}

export function MotionFilm() {
  const reduced = useReducedMotion();
  const intro = useSyncExternalStore(subscribeIntro, introSnapshot, () => true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ending, setEnding] = useState(false);
  const [flight, setFlight] = useState<Flight | null>(null);
  const hero = useRef<HTMLElement>(null); const first = useRef<HTMLSpanElement>(null); const second = useRef<HTMLSpanElement>(null); const markA = useRef<HTMLSpanElement>(null); const markB = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end end"] });
  const markOpacity = useTransform(scrollYProgress, (v) => reduced ? 1 : clamp((v - .68) / .18));
  const measure = useCallback(() => {
    const nodes = [first.current, second.current, markA.current, markB.current];
    if (nodes.some((node) => !node)) return;
    const points = nodes.map((node) => { const rect = node!.getBoundingClientRect(); return { x: rect.left, y: rect.top, size: parseFloat(getComputedStyle(node!).fontSize) }; });
    setFlight({ from: [points[0], points[1]], to: [points[2], points[3]] });
  }, []);
  useEffect(() => { if (intro) return; const frame = requestAnimationFrame(measure); const resize = () => requestAnimationFrame(measure); window.addEventListener("resize", resize); return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); }; }, [measure, intro]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActiveIndex(Number(entry.target.getAttribute("data-index"))); }); }, { rootMargin: "-48% 0px -48% 0px" });
    document.querySelectorAll("[data-index]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return <main className={`motion-film${intro ? " is-opening" : ""}`}>
    <Header open={menuOpen} setOpen={setMenuOpen} index={activeIndex} markA={markA} markB={markB} markOpacity={markOpacity} hidden={(!reduced && ending) || menuOpen || intro} />
    <Menu open={menuOpen} setOpen={setMenuOpen} reduced={reduced} />
    <div className="film-content" inert={menuOpen || intro} aria-hidden={menuOpen || intro}>
      <Hero heroRef={hero} first={first} second={second} progress={scrollYProgress} reduced={reduced} />
      {projects.map((project, index) => <ProjectScene key={project.id} project={project} index={index} setIndex={setActiveIndex} reduced={reduced} />)}
      <About reduced={reduced} /><Playground /><Contact reduced={reduced} onEnding={setEnding} />
    </div>
    {!reduced && <><FlyingLetter key={`first-${flight?.from[0].size ?? 0}`} index={0} geometry={flight} progress={scrollYProgress} /><FlyingLetter key={`second-${flight?.from[1].size ?? 0}`} index={1} geometry={flight} progress={scrollYProgress} /><Pointer /></>}
    {intro && <Opening />}
  </main>;
}
