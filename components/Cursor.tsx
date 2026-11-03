"use client";

import { useEffect, useRef } from "react";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const target = useRef({ x: -200, y: -200 });
  const pos = useRef({ x: -200, y: -200 });
  const ringSize = useRef(28);
  const raf = useRef<number>(0);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (e: MouseEvent) => {
      if (target.current.x === -200) {
        pos.current = { x: e.clientX, y: e.clientY };
      }
      target.current = { x: e.clientX, y: e.clientY };
      dot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
      if (!raf.current) raf.current = requestAnimationFrame(animate);
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const interactive = el.closest("button, a, [role=button], input, textarea, select");
      const cursorLabel = el.closest<HTMLElement>("[data-cursor-label]")?.dataset.cursorLabel;
      if (cursorLabel) {
        ringSize.current = 62;
        ring.style.width = "62px";
        ring.style.height = "62px";
        ring.style.borderColor = "rgba(237,98,74,0.9)";
        label.textContent = cursorLabel;
      } else if (interactive) {
        ringSize.current = 44;
        ring.style.width = "44px";
        ring.style.height = "44px";
        ring.style.borderColor = "rgba(237,98,74,0.85)";
        label.textContent = "";
      } else {
        ringSize.current = 28;
        ring.style.width = "28px";
        ring.style.height = "28px";
        ring.style.borderColor = "white";
        label.textContent = "";
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
      if (
        Math.abs(pos.current.x - target.current.x) > 0.25 ||
        Math.abs(pos.current.y - target.current.y) > 0.25
      ) {
        raf.current = requestAnimationFrame(animate);
      } else {
        raf.current = 0;
      }
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
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
      >
        <span ref={labelRef} className="cursor-ring-label" />
      </div>
    </>
  );
}
