"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const C = {
  bg: "#04080f", card: "#080f1e", card2: "#0c1628", border: "#162240",
  red: "#d4222a", gold: "#e8b84b", accent: "#3a8fe8", text: "#f0f5ff",
  muted: "#3a5070", muted2: "#7090b0", green: "#00a651",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [step, setStep] = useState<"form" | "sent">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !username.trim()) { setError("Remplis tous les champs"); return; }
    setLoading(true); setError("");
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          data: { username: username.trim() },
          emailRedirectTo: `${window.location.origin}/album`,
        },
      });
      if (err) throw err;
      setStep("sent");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      {/* Background decoration */}
      <div style={{ position: "fixed", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: `${C.red}08`, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -100, left: -100, width: 300, height: 300, borderRadius: "50%", background: `${C.gold}06`, pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>🏆</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 32, color: C.text, letterSpacing: 1 }}>PANINI</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 18, color: C.gold, letterSpacing: 3 }}>WORLD CUP 2026</div>
          <div style={{ fontSize: 12, color: C.muted2, marginTop: 6, letterSpacing: 1 }}>MA COLLECTION</div>
        </div>

        {step === "form" ? (
          <form onSubmit={handleLogin} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28, display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, color: C.muted2, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>
                Pseudo
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="ex: Adel28"
                maxLength={24}
                autoComplete="off"
              />
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, color: C.muted2, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ton@email.com"
                autoComplete="email"
              />
            </div>
            {error && <div style={{ color: "#ff6b6b", fontSize: 13, textAlign: "center" }}>{error}</div>}
            <button
              type="submit"
              disabled={loading}
              style={{ background: C.red, color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: 1, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: 4 }}
            >
              {loading ? "Envoi..." : "✉ RECEVOIR MON LIEN MAGIQUE"}
            </button>
            <p style={{ fontSize: 11, color: C.muted2, textAlign: "center", lineHeight: 1.5 }}>
              Un lien de connexion sera envoyé à ton email. Pas de mot de passe nécessaire.
            </p>
          </form>
        ) : (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 22, color: C.text, marginBottom: 8 }}>
              CHECK TES MAILS !
            </div>
            <p style={{ color: C.muted2, fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
              Un lien magique a été envoyé à<br />
              <span style={{ color: C.gold, fontWeight: 700 }}>{email}</span><br />
              Clique dessus pour accéder à ta collection.
            </p>
            <button
              onClick={() => setStep("form")}
              style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted2, borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontSize: 12, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 1 }}
            >
              ← Recommencer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
