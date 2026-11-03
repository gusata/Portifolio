"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { usePhotography } from "./PhotographyProvider";

const colors = ["#d9c7b5", "#ced7d4", "#c8cbb4", "#c8c6d7", "#c5d0c7", "#d0d9d3", "#d9cdb4", "#e3c4ad"];
const n = (i: number) => String(i + 1).padStart(2, "0");
export default function ContactRoom({ open }: { open: (index: number) => void }) {
  const { photographs, photographyIsDemo } = usePhotography();
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const previous = (active + photographs.length - 1) % photographs.length;
  const next = (active + 1) % photographs.length;
  return <section className="contact-room" id="work" style={{ backgroundColor: colors[active % colors.length] }}>
    <svg className="squircle-defs" aria-hidden="true"><defs><clipPath id="contact-squircle" clipPathUnits="objectBoundingBox"><path d="M.18 0H.82C.95 0 1 .05 1 .18V.82C1 .95 .95 1 .82 1H.18C.05 1 0 .95 0 .82V.18C0 .05 .05 0 .18 0Z" /></clipPath></defs></svg>
    <div className="room-caption micro"><span>GUSTAVO GALEAZZI / PHOTOGRAPHY</span><span>A COLLECTION OF LITTLE ESCAPES.</span></div>
    <div className="room-heading"><h1>Out of<br /><em>frame.</em><span className="room-period">*</span></h1><p>Places to get lost in.<br />Moments to keep.</p></div>
    <div className="room-stage">
      {photographs.length > 1 && <motion.button className="room-print room-print-back soft-cut" onClick={() => setActive(previous)} aria-label={`Select previous frame, ${photographs[previous].title}`} animate={{ rotate: -11, x: reduced ? 0 : -8 }} transition={{ type: "spring", stiffness: 100, damping: 22 }}><Image src={photographs[previous].src} alt="" fill sizes="30vw" /></motion.button>}
      {photographs.length > 1 && <button className="room-print room-print-next soft-cut" onClick={() => setActive(next)} aria-label={`Select next frame, ${photographs[next].title}`}><Image src={photographs[next].src} alt="" fill sizes="30vw" /></button>}
      <motion.div className="room-feature" animate={{ rotate: active % 2 ? 2 : -2 }} transition={{ type: "spring", stiffness: 110, damping: 22 }}>
        <button className="room-feature-image soft-cut" onClick={() => open(active)} aria-label={`Open ${photographs[active].title} full screen`}>
          <AnimatePresence initial={false} mode="popLayout"><motion.span key={active} className="room-image-layer" initial={reduced ? false : { opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .55 }}><Image src={photographs[active].src} alt={photographs[active].alt} fill priority={active === 0} sizes="(max-width:600px) 95vw, 65vw" /></motion.span></AnimatePresence>
          <span className="room-open">LOOK CLOSER <span aria-hidden="true">↗</span></span>
        </button>
        <div className="room-feature-caption"><span className="micro">{n(active)} / {String(photographs.length).padStart(2, "0")}</span><span aria-live="polite">{photographs[active].title}</span><span className="micro">A MOMENT, HELD.</span></div>
      </motion.div>
      <button disabled={photographs.length < 2} className="room-shuffle" onClick={() => setActive(i => (i + (photographs.length % 3 === 0 ? 1 : 3)) % photographs.length)} aria-label="Discover another photograph"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 5h3c4 0 8 14 12 14h3m-4-4 4 4-4 4M3 19h3c4 0 8-14 12-14h3m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" /></svg><span>ANOTHER<br />PERSPECTIVE</span></button>
    </div>
    <div className="room-footer"><a className="micro" href="#collected">THE REST IS WORTH A LOOK <span aria-hidden="true">↓</span></a><div className="room-thumbnail-tray" role="group" aria-label="Choose a featured photograph">{photographs.map((photo, i) => <button key={photo.src} className={i === active ? "selected" : ""} aria-pressed={i === active} aria-label={`Select ${photo.title}`} onClick={() => setActive(i)}><span className="soft-cut"><Image src={photo.src} alt="" fill sizes="75px" /></span></button>)}</div><span className="micro room-demo">{photographyIsDemo ? <>DEMO IMAGERY<br />UNSPLASH</> : <>ORIGINAL PHOTOGRAPHY<br />GUSTAVO GALEAZZI</>}</span></div>
  </section>;
}
