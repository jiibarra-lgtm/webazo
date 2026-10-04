import type { Metadata } from 'next';
import '../admin.css';
import { hasSupabase } from '@/lib/env';
import LoginForm from './LoginForm';
import { Logo } from '@/components/Icons';

export const metadata: Metadata = { title: 'Ingresar | Webazo Admin', robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  return (
    <main className="login">
      <div className="login-card">
        <Logo />
        <h1 style={{ fontSize: 26 }}>Panel de administración</h1>
        {!hasSupabase ? (
          <p className="err">Falta configurar Supabase. Cargá las variables de entorno (ver README) y volvé a desplegar.</p>
        ) : (
          <>
            {error === 'permisos' && <p className="err">Tu usuario no tiene permisos de administrador. Agregalo a la tabla admins (ver README).</p>}
            <LoginForm />
          </>
        )}
      </div>
    </main>
  );
}
