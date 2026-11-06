"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { usePhotography } from "./PhotographyProvider";
import { dualityCopy } from "./locale";
import { MaskLines, curtain, reveal } from "./motion";

const frame = {
  hidden: { clipPath: "inset(100% 0% 0% 0% round 24px)" },
  shown: (column: number) => ({ clipPath: "inset(0% 0% 0% 0% round 24px)", transition: { duration: 1.15, ease: curtain, delay: column * .09 }, transitionEnd: { clipPath: "none" } }),
};
const media = {
  hidden: { scale: 1.28 },
  shown: (column: number) => ({ scale: 1, transition: { duration: 1.6, ease: reveal, delay: column * .09 } }),
};

const BATCH = 24;
const columnsFor = (width: number) => width >= 1100 ? 4 : width >= 700 ? 3 : 2;

export default function PhotoGrid({ open }: { open: (index: number) => void }) {
  const { photographs, photographyIsDemo } = usePhotography();
  const { language } = useLanguage();
  const copy = dualityCopy[language === "en" ? "en" : "pt"].photography;
  const reduced = useReducedMotion();
  const [limit, setLimit] = useState(BATCH);
  const [width, setWidth] = useState(1280);
  const container = useRef<HTMLDivElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const hasMore = limit < photographs.length;
  useLayoutEffect(() => {
    const node = container.current;
    if (!node) return;
    const measure = () => setWidth(node.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!hasMore || !sentinel.current || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        setLimit(n => Math.min(n + BATCH, photographs.length));
      }
    }, { rootMargin: "600px 0px" });
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [hasMore, limit, photographs.length]);
  const columns = columnsFor(width);
  const gap = width < 700 ? 12 : 20;
  const cardWidth = (width - gap * (columns - 1)) / columns;
  return <section className="photo-grid-section" id="work" aria-labelledby="photo-grid-title">
    <header className="photo-grid-heading"><div><span className="micro">{copy.eyebrow}</span><MaskLines as="h1" id="photo-grid-title" onMount delay={.3} label={`${copy.titleStart} ${copy.titleEnd}`} lines={[<>{copy.titleStart} <em>{copy.titleEnd}</em></>]} /></div><div className="photo-grid-heading-note"><span className="micro">{String(photographs.length).padStart(2, "0")} {copy.count}</span><p>{copy.intro}</p></div></header>
    <div className="photo-grid-info micro"><span>{photographyIsDemo ? copy.demo : copy.original}</span><span>{copy.selectFrame} <span aria-hidden="true">↗</span></span></div>
    <div className="photo-masonry" ref={container} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, columnGap: gap }}>
      {photographs.slice(0, limit).map((photo, index) => <motion.div className="photo-grid-cell" key={photo.src} custom={index % columns} variants={reduced ? undefined : frame} initial={reduced ? false : "hidden"} whileInView="shown" viewport={{ once: true, margin: "0px 0px -6% 0px" }} style={{ gridRowEnd: `span ${Math.ceil((cardWidth * photo.height / photo.width + gap) / 4)}` }}>
        <button className="photo-grid-open" aria-label={copy.viewFull(language === "en" ? photo.title : photo.titlePt ?? photo.title)} onClick={() => open(index)} style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
          <motion.span className="photo-grid-media" custom={index % columns} variants={reduced ? undefined : media}><Image src={photo.src} alt={language === "en" ? photo.alt : photo.altPt ?? photo.alt} width={photo.width} height={photo.height} sizes="(max-width:700px) 47vw, (max-width:1100px) 31vw, 24vw" loading={index < 2 ? "eager" : "lazy"} /></motion.span>
          <span className="photo-grid-caption"><span><small>{String(index + 1).padStart(2, "0")}</small>{language === "en" ? photo.title : photo.titlePt ?? photo.title}</span><span aria-hidden="true">↗</span></span>
        </button>
      </motion.div>)}
    </div>
    <div className="photo-grid-loading" ref={sentinel}><span className="micro" role="status" aria-live="polite" aria-atomic="true">{Math.min(limit, photographs.length)} / {photographs.length} {copy.count}</span>{hasMore ? <button onClick={() => {
      const firstNew = Math.min(limit, photographs.length);
      setLimit(n => Math.min(n + BATCH, photographs.length));
      requestAnimationFrame(() => container.current?.querySelectorAll<HTMLButtonElement>(".photo-grid-open")[firstNew]?.focus());
    }}>{copy.loadMore} <span aria-hidden="true">↓</span></button> : <span className="micro">{copy.collectionSeen}</span>}</div>
    {photographyIsDemo && <p className="photo-grid-demo micro">{copy.demoNote}</p>}
  </section>;
}
