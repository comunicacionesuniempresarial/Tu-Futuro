import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/site-url";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Tu Futuro Dual — Descubre tu carrera ideal",
    template: "%s — Tu Futuro Dual",
  },
  description:
    "Test vocacional gamificado de Uniempresarial. Descubre cuál carrera universitaria se adapta mejor a tus intereses, personalidad y habilidades.",
  keywords: [
    "orientación vocacional",
    "carrera universitaria",
    "Uniempresarial",
    "test vocacional",
    "Bogotá",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Tu Futuro Dual",
    title: "Tu Futuro Dual — Descubre tu carrera ideal",
    description:
      "Test vocacional gamificado de Uniempresarial. Descubre cuál carrera universitaria se adapta mejor a tus intereses, personalidad y habilidades.",
    images: [{ url: "/images/poster-img0263.jpeg", width: 1280, height: 720 }],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-scroll-behavior="smooth" className={`${display.variable} ${body.variable} dark`}>
      <head>
      </head>
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] antialiased">
        {children}
      </body>
    </html>
  );
}
