"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { SMAP, type Sticker } from "@/lib/stickers";
import { parseExcelRows, downloadTemplate } from "@/lib/excel";
import { getCollection, saveCollection } from "@/lib/collection";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const C = { bg: "#04080f", card: "#080f1e", card2: "#0c1628", border: "#162240", red: "#d4222a", gold: "#e8b84b", green: "#00a651", accent: "#3a8fe8", text: "#f0f5ff", muted: "#3a5070", muted2: "#7090b0" };

type ParseResult = { matched: { sticker: Sticker; qty: number }[]; unmatched: string[] };

export default function ScannerPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [col, setCol] = useState<Record<number, number>>({});
  const [tab, setTab] = useState<"excel">("excel");
  const [result, setResult] = useState<ParseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { router.push("/login"); return; }
      const { data: profile } = await supabase.from("profiles").select("username").eq("id", u.id).single();
      setUser({ id: u.id, username: profile?.username ?? "User" });
      setCol(await getCollection(u.id));
    })();
  }, [router]);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const XLSX = await import("xlsx");
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" }) as unknown[][];
      const parsed = parseExcelRows(rows);
      setResult(parsed as ParseResult);
    } catch {
      showToast("❌ Erreur lecture fichier. Essaie en CSV.");
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function importCollection() {
    if (!user || !result) return;
    const newCol = { ...col };
    for (const { sticker, qty } of result.matched) {
      newCol[sticker.id] = (newCol[sticker.id] || 0) + qty;
    }
    setCol(newCol);
    await saveCollection(user.id, newCol);
    setResult(null);
    showToast(`✅ ${result.matched.length} stickers importés !`);
  }

  const owned = Object.values(col).filter(q => q >= 1).length;

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      {user && <Header username={user.username} owned={owned} total={994} />}
      {toast && (
        <div style={{ position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)", background: C.green, color: "#fff", padding: "10px 20px", borderRadius: 6, fontWeight: 700, fontSize: 13, fontFamily: "'Barlow Condensed', sans-serif", zIndex: 999, animation: "toastIn .25s ease", whiteSpace: "nowrap" }}>
          {toast}
        </div>
      )}

      <div style={{ padding: "20px 16px 100px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 24, color: C.text, marginBottom: 4 }}>📷 SCANNER</div>
        <div style={{ color: C.muted2, fontSize: 13, marginBottom: 24 }}>Importe tes stickers depuis un fichier Excel ou CSV</div>

        {/* Excel import */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 14, color: C.text, marginBottom: 12 }}>📂 IMPORT FICHIER</div>

          <div
            onClick={() => fileRef.current?.click()}
            style={{ border: `2px dashed ${C.border}`, borderRadius: 8, padding: "24px 16px", textAlign: "center", cursor: "pointer", marginBottom: 12, transition: "border-color .15s" }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, color: C.muted2 }}>
              {loading ? "LECTURE EN COURS..." : "CLIQUER POUR CHOISIR UN FICHIER"}
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>.xlsx · .xls · .csv</div>
          </div>
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} style={{ display: "none" }} />

          <button
            onClick={downloadTemplate}
            style={{ width: "100%", padding: "9px 14px", borderRadius: 6, border: `1px solid ${C.border}`, background: "transparent", color: C.muted2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 12, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: 0.5 }}
          >
            ⬇ TÉLÉCHARGER LE MODÈLE CSV
          </button>

          <div style={{ marginTop: 12, background: C.card2, borderRadius: 6, padding: 10, fontSize: 11, color: C.muted2, lineHeight: 1.6 }}>
            <strong style={{ color: C.text }}>Formats acceptés :</strong><br />
            • "FRA-3" dans une cellule (code complet)<br />
            • Colonne A : code équipe | Colonne B : numéro<br />
            • Colonne A : "FRA-3" | Colonne B : quantité
          </div>
        </div>

        {/* Results */}
        {result && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }} className="fade-up">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 16, color: C.text }}>
                  ✅ {result.matched.length} STICKERS DÉTECTÉS
                </div>
                {result.unmatched.length > 0 && (
                  <div style={{ fontSize: 11, color: C.red, marginTop: 2 }}>{result.unmatched.length} lignes non reconnues</div>
                )}
              </div>
              <button onClick={() => setResult(null)} style={{ background: "transparent", border: "none", color: C.muted2, cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>

            <div style={{ maxHeight: 240, overflowY: "auto", marginBottom: 16 }}>
              {result.matched.map(({ sticker, qty }) => (
                <div key={sticker.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 12, color: C.accent }}>{sticker.code}</span>
                    <span style={{ fontSize: 12, color: C.muted2, marginLeft: 8 }}>{sticker.name}</span>
                  </div>
                  {qty > 1 && <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 11, color: C.gold }}>×{qty}</span>}
                </div>
              ))}
            </div>

            <button
              onClick={importCollection}
              style={{ width: "100%", background: C.green, color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: 1, cursor: "pointer" }}
            >
              ✅ IMPORTER DANS MA COLLECTION
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
