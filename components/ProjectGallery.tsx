"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";

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
  image?: string;
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
    image: "/quiet.png",
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
    image: "/blitz.png",
  },
];

function ProjectVisual({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <div className={`project-art ${compact ? "project-art--compact" : ""}`} aria-hidden="true">
      {project.image ? (
        <Image
          src={project.image}
          alt=""
          fill
          sizes={compact ? "380px" : "(min-width: 1024px) 42vw, 100vw"}
          quality={75}
          className="project-art-image"
        />
      ) : (
        <>
          <span className="project-art-symbol">{project.id}</span>
          <span className="project-art-orbit" />
          <ProjectMockup project={project} />
        </>
      )}
    </div>
  );
}

function ProjectMockup({ project }: { project: Project }) {
  return (
    <div className={`project-mockup project-mockup--${project.id}`}>
      <div className="project-mockup-toolbar">
        <span className="project-window-dots"><i /><i /><i /></span>
        <span className="project-mockup-title">{project.title}</span>
        <span className="project-mockup-live">● LIVE</span>
      </div>

      {project.id === "01" && (
        <div className="project-mockup-claudefy">
          <div className="mockup-app-heading">
            <span className="mockup-app-icon">✳</span>
            <span><strong>Session usage</strong><small>CLAUDE CODE · NOW</small></span>
            <span className="mockup-plan-chip">PRO</span>
          </div>
          <strong className="mockup-token-count">68,420</strong>
          <span className="mockup-token-label">TOKENS USED</span>
          <div className="mockup-meter"><i /></div>
          <div className="mockup-microcopy"><span>SESSION WINDOW</span><span>68%</span></div>
        </div>
      )}

      {project.id === "02" && (
        <div className="project-mockup-flow">
          <div className="mockup-source-card">
            <span className="mockup-file-label">SOURCE / CORE.TS</span>
            <i /><i /><i /><i />
            <span className="mockup-flow-arrow">↗</span>
          </div>
          <div className="mockup-doc-card">
            <span className="mockup-doc-icon">文</span>
            <strong>Architecture</strong>
            <i /><i /><i />
            <span className="mockup-doc-tag">GENERATED · 0.4s</span>
          </div>
        </div>
      )}

      {project.id === "03" && (
        <div className="project-mockup-browser">
          <p className="mockup-greeting">Good morning, Gustavo<span>✳</span></p>
          <div className="mockup-search"><span>⌕</span> Find a thought, a link, a note…</div>
          <div className="mockup-shortcuts"><i>INBOX <b>04</b></i><i>NOTES <b>12</b></i><i>FOCUS <b>→</b></i></div>
        </div>
      )}

      {project.id === "04" && (
        <div className="project-mockup-learning">
          <div className="mockup-learning-heading"><span><small>LEARNING PATH</small><strong>Design systems</strong></span><b>72%</b></div>
          <div className="mockup-learning-track"><i /></div>
          <div className="mockup-learning-courses"><span><b>01</b> Foundations <i>✓</i></span><span><b>02</b> Components <i>●</i></span><span><b>03</b> Assessment <i>···</i></span></div>
        </div>
      )}
    </div>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function Row({
  project,
  index,
  isActive,
  isVisible,
  onEnter,
  onClick,
  openLabel,
}: {
  project: Project;
  index: number;
  isActive: boolean;
  isVisible: boolean;
  onEnter: () => void;
  onClick: () => void;
  openLabel: string;
}) {
  return (
    <motion.button
      type="button"
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
      transition={{ delay: index * 0.05, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={onEnter}
      onFocus={onEnter}
      onClick={onClick}
      data-cursor-label={openLabel}
      className={`group flex w-full cursor-pointer items-center gap-5 border-b border-white/[0.05] border-l-2 py-[1.15rem] pl-5 text-left transition-all duration-200 ${
        isActive ? "border-l-[var(--accent)]" : "border-l-transparent"
      }`}
    >
      {/* Index */}
      <span className="w-6 shrink-0 font-mono text-[10px] tabular-nums text-white/20">
        {project.id}
      </span>

      {/* Title */}
      <span
        className={`project-row-title flex-1 font-black leading-none tracking-tight transition-colors duration-200 ${
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
    </motion.button>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────

export function ProjectGallery() {
  const { language, copy } = useLanguage();
  const [panelIdx, setPanelIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const handleEnter = (i: number) => {
    setPanelIdx(i);
  };

  useEffect(() => {
    if (selected === null) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [selected]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        if (e.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(section);
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const localizedProjects = projects.map((project, index) => ({
    ...project,
    ...copy.projects.items[index],
  }));
  const proj = localizedProjects[panelIdx];

  const movePreviewLight = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    event.currentTarget.style.setProperty("--pointer-x", `${x}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${y}px`);
    const xOffset = ((x / bounds.width) - 0.5) * 18;
    const yOffset = ((y / bounds.height) - 0.5) * 14;
    event.currentTarget.style.setProperty("--pointer-shift-x", `${xOffset.toFixed(1)}px`);
    event.currentTarget.style.setProperty("--pointer-shift-y", `${yOffset.toFixed(1)}px`);
  };

  const resetPreviewLight = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--pointer-x", "50%");
    event.currentTarget.style.setProperty("--pointer-y", "42%");
    event.currentTarget.style.setProperty("--pointer-shift-x", "0px");
    event.currentTarget.style.setProperty("--pointer-shift-y", "0px");
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      lang={language === "jp" ? "ja" : language}
      className="relative flex min-h-screen flex-col overflow-hidden text-[var(--foreground)] lg:h-screen"
    >
      {/* Header */}
      <motion.div
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex shrink-0 items-center justify-between border-b border-white/[0.05] px-6 py-5 sm:px-10 lg:px-14"
      >
        <p className="text-[10px] uppercase tracking-[0.65em] text-[var(--muted)]/55">
          {copy.projects.section}
        </p>
        <p className="font-mono text-[10px] text-[var(--muted)]/30">06</p>
      </motion.div>

      {/* Body */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* ── Project list ── */}
        <div className="flex min-w-0 flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-8">
          <div className="mb-5 flex items-end justify-between gap-6 sm:mb-7">
            <div>
              <p className="mb-3 text-[9px] uppercase tracking-[0.42em] text-[var(--accent-alt)]/65">
                {copy.projects.eyebrow}
              </p>
              <h2 className="font-black leading-[0.88] tracking-[-0.07em] text-white" style={{ fontSize: "clamp(2.8rem, 5.2vw, 5.6rem)" }}>
                {copy.projects.titleOne}<br />
                <span className="text-white/35">{copy.projects.titleTwo}</span>
              </h2>
            </div>
            <span className="mb-1 hidden font-serif text-5xl text-white/[0.12] sm:block" lang="ja" aria-hidden="true">作品</span>
          </div>
          <div className="flex flex-col">
            {localizedProjects.map((p, i) => (
              <Row
                key={p.id}
                project={p}
                index={i}
                isActive={panelIdx === i}
                isVisible={isVisible}
                onEnter={() => handleEnter(i)}
                onClick={() => setSelected(i)}
                openLabel={copy.projects.open}
              />
            ))}
          </div>
        </div>

        {/* ── Detail panel ── */}
        <div
          className="hidden w-[min(42vw,620px)] shrink-0 overflow-hidden border-l border-white/[0.04] lg:block"
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
              onPointerMove={movePreviewLight}
              onPointerLeave={resetPreviewLight}
            >
              {/* Gradient light */}
              <div
                className="absolute inset-0"
                style={{ backgroundImage: proj.gradient }}
              />
              <ProjectVisual project={proj} />
              <div className="project-pointer-light absolute inset-0" aria-hidden="true" />


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

                  {(proj.href !== "#" || proj.live) && (
                    <div className="flex items-center gap-6 border-t border-white/[0.07] pt-3">
                      {proj.href !== "#" && (
                        <a
                          href={proj.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/l flex items-center gap-2 text-[11.5px] font-medium text-white/55 transition-colors hover:text-white"
                        >
                          <span className="transition-transform duration-200 group-hover/l:translate-x-1">→</span>
                          {copy.projects.github}
                        </a>
                      )}
                      {proj.live && (
                        <a
                          href={proj.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/l flex items-center gap-2 text-[11.5px] text-[var(--accent)]/65 transition-colors hover:text-[var(--accent)]"
                        >
                          <span className="transition-transform duration-200 group-hover/l:translate-x-1">↗</span>
                          {copy.projects.live}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {/* ── Modal ── */}
      <AnimatePresence>
        {selected !== null && (() => {
          const m = localizedProjects[selected];
          return (
            <>
              <motion.div
                key="bd"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
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
                  role="dialog"
                  aria-modal="true"
                    aria-label={`${m.title} project details`}
                  style={{
                    backgroundColor: m.baseColor,
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.09), 0 48px 120px rgba(0,0,0,0.92)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Visual header */}
                  <div className="relative h-52 overflow-hidden">
                    <div className="absolute inset-0" style={{ backgroundImage: m.gradient }} />
                    <ProjectVisual project={m} compact />
                    <div
                      className="absolute inset-0"
                      style={{ background: `linear-gradient(to bottom, transparent 30%, ${m.baseColor} 100%)` }}
                    />
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      aria-label={copy.projects.close}
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
                    {(m.href !== "#" || m.live) && (
                      <div className="flex items-center gap-7 border-t border-white/[0.07] pt-4">
                        {m.href !== "#" && (
                          <a
                            href={m.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/l flex items-center gap-2 text-[13px] font-medium text-white/70 transition-colors hover:text-white"
                          >
                            <span className="transition-transform duration-200 group-hover/l:translate-x-1">→</span>
                            {copy.projects.github}
                          </a>
                        )}
                        {m.live && (
                          <a
                            href={m.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/l flex items-center gap-2 text-[13px] text-[var(--accent)]/70 transition-colors hover:text-[var(--accent)]"
                          >
                            <span className="transition-transform duration-200 group-hover/l:translate-x-1">↗</span>
                            {copy.projects.live}
                          </a>
                        )}
                      </div>
                    )}
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
