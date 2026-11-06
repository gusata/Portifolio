"use client";

/*
 * Holographic collectible card for the photograph viewer.
 * Pointer (mouse or finger drag) and device tilt drive one shared position,
 * which feeds the 3D rotation, the moving glare and the rainbow foil.
 */
import Image from "next/image";
import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import type { Photograph } from "@/content/duality";

const MAX_TILT = 15;
/** Room kept under the card for the interaction hint. */
const HINT_SPACE = 34;

/** iOS only grants motion sensors from inside a user gesture; call this in the click that opens the card. */
export function requestTiltPermission() {
  const request = (globalThis.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> } | undefined)?.requestPermission;
  if (typeof request === "function") request().catch(() => {});
}

type Size = { width: number; height: number; pad: number; head: number; foot: number; windowWidth: number; windowHeight: number };

/** Fits a card around the photo (no crop) inside the available stage. */
function fit(stageWidth: number, stageHeight: number, ratio: number): Size {
  const unit = Math.min(stageWidth, stageHeight);
  const pad = Math.round(Math.min(22, Math.max(9, unit * .028)));
  const head = Math.round(Math.min(62, Math.max(38, unit * .075)));
  const foot = Math.round(Math.min(44, Math.max(28, unit * .052)));
  const maxWindowWidth = stageWidth * .92 - pad * 2;
  const maxWindowHeight = stageHeight * .94 - pad * 2 - head - foot;
  const windowWidth = Math.max(80, Math.min(maxWindowWidth, maxWindowHeight * ratio));
  const windowHeight = windowWidth / ratio;
  return { width: windowWidth + pad * 2, height: windowHeight + pad * 2 + head + foot, pad, head, foot, windowWidth, windowHeight };
}

function usePercent(value: MotionValue<number>) { return useTransform(value, v => `${(v * 100).toFixed(2)}%`); }

type Props = {
  photo: Photograph;
  title: string;
  alt: string;
  index: number;
  total: number;
  owner: string;
  collection: string;
  hint: { pointer: string; touch: string };
};

