"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";

const PAPER = "#F4F3EF", INK = "#111111", ACID = "#D7FF3F";
const TOTAL = 12.8;
const START = 1.3, DURATION = 1.5, ABOUT = 7.3, CONTACT = 10.8;
const introKey = "galeazzi-grid-03";
const reducedQuery = "(prefers-reduced-motion: reduce)";

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const mix = (a: number, b: number, t: number) => a + (b - a) * clamp(t);
const segment = (t: number, start: number, end: number) => clamp((t - start) / (end - start));
const smooth = (t: number) => { const p = clamp(t); return p * p * (3 - 2 * p); };
const number = (n: number) => String(n).padStart(2, "0");

type Project = { name: string; category: string; description: string; source?: string; live?: string; image?: string };
const projects: Project[] = [
  { name: "CLAUDEFY", category: "AI TOOLING / WINDOWS", description: "Token usage, session limits and weekly progress. A native Windows notification that makes Claude Code activity easier to understand.", source: "https://github.com/gusata/ClaudeFy" },
  { name: "LEIA", category: "AI / DOCUMENTATION", description: "An AI documentation engine that reads a codebase and translates its structure into clear, useful project documentation.", source: "https://github.com/gusata/LEIA" },
  { name: "BOB", category: "PRODUCT / BROWSER", description: "A personal starting point for the browser. Instant notes and text shortcuts, saved locally and ready when you are.", source: "https://github.com/gusata/Bob", live: "https://bob-webpage.vercel.app/", image: "/work/bob.png" },
  { name: "BLITZ", category: "PRODUCT / DOCUMENT OCR", description: "An OCR document workflow for batch review, AI validation and extraction auditing.", image: "/blitz3.jpeg" },
];
const chapters = [{ name: "WORK", id: "work", time: 1.48 }, { name: "ABOUT", id: "about", time: 7.75 }, { name: "PLAYGROUND", id: "playground", time: 9.45 }, { name: "CONTACT", id: "contact", time: 11.35 }];

function subscribeViewport(callback: () => void) { window.addEventListener("resize", callback); return () => window.removeEventListener("resize", callback); }
function viewportSnapshot() { return `${document.documentElement.clientWidth},${window.innerHeight}`; }
function useViewport() { const size = useSyncExternalStore(subscribeViewport, viewportSnapshot, () => "1440,900"); const [w, h] = size.split(",").map(Number); return { w, h, mobile: w < 700 }; }
function subscribeReduced(callback: () => void) { const media = matchMedia(reducedQuery); media.addEventListener("change", callback); return () => media.removeEventListener("change", callback); }
function useReduced() { return useSyncExternalStore(subscribeReduced, () => matchMedia(reducedQuery).matches, () => false); }

type Size = { w: number; h: number; mobile: boolean };
type Glyph = { letter: string; x: number; y: number; size: number; index: number; keeper: boolean };
const widths: Record<string, number> = { G: .778, U: .722, S: .667, T: .611, A: .722, V: .667, O: .778, L: .611, E: .667, Z: .611, I: .278 };
function glyphLayout({ w, h, mobile }: Size): Glyph[] {
  const margin = mobile ? 20 : w * .045;
  const lines = ["GUSTAVO", "GALEAZZI"];
  let serial = 0;
  return lines.flatMap((line, row) => {
    const totalWidth = [...line].reduce((sum, letter) => sum + widths[letter] + .005, -.005);
    const size = Math.min((w - margin * 2) / totalWidth, h * .285);
    let x = margin;
    const baseline = mobile ? h * (.44 + row * .115) : h * (.445 + row * .28);
    return [...line].map((letter, i) => { const g = { letter, x, y: baseline, size, index: serial++, keeper: i === 0 }; x += (widths[letter] + .005) * size; return g; });
  });
}

function ProjectArt({ index, preview = false }: { index: number; preview?: boolean }) {
  const p = projects[index];
  return <svg className="art-composition" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect width="1440" height="900" fill={INK} />
    {index === 0 && <>
      <text x="85" y="265" fill={PAPER} fontSize="20" letterSpacing="4">CLAUDE CODE / ACTIVITY</text>
      <path d="M85 310H1355M720 310V660" stroke={PAPER} strokeOpacity=".35" />
      <text x="85" y="400" fill={PAPER} fontSize="20" letterSpacing="4">SESSION</text>
      <text x="85" y="610" fill={PAPER} fontSize="190" fontWeight="900" letterSpacing="-12">NOW</text>
      <text x="790" y="400" fill={PAPER} fontSize="20" letterSpacing="4">USAGE / WEEKLY</text>
      <text x="790" y="610" fill={PAPER} fontSize="190" fontWeight="900" letterSpacing="-12">FLOW</text>
    </>}
    {index === 1 && <>
      <path d="M90 226H600M90 226V660M690 226H1350M1350 226V660" fill="none" stroke={PAPER} strokeOpacity=".48" />
      <text x="125" y="285" fill={PAPER} fontSize="18" letterSpacing="4">01 / SOURCE</text>
      <text x="745" y="285" fill={PAPER} fontSize="18" letterSpacing="4">02 / EXPLANATION</text>
      {[355, 415, 475, 535, 595].map((y, i) => <g key={y}>
        <text x="125" y={y} fill={i === 2 ? ACID : PAPER} fillOpacity={i === 2 ? 1 : .72} fontFamily="monospace" fontSize="24">{["import { app }", "function render() {", "  read(source)", "  map(context)", "  return clarity", "}"][i]}</text>
        <path d={`M745 ${y - 12}H${[1210, 1270, 1175, 1300, 1120][i]}`} stroke={i === 2 ? ACID : PAPER} strokeOpacity={i === 2 ? 1 : .58} strokeWidth="8" />
      </g>)}
      <path d="M620 445H670M650 430L670 445L650 460" fill="none" stroke={ACID} strokeWidth="2" />
    </>}
    {p.image && <><image href={p.image} x="85" y="220" width="1270" height="445" preserveAspectRatio="xMidYMid slice" style={{ filter: "grayscale(1)" }} /><path d="M85 685H1355" stroke={PAPER} strokeOpacity=".35" /><rect x="85" y="682" width={index === 2 ? 190 : 320} height="6" fill={ACID} /></>}
    {index < 2 && <><path d="M85 685H1355" stroke={PAPER} strokeOpacity=".35" /><rect x="85" y="682" width={index === 0 ? 230 : 510} height="6" fill={ACID} /></>}
    {preview && <text x="85" y="130" fill={PAPER} fontSize="60" fontWeight="900">{p.name}</text>}
  </svg>;
}

