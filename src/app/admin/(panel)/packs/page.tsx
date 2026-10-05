import { requireAdmin } from '@/lib/admin';
import { DEFAULT_BANNER, DEFAULT_CURRENCY, DEFAULT_MONTHLY } from '@/lib/defaults';
import { money, toArs } from '@/lib/money';
import type { CurrencyConfig, Extra, LaunchBanner, Monthly, Pack } from '@/lib/types';
import {
  deleteExtra, deletePack, duplicateExtra, duplicatePack, moveExtra, movePack, refreshRate,
  saveCurrency, saveExtra, savePack, saveSettings, toggleExtraAction, togglePack,
} from '../../actions';
import Toggle from '../Toggle';
import { ConfirmButton, Flash, PriceInput } from '../ClientBits';

type Props = { searchParams: Promise<{ tab?: string; ok?: string }> };
const TABS = [
  { id: 'packs', label: 'Packs' },
  { id: 'extras', label: 'Extras del carrito' },
  { id: 'moneda', label: 'Moneda y mantenimiento' },
];

function MoveButtons({ action, id, first, last }: { action: (fd: FormData) => Promise<void>; id: string; first: boolean; last: boolean }) {
  return (
    <div className="move">
      <form action={action}><input type="hidden" name="id" value={id} /><input type="hidden" name="dir" value="up" /><button className="b b-line icon" type="submit" disabled={first} aria-label="Subir">↑</button></form>
      <form action={action}><input type="hidden" name="id" value={id} /><input type="hidden" name="dir" value="down" /><button className="b b-line icon" type="submit" disabled={last} aria-label="Bajar">↓</button></form>
    </div>
  );
}

function PackForm({ p, rate }: { p?: Pack; rate: number }) {
  const k = p?.id ?? 'new';
  return (
    <form action={savePack} className="form-grid">
      {p && <input type="hidden" name="id" value={p.id} />}
      <div className="f"><label htmlFor={`name-${k}`}>Nombre</label><input id={`name-${k}`} name="name" defaultValue={p?.name} required /></div>
      <div className="f"><label htmlFor={`badge-${k}`}>Etiqueta (opcional)</label><input id={`badge-${k}`} name="badge" defaultValue={p?.badge ?? ''} placeholder="Ej: Más elegido, Nuevo, Recomendado" /></div>
      {!p && <div className="f"><label htmlFor={`slug-${k}`}>Identificador para la URL</label><input id={`slug-${k}`} name="slug" placeholder="ej: tienda-online" /></div>}
      <div className="f full"><label htmlFor={`tagline-${k}`}>Para quién es (una línea)</label><input id={`tagline-${k}`} name="tagline" defaultValue={p?.tagline ?? ''} placeholder="Ej: Para comercios que quieren verse serios y vender más." /></div>
      <div className="f"><label htmlFor={`price-${k}`}>Precio</label><PriceInput id={`price-${k}`} name="price_usd" defaultValue={p?.price_usd} rate={rate} required /></div>
      <div className="f"><label htmlFor={`before-${k}`}>Precio anterior (se muestra tachado)</label><PriceInput id={`before-${k}`} name="price_before_usd" defaultValue={p?.price_before_usd} rate={rate} placeholder="Opcional" /></div>
      <div className="f"><label htmlFor={`note-${k}`}>Nota del precio</label><input id={`note-${k}`} name="price_note" defaultValue={p?.price_note ?? ''} placeholder="Ej: Precio de lanzamiento" /></div>
      <div className="f"><label htmlFor={`cta-${k}`}>Texto del botón</label><input id={`cta-${k}`} name="cta_label" defaultValue={p?.cta_label ?? ''} placeholder={p ? `Quiero el ${p.name}` : 'Quiero este pack'} /></div>
      <div className="f full"><label htmlFor={`features-${k}`}>Qué incluye (una línea por ítem)</label><textarea id={`features-${k}`} name="features" defaultValue={p?.features.join('\n')} rows={5} placeholder={'Dominio .com.ar\nBotón de WhatsApp\nOnline en 72 hs'} /></div>
      <input type="hidden" name="sort_order" value={p?.sort_order ?? 0} />
      <div className="actions-row full">
        <label className="check"><input type="checkbox" name="featured" defaultChecked={p?.featured} /> Destacado (tarjeta oscura)</label>
        <label className="check"><input type="checkbox" name="active" defaultChecked={p ? p.active : true} /> Visible en la web</label>
      </div>
      <div className="actions-row full"><button className="b b-orange" type="submit">{p ? 'Guardar cambios' : 'Crear pack'}</button></div>
    </form>
  );
}

