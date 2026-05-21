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
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const mail = email.trim().toLowerCase();
    if (!mail || !password) { setError("Remplis tous les champs"); return; }
    if (password.length < 6) { setError("Mot de passe : 6 caractères minimum"); return; }
    if (mode === "signup" && !username.trim()) { setError("Choisis un pseudo"); return; }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email: mail,
          password,
          options: { data: { username: username.trim() } },
        });
        if (err) throw err;
        // Email confirmation désactivée → session créée immédiatement
        if (data.session) {
          router.push("/album");
          return;
        }
        // Sécurité : si la confirmation email est encore activée côté Supabase
        setError("Compte créé. Désactive « Confirm email » dans Supabase, puis connecte-toi.");
        setMode("login");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: mail,
          password,
        });
        if (err) throw err;
        router.push("/album");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur";
      if (/invalid login credentials/i.test(msg)) {
        setError("Email ou mot de passe incorrect");
      } else if (/already registered|already exists/i.test(msg)) {
        setError("Cet email a déjà un compte. Connecte-toi.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: C.card2, border: `1px solid ${C.border}`,
    borderRadius: 8, padding: "11px 12px", color: C.text, fontSize: 15,
    fontFamily: "'Barlow', sans-serif", outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
    fontSize: 11, color: C.muted2, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase",
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ position: "fixed", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: `${C.red}08`, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -100, left: -100, width: 300, height: 300, borderRadius: "50%", background: `${C.gold}06`, pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>🏆</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 32, color: C.text, letterSpacing: 1 }}>PANINI</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 18, color: C.gold, letterSpacing: 3 }}>WORLD CUP 2026</div>
          <div style={{ fontSize: 12, color: C.muted2, marginTop: 6, letterSpacing: 1 }}>MA COLLECTION</div>
        </div>

        {/* Tabs Connexion / Inscription */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {(["login", "signup"] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError(""); }}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 8, cursor: "pointer",
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: 1,
                background: mode === m ? C.red : "transparent",
                color: mode === m ? "#fff" : C.muted2,
                border: `1px solid ${mode === m ? C.red : C.border}`,
              }}
            >
              {m === "login" ? "CONNEXION" : "CRÉER UN COMPTE"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28, display: "flex", flexDirection: "column", gap: 16 }}>
          {mode === "signup" && (
            <div>
              <label style={labelStyle}>Pseudo</label>
              <input
                type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="ex: Adel28" maxLength={24} autoComplete="off" style={inputStyle}
              />
            </div>
          )}
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="ton@email.com" autoComplete="email" style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Mot de passe</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" autoComplete={mode === "signup" ? "new-password" : "current-password"}
              style={inputStyle}
            />
          </div>

          {error && <div style={{ color: "#ff6b6b", fontSize: 13, textAlign: "center", lineHeight: 1.5 }}>{error}</div>}

          <button
            type="submit" disabled={loading}
            style={{ background: C.red, color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: 1, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: 4 }}
          >
            {loading ? "..." : mode === "login" ? "SE CONNECTER" : "CRÉER MON COMPTE"}
          </button>
        </form>
      </div>
    </div>
  );
}
