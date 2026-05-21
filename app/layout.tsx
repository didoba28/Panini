import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Panini WC26 — Ma Collection",
  description: "Suivi de collection Panini FIFA World Cup 2026",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#04080f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ background: "#04080f", minHeight: "100vh" }}>
        <a
          href="https://revolut.me/didobenammar"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            background: "#d4222a",
            color: "#ffffff",
            textAlign: "center",
            padding: "7px 12px",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 0.8,
            textTransform: "uppercase",
            textDecoration: "none",
            borderBottom: "1px solid #ef3340",
          }}
        >
          ❤️ Aider le créateur &amp; améliorer l&apos;application →
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
