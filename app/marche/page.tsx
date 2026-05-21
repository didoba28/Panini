"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { SMAP, STICKERS, CONF_COL } from "@/lib/stickers";
import { getCollection } from "@/lib/collection";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const C = { bg: "#04080f", card: "#080f1e", card2: "#0c1628", border: "#162240", red: "#d4222a", redBright: "#ef3340", gold: "#e8b84b", green: "#00a651", accent: "#3a8fe8", text: "#f0f5ff", muted: "#3a5070", muted2: "#7090b0" };

type Listing = { id: string; seller_id: string; seller_username: string; card_id: number; status: string; created_at: string };
type Proposal = { id: string; listing_id: string; buyer_id: string; buyer_username: string; offered_card_id: number; message: string | null; status: string; created_at: string };

export default function MarchePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [col, setCol] = useState<Record<number, number>>({});
  const [listings, setListings] = useState<Listing[]>([]);
  const [tab, setTab] = useState<"marche" | "mes-offres" | "mes-demandes">("marche");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [proposingTo, setProposingTo] = useState<Listing | null>(null);
  const [offeredCard, setOfferedCard] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { router.push("/login"); return; }
      const { data: profile } = await supabase.from("profiles").select("username").eq("id", u.id).single();
      setUser({ id: u.id, username: profile?.username ?? "User" });
      setCol(await getCollection(u.id));
      await loadListings();
      setLoading(false);
    })();
  }, [router]);

  async function loadListings() {
    const { data } = await supabase.from("market_listings").select("*").eq("status", "open").order("created_at", { ascending: false });
    setListings(data ?? []);
  }

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  async function postListing(cardId: number) {
    if (!user) return;
    const { error } = await supabase.from("market_listings").insert({ seller_id: user.id, seller_username: user.username, card_id: cardId });
    if (error) { showToast("❌ Erreur lors de la publication"); return; }
    showToast("✅ Doublon publié !");
    loadListings();
  }

  async function sendProposal() {
    if (!user || !proposingTo) return;
    const s = STICKERS.find(st => st.code === offeredCard.toUpperCase().trim());
    if (!s) { showToast("❌ Code sticker invalide (ex: FRA-3)"); return; }
    if ((col[s.id] || 0) < 2) { showToast("❌ Tu n'as pas ce doublon"); return; }
    const { error } = await supabase.from("proposals").insert({ listing_id: proposingTo.id, buyer_id: user.id, buyer_username: user.username, offered_card_id: s.id });
    if (error) { showToast("❌ Erreur lors de la proposition"); return; }
    showToast("✅ Proposition envoyée !");
    setProposingTo(null); setOfferedCard("");
  }

  // Mes doublons = stickers avec qty >= 2 pas encore sur le marché
  const myDoubles = STICKERS.filter(s => (col[s.id] || 0) >= 2);
  const myListings = listings.filter(l => l.seller_id === user?.id);
  const otherListings = listings.filter(l => l.seller_id !== user?.id);
  const owned = Object.values(col).filter(q => q >= 1).length;

  if (loading) return <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted2, fontFamily: "'Barlow Condensed', sans-serif" }}>CHARGEMENT...</div>;

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      {user && <Header username={user.username} owned={owned} total={994} />}
      {toast && <div style={{ position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)", background: C.green, color: "#fff", padding: "10px 20px", borderRadius: 6, fontWeight: 700, fontSize: 13, fontFamily: "'Barlow Condensed', sans-serif", zIndex: 999, whiteSpace: "nowrap" }}>{toast}</div>}

      {/* Tabs */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, display: "flex" }}>
        {([["marche", "🔄 MARCHÉ"], ["mes-offres", "📤 MES OFFRES"], ["mes-demandes", "📥 MES DEMANDES"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ flex: 1, padding: "12px 4px", background: "transparent", border: "none", borderBottom: tab === key ? `2px solid ${C.red}` : "2px solid transparent", color: tab === key ? C.text : C.muted2, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 0.5, cursor: "pointer" }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px 16px 100px", maxWidth: 480, margin: "0 auto" }}>

        {/* MARCHÉ */}
        {tab === "marche" && (
          <div>
            {otherListings.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: C.muted2 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🔄</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, marginBottom: 4 }}>MARCHÉ VIDE</div>
                <div style={{ fontSize: 12 }}>Personne n'a encore publié de doublon</div>
              </div>
            ) : otherListings.map(listing => {
              const s = SMAP[listing.card_id];
              if (!s) return null;
              const cc = CONF_COL[s.conf] || C.accent;
              return (
                <div key={listing.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${cc}`, borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 14, color: C.text }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: cc, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>{s.code} — {s.teamName}</div>
                      <div style={{ fontSize: 11, color: C.muted2, marginTop: 2 }}>Offert par {listing.seller_username}</div>
                    </div>
                    <button
                      onClick={() => setProposingTo(listing)}
                      style={{ background: C.red, color: "#fff", border: "none", borderRadius: 6, padding: "7px 14px", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 12, cursor: "pointer" }}
                    >
                      PROPOSER
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MES OFFRES */}
        {tab === "mes-offres" && (
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 13, color: C.muted2, letterSpacing: 1, marginBottom: 12 }}>
              MES DOUBLONS À PROPOSER
            </div>
            {myDoubles.length === 0 ? (
              <div style={{ textAlign: "center", padding: 30, color: C.muted2, fontSize: 13 }}>Pas de doublons pour l'instant</div>
            ) : myDoubles.map(s => {
              const cc = CONF_COL[s.conf] || C.accent;
              const already = myListings.some(l => l.card_id === s.id);
              return (
                <div key={s.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${cc}`, borderRadius: 8, padding: "10px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 13, color: C.text }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: cc, fontFamily: "'Barlow Condensed', sans-serif" }}>{s.code} · ×{col[s.id]}</div>
                  </div>
                  {already ? (
                    <span style={{ fontSize: 11, color: C.green, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>✅ PUBLIÉ</span>
                  ) : (
                    <button onClick={() => postListing(s.id)} style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 11, cursor: "pointer" }}>
                      PUBLIER
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* MES DEMANDES */}
        {tab === "mes-demandes" && (
          <div style={{ textAlign: "center", padding: 40, color: C.muted2 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📥</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, marginBottom: 4 }}>MES PROPOSITIONS</div>
            <div style={{ fontSize: 12 }}>Les propositions reçues apparaîtront ici</div>
          </div>
        )}
      </div>

      {/* Propose modal */}
      {proposingTo && (
        <div style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: C.card, borderTop: `1px solid ${C.border}`, borderRadius: "16px 16px 0 0", padding: 24, width: "100%", maxWidth: 480 }} className="fade-up">
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 18, color: C.text, marginBottom: 4 }}>FAIRE UNE PROPOSITION</div>
            <div style={{ fontSize: 12, color: C.muted2, marginBottom: 16 }}>
              En échange de {SMAP[proposingTo.card_id]?.code} ({SMAP[proposingTo.card_id]?.name})
            </div>
            <input value={offeredCard} onChange={e => setOfferedCard(e.target.value)} placeholder="Ton doublon (ex: FRA-3)" style={{ marginBottom: 12 }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setProposingTo(null); setOfferedCard(""); }} style={{ flex: 1, background: "transparent", border: `1px solid ${C.border}`, color: C.muted2, borderRadius: 8, padding: 12, cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>ANNULER</button>
              <button onClick={sendProposal} style={{ flex: 1, background: C.red, border: "none", color: "#fff", borderRadius: 8, padding: 12, cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 14 }}>ENVOYER</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
