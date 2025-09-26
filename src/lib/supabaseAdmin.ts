// lib/supabaseAdmin.ts
import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
}

// Create a server-side client using the service_role key.
// IMPORTANT: do NOT import this file in client-side code.
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    // server-only: do not persist sessions
    auth: { persistSession: false },
  }
);
