interface FooterProps {
  disclaimer?: string;
}

export function Footer({ disclaimer }: FooterProps) {
  return (
    <footer className="bg-[var(--color-deep)] parchment border-t border-[var(--color-neon-secondary)]/20 py-10 text-center">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-3 px-4 sm:px-6">
        {disclaimer && (
          <p className="mb-4 max-w-2xl text-xs text-[var(--color-text-muted)]">
            {disclaimer}
          </p>
        )}
        <p className="font-display text-lg font-bold text-[var(--color-text-primary)]">
          TuFuturo<span className="text-[var(--color-neon-primary)]">Dual</span>
        </p>
        <nav
          aria-label="Enlaces legales"
          className="flex items-center gap-6 text-sm text-[var(--color-text-secondary)]"
        >
          <a
            href="#"
            className="transition-colors hover:text-[var(--color-neon-primary)]"
          >
            Privacidad
          </a>
          <a
            href="#"
            className="transition-colors hover:text-[var(--color-neon-primary)]"
          >
            Términos
          </a>
          <a
            href="#"
            className="transition-colors hover:text-[var(--color-neon-primary)]"
          >
            Hechizos
          </a>
        </nav>
        <p className="text-xs text-[var(--color-text-muted)]">
          &copy; 2025 TuFuturoDual - El C&oacute;dice de Destinos
        </p>
        <p className="text-xs text-[var(--color-text-muted)]">
          Fundaci&oacute;n Universitaria Empresarial de la CCB &mdash;
          Uniempresarial
        </p>
      </div>
    </footer>
  );
}
