import { requireAdmin } from '@/lib/admin';
import { RUBROS } from '@/lib/rubros';
import { env } from '@/lib/env';

export default async function RubrosPage() {
  const { supabase } = await requireAdmin();
  const since30 = new Date(Date.now() - 30 * 864e5).toISOString();
  const [{ data: leads }, { data: clicks }] = await Promise.all([
    supabase.from('leads').select('rubro, landing_path').gte('created_at', since30),
    supabase.from('clicks').select('path').gte('created_at', since30),
  ]);

  const rows = RUBROS.map((r) => {
    const l = (leads ?? []).filter((x) => x.rubro === r.name || x.landing_path === `/${r.slug}`).length;
    const c = (clicks ?? []).filter((x) => (x.path ?? '').split('?')[0] === `/${r.slug}`).length;
    return { r, l, c };
  }).sort((a, b) => b.l + b.c - (a.l + a.c));

  const adUrl = (slug: string) =>
    `${env.siteUrl}/${slug}?utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}`;

  return (
    <>
      <div className="adm-head"><div><h1>Rubros y landings</h1><p>{RUBROS.length} landings listas para usar como destino de anuncios. Datos de los últimos 30 días.</p></div></div>
      <div className="card" style={{ padding: 0 }}>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Rubro</th><th>Landing</th><th>Pack recomendado</th><th>Leads</th><th>Clics WhatsApp</th><th>URL para anuncios de Meta</th></tr></thead>
            <tbody>
              {rows.map(({ r, l, c }) => (
                <tr key={r.slug}>
                  <td><strong>{r.name}</strong><div className="muted">{r.title}</div></td>
                  <td><a href={`/${r.slug}`} target="_blank" rel="noopener">/{r.slug}</a></td>
                  <td>{r.recommendedPack}</td>
                  <td>{l}</td>
                  <td>{c}</td>
                  <td><code style={{ fontSize: 11, wordBreak: 'break-all', display: 'block', maxWidth: 360 }}>{adUrl(r.slug)}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="muted">Para agregar o editar rubros: archivo <code>src/lib/rubros.ts</code>.</p>
    </>
  );
}
