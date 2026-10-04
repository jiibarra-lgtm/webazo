type Props = {
  action: (fd: FormData) => Promise<void>;
  on: boolean;
  field: string;            // nombre del campo booleano que espera la acción
  id?: string;
  labelOn?: string;
  labelOff?: string;
};

/** Interruptor de un clic (formulario con server action). */
export default function Toggle({ action, on, field, id, labelOn = 'Activo', labelOff = 'Inactivo' }: Props) {
  return (
    <form action={action} style={{ display: 'inline-flex' }}>
      {id && <input type="hidden" name="id" value={id} />}
      <input type="hidden" name={field} value={on ? 'false' : 'true'} />
      <button type="submit" className={`switch ${on ? 'on' : ''}`} aria-pressed={on} aria-label={on ? `${labelOn}. Tocá para desactivar` : `${labelOff}. Tocá para activar`}>
        <span className="knob" aria-hidden="true" />
        <span>{on ? labelOn : labelOff}</span>
      </button>
    </form>
  );
}
