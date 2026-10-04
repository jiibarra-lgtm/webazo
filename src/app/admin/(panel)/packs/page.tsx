import { requireAdmin } from '@/lib/admin';
import { DEFAULT_BANNER, DEFAULT_MONTHLY } from '@/lib/defaults';
import type { LaunchBanner, Monthly, Pack } from '@/lib/types';
import { deletePack, savePack, saveSettings } from '../../actions';

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
  const [{ data: packs }, { data: settings }] = await Promise.all([
    supabase.from('packs').select('*').order('sort_order'),
    supabase.from('settings').select('*').in('key', ['monthly', 'launch_banner']),
  ]);
  const monthly = { ...DEFAULT_MONTHLY, ...(settings?.find((s) => s.key === 'monthly')?.value ?? {}) } as Monthly;
  const banner = { ...DEFAULT_BANNER, ...(settings?.find((s) => s.key === 'launch_banner')?.value ?? {}) } as LaunchBanner;

  return (
    <>
      <div className="adm-head"><div><h1>Packs y precios</h1><p>Los cambios se ven en la web en unos segundos.</p></div></div>

      {(packs as Pack[] | null)?.map((p) => (
        <div className="card" key={p.id}>
          <h2>{p.name} {!p.active && <span className="pill perdido">Oculto</span>}</h2>
          <PackForm p={{ ...p, price_usd: Number(p.price_usd), price_before_usd: p.price_before_usd == null ? null : Number(p.price_before_usd) }} />
          <form action={deletePack} style={{ marginTop: 10 }}>
            <input type="hidden" name="id" value={p.id} />
            <button className="b b-danger" type="submit">Eliminar pack</button>
          </form>
        </div>
      ))}

      <div className="card"><h2>Nuevo pack</h2><PackForm /></div>

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
