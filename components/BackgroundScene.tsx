"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const orbs = [
  { size: 320, color: "rgba(244,81,30,0.25)", top: "25%", left: "30%", depth: 0.05 },
  { size: 420, color: "rgba(251,187,92,0.18)", top: "60%", left: "70%", depth: 0.08 },
  { size: 260, color: "rgba(255,255,255,0.12)", top: "70%", left: "20%", depth: 0.03 },
];

export function BackgroundScene() {
  const orbRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 768px)");
    if (media.matches) return;

    const handlePointer = (event: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      const normX = event.clientX / innerWidth - 0.5;
      const normY = event.clientY / innerHeight - 0.5;

      orbRefs.current.forEach((orb) => {
        if (!orb) return;
        const depth = Number(orb.dataset.depth ?? 0.04);
        gsap.to(orb, {
          x: normX * depth * 200,
          y: normY * depth * 200,
          duration: 1.2,
          ease: "power3.out",
        });
      });
    };

    window.addEventListener("pointermove", handlePointer);
    return () => window.removeEventListener("pointermove", handlePointer);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {orbs.map((orb, index) => (
        <div
          key={orb.size}
          ref={(el) => {
            orbRefs.current[index] = el;
          }}
          data-depth={orb.depth}
          className="absolute rounded-full blur-[120px]"
          style={{
            width: orb.size,
            height: orb.size,
            backgroundColor: orb.color,
            top: orb.top,
            left: orb.left,
            transform: "translate(-50%,-50%)",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(4,6,7,0)_20%,_rgba(2,4,5,0.9)_100%)]" />
    </div>
  );
}
