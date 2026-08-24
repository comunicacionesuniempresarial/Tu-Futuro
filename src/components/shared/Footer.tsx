interface FooterProps {
  disclaimer?: string;
}

export function Footer({ disclaimer }: FooterProps) {
  return (
    <footer className="footer-brand relative overflow-hidden border-t-4 border-[var(--color-neon-primary)] py-10 text-center">
      <div aria-hidden="true" className="footer-glow" />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-5 px-4 sm:px-6">
        {disclaimer && (
          <p className="max-w-2xl text-xs text-slate-600">
            {disclaimer}
          </p>
        )}
        <img src="/logo/logo-header.png" alt="Uniempresarial — Fundación Universitaria Empresarial" className="h-auto w-64 max-w-full object-contain" />
        <nav
          aria-label="Enlaces del sitio"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-slate-700"
        >
          <a
            href="/"
            className="transition-colors hover:text-[#c99a00]"
          >
            Inicio
          </a>
          <a
            href="/test"
            className="transition-colors hover:text-[#c99a00]"
          >
            Inicia el test
          </a>
          <a
            href="https://uniempresarial.edu.co/pregrados-presenciales/"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-[#c99a00]"
          >
            Programas Uniempresarial
          </a>
        </nav>
        <p className="text-xs text-slate-500">
          &copy; 2026 TuFuturoDual · Una experiencia de Uniempresarial
        </p>
      </div>
    </footer>
  );
}
