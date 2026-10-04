export const usd = (n: number | null | undefined) =>
  n == null ? '—' : `USD ${Number(n).toLocaleString('es-AR', { maximumFractionDigits: 2 })}`;

export const dateTime = (iso: string) =>
  new Date(iso).toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires',
  });

export const STATUS_LABEL: Record<string, string> = {
  nuevo: 'Nuevo', contactado: 'Contactado', presupuesto: 'Presupuesto enviado', ganado: 'Ganado', perdido: 'Perdido',
};
