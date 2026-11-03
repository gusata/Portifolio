"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePhotography } from "./PhotographyProvider";
import PhotoGrid from "./PhotoGrid";

export default function PhotographyWorld() {
  const { photographs, photographyIsDemo } = usePhotography();
  const [selected, setSelected] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const close = useCallback(() => { setSelected(null); dialog.current?.close(); returnFocus.current?.focus({ preventScroll: true }); }, []);
  const open = (index: number) => { returnFocus.current = document.activeElement as HTMLElement; setSelected(index); dialog.current?.showModal(); };
  const change = useCallback((delta: number) => { setDirection(delta); setSelected(i => ((i ?? 0) + delta + photographs.length) % photographs.length); }, [photographs.length]);
  useEffect(() => {
    if (selected === null) return;
    const previous = document.body.style.overflow; document.body.style.overflow = "hidden";
    const key = (event: KeyboardEvent) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); event.stopPropagation(); change(event.key === "ArrowRight" ? 1 : -1); } };
    document.addEventListener("keydown", key, true);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", key, true); };
  }, [selected, change]);
  const photo = selected === null ? null : photographs[selected];
  return <div className="photography-world">
    <PhotoGrid open={open} />
    <section className="vision-contact" id="contact"><span className="micro">EVERY FRAME STARTS A CONVERSATION.</span><h2>Let’s make<br /><em>something stay.</em></h2><a href="mailto:gustavosgaleazzi@gmail.com">gustavosgaleazzi@gmail.com <span aria-hidden="true">↗</span></a><footer className="micro"><span>GUSTAVO GALEAZZI / TWO WORLDS</span><a href="#top">BACK TO TOP ↑</a></footer></section>
    <dialog ref={dialog} className="vision-viewer" onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === e.currentTarget) close(); }} aria-label={photo ? `${photo.title} — photograph viewer` : "Photograph viewer"}><header><span className="micro">{photographyIsDemo ? "DEMO / UNSPLASH" : "GUSTAVO GALEAZZI"}</span><button onClick={close} aria-label="Close photograph viewer">CLOSE <span aria-hidden="true">×</span></button></header><div className="vision-viewer-image"><AnimatePresence mode="wait" initial={false}>{photo && <motion.div key={selected} initial={reduced ? false : { opacity: 0, x: direction * 35, clipPath: "inset(0 8% 0 8%)" }} animate={{ opacity: 1, x: 0, clipPath: "inset(0)" }} exit={{ opacity: 0, x: -direction * 35 }} transition={{ duration: reduced ? 0 : .4 }}><Image src={photo.src} alt={photo.alt} fill sizes="100vw" /></motion.div>}</AnimatePresence></div><footer><button onClick={() => change(-1)} aria-label="Previous photograph">←</button><div aria-live="polite"><span className="micro">{selected !== null ? String(selected + 1).padStart(2, "0") : "00"} / {String(photographs.length).padStart(2, "0")}</span><h2>{photo?.title}</h2></div><button onClick={() => change(1)} aria-label="Next photograph">→</button></footer></dialog>
  </div>;
}

