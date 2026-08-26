"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/test", label: "Inicia el test" },
  { href: "/resultados", label: "Mi resultado" },
  { href: "https://uniempresarial.edu.co/pregrados-presenciales/", label: "Programas", external: true },
];

/** Persistent public navigation with a keyboard-accessible mobile menu. */
export default function BrandHeader() {
  const pathname = usePathname();
  const [hasResult, setHasResult] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuNavRef = useRef<HTMLElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncResult = () => setHasResult(Boolean(window.sessionStorage.getItem("tufuturo-results")));
    syncResult();
    window.addEventListener("focus", syncResult);
    return () => window.removeEventListener("focus", syncResult);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  /* Escape key closes the menu */
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        return;
      }
      /* Focus trap: Tab cycles within the mobile menu */
      if (e.key === "Tab" && menuNavRef.current) {
        const focusable = menuNavRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, closeMenu]);

  /* Move focus into the menu when it opens */
  useEffect(() => {
    if (menuOpen) {
      const firstLink = menuNavRef.current?.querySelector<HTMLElement>("a, button");
      firstLink?.focus();
    }
  }, [menuOpen]);

  /* Click outside closes the menu */
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(e.target as Node)
      ) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, closeMenu]);

  const visibleLinks = navLinks.filter((link) => link.label !== "Mi resultado" || hasResult);
  const isActive = (path: string) =>
    pathname === path ? "border-b-2 border-[var(--color-neon-primary)] font-bold" : "";

  const renderLink = (link: (typeof navLinks)[number], mobile = false) => {
    const className = `text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-neon-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-neon-primary)] ${mobile ? "block rounded-xl px-4 py-3" : ""} ${isActive(link.href)}`;
    return link.external ? (
      <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className={className}>
        {link.label}
      </a>
    ) : (
      <Link
        key={link.label}
        href={link.href}
        className={className}
        aria-current={pathname === link.href ? "page" : undefined}
      >
        {link.label}
      </Link>
    );
  };

  return (
    <header
      data-persistent="true"
      className="fixed top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-surface-container-lowest,var(--color-deep))]/80 backdrop-blur-xl"
    >
      <div ref={menuContainerRef} className="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          aria-label="TuFuturoDual - Inicio"
          className="flex min-w-0 shrink items-center font-display text-lg font-bold tracking-tight text-[var(--color-text-primary)] sm:text-xl"
        >
          <span className="truncate">TuFuturo<span className="text-[var(--color-neon-primary)] drop-shadow-[0_0_14px_color-mix(in_srgb,var(--color-neon-primary)_55%,transparent)]">Dual</span></span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-8 md:flex">
          {visibleLinks.map((link) => renderLink(link))}
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="public-navigation-mobile"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-neon-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-neon-primary)] md:hidden"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            {menuOpen ? <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" /> : <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>

        <div className="hidden w-24 md:block" aria-hidden="true" />

        {menuOpen && (
          <nav
            ref={menuNavRef}
            id="public-navigation-mobile"
            aria-label="Navegación principal móvil"
            className="absolute left-3 right-3 top-full mt-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-2xl md:hidden"
          >
            {visibleLinks.map((link) => renderLink(link, true))}
          </nav>
        )}
      </div>
    </header>
  );
}
