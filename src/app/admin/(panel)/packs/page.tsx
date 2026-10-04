import { requireAdmin } from '@/lib/admin';
import { DEFAULT_BANNER, DEFAULT_CURRENCY, DEFAULT_MONTHLY } from '@/lib/defaults';
import { money, toArs } from '@/lib/money';
import Toggle from '../Toggle';
import type { CurrencyConfig, Extra, LaunchBanner, Monthly, Pack } from '@/lib/types';
import { deleteExtra, deletePack, refreshRate, saveCurrency, saveExtra, savePack, saveSettings, toggleExtraAction, togglePack } from '../../actions';

function PackForm({ p }: { p?: Pack }) {
  const k = p?.id ?? 'new';
  return (
    <form action={savePack} className="form-grid">
      {p && <input type="hidden" name="id" value={p.id} />}
      <div className="f"><label htmlFor={`name-${k}`}>Nombre</label><input id={`name-${k}`} name="name" defaultValue={p?.name} required /></div>
      {!p && <div className="f"><label htmlFor={`slug-${k}`}>Identificador (URL)</label><input id={`slug-${k}`} name="slug" placeholder="ej: tienda" /></div>}
      <div className="f full"><label htmlFor={`tagline-${k}`}>Para quién es</label><input id={`tagline-${k}`} name="tagline" defaultValue={p?.tagline ?? ''} /></div>
      <div className="f"><label htmlFor={`price-${k}`}>Precio (USD)</label><input id={`price-${k}`} name="price_usd" inputMode="decimal" defaultValue={p?.price_usd} required /></div>
      <div className="f"><label htmlFor={`before-${k}`}>Precio anterior tachado (USD)</label><input id={`before-${k}`} name="price_before_usd" inputMode="decimal" defaultValue={p?.price_before_usd ?? ''} placeholder="Opcional" /></div>
      <div className="f"><label htmlFor={`note-${k}`}>Nota del precio</label><input id={`note-${k}`} name="price_note" defaultValue={p?.price_note ?? ''} placeholder="Ej: Precio de lanzamiento" /></div>
      <div className="f"><label htmlFor={`cta-${k}`}>Texto del botón</label><input id={`cta-${k}`} name="cta_label" defaultValue={p?.cta_label ?? ''} /></div>
      <div className="f full"><label htmlFor={`features-${k}`}>Qué incluye (una línea por ítem)</label><textarea id={`features-${k}`} name="features" defaultValue={p?.features.join('\n')} rows={5} /></div>
      <div className="f"><label htmlFor={`order-${k}`}>Orden</label><input id={`order-${k}`} name="sort_order" inputMode="numeric" defaultValue={p?.sort_order ?? 0} /></div>
      <div className="actions-row" style={{ alignSelf: 'end' }}>
        <label className="check"><input type="checkbox" name="featured" defaultChecked={p?.featured} /> Destacado</label>
        <label className="check"><input type="checkbox" name="active" defaultChecked={p ? p.active : true} /> Visible</label>
      </div>
      <div className="actions-row full"><button className="b b-orange" type="submit">{p ? 'Guardar' : 'Crear pack'}</button></div>
    </form>
  );
}

