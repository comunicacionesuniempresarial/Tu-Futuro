"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: "/test", label: "Inicia el test" },
  { href: "/resultados", label: "Mi resultado" },
  { href: "https://uniempresarial.edu.co/pregrados-presenciales/", label: "Programas", external: true },
];



/**
 * Persistent brand header for the Duelo: wordmark dorado, navegación del
 * mundo (El Duelo / Tu Mazo / La Academia) y redes sociales de la marca.
 * Stays pinned on scroll.
 */
export default function BrandHeader() {
  const pathname = usePathname();
  const [hasResult, setHasResult] = useState(false);
  useEffect(() => {
    const syncResult = () => setHasResult(Boolean(window.sessionStorage.getItem("tufuturo-results")));
    syncResult();
    window.addEventListener("focus", syncResult);
    return () => window.removeEventListener("focus", syncResult);
  }, []);
  const isActive = (path: string) => pathname === path ? 'border-b-2 border-[var(--color-neon-primary)] font-bold' : '';

  return (
    <header
      data-persistent="true"
      className="fixed top-0 w-full z-50 border-b border-[var(--color-border)] bg-[var(--color-surface-container-lowest,var(--color-deep))]/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href="/"
          aria-label="TuFuturoDual - Inicio"
          className="flex shrink-0 items-center font-display text-xl font-bold tracking-tight text-[var(--color-text-primary)]"
        >
          TuFuturo<span className="text-[var(--color-neon-primary)] drop-shadow-[0_0_14px_color-mix(in_srgb,var(--color-neon-primary)_55%,transparent)]">Dual</span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-8 md:flex">
          {navLinks.filter((link) => link.label !== "Mi resultado" || hasResult).map((link) => link.external ? (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-neon-primary)]"
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-neon-primary)] ${isActive(link.href)}`}
            >{link.label}</Link>
          ))}
        </nav>

        <div className="hidden md:block w-24" aria-hidden="true" />
      </div>
    </header>
  );
}
