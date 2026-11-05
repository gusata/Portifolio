"use client";
import Image from "next/image";
import { AnimatePresence, motion, MotionConfig, useMotionValue, useSpring, useTransform, useScroll, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { projects, type Project } from "@/content/duality";
import { useLanguage } from "@/components/LanguageProvider";
import { acquireBodyScrollLock } from "@/lib/body-scroll-lock";

import PhotographyWorld from "./PhotographyWorld";
import ProjectIndex from "./ProjectIndex";
import { PhotographyProvider, usePhotography, type PhotographyLibrary } from "./PhotographyProvider";
import { dualityCopy } from "./locale";

type World = "select" | "developer" | "photographer";
const ease = [.76, 0, .24, 1] as const;
const number = (n: number) => String(n + 1).padStart(2, "0");
const Arrow = () => <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.4" /></svg>;
function Aperture({ architectural = false }: { architectural?: boolean }) {
  return <div className={`aperture ${architectural ? "architectural" : ""}`} aria-hidden="true">{Array.from({ length: 6 }, (_, i) => <i key={i} style={{ "--i": i } as CSSProperties} />)}<span>GG</span></div>;
}
function Intro({ finish }: { finish: () => void }) {
  const { language } = useLanguage();
  const copy = dualityCopy[language === "en" ? "en" : "pt"];
  useEffect(() => { const t = setTimeout(finish, 3400); return () => clearTimeout(t); }, [finish]);
  return <motion.div className="film-intro" exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: .8, ease }}>
    <motion.div className="origin-line" initial={{ scaleY: 0 }} animate={{ scaleY: [0, .006, 1] }} transition={{ duration: 1.3 }} />
    <div className="intro-territory blue" /><div className="intro-territory warm" /><span className="micro intro-label">{copy.intro.label}</span>
    <h1 aria-label="Gustavo Galeazzi">{["GUSTAVO", "GALEAZZI"].map((word, row) => <span className="intro-word" aria-hidden="true" key={word}>{[...word].map((letter, i) => <motion.span key={i} initial={{ y: "120%", scaleY: 1.6, rotate: row ? -8 : 8 }} animate={{ y: "0%", scaleY: 1, rotate: 0 }} transition={{ duration: 1.1, delay: .3 + i * .04 + row * .1, ease }}>{letter}</motion.span>)}</span>)}</h1>
    <p className="micro intro-caption">{copy.intro.caption}</p><button className="intro-skip micro" onClick={finish}>{copy.intro.skip} <Arrow /></button>
  </motion.div>;
}
function Selector({ enter }: { enter: (w: World) => void }) {
  const { photographs } = usePhotography();
  const { language } = useLanguage();
  const copy = dualityCopy[language === "en" ? "en" : "pt"];
  const reduced = useReducedMotion();
  const [active, setActive] = useState<World>("select");
  const pressure = useMotionValue(50), spring = useSpring(pressure, { stiffness: 120, damping: 25, mass: .8 });
  const boundary = useTransform(spring, p => `M0 0 H${p / 100 - .03} Q${p / 100 + (p - 50) * .003} .5 ${p / 100 + .03} 1 H0 Z`);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 90, damping: 25 }), sy = useSpring(y, { stiffness: 90, damping: 25 });
  const focus = (w: World) => { setActive(w); const value = w === "developer" ? 66 : w === "photographer" ? 34 : 50; if (reduced) spring.jump(value); pressure.set(value); };
  return <main className="selection" data-active={active} onPointerMove={e => { if (reduced || e.pointerType === "touch") return; const b = e.currentTarget.getBoundingClientRect(); focus((e.clientX - b.left) / b.width < .5 ? "developer" : "photographer"); x.set(((e.clientX - b.left) / b.width - .5) * 30); y.set(((e.clientY - b.top) / b.height - .5) * 24); }} onPointerLeave={() => focus("select")}>
    <h1 className="sr-only">{copy.selector.heading}</h1><svg className="clip-definitions" aria-hidden="true"><defs><clipPath id="elastic-world" clipPathUnits="objectBoundingBox"><motion.path d={boundary} /></clipPath></defs></svg><div className="selection-warm" /><motion.div className="selection-blue" style={{ clipPath: "url(#elastic-world)" }} />
    <header className="select-top micro"><span className="wordmark">GG<span>®</span></span><span>GUSTAVO GALEAZZI<br />{copy.selector.practice}</span><span className="edition">{copy.selector.portfolio}<br />DUALITY — 01 / 02</span></header>
    <div className="selection-name" aria-hidden="true"><span>GUSTAVO</span><span>GALEAZZI<span className="name-dot">.</span></span></div>
    <motion.div className="selector-object object-code" style={{ x: reduced ? 0 : sx, y: reduced ? 0 : sy }}><Aperture architectural /></motion.div><motion.div className="selector-object object-frame" style={{ x: reduced ? 0 : sx, y: reduced ? 0 : sy }}>{photographs[0] && <Image src={photographs[0].src} alt="" fill sizes="(max-width:600px) 35vw, 25vw" className="selector-demo-photo" />}<Aperture /></motion.div>
    <p className="select-manifesto micro">{copy.selector.manifesto.split("\n").map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</p>
    <div className="world-choices">{(["developer", "photographer"] as const).map((w, i) => <button key={w} onPointerEnter={() => focus(w)} onFocus={() => focus(w)} onBlur={() => focus("select")} onClick={() => enter(w)} className={`choice ${w}-choice`}><span className="micro">{number(i)} / {i ? copy.selector.photographerKicker : copy.selector.developerKicker}</span><strong>{i ? copy.selector.photographer : copy.selector.developer}</strong><span className="choice-action micro">{copy.selector.enter} <Arrow /></span></button>)}</div>
    <footer className="select-bottom micro"><span>{copy.selector.footer}</span><span>{copy.selector.choose} ↙ ↘</span><span>{copy.selector.disciplines}</span></footer>
  </main>;
}
function Magnetic({ children, onClick, label }: { children: ReactNode; onClick: () => void; label?: string }) {
  const reduced = useReducedMotion(), x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 22 }), sy = useSpring(y, { stiffness: 220, damping: 22 });
  return <motion.button aria-label={label} className="magnetic" style={{ x: sx, y: sy }} onPointerMove={e => { if (reduced || e.pointerType === "touch") return; const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * .12); y.set((e.clientY - r.top - r.height / 2) * .12); }} onPointerLeave={() => { x.set(0); y.set(0); }} onClick={onClick}>{children}</motion.button>;
}
function Navigation({ world, enter }: { world: World; enter: (w: World) => void }) {
  const { language, setLanguage } = useLanguage();
  const copy = dualityCopy[language === "en" ? "en" : "pt"];
  const activeLanguage = language === "en" ? "en" : "pt";
  return <header className="world-header"><button className="wordmark" onClick={() => enter("select")} aria-label={copy.nav.return}>GG<span>®</span></button><span className="header-world micro">{world === "developer" ? copy.nav.developer : copy.nav.photographer}</span><nav aria-label={language === "en" ? "Page sections" : "Seções da página"}><a href="#work">{copy.nav.work}</a><a href="#contact">{copy.nav.contact}</a></nav><div className="language-switch" role="group" aria-label={copy.languageLabel}>{(["pt", "en"] as const).map(option => <button key={option} type="button" aria-pressed={activeLanguage === option} onClick={() => setLanguage(option)}>{option.toUpperCase()}</button>)}</div><Magnetic onClick={() => enter(world === "developer" ? "photographer" : "developer")} label={world === "developer" ? copy.nav.switchToPhotographer : copy.nav.switchToDeveloper}><span className="dimension-symbol" aria-hidden="true">◈</span><span className="switch-label">{copy.nav.switchWorld}</span><Arrow /></Magnetic></header>;
}
function Artwork({ project, index }: { project: Project; index: number }) {
  const { language } = useLanguage();
  const copy = dualityCopy[language === "en" ? "en" : "pt"];
  const discipline = language === "en" ? project.discipline : project.disciplinePt ?? project.discipline;
  const flow = language === "en" ? project.flow ?? [] : project.flowPt ?? project.flow ?? [];
  if (project.image) {
    return <Image src={project.image} alt={language === "en" ? project.imageAlt ?? `${project.name} project interface` : project.imageAltPt ?? project.imageAlt ?? `${project.name} interface do projeto`} fill sizes="(max-width: 700px) 94vw, 55vw" quality={88} />;
  }

  return <div className={`project-study project-study-${index % 3}`} role="img" aria-label={copy.caseStudy.imageLabel(project.name, flow)}>
    <div className="project-study-grid" aria-hidden="true" />
    <div className="project-study-top micro" aria-hidden="true"><span>{copy.caseStudy.visualStudy}</span><span>{number(index)} — {discipline}</span></div>
    <ol className="project-study-flow" style={{ "--flow-count": flow.length } as CSSProperties} aria-hidden="true">
      {flow.map((step, stepIndex) => <li key={step}><span>{number(stepIndex)}</span><b>{step}</b></li>)}
    </ol>
    <div className="project-study-bottom micro" aria-hidden="true"><span>{project.name}</span><span>{flow[0]} <i>→</i> {flow[flow.length - 1]}</span></div>
  </div>;
}

