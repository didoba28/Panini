"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Redirect client-side → fonctionne même sans SSR (Netlify static)
export default function Home() {
  const router = useRouter();
  useEffect(() => { router.replace("/login"); }, [router]);

  // Splash minimaliste pendant la redirection
  return (
    <div style={{ minHeight: "100vh", background: "#04080f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 52, marginBottom: 12 }}>🏆</div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 28, color: "#f0f5ff", letterSpacing: 1 }}>PANINI WC26</div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, color: "#7090b0", marginTop: 8, letterSpacing: 2 }}>CHARGEMENT...</div>
    </div>
  );
}
