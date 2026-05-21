"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const C = { bg: "#080f1e", border: "#162240", red: "#d4222a", muted2: "#7090b0", text: "#f0f5ff" };

const TABS = [
  { href: "/album", icon: "📒", label: "ALBUM" },
  { href: "/scanner", icon: "📷", label: "SCANNER" },
  { href: "/marche", icon: "🔄", label: "MARCHÉ" },
  { href: "/classement", icon: "🏆", label: "CLASSEMENT" },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      background: C.bg, borderTop: `1px solid ${C.border}`,
      display: "flex", height: 60,
    }}>
      {TABS.map(t => {
        const active = path.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 2, textDecoration: "none",
            color: active ? C.red : C.muted2,
            borderTop: active ? `2px solid ${C.red}` : "2px solid transparent",
            transition: "all .15s",
          }}>
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: 1 }}>
              {t.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
