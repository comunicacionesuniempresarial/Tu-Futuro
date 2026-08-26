import Image from "next/image";
import Link from "next/link";

interface FooterProps {
  disclaimer?: string;
}

export function Footer({ disclaimer }: FooterProps) {
  return (
    <footer className="footer-brand relative overflow-hidden border-t border-[var(--color-neon-primary)]/40 py-10 text-center">
      <div aria-hidden="true" className="footer-glow" />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-5 px-4 sm:px-6">
        {disclaimer && <p className="max-w-2xl text-xs text-slate-600">{disclaimer}</p>}
        <Image
          src="/logo/logo-header.png"
          alt="Uniempresarial — Fundación Universitaria Empresarial"
          width={1190}
          height={304}
          sizes="(max-width: 640px) 100vw, 256px"
          className="h-auto w-64 max-w-full object-contain"
        />
        <nav aria-label="Enlaces del sitio" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-[var(--color-text-secondary)]">
          <Link href="/" className="transition-colors hover:text-[var(--color-neon-primary)]">Inicio</Link>
          <Link href="/privacidad" className="transition-colors hover:text-[var(--color-neon-primary)]">Privacidad y datos</Link>
          <Link href="/terminos" className="transition-colors hover:text-[var(--color-neon-primary)]">Términos de uso</Link>
          <Link href="/admin/login" className="transition-colors hover:text-[var(--color-neon-primary)]">Acceso de admisiones</Link>
          <Link href="/test" className="transition-colors hover:text-[var(--color-neon-primary)]">Inicia el test</Link>
          <a href="https://uniempresarial.edu.co/pregrados-presenciales/" target="_blank" rel="noreferrer" className="transition-colors hover:text-[var(--color-neon-primary)]">Programas Uniempresarial</a>
        </nav>
        <p className="text-xs text-slate-500">&copy; 2026 TuFuturoDual · Una experiencia de Uniempresarial</p>
      </div>
    </footer>
  );
}
