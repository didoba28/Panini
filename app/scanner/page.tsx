"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { STICKERS, SMAP, type Sticker } from "@/lib/stickers";
import { parseExcelRows, downloadTemplate } from "@/lib/excel";
import { getCollection, saveCollection } from "@/lib/collection";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const C = { bg: "#04080f", card: "#080f1e", card2: "#0c1628", border: "#162240", red: "#d4222a", gold: "#e8b84b", green: "#00a651", accent: "#3a8fe8", text: "#f0f5ff", muted: "#3a5070", muted2: "#7090b0" };

type ParseResult = { matched: { sticker: Sticker; qty: number }[]; unmatched: string[] };
type ScanTab = "photo" | "excel";

// ─── Compresse une image avant envoi à GPT Vision ─────────────────────────────
async function compressImage(file: File): Promise<string> {
  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1200;
      const sc = Math.min(1, MAX / Math.max(img.width, img.height));
      const cv = document.createElement("canvas");
      cv.width = img.width * sc;
      cv.height = img.height * sc;
      cv.getContext("2d")!.drawImage(img, 0, 0, cv.width, cv.height);
      cv.toBlob(blob => {
        const reader = new FileReader();
        reader.onload = () => {
          URL.revokeObjectURL(url);
          resolve(reader.result as string); // data:image/jpeg;base64,...
        };
        reader.readAsDataURL(blob!);
      }, "image/jpeg", 0.82);
    };
    img.src = url;
  });
}

// ─── Appel GPT-4o Vision via notre route sécurisée ───────────────────────────
async function scanImageWithGPT(base64DataUrl: string, mode: "sticker" | "page"): Promise<{ sticker: Sticker; qty: number }[]> {
  const teamList = [...new Set(STICKERS.map(s => s.teamCode))].join(", ");

  const prompt = mode === "sticker"
    ? `Tu vois un sticker Panini FIFA World Cup 2026. Identifie le code exact du sticker (ex: FRA-12, MEX-3, FWC-7, CC-2).
       Les codes d'équipes valides sont : ${teamList}.
       Réponds UNIQUEMENT avec un JSON : {"code":"XXX-N"} ou {"code":null} si tu ne vois pas de sticker.`
    : `Tu vois une page d'album Panini FIFA World Cup 2026 avec plusieurs stickers cochés ou présents.
       Les codes d'équipes valides sont : ${teamList}.
       Liste TOUS les stickers visibles ou cochés. Réponds UNIQUEMENT avec un JSON : {"stickers":["FRA-3","MEX-12",...]}`;

  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: base64DataUrl } },
            { type: "text", text: prompt },
          ],
        },
      ],
      maxTokens: 500,
    }),
  });

  const data = await res.json();
  const raw = data.text ?? "";

  try {
    const json = JSON.parse(raw.replace(/```json\n?|```/g, "").trim());
    const codes: string[] = mode === "sticker"
      ? (json.code ? [json.code] : [])
      : (json.stickers ?? []);

    return codes.flatMap(code => {
      const [teamCode, numStr] = code.split("-");
      const num = parseInt(numStr);
      const s = STICKERS.find(st => st.teamCode === teamCode && st.num === num);
      return s ? [{ sticker: s, qty: 1 }] : [];
    });
  } catch {
    return [];
  }
}

