"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { usePhotography } from "./PhotographyProvider";
import PhotoGrid from "./PhotoGrid";
import { acquireBodyScrollLock } from "@/lib/body-scroll-lock";
import { dualityCopy } from "./locale";
import { MaskLines } from "./motion";

export default function PhotographyWorld() {
  const { photographs, photographyIsDemo } = usePhotography();
  const { language } = useLanguage();
  const copy = dualityCopy[language === "en" ? "en" : "pt"].photography;
  const [selected, setSelected] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const close = useCallback(() => { setSelected(null); dialog.current?.close(); returnFocus.current?.focus({ preventScroll: true }); }, []);
  const open = (index: number) => { returnFocus.current = document.activeElement as HTMLElement; setSelected(index); dialog.current?.showModal(); };
  const change = useCallback((delta: number) => { setDirection(delta); setSelected(i => ((i ?? 0) + delta + photographs.length) % photographs.length); }, [photographs.length]);
  const viewerOpen = selected !== null;
  useEffect(() => {
    if (!viewerOpen) return;
    const releaseScrollLock = acquireBodyScrollLock();
    const key = (event: KeyboardEvent) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); event.stopPropagation(); change(event.key === "ArrowRight" ? 1 : -1); } };
    document.addEventListener("keydown", key, true);
    return () => { releaseScrollLock(); document.removeEventListener("keydown", key, true); };
  }, [viewerOpen, change]);
  const photo = selected === null ? null : photographs[selected];
  const photoTitle = photo ? language === "en" ? photo.title : photo.titlePt ?? photo.title : "";
  const photoAlt = photo ? language === "en" ? photo.alt : photo.altPt ?? photo.alt : "";
  return <div className="photography-world">
    <PhotoGrid open={open} />
    <section className="vision-contact" id="contact"><span className="micro">{copy.contactEyebrow}</span><MaskLines label={`${copy.contactStart} ${copy.contactEnd}`} lines={[copy.contactStart, <em key="end">{copy.contactEnd}</em>]} /><a href="mailto:gustavosgaleazzi@gmail.com">gustavosgaleazzi@gmail.com <span aria-hidden="true">↗</span></a><footer className="micro"><span>GUSTAVO GALEAZZI / {language === "en" ? "TWO WORLDS" : "DOIS UNIVERSOS"}</span><a href="#top">{dualityCopy[language === "en" ? "en" : "pt"].contact.backToTop} ↑</a></footer></section>
    <dialog ref={dialog} className="vision-viewer" onCancel={e => { e.preventDefault(); close(); }} onClick={e => { if (e.target === e.currentTarget) close(); }} aria-label={photo ? `${photoTitle} — ${copy.viewerTitle.toLowerCase()}` : copy.viewerTitle}><header><span className="micro">{photographyIsDemo ? copy.demoOwner : "GUSTAVO GALEAZZI"}</span><button onClick={close} aria-label={copy.closeViewer}>{language === "en" ? "CLOSE" : "FECHAR"} <span aria-hidden="true">×</span></button></header><div className="vision-viewer-image"><AnimatePresence mode="wait" initial={false}>{photo && <motion.div key={selected} initial={reduced ? false : { opacity: 0, x: direction * 35, clipPath: "inset(0 8% 0 8%)" }} animate={{ opacity: 1, x: 0, clipPath: "inset(0)" }} exit={{ opacity: 0, x: -direction * 35 }} transition={{ duration: reduced ? 0 : .4 }}><Image src={photo.src} alt={photoAlt} fill sizes="100vw" /></motion.div>}</AnimatePresence></div><footer><button onClick={() => change(-1)} aria-label={copy.previous}>←</button><div aria-live="polite"><span className="micro">{selected !== null ? String(selected + 1).padStart(2, "0") : "00"} / {String(photographs.length).padStart(2, "0")}</span><h2>{photoTitle}</h2></div><button onClick={() => change(1)} aria-label={copy.next}>→</button></footer></dialog>
  </div>;
}

