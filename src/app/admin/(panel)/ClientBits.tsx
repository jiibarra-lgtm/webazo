'use client';
import { useState } from 'react';

/** Botón que pide confirmación antes de enviar el formulario. */
export function ConfirmButton({ children, message, className }: { children: React.ReactNode; message: string; className?: string }) {
  return (
    <button type="submit" className={className} onClick={(e) => { if (!window.confirm(message)) e.preventDefault(); }}>
      {children}
    </button>
  );
}

/** Campo de precio en USD que muestra al lado cuánto queda en pesos. */
export function PriceInput({ id, name, defaultValue, rate, required, placeholder }: { id: string; name: string; defaultValue?: number | null; rate: number; required?: boolean; placeholder?: string }) {
  const [v, setV] = useState(defaultValue == null ? '' : String(defaultValue));
  const n = Number(v.replace(',', '.'));
  const ars = Number.isFinite(n) && n > 0 ? Math.round((n * rate) / 100) * 100 : null;
  return (
    <div className="price-input">
      <span className="pi-prefix">USD</span>
      <input id={id} name={name} inputMode="decimal" value={v} onChange={(e) => setV(e.target.value)} required={required} placeholder={placeholder} />
      {ars != null && <span className="pi-ars">≈ $ {ars.toLocaleString('es-AR')}</span>}
    </div>
  );
}

/** Aviso que se cierra solo (lee ?ok= de la URL). */
export function Flash({ text }: { text: string }) {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div className="flash" role="status">
      <span>✓ {text}</span>
      <button type="button" onClick={() => setShow(false)} aria-label="Cerrar aviso">×</button>
    </div>
  );
}
