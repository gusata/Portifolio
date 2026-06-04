"use client";

import { useEffect, useRef } from "react";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -200, y: -200 });
  const pos = useRef({ x: -200, y: -200 });
  const ringSize = useRef(28);
  const raf = useRef<number>(0);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      dot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const interactive = el.closest("button, a, [role=button], input, textarea, select");
      if (interactive) {
        ringSize.current = 44;
        ring.style.width = "44px";
        ring.style.height = "44px";
        ring.style.borderColor = "rgba(244,81,30,0.85)";
      } else {
        ringSize.current = 28;
        ring.style.width = "28px";
        ring.style.height = "28px";
        ring.style.borderColor = "white";
      }
    };

    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.11);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.11);
      const half = ringSize.current / 2;
      ring.style.transform = `translate(${pos.current.x - half}px, ${pos.current.y - half}px)`;
      raf.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    raf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-white mix-blend-difference"
        style={{ opacity: 0, transition: "opacity 0.15s" }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full border border-white mix-blend-difference"
        style={{
          width: 28,
          height: 28,
          opacity: 0,
          transition: "width 0.18s ease, height 0.18s ease, border-color 0.18s ease, opacity 0.15s",
        }}
      />
    </>
  );
}
