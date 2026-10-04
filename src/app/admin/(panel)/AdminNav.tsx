'use client';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/admin', label: 'Resumen' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/packs', label: 'Packs y precios' },
  { href: '/admin/cupones', label: 'Cupones' },
  { href: '/admin/testimonios', label: 'Testimonios' },
  { href: '/admin/preguntas', label: 'Preguntas' },
];

export default function AdminNav() {
  const path = usePathname();
  return (
    <nav aria-label="Panel">
      {LINKS.map((l) => {
        const active = l.href === '/admin' ? path === '/admin' : path.startsWith(l.href);
        return <a key={l.href} href={l.href} aria-current={active ? 'page' : undefined}>{l.label}</a>;
      })}
    </nav>
  );
}
