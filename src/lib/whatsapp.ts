import { env } from './env';

export function whatsappUrl(message: string, phone: string = env.whatsapp) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** Normaliza un teléfono argentino a formato wa.me (549 + área + número). */
export function toWaPhone(raw: string) {
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('54')) d = d.slice(2);
  if (d.startsWith('9')) d = d.slice(1);
  if (d.startsWith('0')) d = d.slice(1);
  // quita el 15 después del código de área (ej: 11 15 xxxx xxxx)
  d = d.replace(/^(11|2\d{2}|3\d{2})15(\d{6,8})$/, '$1$2');
  return `549${d}`;
}
