"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";

const stack = [
  "Python",
  "TypeScript",
  "Django",
  "React",
  "Next.js",
  "React Native",
  "OCR",
  "AI / ML",
];

export function AboutStage() {
  const { language, copy } = useLanguage();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.unobserve(section);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

  return (
    <section
      ref={ref}
      id="about"
      lang={language === "jp" ? "ja" : language}
      className="about-stage relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#08090b] px-6 pb-8 pt-24 text-[var(--foreground)] sm:px-10 lg:h-screen lg:min-h-[800px] lg:px-16 lg:pb-10 lg:pt-24"
    >
      <div className="about-kanji pointer-events-none absolute -right-8 top-28 select-none text-[18rem] font-black leading-none text-white/[0.018] lg:right-[31%] lg:top-16 lg:text-[24rem]" aria-hidden="true">
        創
      </div>

      <header className="relative z-10 flex items-center justify-between border-b border-white/10 pb-5">
        <p className="text-[10px] uppercase tracking-[0.65em] text-[var(--muted)]/70">
          {copy.about.section}
        </p>
        <p className="font-mono text-[10px] tracking-[0.14em] text-[var(--muted)]/40">
          {copy.about.location}
        </p>
      </header>

      <div className="relative z-10 grid flex-1 items-center gap-12 py-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16 lg:py-8">
        <motion.div
          initial={false}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.72, ease }}
          className="about-copy flex flex-col justify-center"
        >
          <p className="mb-5 text-[10px] uppercase tracking-[0.52em] text-[var(--accent-alt)]/75">
            {copy.about.eyebrow}
          </p>
          <h2 className="about-heading-scroll max-w-4xl font-black leading-[0.86] tracking-[-0.065em] text-white" style={{ fontSize: "clamp(3.25rem, 7.3vw, 7.25rem)" }}>
            {copy.about.headingOne}
            <br />
            {copy.about.headingTwo}
            <span className="block pt-2 text-white/38">{copy.about.headingThree}</span>
          </h2>

          <div className="mt-8 grid gap-5 border-l border-[var(--accent)]/55 pl-5 sm:grid-cols-2 sm:gap-8">
            <p className="text-sm leading-relaxed text-white/72">
              {copy.about.paragraphOne}
            </p>
            <p className="text-sm leading-relaxed text-white/42">
              {copy.about.paragraphTwo}
            </p>
          </div>

          <div className="mt-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/45">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            {copy.about.role}
          </div>
        </motion.div>

        <motion.figure
          initial={false}
          animate={visible ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: 22, rotate: 1.5 }}
          transition={{ duration: 0.85, delay: 0.12, ease }}
          className="about-art group relative mx-auto w-full max-w-[470px]"
        >
          <div className="about-art-frame relative aspect-[4/3] overflow-hidden border border-white/10 bg-[#10151a] lg:aspect-[4/5]">
            <div className="about-image-parallax">
              <Image
                src="/about-placeholder.png"
                alt={copy.about.imageAlt}
                fill
                sizes="(max-width: 1023px) 90vw, 38vw"
                quality={75}
                className="about-art-image object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090b]/90 via-transparent to-[#08090b]/10" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 sm:p-6">
              <figcaption>
                <span className="mb-2 block font-mono text-[9px] tracking-[0.25em] text-[var(--accent-alt)]">
                  35°41&apos; N · 139°41&apos; E
                </span>
                <span className="text-sm font-medium tracking-wide text-white/85">
                  {copy.about.imageCaption}
                </span>
              </figcaption>
              <span className="grid h-11 w-11 place-items-center border border-white/30 font-mono text-[10px] text-white/75 transition-colors duration-300 group-hover:border-[var(--accent)] group-hover:text-[var(--accent-alt)]">
                技術
              </span>
            </div>
          </div>
          <span className="about-art-index absolute -left-3 -top-3 z-10 grid h-12 w-12 place-items-center bg-[var(--accent)] font-mono text-[10px] text-white shadow-[0_8px_30px_rgba(244,81,30,0.24)]">
            02
          </span>
          <span className="absolute -right-4 top-1/3 hidden text-[9px] uppercase tracking-[0.4em] text-white/35 [writing-mode:vertical-rl] lg:block">
            人工知能と創造
          </span>
        </motion.figure>
      </div>

      <footer className="relative z-10 border-t border-white/10 pt-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-[9px] uppercase tracking-[0.55em] text-white/40">{copy.about.tools}</p>
          <p className="hidden font-mono text-[9px] tracking-[0.2em] text-white/25 sm:block">STACK / 08</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {stack.map((skill, index) => (
            <span
              key={skill}
              className="about-skill border border-white/10 px-3 py-2 font-mono text-[10px] text-white/55 transition-colors duration-200 hover:border-[var(--accent)]/55 hover:text-white"
              style={{ transitionDelay: `${index * 20}ms` }}
            >
              {skill}
            </span>
          ))}
        </div>
      </footer>
    </section>
  );
}
