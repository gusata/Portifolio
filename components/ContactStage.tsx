const contacts = [
  { label: "GitHub", value: "github.com/gustavo", href: "https://github.com/gustavo" },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/gustavo",
    href: "https://linkedin.com/in/gustavo",
  },
  { label: "Email", value: "contato@gustavo.dev", href: "mailto:contato@gustavo.dev" },
];

export function ContactStage() {
  return (
    <section
      id="contact"
      className="flex h-screen flex-col justify-center px-6 py-10 text-[var(--foreground)] sm:px-10 lg:px-16"
    >
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.7em] text-[var(--muted)]">Contato</p>
        <h2 className="text-4xl font-semibold">Vamos arquitetar a próxima narrativa.</h2>
        <p className="text-lg text-[var(--muted)]">
          Estou disponível para consultorias, parcerias e projetos autorais que combinem IA e design
          com estética oriental.
        </p>
      </div>
      <div className="mt-10 flex flex-col gap-4 text-sm uppercase tracking-[0.4em] text-[var(--muted)] sm:flex-row">
        {contacts.map((contact) => (
          <a
            key={contact.label}
            href={contact.href}
            target="_blank"
            rel="noreferrer"
            className="flex-1 border-t border-[var(--stroke)] pt-4 transition hover:text-[var(--foreground)]"
          >
            <span className="block text-[var(--foreground)]">{contact.label}</span>
            <span className="mt-2 block text-xs text-[var(--muted)] normal-case tracking-normal">
              {contact.value}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
