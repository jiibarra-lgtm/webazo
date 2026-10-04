import type { Metadata } from 'next';
import { Footer, Header } from '@/components/SiteChrome';

export const metadata: Metadata = { title: 'Términos del servicio | Webazo', alternates: { canonical: '/terminos' } };

export default function Terminos() {
  return (
    <>
      <Header base="/" />
      <main className="simple">
        <div className="wrap prose">
          <h1>Términos del servicio</h1>
          <h2>Alcance</h2>
          <p>Cada pack incluye lo detallado en su descripción. Cualquier funcionalidad extra se presupuesta aparte antes de empezar.</p>
          <h2>Plazos</h2>
          <p>El plazo de entrega corre desde que recibimos el pago inicial y todo el material necesario (logo, textos, fotos).</p>
          <h2>Cambios</h2>
          <p>Cada proyecto incluye dos rondas de cambios antes de la entrega. Los cambios posteriores se cubren con el mantenimiento mensual.</p>
          <h2>Pagos</h2>
          <p>50% al confirmar y 50% contra entrega. Precios expresados en dólares de referencia, pagables en pesos al tipo de cambio del día.</p>
          <h2>Dominio y propiedad</h2>
          <p>El dominio se registra a nombre del cliente. El hosting y el mantenimiento están incluidos mientras el abono mensual esté al día.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
