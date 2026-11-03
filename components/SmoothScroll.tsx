"use client";

import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";

const scrollOptions = {
  autoRaf: true,
  anchors: true,
  lerp: 0.09,
  smoothWheel: true,
  wheelMultiplier: 0.9,
  stopInertiaOnNavigate: true,
  respectReducedMotion: true,
};

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={scrollOptions}>
      {children}
    </ReactLenis>
  );
}
