'use client';
import { useState } from 'react';
import type { DemoData } from '@/lib/rubros';

const TURNOS_DEFAULT: DemoData = { biz: 'Barbería Norte', items: [{ name: 'Corte', meta: '30 min' }, { name: 'Corte + barba', meta: '45 min' }, { name: 'Perfilado de barba', meta: '20 min' }] };

export function TurnosDemo({ data = TURNOS_DEFAULT }: { data?: DemoData }) {
  const slots = ['10:00', '11:30', '13:00', '15:30', '17:00', '18:30'];
  const [svc, setSvc] = useState(data.items[0]?.name ?? '');
  const [slot, setSlot] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  return (
    <div className="screen">
      <span className="biz">{data.biz}</span>
      <span className="label">Elegí el servicio</span>
      <div className="opt-list" role="group" aria-label="Servicios">
        {data.items.map((s) => (
          <button key={s.name} type="button" aria-pressed={svc === s.name} onClick={() => setSvc(s.name)}>
            <span>{s.name}</span><span>{s.meta}</span>
          </button>
        ))}
      </div>
      <span className="label">Elegí horario</span>
      <div className="slots" role="group" aria-label="Horarios">
        {slots.map((h) => <button key={h} type="button" aria-pressed={slot === h} onClick={() => setSlot(h)}>{h}</button>)}
      </div>
      {done ? (
        <div className="demo-done" role="status">
          <strong>Turno reservado</strong>
          <span>{svc} a las {slot} hs</span>
          <button type="button" onClick={() => { setDone(false); setSlot(null); }}>Probar de nuevo</button>
        </div>
      ) : (
        <button type="button" className="demo-cta" disabled={!slot} onClick={() => setDone(true)}>
          {slot ? `Confirmar turno ${slot}` : 'Elegí un horario'}
        </button>
      )}
    </div>
  );
}

export function ServiciosDemo({ data }: { data: DemoData }) {
  const [picked, setPicked] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  return (
    <div className="screen">
      <span className="biz">{data.biz}</span>
      {data.subtitle && <span className="label">{data.subtitle}</span>}
      <span className="label">¿Qué necesitás?</span>
      <div className="opt-list" role="group" aria-label="Servicios">
        {data.items.map((s) => (
          <button key={s.name} type="button" aria-pressed={picked === s.name} onClick={() => setPicked(s.name)}>
            <span>{s.name}</span><span>{s.meta}</span>
          </button>
        ))}
      </div>
      {done ? (
        <div className="demo-done" role="status">
          <strong>Mensaje listo</strong>
          <span>“Hola! Quiero consultar por {picked?.toLowerCase()}”</span>
          <button type="button" onClick={() => { setDone(false); setPicked(null); }}>Probar de nuevo</button>
        </div>
      ) : (
        <button type="button" className="demo-cta" disabled={!picked} onClick={() => setDone(true)}>
          {picked ? 'Consultar por WhatsApp' : 'Elegí una opción'}
        </button>
      )}
    </div>
  );
}

export function CatalogoDemo({ data }: { data: DemoData }) {
  const [qty, setQty] = useState<Record<string, number>>(() =>
    Object.fromEntries(data.items.map((it, i) => [it.name, i === 0 ? 2 : i === 2 ? 1 : 0])),
  );
  const [done, setDone] = useState(false);
  const count = Object.values(qty).filter((n) => n > 0).length;
  const change = (k: string, d: number) => setQty((q) => ({ ...q, [k]: Math.max(0, (q[k] ?? 0) + d) }));
  return (
    <div className="screen">
      <span className="biz">{data.biz}</span>
      {data.subtitle && <span className="label">{data.subtitle}</span>}
      <div>
        {data.items.map((it) => (
          <div className="prod" key={it.name}>
            <div><strong>{it.name}</strong><span>{it.meta}</span></div>
            <div className="qty">
              <button type="button" aria-label={`Restar ${it.name}`} onClick={() => change(it.name, -1)}>−</button>
              <output aria-live="polite">{qty[it.name]}</output>
              <button type="button" className="plus" aria-label={`Sumar ${it.name}`} onClick={() => change(it.name, 1)}>+</button>
            </div>
          </div>
        ))}
      </div>
      {done ? (
        <div className="demo-done" role="status">
          <strong>Pedido enviado</strong>
          <span>{count} productos. Te respondemos enseguida.</span>
          <button type="button" onClick={() => setDone(false)}>Probar de nuevo</button>
        </div>
      ) : (
        <button type="button" className="demo-cta" disabled={count === 0} onClick={() => setDone(true)}>
          {count ? `Enviar pedido (${count})` : 'Elegí productos'}
        </button>
      )}
    </div>
  );
}

export function DemoPhone({ kind, caption, data }: { kind: 'turnos' | 'servicios' | 'catalogo'; caption: string; data?: DemoData }) {
  return (
    <div className="demo">
      <div className="phone">
        {kind === 'turnos' && <TurnosDemo data={data} />}
        {kind === 'servicios' && data && <ServiciosDemo data={data} />}
        {kind === 'catalogo' && data && <CatalogoDemo data={data} />}
      </div>
      <p className="demo-caption">{caption}</p>
    </div>
  );
}
