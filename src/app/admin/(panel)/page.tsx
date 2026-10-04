import { requireAdmin } from '@/lib/admin';
import { STATUS_LABEL, dateTime, usd } from '@/lib/format';
import type { CurrencyConfig, Lead, LaunchBanner, PopupConfig } from '@/lib/types';
import { DEFAULT_BANNER, DEFAULT_CURRENCY, DEFAULT_POPUP } from '@/lib/defaults';
import { toggleBanner, togglePopup } from '../actions';
import Toggle from './Toggle';

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

  const [{ data: leads30 }, { count: clicks30 }, { data: recent }, { data: allWon }, { count: claims30 }, { data: settings }, { data: coupons }, { data: packs }] = await Promise.all([
    supabase.from('leads').select('id, status, utm_campaign, utm_source, utm_content, rubro, pack, created_at').gte('created_at', since30),
    supabase.from('clicks').select('id', { count: 'exact', head: true }).gte('created_at', since30),
    supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(8),
    supabase.from('leads').select('value_usd').eq('status', 'ganado'),
    supabase.from('coupon_claims').select('id', { count: 'exact', head: true }).gte('created_at', since30),
    supabase.from('settings').select('key, value').in('key', ['popup', 'launch_banner', 'currency']),
    supabase.from('coupons').select('active, expires_at, max_uses, uses'),
    supabase.from('packs').select('active'),
  ]);
  const get = (k: string) => settings?.find((x) => x.key === k)?.value ?? {};
  const popup = { ...DEFAULT_POPUP, ...get('popup') } as PopupConfig;
  const banner = { ...DEFAULT_BANNER, ...get('launch_banner') } as LaunchBanner;
  const currency = { ...DEFAULT_CURRENCY, ...get('currency') } as CurrencyConfig;
  const activeCoupons = (coupons ?? []).filter((c) => c.active && !(c.expires_at && new Date(c.expires_at) < new Date()) && !(c.max_uses != null && c.uses >= c.max_uses)).length;
  const visiblePacks = (packs ?? []).filter((p) => p.active).length;
  const currencyLabel = currency.mode === 'ARS' ? 'Pesos' : currency.mode === 'BOTH' ? 'Dólares y pesos' : 'Dólares';

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

      <div className="card">
        <h2>Estado de la web</h2>
        <div className="status-grid">
          <div className="status">
            <h3>Popup de cupón</h3>
            <Toggle action={togglePopup} on={popup.enabled} field="enabled" labelOn="Mostrándose" labelOff="Apagado" />
            <p>Entrega {popup.coupon_code}</p>
            <a href="/admin/cupones">Editar popup</a>
          </div>
          <div className="status">
            <h3>Banner de lanzamiento</h3>
            <Toggle action={toggleBanner} on={banner.enabled} field="enabled" labelOn="Visible" labelOff="Oculto" />
            <p>{banner.text || 'Sin texto'}</p>
            <a href="/admin/packs">Editar banner</a>
          </div>
          <div className="status">
            <h3>Cupones activos</h3>
            <span className="big">{activeCoupons}</span>
            <a href="/admin/cupones">Ver cupones</a>
          </div>
          <div className="status">
            <h3>Packs visibles</h3>
            <span className="big">{visiblePacks}</span>
            <a href="/admin/packs">Ver packs</a>
          </div>
          <div className="status">
            <h3>Moneda</h3>
            <span className="big">{currencyLabel}</span>
            <p>Cotización: $ {Math.round(currency.rate).toLocaleString('es-AR')}{currency.source !== 'manual' ? ` (${currency.source})` : ''}</p>
            <a href="/admin/packs">Cambiar moneda</a>
          </div>
        </div>
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
