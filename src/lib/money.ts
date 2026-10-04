import type { CurrencyConfig } from './types';

// Los precios se guardan en USD. Esto decide cómo se muestran en la web.

const usdFmt = (n: number) => `USD ${n.toLocaleString('es-AR', { maximumFractionDigits: 2 })}`;
const arsFmt = (n: number) => `$ ${Math.round(n).toLocaleString('es-AR')}`;

/** Redondea pesos a un número "lindo" (a la centena). */
export const toArs = (usd: number, c: CurrencyConfig) => Math.round((usd * c.rate) / 100) * 100;

/** Precio principal según la moneda elegida. */
export function money(usd: number, c: CurrencyConfig) {
  return c.mode === 'ARS' ? arsFmt(toArs(usd, c)) : usdFmt(usd);
}

/** Texto secundario cuando se muestran ambas monedas. */
export function moneyAlt(usd: number, c: CurrencyConfig) {
  return c.mode === 'BOTH' ? `≈ ${arsFmt(toArs(usd, c))}` : null;
}

/** Partes separadas para el número grande de los packs. */
export function moneyParts(usd: number, c: CurrencyConfig) {
  if (c.mode === 'ARS') return { symbol: '$', amount: toArs(usd, c).toLocaleString('es-AR') };
  return { symbol: 'USD', amount: usd.toLocaleString('es-AR', { maximumFractionDigits: 2 }) };
}

export function priceNote(c: CurrencyConfig) {
  if (c.mode === 'ARS') return 'Precios en pesos argentinos. Pueden actualizarse según la cotización del dólar.';
  if (c.mode === 'BOTH') return `Precios en dólares de referencia. En pesos, al valor de $ ${Math.round(c.rate).toLocaleString('es-AR')} por dólar.`;
  return 'Precios en dólares de referencia, pagables en pesos al valor del día.';
}

export const currencyCode = (c: CurrencyConfig) => (c.mode === 'ARS' ? 'ARS' : 'USD');