export default function ScannerPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [col, setCol] = useState<Record<number, number>>({});
  const [activeTab, setActiveTab] = useState<ScanTab>("photo");
  const [result, setResult] = useState<ParseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" }>({ msg: "", type: "ok" });
  const [preview, setPreview] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);
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

  function showToast(msg: string, type: "ok" | "err" = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "ok" }), 3500);
  }

  // ── SCAN PHOTO (GPT-4o Vision) ─────────────────────────────────────────────
  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>, mode: "sticker" | "page") {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setResult(null);
    try {
      const b64 = await compressImage(file);
      setPreview(b64);
      const matched = await scanImageWithGPT(b64, mode);
      if (matched.length === 0) {
        showToast("❌ Aucun sticker reconnu. Prends une photo plus nette.", "err");
      } else {
        setResult({ matched, unmatched: [] });
      }
    } catch {
      showToast("❌ Erreur lors du scan IA.", "err");
    } finally {
      setLoading(false);
      if (photoRef.current) photoRef.current.value = "";
    }
  }

  // ── IMPORT EXCEL/CSV ───────────────────────────────────────────────────────
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setResult(null);
    try {
      const XLSX = await import("xlsx");
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" }) as unknown[][];
      setResult(parseExcelRows(rows) as ParseResult);
    } catch {
      showToast("❌ Erreur lecture fichier. Essaie en CSV.", "err");
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  // ── IMPORT DANS LA COLLECTION ──────────────────────────────────────────────
  async function importCollection() {
    if (!user || !result) return;
    const newCol = { ...col };
    for (const { sticker, qty } of result.matched) {
      newCol[sticker.id] = (newCol[sticker.id] || 0) + qty;
    }
    setCol(newCol);
    await saveCollection(user.id, newCol);
    setResult(null);
    setPreview(null);
    showToast(`✅ ${result.matched.length} stickers importés !`);
  }

  const owned = Object.values(col).filter(q => q >= 1).length;

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      {user && <Header username={user.username} owned={owned} total={994} />}

      {/* Toast */}
      {toast.msg && (
        <div style={{ position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)", background: toast.type === "err" ? C.red : C.green, color: "#fff", padding: "10px 20px", borderRadius: 6, fontWeight: 700, fontSize: 13, fontFamily: "'Barlow Condensed', sans-serif", zIndex: 999, whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,.5)" }}>
          {toast.msg}
        </div>
      )}

      {/* Tabs */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, display: "flex" }}>
        {([["photo", "📷 SCAN PHOTO"], ["excel", "📂 EXCEL/CSV"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => { setActiveTab(key); setResult(null); setPreview(null); }}
            style={{ flex: 1, padding: "13px 4px", background: "transparent", border: "none", borderBottom: activeTab === key ? `2px solid ${C.red}` : "2px solid transparent", color: activeTab === key ? C.text : C.muted2, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: 0.5, cursor: "pointer" }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px 16px 100px", maxWidth: 480, margin: "0 auto" }}>

        {/* ── ONGLET PHOTO ── */}
        {activeTab === "photo" && (
          <div>
            <div style={{ color: C.muted2, fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>
              GPT-4o analyse ta photo et identifie les stickers automatiquement.
            </div>

            {/* Scan sticker unique */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, marginBottom: 12 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 13, color: C.text, marginBottom: 10 }}>
                🔍 SCANNER UN STICKER
              </div>
              <input ref={photoRef} type="file" accept="image/*" capture="environment"
                onChange={e => handlePhoto(e, "sticker")} style={{ display: "none" }} />
              <button
                onClick={() => photoRef.current?.click()}
                disabled={loading}
                style={{ width: "100%", background: loading ? C.muted : C.red, color: "#fff", border: "none", borderRadius: 8, padding: "14px 0", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: 1, cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? "⏳ ANALYSE EN COURS..." : "📷 PRENDRE UNE PHOTO"}
              </button>
            </div>

            {/* Scan page album */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, marginBottom: 16 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 13, color: C.text, marginBottom: 6 }}>
                📖 SCANNER UNE PAGE D&apos;ALBUM
              </div>
              <div style={{ fontSize: 11, color: C.muted2, marginBottom: 10 }}>Détecte plusieurs stickers d&apos;un coup</div>
              <input type="file" accept="image/*" capture="environment" id="page-scan"
                onChange={e => handlePhoto(e, "page")} style={{ display: "none" }} />
              <button
                onClick={() => document.getElementById("page-scan")?.click()}
                disabled={loading}
                style={{ width: "100%", background: "transparent", border: `1.5px solid ${C.accent}`, color: C.accent, borderRadius: 8, padding: "12px 0", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: 1, cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? "⏳ ANALYSE..." : "📖 PHOTOGRAPHIER UNE PAGE"}
              </button>
            </div>

            {/* Preview */}
            {preview && (
              <div style={{ marginBottom: 16, borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="scan" style={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block" }} />
              </div>
            )}
          </div>
        )}

        {/* ── ONGLET EXCEL ── */}
        {activeTab === "excel" && (
          <div>
            <div style={{ color: C.muted2, fontSize: 13, marginBottom: 16 }}>
              Importe tes stickers depuis un fichier Excel ou CSV.
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
              <div
                onClick={() => fileRef.current?.click()}
                style={{ border: `2px dashed ${C.border}`, borderRadius: 8, padding: "28px 16px", textAlign: "center", cursor: "pointer", marginBottom: 12 }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, color: C.muted2 }}>
                  {loading ? "⏳ LECTURE EN COURS..." : "CLIQUER POUR CHOISIR UN FICHIER"}
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>.xlsx · .xls · .csv</div>
              </div>
              <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} style={{ display: "none" }} />
              <button onClick={downloadTemplate}
                style={{ width: "100%", padding: "9px 14px", borderRadius: 6, border: `1px solid ${C.border}`, background: "transparent", color: C.muted2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 12, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: 0.5 }}>
                ⬇ TÉLÉCHARGER LE MODÈLE CSV
              </button>
              <div style={{ marginTop: 12, background: C.card2, borderRadius: 6, padding: 10, fontSize: 11, color: C.muted2, lineHeight: 1.7 }}>
                <strong style={{ color: C.text }}>Formats acceptés :</strong><br />
                • "FRA-3" dans une cellule<br />
                • Colonne A : code | Colonne B : numéro<br />
                • Colonne C optionnelle : quantité (doublons)
              </div>
            </div>
          </div>
        )}

        {/* ── RÉSULTATS ── */}
        {result && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }} className="fade-up">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 16, color: C.text }}>
                  ✅ {result.matched.length} STICKER{result.matched.length > 1 ? "S" : ""} DÉTECTÉ{result.matched.length > 1 ? "S" : ""}
                </div>
                {result.unmatched.length > 0 && (
                  <div style={{ fontSize: 11, color: C.red, marginTop: 2 }}>{result.unmatched.length} lignes non reconnues</div>
                )}
              </div>
              <button onClick={() => { setResult(null); setPreview(null); }} style={{ background: "transparent", border: "none", color: C.muted2, cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>

            <div style={{ maxHeight: 220, overflowY: "auto", marginBottom: 14 }}>
              {result.matched.map(({ sticker, qty }) => (
                <div key={sticker.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 12, color: C.accent }}>{sticker.code}</span>
                    <span style={{ fontSize: 12, color: C.muted2, marginLeft: 8 }}>{sticker.name}</span>
                  </div>
                  {qty > 1 && <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 11, color: C.gold }}>×{qty}</span>}
                </div>
              ))}
            </div>

            <button onClick={importCollection}
              style={{ width: "100%", background: C.green, color: "#fff", border: "none", borderRadius: 8, padding: "13px 0", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: 1, cursor: "pointer" }}>
              ✅ IMPORTER DANS MA COLLECTION
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
