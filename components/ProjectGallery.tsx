"use client";

import { useEffect, useRef, useState } from "react";

const panels = [
  {
    title: "QUIET-HEAD",
    image:
      "/quiet.png",
  },
  {
    title: "BLITZ",
    image:
      "/blitz2.png",
  },
  {
    title: "HORIZON",
    description: "Mapas interativos guiados por IA para experiências culturais.",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80",
  },
];

export function ProjectGallery() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const snappedRef = useRef(false);

  useEffect(() => {
    const container = document.querySelector("\.scroll-container");
    const section = sectionRef.current;
    if (!container || !section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          if (entry.intersectionRatio > 0.85 && !snappedRef.current) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
            snappedRef.current = true;
          }
        } else {
          snappedRef.current = false;
        }
      },
      {
        root: container,
        threshold: [0.25, 0.5, 0.85],
      },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="flex h-screen flex-col justify-center p-1 text-foreground"
    >
      <div className="flex h-full gap-2 overflow-hidden rounded-[6px] border-red-50/10 border bg-(--ink) p-1 shadow-[0_20px_120px_rgba(0,0,0,0.7)]">
        {panels.map((panel, index) => (
          <button
            key={panel.title}
            type="button"
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            className={`relative flex-1 overflow-hidden rounded-[3px] border border-black/40 transition duration-300 ${
              active === index ? " filter-none scale-[1.01]" : "grayscale brightness-50"
            }`}
            style={{
              backgroundImage: ` url(${panel.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className={`absolute inset-x-0 z-5 bottom-[-100px] p-6 text-left duration-300 ${
              active === index ? "bottom-[0px] bg-black" : "grayscale brightness-50"
            }`}>
              <p className="text-2xl font-semibold">{panel.title}</p>
              <p className="text-sm text-white/70">{panel.description}</p>
            </div>
            
          </button>
        ))}
      </div>
    </section>
  );
}
