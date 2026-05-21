import { SMAP, lookupSticker } from "./stickers";
import type { Sticker } from "./stickers";

export type ParseResult = {
  matched: { sticker: Sticker; qty: number }[];
  unmatched: string[];
};

// Supported formats:
//   A) "FRA-3" or "FRA3" or "FRA 3" in a single cell
//   B) Code in col A, number in col B → "FRA" | "3"
//   C) Code + number + optional quantity → "FRA" | "3" | "2"
//   D) Single-column code list (one row per copy, dupes counted)
export function parseExcelRows(rows: unknown[][]): ParseResult {
  const acc: Record<number, number> = {};
  const unmatched: string[] = [];

  for (const row of rows) {
    const cells = (row as unknown[]).map(c => String(c ?? "").trim()).filter(Boolean);
    if (!cells.length) continue;

    let sticker: Sticker | null = null;
    let qty = 1;

    for (let i = 0; i < cells.length && !sticker; i++) {
      const cell = cells[i];
      const m = cell.match(/^([A-Za-z]{2,4})[-\s]?(\d{1,2})$/);
      if (m) {
        sticker = lookupSticker(m[1], m[2]);
        if (sticker) {
          const qCell = cells.find((c, j) => j !== i && /^\d{1,3}$/.test(c) && parseInt(c) <= 99 && c !== m[2]);
          qty = qCell ? Math.max(1, parseInt(qCell)) : 1;
        }
      }
    }

    if (!sticker && cells.length >= 2) {
      const c0 = cells[0], c1 = cells[1];
      if (/^[A-Za-z]{2,4}$/.test(c0) && /^\d{1,2}$/.test(c1)) {
        sticker = lookupSticker(c0, c1);
        if (sticker && cells[2] && /^\d{1,3}$/.test(cells[2])) qty = Math.max(1, parseInt(cells[2]));
      }
    }

    if (sticker) {
      acc[sticker.id] = (acc[sticker.id] || 0) + qty;
    } else {
      const raw = cells.join(" | ");
      const isHeader = /code|numéro|numero|doublon|sticker|qty|quantit/i.test(raw);
      if (!isHeader) unmatched.push(raw);
    }
  }

  const matched = Object.entries(acc)
    .map(([id, qty]) => ({ sticker: SMAP[+id], qty }))
    .filter(r => r.sticker);

  return { matched, unmatched };
}

export function downloadTemplate(): void {
  const header = "Code Sticker,Doublons\n";
  const rows = ["FRA-3,2", "BRA-12,1", "MEX-5,3", "FWC-7,1", "ARG-12,2"].join("\n");
  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "modele_doublons_wc26.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