export default function PhotoCard({ photo, title, alt, index, total, owner, collection, hint }: Props) {
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size | null>(null);
  const [touchUi, setTouchUi] = useState(false);
  const ratio = photo.width / photo.height;

  // Shared light position, 0..1 on each axis; .5/.5 is the card at rest.
  const px = useMotionValue(.5), py = useMotionValue(.5);
  const spring = { stiffness: 120, damping: 16, mass: .7 };
  const sx = useSpring(px, spring), sy = useSpring(py, spring);
  const rotateY = useTransform(sx, [0, 1], [-MAX_TILT, MAX_TILT]);
  const rotateX = useTransform(sy, [0, 1], [MAX_TILT, -MAX_TILT]);
  const mx = usePercent(sx), my = usePercent(sy);
  const bx = useTransform(sx, v => `${(37 + v * 26).toFixed(2)}%`);
  const by = useTransform(sy, v => `${(33 + v * 34).toFixed(2)}%`);
  const hyp = useTransform(() => Math.min(1, Math.hypot(sx.get() - .5, sy.get() - .5) * 2.4));
  const shadowX = useTransform(sx, [0, 1], [28, -28]);
  const shadowY = useTransform(sy, [0, 1], [22, 44]);
  const shadow = useMotionTemplate`${shadowX}px ${shadowY}px 70px -18px rgba(0,0,0,.6)`;
  const interacting = useRef(false);
  const sweep = useRef<{ stop: () => void }[]>([]);

  useLayoutEffect(() => {
    const node = stage.current;
    if (!node) return;
    const measure = () => setSize(fit(node.clientWidth, node.clientHeight - HINT_SPACE, ratio));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ratio]);

  useEffect(() => {
    const query = matchMedia("(hover: none), (pointer: coarse)");
    const sync = () => setTouchUi(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Intro sweep: after the flip, light glides across the foil so the effect is discoverable.
  useEffect(() => {
    if (reduced) return;
    const controls = sweep.current = [
      animate(px, [.5, .18, .82, .5], { duration: 2.2, delay: .75, ease: "easeInOut" }),
      animate(py, [.5, .3, .62, .5], { duration: 2.2, delay: .75, ease: "easeInOut" }),
    ];
    return () => controls.forEach(c => c.stop());
  }, [index, reduced, px, py]);

  // Device tilt (phones/tablets). Calibrates to how the phone is held when the card opens.
  useEffect(() => {
    if (reduced || !("DeviceOrientationEvent" in window)) return;
    let base: { beta: number; gamma: number } | null = null;
    const onTilt = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null || interacting.current) return;
      sweep.current.forEach(c => c.stop());
      base ??= { beta: event.beta, gamma: event.gamma };
      const clamp = (v: number) => Math.min(1, Math.max(0, v));
      px.set(clamp(.5 + (event.gamma - base.gamma) / 50));
      py.set(clamp(.5 + (event.beta - base.beta) / 50));
    };
    window.addEventListener("deviceorientation", onTilt);
    return () => window.removeEventListener("deviceorientation", onTilt);
  }, [reduced, px, py]);

  const track = (event: ReactPointerEvent) => {
    if (reduced || !card.current) return;
    sweep.current.forEach(c => c.stop());
    const rect = card.current.getBoundingClientRect();
    px.set(Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)));
    py.set(Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)));
  };
  const release = () => { interacting.current = false; px.set(.5); py.set(.5); };

  const number = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  const vars = size ? {
    "--card-w": `${size.width}px`, "--radius": `${Math.round(Math.min(size.width, size.height) * .05)}px`, "--card-pad": `${size.pad}px`, "--card-head": `${size.head}px`, "--card-foot": `${size.foot}px`,
  } as CSSProperties : undefined;

  return <div className="tcg-stage" ref={stage}
    onPointerMove={event => { if (event.pointerType === "mouse" || interacting.current) track(event); }}
    onPointerDown={event => { if (event.pointerType === "mouse") return; interacting.current = true; event.currentTarget.setPointerCapture(event.pointerId); track(event); }}
    onPointerUp={release} onPointerCancel={release}
    onPointerLeave={event => { if (event.pointerType === "mouse") release(); }}>
    {size && <motion.div className="tcg-flip" style={vars}
      initial={reduced ? false : { rotateY: -180, scale: .82, y: 30 }}
      animate={{ rotateY: 0, scale: 1, y: 0 }}
      exit={reduced ? { opacity: 0 } : { rotateY: 90, scale: .9, opacity: 0, transition: { duration: .28, ease: [.7, 0, .84, 0] } }}
      transition={{ duration: 1.3, ease: [.45, .05, .2, 1] }}>
      <motion.div ref={card} className="tcg-card"
        style={reduced ? undefined : { rotateX, rotateY, boxShadow: shadow, "--mx": mx, "--my": my, "--bx": bx, "--by": by, "--hyp": hyp } as unknown as CSSProperties}>
        <div className="tcg-face tcg-front">
          <div className="tcg-holo" aria-hidden="true" />
          <div className="tcg-head"><span className="tcg-name">{title}</span><span className="tcg-number micro">Nº {number}</span></div>
          <div className="tcg-window" style={{ width: size.windowWidth, height: size.windowHeight }}>
            <Image src={photo.src} alt={alt} fill sizes={`${Math.ceil(size.windowWidth)}px`} quality={90} priority />
            <div className="tcg-window-holo" aria-hidden="true" />
          </div>
          <div className="tcg-foot micro"><span>{owner}</span><span className="tcg-mark" aria-hidden="true">◈</span><span>{collection}</span></div>
          <div className="tcg-glare" aria-hidden="true" />
        </div>
        <div className="tcg-face tcg-back" aria-hidden="true">
          <div className="tcg-back-rings">{Array.from({ length: 6 }, (_, i) => <i key={i} style={{ "--i": i } as CSSProperties} />)}</div>
          <span className="tcg-back-mark">GG</span>
          <span className="tcg-back-label micro">DUALITY — {collection}</span>
          <div className="tcg-glare" />
        </div>
      </motion.div>
    </motion.div>}
    {!reduced && <p className="tcg-hint micro" aria-hidden="true">{touchUi ? hint.touch : hint.pointer}</p>}
  </div>;
}
