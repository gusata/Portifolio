"use client";

import Image from "next/image";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { languageOptions, useLanguage } from "@/components/LanguageProvider";

type Petal = {
  id: number;
  left: number;
  drift: number;
  delay: number;
  duration: number;
  scale: number;
};

type PetalStyle = CSSProperties & Record<"--drift" | "--fall-delay" | "--fall-duration" | "--scale", string>;

export function HeroStage() {
  const { language, setLanguage, copy } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const glowFrame = useRef<number>(0);
  const introTimeout = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const [petals, setPetals] = useState<Petal[]>([]);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const hero = heroRef.current;
    const glow = glowRef.current;
    if (!hero || !glow) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!finePointer) return;

    const handlePointerMove = (event: PointerEvent) => {
      cancelAnimationFrame(glowFrame.current);
      const x = event.clientX - 280;
      const y = event.clientY - 280;
      glowFrame.current = requestAnimationFrame(() => {
        glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };

    hero.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      hero.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(glowFrame.current);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    introTimeout.current = window.setTimeout(() => setShowIntro(false), 2860);
    return () => {
      if (introTimeout.current !== null) window.clearTimeout(introTimeout.current);
    };
  }, []);

  useEffect(() => () => {
    cancelAnimationFrame(glowFrame.current);
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
  }, []);

  const skipIntro = () => {
    if (introTimeout.current !== null) window.clearTimeout(introTimeout.current);
    setShowIntro(false);
  };

  const releasePetals = () => {
    if (petals.length > 0) return;
    const nextPetals = Array.from({ length: 20 }, (_, index) => ({
      id: Date.now() + index,
      left: 8 + Math.random() * 84,
      drift: Math.random() * 220 - 110,
      delay: Math.random() * 0.7,
      duration: 4.4 + Math.random() * 2.2,
      scale: 0.55 + Math.random() * 0.65,
    }));
    setPetals(nextPetals);
    timeoutRef.current = window.setTimeout(() => setPetals([]), 7200);
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="hero-stage relative flex min-h-[820px] flex-col justify-center overflow-hidden px-6 pb-24 pt-32 text-[var(--foreground)] sm:px-10 lg:min-h-[100svh] lg:px-16 lg:pb-28 lg:pt-28"
    >
      <div className="hero-image-parallax absolute inset-0" aria-hidden="true">
        <Image
          src="/kyoto-portfolio-hero-v1.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={75}
          className="hero-backdrop"
        />
      </div>
      <div className="hero-image-shade pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-glow pointer-events-none absolute -z-0" ref={glowRef} aria-hidden="true" />

      {petals.length > 0 && (
        <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden" aria-hidden="true">
          {petals.map((petal) => {
            const style: PetalStyle = {
              left: `${petal.left}%`,
              "--drift": `${petal.drift}px`,
              "--fall-delay": `${petal.delay}s`,
              "--fall-duration": `${petal.duration}s`,
              "--scale": `${petal.scale}`,
            };
            return <span className="sakura-petal" key={petal.id} style={style} />;
          })}
        </div>
      )}

      <div className="hero-topline absolute inset-x-6 z-20 flex items-center justify-between sm:inset-x-10 lg:inset-x-16">
        <p className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.3em] text-white/55 sm:text-[10px]">
          <span className="hero-live-dot" aria-hidden="true" />
          {copy.hero.kicker}
        </p>
        <button
          type="button"
          onClick={releasePetals}
          className="hero-sakura group inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-white/55 transition-colors hover:text-white"
          aria-label={copy.hero.sakuraLabel}
        >
          <span className="hero-sakura-seal grid h-9 w-9 place-items-center rounded-full border border-white/20 text-sm text-[var(--accent-alt)] transition-transform group-hover:rotate-45">
            花
          </span>
          <span className="hidden sm:block">{copy.hero.sakura}</span>
        </button>
      </div>

      <div className="hero-layout relative z-10 mx-auto grid w-full max-w-[1600px] items-center gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)] lg:gap-16">
        <div className="hero-copy max-w-[900px]">
          <p className="hero-kicker mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.5em] text-[var(--accent-alt)] sm:text-[11px]">
            <span className="h-px w-9 bg-[var(--accent)]" />
            Gustavo Galeazzi <span className="text-white/25">—</span> Full Stack &amp; AI
          </p>
          <h1
            className="hero-title relative max-w-[880px] font-semibold tracking-[-0.055em] text-white"
            lang={language === "jp" ? "ja" : language}
          >
            <span key={language} className="hero-title-language block">
              {copy.hero.title}
            </span>
          </h1>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="hero-language flex items-center gap-1 rounded-full border border-white/15 bg-black/25 p-1" role="group" aria-label={copy.hero.languageLabel}>
              {languageOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={language === option.id}
                  onClick={() => setLanguage(option.id)}
                  className={`rounded-full px-3 py-1.5 font-mono text-[9px] tracking-[0.18em] transition-colors ${language === option.id ? "bg-white text-[#111318]" : "text-white/50 hover:text-white"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="max-w-[340px] text-xs leading-relaxed text-white/55 sm:text-sm">
              {copy.hero.subtitle}
            </p>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
            <a href="#projects" className="hero-primary-link group inline-flex items-center gap-5 bg-[var(--accent)] px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#ff725a]">
              {copy.hero.work}
              <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
            </a>
            <a href="#about" className="inline-flex items-center gap-3 border border-white/20 px-5 py-3.5 text-[10px] uppercase tracking-[0.2em] text-white/75 transition-colors hover:border-white/50 hover:text-white">
              {copy.hero.about}
            </a>
          </div>
        </div>

        <aside className="hero-side relative hidden min-h-[430px] items-end justify-end lg:flex" aria-label="Portfolio signature">
          <p className="hero-coordinate absolute right-1 top-[20%] font-mono text-[9px] uppercase tracking-[0.3em] text-white/50">
            35° 00′ 00″ N <span className="mx-2 text-[var(--accent)]">/</span> 139° 00′ 00″ E
          </p>
          <p className="hero-japanese-note absolute right-0 top-[34%] text-[11px] tracking-[0.32em] text-white/45 [writing-mode:vertical-rl]">
            技術と想像力のあいだ
          </p>
          <div className="hero-enso absolute bottom-24 right-16 grid h-48 w-48 place-items-center rounded-full border border-white/20" aria-hidden="true">
            <div className="absolute inset-3 rounded-full border border-[var(--accent-alt)]/45" />
            <span className="font-serif text-7xl font-light text-white/80">間</span>
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#101116] px-3 font-mono text-[8px] uppercase tracking-[0.3em] text-[var(--accent-alt)]">Ma · negative space</span>
          </div>
        </aside>
      </div>

      <div className="hero-footer absolute inset-x-6 bottom-8 z-20 flex items-center gap-4 text-[9px] uppercase tracking-[0.28em] text-white/45 sm:inset-x-10 lg:inset-x-16">
        <span className="font-mono text-[var(--accent-alt)]">01 <span className="text-white/30">/</span> 04</span>
        <span className="hero-scroll-rule h-px flex-1 bg-white/15" aria-hidden="true" />
        <a href="#about" className="group inline-flex items-center gap-3 transition-colors hover:text-white">
          {copy.hero.scroll}
          <span className="text-[var(--accent)] transition-transform duration-300 group-hover:translate-y-1">↓</span>
        </a>
      </div>
      {showIntro && (
        <div className="portfolio-intro fixed inset-0 z-[100] overflow-hidden" aria-label="Portfolio opening animation">
          <div className="intro-atmosphere absolute inset-0" aria-hidden="true" />
          <div className="intro-sun absolute left-1/2 top-1/2" aria-hidden="true" />
          <svg className="intro-enso absolute left-1/2 top-1/2" viewBox="0 0 420 420" fill="none" aria-hidden="true">
            <path className="intro-enso-path" d="M352 214C352 292 289 354 210 354C130 354 66 290 66 210C66 130 131 66 211 66C271 66 320 102 341 151" />
            <path className="intro-enso-flourish" d="M335 163C347 177 352 194 352 214" />
          </svg>
          <div className="intro-shoji intro-shoji-left absolute inset-y-0 left-0" aria-hidden="true" />
          <div className="intro-shoji intro-shoji-right absolute inset-y-0 right-0" aria-hidden="true" />

          <div className="intro-lockup absolute left-1/2 top-1/2">
            <span className="intro-kanji" lang="ja">創</span>
            <span className="intro-name">GUSTAVO GALEAZZI</span>
            <span className="intro-rule" aria-hidden="true" />
            <span className="intro-caption" lang="ja">技術と想像力を、かたちに。</span>
          </div>

          <p className="intro-side-note intro-side-note-left absolute left-8 top-1/2 hidden sm:block" lang="ja">静かな一歩から、世界へ</p>
          <p className="intro-side-note intro-side-note-right absolute right-8 top-1/2 hidden sm:block">DIGITAL CRAFT <span>×</span> SÃO PAULO</p>
          <div className="intro-topline absolute inset-x-6 top-6 flex items-center justify-between sm:inset-x-10 sm:top-8">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/45">G / 01</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/45">{copy.hero.introLabel}</span>
          </div>
          <div className="intro-bottomline absolute inset-x-6 bottom-6 flex items-center gap-4 sm:inset-x-10 sm:bottom-8">
            <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/45">{copy.hero.introBottom}</span>
            <span className="intro-progress h-px flex-1" aria-hidden="true" />
            <span className="font-mono text-[8px] text-[var(--accent-alt)]">01 / 04</span>
          </div>
          <button
            type="button"
            onClick={skipIntro}
            className="intro-skip absolute right-6 top-[4.25rem] z-10 px-2 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/55 transition-colors hover:text-white sm:right-10 sm:top-20"
          >
            {copy.hero.skip} <span className="ml-2 text-[var(--accent-alt)]">↗</span>
          </button>
          <span className="intro-petal intro-petal-one" aria-hidden="true" />
          <span className="intro-petal intro-petal-two" aria-hidden="true" />
          <span className="intro-petal intro-petal-three" aria-hidden="true" />
        </div>
      )}
    </section>
  );
}