function IntroFragments({ progress, size, glyphs }: { progress: MotionValue<number>; size: Size; glyphs: Glyph[] }) {
  const visibility = useTransform(progress, p => p < .65 ? "visible" : "hidden");
  const fs = Math.min(size.h * .95, size.w * .9);
  const gw = fs * .778, left = (size.w - gw) / 2, baseline = size.h * .5 + fs * .34;
  return <motion.svg className="intro-fragments" viewBox={`0 0 ${size.w} ${size.h}`} style={{ visibility }} aria-hidden="true">
    {glyphs.map((glyph, i) => <IntroSlice key={i} index={i} glyph={glyph} progress={progress} source={{ left, baseline, fs, width: gw, count: glyphs.length }} />)}
  </motion.svg>;
}
function IntroSlice({ index, glyph, progress, source }: { index: number; glyph: Glyph; progress: MotionValue<number>; source: { left: number; baseline: number; fs: number; width: number; count: number } }) {
  const band = source.width / source.count;
  const x = useTransform(progress, p => mix(0, glyph.x - source.left - index * band, smooth(segment(p, .25, .61))));
  const y = useTransform(progress, p => mix(0, glyph.y - source.baseline, smooth(segment(p, .25 + index * .003, .62))));
  const stretch = useTransform(progress, [0, .2, .3, .58, .65], [.72, 1.55, 1.55, .5, .5]);
  const clip = useTransform(progress, p => `inset(0 0 ${segment(p, .49, .64) * 100}% 0)`);
  return <motion.g style={{ x, y, scaleX: stretch, clipPath: clip, transformOrigin: `${source.left + source.width / 2}px ${source.baseline}px` }}>
    <defs><clipPath id={`intro-slice-${index}`}><rect x={source.left + index * band - .5} y={source.baseline - source.fs} width={band + 1} height={source.fs * 1.2} /></clipPath></defs>
    <text x={source.left} y={source.baseline} fontSize={source.fs} fontWeight="900" fill={INK} clipPath={`url(#intro-slice-${index})`}>G</text>
  </motion.g>;
}

function NameGlyph({ glyph, time, intro, size }: { glyph: Glyph; time: MotionValue<number>; intro: MotionValue<number>; size: Size }) {
  const { w, h, mobile } = size;
  const which = glyph.index === 0 ? 0 : 1;
  const navSize = mobile ? 23 : 27;
  const navX = (mobile ? 20 : 36) + which * navSize * .62;
  const navY = mobile ? 37 : 44;
  const endSize = Math.min(w * .28, h * .31);
  const endX = w * .5 - endSize * .68 + which * endSize * .65;
  const endY = h * .5 + endSize * .32;
  const x = useTransform(time, t => {
    if (!glyph.keeper) return glyph.x;
    const travel = smooth(segment(t, .22 + which * .045, 1.08));
    const closure = smooth(segment(t, 12.08, 12.7));
    return mix(mix(glyph.x, navX, travel), endX, closure);
  });
  const y = useTransform(time, t => {
    if (!glyph.keeper) return glyph.y;
    const travel = smooth(segment(t, .22 + which * .045, 1.08));
    return mix(mix(glyph.y, navY, travel) + Math.sin(travel * Math.PI) * (which ? 30 : -35), endY, smooth(segment(t, 12.08, 12.7)));
  });
  const scale = useTransform(time, t => glyph.keeper ? mix(mix(1, navSize / glyph.size, smooth(segment(t, .22 + which * .045, 1.08))), endSize / glyph.size, smooth(segment(t, 12.08, 12.7))) : 1);
  const fill = useTransform(time, t => { const local = (t - START) % DURATION; return t > 10.8 || (t >= START && t < ABOUT && local > .63 && local < 1.30) ? PAPER : INK; });
  const introClip = useTransform(intro, p => `inset(${100 - segment(p, .46 + glyph.index * .008, .72 + glyph.index * .006) * 100}% 0 0 0)`);
  return <motion.g style={{ originX: 0, originY: 0, transformBox: "view-box", x, y, scale, clipPath: introClip }}>
    {glyph.keeper ? <motion.text data-keeper={which} className="kinetic-letter" x="0" y="0" fontSize={glyph.size} fontWeight="900" style={{ fill }}>{glyph.letter}</motion.text> : <>
      <LetterHalf glyph={glyph} half={0} time={time} intro={intro} w={w} /><LetterHalf glyph={glyph} half={1} time={time} intro={intro} w={w} />
    </>}
  </motion.g>;
}
function LetterHalf({ glyph, half, time, intro, w }: { glyph: Glyph; half: number; time: MotionValue<number>; intro: MotionValue<number>; w: number }) {
  const delay = (glyph.index % 7) * .018;
  const x = useTransform(() => {
    const p = intro.get(), t = time.get();
    const introCut = smooth(segment(p, .76, .82)) * (1 - smooth(segment(p, .90, .98))) * Math.min(w * .018, 24);
    const scrollCut = smooth(segment(t, .28 + delay, 1.12)) * (w + glyph.size);
    return (half ? 1 : -1) * (introCut + scrollCut);
  });
  const scaleY = useTransform(time, t => mix(1, .06, smooth(segment(t, .58 + delay, 1.12))));
  const visibility = useTransform(time, t => t < 1.25 ? "visible" : "hidden");
  const id = `letter-${glyph.index}-${half}`;
  return <motion.g style={{ originX: 0, originY: 0, transformBox: "view-box", x, scaleY, visibility }}><defs><clipPath id={id}><rect x={-glyph.size * .1} y={half ? -glyph.size * .38 : -glyph.size} width={glyph.size * 1.2} height={half ? glyph.size * .5 : glyph.size * .62} /></clipPath></defs><text data-glyph className="kinetic-letter" x="0" y="0" fontSize={glyph.size} fontWeight="900" clipPath={`url(#${id})`}>{glyph.letter}</text></motion.g>;
}