function ExtraForm({ e, rate }: { e?: Extra; rate: number }) {
  const k = e?.id ?? 'new';
  return (
    <form action={saveExtra} className="form-grid">
      {e && <input type="hidden" name="id" value={e.id} />}
      <div className="f"><label htmlFor={`en-${k}`}>Nombre</label><input id={`en-${k}`} name="name" defaultValue={e?.name} required /></div>
      <div className="f"><label htmlFor={`ep-${k}`}>Precio</label><PriceInput id={`ep-${k}`} name="price_usd" defaultValue={e?.price_usd} rate={rate} required /></div>
      <div className="f full"><label htmlFor={`ed-${k}`}>Descripción corta</label><input id={`ed-${k}`} name="description" defaultValue={e?.description ?? ''} /></div>
      <input type="hidden" name="sort_order" value={e?.sort_order ?? 99} />
      <label className="check"><input type="checkbox" name="active" defaultChecked={e ? e.active : true} /> Visible en el carrito</label>
      <div className="actions-row full"><button className="b b-orange" type="submit">{e ? 'Guardar cambios' : 'Agregar extra'}</button></div>
    </form>
  );
}

export default async function PacksPage({ searchParams }: Props) {
  const { tab = 'packs', ok } = await searchParams;
  const { supabase } = await requireAdmin();
  const since30 = new Date(Date.now() - 30 * 864e5).toISOString();
  const [{ data: packsData }, { data: settings }, { data: extrasData }, { data: leads }] = await Promise.all([
    supabase.from('packs').select('*').order('sort_order').order('created_at'),
    supabase.from('settings').select('*').in('key', ['monthly', 'launch_banner', 'currency']),
    supabase.from('extras').select('*').order('sort_order').order('created_at'),
    supabase.from('leads').select('pack, status, value_usd, final_usd, cart').gte('created_at', since30),
  ]);
  const get = (k: string) => settings?.find((s) => s.key === k)?.value ?? {};
  const monthly = { ...DEFAULT_MONTHLY, ...get('monthly') } as Monthly;
  const banner = { ...DEFAULT_BANNER, ...get('launch_banner') } as LaunchBanner;
  const currency = { ...DEFAULT_CURRENCY, ...get('currency') } as CurrencyConfig;
  const packs = ((packsData ?? []) as Pack[]).map((p) => ({ ...p, price_usd: Number(p.price_usd), price_before_usd: p.price_before_usd == null ? null : Number(p.price_before_usd) }));
  const extras = ((extrasData ?? []) as Extra[]).map((e) => ({ ...e, price_usd: Number(e.price_usd) }));
  type L = { pack: string | null; status: string; value_usd: number | null; final_usd: number | null; cart: { extras?: { slug: string }[] } | null };
  const L30 = (leads ?? []) as L[];
  const statsFor = (slug: string) => {
    const ls = L30.filter((l) => l.pack === slug);
    const won = ls.filter((l) => l.status === 'ganado');
    return { leads: ls.length, won: won.length, revenue: won.reduce((s, l) => s + Number(l.value_usd ?? l.final_usd ?? 0), 0) };
  };
  const extraCount = (slug: string) => L30.filter((l) => l.cart?.extras?.some((x) => x.slug === slug)).length;

  return (
    <>
      <div className="adm-head"><div><h1>Productos y precios</h1><p>Packs, extras del carrito, moneda y mantenimiento. Los cambios se ven en la web en segundos.</p></div></div>
      {ok && <Flash text={ok} />}

      <nav className="tabs" aria-label="Secciones">
        {TABS.map((t) => <a key={t.id} href={`/admin/packs?tab=${t.id}`} aria-current={tab === t.id ? 'page' : undefined}>{t.label}</a>)}
      </nav>

      {tab === 'packs' && (
        <>
          <div className="pack-cards">
            {packs.map((p, i) => {
              const st = statsFor(p.slug);
              return (
                <article key={p.id} className={`pcard ${p.featured ? 'feat' : ''} ${p.active ? '' : 'off'}`}>
                  <header>
                    <div>
                      <h2>{p.name}</h2>
                      {(p.badge || p.featured) && <span className="pill presupuesto">{p.badge || 'Destacado'}</span>}
                      {!p.active && <span className="pill perdido">Oculto</span>}
                    </div>
                    <MoveButtons action={movePack} id={p.id} first={i === 0} last={i === packs.length - 1} />
                  </header>
                  <p className="muted">{p.tagline}</p>
                  <div className="pc-price">
                    <strong>USD {p.price_usd}</strong>
                    {p.price_before_usd && <s>USD {p.price_before_usd}</s>}
                    <span className="muted">≈ $ {toArs(p.price_usd, currency).toLocaleString('es-AR')}</span>
                  </div>
                  <p className="muted small">En la web se ve: <b>{money(p.price_usd, currency)}</b> · {p.features.length} ítems incluidos</p>
                  <div className="pc-stats">
                    <div><b>{st.leads}</b><span>leads (30 d)</span></div>
                    <div><b>{st.won}</b><span>vendidos</span></div>
                    <div><b>USD {st.revenue}</b><span>facturado</span></div>
                  </div>
                  <div className="pc-actions">
                    <Toggle action={togglePack} on={p.active} field="active" id={p.id} labelOn="Visible" labelOff="Oculto" />
                    <form action={duplicatePack}><input type="hidden" name="id" value={p.id} /><button className="b b-line" type="submit">Duplicar</button></form>
                    <form action={deletePack}><input type="hidden" name="id" value={p.id} /><ConfirmButton className="b b-danger" message={`¿Eliminar el pack "${p.name}"? No se puede deshacer.`}>Eliminar</ConfirmButton></form>
                  </div>
                  <details className="pc-edit">
                    <summary>Editar pack</summary>
                    <PackForm p={p} rate={currency.rate} />
                  </details>
                </article>
              );
            })}
          </div>
          <details className="card new-item">
            <summary><span>+ Crear pack nuevo</span></summary>
            <PackForm rate={currency.rate} />
          </details>
        </>
      )}

      {tab === 'extras' && (
        <>
          <p className="muted" style={{ marginBottom: 14 }}>Servicios que el cliente suma a su pack desde el carrito. Solo se muestran los visibles.</p>
          <div className="card" style={{ padding: 0 }}>
            {extras.length ? extras.map((e, i) => (
              <div key={e.id} className={`xrow ${e.active ? '' : 'off'}`}>
                <div className="xmain">
                  <MoveButtons action={moveExtra} id={e.id} first={i === 0} last={i === extras.length - 1} />
                  <div>
                    <strong>{e.name}</strong> {!e.active && <span className="pill perdido">Oculto</span>}
                    <div className="muted small">{e.description}</div>
                  </div>
                  <div className="xprice"><b>USD {e.price_usd}</b><span className="muted small">≈ $ {toArs(e.price_usd, currency).toLocaleString('es-AR')}</span></div>
                  <div className="muted small xcount">{extraCount(e.slug)} en carritos (30 d)</div>
                  <div className="pc-actions">
                    <Toggle action={toggleExtraAction} on={e.active} field="active" id={e.id} labelOn="Visible" labelOff="Oculto" />
                    <form action={duplicateExtra}><input type="hidden" name="id" value={e.id} /><button className="b b-line" type="submit">Duplicar</button></form>
                    <form action={deleteExtra}><input type="hidden" name="id" value={e.id} /><ConfirmButton className="b b-danger" message={`¿Eliminar "${e.name}"?`}>Eliminar</ConfirmButton></form>
                  </div>
                </div>
                <details className="pc-edit"><summary>Editar</summary><ExtraForm e={e} rate={currency.rate} /></details>
              </div>
            )) : <p className="empty">Todavía no hay extras.</p>}
          </div>
          <details className="card new-item">
            <summary><span>+ Agregar extra nuevo</span></summary>
            <ExtraForm rate={currency.rate} />
          </details>
        </>
      )}

      {tab === 'moneda' && (
        <>
          <div className="card">
            <h2>Moneda de la web</h2>
            <form action={saveCurrency} className="form-grid">
              <fieldset className="f full" style={{ border: 'none', padding: 0, margin: 0 }}>
                <legend style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>Mostrar precios en</legend>
                <div className="radio-row">
                  <label><input type="radio" name="mode" value="USD" defaultChecked={currency.mode === 'USD'} /> Dólares (USD 80)</label>
                  <label><input type="radio" name="mode" value="ARS" defaultChecked={currency.mode === 'ARS'} /> Pesos ($ {toArs(80, currency).toLocaleString('es-AR')})</label>
                  <label><input type="radio" name="mode" value="BOTH" defaultChecked={currency.mode === 'BOTH'} /> Ambos</label>
                </div>
              </fieldset>
              <div className="f"><label htmlFor="rate">Cotización (pesos por dólar)</label><input id="rate" name="rate" inputMode="decimal" defaultValue={currency.rate} /></div>
              <div className="f">
                <label htmlFor="source">Tipo de dólar</label>
                <select id="source" name="source" defaultValue={currency.source}>
                  <option value="manual">Manual</option><option value="oficial">Oficial</option><option value="blue">Blue</option>
                </select>
              </div>
              <div className="actions-row full">
                <button className="b b-orange" type="submit">Guardar moneda</button>
                {currency.updated_at && <span className="muted">Última actualización: {new Date(currency.updated_at).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</span>}
              </div>
            </form>
            <form action={refreshRate} className="actions-row" style={{ marginTop: 12 }}>
              <select name="source" defaultValue={currency.source === 'blue' ? 'blue' : 'oficial'} className="b b-line" aria-label="Tipo de dólar a consultar">
                <option value="oficial">Dólar oficial</option><option value="blue">Dólar blue</option>
              </select>
              <button className="b b-dark" type="submit">Traer cotización de hoy</button>
              <span className="muted">Valor de venta de dolarapi.com.</span>
            </form>
          </div>
          <div className="card">
            <h2>Mantenimiento mensual y banner</h2>
            <form action={saveSettings} className="form-grid">
              <div className="f"><label htmlFor="monthly_title">Título</label><input id="monthly_title" name="monthly_title" defaultValue={monthly.title} /></div>
              <div className="f"><label htmlFor="monthly_price">Precio por mes</label><PriceInput id="monthly_price" name="monthly_price" defaultValue={monthly.price_usd} rate={currency.rate} /></div>
              <div className="f full"><label htmlFor="monthly_description">Descripción</label><textarea id="monthly_description" name="monthly_description" defaultValue={monthly.description} /></div>
              <div className="f full"><label htmlFor="banner_text">Texto del banner superior</label><input id="banner_text" name="banner_text" defaultValue={banner.text} /></div>
              <label className="check full"><input type="checkbox" name="banner_enabled" defaultChecked={banner.enabled} /> Mostrar banner</label>
              <div className="actions-row full"><button className="b b-orange" type="submit">Guardar</button></div>
            </form>
          </div>
        </>
      )}
    </>
  );
}
