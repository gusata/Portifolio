"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { useLanguage } from "@/components/LanguageProvider";

const sectionIds = ["hero", "about", "projects", "contact"];

export function Navbar() {
  const { copy } = useLanguage();
  const lenis = useLenis();
  const [detached, setDetached] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const detachedRef = useRef(false);

  const navItems = [
    { label: copy.nav.home, href: "#hero", id: "hero" },
    { label: copy.nav.about, href: "#about", id: "about" },
    { label: copy.nav.projects, href: "#projects", id: "projects" },
    { label: copy.nav.contact, href: "#contact", id: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const next = window.scrollY > 36;
      if (detachedRef.current === next) return;
      detachedRef.current = next;
      setDetached(next);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75] },
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const navigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target, { offset: -96 });
      return;
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 py-3 sm:px-6 sm:py-4">
      <div className="site-scroll-progress absolute inset-x-0 top-0" aria-hidden="true" />
      <nav
        aria-label={copy.nav.label}
        className={`relative mx-auto flex w-full max-w-[1320px] flex-nowrap items-center justify-between gap-x-2 px-4 py-3 transition-all duration-500 sm:gap-6 sm:px-6 ${
          detached
            ? "rounded-2xl border border-white/10 bg-[#101116]/80 shadow-[0_18px_55px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:rounded-full"
            : "rounded-2xl border border-transparent bg-transparent"
        }`}
      >
        <a href="#hero" onClick={(event) => navigate(event, "#hero")} className="group flex shrink-0 items-center gap-2.5" aria-label="Gustavo Galeazzi, home">
          <span className="grid h-8 w-8 place-items-center border border-[var(--accent)]/60 font-serif text-sm text-[var(--accent-alt)] transition-colors group-hover:bg-[var(--accent)] group-hover:text-white">G.</span>
          <span>
            <span className="block text-[11px] font-semibold tracking-[0.12em] text-white">GUSTAVO GALEAZZI</span>
            <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.22em] text-white/40">Engineer / AI builder</span>
          </span>
        </a>

        <button
          type="button"
          aria-label={menuOpen ? copy.nav.closeMenu : copy.nav.menu}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-9 w-9 shrink-0 place-items-center border border-white/20 text-white/80 sm:hidden"
        >
          <span className="flex w-3.5 flex-col gap-[3px]" aria-hidden="true">
            <i className={`h-px w-full bg-current transition-transform ${menuOpen ? "translate-y-[4px] rotate-45" : ""}`} />
            <i className={`h-px w-full bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <i className={`h-px w-full bg-current transition-transform ${menuOpen ? "-translate-y-[4px] -rotate-45" : ""}`} />
          </span>
        </button>

        <div
          id="primary-navigation"
          className={`${menuOpen ? "flex" : "hidden"} absolute left-0 right-0 top-full z-50 flex-col gap-1 rounded-2xl border border-white/10 bg-[#101116]/95 p-3 text-[10px] uppercase tracking-[0.16em] text-white/65 shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:static sm:z-auto sm:flex sm:w-auto sm:flex-row sm:items-center sm:justify-start sm:gap-5 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:text-[10px] sm:tracking-[0.18em] sm:shadow-none sm:backdrop-blur-none`}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => { setMenuOpen(false); navigate(event, item.href); }}
              aria-current={activeSection === item.id ? "location" : undefined}
              className={`group relative whitespace-nowrap rounded-lg px-3 py-3 transition-colors hover:text-white sm:rounded-none sm:px-0 sm:py-1 ${activeSection === item.id ? "text-white" : ""}`}
            >
              {item.label}
              <span className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-[var(--accent)] transition-transform duration-300 ${activeSection === item.id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
            </a>
          ))}
        </div>

        <a
          href="#contact"
          onClick={(event) => navigate(event, "#contact")}
          className="inline-flex shrink-0 items-center gap-2 border border-white/20 px-3 py-2 text-[8px] uppercase tracking-[0.12em] text-white/80 transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white sm:px-4 sm:text-[10px] sm:tracking-[0.16em]"
        >
          {copy.nav.talk} <span className="text-[var(--accent-alt)]">↗</span>
        </a>
      </nav>
    </header>
  );
}
