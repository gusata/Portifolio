"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const stack = [
  "Python", "TypeScript", "Django", "React",
  "Next.js", "React Native", "OCR", "AI / ML",
];

const focuses = [
  { label: "Full Stack Development" },
  { label: "AI / ML & Machine Learning" },
  { label: "OCR & Computer Vision" },
];

export function AboutStage() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = document.querySelector(".scroll-container");
    const section = ref.current;
    if (!container || !section) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) setVisible(true); },
      { root: container, threshold: 0.2 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const slide = (delay: number) => ({
    animate: visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { delay, duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  });

  const rule = (delay: number) => ({
    animate: visible ? { scaleX: 1 } : { scaleX: 0 },
    transition: { delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <section
      ref={ref}
      id="about"
      className="relative flex h-screen flex-col bg-[#050505] px-6 py-12 text-[var(--foreground)] sm:px-10 lg:px-16"
    >
      {/* ── Header ── */}
      <motion.div {...slide(0)} className="flex shrink-0 items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.65em] text-[var(--muted)]/50">About</p>
        <p className="font-mono text-[10px] text-[var(--muted)]/28">Gustavo Galeazzi</p>
      </motion.div>

      {/* Separator */}
      <motion.div {...rule(0.08)} className="my-8 h-px origin-left bg-white/[0.06]" />

      {/* ── Headline — vertically centered in remaining space ── */}
      <div className="flex flex-1 flex-col justify-center">
        <div className="overflow-hidden">
          <motion.h2
            animate={visible ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
            transition={{ delay: 0.18, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-black leading-[0.92] tracking-tight text-white"
            style={{ fontSize: "clamp(2.4rem, 6.8vw, 6.5rem)" }}
          >
            Full Stack Developer
          </motion.h2>
        </div>
        <div className="overflow-hidden">
          <motion.h2
            animate={visible ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
            transition={{ delay: 0.26, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-black leading-[0.92] tracking-tight"
            style={{
              fontSize: "clamp(2.4rem, 6.8vw, 6.5rem)",
              color: "rgba(247,245,239,0.28)",
            }}
          >
            & AI Builder.
          </motion.h2>
        </div>
      </div>

      {/* Separator */}
      <motion.div {...rule(0.3)} className="my-8 h-px origin-left bg-white/[0.06]" />

      {/* ── Bio + Skills ── */}
      <motion.div
        {...slide(0.38)}
        className="flex shrink-0 flex-col gap-8 lg:flex-row lg:items-start lg:gap-16"
      >
        {/* Bio */}
        <div className="lg:w-1/2">
          <p className="text-[0.95rem] leading-relaxed text-[var(--foreground)]/72">
            Programming since childhood. Graduated as a Systems technician
            at ETEC in 2023, went deeper at FATEC. Currently Junior Developer
            at Grupo DirectWeb — hands-on with AI and Python from my time at Tecnogera.
          </p>
          <p className="mt-3 text-[0.85rem] leading-relaxed text-[var(--foreground)]/40">
            I work across the full stack with a product mindset, combining engineering
            precision and design sensibility. Especially driven by AI — building
            and refining models that solve real-world problems, from OCR pipelines
            to production-grade APIs.
          </p>
        </div>

        {/* Skills */}
        <div className="flex gap-12 lg:w-1/2">
          <div>
            <p className="mb-3 text-[9px] uppercase tracking-[0.55em] text-[var(--muted)]/38">
              Stack
            </p>
            <div className="flex flex-col gap-[5px]">
              {stack.map((s) => (
                <span key={s} className="text-[0.82rem] text-[var(--foreground)]/48">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[9px] uppercase tracking-[0.55em] text-[var(--muted)]/38">
              Focus
            </p>
            <div className="flex flex-col gap-[5px]">
              {focuses.map((f) => (
                <span key={f.label} className="text-[0.82rem] text-[var(--foreground)]/48">
                  {f.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Separator */}
      <motion.div {...rule(0.44)} className="my-8 h-px origin-left bg-white/[0.06]" />

      {/* ── Footer strip ── */}
      <motion.div
        {...slide(0.5)}
        className="flex shrink-0 items-center justify-between"
      >
        <p className="text-[0.78rem] text-[var(--muted)]/35">São Paulo, Brasil</p>
        <div className="flex items-center gap-2">
          <span
            className="h-[6px] w-[6px] rounded-full bg-[var(--accent)]"
            style={{ animation: "pulse 2s ease-in-out infinite" }}
          />
          <p className="text-[0.78rem] text-[var(--muted)]/35">
            Dev Jr · Grupo DirectWeb
          </p>
        </div>
      </motion.div>
    </section>
  );
}
