"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform, useVelocity } from "framer-motion";
import { useEffect, useState } from "react";
import { projects, type Project } from "@/content/duality";
import { useLanguage } from "@/components/LanguageProvider";
import { dualityCopy } from "./locale";
import { curtain, reveal } from "./motion";

const Arrow = () => <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.4" /></svg>;

const focusLabel = (project: Project) => project.discipline
  .toLowerCase()
  .replace(/\b\w/g, letter => letter.toUpperCase())
  .replace(/\bAi\b/g, "AI")
  .replace(/\bOcr\b/g, "OCR");

const row = {
  hidden: {},
  shown: (i: number) => ({ transition: { delayChildren: 0.12 + i * 0.1, staggerChildren: 0.07 } }),
};
const cell = {
  hidden: { opacity: 0, y: 26 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.9, ease: reveal } },
};
const name = {
  hidden: { y: "110%" },
  shown: { y: "0%", transition: { duration: 1, ease: reveal } },
};
const line = {
  hidden: { scaleX: 0 },
  shown: { scaleX: 1, transition: { duration: 1.3, ease: curtain } },
};

/** Floating preview that trails the pointer over the table (fine pointers only). */
function CursorPreview({ index }: { index: number | null }) {
  const { language } = useLanguage();
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 170, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 170, damping: 22, mass: 0.6 });
  const rotate = useTransform(useVelocity(sx), [-1600, 0, 1600], [-9, 0, 9], { clamp: true });
  // Card sits right of the pointer on the left of the screen and slides to its left near the edge.
  const left = useTransform(sx, v => v + 28 - 396 * (v / (typeof window === "undefined" ? 1440 : window.innerWidth)));
  useEffect(() => {
    const move = (event: PointerEvent) => { x.set(event.clientX); y.set(event.clientY); };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);
  const project = index === null ? null : projects[index];
  return <motion.div className="project-cursor-preview" aria-hidden="true" style={{ x: left, y: sy, rotate }}>
    <AnimatePresence>
      {project && index !== null && <motion.div key={project.name} className="project-cursor-card"
        initial={{ clipPath: "inset(50% 50% 50% 50% round 22px)", scale: 0.85 }}
        animate={{ clipPath: "inset(0% 0% 0% 0% round 22px)", scale: 1 }}
        exit={{ clipPath: "inset(50% 50% 50% 50% round 22px)", scale: 0.85, transition: { duration: 0.35, ease: curtain } }}
        transition={{ duration: 0.55, ease: reveal }}>
        {project.image
          ? <Image src={project.image} alt="" fill sizes="340px" />
          : <div className={`project-study project-study-${index % 3}`}>
            <div className="project-study-grid" />
            <div className="project-study-top micro"><span>{String(index + 1).padStart(2, "0")}</span><span>{language === "en" ? project.discipline : project.disciplinePt ?? project.discipline}</span></div>
            <strong className="project-cursor-name">{project.name}</strong>
          </div>}
      </motion.div>}
    </AnimatePresence>
  </motion.div>;
}

export default function ProjectIndex({ open }: { open: (index: number) => void }) {
  const { language } = useLanguage();
  const copy = dualityCopy[language === "en" ? "en" : "pt"].projects;
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  const [finePointer, setFinePointer] = useState(false);
  useEffect(() => {
    const query = matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFinePointer(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  const animated = !reduced;
  const inView = animated ? { initial: "hidden" as const, whileInView: "shown" as const, viewport: { once: true, margin: "0px 0px -8% 0px" } } : {};
  return <section className="project-index" id="work" aria-label={copy.tableLabel} onPointerLeave={() => setHovered(null)}>
    <div className="project-table-wrap">
      <table className="project-table">
        <caption className="sr-only">{copy.caption}</caption>
        <colgroup><col /><col /><col /><col /></colgroup>
        <thead><tr><th scope="col">{copy.project}</th><th scope="col">{copy.focus}</th><th scope="col">{copy.technologies}</th><th scope="col">{copy.view}</th></tr></thead>
        <tbody>{projects.map((project, index) => <motion.tr key={project.name} custom={index} variants={animated ? row : undefined} {...inView}
          data-active={hovered === index || undefined}
          onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(index); }}
          onPointerLeave={() => setHovered(current => current === index ? null : current)}>
          <th scope="row">
            <span className="project-row-wipe" aria-hidden="true" />
            <motion.span className="project-row-line" aria-hidden="true" variants={animated ? line : undefined} />
            <span className="project-name-mask"><motion.span className="project-name-inner" variants={animated ? name : undefined}>
              <button className="project-table-name" type="button" onClick={() => open(index)} onFocus={() => setHovered(null)} aria-label={copy.open(project.name)}>{project.name}</button>
            </motion.span></span>
          </th>
          <motion.td variants={animated ? cell : undefined}>{language === "en" ? focusLabel(project) : project.disciplinePt ?? project.discipline}</motion.td>
          <motion.td className="project-table-technologies" variants={animated ? cell : undefined}>{project.stack?.join(" · ") ?? "—"}</motion.td>
          <motion.td className="project-table-view" variants={animated ? cell : undefined}><button type="button" onClick={() => open(index)} aria-label={copy.viewProject(project.name)}><Arrow /></button></motion.td>
        </motion.tr>)}</tbody>
      </table>
    </div>
    {finePointer && animated && <CursorPreview index={hovered} />}
  </section>;
}
