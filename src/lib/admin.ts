import 'server-only';
import { redirect } from 'next/navigation';
import { hasSupabase } from './env';
import { createClient } from './supabase/server';

/** Devuelve el cliente y el usuario si es admin; si no, redirige al login. */
export async function requireAdmin() {
  if (!hasSupabase) redirect('/admin/login');
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) redirect('/admin/login?error=permisos');
  return { supabase, user };
}
