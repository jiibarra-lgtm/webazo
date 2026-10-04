import { requireAdmin } from '@/lib/admin';
import type { Faq } from '@/lib/types';
import { deleteFaq, saveFaq } from '../../actions';

function FForm({ f }: { f?: Faq }) {
  const k = f?.id ?? 'new';
  return (
    <form action={saveFaq} className="form-grid">
      {f && <input type="hidden" name="id" value={f.id} />}
      <div className="f full"><label htmlFor={`q-${k}`}>Pregunta</label><input id={`q-${k}`} name="question" defaultValue={f?.question} required /></div>
      <div className="f full"><label htmlFor={`a-${k}`}>Respuesta</label><textarea id={`a-${k}`} name="answer" defaultValue={f?.answer} required /></div>
      <div className="f"><label htmlFor={`o-${k}`}>Orden</label><input id={`o-${k}`} name="sort_order" inputMode="numeric" defaultValue={f?.sort_order ?? 0} /></div>
      <label className="check" style={{ alignSelf: 'end' }}><input type="checkbox" name="active" defaultChecked={f ? f.active : true} /> Visible</label>
      <div className="actions-row full"><button className="b b-orange" type="submit">{f ? 'Guardar' : 'Agregar pregunta'}</button></div>
    </form>
  );
}

export default async function PreguntasPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('faqs').select('*').order('sort_order');
  const items = (data ?? []) as Faq[];
  return (
    <>
      <div className="adm-head"><div><h1>Preguntas frecuentes</h1><p>Aparecen en la home y en todas las landings por rubro.</p></div></div>
      {items.map((f) => (
        <div className="card" key={f.id}>
          <FForm f={f} />
          <form action={deleteFaq} style={{ marginTop: 10 }}><input type="hidden" name="id" value={f.id} /><button className="b b-danger" type="submit">Eliminar</button></form>
        </div>
      ))}
      <div className="card"><h2>Nueva pregunta</h2><FForm /></div>
    </>
  );
}
