import { createClient } from '@supabase/supabase-js';
import { env } from '../env';

/** Cliente anónimo sin cookies: lectura de contenido público, cacheable. */
export function createPublicClient() {
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
