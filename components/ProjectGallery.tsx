"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Project = {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  stack: string[];
  href: string;
  live?: string;
  baseColor: string;
  gradient: string;
};

const projects: Project[] = [
  {
    id: "01",
    title: "Claudefy",
    category: "AI Tooling",
    tagline: "AI usage, on your desktop.",
    description:
      "Windows utility that hooks into Claude Code and surfaces real-time token usage, session limits, and plan progress through native OS notifications.",
    stack: ["Python", "PowerShell", "Windows API", "Anthropic API"],
    href: "https://github.com/gusata/ClaudeFy",
    baseColor: "#0e0700",
    gradient:
      "radial-gradient(circle at 78% 18%, rgba(244,81,30,0.62) 0%, transparent 48%), radial-gradient(circle at 18% 82%, rgba(251,187,92,0.28) 0%, transparent 44%)",
  },
  {
    id: "02",
    title: "LEIA",
    category: "AI / Docs",
    tagline: "Documentation at the speed of thought.",
    description:
      "AI-powered code documentation engine. Analyzes your entire codebase and generates comprehensive docs 420× faster than writing by hand.",
    stack: ["JavaScript", "HTML", "CSS"],
    href: "https://github.com/gusata/LEIA",
    baseColor: "#0b0900",
    gradient:
      "radial-gradient(circle at 28% 28%, rgba(251,187,92,0.58) 0%, transparent 50%), radial-gradient(circle at 78% 78%, rgba(244,81,30,0.2) 0%, transparent 42%)",
  },
  {
    id: "03",
    title: "Bob",
    category: "Product / UI",
    tagline: "Your browser, your rules.",
    description:
      "Minimalist browser startpage with an instant note editor and smart text shortcuts. Everything stored locally — no accounts, no servers.",
    stack: ["React", "TypeScript", "Vite", "Tailwind"],
    href: "https://github.com/gusata/Bob",
    live: "https://bob-webpage.vercel.app/",
    baseColor: "#0d0600",
    gradient:
      "radial-gradient(circle at 68% 28%, rgba(244,81,30,0.52) 0%, transparent 46%), radial-gradient(circle at 22% 72%, rgba(251,187,92,0.24) 0%, transparent 44%)",
  },
  {
    id: "04",
    title: "Formazzi",
    category: "Full Stack",
    tagline: "Train teams. Build futures.",
    description:
      "Corporate training platform with modules for courses, certifications, assessments, and employee progress tracking across the full stack.",
    stack: ["Django", "Next.js", "TypeScript", "Python"],
    href: "https://github.com/gusata/Front_Formazzi",
    baseColor: "#090900",
    gradient:
      "radial-gradient(circle at 50% 22%, rgba(251,187,92,0.52) 0%, transparent 52%), radial-gradient(circle at 62% 78%, rgba(244,81,30,0.22) 0%, transparent 40%)",
  },
  {
    id: "05",
    title: "Quiet Head",
    category: "Product",
    tagline: "Focus, distilled.",
    description:
      "An automotive social network where car lovers can socialize.",
    stack: ["TypeScript", "Next.js", "React native"],
    href: "https://github.com/gusata/Quiet-Head",
    live: "https://quiet-head.vercel.app/",
    baseColor: "#080808",
    gradient:
      "radial-gradient(circle at 62% 38%, rgba(244,81,30,0.28) 0%, transparent 50%)",
  },
  {
    id: "06",
    title: "Blitz",
    category: "Product",
    tagline: "Move fast. Think clearly.",
    description: "Project developed to ensure information is sent to the system using Artificial Intelligence OCR.",
    stack: ["TypeScript"],
    href: "#",
    baseColor: "#080808",
    gradient:
      "radial-gradient(circle at 42% 55%, rgba(251,187,92,0.3) 0%, transparent 50%)",
  },
];

// ─── Row ──────────────────────────────────────────────────────────────────────