function Identity({ time, intro, size, introActive }: { time: MotionValue<number>; intro: MotionValue<number>; size: Size; introActive: boolean }) {
  const glyphs = glyphLayout(size);
  const svgRef = useRef<SVGSVGElement>(null);
  const pointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (time.get() > .15 || introActive || event.pointerType === "touch") return;
    event.currentTarget.querySelectorAll<SVGTextElement>(".kinetic-letter").forEach(letter => {
      const r = letter.getBoundingClientRect(), dx = event.clientX - r.x - r.width / 2, dy = event.clientY - r.y - r.height / 2;
      const influence = Math.max(0, 1 - Math.hypot(dx, dy) / 170);
      letter.style.setProperty("--letter-x", `${Math.max(-5, Math.min(5, dx * .025 * influence))}px`);
      letter.style.setProperty("--letter-y", `${Math.max(-3, Math.min(3, dy * .02 * influence))}px`);
      letter.style.setProperty("--letter-width", `${1 + influence * .055}`);
    });
  };
  const reset = () => svgRef.current?.querySelectorAll<SVGTextElement>(".kinetic-letter").forEach(letter => { letter.style.setProperty("--letter-x", "0px"); letter.style.setProperty("--letter-y", "0px"); letter.style.setProperty("--letter-width", "1"); });
  useMotionValueEvent(time, "change", t => { if (t > .15) reset(); });
  return <><svg ref={svgRef} className="identity-plane" viewBox={`0 0 ${size.w} ${size.h}`} onPointerMove={pointer} onPointerLeave={reset} aria-hidden="true">{glyphs.map(g => <NameGlyph key={`${g.index}-${size.w}-${size.h}`} glyph={g} time={time} intro={intro} size={size} />)}</svg>{introActive && <IntroFragments progress={intro} size={size} glyphs={glyphs} />}</>;
}

function HeroScene({ time, intro }: { time: MotionValue<number>; intro: MotionValue<number> }) {
  const clip = useTransform(time, t => `inset(0 0 ${segment(t, .25, 1.1) * 100}% 0)`);
  const openingClip = useTransform(intro, p => `inset(${100 - segment(p, .68, .94) * 100}% 0 0 0)`);
  return <motion.section className="scene hero-scene" style={{ clipPath: clip }} aria-label="Introduction"><motion.div className="hero-annotations" style={{ clipPath: openingClip }}>
    <div className="hero-upper"><span>INDEPENDENT DIGITAL PRACTICE</span><span>SÃO PAULO, BR<br />23°33′ S / 46°38′ W</span></div>
    <div className="hero-lower"><p>DIGITAL EXPERIENCES<br />&amp; INTELLIGENT SYSTEMS</p><span className="availability"><i /> AVAILABLE FOR<br />SELECT PROJECTS</span></div>
    <div className="hero-bottom"><span>GUSTAVO GALEAZZI</span><span>01 — 04 / SELECTED WORK</span><span>SCROLL TO MOVE ↓</span></div>
  </motion.div></motion.section>;
}

function MasterRule({ time, intro, size }: { time: MotionValue<number>; intro: MotionValue<number>; size: Size }) {
  const y = useTransform(() => {
    const p = intro.get(), t = time.get();
    const scrollPosition = mix(size.h - 72, size.h * .5, smooth(segment(t, .65, 1.15)));
    const cut = mix(size.h - 72, size.h * .5, smooth(segment(p, .68, .76)));
    const returnToHero = mix(size.h * .5, size.h - 72, smooth(segment(p, .88, 1)));
    return p < .88 ? cut : mix(returnToHero, scrollPosition, segment(p, .96, 1));
  });
  const width = useTransform(intro, p => `${segment(p, .7, .9) * 100}%`);
  const visibility = useTransform(time, t => t < 1.5 ? "visible" : "hidden");
  return <motion.div className="master-rule" style={{ y, width, visibility }} aria-hidden="true" />;
}

