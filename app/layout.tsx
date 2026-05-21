import type { Metadata, Viewport } from "next";
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
        {children}
      </body>
    </html>
  );
}
