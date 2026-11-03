"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

const projects = [
  {
    id: "claudefy",
    number: "01",
    name: "Claudefy",
    type: "WINDOWS UTILITY / AI TOOLING",
    description: "A Windows utility for live Claude Code token usage, session limits, and plan progress through native notifications.",
    stack: "PYTHON / POWERSHELL / WINDOWS API",
    href: "https://github.com/gusata/ClaudeFy",
    visual: "claudefy",
  },
  {
    id: "leia",
    number: "02",
    name: "LEIA",
    type: "AI / CODE DOCUMENTATION",
    description: "An AI-powered documentation engine that analyzes a codebase and generates project documentation.",
    stack: "JAVASCRIPT / HTML / CSS",
    href: "https://github.com/gusata/LEIA",
    visual: "leia",
  },
  {
    id: "bob",
    number: "03",
    name: "Bob",
    type: "PRODUCT / BROWSER START PAGE",
    description: "A minimal browser start page with local notes and text shortcuts. Your data stays on your device.",
    stack: "REACT / TYPESCRIPT / VITE / TAILWIND",
    href: "https://github.com/gusata/Bob",
    live: "https://bob-webpage.vercel.app/",
    visual: "bob",
  },
  {
    id: "blitz",
    number: "04",
    name: "Blitz",
    type: "PRODUCT / DOCUMENT OCR",
    description: "An AI-assisted OCR workflow to read documents and send their information into a system.",
    stack: "TYPESCRIPT",
    href: "#",
    visual: "blitz",
  },
] as const;

const menuItems = [
  { number: "01", label: "WORK", href: "#work" },
  { number: "02", label: "ABOUT", href: "#about" },
  { number: "03", label: "PLAY", href: "#play" },
  { number: "04", label: "CONTACT", href: "#contact" },
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg aria-hidden="true" className="arrow-icon" viewBox="0 0 24 24" fill="none">
      {diagonal ? <path d="M6 18 18 6M8 6h10v10" stroke="currentColor" strokeWidth="1.5" /> : <path d="M3 12h17m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" />}
    </svg>
  );
}

function IntroSequence({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onFinish, 2500);
    return () => window.clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      className="intro-sequence"
      initial={{ clipPath: "inset(0 0 0 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.82, ease: [0.76, 0, 0.24, 1] }}
      aria-label="Gustavo Galeazzi portfolio introduction"
    >
      <div className="intro-grain" aria-hidden="true" />
      <div className="intro-register" aria-hidden="true"><span>GG / 001</span><span>INDEPENDENT DIGITAL PRACTICE</span></div>
      <motion.div className="intro-point" initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.7, 1], opacity: [0, 1, 0.65] }} transition={{ duration: 0.9, times: [0, 0.35, 1], ease: [0.16, 1, 0.3, 1] }} />
      <div className="intro-crosshair" aria-hidden="true"><i /><i /><span /></div>
      <div className="intro-caption intro-caption--left">A STUDY IN<br />FORM & MOTION</div>
      <div className="intro-caption intro-caption--right">SOUND OFF<br />/ EXPERIENCE ON</div>
      <div className="intro-name-lockup">
        <p className="intro-overline">CREATIVE DEVELOPER / DIGITAL MAKER</p>
        <h2 className="intro-name intro-name--first" aria-label="Gustavo">
          {"GUSTAVO".split("").map((letter, index) => <span key={`${letter}-${index}`} style={{ animationDelay: `${0.38 + index * 0.045}s` }}>{letter}</span>)}
        </h2>
        <h2 className="intro-name intro-name--last" aria-label="Galeazzi">
          {"GALEAZZI".split("").map((letter, index) => <span key={`${letter}-${index}`} style={{ animationDelay: `${0.64 + index * 0.045}s` }}>{letter}</span>)}
        </h2>
      </div>
      <div className="intro-seam" aria-hidden="true" />
      <div className="intro-bottomline" aria-hidden="true"><span>GUSTAVO GALEAZZI</span><span>DESIGN / CODE / INTERACTION</span><span>2026</span></div>
      <button className="intro-skip" onClick={onFinish}>SKIP INTRO <span>↗</span></button>
    </motion.div>
  );
}