function WorkScene({ index, time, size, active }: { index: number; time: MotionValue<number>; size: Size; active: boolean }) {
  const [readable, setReadable] = useState(false);
  const start = START + index * DURATION, end = start + DURATION;
  useMotionValueEvent(time, "change", t => { const next = t > start + .74 && t < end - .27; setReadable(old => old === next ? old : next); });
  const respond = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const amount = (event.clientX / size.w - .5) * 2;
    event.currentTarget.style.setProperty("--work-skew", `${amount * .6}deg`);
    event.currentTarget.style.setProperty("--work-stretch", `${1 + Math.abs(amount) * .018}`);
  };
  const p = projects[index], { w, h, mobile } = size;
  const font = mobile ? w * .27 : Math.min(w * .24, h * .36);
  const textWidth = w * .91, targetScale = mobile ? .56 : .38;
  const visibility = useTransform(time, t => t >= start - .16 && t <= end + .04 ? "visible" : "hidden");
  const titleScale = useTransform(time, t => mix(1, targetScale, smooth(segment(t - start, .32, .73))));
  const titleX = w * .045;
  const titleY = useTransform(time, t => mix(h * .58, mobile ? 145 : 170, smooth(segment(t - start, .32, .73))));
  const band = useTransform(time, t => mix(1, h, smooth(segment(t - start, -.10, .23))));
  const bandY = useTransform(band, height => (h - height) / 2);
  const expansion = useTransform(time, t => h * smooth(segment(t - start, .31, .70)));
  const expansionY = useTransform(expansion, height => (h - height) / 2);
  const exitClip = useTransform(time, t => {
    const closing = smooth(segment(t, end - .23, end));
    const y = closing * (50 - 6 / h * 100);
    const x = index === 3 ? closing * (50 - 6 / w * 100) : 0;
    return `inset(${y}% ${x}% ${y}% ${x}%)`;
  });
  const labelClip = useTransform(time, t => { const enter = segment(t - start, .63, .81), leave = segment(t, end - .30, end - .19); return `inset(${(1 - enter) * 100}% 0 ${leave * 100}% 0)`; });
  const titleStroke = useTransform(time, t => t < start + .55 ? INK : PAPER);
  const maskId = `work-mask-${index}`, bandId = `work-band-${index}`;
  return <motion.section className="scene work-scene" data-work={index} style={{ visibility, clipPath: exitClip }} aria-hidden={!active} inert={!active || !readable} aria-label={p.name} onPointerMove={respond} onPointerLeave={e => { e.currentTarget.style.setProperty("--work-skew", "0deg"); e.currentTarget.style.setProperty("--work-stretch", "1"); }}>
    <svg className="work-art-plane" viewBox={`0 0 ${w} ${h}`} aria-hidden="true"><defs>
      <clipPath id={bandId}><motion.rect x="0" y={bandY} width={w} height={band} /></clipPath>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={w} height={h}><rect width={w} height={h} fill="black" /><motion.g style={{ originX: 0, originY: 0, transformBox: "view-box", x: titleX, y: titleY, scale: titleScale }}><text x="0" y="0" fill="white" fontSize={font} fontWeight="900" textLength={textWidth} lengthAdjust="spacingAndGlyphs">{p.name}</text></motion.g><motion.rect x="0" y={expansionY} width={w} height={expansion} fill="white" /></mask>
    </defs><g clipPath={`url(#${bandId})`}><g mask={`url(#${maskId})`}><foreignObject width={w} height={h}><ProjectArt index={index} /></foreignObject></g><motion.g style={{ originX: 0, originY: 0, transformBox: "view-box", x: titleX, y: titleY, scale: titleScale }}><motion.text x="0" y="0" fill="none" stroke={titleStroke} strokeWidth="1.5" fontSize={font} fontWeight="900" textLength={textWidth} lengthAdjust="spacingAndGlyphs">{p.name}</motion.text></motion.g></g></svg>
    <motion.div className="work-information" style={{ clipPath: labelClip }}><div className="work-caption"><span>{number(index + 1)} / {p.category}</span><p>{p.description}</p></div><div className="work-actions">{p.source && <a data-cursor="OPEN" href={p.source} target="_blank" rel="noreferrer">EXPLORE SOURCE <b>↗</b></a>}{p.live && <a data-cursor="OPEN" href={p.live} target="_blank" rel="noreferrer">VISIT PROJECT <b>↗</b></a>}{!p.source && <a data-cursor="EMAIL" href={`mailto:gustavosgaleazzi@gmail.com?subject=${encodeURIComponent(`Let's talk about ${p.name}`)}`}>ABOUT THIS PROJECT <b>↗</b></a>}</div></motion.div>
  </motion.section>;
}

function MovingWord({ time, size }: { time: MotionValue<number>; size: Size }) {
  const { w, h, mobile } = size;
  const aboutFont = mobile ? w * .135 : Math.min(w * .115, h * .17);
  const contactFont = mobile ? w * .15 : Math.min(w * .15, h * .23);
  const aboutX = mobile ? w * .045 : w * .40;
  const aboutY = mobile ? h * .38 : h * .49;
  const x = useTransform(time, t => t < 10.2 ? mix(aboutX, w * .045, smooth(segment(t, 8.65, 9.15))) : w * .045);
  const y = useTransform(time, t => t < 10.2 ? mix(aboutY, h - 76, smooth(segment(t, 8.65, 9.15))) : mix(h - 76, h * (mobile ? .35 : .33), smooth(segment(t, 10.2, 10.85))));
  const scale = useTransform(time, t => t < 10.2 ? mix(aboutFont / 100, .12, smooth(segment(t, 8.65, 9.15))) : mix(.12, contactFont / 100, smooth(segment(t, 10.2, 10.85))));
  const clip = useTransform(time, t => `inset(${100 - segment(t, 7.37, 7.73) * 100}% 0 ${segment(t, 10.99, 11.25) * 100}% 0)`);
  const aboutWord = useTransform(time, t => `inset(0 0 ${segment(t, 10.12, 10.38) * 100}% 0)`);
  const contactWord = useTransform(time, t => `inset(${100 - segment(t, 10.12, 10.38) * 100}% 0 0 0)`);
  const visibility = useTransform(time, t => t >= ABOUT && t < 11.15 ? "visible" : "hidden");
  const fill = useTransform(time, t => t >= 10.8 ? PAPER : INK);
  return <svg className="word-plane" viewBox={`0 0 ${w} ${h}`} aria-hidden="true"><motion.g style={{ originX: 0, originY: 0, transformBox: "view-box", x, y, scale, clipPath: clip, visibility }}><motion.text x="0" y="0" fontSize="100" fontWeight="900" letterSpacing="-6" style={{ fill, clipPath: aboutWord }}>MOVE</motion.text><motion.text x="0" y="0" fontSize="100" fontWeight="900" letterSpacing="-6" style={{ fill, clipPath: contactWord }}>LET&apos;S</motion.text></motion.g></svg>;
}

function AboutScene({ time, size, active }: { time: MotionValue<number>; size: Size; active: boolean }) {
  const { w, h, mobile } = size;
  const visibility = useTransform(time, t => t >= ABOUT && t < 9.18 ? "visible" : "hidden");
  const firstClip = useTransform(time, t => `inset(${100 - segment(t, 7.35, 7.65) * 100}% 0 ${segment(t, 8.6, 8.95) * 100}% 0)`);
  const secondClip = useTransform(time, t => `inset(${100 - segment(t, 7.44, 7.76) * 100}% 0 ${segment(t, 8.65, 9) * 100}% 0)`);
  const copyClip = useTransform(time, t => `inset(${100 - segment(t, 7.72, 8.03) * 100}% 0 ${segment(t, 8.62, 8.98) * 100}% 0)`);
  const font = mobile ? w * .135 : Math.min(w * .115, h * .17);
  return <motion.section className="scene about-scene" style={{ visibility }} aria-hidden={!active} inert={!active} aria-label="About Gustavo">
    <svg className="about-type" viewBox={`0 0 ${w} ${h}`} aria-hidden="true"><motion.g style={{ clipPath: firstClip }}><text x={w * .045} y={h * (mobile ? .23 : .30)} fontSize={font} fontWeight="900" letterSpacing={-font * .065}>I MAKE</text></motion.g><motion.g style={{ clipPath: secondClip }}><text x={w * .045} y={h * (mobile ? .31 : .49)} fontSize={font} fontWeight="900" letterSpacing={-font * .065}>IDEAS</text></motion.g></svg>
    <motion.div className="about-editorial" style={{ clipPath: copyClip }}><span>02 / THE PERSON BEHIND THE PRACTICE</span><p>I’m Gustavo Galeazzi, a creative developer in São Paulo. I build digital experiences and intelligent systems that make complex things feel clear, useful and human.</p><p>Design gives an idea its form.<br />Code gives it room to move.</p></motion.div>
    <motion.div className="word-grid" style={{ clipPath: copyClip }} aria-label="Design, development and exploration"><span>AN ONGOING CONVERSATION</span><b>DESIGN</b><b>DEVELOPMENT</b><b>EXPLORATION</b></motion.div>
  </motion.section>;
}

function SharedDot({ time, size }: { time: MotionValue<number>; size: Size }) {
  const fs = size.mobile ? size.w * .135 : Math.min(size.w * .115, size.h * .17);
  const targetX = (size.mobile ? size.w * .045 : size.w * .40) + fs * 3.14;
  const targetY = size.h * (size.mobile ? .38 : .49) - fs * .10;
  const x = useTransform(time, t => mix(size.w / 2 - 6, targetX, smooth(segment(t, 7.27, 7.73))));
  const y = useTransform(time, t => mix(size.h / 2 - 6, targetY, smooth(segment(t, 7.27, 7.73))));
  const fill = useTransform(time, [7.27, 7.65], [INK, ACID]);
  const visibility = useTransform(time, t => t >= 7.27 && t < 8.7 ? "visible" : "hidden");
  return <motion.div className="shared-dot" style={{ x, y, backgroundColor: fill, visibility }} aria-hidden="true" />;
}

function Playground({ compact = false }: { compact?: boolean }) {
  const [point, setPoint] = useState({ x: 0, y: 0, active: false });
  const reset = () => setPoint({ x: 0, y: 0, active: false });
  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" && !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const r = event.currentTarget.getBoundingClientRect();
    setPoint({ x: Math.max(-1, Math.min(1, (event.clientX - r.left) / r.width * 2 - 1)), y: Math.max(-1, Math.min(1, (event.clientY - r.top) / r.height * 2 - 1)), active: true });
  };
  const style = { "--pull-x": `${point.x * 42}px`, "--pull-y": `${point.y * 30}px`, "--pull-r": `${point.x * 5}deg`, "--pull-s": 1 + Math.abs(point.x) * .09 } as CSSProperties;
  return <div className={`play-layout${compact ? " compact" : ""}`}><div className="play-editorial"><span>PLAYGROUND / 001</span><h2>TAKE<br />THE GRID<br /><em>APART.</em></h2><p>Drag the mark. Move the lines.<br />Release it to find the balance again.</p><small>TOUCH / POINTER / ARROW KEYS</small></div><div className="play-structure" role="group" tabIndex={0} aria-label="Interactive GG. Drag or use arrow keys. Release or press Escape to reset." style={style} data-active={point.active} data-cursor="DRAG" onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); move(e); }} onPointerMove={move} onPointerUp={e => { if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); reset(); }} onPointerCancel={reset} onPointerLeave={e => { if (!e.currentTarget.hasPointerCapture(e.pointerId)) reset(); }} onBlur={reset} onKeyDown={e => { if (e.key === "Escape") { reset(); return; } const keys: Record<string, [number, number]> = { ArrowLeft: [-.25, 0], ArrowRight: [.25, 0], ArrowUp: [0, -.25], ArrowDown: [0, .25] }; const delta = keys[e.key]; if (!delta) return; e.preventDefault(); setPoint(p => ({ x: Math.max(-1, Math.min(1, p.x + delta[0])), y: Math.max(-1, Math.min(1, p.y + delta[1])), active: true })); }} onKeyUp={e => { if (e.key.startsWith("Arrow")) reset(); }}><div className="play-rules" aria-hidden="true"><i /><i /><i /><i /></div><div className="play-glyphs" aria-hidden="true"><span>G</span><span>G</span><i /></div><span className="play-corner">X / Y<br />001</span><button type="button" className="play-reset" onClick={reset}>RESET ↗</button></div></div>;
}
function PlayScene({ time, active }: { time: MotionValue<number>; active: boolean }) {
  const visibility = useTransform(time, t => t > 8.75 && t < 10.55 ? "visible" : "hidden");
  const clip = useTransform(time, t => `inset(${100 - segment(t, 8.75, 9.18) * 100}% 0 ${segment(t, 10.12, 10.5) * 100}% 0)`);
  return <motion.section className="scene playground-scene" style={{ visibility, clipPath: clip }} aria-hidden={!active} inert={!active}><Playground /></motion.section>;
}

