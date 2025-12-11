"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";

const englishTitle =
  "Criando sistemas, experiências e modelos que elevam o que a tecnologia pode fazer.";
const japaneseTitle =
  "テクノロジーの可能性を引き上げるシステム、エクスペリエンス、そしてモデルを創り出す。";
type SakuraPetal = {
  id: string;
  left: number;
  top: number;
  drift: number;
  delay: number;
  duration: number;
  scale: number;
};

type CSSVarStyle = CSSProperties & Record<string, string | number>;

export function HeroStage() {
  const glowRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<number[]>([]);
  const petalTimeoutsRef = useRef<number[]>([]);
  const languageRef = useRef<"pt" | "jp">("pt");

  const [titlePt, setTitlePt] = useState(englishTitle);
  const [titleJp, setTitleJp] = useState("");
  const [petals, setPetals] = useState<SakuraPetal[]>([]);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const element = glowRef.current;
    if (!element) return;
    const handlePointer = (event: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      const normX = event.clientX / innerWidth;
      const normY = event.clientY / innerHeight;
      element.style.setProperty("--x", `${normX * 100}%`);
      element.style.setProperty("--y", `${normY * 100}%`);
    };
    window.addEventListener("pointermove", handlePointer);
    return () => window.removeEventListener("pointermove", handlePointer);
  }, []);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
      petalTimeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, []);

  const swapTexts = (
    outgoingFull: string,
    incomingFull: string,
    outgoingSetter: (value: string) => void,
    incomingSetter: (value: string) => void,
    opts?: { delay?: number },
  ) => {
    const step = 5;
    const delay = opts?.delay ?? 3;
    const chars = outgoingFull.split("");
    for (let i = 0; i < chars.length; i += 1) {
      const timeout = window.setTimeout(() => {
        chars[i] = "\u00A0";
        outgoingSetter(chars.join(""));
      }, delay + i * step);
      timeoutsRef.current.push(timeout);
    }
    for (let i = 0; i <= incomingFull.length; i += 1) {
      const timeout = window.setTimeout(() => {
        incomingSetter(incomingFull.slice(0, i));
      }, delay + i * step);
      timeoutsRef.current.push(timeout);
    }
  };

  const animateLanguage = (target: "pt" | "jp") => {
    timeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
    timeoutsRef.current = [];
    if (target === "jp") {
      swapTexts(englishTitle, japaneseTitle, setTitlePt, setTitleJp);
    } else {
      swapTexts(japaneseTitle, englishTitle, setTitleJp, setTitlePt);
    }
    languageRef.current = target;
  };

  const handleHover = () => {
    if (languageRef.current === "jp") return;
    animateLanguage("jp");
  };

  const handleLeave = () => {
    if (languageRef.current === "pt") return;
    animateLanguage("pt");
  };

  const handleBranchClick = () => {
    const batch = Array.from({ length: 160 }, (_, index) => ({
      id: `${Date.now()}-${index}`,
      left: Math.random() * 100,
      top: -80 + Math.random() * 80,
      drift: Math.random() * 240 - 120,
      delay: Math.random() * 0.3,
      duration: 5.2 + Math.random() * 3,
      scale: 0.5 + Math.random() * 0.7,
    }));
    setPetals((prev) => [...prev, ...batch]);
    const ids = new Set(batch.map((petal) => petal.id));
    const timeout = window.setTimeout(() => {
      setPetals((prev) => prev.filter((petal) => !ids.has(petal.id)));
    }, 9500);
    petalTimeoutsRef.current.push(timeout);
    if (showHint) setShowHint(false);
  };

  return (
    <section
      id="hero"
      className="snap-none relative flex h-screen flex-col justify-center px-6 py-10 text-[var(--foreground)] sm:px-10 lg:px-16"
    >
      <div className="pointer-events-none absolute inset-0 z-10">
        {petals.map((petal) => {
          const style: CSSVarStyle = {
            left: `${petal.left}%`,
            top: `${petal.top}%`,
            "--drift": `${petal.drift}px`,
            "--scale": petal.scale,
            "--fall-duration": `${petal.duration}s`,
            "--fall-delay": `${petal.delay}s`,
          };
          return (
            <svg
              key={petal.id}
              className="sakura-petal"
              style={style}
              viewBox="0 0 40 60"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="petal-fill" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffd9eb" />
                  <stop offset="60%" stopColor="#f78ab3" />
                  <stop offset="100%" stopColor="#f04d84" />
                </linearGradient>
              </defs>
              <path
                d="M20 5 C9 18 6 32 14 47 C19 56 22 56 27 47 C34 35 32 18 20 5 Z"
                fill="url(#petal-fill)"
                stroke="#ffddea"
                strokeWidth="1"
              />
              <path
                d="M20 5 C14 17 15 30 21 43 C23 48 26 48 28 43 C30 34 27 21 20 5 Z"
                fill="rgba(255,255,255,0.35)"
              />
            </svg>
          );
        })}
      </div>
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at var(--x,50%) var(--y,50%), rgba(244,81,30,0.2), transparent 35%)",
        }}
      />
      <button
        type="button"
        onClick={handleBranchClick}
        aria-label="Liberar pétalas de sakura"
        className="group absolute right-0 top-24 z-50 flex flex-col items-end text-[var(--muted)] drop-shadow-[0_12px_30px_rgba(0,0,0,0.55)]"
      >
        <div className="flex items-center">
        </div>
        <svg
          viewBox="0 0 400 160"
          className="w-72 text-[var(--muted)] right-[-30px] relative transition group-hover:text-[var(--accent)]"
          style={{ transform: "rotate(-20deg)" }}
        >
          <defs>
            <linearGradient id="branch-petal-fill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffe9f5" />
              <stop offset="55%" stopColor="#fbb0cf" />
              <stop offset="100%" stopColor="#f07da4" />
            </linearGradient>
          </defs>
          <path
            d="M15 120 Q120 60 210 85 T380 55"
            stroke="#482418"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M90 92 Q140 68 180 76"
            stroke="#482418"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M130 108 Q150 88 198 90"
            stroke="#482418"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M240 90 Q280 74 330 80"
            stroke="#482418"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          {[{ x: 60, y: 100, s: 0.6 }, { x: 120, y: 85, s: 0.55 }, { x: 180, y: 100, s: 0.62 }, { x: 230, y: 90, s: 0.6 }, { x: 285, y: 76, s: 0.58 }, { x: 335, y: 82, s: 0.5 }].map((flower) => (
            <g key={`${flower.x}-${flower.y}`} transform={`translate(${flower.x} ${flower.y}) scale(${flower.s})`}>
              {[0, 72, 144, 216, 288].map((angle) => (
                <path
                  key={angle}
                  d="M0 0 C-16 -6 -26 -4 -28 6 C-22 18 -6 22 0 20 Z"
                  fill="url(#branch-petal-fill)"
                  transform={`rotate(${angle})`}
                />
              ))}
              <circle r="6" fill="#4d0d28" />
              {[0, 36, 72, 108, 144].map((angle) => (
                <line
                  key={angle}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="-14"
                  stroke="#4d0d28"
                  strokeWidth="1.5"
                  transform={`rotate(${angle})`}
                />
              ))}
            </g>
          ))}
          {[{ x: 90, y: 110 }, { x: 145, y: 94 }, { x: 205, y: 108 }, { x: 255, y: 88 }, { x: 320, y: 98 }, { x: 355, y: 70 }].map((bud) => (
            <g
              key={`${bud.x}-${bud.y}`}
              transform={`translate(${bud.x} ${bud.y}) scale(0.6)`}
            >
              <circle r="10" fill="#f8a7c3" />
              <path d="M0 10 Q6 12 9 6 Q6 -1 0 -6 Q-6 -1 -9 6 Q-6 12 0 10 Z" fill="#fdd4e4" />
            </g>
          ))}
        </svg>
      </button>
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end">
        <div className="space-y-6 lg:w-2/3">
          <p className="text-xs uppercase tracking-[0.7em] text-[var(--muted)]">
            Gustavo / フルスタック / AI builder
          </p>
          <div
            className="relative h-80 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
          >
            <span className="block text-[var(--foreground)]">{titlePt}</span>
            <span className="pointer-events-none absolute inset-0 text-(--accent)/70">{titleJp}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
