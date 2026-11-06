"use client";

/*
 * Motion kit for DUALITY.
 * Every primitive renders the readable final state when the visitor prefers
 * reduced motion, keeps the real text available to assistive tech, and only
 * animates transform / opacity / clip-path.
 */
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

/** Expo-out: fast start, long soft landing — used for reveals. */
export const reveal = [0.16, 1, 0.3, 1] as const;
/** The site's signature in-out curve — used for covers and wipes. */
export const curtain = [0.76, 0, 0.24, 1] as const;

type LineProps = {
  /** Each entry is one visual line; strings or nodes (e.g. <em>). */
  lines: ReactNode[];
  /** Accessible text for the whole heading. */
  label: string;
  as?: ElementType;
  id?: string;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of when scrolled into view. */
  onMount?: boolean;
};

/** Lines rise out of a clipped mask, one after another. */
export function MaskLines({ lines, label, as: Tag = "h2", id, className, style, delay = 0, stagger = 0.09, onMount = false }: LineProps) {
  const reduced = useReducedMotion();
  const trigger = onMount ? { animate: "shown" } : { whileInView: "shown", viewport: { once: true, margin: "0px 0px -12% 0px" } };
  return <Tag id={id} className={className} style={style} aria-label={label}>
    {lines.map((line, i) => <span className="mask-line" aria-hidden="true" key={i}>
      <motion.span className="mask-line-inner" initial={reduced ? false : "hidden"} {...trigger}
        variants={{ hidden: { y: "108%", rotate: 3 }, shown: { y: "0%", rotate: 0, transition: { duration: 1.05, ease: reveal, delay: delay + i * stagger } } }}>
        {line}
      </motion.span>
    </span>)}
  </Tag>;
}

/** Short headline split into characters that fall into place with a slight 3D tilt. */
export function SplitChars({ text, className, delay = 0, stagger = 0.022, onMount = false }: { text: string; className?: string; delay?: number; stagger?: number; onMount?: boolean }) {
  const reduced = useReducedMotion();
  if (reduced) return <span className={className}>{text}</span>;
  const trigger = onMount ? { animate: "shown" } : { whileInView: "shown", viewport: { once: true, margin: "0px 0px -10% 0px" } };
  let index = 0;
  return <span className={`split-chars ${className ?? ""}`}>
    <span className="sr-only">{text}</span>
    {text.split(" ").map((word, w, words) => <span className="split-word" aria-hidden="true" key={w}>
      {[...word].map(char => {
        const i = index++;
        return <motion.span key={i} className="split-char" initial="hidden" {...trigger}
          variants={{ hidden: { y: "75%", opacity: 0, rotateX: -70 }, shown: { y: "0%", opacity: 1, rotateX: 0, transition: { duration: 0.9, ease: reveal, delay: delay + i * stagger } } }}>{char}</motion.span>;
      })}
      {w < words.length - 1 && " "}
    </span>)}
  </span>;
}

/** Paragraph whose words light up as it scrolls through the viewport. */
export function ScrubWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 88%", "end 55%"] });
  if (reduced) return <p ref={ref} className={className}>{text}</p>;
  const words = text.split(" ");
  return <p ref={ref} className={`scrub-words ${className ?? ""}`}>
    <span className="sr-only">{text}</span>
    {words.map((word, i) => <ScrubWord key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{word}</ScrubWord>)}
  </p>;
}
function ScrubWord({ progress, range, children }: { progress: MotionValue<number>; range: [number, number]; children: string }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return <><motion.span aria-hidden="true" className="scrub-word" style={{ opacity, y }}>{children}</motion.span>{" "}</>;
}

/** Thin rule that draws itself from the left when it enters the viewport. */
export function DrawLine({ className, delay = 0 }: { className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.span aria-hidden="true" className={`draw-line ${className ?? ""}`} initial={reduced ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: curtain, delay }} />;
}