function ContactScene({ time, size, active }: { time: MotionValue<number>; size: Size; active: boolean }) {
  const { w, h, mobile } = size;
  const fs = mobile ? w * .15 : Math.min(w * .15, h * .23);
  const first = useTransform(time, t => `inset(${100 - segment(t, 10.85, 11.14) * 100}% 0 ${segment(t, 12.08, 12.4) * 100}% 0)`);
  const second = useTransform(time, t => `inset(${100 - segment(t, 10.92, 11.23) * 100}% 0 ${segment(t, 12.02, 12.34) * 100}% 0)`);
  const third = useTransform(time, t => `inset(${100 - segment(t, 11.0, 11.31) * 100}% 0 ${segment(t, 11.96, 12.28) * 100}% 0)`);
  const actions = useTransform(time, t => `inset(${100 - segment(t, 11.13, 11.38) * 100}% 0 ${segment(t, 12.02, 12.30) * 100}% 0)`);
  const visibility = useTransform(time, t => t >= CONTACT && t < 12.45 ? "visible" : "hidden");
  const baseY = h * (mobile ? .35 : .33);
  const react = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.pointerType === "touch") return;
    const r = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--contact-width", `${1 + Math.max(0, 1 - Math.abs(event.clientX - r.width / 2) / r.width) * .012}`);
  };
  return <motion.section className="scene contact-scene" style={{ visibility }} aria-hidden={!active} inert={!active} aria-labelledby="contact-heading"><h2 id="contact-heading" className="sr-only">Let’s create something.</h2><svg className="contact-type" viewBox={`0 0 ${w} ${h}`} onPointerMove={react} onPointerLeave={e => e.currentTarget.style.setProperty("--contact-width", "1")} aria-hidden="true">
    <motion.g style={{ clipPath: first }}><text x={w * .045} y={baseY} fontSize={fs} fontWeight="900" letterSpacing={-fs * .06}>LET’S</text></motion.g>
    <motion.g style={{ clipPath: second }}><text x={w * .045} y={baseY + fs * .94} fontSize={fs} fontWeight="900" letterSpacing={-fs * .06}>CREATE</text></motion.g>
    <motion.g style={{ clipPath: third }}><text x={w * .045} y={baseY + fs * 1.88} fontSize={fs} fontWeight="900" letterSpacing={-fs * .06} textLength={w * .88} lengthAdjust="spacingAndGlyphs">SOMETHING.</text></motion.g>
  </svg><motion.div className="contact-links" style={{ clipPath: actions }}><a className="email-action" href="mailto:gustavosgaleazzi@gmail.com" data-cursor="EMAIL"><small>HAVE AN IDEA?</small><span>gustavosgaleazzi@gmail.com <b>↗</b></span></a><div><a href="https://github.com/gusata" target="_blank" rel="noreferrer" data-cursor="OPEN">GITHUB ↗</a><a href="https://www.linkedin.com/in/gustavo-sanches-galeazzi-058346258/" target="_blank" rel="noreferrer" data-cursor="OPEN">LINKEDIN ↗</a></div></motion.div></motion.section>;
}

