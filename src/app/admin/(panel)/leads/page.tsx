import { requireAdmin } from '@/lib/admin';
import { STATUS_LABEL, dateTime } from '@/lib/format';
import { LEAD_STATUSES, type Lead } from '@/lib/types';
import { toWaPhone } from '@/lib/whatsapp';
import { setLeadStatus } from '../../actions';

type Props = { searchParams: Promise<{ status?: string; q?: string }> };

export default async function LeadsPage({ searchParams }: Props) {
  const { status, q } = await searchParams;
  const { supabase } = await requireAdmin();

  let query = supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(300);
  if (status && (LEAD_STATUSES as readonly string[]).includes(status)) query = query.eq('status', status);
  if (q) {
    const term = q.replace(/[%,()]/g, ' ').trim();
    if (term) query = query.or(`name.ilike.%${term}%,phone.ilike.%${term}%,business.ilike.%${term}%,email.ilike.%${term}%`);
  }
  const { data } = await query;
  const leads = (data ?? []) as Lead[];

  const qs = (s?: string) => {
    const p = new URLSearchParams();
    if (s) p.set('status', s);
    if (q) p.set('q', q);
    const str = p.toString();
    return str ? `?${str}` : '';
  };

  return (
    <>
      <div className="adm-head">
        <div><h1>Leads</h1><p>{leads.length} resultados</p></div>
        <a className="b b-line" href={`/admin/export${qs(status)}`}>Exportar CSV</a>
      </div>

      <div className="filters">
        <a href={`/admin/leads${qs()}`} aria-current={!status}>Todos</a>
        {LEAD_STATUSES.map((s) => (
          <a key={s} href={`/admin/leads${qs(s)}`} aria-current={status === s}>{STATUS_LABEL[s]}</a>
        ))}
        <form method="get">
          {status && <input type="hidden" name="status" value={status} />}
          <div className="f"><label htmlFor="q" className="sr-only">Buscar</label><input id="q" name="q" defaultValue={q} placeholder="Buscar nombre, teléfono, negocio…" /></div>
          <button className="b b-dark" type="submit">Buscar</button>
        </form>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {leads.length ? (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Fecha</th><th>Nombre</th><th>Negocio</th><th>Rubro</th><th>Pack</th><th>Campaña / anuncio</th><th>Estado</th><th></th></tr></thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td className="muted">{dateTime(l.created_at)}</td>
                    <td><a href={`/admin/leads/${l.id}`}>{l.name}</a><div className="muted">{l.phone}</div></td>
                    <td>{l.business ?? '—'}</td>
                    <td>{l.rubro ?? '—'}</td>
                    <td>{l.pack ?? '—'}{l.coupon_code && <div className="muted">🎟 {l.coupon_code}</div>}{l.cart && <div className="muted">🛒 Carrito · USD {l.final_usd ?? '—'}</div>}</td>
                    <td>{l.utm_campaign ?? (l.utm_source ? l.utm_source : 'Directo')}{l.utm_content && <div className="muted">{l.utm_content}</div>}</td>
                    <td>
                      <form action={setLeadStatus} className="inline-form">
                        <input type="hidden" name="id" value={l.id} />
                        <label className="sr-only" htmlFor={`st-${l.id}`}>Estado</label>
                        <select id={`st-${l.id}`} name="status" defaultValue={l.status}>
                          {LEAD_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                        </select>
                        <button className="b b-line" type="submit">OK</button>
                      </form>
                    </td>
                    <td>
                      <a className="b b-wa" href={`https://wa.me/${toWaPhone(l.phone)}?text=${encodeURIComponent(`Hola ${l.name.split(' ')[0]}! Te escribo de Webazo por tu consulta.`)}`} target="_blank" rel="noopener">WhatsApp</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty">No hay leads con estos filtros.</p>
        )}
      </div>
    </>
  );
}