function MagneticLink({ href, children, className = "", label, external = false }: {
  href: string;
  children: ReactNode;
  className?: string;
  label?: string;
  external?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 180, damping: 18, mass: 0.25 });
  const y = useSpring(rawY, { stiffness: 180, damping: 18, mass: 0.25 });

  const move = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (reduceMotion || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    rawX.set((event.clientX - rect.left - rect.width / 2) * 0.14);
    rawY.set((event.clientY - rect.top - rect.height / 2) * 0.14);
  };

  const reset = () => { rawX.set(0); rawY.set(0); };

  return (
    <motion.a
      href={href}
      className={className}
      style={{ x, y }}
      onPointerMove={move}
      onPointerLeave={reset}
      data-cursor={label ?? "link"}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      {children}
    </motion.a>
  );
}

function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const cursor = ref.current;
    if (!cursor) return;
    let frame = 0;
    let x = -100;
    let y = -100;
    const move = (event: globalThis.PointerEvent) => {
      if (event.pointerType === "touch") return;
      x = event.clientX;
      y = event.clientY;
      if (!frame) {
        frame = window.requestAnimationFrame(() => {
          cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          cursor.classList.add("cursor-visible");
          frame = 0;
        });
      }
    };
    const inspect = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const interactive = target.closest<HTMLElement>("[data-cursor]");
      cursor.dataset.mode = interactive?.dataset.cursor ?? "default";
      cursor.dataset.label = interactive?.dataset.cursor === "view" ? "VIEW" : interactive?.dataset.cursor === "drag" ? "DRAG" : "";
    };
    const leave = () => cursor.classList.remove("cursor-visible");
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerover", inspect);
    document.addEventListener("pointerout", inspect);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", inspect);
      document.removeEventListener("pointerout", inspect);
      document.documentElement.removeEventListener("pointerleave", leave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  return <div ref={ref} className="custom-cursor" aria-hidden="true"><span /></div>;
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <>
      <header className="top-nav">
        <a className="nav-brand" href="#top" aria-label="Gustavo Galeazzi, back to top" data-cursor="link"><span>G</span><i>G</i><b>.</b></a>
        <div className="nav-status"><span className="availability-dot" /> OPEN TO WHAT&apos;S NEXT</div>
        <button className={`menu-trigger${open ? " menu-trigger--open" : ""}`} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="full-menu" aria-label={open ? "Close navigation" : "Open navigation"} data-cursor="link">
          <span>{open ? "CLOSE" : "MENU"}</span><i><b /><b /></i>
        </button>
      </header>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="full-menu"
            className="full-menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduceMotion ? 0 : 0.62, ease: [0.76, 0, 0.24, 1] }}
            aria-label="Main navigation"
          >
            <div className="menu-head"><span>GUSTAVO GALEAZZI / INDEX</span><span>SCROLL IS A TIMELINE</span></div>
            <div className="menu-list">
              {menuItems.map((item, index) => (
                <motion.a key={item.href} href={item.href} onClick={() => setOpen(false)} data-cursor="link" initial={reduceMotion ? false : { opacity: 0, x: -42 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduceMotion ? 0 : index * 0.075, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
                  <span className="menu-number">{item.number}</span><span className="menu-label">{item.label}</span><Arrow diagonal />
                </motion.a>
              ))}
            </div>
            <div className="menu-foot"><span>DESIGN / CODE / INTERACTION</span><span>SAO PAULO, BRAZIL</span></div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

function Sculpture({ variant }: { variant: "hero" | "play" }) {
  const reduceMotion = useReducedMotion();
  const rawX = useMotionValue(variant === "hero" ? -7 : 0);
  const rawY = useMotionValue(variant === "hero" ? 0 : -4);
  const rotateX = useSpring(rawX, { stiffness: 95, damping: 22, mass: 0.55 });
  const rotateY = useSpring(rawY, { stiffness: 95, damping: 22, mass: 0.55 });
  const [dragging, setDragging] = useState(false);

  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType === "touch" || dragging) return;
    const rect = event.currentTarget.getBoundingClientRect();
    rawX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 18);
    rawY.set(((event.clientX - rect.left) / rect.width - 0.5) * 24);
  };
  const reset = () => {
    if (!dragging) {
      rawX.set(variant === "hero" ? -7 : 0);
      rawY.set(variant === "hero" ? 0 : -4);
    }
  };

  return (
    <div className={`sculpture-zone sculpture-zone--${variant}${dragging ? " is-dragging" : ""}`} onPointerMove={move} onPointerLeave={reset} role="group" aria-label="Interactive chrome sculpture. Drag to change its angle." data-cursor="drag">
      <motion.div
        className="sculpture-object"
        drag
        dragConstraints={{ left: variant === "hero" ? -42 : -112, right: variant === "hero" ? 42 : 112, top: variant === "hero" ? -42 : -94, bottom: variant === "hero" ? 42 : 94 }}
        dragElastic={0.14}
        dragMomentum={false}
        dragSnapToOrigin
        onDragStart={() => setDragging(true)}
        onDragEnd={() => setDragging(false)}
        style={{ rotateX, rotateY, transformPerspective: 1200, touchAction: "none" }}
        animate={reduceMotion ? undefined : { y: [0, -10, 0], rotateZ: [-2, 2, -2] }}
        transition={{ duration: variant === "hero" ? 8 : 9, repeat: Infinity, ease: "easeInOut" }}
        whileDrag={{ scale: 1.06, cursor: "grabbing" }}
      >
        <Image src="/signature-sculpture.png" alt="" fill sizes={variant === "hero" ? "(max-width: 760px) 80vw, 45vw" : "(max-width: 760px) 85vw, 52vw"} priority={variant === "hero"} draggable={false} className="sculpture-image" />
        <span className="sculpture-light" />
      </motion.div>
      <span className="sculpture-orbit sculpture-orbit--one" aria-hidden="true" />
      <span className="sculpture-orbit sculpture-orbit--two" aria-hidden="true" />
      <span className="sculpture-coordinates" aria-hidden="true">GG—01<br />KINETIC FORM</span>
      {variant === "play" && <div className="sculpture-controls"><button type="button" onClick={() => rawY.set(rawY.get() - 18)} aria-label="Rotate sculpture left">TURN ↶</button><button type="button" onClick={() => rawY.set(rawY.get() + 18)} aria-label="Rotate sculpture right">TURN ↷</button><span>DRAG TO RECOMPOSE</span></div>}
    </div>
  );
}