export default async function PacksPage() {
  const { supabase } = await requireAdmin();
  const [{ data: packs }, { data: settings }, { data: extrasData }] = await Promise.all([
    supabase.from('packs').select('*').order('sort_order'),
    supabase.from('settings').select('*').in('key', ['monthly', 'launch_banner', 'currency']),
    supabase.from('extras').select('*').order('sort_order'),
  ]);
  const extras = ((extrasData ?? []) as Extra[]).map((e) => ({ ...e, price_usd: Number(e.price_usd) }));
  const monthly = { ...DEFAULT_MONTHLY, ...(settings?.find((s) => s.key === 'monthly')?.value ?? {}) } as Monthly;
  const banner = { ...DEFAULT_BANNER, ...(settings?.find((s) => s.key === 'launch_banner')?.value ?? {}) } as LaunchBanner;
  const currency = { ...DEFAULT_CURRENCY, ...(settings?.find((s) => s.key === 'currency')?.value ?? {}) } as CurrencyConfig;
  const list = ((packs ?? []) as Pack[]).map((p) => ({ ...p, price_usd: Number(p.price_usd), price_before_usd: p.price_before_usd == null ? null : Number(p.price_before_usd) }));

  return (
    <>
      <div className="adm-head"><div><h1>Packs y precios</h1><p>Los precios se cargan en dólares. Elegí abajo cómo se muestran en la web.</p></div></div>

      <div className="card">
        <h2>Moneda de la web</h2>
        <form action={saveCurrency} className="form-grid">
          <fieldset className="f full" style={{ border: 'none', padding: 0, margin: 0 }}>
            <legend style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>Mostrar precios en</legend>
            <div className="radio-row">
              <label><input type="radio" name="mode" value="USD" defaultChecked={currency.mode === 'USD'} /> Dólares (USD 80)</label>
              <label><input type="radio" name="mode" value="ARS" defaultChecked={currency.mode === 'ARS'} /> Pesos ($ 96.000)</label>
              <label><input type="radio" name="mode" value="BOTH" defaultChecked={currency.mode === 'BOTH'} /> Ambos (USD 80 ≈ $ 96.000)</label>
            </div>
          </fieldset>
          <div className="f"><label htmlFor="rate">Cotización (pesos por dólar)</label><input id="rate" name="rate" inputMode="decimal" defaultValue={currency.rate} /></div>
          <div className="f">
            <label htmlFor="source">Tipo de dólar</label>
            <select id="source" name="source" defaultValue={currency.source}>
              <option value="manual">Manual</option>
              <option value="oficial">Oficial</option>
              <option value="blue">Blue</option>
            </select>
          </div>
          <div className="actions-row full">
            <button className="b b-orange" type="submit">Guardar moneda</button>
            {currency.updated_at && <span className="muted">Última actualización: {new Date(currency.updated_at).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</span>}
          </div>
        </form>
        <form action={refreshRate} className="actions-row" style={{ marginTop: 12 }}>
          <select name="source" defaultValue={currency.source === 'blue' ? 'blue' : 'oficial'} className="b b-line" aria-label="Tipo de dólar a consultar">
            <option value="oficial">Dólar oficial</option>
            <option value="blue">Dólar blue</option>
          </select>
          <button className="b b-dark" type="submit">Traer cotización de hoy</button>
          <span className="muted">Usa el valor de venta de dolarapi.com.</span>
        </form>
      </div>

      <div className="card">
        <h2>Resumen de packs</h2>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Pack</th><th>Precio USD</th><th>En pesos</th><th>Así se ve en la web</th><th>Visible</th></tr></thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong>{p.featured && <div className="muted">Destacado</div>}</td>
                  <td>USD {p.price_usd}</td>
                  <td>$ {toArs(p.price_usd, currency).toLocaleString('es-AR')}</td>
                  <td>{money(p.price_usd, currency)}{currency.mode === 'BOTH' && <div className="muted">≈ $ {toArs(p.price_usd, currency).toLocaleString('es-AR')}</div>}</td>
                  <td><Toggle action={togglePack} on={p.active} field="active" id={p.id} labelOn="Visible" labelOff="Oculto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {list.map((p) => (
        <div className="card" key={p.id}>
          <h2>{p.name} {!p.active && <span className="pill perdido">Oculto</span>}</h2>
          <PackForm p={p} />
          <form action={deletePack} style={{ marginTop: 10 }}>
            <input type="hidden" name="id" value={p.id} />
            <button className="b b-danger" type="submit">Eliminar pack</button>
          </form>
        </div>
      ))}

      <div className="card"><h2>Nuevo pack</h2><PackForm /></div>

      <div className="card">
        <h2>Extras del carrito</h2>
        <p className="muted" style={{ marginBottom: 14 }}>Servicios que el cliente puede sumar a su pack desde el carrito. Solo se muestran los activos.</p>
        {extras.map((e) => (
          <div key={e.id} style={{ borderTop: '1px solid var(--line)', padding: '14px 0' }}>
            <form action={saveExtra} className="form-grid">
              <input type="hidden" name="id" value={e.id} />
              <div className="f"><label htmlFor={`en-${e.id}`}>Nombre</label><input id={`en-${e.id}`} name="name" defaultValue={e.name} /></div>
              <div className="f"><label htmlFor={`ep-${e.id}`}>Precio (USD)</label><input id={`ep-${e.id}`} name="price_usd" inputMode="decimal" defaultValue={e.price_usd} /></div>
              <div className="f full"><label htmlFor={`ed-${e.id}`}>Descripción</label><input id={`ed-${e.id}`} name="description" defaultValue={e.description ?? ''} /></div>
              <div className="f"><label htmlFor={`eo-${e.id}`}>Orden</label><input id={`eo-${e.id}`} name="sort_order" inputMode="numeric" defaultValue={e.sort_order} /></div>
              <label className="check" style={{ alignSelf: 'end' }}><input type="checkbox" name="active" defaultChecked={e.active} /> Visible en el carrito</label>
              <div className="actions-row full"><button className="b b-orange" type="submit">Guardar</button></div>
            </form>
            <div className="actions-row" style={{ marginTop: 8 }}>
              <Toggle action={toggleExtraAction} on={e.active} field="active" id={e.id} labelOn="Visible" labelOff="Oculto" />
              <form action={deleteExtra}><input type="hidden" name="id" value={e.id} /><button className="b b-danger" type="submit">Eliminar</button></form>
            </div>
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}>
          <h3 style={{ fontSize: 16, marginBottom: 10 }}>Nuevo extra</h3>
          <form action={saveExtra} className="form-grid">
            <div className="f"><label htmlFor="en-new">Nombre</label><input id="en-new" name="name" required /></div>
            <div className="f"><label htmlFor="ep-new">Precio (USD)</label><input id="ep-new" name="price_usd" inputMode="decimal" required /></div>
            <div className="f full"><label htmlFor="ed-new">Descripción</label><input id="ed-new" name="description" /></div>
            <div className="f"><label htmlFor="eo-new">Orden</label><input id="eo-new" name="sort_order" inputMode="numeric" defaultValue={extras.length + 1} /></div>
            <label className="check" style={{ alignSelf: 'end' }}><input type="checkbox" name="active" defaultChecked /> Visible en el carrito</label>
            <div className="actions-row full"><button className="b b-orange" type="submit">Agregar extra</button></div>
          </form>
        </div>
      </div>

      <div className="card">
        <h2>Mantenimiento mensual y banner</h2>
        <form action={saveSettings} className="form-grid">
          <div className="f"><label htmlFor="monthly_title">Título</label><input id="monthly_title" name="monthly_title" defaultValue={monthly.title} /></div>
          <div className="f"><label htmlFor="monthly_price">Precio por mes (USD)</label><input id="monthly_price" name="monthly_price" inputMode="decimal" defaultValue={monthly.price_usd} /></div>
          <div className="f full"><label htmlFor="monthly_description">Descripción</label><textarea id="monthly_description" name="monthly_description" defaultValue={monthly.description} /></div>
          <div className="f full"><label htmlFor="banner_text">Texto del banner superior</label><input id="banner_text" name="banner_text" defaultValue={banner.text} /></div>
          <label className="check full"><input type="checkbox" name="banner_enabled" defaultChecked={banner.enabled} /> Mostrar banner</label>
          <div className="actions-row full"><button className="b b-orange" type="submit">Guardar</button></div>
        </form>
      </div>
    </>
  );
}
