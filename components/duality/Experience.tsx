"use client";
import Image from "next/image";
import { AnimatePresence, motion, MotionConfig, useMotionValue, useSpring, useTransform, useScroll, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { projects, type Project } from "@/content/duality";

import PhotographyWorld from "./PhotographyWorld";
import ProjectIndex from "./ProjectIndex";
import { PhotographyProvider, usePhotography, type PhotographyLibrary } from "./PhotographyProvider";

type World = "select" | "developer" | "photographer";
const ease = [.76, 0, .24, 1] as const;
const number = (n: number) => String(n + 1).padStart(2, "0");
const Arrow = () => <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.4" /></svg>;
function Aperture({ architectural = false }: { architectural?: boolean }) {
  return <div className={`aperture ${architectural ? "architectural" : ""}`} aria-hidden="true">{Array.from({ length: 6 }, (_, i) => <i key={i} style={{ "--i": i } as CSSProperties} />)}<span>GG</span></div>;
}
function Intro({ finish }: { finish: () => void }) {
  useEffect(() => { const t = setTimeout(finish, 3400); return () => clearTimeout(t); }, [finish]);
  return <motion.div className="film-intro" exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: .8, ease }}>
    <motion.div className="origin-line" initial={{ scaleY: 0 }} animate={{ scaleY: [0, .006, 1] }} transition={{ duration: 1.3 }} />
    <div className="intro-territory blue" /><div className="intro-territory warm" /><span className="micro intro-label">A STUDY IN TWO DISCIPLINES</span>
    <h1 aria-label="Gustavo Galeazzi">{["GUSTAVO", "GALEAZZI"].map((word, row) => <span className="intro-word" aria-hidden="true" key={word}>{[...word].map((letter, i) => <motion.span key={i} initial={{ y: "120%", scaleY: 1.6, rotate: row ? -8 : 8 }} animate={{ y: "0%", scaleY: 1, rotate: 0 }} transition={{ duration: 1.1, delay: .3 + i * .04 + row * .1, ease }}>{letter}</motion.span>)}</span>)}</h1>
    <p className="micro intro-caption">TWO WORLDS. ONE CREATIVE MIND.</p><button className="intro-skip micro" onClick={finish}>SKIP INTRO <Arrow /></button>
  </motion.div>;
}
function Selector({ enter }: { enter: (w: World) => void }) {
  const { photographs } = usePhotography();
  const reduced = useReducedMotion();
  const [active, setActive] = useState<World>("select");
  const pressure = useMotionValue(50), spring = useSpring(pressure, { stiffness: 120, damping: 25, mass: .8 });
  const boundary = useTransform(spring, p => `M0 0 H${p / 100 - .03} Q${p / 100 + (p - 50) * .003} .5 ${p / 100 + .03} 1 H0 Z`);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 90, damping: 25 }), sy = useSpring(y, { stiffness: 90, damping: 25 });
  const focus = (w: World) => { setActive(w); const value = w === "developer" ? 66 : w === "photographer" ? 34 : 50; if (reduced) spring.jump(value); pressure.set(value); };
  return <main className="selection" data-active={active} onPointerMove={e => { if (reduced || e.pointerType === "touch") return; const b = e.currentTarget.getBoundingClientRect(); focus((e.clientX - b.left) / b.width < .5 ? "developer" : "photographer"); x.set(((e.clientX - b.left) / b.width - .5) * 30); y.set(((e.clientY - b.top) / b.height - .5) * 24); }} onPointerLeave={() => focus("select")}>
    <h1 className="sr-only">Gustavo Galeazzi. Two worlds. One creative mind.</h1><svg className="clip-definitions" aria-hidden="true"><defs><clipPath id="elastic-world" clipPathUnits="objectBoundingBox"><motion.path d={boundary} /></clipPath></defs></svg><div className="selection-warm" /><motion.div className="selection-blue" style={{ clipPath: "url(#elastic-world)" }} />
    <header className="select-top micro"><span className="wordmark">GG<span>®</span></span><span>GUSTAVO GALEAZZI<br />INDEPENDENT CREATIVE PRACTICE</span><span className="edition">PORTFOLIO<br />DUALITY — 01 / 02</span></header>
    <div className="selection-name" aria-hidden="true"><span>GUSTAVO</span><span>GALEAZZI<span className="name-dot">.</span></span></div>
    <motion.div className="selector-object object-code" style={{ x: reduced ? 0 : sx, y: reduced ? 0 : sy }}><Aperture architectural /></motion.div><motion.div className="selector-object object-frame" style={{ x: reduced ? 0 : sx, y: reduced ? 0 : sy }}>{photographs[0] && <Image src={photographs[0].src} alt="" fill sizes="(max-width:600px) 35vw, 25vw" className="selector-demo-photo" />}<Aperture /></motion.div>
    <p className="select-manifesto micro">TWO WORLDS.<br />ONE CREATIVE MIND.</p>
    <div className="world-choices">{(["developer", "photographer"] as const).map((w, i) => <button key={w} onPointerEnter={() => focus(w)} onFocus={() => focus(w)} onBlur={() => focus("select")} onClick={() => enter(w)} className={`choice ${w}-choice`}><span className="micro">{number(i)} / {i ? "THE WAY I SEE" : "LOGIC IN MOTION"}</span><strong>{i ? "Photographer" : "Developer"}</strong><span className="choice-action micro">ENTER THE WORLD <Arrow /></span></button>)}</div>
    <footer className="select-bottom micro"><span>CODE MEETS COMPOSITION.</span><span>CHOOSE YOUR PERSPECTIVE ↙ ↘</span><span>DUALITY / TWO DISCIPLINES</span></footer>
  </main>;
}
function Magnetic({ children, onClick, label }: { children: ReactNode; onClick: () => void; label?: string }) {
  const reduced = useReducedMotion(), x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 22 }), sy = useSpring(y, { stiffness: 220, damping: 22 });
  return <motion.button aria-label={label} className="magnetic" style={{ x: sx, y: sy }} onPointerMove={e => { if (reduced || e.pointerType === "touch") return; const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * .12); y.set((e.clientY - r.top - r.height / 2) * .12); }} onPointerLeave={() => { x.set(0); y.set(0); }} onClick={onClick}>{children}</motion.button>;
}
function Navigation({ world, enter }: { world: World; enter: (w: World) => void }) {
  return <header className="world-header"><button className="wordmark" onClick={() => enter("select")} aria-label="Return to world selection">GG<span>®</span></button><span className="header-world micro">{world === "developer" ? "01 / DEVELOPER" : "02 / PHOTOGRAPHER"}</span><nav aria-label="Page sections"><a href="#work">WORK</a><a href="#contact">CONTACT</a></nav><Magnetic onClick={() => enter(world === "developer" ? "photographer" : "developer")} label={`Switch to ${world === "developer" ? "photographer" : "developer"}`}><span className="dimension-symbol" aria-hidden="true">◈</span><span className="switch-label">SWITCH WORLD</span><Arrow /></Magnetic></header>;
}
function Artwork({ project, index }: { project: Project; index: number }) {
  return project.image ? <Image src={project.image} alt={`${project.name} project preview`} fill sizes="(max-width: 700px) 94vw, 55vw" /> : <div className={`typographic-art art-${index % 3}`}><span className="micro">{project.discipline}</span><b>{project.name === "ClaudeFy" ? "Cf" : project.name === "LEIA" ? "Aa" : "F/"}</b><span className="micro">TYPOGRAPHIC STUDY / {number(index)}</span><i /><i /><i /></div>;
}
function Overlay({ title, close, children }: { title: string; close: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement, overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; ref.current?.focus();
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") close(); if (e.key !== "Tab") return; const items = ref.current?.querySelectorAll<HTMLElement>('button,a[href],[tabindex="0"]'); if (!items?.length) return; const first = items[0], last = items[items.length - 1]; if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } };
    window.addEventListener("keydown", key); return () => { document.body.style.overflow = overflow; window.removeEventListener("keydown", key); previous?.focus(); };
  }, [close]);
  return <motion.div className="overlay" role="dialog" aria-modal="true" aria-label={title} ref={ref} tabIndex={-1} initial={reduced ? false : { clipPath: "inset(100% 0 0)" }} animate={{ clipPath: "inset(0)" }} exit={{ clipPath: "inset(0 0 100%)" }} transition={{ duration: reduced ? 0 : .6, ease }}><header><span className="micro">{title}</span><button onClick={close}>CLOSE <span aria-hidden="true">×</span></button></header>{children}</motion.div>;
}
function Developer() {
  const [selected, setSelected] = useState<number | null>(null), close = useCallback(() => setSelected(null), [setSelected]);
  const ref = useRef<HTMLElement>(null), reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]), rotate = useTransform(scrollYProgress, [0, 1], [0, 35]);
  return <><section ref={ref} className="dev-opening"><div className="hero-kicker micro"><span>THE INTERSECTION OF<br />IDEAS & EXECUTION.</span><span>WORLD 01<br />CREATIVE DEVELOPMENT</span></div><motion.h1 style={{ y: reduced ? 0 : y }}>I BUILD<br /><span>WHAT I</span><br />IMAGINE<span className="punctuation">.</span></motion.h1><motion.div className="hero-aperture" style={{ rotate: reduced ? 0 : rotate }}><Aperture architectural /></motion.div><div className="hero-foot micro"><span>GUSTAVO GALEAZZI</span><a href="#work">SCROLL TO DISCOVER ↓</a><span>CODE / FORM / FUNCTION</span></div></section><ProjectIndex open={setSelected} artwork={(project, index) => <Artwork project={project} index={index} />} /><section className="about-scene"><span className="micro">02 — THE MIND BEHIND THE WORK</span><h2>CREATING<br /><em>WHAT’S NEXT.</em></h2><p>I build interfaces, tools and digital systems. I care about clear structure, useful detail and ideas that reward a closer look.</p><span className="about-signature">Gustavo Galeazzi</span></section><Contact photo={false} /><AnimatePresence>{selected !== null && <Overlay title={`${number(selected)} / ${projects[selected].name}`} close={close}><motion.div className="detail-art" layoutId={`art-${selected}`}><Artwork project={projects[selected]} index={selected} /></motion.div><div className="detail-copy"><h2>{projects[selected].name}</h2><div><span className="micro">{projects[selected].discipline}</span><p>{projects[selected].description}</p><div className="detail-links">{projects[selected].source && <a className="line-link" href={projects[selected].source} target="_blank" rel="noreferrer">SOURCE CODE <Arrow /></a>}{projects[selected].live && <a className="line-link" href={projects[selected].live} target="_blank" rel="noreferrer">VISIT PROJECT <Arrow /></a>}</div></div></div></Overlay>}</AnimatePresence></>;
}
function Contact({ photo }: { photo: boolean }) {
  return <section className="contact-scene" id="contact"><span className="micro">{photo ? "02" : "03"} — CONTINUE THE CONVERSATION</span><h2>{photo ? <>EVERY FRAME<br /><em>TELLS SOMETHING.</em></> : <>LET’S BUILD<br /><em>SOMETHING NEW.</em></>}</h2><a className="contact-link" href="mailto:gustavosgaleazzi@gmail.com">gustavosgaleazzi@gmail.com<Arrow /></a><footer className="micro"><span>GUSTAVO GALEAZZI</span><span>TWO WORLDS. ONE CREATIVE MIND.</span><a href="https://skiper-ui.com" target="_blank" rel="noreferrer">COMPONENTS BY SKIPER UI</a><a href="#top">BACK TO TOP ↑</a></footer></section>;
}
function Cursor() {
  const [label, setLabel] = useState(""); const x = useMotionValue(-100), y = useMotionValue(-100);
  useEffect(() => { const move = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); const target = e.target as HTMLElement; setLabel(target.closest('.exhibit-image') ? "EXPLORE" : target.closest('.photo-item') ? "VIEW" : ""); }; window.addEventListener("pointermove", move); return () => window.removeEventListener("pointermove", move); }, [x, y]);
  return <motion.div className={`context-cursor ${label ? "visible" : ""}`} style={{ x, y }} aria-hidden="true">{label}</motion.div>;
}
export default function Experience({ library }: { library: PhotographyLibrary }) {
  const [world, setWorld] = useState<World>("select"), [intro, setIntro] = useState(false), [transition, setTransition] = useState<World | null>(null), [phase, setPhase] = useState("cover");
  const reduced = useReducedMotion(), positions = useRef<Record<World, number>>({ select: 0, developer: 0, photographer: 0 }), timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finish = useCallback(() => { setIntro(false); try { sessionStorage.setItem("duality-v2-intro", "seen"); } catch {} }, []);
  useEffect(() => { const t = setTimeout(() => { try { if (!sessionStorage.getItem("duality-v2-intro") && !matchMedia("(prefers-reduced-motion: reduce)").matches) setIntro(true); } catch {} }, 0); return () => clearTimeout(t); }, []);
  const enter = useCallback((target: World, history = true) => { if (target === world || transition) return; positions.current[world] = window.scrollY; const resolve = () => { setWorld(target); if (history) window.history.pushState({ world: target }, "", target === "select" ? "/" : `?world=${target}`); requestAnimationFrame(() => window.scrollTo({ top: positions.current[target], behavior: "instant" })); }; if (reduced) { resolve(); return; } setPhase("cover"); setTransition(target); timer.current = setTimeout(() => { resolve(); setPhase("reveal"); timer.current = setTimeout(() => setTransition(null), 700); }, 700); }, [world, transition, reduced]);
  useEffect(() => { const requested = new URLSearchParams(location.search).get("world"); if (requested === "developer" || requested === "photographer") { const t = setTimeout(() => setWorld(requested), 0); return () => clearTimeout(t); } }, []);
  useEffect(() => { const back = () => { const target = new URLSearchParams(location.search).get("world"); enter(target === "developer" || target === "photographer" ? target : "select", false); }; window.addEventListener("popstate", back); return () => window.removeEventListener("popstate", back); }, [enter]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const hasNavigated = useRef(false);
  useEffect(() => {
    if (world !== "select" || transition) hasNavigated.current = true;
    if (!hasNavigated.current || transition || intro) return;
    const frame = requestAnimationFrame(() => document.querySelector<HTMLElement>(world === "select" ? ".choice" : ".world-header button")?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [world, transition, intro]);
  useEffect(() => { if (!transition && !intro) return; const previous = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = previous; }; }, [transition, intro]);
  return <PhotographyProvider library={library}><MotionConfig reducedMotion="user"><div className={`duality world-${world}`} id="top"><a className="skip-link" href={world === "select" ? "#world-selection" : "#work"}>Skip to content</a><div inert={intro || !!transition} aria-hidden={intro || !!transition}>{world === "select" ? <div id="world-selection" tabIndex={-1}><Selector enter={enter} /></div> : <><Navigation world={world} enter={enter} /><main>{world === "developer" ? <Developer /> : <PhotographyWorld />}</main></>}</div><AnimatePresence>{intro && <Intro finish={finish} />}</AnimatePresence><AnimatePresence>{transition && <motion.div className={`dimension-transition to-${transition}`} key={transition} initial={{ clipPath: transition === "photographer" ? "inset(48% 50% 48% 50%)" : "inset(0 100% 0 0)" }} animate={{ clipPath: phase === "cover" ? "inset(0 0% 0 0%)" : transition === "photographer" ? "inset(0 0 0 100%)" : "inset(0 0 100% 0)" }} transition={{ duration: .7, ease }}><Aperture architectural={transition !== "photographer"} /><span className="micro">{transition === "select" ? "TWO WORLDS. ONE CREATIVE MIND." : transition === "developer" ? "01 / DEVELOPER" : "02 / PHOTOGRAPHER"}</span></motion.div>}</AnimatePresence><Cursor /></div></MotionConfig></PhotographyProvider>;
}

