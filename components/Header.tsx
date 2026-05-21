"use client";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const C = { bg: "#080f1e", border: "#162240", red: "#d4222a", gold: "#e8b84b", text: "#f0f5ff", muted2: "#7090b0" };
const AVC = ["#d4222a","#e8b84b","#00a651","#3a8fe8","#9b59b6","#e67e22","#1abc9c"];
const avc = (n: string) => AVC[n.charCodeAt(0) % AVC.length];

export default function Header({ username, owned, total }: { username: string; owned: number; total: number }) {
  const router = useRouter();
  const pct = total > 0 ? Math.round(owned / total * 100) : 0;

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 50 }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
        <span style={{ fontSize: 20 }}>🏆</span>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 16, color: C.text, lineHeight: 1 }}>PANINI WC26</div>
          <div style={{ fontSize: 10, color: C.gold, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: 1 }}>
            {owned}/{total} — {pct}%
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 2, overflow: "hidden", display: "none" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: C.red, transition: "width .4s" }} />
      </div>

      {/* Avatar + logout */}
      <button onClick={logout} title="Déconnexion" style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", cursor: "pointer" }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: avc(username), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#fff", fontFamily: "'Barlow Condensed', sans-serif" }}>
          {username[0]?.toUpperCase()}
        </div>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, color: C.muted2 }}>{username}</span>
      </button>
    </header>
  );
}