function ProjectArtwork({ project }: { project: (typeof projects)[number] }) {
  if (project.visual === "claudefy") {
    return (
      <div className="artwork artwork--claudefy" aria-label="Abstract ClaudeFy usage monitor interface">
        <div className="mini-window mini-window--claudefy">
          <div className="mini-window-top"><span className="mini-mark">C.</span><span>CLAUDEFY / SESSION MONITOR</span><span className="mini-live"><i /> RUNNING</span></div>
          <div className="claude-workspace">
            <div className="claude-side"><span>OVERVIEW</span><i /><i /><i /><span className="claude-side-active">SESSIONS</span><i /><i /></div>
            <div className="claude-main"><p>CLAUDE CODE <span>LOCAL SESSION</span></p><h4>Usage, in context.</h4><div className="claude-bar-label"><span>TOKEN WINDOW</span><span>LIVE</span></div><div className="claude-bar"><i /></div><div className="claude-chart"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="claude-footer"><span>PLAN PROGRESS</span><span>SESSION LIMITS</span><span>NATIVE ALERTS</span></div></div>
          </div>
        </div>
        <span className="artwork-index">LOCAL / 01</span>
      </div>
    );
  }

  if (project.visual === "leia") {
    return (
      <div className="artwork artwork--leia" aria-label="Abstract LEIA code documentation interface">
        <div className="leia-sheet">
          <div className="leia-ruler"><span>LEIA / DOCUMENTATION ENGINE</span><span>CODEBASE → KNOWLEDGE</span></div>
          <div className="leia-layout"><div className="leia-tree"><span>PROJECT MAP</span><i>⌄ &nbsp; src</i><b>↳ &nbsp; core.js</b><i>↳ &nbsp; parser.js</i><i>⌄ &nbsp; docs</i><b>↳ &nbsp; overview.md</b><i>↳ &nbsp; architecture.md</i></div><div className="leia-doc"><span>GENERATED DOCUMENTATION / 01</span><h4>Structure<br />made legible.</h4><div className="leia-rule leia-rule--long" /><div className="leia-rule" /><div className="leia-rule leia-rule--short" /><div className="leia-doc-block"><b>01</b><i /><i /><i /></div><div className="leia-doc-block"><b>02</b><i /><i /><i /></div></div></div>
        </div>
        <span className="artwork-index">SOURCE → SYSTEM</span>
      </div>
    );
  }

  if (project.visual === "bob") {
    return (
      <div className="artwork artwork--bob" aria-label="Abstract Bob browser start page">
        <div className="bob-browser"><div className="bob-chrome"><span /><span /><span /><div>BOB / NEW TAB</div><b>•••</b></div><div className="bob-page"><p>YOUR SPACE / YOUR RULES</p><h4>Start<br /><em>anywhere.</em></h4><div className="bob-search"><span>⌕</span><i>Find a thought, a link, a note...</i><b>↵</b></div><div className="bob-shortcuts"><span>NOTES <b>+</b></span><span>QUICK TEXT <b>↗</b></span><span>FOCUS <b>○</b></span></div></div></div>
        <span className="bob-cursor">↖<i>EDIT NOTE</i></span>
        <span className="artwork-index">LOCAL FIRST / 03</span>
      </div>
    );
  }

  return (
    <div className="artwork artwork--blitz" aria-label="Blitz OCR dashboard screenshot">
      <Image src="/blitz3.jpeg" alt="Blitz document OCR dashboard" fill sizes="(max-width: 760px) 100vw, 74vw" quality={86} className="blitz-image" />
      <div className="blitz-frame-label"><span>BLITZ / DOCUMENT FLOW</span><span>TYPE: PRODUCT UI</span></div>
    </div>
  );
}

