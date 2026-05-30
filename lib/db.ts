import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://slhnvmceuuubjkptkrid.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsaG52bWNldXV1YmprcHRrcmlkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA0OTM3MywiZXhwIjoyMDk1NjI1MzczfQ.1uioyH8Vxx8dbRRJU1J28pnFPJXHX6aszcmLiNMEhZ4"
);