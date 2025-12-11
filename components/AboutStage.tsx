export function AboutStage() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col justify-between bg-[#050505] px-6 py-16 text-[var(--foreground)] sm:px-10 lg:px-24"
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-[var(--muted)]">
      </div>
      <div className="flex flex-1 items-center">
        <h2 className="text-[14vw] font-black leading-none text-[var(--foreground)] sm:text-[10vw] lg:text-[8vw]">
          ABOUT ME
        </h2>
      </div>
      <div className="flex flex-col gap-6 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:w-1/3">
          <span className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Info</span>
          <span className="h-px w-24 bg-white/20" />
        </div>
        <div className="sm:w-2/3">
          <div className="mb-4 h-px bg-white/20" />
          <p className="text-base leading-relaxed text-[var(--foreground)]/85">
            A Full Stack Developer passionate about creating solutions that truly matter.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[var(--foreground)]/70">
            I work with Python, Shell, React, and React Native, combining engineering,
             creativity, and product vision. I'm driven by innovation — especially in AI, 
             where I build, train, and refine models that solve real-world problems. I turn 
             ideas into robust, efficient, and thoughtfully crafted systems.
          </p>
          <div className="mt-6 h-px bg-white/20" />
        </div>
      </div>
    </section>
  );
}