function ProjectScene({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const artY = useTransform(scrollYProgress, [0, 0.5, 1], [42, 0, -42]);
  const artScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.93, 1, 0.97]);
  const titleX = useTransform(scrollYProgress, [0, 0.5, 1], [34, 0, -24]);
  const reduceMotion = useReducedMotion();

  return (
    <article ref={ref} id={`work-${project.id}`} className={`project-scene project-scene--${project.id}`}>
      <div className="project-scene-top"><span>{project.number} / 04</span><span>{project.type}</span></div>
      <motion.div className="project-art-plane" style={reduceMotion ? undefined : { y: artY, scale: artScale }} data-cursor="view">
        <ProjectArtwork project={project} />
        <span className="art-plane-corner art-plane-corner--tl" /><span className="art-plane-corner art-plane-corner--br" />
      </motion.div>
      <motion.div className="project-title-ghost" style={reduceMotion ? undefined : { x: titleX }} aria-hidden="true">{project.name}</motion.div>
      <div className="project-copy">
        <p className="project-kicker">SELECTED WORK / {project.number}</p>
        <h3>{project.name}</h3>
        <p className="project-description">{project.description}</p>
        <p className="project-stack">{project.stack}</p>
        <div className="project-actions">
          {project.href !== "#" && <MagneticLink href={project.href} className="project-link" label="view" external><span>OPEN REPOSITORY</span><Arrow diagonal /></MagneticLink>}
          {"live" in project && project.live && <MagneticLink href={project.live} className="project-link project-link--live" label="view" external><span>OPEN LIVE SITE</span><Arrow diagonal /></MagneticLink>}
        </div>
      </div>
      <div className="project-scene-index" aria-hidden="true"><span>G / G</span><span>0{index + 1}</span></div>
    </article>
  );
}