function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    const node = ref.current; if (!node) return;
    const move = (e: PointerEvent) => { const target = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-cursor]") : null; node.style.transform = `translate3d(${e.clientX + 14}px,${e.clientY + 14}px,0)`; node.textContent = target?.dataset.cursor || ""; node.dataset.visible = String(!!target); };
    document.addEventListener("pointermove", move, { passive: true }); return () => document.removeEventListener("pointermove", move);
  }, []);
  return <div ref={ref} className="grid-cursor" aria-hidden="true" />;
}

function copySnapshot(stage: HTMLElement, target: HTMLElement, prefix: string) {
  target.replaceChildren();
  const copy = stage.cloneNode(true) as HTMLElement;
  copy.className = "stage-snapshot";
  copy.inert = true;
  copy.setAttribute("aria-hidden", "true");
  const ids = new Map<string, string>();
  copy.querySelectorAll("[id]").forEach(node => { const old = node.id; const next = `${prefix}-${old}`; ids.set(old, next); node.id = next; });
  copy.querySelectorAll("*").forEach(node => { [...node.attributes].forEach(attr => { let value = attr.value; ids.forEach((next, old) => { value = value.replaceAll(`url(#${old})`, `url(#${next})`); if (value === `#${old}`) value = `#${next}`; }); if (value !== attr.value) node.setAttribute(attr.name, value); }); });
  target.appendChild(copy);
}

