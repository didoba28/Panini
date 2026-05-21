import { createBrowserClient } from "@supabase/ssr";

// Validate URL at module load — fallback to a syntactically-valid placeholder
// so the build never crashes when env vars are placeholders / missing.
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseUrl = /^https?:\/\/.+/.test(rawUrl)
  ? rawUrl
  : "https://placeholder.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";

export const supabase = createBrowserClient(supabaseUrl, supabaseKey);