function Row({
  project,
  index,
  isActive,
  isVisible,
  onEnter,
  onLeave,
  onClick,
}: {
  project: Project;
  index: number;
  isActive: boolean;
  isVisible: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  return (
    <motion.div
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
      transition={{ delay: index * 0.05, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={`group flex cursor-pointer items-center gap-5 border-b border-white/[0.05] border-l-2 py-[1.15rem] pl-5 transition-all duration-200 ${
        isActive ? "border-l-[var(--accent)]" : "border-l-transparent"
      }`}
    >
      {/* Index */}
      <span className="w-6 shrink-0 font-mono text-[10px] tabular-nums text-white/20">
        {project.id}
      </span>

      {/* Title */}
      <span
        className={`flex-1 font-black leading-none tracking-tight transition-colors duration-200 ${
          isActive ? "text-white" : "text-white/38"
        }`}
        style={{ fontSize: "clamp(1.25rem, 2vw, 1.75rem)" }}
      >
        {project.title}
      </span>

      {/* Category */}
      <span
        className={`hidden text-[10px] uppercase tracking-[0.42em] transition-colors duration-200 sm:block ${
          isActive ? "text-[var(--accent)]" : "text-white/20"
        }`}
      >
        {project.category}
      </span>

      {/* Stack hint */}
      <span
        className={`hidden font-mono text-[10px] text-white/20 transition-opacity duration-200 lg:block ${
          isActive ? "opacity-0" : "opacity-100"
        }`}
      >
        {project.stack[0]}
      </span>

      {/* Arrow */}
      <span
        className={`text-sm text-[var(--accent)] transition-all duration-200 ${
          isActive ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
        }`}
      >
        →
      </span>
    </motion.div>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

export function ProjectGallery() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [panelIdx, setPanelIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const snappedRef = useRef(false);

  const handleEnter = (i: number) => {
    setPanelIdx(i);
    setHovered(i);
  };

  useEffect(() => {
    if (selected === null) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [selected]);

  useEffect(() => {
    const container = document.querySelector(".scroll-container");
    const section = sectionRef.current;
    if (!container || !section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        if (e.isIntersecting) {
          setIsVisible(true);
          if (e.intersectionRatio > 0.85 && !snappedRef.current) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
            snappedRef.current = true;
          }
        } else {
          snappedRef.current = false;
        }
      },
      { root: container, threshold: [0.25, 0.5, 0.85] },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const proj = projects[panelIdx];

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative flex h-screen flex-col overflow-hidden text-[var(--foreground)]"
    >
      {/* Header */}
      <motion.div
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex shrink-0 items-center justify-between border-b border-white/[0.05] px-6 py-5 sm:px-10 lg:px-14"
      >
        <p className="text-[10px] uppercase tracking-[0.65em] text-[var(--muted)]/55">
          Selected Work
        </p>
        <p className="font-mono text-[10px] text-[var(--muted)]/30">06</p>
      </motion.div>

      {/* Body */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* ── Project list ── */}
        <div className="flex flex-1 flex-col justify-center px-6 sm:px-10 lg:px-14">
          {projects.map((p, i) => (
            <Row
              key={p.id}
              project={p}
              index={i}
              isActive={hovered === i}
              isVisible={isVisible}
              onEnter={() => handleEnter(i)}
              onLeave={() => setHovered(null)}
              onClick={() => setSelected(i)}
            />
          ))}
        </div>

        {/* ── Detail panel ── */}
        <div
          className="hidden shrink-0 overflow-hidden border-l border-white/[0.04] transition-opacity duration-300 lg:block"
          style={{
            width: 340,
            opacity: hovered !== null ? 1 : 0,
            pointerEvents: hovered !== null ? "auto" : "none",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={panelIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              className="relative h-full"
              style={{ backgroundColor: proj.baseColor }}
            >
              {/* Gradient light */}
              <div
                className="absolute inset-0"
                style={{ backgroundImage: proj.gradient }}
              />


              {/* Dark vignette — heavier at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                {/* Top — category badge */}
                <span className="inline-flex self-start rounded-full border border-white/[0.1] bg-black/30 px-3 py-[5px] text-[9.5px] uppercase tracking-[0.38em] text-white/50 backdrop-blur-sm">
                  {proj.category}
                </span>

                {/* Bottom — all info */}
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="mb-1 font-mono text-[9px] text-[var(--accent)]/70">
                      {proj.id}
                    </p>
                    <h3 className="text-[1.7rem] font-black leading-none tracking-tight">
                      {proj.title}
                    </h3>
                    <p className="mt-1 text-[11px] text-white/40">{proj.tagline}</p>
                  </div>

                  <p className="line-clamp-3 text-[11.5px] leading-relaxed text-white/38">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-[5px]">
                    {proj.stack.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/[0.08] bg-white/[0.04] px-[10px] py-[3px] font-mono text-[10px] text-white/45"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-6 border-t border-white/[0.07] pt-3">
                    <a
                      href={proj.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/l flex items-center gap-2 text-[11.5px] font-medium text-white/55 transition-colors hover:text-white"
                    >
                      <span className="transition-transform duration-200 group-hover/l:translate-x-1">
                        →
                      </span>
                      GitHub
                    </a>
                    {proj.live && (
                      <a
                        href={proj.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/l flex items-center gap-2 text-[11.5px] text-[var(--accent)]/65 transition-colors hover:text-[var(--accent)]"
                      >
                        <span className="transition-transform duration-200 group-hover/l:translate-x-1">
                          ↗
                        </span>
                        Live
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {/* ── Modal ── */}
      <AnimatePresence>
        {selected !== null && (() => {
          const m = projects[selected];
          return (
            <>
              <motion.div
                key="bd"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl"
                onClick={() => setSelected(null)}
              />
              <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-5">
                <motion.div
                  key="modal"
                  initial={{ opacity: 0, scale: 0.93, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 10 }}
                  transition={{ type: "spring", stiffness: 340, damping: 32 }}
                  className="pointer-events-auto w-full max-w-[380px] overflow-hidden rounded-[22px]"
                  style={{
                    backgroundColor: m.baseColor,
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.09), 0 48px 120px rgba(0,0,0,0.92)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Visual header */}
                  <div className="relative h-52 overflow-hidden">
                    <div className="absolute inset-0" style={{ backgroundImage: m.gradient }} />
                    <div
                      className="absolute inset-0"
                      style={{ background: `linear-gradient(to bottom, transparent 30%, ${m.baseColor} 100%)` }}
                    />
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.12] bg-black/40 text-sm text-white/60 backdrop-blur-md transition-all hover:border-white/25 hover:text-white"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-0 left-0 p-5">
                      <p className="mb-1 font-mono text-[10px] text-[var(--accent)]/80">{m.id}</p>
                      <h3 className="text-[2rem] font-black leading-none tracking-tight text-white">{m.title}</h3>
                      <p className="mt-[5px] text-[11px] text-white/45">{m.tagline}</p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col gap-5 p-5 pt-4">
                    <p className="text-[13px] leading-relaxed text-white/50">{m.description}</p>
                    <div className="flex flex-wrap gap-[5px]">
                      {m.stack.map((t) => (
                        <span key={t} className="rounded-full border border-white/[0.1] bg-white/[0.05] px-3 py-[4px] font-mono text-[11px] text-white/55">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-7 border-t border-white/[0.07] pt-4">
                      <a
                        href={m.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/l flex items-center gap-2 text-[13px] font-medium text-white/70 transition-colors hover:text-white"
                      >
                        <span className="transition-transform duration-200 group-hover/l:translate-x-1">→</span>
                        GitHub
                      </a>
                      {m.live && (
                        <a
                          href={m.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/l flex items-center gap-2 text-[13px] text-[var(--accent)]/70 transition-colors hover:text-[var(--accent)]"
                        >
                          <span className="transition-transform duration-200 group-hover/l:translate-x-1">↗</span>
                          Live
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          );
        })()}
      </AnimatePresence>
    </section>
  );
}
