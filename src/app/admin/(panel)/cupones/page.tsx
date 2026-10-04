import { requireAdmin } from '@/lib/admin';
import { DEFAULT_POPUP } from '@/lib/defaults';
import { dateTime } from '@/lib/format';
import { toWaPhone } from '@/lib/whatsapp';
import type { Coupon, Pack, PopupConfig } from '@/lib/types';
import { deleteCouponAction, saveCouponAction, savePopup, toggleCoupon, togglePopup } from '../../actions';
import Toggle from '../Toggle';

type Claim = { id: string; created_at: string; coupon_code: string; name: string | null; business: string | null; rubro: string | null; phone: string; utm_campaign: string | null; converted: boolean };

function CouponForm({ c, packs }: { c?: Coupon; packs: Pick<Pack, 'slug' | 'name'>[] }) {
  const k = c?.id ?? 'new';
  const exp = c?.expires_at ? new Date(c.expires_at).toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }) : '';
  return (
    <form action={saveCouponAction} className="form-grid">
      {c && <input type="hidden" name="id" value={c.id} />}
      <div className="f"><label htmlFor={`code-${k}`}>Código</label><input id={`code-${k}`} name="code" defaultValue={c?.code} placeholder="EJ: VERANO20" required style={{ textTransform: 'uppercase' }} /></div>
      <div className="f"><label htmlFor={`desc-${k}`}>Descripción interna</label><input id={`desc-${k}`} name="description" defaultValue={c?.description ?? ''} placeholder="Para qué es" /></div>
      <div className="f">
        <label htmlFor={`type-${k}`}>Tipo</label>
        <select id={`type-${k}`} name="type" defaultValue={c?.type ?? 'percent'}>
          <option value="percent">Porcentaje (%)</option>
          <option value="fixed">Monto fijo (USD)</option>
        </select>
      </div>
      <div className="f"><label htmlFor={`value-${k}`}>Valor</label><input id={`value-${k}`} name="value" inputMode="decimal" defaultValue={c?.value} required /></div>
      <div className="f"><label htmlFor={`exp-${k}`}>Vence</label><input id={`exp-${k}`} name="expires_at" type="date" defaultValue={exp} /></div>
      <div className="f"><label htmlFor={`max-${k}`}>Usos máximos</label><input id={`max-${k}`} name="max_uses" inputMode="numeric" defaultValue={c?.max_uses ?? ''} placeholder="Sin límite" /></div>
      <fieldset className="f full" style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>Aplica a (ninguno marcado = todos los packs)</legend>
        <div className="actions-row">
          {packs.map((p) => (
            <label key={p.slug} className="check"><input type="checkbox" name="packs" value={p.slug} defaultChecked={c?.packs.includes(p.slug)} /> {p.name}</label>
          ))}
        </div>
      </fieldset>
      <label className="check"><input type="checkbox" name="active" defaultChecked={c ? c.active : true} /> Activo</label>
      <div className="actions-row full"><button className="b b-orange" type="submit">{c ? 'Guardar' : 'Crear cupón'}</button></div>
    </form>
  );
}

