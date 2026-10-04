import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';
import { STATUS_LABEL, dateTime } from '@/lib/format';
import { LEAD_STATUSES, type Lead } from '@/lib/types';
import { toWaPhone } from '@/lib/whatsapp';
import { deleteLead, updateLead } from '../../../actions';

type Props = { params: Promise<{ id: string }> };

export default async function LeadDetail({ params }: Props) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('leads').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  const l = data as Lead;
  const wa = `https://wa.me/${toWaPhone(l.phone)}?text=${encodeURIComponent(`Hola ${l.name.split(' ')[0]}! Te escribo de Webazo por tu consulta.`)}`;

  const row = (k: string, v: string | number | null | undefined) => (<><dt>{k}</dt><dd>{v === null || v === undefined || v === '' ? '—' : v}</dd></>);

  return (
    <>
      <div className="adm-head">
        <div>
          <p><a href="/admin/leads">← Leads</a></p>
          <h1>{l.name}</h1>
          <p>Entró el {dateTime(l.created_at)} · <span className={`pill ${l.status}`}>{STATUS_LABEL[l.status]}</span></p>
        </div>
        <a className="b b-wa" href={wa} target="_blank" rel="noopener">Escribir por WhatsApp</a>
      </div>

      <div className="grid-2">
        <div className="card">
          <h2>Datos</h2>
          <dl className="dl">
            {row('Teléfono', l.phone)}
            {row('Mail', l.email)}
            {row('Negocio', l.business)}
            {row('Rubro', l.rubro)}
            {row('Pack', l.pack)}
            {row('Precio', l.price_usd != null ? `USD ${l.price_usd}` : null)}
            {row('Cupón', l.coupon_code ? `${l.coupon_code} (− USD ${l.discount_usd ?? 0})` : null)}
            {row('Total cotizado', l.final_usd != null ? `USD ${l.final_usd}` : null)}
            {row('Mensaje', l.message)}
          </dl>
        </div>
        <div className="card">
          <h2>De dónde vino</h2>
          <dl className="dl">
            {row('Fuente', l.utm_source)}
            {row('Medio', l.utm_medium)}
            {row('Campaña', l.utm_campaign)}
            {row('Anuncio', l.utm_content)}
            {row('Conjunto', l.utm_term)}
            {row('Página de entrada', l.landing_path)}
            {row('Referencia', l.referrer)}
            {row('Clic de Meta', l.fbclid ? 'Sí (fbclid)' : 'No')}
          </dl>
        </div>
      </div>

      {l.cart && (
        <div className="card">
          <h2>Propuesta armada en el carrito</h2>
          <div className="tbl-wrap">
            <table className="tbl">
              <tbody>
                {l.cart.pack && <tr><td>Pack {l.cart.pack.name ?? l.cart.pack.slug}</td><td>USD {l.cart.pack.price_usd ?? '—'}</td></tr>}
                {l.cart.extras.map((x) => <tr key={x.slug}><td>{x.name}</td><td>USD {x.price_usd}</td></tr>)}
                <tr><td><strong>Subtotal</strong></td><td><strong>USD {l.price_usd ?? '—'}</strong></td></tr>
                {l.discount_usd ? <tr><td>Cupón {l.coupon_code}</td><td>− USD {l.discount_usd}</td></tr> : null}
                <tr><td><strong>Total</strong></td><td><strong>USD {l.final_usd ?? '—'}</strong></td></tr>
                {l.monthly_usd ? <tr><td>Mantenimiento</td><td>USD {l.monthly_usd}/mes</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Seguimiento</h2>
        <form action={updateLead} className="form-grid">
          <input type="hidden" name="id" value={l.id} />
          <div className="f">
            <label htmlFor="status">Estado</label>
            <select id="status" name="status" defaultValue={l.status}>
              {LEAD_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </div>
          <div className="f">
            <label htmlFor="value_usd">Valor del trabajo (USD)</label>
            <input id="value_usd" name="value_usd" inputMode="decimal" defaultValue={l.value_usd ?? l.final_usd ?? ''} placeholder="Ej: 180" />
          </div>
          <div className="f full">
            <label htmlFor="notes">Notas internas</label>
            <textarea id="notes" name="notes" defaultValue={l.notes ?? ''} placeholder="Qué hablaron, próximos pasos, fecha de seguimiento…" />
          </div>
          <div className="actions-row full"><button className="b b-orange" type="submit">Guardar cambios</button></div>
        </form>
      </div>

      <form action={deleteLead}>
        <input type="hidden" name="id" value={l.id} />
        <button className="b b-danger" type="submit">Eliminar lead</button>
      </form>
    </>
  );
}