function ProjectCaseStudy({ project, index, onNext }: { project: Project; index: number; onNext: () => void }) {
  const { language } = useLanguage();
  const copy = dualityCopy[language === "en" ? "en" : "pt"];
  const discipline = language === "en" ? project.discipline : project.disciplinePt ?? project.discipline;
  const description = language === "en" ? project.description : project.descriptionPt ?? project.description;
  const flow = language === "en" ? project.flow ?? [] : project.flowPt ?? project.flow ?? [];
  return <article className="case-study">
    <div className="case-study-kicker micro"><span>{copy.caseStudy.selectedWork} / {number(index)}</span><span>{discipline}</span></div>
    <div className="case-study-intro"><h2>{project.name}</h2><p>{description}</p></div>
    <figure className="case-study-figure">
      <motion.div className="case-study-art" layoutId={`art-${index}`}><Artwork project={project} index={index} /></motion.div>
      <figcaption className="case-study-caption micro"><span>{project.image ? (language === "en" ? project.imageCaption ?? copy.caseStudy.productScreen : project.imageCaptionPt ?? copy.caseStudy.productScreen) : copy.caseStudy.processStudy}</span><span>{number(index)} / {String(projects.length).padStart(2, "0")}</span></figcaption>
    </figure>
    <div className="case-study-meta">
      <div><span className="micro">{copy.caseStudy.discipline}</span><strong>{discipline}</strong></div>
      {flow.length > 0 && <div><span className="micro">{copy.caseStudy.flow}</span><strong>{flow[0]} <i aria-hidden="true">→</i> {flow[flow.length - 1]}</strong></div>}
      {project.stack?.length ? <div className="case-study-stack"><span className="micro">{copy.caseStudy.technologies}</span><ul>{project.stack.map(item => <li key={item}>{item}</li>)}</ul></div> : null}
    </div>
    {flow.length > 0 && <section className="case-study-flow" aria-labelledby={`flow-title-${index}`}>
      <div className="case-study-section-head"><span className="micro">{copy.caseStudy.howItWorks}</span><h3 id={`flow-title-${index}`}>{copy.caseStudy.projectFlow}</h3></div>
      <ol>{flow.map((step, stepIndex) => <li key={step}><span className="micro">{number(stepIndex)}</span><strong>{step}</strong>{stepIndex < flow.length - 1 && <span className="case-flow-arrow" aria-hidden="true">↓</span>}</li>)}</ol>
    </section>}
    <footer className="case-study-footer">
      <div className="case-study-actions"><span className="micro">{copy.caseStudy.explore}</span>
        {project.live && <a className="case-study-link case-study-link-primary" href={project.live} target="_blank" rel="noreferrer">{copy.caseStudy.openLive} <Arrow /></a>}
        {project.source && <a className="case-study-link" href={project.source} target="_blank" rel="noreferrer">{copy.caseStudy.source} <Arrow /></a>}
        {!project.live && !project.source && <a className="case-study-link" href={`mailto:gustavosgaleazzi@gmail.com?subject=${encodeURIComponent(`${language === "en" ? "About" : "Sobre"} ${project.name}`)}`}>{copy.caseStudy.ask} <Arrow /></a>}
      </div>
      <button className="case-study-next" type="button" onClick={onNext}><span className="micro">{copy.caseStudy.next}</span><strong>{projects[(index + 1) % projects.length].name}</strong><Arrow /></button>
    </footer>
  </article>;
}
function Overlay({ title, close, children }: { title: string; close: () => void; children: ReactNode }) {
  const { language } = useLanguage();
  const copy = dualityCopy[language === "en" ? "en" : "pt"];
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const releaseScrollLock = acquireBodyScrollLock();
    ref.current?.focus();
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") close(); if (e.key !== "Tab") return; const items = ref.current?.querySelectorAll<HTMLElement>('button,a[href],[tabindex="0"]'); if (!items?.length) return; const first = items[0], last = items[items.length - 1]; if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } };
    window.addEventListener("keydown", key); return () => { releaseScrollLock(); window.removeEventListener("keydown", key); previous?.focus(); };
  }, [close]);
  return <motion.div className="overlay" role="dialog" aria-modal="true" aria-label={title} ref={ref} tabIndex={-1} initial={reduced ? false : { clipPath: "inset(100% 0 0)" }} animate={{ clipPath: "inset(0)" }} exit={{ clipPath: "inset(0 0 100%)" }} transition={{ duration: reduced ? 0 : .6, ease }}><header><span className="micro">{title}</span><button onClick={close}>{copy.caseStudy.close} <span aria-hidden="true">×</span></button></header>{children}</motion.div>;
}
function Developer() {
  const { language } = useLanguage();
  const copy = dualityCopy[language === "en" ? "en" : "pt"];
  const [selected, setSelected] = useState<number | null>(null), close = useCallback(() => setSelected(null), [setSelected]);
  const ref = useRef<HTMLElement>(null), reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]), rotate = useTransform(scrollYProgress, [0, 1], [0, 35]);
  return <><section ref={ref} className="dev-opening"><div className="hero-kicker micro"><span>{copy.developer.kicker}</span><span>{copy.developer.world}</span></div><motion.h1 style={{ y: reduced ? 0 : y }}>{copy.developer.titleStart}<br /><span>{copy.developer.titleMiddle}</span><br />{copy.developer.titleEnd}<span className="punctuation">.</span></motion.h1><motion.div className="hero-aperture" style={{ rotate: reduced ? 0 : rotate }}><Aperture architectural /></motion.div><div className="hero-foot micro"><span>GUSTAVO GALEAZZI</span><a href="#work">{copy.developer.scroll} ↓</a><span>{copy.developer.discipline}</span></div></section><ProjectIndex open={setSelected} /><section className="about-scene"><span className="micro">{copy.developer.aboutEyebrow}</span><h2>{copy.developer.aboutStart}<br /><em>{copy.developer.aboutEnd}</em></h2><p>{copy.developer.about}</p><span className="about-signature">Gustavo Galeazzi</span></section><Contact photo={false} /><AnimatePresence>{selected !== null && <Overlay title={`${number(selected)} / ${projects[selected].name}`} close={close}><ProjectCaseStudy project={projects[selected]} index={selected} onNext={() => setSelected(index => ((index ?? 0) + 1) % projects.length)} /></Overlay>}</AnimatePresence></>;
}
function Contact({ photo }: { photo: boolean }) {
  const { language } = useLanguage();
  const copy = dualityCopy[language === "en" ? "en" : "pt"];
  const eyebrow = photo ? `02 — ${copy.photography.contactEyebrow}` : copy.contact.eyebrow;
  const headingStart = photo ? copy.photography.contactStart : copy.contact.start;
  const headingEnd = photo ? copy.photography.contactEnd : copy.contact.end;
  return <section className="contact-scene" id="contact"><span className="micro">{eyebrow}</span><h2>{headingStart}<br /><em>{headingEnd}</em></h2><a className="contact-link" href="mailto:gustavosgaleazzi@gmail.com">gustavosgaleazzi@gmail.com<Arrow /></a><footer className="micro"><span>GUSTAVO GALEAZZI</span><span>{copy.contact.motto}</span><a href="https://skiper-ui.com" target="_blank" rel="noreferrer">{copy.contact.credits}</a><a href="#top">{copy.contact.backToTop} ↑</a></footer></section>;
}
function Cursor() {
  const { language } = useLanguage();
  const copy = dualityCopy[language === "en" ? "en" : "pt"];
  const [label, setLabel] = useState(""); const x = useMotionValue(-100), y = useMotionValue(-100);
  useEffect(() => { const move = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); const target = e.target as HTMLElement; setLabel(target.closest('.exhibit-image') ? copy.cursor.explore : target.closest('.photo-item') ? copy.cursor.view : ""); }; window.addEventListener("pointermove", move); return () => window.removeEventListener("pointermove", move); }, [copy.cursor.explore, copy.cursor.view, x, y]);
  return <motion.div className={`context-cursor ${label ? "visible" : ""}`} style={{ x, y }} aria-hidden="true">{label}</motion.div>;
}
export default function Experience({ library }: { library: PhotographyLibrary }) {
  const { language } = useLanguage();
  const copy = dualityCopy[language === "en" ? "en" : "pt"];
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
  useEffect(() => { if (!transition && !intro) return; return acquireBodyScrollLock(); }, [transition, intro]);
  return <PhotographyProvider library={library}><MotionConfig reducedMotion="user"><div className={`duality world-${world}`} id="top"><a className="skip-link" href={world === "select" ? "#world-selection" : "#work"}>{copy.skipToContent}</a><div inert={intro || !!transition} aria-hidden={intro || !!transition}>{world === "select" ? <div id="world-selection" tabIndex={-1}><Selector enter={enter} /></div> : <><Navigation world={world} enter={enter} /><main>{world === "developer" ? <Developer /> : <PhotographyWorld />}</main></>}</div><AnimatePresence>{intro && <Intro finish={finish} />}</AnimatePresence><AnimatePresence>{transition && <motion.div className={`dimension-transition to-${transition}`} key={transition} initial={{ clipPath: transition === "photographer" ? "inset(48% 50% 48% 50%)" : "inset(0 100% 0 0)" }} animate={{ clipPath: phase === "cover" ? "inset(0 0% 0 0%)" : transition === "photographer" ? "inset(0 0 0 100%)" : "inset(0 0 100% 0)" }} transition={{ duration: .7, ease }}><Aperture architectural={transition !== "photographer"} /><span className="micro">{transition === "select" ? copy.selector.footer : transition === "developer" ? copy.nav.developer : copy.nav.photographer}</span></motion.div>}</AnimatePresence><Cursor /></div></MotionConfig></PhotographyProvider>;
}