function WorkSection() {
  const reduceMotion = useReducedMotion();
  const introRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: introRef, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.78]);

  return (
    <section className="work-section" id="work">
      <div ref={introRef} className="work-intro">
        <div className="section-index"><span>01 / SELECTED WORK</span><span>FOUR PROJECTS / ONE POINT OF VIEW</span></div>
        <motion.div className="work-intro-title" style={reduceMotion ? undefined : { y: titleY, scale: titleScale }}>
          <p className="micro-label">THINGS MADE TO DO SOMETHING</p>
          <h2><span>SELECTED</span><span>WORK<span className="acid-period">.</span></span></h2>
        </motion.div>
        <div className="work-intro-foot"><span>SCROLL TO ENTER</span><span className="down-mark">↓</span><span>01 — 04</span></div>
      </div>
      <div className="project-sequence">{projects.map((project, index) => <ProjectScene key={project.id} project={project} index={index} />)}</div>
    </section>
  );
}

function AboutLine({ progress, phrase, start, emphasis = "" }: { progress: MotionValue<number>; phrase: string; start: number; emphasis?: string }) {
  const opacity = useTransform(progress, [Math.max(0, start - 0.12), start, Math.min(1, start + 0.22), Math.min(1, start + 0.34)], [0, 1, 1, 0]);
  const y = useTransform(progress, [Math.max(0, start - 0.12), start, Math.min(1, start + 0.34)], [64, 0, -48]);
  const scale = useTransform(progress, [Math.max(0, start - 0.12), start, Math.min(1, start + 0.34)], [0.92, 1, 0.98]);
  return (
    <motion.p className="about-line" style={{ opacity, y, scale }} aria-hidden="true">
      {phrase.split(" ").map((word, index) => <span key={`${word}-${index}`} className={emphasis && word.replace(/[.,!]/g, "") === emphasis ? "about-word about-word--acid" : "about-word"}>{word}<i> </i></span>)}
    </motion.p>
  );
}

function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const progressWidth = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="about-sequence" id="about" aria-label="About Gustavo Galeazzi">
      <div className="about-sticky">
        <div className="section-index section-index--dark"><span>02 / A NOTE ON THE WORK</span><span>GUSTAVO GALEAZZI / DIGITAL PRACTICE</span></div>
        <div className="about-stage-copy">
          <p className="micro-label">THE WAY I SEE IT</p>
          <div className="about-lines" aria-label="I don't just build things. I explore possibilities. I turn ideas into experiences.">
            <AboutLine progress={progress} phrase="I DON'T JUST BUILD THINGS." start={0.08} emphasis="BUILD" />
            <AboutLine progress={progress} phrase="I EXPLORE POSSIBILITIES." start={0.38} emphasis="POSSIBILITIES." />
            <AboutLine progress={progress} phrase="I TURN IDEAS INTO EXPERIENCES." start={0.68} emphasis="EXPERIENCES." />
          </div>
        </div>
        <div className="about-stage-foot"><span>CODE / INTERFACE / INTERACTION</span><div className="about-track"><motion.i style={{ width: progressWidth }} /></div><span>SCROLL TO CONTINUE</span></div>
      </div>
    </section>
  );
}

