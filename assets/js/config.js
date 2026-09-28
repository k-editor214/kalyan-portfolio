// KalyanEditz - Supabase Configuration

const SUPABASE_URL = "https://zugwkqtkcqxezinjhtao.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_Bw7XKjOGp9-MId63eayX5A_ixMv6pfz";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
