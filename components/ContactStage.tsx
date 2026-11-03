"use client";

import { useLanguage } from "@/components/LanguageProvider";

const contacts = [
  {
    number: "01",
    label: "GitHub",
    value: "github.com/gusata",
    href: "https://github.com/gusata",
  },
  {
    number: "02",
    label: "LinkedIn",
    value: "linkedin.com/in/gustavo-sanches",
    href: "https://www.linkedin.com/in/gustavo-sanches-galeazzi-058346258/",
  },
  {
    number: "03",
    label: "Email",
    value: "gustavosgaleazzi@gmail.com",
    href: "mailto:gustavosgaleazzi@gmail.com",
  },
];

export function ContactStage() {
  const { language, copy } = useLanguage();
  return (
    <section
      id="contact"
      lang={language === "jp" ? "ja" : language}
      className="contact-stage relative flex min-h-screen flex-col overflow-hidden bg-[#08090b] px-6 pb-8 pt-24 text-[var(--foreground)] sm:px-10 lg:h-screen lg:min-h-[780px] lg:px-16 lg:pb-10"
    >
      <div className="contact-sun pointer-events-none absolute -right-32 top-1/4 h-[28rem] w-[28rem] rounded-full" aria-hidden="true" />
      <div className="contact-kanji pointer-events-none absolute -bottom-20 -left-10 select-none text-[19rem] font-black leading-none text-white/[0.018] lg:text-[28rem]" aria-hidden="true">
        縁
      </div>

      <header className="relative z-10 flex items-center justify-between border-b border-white/10 pb-5">
        <p className="text-[10px] uppercase tracking-[0.65em] text-[var(--muted)]/70">
          {copy.contact.section}
        </p>
        <p className="font-mono text-[10px] tracking-[0.14em] text-[var(--muted)]/40">
          {copy.contact.availability}
        </p>
      </header>

      <div className="relative z-10 grid flex-1 items-center gap-12 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:py-10">
        <div className="contact-reveal">
          <p className="mb-6 text-[10px] uppercase tracking-[0.55em] text-[var(--accent-alt)]/75">
            {copy.contact.eyebrow}
          </p>
          <h2 className="max-w-4xl font-black leading-[0.88] tracking-[-0.065em] text-white" style={{ fontSize: "clamp(3.5rem, 8vw, 8rem)" }}>
            {copy.contact.headingOne}
            <br />
            {copy.contact.headingTwo}
            <br />
            <span className="text-[var(--accent)]">{copy.contact.headingThree}</span>
          </h2>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-white/48 sm:text-base">
            {copy.contact.paragraph}
          </p>
        </div>

        <nav aria-label="Contact links" className="contact-reveal flex flex-col border-t border-white/10 lg:border-t-0">
          {contacts.map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              target={contact.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={contact.href.startsWith("mailto:") ? undefined : "noreferrer"}
              className="contact-link group grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 border-b border-white/10 py-5 transition-colors duration-300 hover:border-[var(--accent)]/50 sm:py-6"
            >
              <span className="font-mono text-[9px] text-[var(--accent)]/75">{contact.number}</span>
              <span>
                <span className="block text-lg font-semibold text-white/82 transition-colors group-hover:text-white sm:text-xl">
                  {contact.label}
                </span>
                <span className="mt-1 block break-all font-mono text-[10px] tracking-wide text-white/35 sm:text-[11px]">
                  {contact.value}
                </span>
              </span>
              <span className="contact-arrow text-xl text-[var(--accent)] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                ↗
              </span>
            </a>
          ))}
        </nav>
      </div>

      <footer className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-[9px] uppercase tracking-[0.38em] text-white/35">
        <span>{copy.contact.location}</span>
        <span className="font-mono tracking-[0.18em]">{copy.contact.signoff}</span>
      </footer>
    </section>
  );
}
