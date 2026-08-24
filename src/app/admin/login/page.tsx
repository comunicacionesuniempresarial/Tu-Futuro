"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * Placeholder con efecto typewriter: cicla frases genéricas mientras
 * el campo está vacío. Nunca revela credenciales reales.
 * Se detiene en cuanto el usuario escribe (active = false).
 */
function useTypewriter(phrases: string[], active: boolean) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!active) {
      return;
    }
    let pIdx = 0;
    let cIdx = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const phrase = phrases[pIdx] ?? "";
      if (!deleting) {
        cIdx += 1;
        setText(phrase.slice(0, cIdx));
        if (cIdx >= phrase.length) {
          timer = setTimeout(() => {
            deleting = true;
            tick();
          }, 1600);
          return;
        }
        timer = setTimeout(tick, 65);
      } else {
        cIdx -= 1;
        setText(phrase.slice(0, cIdx));
        if (cIdx <= 0) {
          deleting = false;
          pIdx = (pIdx + 1) % phrases.length;
          timer = setTimeout(tick, 450);
          return;
        }
        timer = setTimeout(tick, 30);
      }
    };

    timer = setTimeout(tick, 250);
    return () => clearTimeout(timer);
  }, [active, phrases]);

  return text;
}

// Frases genéricas — no exponen el correo ni claves reales.
const EMAIL_HINTS = [
  "Ingresa el correo…",
  "Correo autorizado…",
  "Escribe tu correo…",
];

const PASSWORD_HINTS = [
  "Ingresa la contraseña…",
  "Tu clave de acceso…",
  "Escribe tu contraseña…",
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailPlaceholder = useTypewriter(EMAIL_HINTS, email.length === 0);
  const passwordPlaceholder = useTypewriter(PASSWORD_HINTS, password.length === 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.code === "throttled") {
          setError("Demasiados intentos. Intenta en unos minutos.");
        } else {
          setError("Correo o contraseña incorrectos");
        }
      } else {
        router.push("/admin");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF3F0] via-white to-[#E8EEFF] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Blobs de marca */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-[#22D3EE]/10 blur-[120px]" />
        <div className="absolute bottom-0 -right-40 w-[520px] h-[520px] rounded-full bg-[#E879F9]/15 blur-[130px]" />
      </div>
      <div className="w-full max-w-sm space-y-8 animate-fade-in relative z-10">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-[#22D3EE] to-[#E879F9] rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-[#22D3EE]/25">
              UF
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">Panel de admisiones</h1>
          <p className="text-sm text-slate-500 mt-2">
            Inicia sesión para gestionar leads
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/60 border border-slate-200/70">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="admin-email" className="block text-sm font-semibold text-slate-900">Correo</label>
              <input
                id="admin-email"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-4 rounded-xl bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#22D3EE] focus:outline-none transition-colors"
                placeholder={emailPlaceholder}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-password" className="block text-sm font-semibold text-slate-900">Contraseña</label>
              <input
                id="admin-password"
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 rounded-xl bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#22D3EE] focus:outline-none transition-colors"
                placeholder={passwordPlaceholder}
              />
            </div>

            {error && (
              <div
                role="alert"
                className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 text-center"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-[#22D3EE] to-[#E879F9] text-white shadow-lg shadow-[#22D3EE]/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm text-slate-400 hover:text-[#E879F9] transition-colors">
            ← Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  );
}
