import { requireAdmin } from '@/lib/admin';
import { RUBROS } from '@/lib/rubros';
import type { Testimonial } from '@/lib/types';
import { deleteTestimonial, saveTestimonial } from '../../actions';

function TForm({ t }: { t?: Testimonial }) {
  const k = t?.id ?? 'new';
  return (
    <form action={saveTestimonial} className="form-grid">
      {t && <input type="hidden" name="id" value={t.id} />}
      <div className="f"><label htmlFor={`author-${k}`}>Nombre</label><input id={`author-${k}`} name="author" defaultValue={t?.author} required /></div>
      <div className="f"><label htmlFor={`business-${k}`}>Negocio</label><input id={`business-${k}`} name="business" defaultValue={t?.business ?? ''} /></div>
      <div className="f">
        <label htmlFor={`rubro-${k}`}>Rubro (para mostrarlo en su landing)</label>
        <select id={`rubro-${k}`} name="rubro" defaultValue={t?.rubro ?? ''}>
          <option value="">Todos</option>
          {RUBROS.map((r) => <option key={r.slug} value={r.name}>{r.name}</option>)}
        </select>
      </div>
      <div className="f"><label htmlFor={`order-${k}`}>Orden</label><input id={`order-${k}`} name="sort_order" inputMode="numeric" defaultValue={t?.sort_order ?? 0} /></div>
      <div className="f full"><label htmlFor={`quote-${k}`}>Testimonio</label><textarea id={`quote-${k}`} name="quote" defaultValue={t?.quote} required /></div>
      <label className="check"><input type="checkbox" name="active" defaultChecked={t ? t.active : true} /> Visible</label>
      <div className="actions-row full"><button className="b b-orange" type="submit">{t ? 'Guardar' : 'Agregar testimonio'}</button></div>
    </form>
  );
}

export default async function TestimoniosPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('testimonials').select('*').order('sort_order');
  const items = (data ?? []) as Testimonial[];
  return (
    <>
      <div className="adm-head"><div><h1>Testimonios</h1><p>Si no hay ninguno visible, la sección no aparece en la web.</p></div></div>
      <div className="card"><h2>Nuevo testimonio</h2><TForm /></div>
      {items.map((t) => (
        <div className="card" key={t.id}>
          <h2>{t.author}</h2>
          <TForm t={t} />
          <form action={deleteTestimonial} style={{ marginTop: 10 }}><input type="hidden" name="id" value={t.id} /><button className="b b-danger" type="submit">Eliminar</button></form>
        </div>
      ))}
    </>
  );
}
