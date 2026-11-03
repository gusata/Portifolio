"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { projects, type Project } from "@/content/duality";

type Group = "All" | "Tools" | "Products";
const groupOf = (project: Project): Group => project.discipline.startsWith("AI") || project.discipline.includes("OCR") ? "Tools" : "Products";
const ordinal = (i: number) => String(i + 1).padStart(2, "0");
const Arrow = () => <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.4" /></svg>;

export default function ProjectIndex({ open, artwork }: { open: (index: number) => void; artwork: (project: Project, index: number) => ReactNode }) {
  const [group, setGroup] = useState<Group>("All");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(() => Math.max(0, projects.findIndex(p => p.image)));
  const reduced = useReducedMotion();
  const visible = projects.map((project, index) => ({ project, index })).filter(({ project }) =>
    (group === "All" || groupOf(project) === group) && `${project.name} ${project.discipline} ${project.description}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const current = visible.find(item => item.index === active) ?? visible[0];
  const select = (index: number) => { setActive(index); open(index); };

  return <section className="project-index" id="work" aria-labelledby="project-index-title">
    <div className="index-heading"><div><span className="micro">01 / THE WORK INDEX</span><h2 id="project-index-title">Ideas, made<br /><em>tangible.</em></h2></div><div className="index-intro"><span className="index-total">{String(projects.length).padStart(2, "0")}<span>PROJECTS</span></span><p>Tools, products and the curiosity<br />that connects them.</p></div></div>
    <div className="index-controls"><div className="index-filters" role="group" aria-label="Filter projects">{(["All", "Tools", "Products"] as const).map(item => <button key={item} onClick={() => setGroup(item)} aria-pressed={group === item}>{item}<span>{projects.filter(p => item === "All" || groupOf(p) === item).length}</span></button>)}</div><div className="index-search"><label htmlFor="project-search" className="sr-only">Search projects</label><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" width="18" height="18"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.4" /><path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.4" /></svg><input type="search" id="project-search" placeholder="Find a project" value={query} onChange={e => setQuery(e.target.value)} /><button aria-label="Reset project filters and search" disabled={!query && group === "All"} onClick={() => { setQuery(""); setGroup("All"); }}>RESET</button></div></div>
    <div className="index-body">
      <div className="index-list"><div className="index-list-heading micro"><span>PROJECT / DISCIPLINE</span><span aria-live="polite" aria-atomic="true">{visible.length} OF {projects.length} PROJECTS</span></div><ul>{visible.map(({ project, index }) => <li key={project.name}><button className="index-row" data-active={current?.index === index} onPointerEnter={e => { if (e.pointerType !== "touch") setActive(index); }} onFocus={() => setActive(index)} onClick={() => select(index)} aria-label={`Open ${project.name} project details`}><span className="index-number micro">{ordinal(index)}</span><span className="index-mobile-image" aria-hidden="true">{project.image ? <Image src={project.image} alt="" fill sizes="80px" /> : <span>{project.name.slice(0, 2)}</span>}</span><span className="index-row-copy"><strong>{project.name}</strong><span className="micro">{project.discipline}</span></span><span className="index-row-arrow"><Arrow /></span></button></li>)}</ul>{!visible.length && <div className="index-empty"><span className="micro">NO MATCHES</span><h3>Nothing here.<br /><em>Try another idea.</em></h3><p>Try a different name or reset the filters above.</p></div>}<p className="index-list-note micro">CHOOSE A PROJECT TO EXPLORE THE DETAILS.</p></div>
      <aside className="index-preview" aria-label="Project preview">{current ? <><div className="index-preview-meta micro"><span>IN FOCUS</span><span>{ordinal(current.index)} / {String(projects.length).padStart(2, "0")}</span></div><motion.div className="index-preview-art" layoutId={`art-${current.index}`}><AnimatePresence initial={false} mode="wait"><motion.button key={current.index} className="index-preview-open" onClick={() => select(current.index)} aria-label={`Explore ${current.project.name} preview`} initial={reduced ? false : { opacity: 0, y: 12, scale: 1.025 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: reduced ? 0 : .22 }}><span className="index-art-content">{artwork(current.project, current.index)}</span><span className="index-preview-cta">EXPLORE PROJECT <Arrow /></span></motion.button></AnimatePresence></motion.div><div className="index-preview-copy"><div><span className="micro">{current.project.image ? "PRODUCT PREVIEW" : "TYPOGRAPHIC STUDY / NOT A SCREENSHOT"}</span><h3>{current.project.name}</h3></div><p>{current.project.description}</p></div></> : <div className="index-preview-unselected" aria-hidden="true"><span>—</span><span className="micro">A NEW SEARCH. A NEW POSSIBILITY.</span></div>}</aside>
    </div>
  </section>;
}
