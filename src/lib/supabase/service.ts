import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { env } from '../env';

/** Cliente con service role: SOLO en el servidor. Bypassa RLS. */
export function createServiceClient() {
  return createClient(env.supabaseUrl, env.supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
