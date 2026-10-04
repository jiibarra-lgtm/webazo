import type { Metadata } from 'next';
import '../admin.css';
import { requireAdmin } from '@/lib/admin';
import { signOut } from '../actions';
import AdminNav from './AdminNav';
import { Logo } from '@/components/Icons';

export const metadata: Metadata = { title: 'Admin | Webazo', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();
  return (
    <div className="adm">
      <aside className="adm-side">
        <Logo href="/admin" />
        <AdminNav />
        <div className="bottom">
          <span>{user.email}</span>
          <a href="/" target="_blank" rel="noopener">Ver sitio</a>
          <form action={signOut}><button type="submit" style={{ width: '100%' }}>Cerrar sesión</button></form>
        </div>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