function FilmMenu({ mounted, open, close, topRef, bottomRef, navigate }: { mounted: boolean; open: boolean; close: () => void; topRef: RefObject<HTMLDivElement | null>; bottomRef: RefObject<HTMLDivElement | null>; navigate: (id: string) => void }) {
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!mounted) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus({ preventScroll: true });
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab") return;
      const nodes = dialog.current?.querySelectorAll<HTMLElement>("a,button"); if (!nodes?.length) return;
      if (e.shiftKey && document.activeElement === nodes[0]) { e.preventDefault(); nodes[nodes.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === nodes[nodes.length - 1]) { e.preventDefault(); nodes[0].focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => { document.body.style.overflow = oldOverflow; document.removeEventListener("keydown", keydown); };
  }, [mounted, close]);
  return <div className="film-menu" data-mounted={mounted} data-open={open} aria-hidden={!mounted} inert={!mounted}>
    <div ref={dialog} className="menu-surface" role="dialog" aria-modal="true" aria-label="Portfolio index"><div className="menu-top"><span>GUSTAVO GALEAZZI / INDEX</span><button ref={closeButton} onClick={close} type="button">CLOSE ×</button></div><nav>{chapters.map((chapter, i) => <a key={chapter.id} href={`#${chapter.id}`} onClick={e => { e.preventDefault(); navigate(chapter.id); }} style={{ "--order": i } as CSSProperties}><small>{number(i + 1)}</small><span>{chapter.name}</span><b>↗</b></a>)}</nav><div className="menu-foot"><span>DESIGN / DEVELOPMENT / EXPLORATION</span><span>SÃO PAULO / 2026</span></div></div>
    <div className="snapshot-half snapshot-top"><div ref={topRef} /></div><div className="snapshot-half snapshot-bottom"><div ref={bottomRef} /></div>
  </div>;
}

