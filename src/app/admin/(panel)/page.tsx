import { requireAdmin } from '@/lib/admin';
import { STATUS_LABEL, dateTime, usd } from '@/lib/format';
import type { Lead } from '@/lib/types';

function groupCount<T>(rows: T[], key: (r: T) => string | null | undefined) {
  const m = new Map<string, number>();
  rows.forEach((r) => {
    const k = key(r) || '(sin dato)';
    m.set(k, (m.get(k) ?? 0) + 1);
  });
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function Bars({ data, empty }: { data: [string, number][]; empty: string }) {
  if (!data.length) return <p className="empty">{empty}</p>;
  const max = Math.max(...data.map((d) => d[1]));
  return (
    <div className="bars">
      {data.slice(0, 8).map(([k, v]) => (
        <div className="bar-row" key={k}>
          <div><span>{k}</span><div className="track"><div className="fill" style={{ width: `${(v / max) * 100}%` }} /></div></div>
          <b>{v}</b>
        </div>
      ))}
    </div>
  );
}

export default async function Dashboard() {
  const { supabase } = await requireAdmin();
  const since30 = new Date(Date.now() - 30 * 864e5).toISOString();
  const since7 = new Date(Date.now() - 7 * 864e5).toISOString();

  const [{ data: leads30 }, { count: clicks30 }, { data: recent }, { data: allWon }, { count: claims30 }] = await Promise.all([
    supabase.from('leads').select('id, status, utm_campaign, utm_source, utm_content, rubro, pack, created_at').gte('created_at', since30),
    supabase.from('clicks').select('id', { count: 'exact', head: true }).gte('created_at', since30),
    supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(8),
    supabase.from('leads').select('value_usd').eq('status', 'ganado'),
    supabase.from('coupon_claims').select('id', { count: 'exact', head: true }).gte('created_at', since30),
  ]);

  const l30 = (leads30 ?? []) as Pick<Lead, 'id' | 'status' | 'utm_campaign' | 'utm_source' | 'utm_content' | 'rubro' | 'pack' | 'created_at'>[];
  const l7 = l30.filter((l) => l.created_at >= since7).length;
  const nuevos = l30.filter((l) => l.status === 'nuevo').length;
  const ganados = l30.filter((l) => l.status === 'ganado').length;
  const tasa = l30.length ? Math.round((ganados / l30.length) * 100) : 0;
  const facturado = (allWon ?? []).reduce((s, r) => s + Number(r.value_usd ?? 0), 0);

  return (
    <>
      <div className="adm-head">
        <div><h1>Resumen</h1><p>Últimos 30 días</p></div>
        <a className="b b-dark" href="/admin/leads?status=nuevo">Ver leads nuevos ({nuevos})</a>
      </div>

      <div className="kpis">
        <div className="kpi"><span>Leads (30 días)</span><strong>{l30.length}</strong><small>{l7} en los últimos 7</small></div>
        <div className="kpi"><span>Clics a WhatsApp</span><strong>{clicks30 ?? 0}</strong><small>30 días</small></div>
        <div className="kpi"><span>Cupones reclamados</span><strong>{claims30 ?? 0}</strong><small><a href="/admin/cupones">Ver contactos</a></small></div>
        <div className="kpi"><span>Sin contactar</span><strong>{nuevos}</strong><small>Respondé rápido</small></div>
        <div className="kpi"><span>Tasa de cierre</span><strong>{tasa}%</strong><small>{ganados} ganados</small></div>
        <div className="kpi"><span>Facturado (total)</span><strong>{usd(facturado)}</strong><small>Leads ganados</small></div>
      </div>

      <div className="grid-2">
        <div className="card"><h2>Leads por campaña</h2><Bars data={groupCount(l30, (l) => l.utm_campaign)} empty="Todavía no hay leads con campaña." /></div>
        <div className="card"><h2>Leads por anuncio</h2><Bars data={groupCount(l30, (l) => l.utm_content)} empty="Todavía no hay leads con anuncio." /></div>
        <div className="card"><h2>Leads por rubro</h2><Bars data={groupCount(l30, (l) => l.rubro)} empty="Sin datos." /></div>
        <div className="card"><h2>Leads por pack</h2><Bars data={groupCount(l30, (l) => l.pack)} empty="Sin datos." /></div>
      </div>

      <div className="card">
        <h2>Últimos leads</h2>
        {recent?.length ? (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Fecha</th><th>Nombre</th><th>Rubro</th><th>Pack</th><th>Campaña</th><th>Estado</th></tr></thead>
              <tbody>
                {(recent as Lead[]).map((l) => (
                  <tr key={l.id}>
                    <td className="muted">{dateTime(l.created_at)}</td>
                    <td><a href={`/admin/leads/${l.id}`}>{l.name}</a></td>
                    <td>{l.rubro ?? '—'}</td>
                    <td>{l.pack ?? '—'}</td>
                    <td>{l.utm_campaign ?? '—'}</td>
                    <td><span className={`pill ${l.status}`}>{STATUS_LABEL[l.status]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty">Todavía no entró ningún lead. Cuando alguien complete el formulario, aparece acá.</p>
        )}
      </div>
    </>
  );
}
