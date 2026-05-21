import { supabase } from "./supabase";

export async function getCollection(userId: string): Promise<Record<number, number>> {
  const { data } = await supabase
    .from("collections")
    .select("sticker_id, quantity")
    .eq("user_id", userId);
  return Object.fromEntries((data ?? []).map(r => [r.sticker_id, r.quantity]));
}

export async function saveCollection(userId: string, col: Record<number, number>) {
  const rows = Object.entries(col)
    .filter(([, q]) => q > 0)
    .map(([id, quantity]) => ({ user_id: userId, sticker_id: Number(id), quantity }));

  if (rows.length > 0) {
    await supabase.from("collections").upsert(rows, { onConflict: "user_id,sticker_id" });
  }

  const zeros = Object.entries(col).filter(([, q]) => q === 0).map(([id]) => Number(id));
  if (zeros.length > 0) {
    await supabase.from("collections").delete().eq("user_id", userId).in("sticker_id", zeros);
  }
}

export async function getAllCollections(): Promise<Record<string, Record<number, number>>> {
  const { data } = await supabase
    .from("collections")
    .select("user_id, sticker_id, quantity, profiles(username)");
  const result: Record<string, Record<number, number>> = {};
  for (const row of data ?? []) {
    const username = (row.profiles as unknown as { username: string } | null)?.username ?? row.user_id;
    if (!result[username]) result[username] = {};
    result[username][row.sticker_id] = row.quantity;
  }
  return result;
}
