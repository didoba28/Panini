"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { TEAMS, STICKERS, SMAP, CONF_COL, TOTAL, CONFS, TEAM_FLAGS, type Sticker, type Team } from "@/lib/stickers";
import { getCollection, saveCollection } from "@/lib/collection";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const C = { bg: "#04080f", card: "#080f1e", card2: "#0c1628", border: "#162240", red: "#d4222a", gold: "#e8b84b", goldLight: "#f5d080", green: "#00a651", accent: "#3a8fe8", text: "#f0f5ff", muted: "#3a5070", muted2: "#7090b0" };

// ─── FLAG IMAGE ───────────────────────────────────────────────────────────────
function FlagImg({ flagKey, emoji, size = 28 }: { flagKey: string | null; emoji: string; size?: number }) {
  const [fail, setFail] = useState(false);
  if (flagKey === "wc" || !flagKey || fail) return <span style={{ fontSize: size * 0.75, lineHeight: 1 }}>{emoji}</span>;
  const url = TEAM_FLAGS[flagKey];
  if (!url) return <span style={{ fontSize: size * 0.75, lineHeight: 1 }}>{emoji}</span>;
  return (
    <div style={{ width: size, height: Math.round(size * 0.65), overflow: "hidden", borderRadius: 3, flexShrink: 0 }}>
      <img src={url} alt="" style={{ height: "100%", width: "auto", objectFit: "cover" }} onError={() => setFail(true)} />
    </div>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function PBar({ value, total, color = C.accent, h = 4 }: { value: number; total: number; color?: string; h?: number }) {
  const p = total > 0 ? Math.round(value / total * 100) : 0;
  return (
    <div style={{ height: h, background: C.border, borderRadius: h / 2, overflow: "hidden" }}>
      <div style={{ width: `${p}%`, height: "100%", background: color, borderRadius: h / 2, transition: "width .4s" }} />
    </div>
  );
}

// ─── TEAM MODAL ───────────────────────────────────────────────────────────────
function TeamModal({ team, col, onUpdate, onClose }: {
  team: Team; col: Record<number, number>; onUpdate: (id: number, qty: number) => void; onClose: () => void;
}) {
  const cc = CONF_COL[team.conf] || C.accent;
  const stickers = STICKERS.filter(s => s.teamId === team.id);
  const owned = stickers.filter(s => (col[s.id] || 0) >= 1).length;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", flexDirection: "column", background: C.bg }}>
      {/* Header */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onClose} style={{ background: "transparent", border: "none", color: C.muted2, cursor: "pointer", fontSize: 20, lineHeight: 1 }}>←</button>
        <FlagImg flagKey={team.flagKey} emoji={team.emoji} size={32} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 18, color: C.text }}>{team.name}</div>
          <div style={{ fontSize: 11, color: C.muted2 }}>{owned}/{stickers.length} stickers</div>
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 22, color: owned === stickers.length ? C.gold : cc }}>
          {stickers.length > 0 ? Math.round(owned / stickers.length * 100) : 0}%
        </div>
      </div>
      <div style={{ height: 4, background: cc + "30" }}>
        <div style={{ width: `${stickers.length > 0 ? Math.round(owned / stickers.length * 100) : 0}%`, height: "100%", background: cc, transition: "width .4s" }} />
      </div>

      {/* Stickers grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 8 }}>
          {stickers.map(s => {
            const qty = col[s.id] || 0;
            const has = qty >= 1;
            const isDouble = qty >= 2;
            return (
              <div
                key={s.id}
                onClick={() => onUpdate(s.id, has ? 0 : 1)}
                style={{
                  background: has ? `${cc}15` : C.card2,
                  border: `1px solid ${has ? cc : C.border}`,
                  borderTop: `3px solid ${has ? cc : C.border}`,
                  borderRadius: 6, padding: "8px 10px", cursor: "pointer",
                  transition: "all .15s", position: "relative",
                  opacity: has ? 1 : 0.6,
                }}
              >
                {/* Code */}
                <div style={{ fontSize: 9, color: cc, fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.5, marginBottom: 2 }}>
                  {s.code}
                </div>
                {/* Name */}
                <div style={{ fontSize: 11, fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: 4 }}>{s.name}</div>
                {/* Check */}
                <div style={{ fontSize: 14, textAlign: "right" }}>
                  {has ? (isDouble ? "🟡" : "✅") : "⬜"}
                </div>
                {/* Double badge */}
                {isDouble && (
                  <div style={{ position: "absolute", top: 4, right: 4, background: C.gold, color: "#000", fontSize: 8, fontWeight: 900, borderRadius: 3, padding: "1px 4px", fontFamily: "'Barlow Condensed', sans-serif" }}>
                    ×{qty}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Doublons section */}
        {stickers.some(s => (col[s.id] || 0) >= 1) && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 11, color: C.muted2, letterSpacing: 1, marginBottom: 10 }}>GESTION DOUBLONS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8 }}>
              {stickers.filter(s => (col[s.id] || 0) >= 1).map(s => {
                const qty = col[s.id] || 0;
                return (
                  <div key={s.id} style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 9, color: cc, fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif" }}>{s.code}</div>
                      <div style={{ fontSize: 11, color: C.text, fontWeight: 600 }}>{s.name}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
                      <button onClick={() => onUpdate(s.id, qty + 1)} style={{ background: C.green + "20", border: `1px solid ${C.green}`, color: C.green, borderRadius: 4, width: 22, height: 22, cursor: "pointer", fontSize: 14, lineHeight: 1 }}>+</button>
                      <span style={{ fontSize: 12, fontWeight: 800, color: C.gold, fontFamily: "'Barlow Condensed', sans-serif" }}>×{qty}</span>
                      <button onClick={() => onUpdate(s.id, Math.max(0, qty - 1))} style={{ background: C.red + "20", border: `1px solid ${C.red}`, color: C.red, borderRadius: 4, width: 22, height: 22, cursor: "pointer", fontSize: 14, lineHeight: 1 }}>−</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN ALBUM PAGE ──────────────────────────────────────────────────────────
export default function AlbumPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [col, setCol] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [conf, setConf] = useState("Tous");
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<number, number>>({});

  // Auth check + load collection
  useEffect(() => {
    (async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { router.push("/login"); return; }
      const { data: profile } = await supabase.from("profiles").select("username").eq("id", u.id).single();
      const username = profile?.username ?? u.email?.split("@")[0] ?? "User";
      setUser({ id: u.id, username });
      const c = await getCollection(u.id);
      setCol(c);
      setLoading(false);
    })();
  }, [router]);

  // Save pending changes to Supabase (debounced)
  useEffect(() => {
    if (!user || Object.keys(pendingChanges).length === 0) return;
    const timer = setTimeout(async () => {
      setSaving(true);
      await saveCollection(user.id, pendingChanges);
      setPendingChanges({});
      setSaving(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [pendingChanges, user]);

  const updateSticker = useCallback((id: number, qty: number) => {
    setCol(prev => ({ ...prev, [id]: qty }));
    setPendingChanges(prev => ({ ...prev, [id]: qty }));
  }, []);

  const owned = Object.values(col).filter(q => q >= 1).length;

  const filteredTeams = TEAMS.filter(t => {
    if (conf !== "Tous" && t.conf !== conf) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.code.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", color: C.muted2, fontSize: 14, letterSpacing: 1 }}>CHARGEMENT...</div>
      </div>
    </div>
  );

  if (selectedTeam) return (
    <TeamModal
      team={selectedTeam}
      col={col}
      onUpdate={updateSticker}
      onClose={() => setSelectedTeam(null)}
    />
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <Header username={user?.username ?? ""} owned={owned} total={TOTAL} />

      {/* Global progress */}
      <div style={{ padding: "12px 16px 8px", background: C.card, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, color: C.muted2, letterSpacing: 1 }}>PROGRESSION GLOBALE</span>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 14, color: C.gold }}>
            {owned}/{TOTAL} — {Math.round(owned / TOTAL * 100)}%
          </span>
        </div>
        <PBar value={owned} total={TOTAL} color={C.red} h={6} />
        {saving && <div style={{ fontSize: 10, color: C.muted2, marginTop: 4, textAlign: "right" }}>💾 Sauvegarde...</div>}
      </div>

      {/* Filters */}
      <div style={{ padding: "10px 16px", background: C.card, borderBottom: `1px solid ${C.border}` }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Rechercher une équipe..."
          style={{ marginBottom: 10 }}
        />
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
          {CONFS.map(c => (
            <button
              key={c}
              onClick={() => setConf(c)}
              style={{
                flexShrink: 0, padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer",
                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: 0.5,
                background: conf === c ? C.red : C.card2,
                color: conf === c ? "#fff" : C.muted2,
                transition: "all .15s",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Teams grid */}
      <div style={{ padding: "12px 12px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(156px, 1fr))", gap: 10 }}>
          {filteredTeams.map(team => {
            const cc = CONF_COL[team.conf] || C.accent;
            const teamStickers = STICKERS.filter(s => s.teamId === team.id);
            const teamOwned = teamStickers.filter(s => (col[s.id] || 0) >= 1).length;
            const pct = teamStickers.length > 0 ? Math.round(teamOwned / teamStickers.length * 100) : 0;
            const done = pct === 100;

            return (
              <div
                key={team.id}
                onClick={() => setSelectedTeam(team)}
                className="fade-up"
                style={{
                  background: done ? `${cc}15` : C.card,
                  border: `1px solid ${done ? cc : C.border}`,
                  borderTop: `3px solid ${cc}`,
                  borderRadius: 8, padding: "12px 14px", cursor: "pointer",
                  transition: "all .15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <FlagImg flagKey={team.flagKey} emoji={team.emoji} size={28} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 14, color: C.text, lineHeight: 1.1 }}>{team.name}</div>
                    <div style={{ fontSize: 10, color: C.muted2, fontWeight: 600 }}>{team.conf}</div>
                  </div>
                  {done && <span style={{ fontSize: 14 }}>⭐</span>}
                </div>
                <PBar value={teamOwned} total={teamStickers.length} color={cc} h={4} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: 10, color: C.muted2 }}>{teamOwned}/{teamStickers.length}</span>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 11, color: done ? C.gold : cc }}>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
        {filteredTeams.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: C.muted2 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14 }}>Aucune équipe trouvée</div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
