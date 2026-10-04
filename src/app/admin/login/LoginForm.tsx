'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    setError(null);
    const { error } = await createClient().auth.signInWithPassword({
      email: String(fd.get('email')),
      password: String(fd.get('password')),
    });
    if (error) {
      setError('Mail o contraseña incorrectos.');
      setLoading(false);
      return;
    }
    router.replace('/admin');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="f"><label htmlFor="email">Mail</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
      <div className="f"><label htmlFor="password">Contraseña</label><input id="password" name="password" type="password" autoComplete="current-password" required /></div>
      {error && <p className="err" role="alert">{error}</p>}
      <button className="b b-orange" type="submit" disabled={loading} style={{ minHeight: 48 }}>{loading ? 'Ingresando…' : 'Ingresar'}</button>
    </form>
  );
}
