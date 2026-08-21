"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionProvider, signOut } from "next-auth/react";

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    href: "/admin/leads",
    label: "Leads",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Don't show layout on login page
  if (pathname === "/admin/login") {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#FFF3F0] via-white to-[#E8EEFF] flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 bg-white border-r border-slate-200/70 flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-slate-200/70">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#22D3EE] to-[#E879F9] rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-md shadow-[#22D3EE]/20">
                UF
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">Tu Futuro Dual</div>
                <div className="text-xs text-slate-400">Admin Panel</div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/20"
                      : "text-slate-500 hover:text-[#E879F9] hover:bg-[#E879F9]/10"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200/70 space-y-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#E879F9] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al sitio
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#22D3EE] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Mobile header */}
        <div className="flex-1 flex flex-col">
          <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#22D3EE] to-[#E879F9] rounded-lg flex items-center justify-center font-bold text-xs text-white">
                UF
              </div>
              <span className="font-bold text-sm text-slate-900">Admin</span>
            </Link>
            <div className="flex items-center gap-2">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-label={item.label}
                    className={`p-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#22D3EE]/10 text-[#22D3EE]"
                        : "text-slate-400 hover:text-[#E879F9]"
                    }`}
                  >
                    {item.icon}
                  </Link>
                );
              })}
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                aria-label="Cerrar sesión"
                className="p-2 rounded-lg text-slate-400 hover:text-[#22D3EE] hover:bg-[#22D3EE]/10 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