export default async function CuponesPage() {
  const { supabase } = await requireAdmin();
  const [{ data: coupons }, { data: packs }, { data: popupRow }, { data: claims }] = await Promise.all([
    supabase.from('coupons').select('*').order('created_at', { ascending: false }),
    supabase.from('packs').select('slug, name').order('sort_order'),
    supabase.from('settings').select('value').eq('key', 'popup').maybeSingle(),
    supabase.from('coupon_claims').select('id, created_at, coupon_code, name, business, rubro, phone, utm_campaign, converted').order('created_at', { ascending: false }).limit(100),
  ]);
  const popup = { ...DEFAULT_POPUP, ...((popupRow?.value as object) ?? {}) } as PopupConfig;
  const list = (coupons ?? []) as Coupon[];
  const pk = (packs ?? []) as Pick<Pack, 'slug' | 'name'>[];
  const cl = (claims ?? []) as Claim[];

  return (
    <>
      <div className="adm-head"><div><h1>Cupones</h1><p>Popup de bienvenida, códigos de descuento y contactos que reclamaron un cupón.</p></div></div>

      <div className="card">
        <h2>Vista rápida</h2>
        <div className="status-grid" style={{ marginBottom: 18 }}>
          <div className="status">
            <h3>Popup de bienvenida</h3>
            <Toggle action={togglePopup} on={popup.enabled} field="enabled" labelOn="Mostrándose" labelOff="Apagado" />
            <p>Entrega <strong>{popup.coupon_code}</strong> · aparece a los {popup.delay_seconds} s</p>
          </div>
          <div className="status">
            <h3>Cupones activos</h3>
            <span className="big">{list.filter((c) => c.active && !(c.expires_at && new Date(c.expires_at) < new Date()) && !(c.max_uses != null && c.uses >= c.max_uses)).length}</span>
            <p>de {list.length} creados</p>
          </div>
          <div className="status">
            <h3>Reclamos (últimos 100)</h3>
            <span className="big">{cl.length}</span>
            <p>{cl.filter((x) => x.converted).length} pidieron presupuesto después</p>
          </div>
        </div>
        {list.length ? (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Código</th><th>Descuento</th><th>Aplica a</th><th>Usos</th><th>Vence</th><th>Estado</th><th>Activo</th></tr></thead>
              <tbody>
                {list.map((c) => {
                  const expired = !!(c.expires_at && new Date(c.expires_at) < new Date());
                  const full = c.max_uses != null && c.uses >= c.max_uses;
                  const state = !c.active ? ['perdido', 'Desactivado'] : expired ? ['perdido', 'Vencido'] : full ? ['presupuesto', 'Agotado'] : ['ganado', 'Funcionando'];
                  return (
                    <tr key={c.id}>
                      <td><strong>{c.code}</strong>{popup.coupon_code === c.code && <div className="muted">Lo entrega el popup</div>}</td>
                      <td>{c.type === 'percent' ? `${c.value}%` : `USD ${c.value}`}</td>
                      <td>{c.packs.length ? c.packs.join(', ') : 'Todos los packs'}</td>
                      <td>{c.uses}{c.max_uses != null ? ` / ${c.max_uses}` : ''}</td>
                      <td>{c.expires_at ? new Date(c.expires_at).toLocaleDateString('es-AR') : 'Sin vencimiento'}</td>
                      <td><span className={`pill ${state[0]}`}>{state[1]}</span></td>
                      <td><Toggle action={toggleCoupon} on={c.active} field="active" id={c.id} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : <p className="empty">Todavía no hay cupones.</p>}
      </div>

      <div className="card">
        <h2>Popup de bienvenida</h2>
        <p className="muted" style={{ marginBottom: 14 }}>Aparece una vez por semana a cada visitante nuevo: a los segundos que elijas, cuando intenta irse (en compu) o al bajar el 60% de la página (en celu). Primero pregunta si quiere más clientes, después pide negocio, rubro, nombre y WhatsApp (mostrando una vista previa de su web) y entrega el código. Si lo cierra, queda una pestañita para reabrirlo. Si el cupón tiene límite de usos, muestra los cupos reales que quedan.</p>
        <form action={savePopup} className="form-grid">
          <div className="f"><label htmlFor="pc">Cupón que entrega</label>
            <select id="pc" name="coupon_code" defaultValue={popup.coupon_code}>
              {list.map((c) => <option key={c.id} value={c.code}>{c.code}{!c.active ? ' (inactivo)' : ''}</option>)}
            </select>
          </div>
          <div className="f"><label htmlFor="pd">Aparece a los (segundos)</label><input id="pd" name="delay_seconds" inputMode="numeric" defaultValue={popup.delay_seconds} /></div>
          <div className="f"><label htmlFor="pe">Texto chico de arriba</label><input id="pe" name="eyebrow" defaultValue={popup.eyebrow} /></div>
          <div className="f"><label htmlFor="po">Oferta grande</label><input id="po" name="offer" defaultValue={popup.offer} placeholder="10% OFF" /></div>
          <div className="f full"><label htmlFor="pt">Pregunta inicial</label><input id="pt" name="title" defaultValue={popup.title} /></div>
          <div className="f full"><label htmlFor="px">Texto</label><textarea id="px" name="text" defaultValue={popup.text} /></div>
          <div className="f"><label htmlFor="pb">Botón del “Sí”</label><input id="pb" name="cta" defaultValue={popup.cta} /></div>
          <label className="check" style={{ alignSelf: 'end' }}><input type="checkbox" name="enabled" defaultChecked={popup.enabled} /> Popup activo</label>
          <div className="actions-row full"><button className="b b-orange" type="submit">Guardar popup</button></div>
        </form>
      </div>

      <div className="card">
        <h2>Contactos que reclamaron un cupón</h2>
        {cl.length ? (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Fecha</th><th>Nombre</th><th>Negocio</th><th>WhatsApp</th><th>Cupón</th><th>Campaña</th><th>Estado</th><th></th></tr></thead>
              <tbody>
                {cl.map((x) => (
                  <tr key={x.id}>
                    <td className="muted">{dateTime(x.created_at)}</td>
                    <td>{x.name ?? '—'}</td>
                    <td>{x.business ?? '—'}{x.rubro && <div className="muted">{x.rubro}</div>}</td>
                    <td>{x.phone}</td>
                    <td>{x.coupon_code}</td>
                    <td>{x.utm_campaign ?? 'Directo'}</td>
                    <td>{x.converted ? <span className="pill ganado">Pidió presupuesto</span> : <span className="pill nuevo">Sin pedido</span>}</td>
                    <td><a className="b b-wa" target="_blank" rel="noopener" href={`https://wa.me/${toWaPhone(x.phone)}?text=${encodeURIComponent(`Hola${x.name ? ' ' + x.name.split(' ')[0] : ''}! Soy de Webazo, vi que te llevaste el cupón ${x.coupon_code}. ¿Te ayudo a elegir el pack ideal para ${x.business ?? 'tu negocio'}?`)}`}>Escribir</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="empty">Todavía nadie reclamó un cupón.</p>}
      </div>

      <div className="card"><h2>Nuevo cupón</h2><CouponForm packs={pk} /></div>

      {list.map((c) => (
        <div className="card" key={c.id}>
          <h2>{c.code} <span className="muted" style={{ fontSize: 14, fontWeight: 500 }}>{c.type === 'percent' ? `${c.value}%` : `USD ${c.value}`} · {c.uses} usos{c.max_uses ? ` de ${c.max_uses}` : ''}</span> {!c.active && <span className="pill perdido">Inactivo</span>}</h2>
          <CouponForm c={{ ...c, value: Number(c.value) }} packs={pk} />
          <form action={deleteCouponAction} style={{ marginTop: 10 }}><input type="hidden" name="id" value={c.id} /><button className="b b-danger" type="submit">Eliminar cupón</button></form>
        </div>
      ))}
    </>
  );
}
