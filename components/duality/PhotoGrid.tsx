"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePhotography } from "./PhotographyProvider";

const BATCH = 24;
const columnsFor = (width: number) => width >= 1100 ? 4 : width >= 700 ? 3 : 2;

export default function PhotoGrid({ open }: { open: (index: number) => void }) {
  const { photographs, photographyIsDemo } = usePhotography();
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
    <header className="photo-grid-heading"><div><span className="micro">GUSTAVO GALEAZZI / PHOTOGRAPHY</span><h1 id="photo-grid-title">A way of <em>seeing.</em></h1></div><div className="photo-grid-heading-note"><span className="micro">{String(photographs.length).padStart(2, "0")} PHOTOGRAPHS</span><p>Places. Light. Little moments.</p></div></header>
    <div className="photo-grid-info micro"><span>{photographyIsDemo ? "DEMO COLLECTION / UNSPLASH" : "ORIGINAL PHOTOGRAPHY"}</span><span>SELECT A FRAME TO LOOK CLOSER <span aria-hidden="true">↗</span></span></div>
    <div className="photo-masonry" ref={container} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, columnGap: gap }}>
      {photographs.slice(0, limit).map((photo, index) => <div className="photo-grid-cell" key={photo.src} style={{ gridRowEnd: `span ${Math.ceil((cardWidth * photo.height / photo.width + gap) / 4)}` }}>
        <button className="photo-grid-open" aria-label={`View ${photo.title} full screen`} onClick={() => open(index)} style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
          <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width:700px) 47vw, (max-width:1100px) 31vw, 24vw" loading={index < 2 ? "eager" : "lazy"} />
          <span className="photo-grid-caption"><span><small>{String(index + 1).padStart(2, "0")}</small>{photo.title}</span><span aria-hidden="true">↗</span></span>
        </button>
      </div>)}
    </div>
    <div className="photo-grid-loading" ref={sentinel}><span className="micro" role="status" aria-live="polite" aria-atomic="true">{Math.min(limit, photographs.length)} / {photographs.length} PHOTOGRAPHS</span>{hasMore ? <button onClick={() => {
      const firstNew = Math.min(limit, photographs.length);
      setLimit(n => Math.min(n + BATCH, photographs.length));
      requestAnimationFrame(() => container.current?.querySelectorAll<HTMLButtonElement>(".photo-grid-open")[firstNew]?.focus());
    }}>LOAD MORE <span aria-hidden="true">↓</span></button> : <span className="micro">YOU’VE SEEN THE COLLECTION.</span>}</div>
    {photographyIsDemo && <p className="photo-grid-demo micro">Generic Unsplash images for layout preview. Not photographs by Gustavo Galeazzi.</p>}
  </section>;
}