function PlaySection() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const typeY = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -40]);
  return (
    <section className="play-section" id="play" ref={ref}>
      <div className="section-index section-index--dark"><span>03 / INTERACTIVE STUDY</span><span>NO RULES / JUST HANDLE WITH CARE</span></div>
      <div className="play-layout">
        <motion.div className="play-copy" style={reduceMotion ? undefined : { y: typeY }}>
          <p className="micro-label">A SMALL OBJECT FOR YOUR HANDS</p>
          <h2>TOUCH<br />THE <em>FORM.</em></h2>
          <p className="play-description">A folded-metal study, built as a little invitation to explore. Drag it. Turn it. Find a new angle.</p>
          <span className="play-index">GG—01 / KINETIC FORM</span>
        </motion.div>
        <Sculpture variant="play" />
      </div>
      <div className="play-footer"><span>DRAG THE OBJECT</span><span>MOVE / ROTATE / RELEASE</span><span>ENDLESS VARIATION</span></div>
    </section>
  );
}

function ContactSection() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="contact-finale" id="contact">
      <div className="section-index"><span>04 / THE NEXT FRAME</span><span>GUSTAVO GALEAZZI / 2026</span></div>
      <div className="contact-content">
        <p className="micro-label"><span className="availability-dot" /> OPEN TO WHAT&apos;S NEXT</p>
        <h2><span>LET&apos;S MAKE</span><span>SOMETHING</span><span className="contact-matter">MATTER<span>.</span></span></h2>
        <MagneticLink href="mailto:gustavosgaleazzi@gmail.com" className="contact-orbit" label="link"><span>START A CONVERSATION</span><Arrow diagonal /></MagneticLink>
      </div>
      <div className="contact-footer">
        <a href="mailto:gustavosgaleazzi@gmail.com" data-cursor="link">GUSTAVOSGALEAZZI@GMAIL.COM</a>
        <a href="https://github.com/gusata" target="_blank" rel="noreferrer" data-cursor="link">GITHUB <Arrow diagonal /></a>
        <a href="https://www.linkedin.com/in/gustavo-sanches-galeazzi-058346258/" target="_blank" rel="noreferrer" data-cursor="link">LINKEDIN <Arrow diagonal /></a>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })} data-cursor="link">BACK TO TOP ↑</button>
      </div>
      <motion.div className="contact-monogram" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 54, repeat: Infinity, ease: "linear" }} aria-hidden="true"><span>G</span><i>G</i></motion.div>
    </section>
  );
}

export function PortfolioReboot() {
  const [introDone, setIntroDone] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scrollScale = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.35 });
  const experienceReady = introDone || reduceMotion === true;

  return (
    <div className="portfolio-root">
      <motion.div className="top-progress" style={{ scaleX: scrollScale }} aria-hidden="true" />
      <AnimatePresence initial={false}>{!experienceReady && <IntroSequence onFinish={() => setIntroDone(true)} />}</AnimatePresence>
      <Navigation />
      <main className={`experience-main${experienceReady ? " is-ready" : ""}`} id="top">
        <section className="hero-scene" aria-label="Gustavo Galeazzi — creative developer">
          <div className="hero-grid-lines" aria-hidden="true" />
          <div className="hero-meta"><span>INDEPENDENT DIGITAL PRACTICE</span><span>SAO PAULO, BRAZIL</span></div>
          <div className="hero-composition">
            <div className="hero-title-wrap">
              <p className="hero-kicker"><span className="availability-dot" /> CREATIVE DEVELOPER / DIGITAL MAKER</p>
              <h1 className="hero-title"><span className="hero-word hero-word--one">CREATING</span><span className="hero-word hero-word--two">WHAT&apos;S</span><span className="hero-word hero-word--three">NEXT<span className="acid-period">.</span></span></h1>
              <p className="hero-support">Digital experiences, intelligent ideas,<br />and everything in between.</p>
            </div>
            <div className="hero-object-wrap"><Sculpture variant="hero" /></div>
          </div>
          <div className="hero-bottomline"><span>DESIGN / CODE / INTERACTION</span><a href="#work" data-cursor="link"><span>SCROLL TO EXPLORE</span><i>↓</i></a><span>FIG. 01 — 04</span></div>
          <div className="hero-index-mark" aria-hidden="true">GG<br />001</div>
        </section>
        <WorkSection />
        <AboutSection />
        <PlaySection />
        <ContactSection />
      </main>
      <Cursor />
    </div>
  );
}
