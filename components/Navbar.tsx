"use client";

import { MouseEvent, useEffect, useState } from "react";

const navItems = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [detached, setDetached] = useState(false);

  useEffect(() => {
    const container = document.querySelector(".scroll-container");
    if (!container) return;
    const handleScroll = () => {
      setDetached(container.scrollTop > 40);
    };
    handleScroll();
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const navigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed inset-x-0 z-40 flex justify-center px-4 transition-all duration-500 ${
        detached ? "top-4 translate-y-3" : "top-0"
      }`}
    >
     <nav
        className={`flex w-screen rounded-3xl max-w-screen items-center justify-between gap-6 bg-transparent px-6 py-3 text-xs font-medium uppercase tracking-[0.4em] text-(--muted) backdrop-blur-lg transition ${
          detached ? "scale-[0.90] shadow-[0_0px_1px_rgba(255,255,255,1)] rounded-3xl w-5xl border-b-2 border-[rgba(105,105,105,0.18)] bg-[rgba(255,255,255,0.06)]" : ""
        }`}
      >
        <div className="flex items-center gap-3 text-[var(--foreground)]">
          <span className="text-sm">Gustavo</span>
          <span className="text-(--accent)">職人</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[var(--muted)]">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => navigate(event, item.href)}
              className="group relative px-2 py-1 transition hover:text-[var(--foreground)]"
            >
              {item.label}
              <span className="pointer-events-none absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-[var(--accent)] transition duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </div>
        <a
          href="#contact"
          onClick={(event) => navigate(event, "#contact")}
          className="rounded-full border border-[var(--stroke)] px-3 py-1 text-[var(--foreground)] transition hover:bg-[var(--accent)] hover:text-[var(--ink)]"
        >
          Let's talk
        </a>
      </nav>
    </header>
  );
}
