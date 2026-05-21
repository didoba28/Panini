"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { TOTAL } from "@/lib/stickers";
import { getAllCollections } from "@/lib/collection";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const C = { bg: "#04080f", card: "#080f1e", card2: "#0c1628", border: "#162240", red: "#d4222a", gold: "#e8b84b", goldLight: "#f5d080", green: "#00a651", accent: "#3a8fe8", text: "#f0f5ff", muted: "#3a5070", muted2: "#7090b0" };
const AVC = ["#d4222a","#e8b84b","#00a651","#3a8fe8","#9b59b6","#e67e22","#1abc9c"];
const avc = (n: string) => AVC[n.charCodeAt(0) % AVC.length];

const MEDALS = ["🥇","🥈","🥉"];

export default function ClassementPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [ranking, setRanking] = useState<{ username: string; owned: number; pct: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { router.push("/login"); return; }
      const { data: profile } = await supabase.from("profiles").select("username").eq("id", u.id).single();
      setUser({ id: u.id, username: profile?.username ?? "User" });
      const all = await getAllCollections();
      const rank = Object.entries(all).map(([username, col]) => {
        const owned = Object.values(col).filter(q => q >= 1).length;
        return { username, owned, pct: Math.round(owned / TOTAL * 100) };
      }).sort((a, b) => b.owned - a.owned);
      setRanking(rank);
      setLoading(false);
    })();
  }, [router]);

  const myOwned = Object.values(ranking.find(r => r.username === user?.username) ?? { owned: 0 }).length > 0
    ? ranking.find(r => r.username === user?.username)?.owned ?? 0
    : 0;

  if (loading) return <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted2, fontFamily: "'Barlow Condensed', sans-serif" }}>CHARGEMENT...</div>;

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      {user && <Header username={user.username} owned={myOwned} total={TOTAL} />}

      <div style={{ padding: "20px 16px 100px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 24, color: C.text, marginBottom: 4 }}>🏆 CLASSEMENT</div>
        <div style={{ color: C.muted2, fontSize: 13, marginBottom: 20 }}>{ranking.length} collectionneurs</div>

        {ranking.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: C.muted2 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📊</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16 }}>Aucun collectionneur encore</div>
          </div>
        ) : ranking.map((r, i) => {
          const isMe = r.username === user?.username;
          return (
            <div
              key={r.username}
              style={{
                background: isMe ? `${C.red}18` : C.card,
                border: `1px solid ${isMe ? C.red : C.border}`,
                borderRadius: 8, padding: "12px 14px", marginBottom: 8,
                display: "flex", alignItems: "center", gap: 12,
              }}
            >
              {/* Rank */}
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 18, color: i < 3 ? C.gold : C.muted2, minWidth: 28, textAlign: "center" }}>
                {i < 3 ? MEDALS[i] : `#${i + 1}`}
              </div>

              {/* Avatar */}
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: avc(r.username), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#fff", fontFamily: "'Barlow Condensed', sans-serif", flexShrink: 0 }}>
                {r.username[0]?.toUpperCase()}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 15, color: isMe ? C.text : C.text, display: "flex", alignItems: "center", gap: 6 }}>
                  {r.username}
                  {isMe && <span style={{ fontSize: 9, background: C.red, color: "#fff", borderRadius: 3, padding: "1px 5px", fontWeight: 900, letterSpacing: 0.5 }}>MOI</span>}
                </div>
                <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: "hidden", marginTop: 4 }}>
                  <div style={{ width: `${r.pct}%`, height: "100%", background: i === 0 ? C.gold : i === 1 ? C.muted2 : i === 2 ? "#cd7f32" : C.accent, transition: "width .4s" }} />
                </div>
              </div>

              {/* Score */}
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 18, color: i < 3 ? C.gold : C.text }}>{r.pct}%</div>
                <div style={{ fontSize: 10, color: C.muted2 }}>{r.owned}/{TOTAL}</div>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