function CinematicPortfolio() {
  const size = useViewport(), track = useRef<HTMLDivElement>(null), stage = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const time = useTransform(scrollYProgress, [0, 1], [0, TOTAL]);
  const intro = useMotionValue(0);
  const introControl = useRef<{ stop: () => void } | null>(null);
  const [opening, setOpening] = useState(true);
  const [current, setCurrent] = useState(-1);
  const [menuMounted, setMenuMounted] = useState(false), [menuOpen, setMenuOpen] = useState(false);
  const topSnapshot = useRef<HTMLDivElement>(null), bottomSnapshot = useRef<HTMLDivElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null), closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const done = useCallback(() => { introControl.current?.stop(); intro.set(1); setOpening(false); try { sessionStorage.setItem(introKey, "seen"); } catch { /* The experience also works without storage. */ } }, [intro]);
  useEffect(() => {
    let seen = !!window.location.hash;
    try { seen ||= sessionStorage.getItem(introKey) === "seen"; } catch { /* Private mode can disable storage. */ }
    if (seen) { const frame = requestAnimationFrame(done); return () => cancelAnimationFrame(frame); }
    const previous = document.body.style.overflow; document.body.style.overflow = "hidden";
    const control = animate(intro, 1, { duration: 2.8, ease: "linear", onComplete: done });
    introControl.current = control;
    return () => { control.stop(); document.body.style.overflow = previous; };
  }, [done, intro]);
  useEffect(() => { if (!opening && !menuMounted) document.body.style.overflow = ""; }, [opening, menuMounted]);
  useMotionValueEvent(time, "change", t => { const next = t < START ? -1 : t < ABOUT ? Math.min(3, Math.floor((t - START) / DURATION)) : t < 8.85 ? 4 : t < 10.5 ? 5 : t < 12.35 ? 6 : 7; setCurrent(old => old === next ? old : next); });
  const headerClip = useTransform(time, t => `inset(0 0 ${segment(t, 12.02, 12.3) * 100}% 0)`);
  const darkClip = useTransform(time, t => `inset(${100 - segment(t, 10.45, 10.8) * 100}% 0 0 0)`);
  const openMenu = () => {
    if (!stage.current || !topSnapshot.current || !bottomSnapshot.current) return;
    copySnapshot(stage.current, topSnapshot.current, "upper"); copySnapshot(stage.current, bottomSnapshot.current, "lower");
    setMenuMounted(true); requestAnimationFrame(() => requestAnimationFrame(() => setMenuOpen(true)));
  };
  const closeMenu = useCallback(() => { setMenuOpen(false); closeTimer.current = setTimeout(() => { setMenuMounted(false); menuTrigger.current?.focus({ preventScroll: true }); }, 720); }, []);
  const navigate = (id: string) => { closeMenu(); setTimeout(() => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); history.replaceState(null, "", `#${id}`); }, 740); };
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);
  const displayIndex = current < 0 ? 1 : current <= 3 ? current + 1 : current === 4 ? 2 : current === 5 ? 3 : 4;
  return <main className="cinematic-portfolio">
    <h1 className="sr-only">Gustavo Galeazzi — creative developer</h1>
    <div className="film-track" ref={track}>
      <span className="chapter-anchor" id="top" style={{ top: 0 }} />{chapters.map(c => <span className="chapter-anchor" id={c.id} key={c.id} style={{ top: `calc(${c.time} * var(--scroll-unit))` }} />)}
      <div className="film-stage" ref={stage} inert={menuMounted || opening} aria-hidden={menuMounted || opening} data-current={current} data-dark={current >= 6}>
        <motion.div className="contact-background" style={{ clipPath: darkClip }} />
        <HeroScene time={time} intro={intro} /><MasterRule time={time} intro={intro} size={size} />
        {projects.map((p, i) => <WorkScene key={p.name} index={i} time={time} size={size} active={current === i} />)}
        <AboutScene time={time} size={size} active={current === 4} /><PlayScene time={time} active={current === 5} /><ContactScene time={time} size={size} active={current === 6} /><MovingWord time={time} size={size} /><SharedDot time={time} size={size} />
        <Identity time={time} intro={intro} size={size} introActive={opening} />
        <motion.header className="grid-header" style={{ clipPath: headerClip }}><a className="identity-hit" href="#top" aria-label="Back to the beginning" /><span>CREATIVE DEVELOPER / 2026</span><div><span className="chapter-counter" aria-label={`Index ${displayIndex}`}><motion.b key={displayIndex} initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: .3 }}>{number(displayIndex)}</motion.b></span><button ref={menuTrigger} type="button" onClick={openMenu} aria-expanded={menuMounted} data-cursor="OPEN">INDEX <i /></button></div></motion.header>
        <motion.div className="frame-footer" style={{ clipPath: headerClip }}><span>{current < 0 ? "THE LIVING GRID" : current <= 3 ? "SELECTED WORK" : current === 4 ? "FORM / FUNCTION / FEELING" : current === 5 ? "PLAYGROUND / 001" : "THE LAST FRAME IS A BEGINNING"}</span><span>{current >= 0 && current <= 3 ? `${number(current + 1)} / 04` : "GUSTAVO GALEAZZI"}</span><span>SCROLL TO TRANSFORM ↓</span></motion.div>
      </div>
    </div>
    <FilmMenu mounted={menuMounted} open={menuOpen} close={closeMenu} topRef={topSnapshot} bottomRef={bottomSnapshot} navigate={navigate} />
    {opening && <button type="button" className="skip-opening" onClick={done}>SKIP INTRO ↗</button>}
    <Cursor />
  </main>;
}

function StillPortfolio() {
  return <main className="still-portfolio"><header><a href="#top" className="still-mark">GG</a><nav>{chapters.map(c => <a key={c.id} href={`#${c.id}`}>{c.name}</a>)}</nav></header><section id="top" className="still-hero"><span>CREATIVE DEVELOPER / 2026</span><h1>GUSTAVO<br />GALEAZZI</h1><p>DIGITAL EXPERIENCES<br />&amp; INTELLIGENT SYSTEMS</p><small>AVAILABLE FOR SELECT PROJECTS</small></section><div id="work">{projects.map((p, i) => <section className="still-work" key={p.name}><span>{number(i + 1)} / {p.category}</span><h2>{p.name}</h2><div className="still-art"><ProjectArt index={i} /></div><p>{p.description}</p><div className="still-actions">{p.source && <a href={p.source} target="_blank" rel="noreferrer">EXPLORE SOURCE ↗</a>}{p.live && <a href={p.live} target="_blank" rel="noreferrer">VISIT PROJECT ↗</a>}{!p.source && <a href={`mailto:gustavosgaleazzi@gmail.com?subject=${p.name}`}>ABOUT THIS PROJECT ↗</a>}</div></section>)}</div><section id="about" className="still-about"><span>02 / ABOUT</span><h2>I MAKE<br />IDEAS MOVE.</h2><p>I’m Gustavo Galeazzi, a creative developer in São Paulo. I build digital experiences and intelligent systems that make complex things feel clear, useful and human.</p><div>DESIGN / DEVELOPMENT / EXPLORATION</div></section><section id="playground" className="still-play"><Playground compact /></section><section id="contact" className="still-contact"><span>04 / CONTACT</span><h2>LET’S<br />CREATE<br />SOMETHING.</h2><a href="mailto:gustavosgaleazzi@gmail.com">gustavosgaleazzi@gmail.com ↗</a><div><a href="https://github.com/gusata" target="_blank" rel="noreferrer">GITHUB ↗</a><a href="https://www.linkedin.com/in/gustavo-sanches-galeazzi-058346258/" target="_blank" rel="noreferrer">LINKEDIN ↗</a></div></section></main>;
}

export function LivingGridExperience() { const reduced = useReduced(); return reduced ? <StillPortfolio /> : <CinematicPortfolio />; }
