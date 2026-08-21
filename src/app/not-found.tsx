import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="text-7xl font-display font-extrabold tracking-tight text-[var(--color-neon-primary)] drop-shadow-[0_0_18px_color-mix(in_srgb,var(--color-neon-primary)_45%,transparent)]">
          404
        </div>
        <h1 className="font-display text-3xl font-bold text-[var(--color-text-primary)]">
          Carta no encontrada en el mazo
        </h1>
        <p className="text-[var(--color-text-secondary)] max-w-md mx-auto leading-relaxed">
          La página que buscas no existe o fue movida a otra dimensión.
        </p>
        <Link
          href="/"
          className="card-glow inline-flex items-center gap-3 bg-[linear-gradient(135deg,var(--color-neon-primary),var(--color-neon-secondary))] text-[var(--color-deep)] font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}